import React from "react"
import dayjs from "dayjs"
import _ from "lodash"
import chroma from "chroma-js"

const WeeklyTrend = ({
    data,
    chart,
    yDomain,
    xDomainFiltered,
    yScale,
    xScale,
    endDate,
    trendKey
}) => {
    var _endDate = dayjs(endDate)
    var lastWeekRange = [
        _endDate.add(-7, "day"),
        _endDate.add(1, "day")
    ]

    var weekBeforeRange = [
        _endDate.add(-14, "day"),
        _endDate.add(-6, "day")
    ]

    var lastWeekData = data.filter(p => {
        return p.date.isAfter(lastWeekRange[0]) && p.date.isBefore(lastWeekRange[1])
    })

    var weekBeforeData = data.filter(p => {
        return p.date.isAfter(weekBeforeRange[0]) && p.date.isBefore(weekBeforeRange[1])
    })

    var lastWeekValues = lastWeekData.map(p => p[trendKey])

    var weekBeforeValues = weekBeforeData.map(p => p[trendKey])

    var lastWeekMean = _.mean(lastWeekValues)
    var weekBeforeMean = _.mean(weekBeforeValues)


    var diffHighlightColor = "rgb(50,225,100)"

    if(lastWeekMean < weekBeforeMean) {
        diffHighlightColor = "rgb(255,100,100)"
    }

    var percentageDiff = _.round(((lastWeekMean / weekBeforeMean) - 1) * 100)

    var percentageDiffStr = `${percentageDiff}`

    if(percentageDiff >= 0) {
        percentageDiffStr = `+${percentageDiff}%`
    } else {
        percentageDiffStr = `-${Math.abs(percentageDiff)}%`
    }
    if(_endDate.isAfter(xDomainFiltered[1])) {
        return null
    }
    return (
        <>
            <g transform={`translate(${xScale(weekBeforeRange[1].add(-1, "day"))}, ${chart.height - yScale(weekBeforeMean)})`}>
            <text
                x={0}
                y={5}
                textAnchor="end"
                fontSize="0.7rem"
                alignmentBaseline="hanging"
                >
                {_.round(weekBeforeMean).toLocaleString()}
            </text>
            <text
                x={0}
                y={20}
                textAnchor="end"
                fontSize="0.7rem"
                alignmentBaseline="hanging"
                >
                {"Average for week"}
            </text>
            <text
                x={0}
                y={35}
                textAnchor="end"
                fontSize="0.7rem"
                alignmentBaseline="hanging"
                >
                {"Up to "}
                {weekBeforeRange[1].add(-1, "day").format("MMM D")}
            </text>
            </g>

            <g transform={`translate(${xScale(lastWeekRange[1].add(-1, "day"))}, ${chart.height - yScale(lastWeekMean)})`}>
            <text
                x={0}
                y={5}
                textAnchor="end"
                fontSize="0.7rem"
                alignmentBaseline="hanging"
                >
                {_.round(lastWeekMean).toLocaleString()}
            </text>
            <text
                x={0}
                y={20}
                textAnchor="end"
                fontSize="0.7rem"
                alignmentBaseline="hanging"
                >
                {"Average for week"}
            </text>
            <text
                x={0}
                y={35}
                textAnchor="end"
                fontSize="0.7rem"
                alignmentBaseline="hanging"
                >
                {"Up to "}
                {lastWeekRange[1].add(-1, "day").format("MMM D")}
            </text>
            </g>
            <line
                x1={xScale(weekBeforeRange[0].endOf("day"))}
                x2={xScale(weekBeforeRange[1].add(-1, "day"))}
                y1={chart.height - yScale(weekBeforeMean)}
                y2={chart.height - yScale(weekBeforeMean)}
                strokeWidth={2}
                stroke="black"
                />
            
            <line
                x1={xScale(lastWeekRange[0].endOf("day"))}
                x2={xScale(lastWeekRange[1].add(-1, "day"))}
                y1={chart.height - yScale(lastWeekMean)}
                y2={chart.height - yScale(lastWeekMean)}
                strokeWidth={2}
                stroke="black"
                />


            <line
                x1={xScale(weekBeforeRange[1].add(-1, "day")) + 3}
                x2={xScale(weekBeforeRange[1]) - 3}
                y1={chart.height - yScale(weekBeforeMean)}
                y2={chart.height - yScale(weekBeforeMean)}
                strokeWidth={2}
                stroke={diffHighlightColor}
                />
            <line
                x1={xScale(weekBeforeRange[1].add(-1, "day")) + 3}
                x2={xScale(weekBeforeRange[1]) - 3}
                y1={chart.height - yScale(lastWeekMean)}
                y2={chart.height - yScale(lastWeekMean)}
                strokeWidth={2}
                stroke={diffHighlightColor}
                />
            <line
                x1={xScale(weekBeforeRange[1].add(-12, "hour"))}
                x2={xScale(weekBeforeRange[1].add(-12, "hour"))}
                y1={chart.height - yScale(weekBeforeMean)}
                y2={chart.height - yScale(lastWeekMean)}
                strokeWidth={2}
                stroke={diffHighlightColor}
                />
            <g transform={`translate(${xScale(weekBeforeRange[1].add(-1, "day")) + 3}, ${chart.height - yScale(_.max([lastWeekMean, weekBeforeMean]))})`}>
                <rect
                    x={0}
                    y={-23}
                    width={percentageDiffStr.length * 12}
                    height={20}
                    fill="white"
                    opacity={0.5}
                    />
                <text
                    fontWeight="bold"
                    x={0}
                    y={-5}
                    fontSize={"1.2rem"}
                    fill={chroma(diffHighlightColor).darken(0.5)}
                    >
                    {percentageDiffStr}
                </text>
            </g>    


        </>
    )
}

export default WeeklyTrend