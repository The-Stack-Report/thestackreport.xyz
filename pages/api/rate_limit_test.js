import nextConnect from "next-connect"
import rateLimit from "utils/rate-limit"

const handler = nextConnect()

const limiter = rateLimit({
    interval: 60 * 1000,
    uniqueTokenPerInterval: 500
})

// Handler with get request which is protected by a rate limit of 60 responses per minute
// Implement get request
handler.get(async (req, res) => {
    // Rate limit request


    console.log("Rate limit response")

    // res.status(200).json({message: "hi"})

    try {
        await limiter.check(res, 10, "CACHE_TOKEN")
        res.status(200).json({ message: "Hello World" })
    } catch (err) {
        console.log("rate limit error: ", err)
        res.status(429).json({ message: "Too many requests" })
    }
})

export default handler