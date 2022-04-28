import _ from "lodash"
import React from "react"
import styles from "./AreaChart.module.scss"
import dayjs from "dayjs"

const HoverTooltip = ({
    data,
    columns,
    hoveredXValue,
    chart,
    xScale,
    xKey,
    yScale,
    colColors
}) => {
    if(hoveredXValue === false) {
        return null
    }
    var data_i = _.findIndex(data, p => hoveredXValue.isSame(p[xKey], "day"))
    var hoveredData = data[data_i + 1]

    var xPosition = xScale(hoveredXValue)
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
                y={chart.height + 25}
                textAnchor={ xPosition < chart.width * 0.7 ? "start" : "end" }
                fontSize="0.8rem"
                alignmentBaseline="hanging"
                >
                {hoveredXValue.format("MMMM D, YYYY")}
            </text>
            {columns.map((col, col_i) => {
                var colVal = _.get(hoveredData, col, false)
                if(colVal === false) {
                    return null
                }
                var areaColor = colColors[col_i]
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