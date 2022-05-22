import React from "react"
import {
    LinePath,
    Bar,
    AreaClosed
} from "@visx/shape"
import { curveLinear } from '@visx/curve'
import chroma from "chroma-js"
import dayjs from "dayjs"
import _ from "lodash"

function dateKeyVal(val) {
    return dayjs.isDayjs(val) ? val : dayjs(val)
}


const DataColumns = ({
    data,
    columns,
    xScale,
    yScale,
    yScaleArea,
    type,
    colColors,
    xKey,
    chart,
    strokeWidth
}) => {
    return (
        <React.Fragment>
            {columns.map((c, c_i, c_a) => {
                var col_t = columns.length === 1 ? 0.5 : c_i / (columns.length - 1)
                var _type = type
                if(_.isArray(_type)) {
                    _type = _type[c_i % _type.length] 
                }

                var colColor = colColors[c_i]
                if(_type === "line") {
                    return (
                        <LinePath
                            key={c_i}
                            data={data}
                            x={p => {
                                return xScale(_.get(p, xKey))
                            }}
                            y={p => {
                                return chart.height - yScale(_.get(p, c))
                            }}
                            stroke={colColor}
                            strokeWidth={strokeWidth}
                            />
                    )
                } else if(_type === "bar") {
                    var pointWidth = chart.width / data.length
                    var barRelativeWidth = 0.5
                    
                    var barWidth = pointWidth / columns.length * barRelativeWidth
                    var barShift = barRelativeWidth * 0.5 * barWidth + barWidth
                    return (
                        <React.Fragment
                            key={c_i}
                            >
                            {data.map((p, p_i) => {
                                var x = xScale(_.get(p, xKey)) - barShift
                                var barHeight = yScale(_.get(p, c))
                                return (
                                    <Bar
                                        key={`bar-${p_i}`}
                                        x={x}
                                        y={chart.height - barHeight}
                                        width={barWidth}
                                        height={barHeight}
                                        fill={colColor}
                                        />
                                )

                            })}
                        </React.Fragment>
                    )
                } else if(_type === "area") {
                    return (
                        <AreaClosed
                            key={c_i}
                            data={data}
                            x={(d) => {
                                const x = xScale(dateKeyVal(d[xKey]))
                                return _.isNaN(x) ? 0 : x
                            }}
                            y={(d) => {
                                const y = yScaleArea(_.get(d, c, 0))
                                return y
                            }}
                            yScale={yScaleArea}
                            fill={chroma(colColor).brighten(0.5 + col_t * 0.5)}
                            fillOpacity={0.8}
                            opacity={1}
                            stroke={colColor}
                            curve={curveLinear}
                            />
                    )
                } else {
                    return (
                        <g key={c_i}><text>Unknown type</text></g>
                    )
                }
            })}
        </React.Fragment>
    )
}

export default DataColumns