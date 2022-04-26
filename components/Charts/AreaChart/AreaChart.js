import React, { useState, useRef, useMemo, useEffect } from "react"
import {
    scaleLinear,
    scaleTime
} from "@visx/scale"
import {
    AreaClosed,
    LinePath
} from "@visx/shape"
import {
    AxisRight
} from "@visx/axis"
import _ from "lodash"
import { curveLinear } from '@visx/curve'
import dayjs from "dayjs"
import Grid from "components/Charts/components/Grid"

import chroma from "chroma-js"

function dateKeyVal(val) {
    return dayjs.isDayjs(val) ? val : dayjs(val)
}

const AreaChart = React.memo(({
    data,
    columns,
    xKey = "date",
    color = "pink",
    dataDomain = [0, 100],
    xDomain = [0, 10],
    width = 400,
    height = 600,
    margins = {
        left: 50,
        top: 50,
        right: 250,
        bottom: 50
    }
}) => {
    const containerRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width:width, height: 300 })
    
    useEffect(() => {
        if(containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            })
        }
    }, [containerRef])

    
    var _width = width
    if (width === "dynamic") {
        console.log("setting dynamic width", dimensions)
        _width = dimensions.width
    }

    if(!_.isNumber(_width)) {
        _width = 500
    }
    var windowInnerWidth = 1000
    const inBrowser = typeof window !== "undefined"
    if(inBrowser) {
        windowInnerWidth = _.get(window, "innerWidth", 1000)
    }
    if(windowInnerWidth < 500) {
        margins = {
            left: 10,
            top: 50,
            right: 50,
            bottom: 50
        }
    }

    const chart = useMemo(() => {
        return {
            width: _width - margins.left - margins.right,
            height: height - margins.top - margins.bottom
        }
    }, [_width, height, margins])

    const yScale = useMemo(
        () => {
            return scaleLinear({
                range: [0, chart.height],
                domain: dataDomain,
                nice: true
            })
        }
    , [chart.height, dataDomain])

    const yScaleArea = useMemo(
        () => {
            return scaleLinear({
                range: [chart.height, 0],
                domain: dataDomain,
                nice: true
            })
        }
    , [chart.height, dataDomain])

    const xScale = useMemo(
        () => {
            return scaleTime({
                range: [0, chart.width],
                domain: xDomain
            })
        }
    , [chart.width, xDomain])


    const colColors = columns.map((col, col_i) => {
        var col_t = columns.length === 1 ? 0.5 : col_i / (columns.length - 1)
        var areaColor = color
        if(_.isFunction(color)) {
            areaColor = color(col_t)
        }
        return areaColor
    })
    return (
        <div className='area-chart'
            ref={containerRef}
            >
            <svg
                width={_width}
                height={height}
                >
                <g transform={`translate(${margins.left}, ${margins.top})`}>
                <Grid
                    xScale={xScale}
                    yScale={yScale}
                    chart={chart}
                    />
                {columns.map((col, col_i) => {
                    var col_t = columns.length === 1 ? 0.5 : col_i / (columns.length - 1)
                    var areaColor = colColors[col_i]

                    return (
                        <React.Fragment
                            key={col_i}
                            >
                        <AreaClosed
                            data={data}
                            x={(d) => xScale(dateKeyVal(d.date))}
                            y={(d) => yScaleArea(_.get(d, col, 0))}
                            yScale={yScaleArea}
                            fill={chroma(areaColor).brighten(0.5 + col_t * 0.5)}
                            fillOpacity={0.8}
                            opacity={1}
                            stroke={areaColor}
                            curve={curveLinear}
                            numTicks={5}
                            />
                        </React.Fragment>
                    )
                })}
                </g>
            </svg>
        </div>
    )
}, (prev, next) => {
    if(prev.width !== next.width) {
        return false
    }
    if(prev.height !== next.height) {
        return false
    }
    return _.get(prev, "data", []).length === _.get(next, "data", []).length
})

AreaChart.displayName = "AreaChart"

export default AreaChart