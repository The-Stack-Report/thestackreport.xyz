import React from "react"
import { dateKeyVal } from "../DataColumns"
const BoxPlot = ({
    chart,
    data,
    xScale,
    xKey,
    yScale,
    prefix=""
}) => {
    return (
        <>
        {data.map((d, i) => {
            const min = _.get(d, `${prefix}.min`, 0)
            const max = _.get(d, `${prefix}.max`, 0)
            const q25 = _.get(d, `${prefix}.q25`, 0)
            const q50 = _.get(d, `${prefix}.q50`, 0)
            const q75 = _.get(d, `${prefix}.q75`, 0)
            var x = xScale(dateKeyVal(d[xKey]))

            var q25_y = q25 > 0 ? yScale(q25) : chart.height
            var q75_y = q75 > 0 ? yScale(q75) : chart.height
            var q50_y = q50 > 0 ? yScale(q50) : chart.height

            var min_y = min > 0 ? chart.height - yScale(min) : chart.height
            var max_y = max > 0 ? chart.height - yScale(max) : chart.height

            var boxHeight = Math.abs(q75_y - q25_y)

            return (
                <g transform={`translate(${x}, 0)`} key={i}>
                    <line
                        y1={min_y}
                        y2={max_y}
                        x1={0}
                        x2={0}
                        strokeWidth={1}
                        stroke="black"
                        opacity={0.5}
                        />
                    
                    <rect
                        x={-2}
                        width={4}
                        height={boxHeight}
                        y={chart.height - q75_y}
                        stroke="black"
                        fill="white"

                        />
                    <line
                        y1={chart.height - q50_y}
                        y2={chart.height - q50_y}
                        x1={-2}
                        x2={2}
                        strokeWidth={2}
                        stroke="black"
                        opacity={1}
                        />
                </g>
            )
        })}
        </>
    )
}

export default BoxPlot