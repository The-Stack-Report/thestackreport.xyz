import _ from "lodash";
import dayjs from "dayjs"
import { prepareEntrypointStats } from "./entrypoints"
import { prepareUsageStats } from "./usage"
import { findMaxValueInData } from "utils/dataRangeUtils"

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

    var entrypointsStats = prepareEntrypointStats(dailyStatsRaw.by_day)
    
    var usage_by_day = _.get(dailyStatsRaw, "usage_by_day", false)

    var usageStats = false

    var blockSpaceStatsByDay = dailyStatsRaw.by_day.map(p => {
        var blockSpaceSource = _.get(p, "block_space", {})
        return {
            ...blockSpaceSource,
            date: p.date
        }
    })

    if(usage_by_day) {
        usageStats = prepareUsageStats(usage_by_day)
    }

    var entrypoints = _.entries(entrypointsStats.totals).map(e => {
        return {
            entrypoint: e[0],
            count: e[1]
        }
    })

    var maxVal = findMaxValueInData(entrypointsStats.byDay)

    var sentByDay = _.get(dailyStatsRaw, "sent_by_day", false)
    var targets = _.get(dailyStatsRaw, "top_100_targets", false)
    var targetsShortenedDict = {}

    var targetsShortened = []

    if(targets) {
        targets.forEach((target) => {
            var target_addr = target.target_address
            var target_entry = target.Entrypoint
            var target_addr_shortened = target_addr.substring(target_addr.length - 8)
            target_addr_shortened = `...${target_addr_shortened}.${target_entry}`
            targetsShortenedDict[target.target_entrypoint] = target_addr_shortened
            targetsShortened.push(target_addr_shortened)

        })
        if(_.isArray(sentByDay)) {
            sentByDay.forEach(d => {
                // console.log(d.date)
                targets.forEach(t => {
                    var shortened = targetsShortenedDict[t.target_entrypoint]
    
                    if (_.has(d, t.target_entrypoint)) {
                        d[shortened] = d[t.target_entrypoint]
                    } else {
                        d[shortened] = 0
                    }
                })
            })
        }
    }

    
    

    var compiledStats = {
        ...dailyStatsRaw,
        entrypointsTotals: entrypointsStats.totals,
        byDay: entrypointsStats.byDay,
        blockSpaceStatsByDay: blockSpaceStatsByDay,
        dataDomain: [0, maxVal],
        entrypoints: entrypoints,
        usageByDay: usageStats,
        sentByDay: sentByDay,
        targetsShortened: targetsShortened
    }

    return compiledStats

}

export default prepareContractDailyStats