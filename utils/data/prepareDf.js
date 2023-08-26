import _ from "lodash"
import dayjs from "dayjs"
import * as d3 from "d3"

function parseDataItems(data, dateCols, nrCols) {
    return data.map((p, i, a) => {
        dateCols.forEach(c => {
            p[c] = dayjs(p[c])
        })
        nrCols.forEach(c => {
            p[c] = _.toNumber(p[c])
        })
        return p
    })
}

function prepareDf(data, dateCols=["date"], nrCols=[]) {
    if (_.isArray(data)) {
        return parseDataItems(data, dateCols, nrCols)
    } else if(_.isString(data)) {
        var parsed = d3.csvParse(data)
        return parseDataItems(parsed, dateCols, nrCols)
    }
}

export default prepareDf