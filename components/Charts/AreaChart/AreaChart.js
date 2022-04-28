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
    
    children
}) => {
    const containerRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width:width, height: 300 })
    const [windowResizeCounter, setWindowResizeCounter] = useState(0)
    const [hoveredXValue, setHoveredXValue] = useState(false)
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
                                <React.Fragment
                                    key={col_i}
                                    >
                                <AreaClosed
                                    data={data}
                                    x={(d) => xScale(dateKeyVal(d[xKey]))}
                                    y={(d) => yScaleArea(_.get(d, col, 0))}
                                    yScale={yScaleArea}
                                    fill={chroma(areaColor).brighten(0.5 + col_t * 0.5)}
                                    fillOpacity={0.8}
                                    opacity={1}
                                    stroke={areaColor}
                                    curve={curveLinear}
                                    />
                                </React.Fragment>
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