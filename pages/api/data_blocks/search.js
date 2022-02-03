import { connectToDatabase } from "utils/mongo_db"
import _ from "lodash"

export default async function handler(req, res) {
    const search_query = _.get(req, "query.search_query", false)
    const { db } = await connectToDatabase()
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

    res.status(200).json({ 
        requestedSearchQuery: search_query,
        docs: data,
        ts: new Date()
    })
    
}