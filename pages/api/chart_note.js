import nextConnect from "next-connect";
import db_middleware from "middleware/database"
import { INTERPRETATION_LAYER_CHART_NOTES } from "constants/feature_flags"
import generateFeatureFlagFunction from "utils/generateFeatureFlagFunction"
import token_gated_auth from "middleware/token_gated_auth"
import rateLimit from "utils/rate-limit"
import {
    verifyAccessToken,
    queryAccessControl
} from "@stakenow/siwt"
import _ from "lodash"
import { ObjectId } from "mongodb"

require("dotenv").config()

const BETA_ACCESS_TOKEN_CONTRACT = process.env.BETA_ACCESS_TOKEN_CONTRACT


const limiter = rateLimit({
    interval: 60 * 1000 * 60,
    uniqueTokenPerInterval: 500
})

const handler = nextConnect()

handler.use(db_middleware)
handler.use(
    generateFeatureFlagFunction(
        INTERPRETATION_LAYER_CHART_NOTES
    )
)
// handler.use(token_gated_auth)

async function checkBetaAccess(req) {
    // Check if has access to beta token
    console.log("checking if user has beta access")
    try {
        const accessToken = req.headers.authorization.split(" ")[1]
        const pkh = verifyAccessToken(accessToken)
        console.log("accessToken: ", accessToken)
        if(pkh) {
            const beta_access = await queryAccessControl({
                contractAddress: BETA_ACCESS_TOKEN_CONTRACT,
                network: "mainnet",
                parameters: {
                    pkh,
                },
                test: {
                    comparator: ">=",
                    value: 1
                }
            })
            if(beta_access.tokens.length > 0) {
                console.log("User has beta access")
            }
        } else {
            res.status(403).send("Forbidden")
            return false
        }
    } catch (e) {
        console.log("Authentication error: ", e)
        res.status(403).send("Forbidden")
        return false
    }
    return true
}


handler.get(async (req, res) => {
    const db = req.db

    if(req.query.id) {
        // TODO: Return chart note with id

        
    } else if(req.query.chart_id) {
        // TODO: Return all chart notes for chart_id
        var chart_id = req.query.chart_id

        console.log("Getting notes for: ", chart_id)

        const collection = db.collection("chart_notes")

        var notes = await collection.find({ 
            chartId: chart_id,
            deleted: false
        }).toArray()

        console.log(`Found ${notes.length} notes for chart ${chart_id}`)

        res.status(200).json(notes)
        return

    } else {
        // 
        res.status(404).json({message: "No id or chart_id passed."})
    }
    
})

handler.post(async (req, res) => {

    var hasBetaAccess = await checkBetaAccess(req, res)
    if (hasBetaAccess === false) return 

    const db = req.db
    const collection = db.collection("chart_notes")

    console.log("chart note post: ")
    let data = req.body
    if(_.isString(data)) {
        data = JSON.parse(data)
    }
    

    console.log("parsed body data: ")

    const accountAddress = _.get(data, "accountAddress", false)
    const betaAccessContract = _.get(data, "betaAccessContract", false)
    const betaAccessToken = _.get(data, "betaAccessToken", false)
    const note = _.get(data, "note", false)

    const noteId = _.get(note, "id", false)
    const noteText = _.get(note, "note", false)
    const chartId = _.get(note, "chartId", false)
    const noteDate = _.get(note, "date", false)
    const owner = _.get(note, "owner", false)

    console.log("Checking if note with id: ", noteId, " exists.")

    var noteExists = false
    
    try {

        // check if noteId is a valid mongodb ObjectId
        // if so, check if it exists in the db
        if(_.isString(noteId)) {
            if(ObjectId.isValid(noteId)) {
                var existingNote = await collection.findOne({
                    _id: new ObjectId(noteId)
                })
            
                console.log("Existing note: ", existingNote)
        
                if(_.has(existingNote, "_id")) {
                    noteExists = true
                }
            } else {
                console.log("Note id is not a valid ObjectId, creating new note.")
            }
            
        }
        
    } catch(err) {
        console.log("error checking note exists: ", err)

        res.status(500).json({message: "Error in storing note"})
        return
    }

    console.log("Note exists: ", noteExists)

    // Rate limit

    var passedRateLimit = false
    console.log("checking rate limiter")

    try {
        await limiter.check(res, 100, "NEW_CHART_NOTE")
        passedRateLimit = true
    } catch(err) {
        console.log("rate limit error on new chart note creation: ", err)

        res.status(429).json({ message: "Too many requests" })
        return
    }

    console.log("All checks passed, inserting new chart note.")

    if (noteExists) {
        console.log("Note exists, updating text.")
        if(!_.isString(noteText)) {
            res.status(400).json({message: "Note text is not a string."})
            return
        } else if (noteText.length === 0) {
            res.status(400).json({message: "Note text is empty."})
            return
        }
        try {
            console.log("Updating to text: ", noteText)
            const result = await collection.updateOne({
                    _id: new ObjectId(noteId)
                },
                {
                    $set: {
                        note: noteText,
                        chartId: chartId,
                        updatedAt: new Date()
                    }
                })
        } catch(err) {
            console.log("error updating chart note: ", err)
            res.status(500).json({message: "Error updating chart note."})
            return
        }
    } else {
        console.log("Inserting new note")
        try {
            const result = await collection.insertOne({
                note: noteText,
                date: noteDate,
                chartId: chartId,
                owner,
                accountAddress: accountAddress,
                betaAccessContract: betaAccessContract,
                betaAccessToken: betaAccessToken,
                deleted: false,
                createdAt: new Date(),
                updatedAt: new Date()
            })

            console.log("Inserted new chart note, returning result.")
            res.status(200).json(result)
            return
        } catch(err) {
            console.log("Error storing note in db")
            console.log(err)
            res.status(500).json({ message: "Error storing note in db" })
            return
        }
        
        
    }
    
})



handler.delete(async (req, res) => {

    
    const db = req.db
    const collection = db.collection("chart_notes")
    const note_id = req.query.note_id

    console.log("delete note requested for: ", note_id)

    var hasBetaAccess = await checkBetaAccess(req, res)
    if (hasBetaAccess === false) return 

    const accessToken = req.headers.authorization.split(" ")[1]
    const pkh = verifyAccessToken(accessToken)

    console.log("user account address: ", pkh)

    // Todo: Check if is owner of note

    const note = await collection.findOne({ _id: new ObjectId(note_id) })
    console.log(note)

    if(_.get(note, "owner", "owner-not-set") === pkh) {
        console.log("User is owner of note, deleting.")
        try {
            const result = await collection.updateOne({
                _id: new ObjectId(note_id)
            },
            {
                $set: {
                    deleted: true
                }
            })
        } catch(err) {
            console.log("error deleting chart note: ", err)
            res.status(500).json({message: "Error deleting chart note."})
            return
        }
    } else {
        console.log("User is not owner of note, not deleting.")
        res.status(403).json({message: "User is not owner of note, not deleting."})
        return
    }
    
    res.status(200).json({message: "Note deleted."})
})

export default handler