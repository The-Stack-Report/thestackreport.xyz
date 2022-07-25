import { connectToDatabase } from "utils/mongo_db"
import _ from "lodash"

export default async function handler(req, res) {
    const address = _.get(req, "query.address", false)

    const { db } = await connectToDatabase()
    if(address) {

        var contract_meta = await db.collection("contracts_metadata")
                .findOne({"address": address})
        
        
        contract_meta = JSON.parse(JSON.stringify(contract_meta))
        res.status(200).json(contract_meta)
        

    } else {
        res.status(400).json({message: "no address specified."})
    }
}