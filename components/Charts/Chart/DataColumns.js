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
import BoxPlot from "./types/BoxPlot"

export function dateKeyVal(val) {
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
                var values = data.map(p => {
                    var v = _.get(p, c)
                    if(_.isUndefined(v)) {
                        v = NaN
                    }
                    return v
                })        
                var valueSegments = []                
                if(_.some(values, v => v === false || _.isNaN(v))) {
                    // values includes missing values
                    var currentSegment = []
                    values.forEach((v, v_i) => {
                        if(v !== false && !_.isNaN(v)) {
                            var splitSegmentElem = {}
                            splitSegmentElem[c] = v
                            splitSegmentElem[xKey] = _.get(data[v_i], xKey)
                            currentSegment.push(splitSegmentElem)
                        } else {
                            if(currentSegment.length > 0) {
                                valueSegments.push(_.cloneDeep(currentSegment))
                                currentSegment = []
                            }
                        }
                    })
                    if(currentSegment.length > 0) {
                        valueSegments.push(_.cloneDeep(currentSegment))
                    }

                } else {
                    valueSegments = [data]
                }
                var colColor = colColors[c_i]
                if(_type === "line") {
                    return (
                        <React.Fragment
                            key={`line-${c_i}`}
                            >
                            {valueSegments.map((segment, segment_i) => {

                                if(segment.length > 1) {
                                    const xyPath = segment.map(p => {
                                        return {
                                            x: xScale(_.get(p, xKey)),
                                            y: chart.height - yScale(_.get(p, c))
                                        }
                                    }).filter(p => !_.isNaN(p.x) && !_.isNaN(p.y))
                                    return (
                                        <LinePath
                                            key={`segment-${segment_i}`}
                                            data={xyPath}
                                            x={p => p.x}
                                            y={p => p.y}
                                            stroke={colColor}
                                            strokeWidth={strokeWidth}
                                            />
                                    )
                                } else if(segment.length === 1) {
                                    var segmentPoint = {
                                        x: xScale(_.get(segment[0], xKey)),
                                        y: chart.height - yScale(_.get(segment[0], c))
                                    }
                                    if(!_.isNaN(segmentPoint.x) && !_.isNaN(segmentPoint.y)) {
                                        return (
                                            <circle
                                            key={`segment-${segment_i}`}
                                            r={1}
                                            fill={colColor}
                                            stroke="transparent"
                                            cx={segmentPoint.x}
                                            cy={segmentPoint.y}
                                            />
                                        )
                                    }
                                }
                                return null
                                
                            })}
                        </React.Fragment>
                        
                    )
                } else if(_type === "bar") {
                    var pointWidth = chart.width / data.length
                    var barRelativeWidth = 0.5
                    
                    var barWidth = pointWidth / columns.length * barRelativeWidth
                    var barShift = barRelativeWidth * 0.5 * barWidth + barWidth
                    return (
                        <React.Fragment
                            key={`bar-${c_i}`}
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
                            key={`area-${c_i}`}
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
                } else if(_type === "boxplot") {
                    return (
                        <BoxPlot
                            data={data}
                            prefix={c}
                            xScale={xScale}
                            yScale={yScale}
                            xKey={xKey}
                            chart={chart}
                            />
                    )
                } else {
                    return (
                        <g key={`unknown-${c_i}`}><text>Unknown type</text></g>
                    )
                }
            })}
        </React.Fragment>
    )
}

export default DataColumns