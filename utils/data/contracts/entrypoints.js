import _ from "lodash";
import dayjs from "dayjs"



export function prepareEntrypointStats(byDay, contract) {
    if(!_.isArray(byDay)) {
        console.log("day stats not an array", byDay)
        return false
    }
    var entrypoints = []
    byDay.forEach(d => {
        if(_.has(d, "entrypoints")) {
            entrypoints = entrypoints.concat(_.keys(d.entrypoints))
        }
    })
    entrypoints = _.uniq(entrypoints)

    var entrypointsTotals = {}
    entrypoints.forEach(e => entrypointsTotals[e] = 0)

    var data = []

    byDay.forEach(d => {
        var p = {
            date: dayjs(_.get(d, "date", false))
        }
        entrypoints.forEach(e => {
            p[e] = _.get(d, `entrypoints.${e}`, 0)
            entrypointsTotals[e] += p[e]
        })
        data.push(p)
    })
    return {
        byDay: data,
        totals: entrypointsTotals
    }
}