import nextConnect from "next-connect";
import db_middleware from "middleware/database"
import { INTERPRETATION_LAYER_CHART_NOTES } from "constants/feature_flags"
import generateFeatureFlagFunction from "utils/generateFeatureFlagFunction"
import token_gated_auth from "middleware/token_gated_auth"

const handler = nextConnect()

handler.use(db_middleware)
handler.use(
    generateFeatureFlagFunction(
        INTERPRETATION_LAYER_CHART_NOTES
    )
)
handler.use(token_gated_auth)

handler.get(async (req, res) => {
    if(req.query.id) {
        // TODO: Return chart note with id

        
    } else if(req.query.chart_id) {
        // TODO: Return all chart notes for chart_id
    } else {
        // 
        res.status(404).json({message: "No id or chart_id passed."})
    }
    
})

handler.post(async (req, res) => {
    let data = req.body
    data = JSON.parse(data)
    const {
        _id,
        note,
        status, 
        date,
        chart_id,
        owner,
    } = data
    console.log(_id, note, status, date, owner, chart_id)

    // TODO: Validate web token

    const db = req.db
    const collection = db.collection("chart_notes")
    const result = await collection.insertOne({
        _id,
        note,
        status,
        date,
        chart_id,
        owner,
    })
    res.status(200).json({message: "Chart note created."})
})

export default handler