import _ from "lodash"
import React from "react"
import styles from "./Chart.module.scss"
import dayjs from "dayjs"

const HoverTooltip = ({
    data,
    columns,
    hoveredXValue,
    xValueType,
    chart,
    xScale,
    xKey,
    yScale,
    colColors
}) => {
    if(hoveredXValue === false) {
        return null
    }
    var data_i = 0
    if(xValueType === "date") {
        data_i = _.findIndex(data, p => hoveredXValue.isSame(p[xKey], "day"))
    } else {
        data_i = _.findIndex(data, p => hoveredXValue === p[xKey])
    }


    var hoveredData = data[data_i + 1]

    var xPosition = xScale(hoveredXValue)

    var hoverTooltipLabel = hoveredXValue
    if(xValueType === "date") {
        hoverTooltipLabel = hoveredXValue.add(2, "minute").format("MMMM D, YYYY")
    } else if(xValueType === "number") {
        hoverTooltipLabel = hoverTooltipLabel.toLocaleString()
    }
    return (
        <g
            className={styles["tooltip-group"]}
            transform={`translate(${xPosition}, 0)`}>
            <line
                x1={0}
                x2={0}
                y1={0}
                y2={chart.height}
                stroke="rgb(0,0,0)"
                strokeDasharray="5 5"
                opacity={0.5}
                />
            <text
                x={0}
                y={chart.height + 22}
                textAnchor={ xPosition < chart.width * 0.7 ? "start" : "end" }
                fontSize="0.8rem"
                alignmentBaseline="hanging"
                >
                {hoverTooltipLabel}
            </text>
            {columns.map((col, col_i) => {
                var colVal = _.get(hoveredData, col, false)
                if(colVal === false) {
                    return null
                }
                var areaColor = "red"
                if (_.isArray(colColors)) {
                    areaColor = colColors[col_i % colColors.length]
                } else if(_.isString(colColors)) {
                    areaColor = colColors
                } else if(_.isObject(colColors)) {
                    areaColor = colColors[col]
                }
                
                return (
                    <g transform={`translate(0, ${chart.height - yScale(colVal)})`}
                        className={styles["value-mark"]}
                        key={col_i}
                        >
                        <circle
                            cx={0}
                            cy={0}
                            r={1}
                            fill="black"
                            opacity={0.5}
                            />
                        <circle
                            cx={0}
                            cy={0}
                            r={2}
                            fill="transparent"
                            stroke={areaColor}
                            strokeWidth={1.5}
                            opacity={1}
                            />
                    </g>
                )
            })}
        </g>
    )
}

export default HoverTooltip