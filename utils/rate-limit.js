import LRU from "lru-cache"

export default function reateLimit(options) {
    const tokenCache = new LRU({
        max: options?.uniqueTokenPerInterval || 500,
        ttl: options?.interval || 60000
    })

    return {
        check: (res, limit, token) => {
            return new Promise((resolve, reject) => {
                const tokenCount = (tokenCache.get(token)) || [0]
                if(tokenCount[0] === 0) {
                    tokenCache.set(token, tokenCount)
                }
                tokenCount[0] += 1

                const currentUsage = tokenCount[0]
                const isRateLimited = currentUsage >= limit
                res.setHeader("X-RateLimit-Limit", limit)
                res.setHeader("X-RateLimit-Remaining", isRateLimited ? 0 : limit - currentUsage)

                if(isRateLimited) {
                    console.log(`too many requests. Current usage: ${currentUsage},  Limit: ${limit}`)
                }

                return isRateLimited ? reject() : resolve()
            })
        }
    }
}