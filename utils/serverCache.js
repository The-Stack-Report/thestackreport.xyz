import dayjs from "dayjs"

var cache = {}



function getUrl(url) {
    var currentTs = dayjs()
    var cacheSetting = _.get(cache, url, false)
    
}