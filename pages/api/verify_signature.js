import nextConnect from "next-connect"
import {
    verifySignature,
    generateAccessToken,
    generateRefreshToken,
    queryAccessControl,
    generateIdToken
} from "@stakenow/siwt"

const handler = nextConnect()

handler.post(async (req, res) => {
    console.log("post request to validate signature")
    const { message, signature, pk, pkh } = req.body


    try {
        const isValidSignature = verifySignature(message, pk, signature)
        if(isValidSignature) {
            const claims = {
                iss: "https://thestackreport.xyz",
                aud: ["https://thestackreport.xyz"]
            }
    
            const accessToken = generateAccessToken({ pkh, claims })
    
            const refreshToken = generateRefreshToken(pkh)
    
            const access = queryAccessControl({
                contractAddress: "KT1LHHLso8zQWQWg1HUukajdxxbkGfNoHjh6",
                parameters: {
                    pkh,
                },
                test: {
                    comparator: ">=",
                    value: 1
                }
            })
    
            const idToken = generateIdToken({
                claims,
                userInfo: {
                    ...access
                }
            })

            console.log("returning access token")
    
            return res.status(200).json({
                accessToken,
                refreshToken,
                idToken,
                tokenType: "Bearer"
            })
        } else {
            return res.status(403).send("Forbidden")
        }
        
    } catch(err) {
        console.log("error in validating signature")
        console.log(err)
        res.status(400).json({
            error: err
        })
    }
})

export default handler