import React, { useState, useRef, useMemo, useEffect, createContext } from "react"
import {
    scaleLinear,
    scaleTime
} from "@visx/scale"
import {
    AreaClosed,
    LinePath
} from "@visx/shape"
import AxisRight from "components/Charts/components/AxisRight"
import AxisBottom from "components/Charts/components/AxisBottom"

import _ from "lodash"
import { curveLinear } from '@visx/curve'
import { Brush } from '@visx/brush'
import { Bounds } from '@visx/brush/lib/types'
import BaseBrush, { BaseBrushState, UpdateBrush } from '@visx/brush/lib/BaseBrush'
import { PatternLines } from '@visx/pattern'
import dayjs from "dayjs"
import Grid from "components/Charts/components/Grid"
import HoverOverlay from "components/Charts/components/HoverOverlay"
import HoverLabelsOverlay from "./HoverLabelsOverlay"
import HoverTooltip from "./HoverTooltip"
import {
    Box
} from "@chakra-ui/react"
import chroma from "chroma-js"
import { useDebouncedCallback } from 'use-debounce'
import { breakpoints } from "styles/breakpoints"
import useWindowSize from "utils/useWindowSize"
import { snapToEndOfDay } from "utils/snapFunctions"
import styles from "./AreaChart.module.scss"


function dateKeyVal(val) {
    return dayjs.isDayjs(val) ? val : dayjs(val)
}

export const AreaChartContext = createContext()

const PATTERN_ID = 'brush_pattern';

const AreaChart = React.memo(({
    data,
    columns,
    xKey = "date",
    color = "pink",
    dataDomain = [0, 100],
    xDomain = [0, 10],
    xAxisLabel= "Nr of calls",
    width = 400,
    height = 400,
    margins = {
        left: 10,
        top: 30,
        right: 10,
        bottom: 50
    },
    marginsMd = {
        left: 10,
        top: 30,
        right: 10,
        bottom: 50
    },
    marginsXl2 = {
        left: 10,
        top: 30,
        right: 110,
        bottom: 50
    },
    containerMargins = {
        left: -10,
        right: -110,
        top: 0,
        bottom: 0
    },
    timelineBrush = false,
    timelineBrushChartHeight = 30,
    children
}) => {
    const containerRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width: 500, height: 300 })
    const [windowResizeCounter, setWindowResizeCounter] = useState(0)
    const [hoveredXValue, setHoveredXValue] = useState(false)
    const [filteredData, setFilteredData] = useState(data)
    const windowSize = useWindowSize()

    
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

    

    
    const _width = useMemo(() => {
        if (width === "dynamic") {
            return _.get(dimensions, "width", 500)
        } else if(_.isNumber(width)) {
            return width
        }
        return 500
    }, [dimensions, width])


    const _margins = useMemo(() => {
        const windowWidth = _.get(windowSize, "width", 500)
        if(windowWidth < breakpoints.md) {
            return marginsMd
        } else if(windowWidth > breakpoints.xl2) {
            return marginsXl2
        } else {
            return margins
        }
    }, [
        margins,
        marginsMd,
        marginsXl2,
        windowSize
    ])

    const chart = useMemo(() => {
        return {
            width: _width - _margins.left - _margins.right,
            height: height - _margins.top - _margins.bottom
        }
    }, [_width, height, _margins])
    

    const _dataDomain = useMemo(() => {
        if(filteredData.length === data.length) {
            return dataDomain
        } else {
            // process data domain
            return [0, 100]
        }
    }, [filteredData, data, dataDomain])


    const _xDomain = useMemo(() => {
        if(filteredData.length === data.length) {
            return xDomain
        } else {
            // process x domain
            return [0, 100]
        }
    }, [data, filteredData, xDomain])

    const yScale = useMemo(
        () => {
            return scaleLinear({
                range: [0, chart.height],
                domain: _dataDomain,
                nice: true
            })
        }
    , [chart.height, _dataDomain])

    const yScaleArea = useMemo(
        () => {
            return scaleLinear({
                range: [chart.height, 0],
                domain: _dataDomain,
                nice: true
            })
        }
    , [chart.height, _dataDomain])


    const yScaleTimelineArea = useMemo(
        () => {
            return scaleLinear({
                range: [timelineBrushChartHeight, 0],
                domain: dataDomain,
                nice: true
            })
        }
    , [timelineBrushChartHeight, dataDomain])
    



    const xScale = useMemo(
        () => {
            return scaleTime({
                range: [0, chart.width],
                domain: _xDomain
            })
        }
    , [chart.width, _xDomain])

    const xScaleFull = useMemo(
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

    var _containerMargins = containerMargins

    if(_.get(windowSize, "width", 500) < breakpoints.xl2) {
        _containerMargins.right = -10

    }

    var xAxisLabelsPosition = _.get(windowSize, "width", 500) > breakpoints.xl2 ? "outside" : "inside"
    return (
        <AreaChartContext.Provider value={{
            colColors: colColors,
            hovered: hoveredXValue !== false
        }}>
        <Box className={styles["area-chart"]}
            ref={containerRef}
            style={{
                marginLeft: _.get(_containerMargins, "left"),
                marginTop: _.get(_containerMargins, "top"),
                marginBottom: _.get(_containerMargins, "bottom"),
                marginRight: _.get(_containerMargins, "right")
            }}
            >
            <Box
                pointerEvents="none"
                style={{
                    marginLeft: _.get(_margins, "left"),
                    marginTop: _.get(_margins, "top"),
                    marginBottom: _.get(_margins, "bottom"),
                    marginRight: _.get(_margins, "right")
                }}
                position="absolute"
                left="0px"
                right="0px"
                >
                {children}
                <HoverLabelsOverlay
                    data={data}
                    columns={columns}
                    xKey={xKey}
                    hoveredXValue={hoveredXValue}
                    chart={chart}
                    xScale={xScale}
                    yScale={yScale}
                    colColors={colColors}
                    />
            </Box>
            <Box
                overflow="hidden"
                >
                <svg
                    width={_width}
                    height={height}
                    >
                    <g transform={`translate(${_margins.left}, ${_margins.top})`}>
                        <g style={{pointerEvents: 'none'}}>
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
                            <HoverTooltip
                                data={data}
                                columns={columns}
                                xKey={xKey}
                                hoveredXValue={hoveredXValue}
                                chart={chart}
                                xScale={xScale}
                                yScale={yScale}
                                colColors={colColors}
                                />
                            <AxisRight
                                yScale={yScale}
                                chart={chart}
                                labelsPosition={xAxisLabelsPosition}
                                xAxisLabel={xAxisLabel}
                                />
                            <AxisBottom
                                xScale={xScale}
                                chart={chart}
                                />
                        </g>
                        <HoverOverlay
                            chart={chart}
                            margins={_margins}
                            xScale={xScale}
                            hoveredXValue={hoveredXValue}
                            setHoveredXValue={setHoveredXValue}
                            snapFunction={snapToEndOfDay}
                            />
                    </g>
                </svg>
                {timelineBrush && (
                <Box>
                        <svg width={_width} height="30px">
                            <g transform={`translate(${_margins.left}, 0)`}>
                            <PatternLines
                                id={PATTERN_ID}
                                height={8}
                                width={8}
                                stroke={"grey"}
                                strokeWidth={1}
                                orientation={['diagonal']}
                            />
                            <Brush
                                xScale={xScale}
                                yScale={yScale}
                                resizeTriggerAreas={['left', 'right']}
                                brushDirection="horizontal"
                                useWindowMoveEvents
                                />
                                <g style={{pointerEvents: 'none'}}>
                                    {columns.map((col, col_i) => {
                                        var col_t = columns.length === 1 ? 0.5 : col_i / (columns.length - 1)
                                        var areaColor = colColors[col_i]
        
                                        return (
                                            <AreaClosed
                                                key={col_i}
                                                data={data}
                                                x={(d) => {
                                                    const x = xScaleFull(dateKeyVal(d[xKey]))
                                                    return _.isNaN(x) ? 0 : x
                                                }}
                                                y={(d) => {
                                                    const y = yScaleTimelineArea(_.get(d, col, 0))
                                                    return y
                                                }}
                                                yScale={yScaleTimelineArea}
                                                fill={chroma(areaColor).brighten(0.5 + col_t * 0.5)}
                                                fillOpacity={0.8}
                                                opacity={1}
                                                stroke={areaColor}
                                                curve={curveLinear}
                                                />
                                        )
                                    })}
                                </g>
                            </g>

                        </svg>
                    </Box>
                )}
            </Box>
            
        </Box>
        </AreaChartContext.Provider>
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