import _ from "lodash"

var blocksCache = {}

export function getBlockFromCache(block_key) {
    console.log(blocksCache)
    console.log("getting block from cache: ", block_key)
    return _.get(blocksCache, block_key, false)
}

export function getBlockFromApi(block_key) {
    fetch(``)
}