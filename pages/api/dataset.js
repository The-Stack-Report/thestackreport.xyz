import { connectToDatabase } from "utils/mongo_db"
import _ from "lodash"

export default async function handler(req, res) {
    const identifier = _.get(req, "query.identifier", false)

    const { db } = await connectToDatabase()

    if (identifier) {
        var dataset = await db.collection("datasets")
            .findOne({"identifier": identifier})
        
        dataset = JSON.parse(JSON.stringify(dataset))
        
        res.status(200)
            .json(dataset)
    } else {
        res.status(400).json({message: "no identifier provided."})
    }
}