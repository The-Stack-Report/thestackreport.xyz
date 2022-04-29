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
    Box,
    Button,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb
} from "@chakra-ui/react"
import chroma from "chroma-js"
import { useDebouncedCallback } from 'use-debounce'
import { breakpoints } from "styles/breakpoints"
import useWindowSize from "utils/useWindowSize"
import { snapToEndOfDay } from "utils/snapFunctions"
import styles from "./AreaChart.module.scss"
import {
    dataInDateRange,
    getDateRange,
    findDataRangeInData
} from "utils/dataRangeUtils"
import isTouchEnabled from "utils/isTouchEnabled"



function dateKeyVal(val) {
    return dayjs.isDayjs(val) ? val : dayjs(val)
}

export const AreaChartContext = createContext()

const PATTERN_ID = 'brush_pattern';


const selectedBrushStyle = {
    fill: `url(#${PATTERN_ID})`,
    stroke: 'rgb(150,150,150)',
  };

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
    const brushRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width: 500, height: 300 })
    const [windowResizeCounter, setWindowResizeCounter] = useState(0)
    const [hoveredXValue, setHoveredXValue] = useState(false)
    const [filteredData, setFilteredData] = useState(data)
    const [touchEnabled, setTouchEnabled] = useState("initialized")
    const [touchSliderValues, setTouchSliderValues] = useState(false)
    const windowSize = useWindowSize()

    
    useEffect(() => {
        if(containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            })
        }
    }, [containerRef, windowResizeCounter])

    useEffect(() => {
        if(touchEnabled === "initialized") {
            setTouchEnabled(isTouchEnabled())
        }
    }, [touchEnabled])

    useEffect(() => {
        if(touchSliderValues === false) {
            setTouchSliderValues([
                xDomain[0].unix(),
                xDomain[1].unix()
            ])
        }
    }, [touchSliderValues, xDomain])

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

    

    /**
     * Chart sizing & margins preparation
     */
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

   



    /**
     * Data scales preparation
     * - data domain & x domain
     * - yScale normal
     * - yScale area
     * - yScale timeline area for brush chart
     * - xScale for chart
     * - xScale full for brush chart
     */
    const _dataDomain = useMemo(() => {
        if(filteredData.length === data.length) {
            return dataDomain
        } else {
            // process data domain
            return findDataRangeInData(filteredData)
        }
    }, [filteredData, data, dataDomain])

    const _xDomain = useMemo(() => {
        if(filteredData.length === data.length) {
            return xDomain
        } else {
            // process x domain
            return getDateRange(filteredData.map(p => p.date))
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


    /**
     * Colors preparation
     */


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

     /**
     * Brush parameters preparation
     */

    const brushMargins = useMemo(() => {
        return {
            left: _margins.left,
            right: _margins.right,
            top: 0,
            bottom: 0
        }
    }, [_margins])

    // Brush bounds
    const xMax = chart.width
    const yMax = timelineBrushChartHeight
    const xBrushMax = xMax
    const yBrushMax = timelineBrushChartHeight

    const xDomainUnix = xDomain.map(d => d.unix())

    const onBrushChange = (domain) => {
        if(!domain) return
        const { x0, x1 } = domain
        const newDomain = [
            dayjs(x0),
            dayjs(x1)
        ]
        setFilteredData(dataInDateRange(data, newDomain))
    }



    const initialBrushPosition = useMemo(() => {
        return {
            start: {x: chart.width - chart.width * 0.5},
            end: {x: chart.width}
        }
    }, [chart.width])

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
                                        data={filteredData}
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
                            {touchEnabled ? (
                                <rect
                                    style={selectedBrushStyle}
                                    width={xScaleFull(dayjs(touchSliderValues[1] * 1000)) - xScaleFull(dayjs(touchSliderValues[0] * 1000))}
                                    height={30}
                                    x={xScaleFull(dayjs(touchSliderValues[0] * 1000))}
                                    y={0}
                                    />
                            ) : (
                                <Brush
                                    xScale={xScaleFull}
                                    yScale={yScale}
                                    resizeTriggerAreas={['left', 'right']}
                                    brushDirection="horizontal"
                                    innerRef={brushRef}
                                    width={xBrushMax}
                                    height={yBrushMax}
                                    handleSize={8}
                                    initialBrushPosition={initialBrushPosition}
                                    margin={brushMargins}
                                    onChange={onBrushChange}
                                    onPointerDown={() => setFilteredData(data)}
                                    selectedBoxStyle={selectedBrushStyle}
                                    useWindowMoveEvents
                                    />
                            )}
                        
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
                    {(touchEnabled === true && _.isArray(touchSliderValues)) && (
                        <Box
                            padding="1rem"
                            >
                            <RangeSlider
                                colorScheme="gray"
                                min={xDomainUnix[0]}
                                max={xDomainUnix[1]}
                                value={touchSliderValues}
                                onChange={(_range) => {
                                    setTouchSliderValues(_range)
                                    onBrushChange({
                                        x0: _range[0] * 1000,
                                        x1: _range[1] * 1000
                                    })
                                }}
                                >
                                <RangeSliderTrack>
                                    <RangeSliderFilledTrack />
                                </RangeSliderTrack>
                                <RangeSliderThumb boxSize={6} index={0} />
                                <RangeSliderThumb boxSize={6} index={1} />
                            </RangeSlider>
                        </Box>
                    )}
                    <Box
                        paddingTop="1rem"
                        paddingLeft={`${_margins.left}px`}
                        >
                        <Button onPointerDown={() => {
                            setTouchSliderValues(xDomain.map(p => p.unix()))
                            onBrushChange({
                                x0: xDomain[0],
                                x1: xDomain[1]
                            })
                            if (brushRef?.current) {
                                setFilteredData(data);
                                brushRef.current.reset();
                            }
                        }} size="small" padding="0.3rem" fontSize="0.8rem" width="5rem" marginRight="1rem" >Reset</Button>

                        
                    </Box>
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