import { connectToDatabase } from "utils/mongo_db"
import {
    storeLog
} from "utils/interactionLogging"
import _ from "lodash"

var logKeys = [
    "domain",
    "action",
    "value",
    "session_id",
    "category",
    "ts"
]
export default async function handler(req, res) {
    if(req.method !== "POST") {
        res.status(405).send({ message: "Only POST requests allowed."})
        return
    }
    var body = req.body
    const { db } = await connectToDatabase()

    var logObject = {}

    logKeys.forEach(key => {
        var keyVal = _.get(body, key, false)
        if(keyVal) {
            logObject[key] = keyVal
        }
    })

    console.log("Sending logObject: ")
    console.log(logObject)

    if(db) {
        var logResult = await storeLog(db, logObject)
    } else {
        console.log("DB undefined for logging")
        console.log(db)
    }

    



    res.status(200).send("-")
}