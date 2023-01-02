import nextConnect from "next-connect"
import {
    verifySignature,
    generateAccessToken,
    generateRefreshToken,
    queryAccessControl,
    generateIdToken
} from "@stakenow/siwt"
import {
    INTERPRETATION_LAYER_CONTRACT
} from "constants/contracts"


const handler = nextConnect()


handler.post(async (req, res) => {
    console.log("post request to validate signature")
    const { message, signature, pk, pkh } = req.body

    try {
        const isValidSignature = verifySignature(message, pk, signature)
        if(isValidSignature) {
            console.log("signature is valid")
            const claims = {
                iss: "https://thestackreport.xyz",
                aud: ["https://thestackreport.xyz"]
            }
    
            const accessToken = generateAccessToken({ pkh, claims })
    
            const refreshToken = generateRefreshToken(pkh)

            console.log("generated access token and refresh token")
    
            console.log("generating access control queries")

            const beta_access = await queryAccessControl({
                contractAddress: INTERPRETATION_LAYER_CONTRACT,
                network: "mainnet",
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
                    beta_access: beta_access,
                }
            })
    
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