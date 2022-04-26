import _ from "lodash";
import dayjs from "dayjs"

const expectedKeys = [
    "by_day",
    "total_calls",
    "up_to_day"
]

function prepareContractDailyStats(dailyStatsRaw, contract) {
    var keysCheck = expectedKeys.map(key => {
        return {
            key: key,
            has: _.has(dailyStatsRaw, key)
        }
    })
    if (_.some(keysCheck, key => !key.has)) {
        console.log(`missing keys for contract: `, keysCheck, contract)
        return false
    }
    var entrypoints = []

    var byDay = dailyStatsRaw.by_day
    if(!_.isArray(byDay)) {
        console.log("day stats not an array", dailyStatsRaw)
        return false
    }

    byDay.forEach(d => {
        if(_.has(d, "entrypoints")) {
            entrypoints = entrypoints.concat(_.keys(d.entrypoints))
        }
    })
    entrypoints = _.uniq(entrypoints)

    var entrypointsTotals = {}
    entrypoints.forEach(e => entrypointsTotals[e] = 0)

    // add dayjs date

    // aggregate entrypoints

    var data = []

    var maxDailyVal = 0

    byDay.forEach(d => {
        var p = {
            date: dayjs(_.get(d, "date", false))
        }
        entrypoints.forEach(e => {
            p[e] = _.get(d, `entrypoints.${e}`, 0)

            if(p[e] > maxDailyVal) {
                maxDailyVal = p[e]
            }
            entrypointsTotals[e] += p[e]
        })
        data.push(p)
    })


    var compiledStats = {
        entrypointsTotals,
        byDay: data,
        dataDomain: [0, maxDailyVal],
        entrypoints: _.entries(entrypointsTotals).map(e => {
            return {
                entrypoint: e[0],
                count: e[1]
            }
        })
    }

    return compiledStats

}

export default prepareContractDailyStats