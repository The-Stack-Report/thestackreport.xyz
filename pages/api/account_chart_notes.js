import nextConnect from "next-connect";
import db_middleware from "middleware/database"
import { INTERPRETATION_LAYER_CHART_NOTES } from "constants/feature_flags"
import generateFeatureFlagFunction from "utils/generateFeatureFlagFunction"
import _ from "lodash"
import {
    verifyAccessToken,
    queryAccessControl
} from "@stakenow/siwt"

const handler = nextConnect();

handler.use(db_middleware);
handler.use(
    generateFeatureFlagFunction(
        INTERPRETATION_LAYER_CHART_NOTES
    )
)


handler.get(async (req, res) => {
    const { db } = req;
    const { query } = req;
    const { address } = query;
    var userAccount = false
    var authorizationheader = _.get(req, "headers.authorization", false)

    var authorizationState = "none"
    if(authorizationheader) {
        console.log("received authorization header: ", authorizationheader)
        const accessToken = req.headers.authorization.split(" ")[1]
        console.log(`Access token: `, accessToken)
        const pkh = verifyAccessToken(accessToken)

        console.log("user account address: ", pkh)
        if(pkh) {
            authorizationState = "success"
            userAccount = pkh
        } else {
            authorizationState = "failed"
        }
    } else {
        console.log("No authorization header")
    }

    if(authorizationState === "success") {

        const account_chart_notes = await db
            .collection("chart_notes")
            .find({ "owner": address, "deleted": false })
            .toArray()
        res.status(200).json(account_chart_notes)
        return
    } else {
        res.status(403).json([])
        return
    }
})

export default handler