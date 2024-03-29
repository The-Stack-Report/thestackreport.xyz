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

    if(_.has(props, "custom_note")) {
        var customNoteParsed = props.custom_note

        customNoteParsed = JSON.parse(customNoteParsed)

        if(_.isArray(customNoteParsed)) {
            customNoteParsed = customNoteParsed.map(note => {
                return {
                    ...note,
                    date: dayjs(note.date)
                }
            })
        } else {
            customNoteParsed['date'] = dayjs(customNoteParsed['date'])
            customNoteParsed = [customNoteParsed]
        }

        customNoteParsed = customNoteParsed.map(note => {
            return {
                ...note,
                visibility: "article",
                noteSource: "custom_markdown"
            }
        })
        chartProps["custom_note"] = customNoteParsed
    }

    if(_.has(props, "show_chart_notes")) {
        if(props.show_chart_notes === "yes") {
            chartProps["showChartNotes"] = true
        } else {
            chartProps["showChartNotes"] = false
        }
    }


    return chartProps
}

export default prepareChartProps