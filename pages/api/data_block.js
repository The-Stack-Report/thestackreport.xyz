import { connectToDatabase } from "utils/mongo_db"
import _ from "lodash"


export default function handler(req, res) {
    const vid_key = _.get(req, "query.vid_key", false)
    connectToDatabase().then(async ({
        db, client
    }) => {
        var data = []
        if(vid_key) {
            data = await db.collection("data_blocks").find({
                vid_key: vid_key,
            }).toArray()
        } else {
            data = await db.collection("data_blocks").find().toArray()
        }
        

        console.log("sending back response - ", new Date())
        res.status(200).json({ 
            requestedKey: vid_key,
            docs: data,
            ts: new Date()
        })
        
    })
    .catch(err => {
        console.log(err)
        res.status(500).json({
            error: err,
            ts: new Date()
        })
    })

    
}