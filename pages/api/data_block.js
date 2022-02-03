import { connectToDatabase } from "utils/mongo_db"
import _ from "lodash"


export default async function handler(req, res) {
    const vid_key = _.get(req, "query.vid_key", false)
    
    const { db } = await connectToDatabase()

    var data = []
    if(vid_key) {
        data = await db.collection("data_blocks").find({
            vid_key: vid_key
        }).toArray()
    } else {
        data = await db.collection("data_blocks").find({
            vid_key: vid_key
        }).sort({endDate: -1}).toArray()
    }

    res.status(200).json({
        requestedKey: vid_key,
        docs: data,
        ts: new Date()
    })
}