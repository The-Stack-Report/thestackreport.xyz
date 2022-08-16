import _ from "lodash"
import dayjs from "dayjs"

function prepareChartProps(props) {
    var chartProps = {}
    var dateRange = false

    var startDate = _.get(props, "start_date", false)
    var endDate = _.get(props, "end_date", false)

    chartProps["endDate"] = endDate
    if(startDate && endDate) {
        startDate = dayjs(startDate)
        endDate = dayjs(endDate)

        dateRange = [startDate, endDate]
    }

    if(dateRange) {
        chartProps["xDomain"] = dateRange
    }

    var overlay = _.get(props, "overlay", false)

    if(module) {
        chartProps["overlay"] = overlay
    }

    if(_.has(props, "initial_column_toggles")) {
        var parsedInitialColumns = JSON.parse(_.get(props, "initial_column_toggles", "[]"))
        chartProps["initialColumnToggles"] = parsedInitialColumns

    }

    return chartProps
}

export default prepareChartProps