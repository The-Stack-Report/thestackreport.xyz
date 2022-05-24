import _ from "lodash"

function prepareChartMetadata(chart) {
    var chartProps = {}
    _.keys(chart).forEach(key => {
        var val = chart[key]

        if (_.isString(val)) {
            if(val.startsWith("[")) {
                val = JSON.parse(val)
            } else if(val.startsWith("{")) {
                val = JSON.parse(val)
            }
        }
        chartProps[key] = val
    })

    return chartProps
}

export default prepareChartMetadata