import React, {
    useState,
    useRef,
    useEffect,
    useMemo,
    createContext
} from "react"
import _ from "lodash"
import {
    scaleLinear,
    scaleTime
} from "@visx/scale"
import {
    marginsDefault,
    marginsMdDefault,
    marginsXl2Default,
    containerDefaultMargins
} from "components/Charts/constants/marginDefaults"
import useWindowSize from "utils/useWindowSize"
import { breakpoints } from "styles/breakpoints"
import { PatternLines } from '@visx/pattern'
import dayjs from "dayjs"
import Grid from "components/Charts/components/Grid"
import HoverOverlay from "components/Charts/components/HoverOverlay"
import HoverLabelsOverlay from "./HoverLabelsOverlay"
import HoverTooltip from "./HoverTooltip"
import {
    Box
} from "@chakra-ui/react"
import styles from "./Chart.module.scss"
import { useDebouncedCallback } from 'use-debounce'
import {
    AreaClosed,
    LinePath,
    Bar
} from "@visx/shape"
import AxisRight from "components/Charts/components/AxisRight"
import AxisBottom from "components/Charts/components/AxisBottom"
import chroma from "chroma-js"
import DataColumns from "./DataColumns"
import TimelineBrush from "./TimelineBrush"
import { snapToEndOfDay } from "utils/snapFunctions"


function dateKeyVal(val) {
    return dayjs.isDayjs(val) ? val : dayjs(val)
}


export const ChartContext = createContext()

const Chart = React.memo(({
    data = [],
    columns = [],
    color = "pink",
    xKey = "date",
    type = "line",
    xDomain = "auto",
    yDomain = "auto",
    width = "dynamic",
    xAxisLabel= "x-axis",
    strokeWidth = 1,
    height = 400,
    margins = marginsDefault,
    marginsMd = marginsMdDefault,
    marginsXl2 = marginsXl2Default,
    containerMargins = containerDefaultMargins,

    timelineBrush = false,
    timelineHeight = 30,

    children
}) => {
    const containerRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width: width, height: 400 })
    const [windowResizeCounter, setWindowResizeCounter] = useState(0)
    const [filteredData, setFilteredData] = useState(data)
    const windowSize = useWindowSize()

    const [hoveredXValue, setHoveredXValue] = useState(false)

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



    const xValues = useMemo(() => {
        return data.map(p => _.get(p, xKey, false))
    }, [data, xKey])

    const xValuesFiltered = useMemo(() => {
        return filteredData.map(p => _.get(p, xKey, false))
    }, [filteredData, xKey])

    const xValueType = useMemo(() => {
        if(_.every(xValues, _.isNumber)) {
            return "number"
        } else if(_.every(xValues, dayjs.isDayjs)) {
            return "date"
        } else {
            return "number"
        }   
        
    }, [xValues])

    const yValues = useMemo(() => {
        return _.flatten(data.map(p => {
            return columns.map(c => _.get(p, c, false))
        }))
    }, [data, columns])

    const yValuesFiltered = useMemo(() => {
        return _.flatten(filteredData.map(p => {
            return columns.map(c => _.get(p, c, false))
        }))
    }, [filteredData, columns])

    useEffect(() => {
        if(containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            })
        }
    }, [containerRef, windowResizeCounter])


    const _width = useMemo(() => {
        if(width === "dynamic") {
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

    const timelineChart = useMemo(() => {
        return {
            width: _width - _margins.left - _margins.right,
            height: timelineHeight
        }
    }, [_width, timelineHeight, _margins])


    const _xDomain = useMemo(() => {
        if(xDomain === "auto") {
            if(xValueType === "number") {
                return [_.min(xValues), _.max(xValues)]
            } else if(xValueType === "date") {
                return [_.first(xValues), _.last(xValues)]
            } else {
    
            }
        } else {
            return xDomain
        }
        
    }, [xValues, xDomain, xValueType])

    const _xDomainFiltered = useMemo(() => {
            if(xValueType === "number") {
                return [_.min(xValuesFiltered), _.max(xValuesFiltered)]
            } else if(xValueType === "date") {
                return [_.first(xValuesFiltered), _.last(xValuesFiltered)]
            } else {
                xDomain
            }
        
    }, [xValuesFiltered, xDomain, xValueType])


    const xScaleFull = useMemo(() => {
        if(xValueType === "number") {
            return scaleLinear({
                range: [0, chart.width],
                domain: _xDomain
            })
        } else if(xValueType === "date") {
            return scaleTime({
                range: [0, chart.width],
                domain: _xDomain
            })
        }
    }, [chart.width, _xDomain, xValueType])

    const xScale = useMemo(() => {
        if(xValueType === "number") {
            return scaleLinear({
                range: [0, chart.width],
                domain: _xDomainFiltered
            })
        } else if(xValueType === "date") {
            return scaleTime({
                range: [0, chart.width],
                domain: _xDomainFiltered
            })
        }
    }, [chart.width, _xDomainFiltered, xValueType])

    const _yDomain = useMemo(() => {
        if(yDomain === "auto") {
            var min = _.min(yValues)
            var max = _.max(yValues)
            if (min > 0) {
                min = 0
            }
            return [min, max]
        } else {
            return yDomain
        }
    }, [yValues, yDomain])

    const _yDomainFiltered = useMemo(() => {
        if(yDomain === "auto") {
            var min = _.min(yValuesFiltered)
            var max = _.max(yValuesFiltered)
            if (min > 0) {
                min = 0
            }
            return [min, max]
        } else {
            return yDomain
        }
    }, [yValuesFiltered, yDomain])

    const yScale = useMemo(() => {
        return scaleLinear({
            range: [0, chart.height],
            domain: _yDomainFiltered
        })
    }, [chart.height, _yDomainFiltered])

    const yScaleArea = useMemo(() => {
        return scaleLinear({
            range: [chart.height, 0],
            domain: _yDomainFiltered,
            nice: true
        })
    }, [chart.height, _yDomainFiltered])

    const yScaleTimeline = useMemo(() => {
        return scaleLinear({
            range: [0, timelineHeight],
            domain: _yDomain
        })
    }, [timelineHeight, _yDomain])

    const yScaleTimelineArea = useMemo(() => {
        return scaleLinear({
            range: [timelineHeight, 0],
            domain: _yDomain,
            nice: true
        })
    }, [timelineHeight, _yDomain])

    var _containerMargins = containerMargins

    if(_.get(windowSize, "width", 500) < breakpoints.xl2) {
        _containerMargins.right = -10

    }


    /**
     * Colors preparation
     */
    const colColors = columns.map((col, col_i) => {
        var col_t = columns.length === 1 ? 0.5 : col_i / (columns.length - 1)
        var colColor = color
        if(_.isFunction(color)) {
            colColor = color(col_t)
        }
        return colColor
    })

    var xAxisLabelsPosition = _.get(windowSize, "width", 500) > breakpoints.xl2 ? "outside" : "inside"

    var dataColumnsProps = {
        columns: columns,
        type: type,
        colColors: colColors,
        xKey: xKey,
        strokeWidth: strokeWidth
    }

    var dataColumnsTimelineProps = _.cloneDeep(dataColumnsProps)

    dataColumnsProps.data = filteredData
    dataColumnsProps.xScale = xScale
    dataColumnsProps.yScale = yScale
    dataColumnsProps.yScaleArea = yScaleArea
    dataColumnsProps.chart = chart

    dataColumnsTimelineProps.data = data
    dataColumnsTimelineProps.xScale = xScaleFull
    dataColumnsTimelineProps.yScale = yScaleTimeline
    dataColumnsTimelineProps.yScaleArea = yScaleTimelineArea
    dataColumnsTimelineProps.chart = timelineChart

    var hoverSnapFunction = useMemo(() => {
        if(xValueType === "number") {
            return (p) => _.round(p)
        } else {
            return snapToEndOfDay
        }
    }, [xValueType])
    return (
        <ChartContext.Provider value={{
                colColors: colColors,
                hovered: hoveredXValue !== false
            }}>
            <Box className={styles["chart"]}
                ref={containerRef}
                style={{
                    marginLeft: _.get(_containerMargins, "left"),
                    marginTop: _.get(_containerMargins, "top"),
                    marginBottom: _.get(_containerMargins, "bottom"),
                    marginRight: _.get(_containerMargins, "right"),
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
                    zIndex={100}
                    >
                    {children}
                    <HoverLabelsOverlay
                        data={data}
                        columns={columns}
                        xKey={xKey}
                        xValueType={xValueType}
                        hoveredXValue={hoveredXValue}
                        chart={chart}
                        xScale={xScale}
                        yScale={yScale}
                        colColors={colColors}
                        />
                </Box>
                <svg width={_width} height={height}>
                    
                    <g transform={`translate(${_margins.left}, ${margins.top})`}>
                        <g style={{pointerEvents: "none"}}>
                            <Grid
                                xScale={xScale}
                                yScale={yScale}
                                chart={chart}
                                />
                            <DataColumns {...dataColumnsProps} />
                            <HoverTooltip
                                data={data}
                                columns={columns}
                                xKey={xKey}
                                xValueType={xValueType}
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
                            xValueType={xValueType}
                            hoveredXValue={hoveredXValue}
                            setHoveredXValue={setHoveredXValue}
                            snapFunction={hoverSnapFunction}
                            />
                    </g>
                </svg>
                {timelineBrush && (
                    <TimelineBrush
                        dataColumnsProps={dataColumnsTimelineProps}
                        width={_width}
                        margins={_margins}
                        xScaleFull={xScaleFull}
                        yScaleTimeline={yScaleTimeline}
                        yScaleTimelineArea={yScaleTimelineArea}
                        xDomain={_xDomain}
                        height={timelineHeight}
                        setFilteredData={setFilteredData}
                        xValueType={xValueType}
                        />
                )}
            </Box>
        </ChartContext.Provider>
    )
})


Chart.displayName = "Chart"

export default Chart