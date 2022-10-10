import {
    verifyAccessToken,
    queryAccessControl,
} from "@stakenow/siwt"

const authenticate = async (req, res, next) => {
    try {
        const accessToken = req.headers.authorization.split(" ")[1]
        const pkh = verifyAccessToken(accessToken)

        if (pkh) {
            const accessControl = queryAccessControl({
                contractAddress: "KT1LHHLso8zQWQWg1HUukajdxxbkGfNoHjh6",
                parameters: {
                    pkh,
                },
                test: {
                    comparator: ">=",
                    value: 1
                }
            })

            if(accessControl.tokenId) {
                return next()
            }
        }
        return res.status(403).send("Forbidden")
    } catch(err) {
        console.log("error in authenticating request")
        console.log(err)
        return res.status(403).send("Forbidden")
    }
}

export default authenticate