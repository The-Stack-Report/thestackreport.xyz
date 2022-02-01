import { connectToDatabase } from "utils/mongo_db"
import _ from "lodash"

export default function handler(req, res) {
    const search_query = _.get(req, "query.search_query", false)
    connectToDatabase().then(async ({
        db
    }) => {
        var data = []
        if(search_query) {
            const regex = `${search_query}`
            data = await db.collection("data_blocks").find({
                "$or": [
                    {name: {"$regex":regex, "$options": "xi"}},
                    {tags: {"$regex": regex, "$options" : "i"}}
                ]
            }).sort({endDate: -1}).toArray()
            
        }
        console.log(`Found ${data.length} docs.`)

        data.forEach(p => {
            console.log(_.get(p, "endDate", '-'))
        })
        res.status(200).json({ 
            requestedSearchQuery: search_query,
            docs: data,
            ts: new Date()
        })
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err,
            ts: new Date()
        })
    })
}