import { connectToDatabase } from "utils/mongo_db"
import _ from "lodash"
import {
    storeLog
} from "utils/interactionLogging"

export default async function handler(req, res) {
    const search_term = _.get(req, "query.search_term", false)
    const from_domain = _.get(req, "query.from_domain", "from-domain-missing-in-api-request")
    const sortKey = _.get(req, "query.sort_key", "transactions_count")
    const sortDirection = _.toNumber(_.get(req, "query.sort_direction", 1))
    const limit = _.toNumber(_.get(req, "query.limit", 100))
    const offset = _.toNumber(_.get(req, "query.offset", 0))


    const { db } = await connectToDatabase()

    var sortParams = [
        [sortKey, sortDirection],
        ["address", -1]
    ]
    var findParams = {}

    if (_.isString(search_term)) {
        findParams["$or"] = [
            {"tzkt_account_data.alias": {"$regex":search_term, "$options": "i"}},
            {"address": {"$regex":search_term, "$options": "xi"}}
        ]
        findParams[sortKey] = {$exists: true}
    }


    const findLimitParams = {
        limit: limit,
        skip: offset
    }
    var contracts = await db.collection("contracts_metadata")
        .find(findParams, findLimitParams)
        .sort(sortParams)
        .allowDiskUse()
        .toArray()
    // contracts = contracts.reverse()

    var logResult = await storeLog(db, {
        domain: from_domain,
        action: "search contract API",
        value: _.toString(search_term),
        category: "search",
        ts: new Date()
    })

    res.status(200).json(contracts)
}