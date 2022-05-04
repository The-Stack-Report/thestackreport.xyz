import React, { useRef, useState, useEffect, useMemo } from "react"
import { useDebouncedCallback } from 'use-debounce'
import {
    dataInDateRange,
    getDateRange,
    findDataRangeInData
} from "utils/dataRangeUtils"
import {
    scaleLinear,
    scaleTime
} from "@visx/scale"
import {
    AreaClosed,
    LinePath
} from "@visx/shape"
import Grid from "components/Charts/components/Grid"
import _ from "lodash"
import chroma from "chroma-js"
import { curveLinear } from '@visx/curve'
import dayjs from "dayjs"


function dateKeyVal(val) {
    return dayjs.isDayjs(val) ? val : dayjs(val)
}

const AreaChartBasic = ({
    data,
    columns,
    xKey = "date",
    color = "rgb(200,0,255)",
    margins = {left: 1, top: 1, right: 1, bottom: 1},
    aspectRatio = 2/8,
    width="dynamic"

}) => {
    const containerRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width: 500, height: 300 })
    const [windowResizeCounter, setWindowResizeCounter] = useState(0)


    useEffect(() => {
        if(containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            })
        }
    }, [containerRef, windowResizeCounter])

    const handleResize = useDebouncedCallback(
        () => {
            setWindowResizeCounter((c) => c + 1)
        },
        50
    );

    useEffect(() => {
        if(windowResizeCounter === 0) {
            setWindowResizeCounter(1)
        }
    }, [windowResizeCounter])
    

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);


    const _width = dimensions.width
    const height = _width * aspectRatio

    const chart = {
        width: _width - margins.left - margins.right,
        height: height - margins.top - margins.bottom
    }

    const dataDomain = useMemo(() => {
        return findDataRangeInData(data)
    }, [data])


    const xDomain = useMemo(() => {
        return getDateRange(data.map(p => p.date))
    }, [data])

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
        <div className='area-chart' ref={containerRef} >
            <svg width={_width} height={height}>
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
                            <AreaClosed
                                key={col_i}
                                data={data}
                                x={(d) => {
                                    const x = xScale(dateKeyVal(d[xKey]))
                                    return _.isNaN(x) ? 0 : x
                                }}
                                y={(d) => {
                                    const y = yScaleArea(_.get(d, col, 0))
                                    return y
                                }}
                                yScale={yScaleArea}
                                fill={chroma(areaColor).brighten(0.5 + col_t * 0.5)}
                                fillOpacity={0.8}
                                opacity={1}
                                stroke={areaColor}
                                curve={curveLinear}
                                />
                        )
                    })}
                </g>

            </svg>
        </div>
    )
}

export default AreaChartBasic