import _ from "lodash"
import dayjs from "dayjs"

function prepareDf(data, dateCols=["date"], nrCols=[]) {
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

export default prepareDf