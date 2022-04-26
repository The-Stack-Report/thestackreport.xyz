import _ from "lodash"

export default async function handler(req, res) {
    console.log("getting contract daily stats")
    const address = _.get(req, "query.address", false)
    console.log(`querying data for contract: ${address}`)

    if(_.isString(address) && address.startsWith("KT")) {
        fetch(`https://the-stack-report.ams3.cdn.digitaloceanspaces.com/datasets/tezos/contracts_daily_stats/${address}-daily-stats.json`)
            .then(resp => {
                if(resp.status === 200) {
                    return resp.json()
                } else {
                    throw(error)
                }
            })
            .then(data => {
                res.status(200).json(data)
            })
            .catch(err => {
                console.log('error fetching contract daily stats', err)
                res.status(400).json({"error": "error fetching contract daily stats"})
            })
    } else {
        res.status(400).json({"error": "incorrect contract address provided"})
    }


}