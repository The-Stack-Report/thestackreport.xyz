import _ from "lodash"

export default async function handler(req, res) {
    const log_message = _.get(req, "query.log", false)
    if(log_message) {
        console.log(log_message)
    }

    res.status(200).json({
        message: "message logged"
    })
}