import dayjs from "dayjs"
import _ from "lodash"
import * as d3 from "d3"
var cache = {}

export async function getUrl(url, duration=120, prepFunc = (d) => d) {
    console.log(`Serverside fetching and caching url: ${url} with duration ${duration}`)

    var currentTs = dayjs()

    // look if cache url exists
    var cachedUrl = _.get(cache, url, false)

    if(cachedUrl) {
        console.log("cache for url found, checking ts.")
        // at cache url check most recently checked timestamp
        var cachedTs = cachedUrl.ts

        var diff = Math.abs(cachedTs.diff(currentTs, "second"))

        console.log(`${diff} seconds diff for: ${url}`)
        if (diff < duration) {
            return cachedUrl.data
        }
    } else {
        console.log(`Initializing cache for ${url}`)
    }
    
    // if difference between current timestamp is longer than duration fetch again, else return current data set

    const resp = await fetch(url)
    if(resp.status !== 200) {
        return false
    }

    var respText = await resp.text()

    var respData = false
    if (url.endsWith(".json")) {
        respData = JSON.parse(respText)
    } else if(url.endsWith(".csv")) {
        respData = d3.csvParse(respText)
    }
    var data = prepFunc(respData)


    if (url.endsWith(".json")) {
        data = JSON.parse(JSON.stringify(data))
    }
    console.log("Setting new cache for url")
    cache[url] = {
        ts: currentTs,
        data: data 
    }
    return data
}