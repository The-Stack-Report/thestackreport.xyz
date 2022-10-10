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
    scaleLog,
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
    Box,
    Text,
    Button
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
import BadgesLegend from "components/Charts/components/BadgesLegend"
import ChartNotes from "./overlays/ChartNotes"
import { snapToEndOfDay } from "utils/snapFunctions"
import { exportAsImage } from "utils/exportAsImage"
import isTouchEnabled from "utils/isTouchEnabled"
import WeeklyTrend from "./overlays/WeeklyTrend"
import isBetween from "dayjs/plugin/isBetween"
import NotesXAxisOverlay from "components/Charts/components/NotesXAxisOverlay"
import { RecoilRoot } from "recoil"

dayjs.extend(isBetween)

function dateKeyVal(val) {
    return dayjs.isDayjs(val) ? val : dayjs(val)
}

var rightAxisBreakpoint = 1367

export const ChartContext = createContext()

const Chart = React.memo((props) => {
    const {
        name = "Chart",
        chartId = false,
        data = [],
        dataHash = "",
        columns = [],
        initialColumnToggles = [],
        color = "pink",
        xKey = "date",
        xValTransform = (p) => p.startOf("day"),
        type = "line",
        xDomain = "auto",
        yDomain = "auto",
        yAxisTickLabel = "",
        yScaleType = "linear",
        yTickCount = 5,
        width = "dynamic",
        xAxisLabel= "x-axis",
        noDataTooltipPlaceholder = "No data for date",
        strokeWidth = 1,
        height = 400,
        autoScaleToMaxWindowHeight = true,
        margins = marginsDefault,
        marginsMd = marginsMdDefault,
        marginsXl2 = marginsXl2Default,
        containerMargins = containerDefaultMargins,
    
        timelineBrush = false,
        timelineHeight = 30,
        custom_note = false,
        notes = false,
        columnToggles = false,
        badgesLegend = false,
        badgesLegendText = " ",
        children,
        overlay = [],
        noteEditingEnabled= false,
        endDate = false
    } = props
        
    const _data = useMemo(() => {
        return data.map(p => {
            return {
                ...p,
                date: xValTransform(dayjs(_.get(p, "date", false)))
            }
        })
    }, [data, xValTransform])
    const containerRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width: width, height: 400 })
    const [windowResizeCounter, setWindowResizeCounter] = useState(0)
    const [filteredData, setFilteredData] = useState(_data)
    const [brushMoved, setBrushMoved] = useState(false)
    const [brushZoomInitialized, setBrushZoomInitialized] = useState(false)
    const [columnsToggled, setColumnsToggled] = useState(initialColumnToggles)
    const [selectedNote, setSelectedNote] = useState(false)
    const [newNotes, setNewNotes] = useState([])
    const [newNotePreview, setNewNotePreview] = useState(false)
    const [controllingZoomBrush, setControllingZoomBrush] = useState(false)
    const [editedNotes, setEditedNotes] = useState({})
    const [editingNote, setEditingNote] = useState(false)

    const windowSize = useWindowSize()

    const windowWidth = useMemo(() => {
        return _.get(windowSize, "width", 500)
    }, [windowSize])

    const [hoveredXValue, setHoveredXValue] = useState(false)

    const handleResize = useDebouncedCallback(
        () => {
            setWindowResizeCounter((c) => c + 1)
        },
        50
    );

    const handleBrushMove = (newFilteredData) => {
        setFilteredData(newFilteredData)
        setBrushMoved(true)
    }

    useEffect(() => {
        setBrushZoomInitialized(false)
    }, [dataHash])
    
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


    

    const _columns = useMemo(() => {
        if(_.isArray(columns)) {
            return columns
        } else {
            console.log("Columns is not array")
            return []
        }
    }, [columns])

    // Array that either is all columns when no specific columns are selected, or specifically the selected columns.
    const _filteredColumns = useMemo(() => {
        if(columnsToggled.length === 0) {
            return _columns
        } else {
            return _columns.filter(column => columnsToggled.includes(column))
        }
    }, [columnsToggled, _columns])


    const _height = useMemo(() => {
        if(windowSize.height < height * 0.75) {
            return windowSize.height * 0.6
        } else {
            return height
        }
    }, [windowSize, height])

    const xValues = useMemo(() => {
        return _data.map(p => _.get(p, xKey, false))
    }, [_data, xKey])

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
        if(type === "boxplot") {
            return _data.map(p => {
                return _.get(p, `${_columns[0]}.max`, 0)
            })
        }
        return _.flatten(_data.map(p => {
            return _columns.map(c => _.get(p, c, false))
        }))
    }, [_data, _columns, type])

    const yValuesForSelectedFilteredColumns = useMemo(() => {
        if(type === "boxplot") {
            return filteredData.map(p => {
                return _.get(p, `${_columns[0]}.max`, 0)
            })
        }
        return _.flatten(filteredData.map(p => {
            return _filteredColumns.map(c => _.get(p, c, false))
        }))
    }, [filteredData, _filteredColumns, _columns, type])

    const yValuesFiltered = useMemo(() => {
        if(type === "boxplot") {
            return filteredData.map(p => {
                return _.get(p, `${_columns[0]}.max`, 0)
            })
        }
        return _.flatten(filteredData.map(p => {
            return _columns.map(c => _.get(p, c, false))
        }))
    }, [filteredData, _columns, type])

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
        } else if(_width > rightAxisBreakpoint) {
            return marginsXl2
        } else {
            return margins
        }
    }, [
        margins,
        marginsMd,
        marginsXl2,
        windowSize,
        _width
    ])

    const chart = useMemo(() => {
        return {
            width: _width - _margins.left - _margins.right,
            height: _height - _margins.top - _margins.bottom
        }
    }, [_width, _height, _margins])

    const timelineChart = useMemo(() => {
        return {
            width: _width - _margins.left - _margins.right,
            height: timelineHeight
        }
    }, [_width, timelineHeight, _margins])

    const _xDomainFromData = useMemo(() => {
        if(xValueType === "number") {
            return [_.min(xValues), _.max(xValues)]
        } else if(xValueType === "date") {
            return [_.first(xValues), _.last(xValues)]
        } else {
            return xDomain
        }
    }, [xValueType, xDomain, xValues])

    const _xDomainFiltered = useMemo(() => {
            if(brushMoved === true || xDomain === "auto") {
                if(xValueType === "number") {
                    return [_.min(xValuesFiltered), _.max(xValuesFiltered)]
                } else if(xValueType === "date") {
                    return [_.first(xValuesFiltered), _.last(xValuesFiltered)]
                } else {
                    xDomain
                }
            } else {
                return xDomain
            }
    }, [xValuesFiltered, xDomain, xValueType, brushMoved])


    const xScaleFull = useMemo(() => {
        if(xValueType === "number") {
            return scaleLinear({
                range: [0, chart.width],
                domain: _xDomainFromData
            })
        } else if(xValueType === "date") {
            return scaleTime({
                range: [0, chart.width],
                domain: _xDomainFromData
            })
        }
    }, [chart.width, _xDomainFromData, xValueType])

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
            var min = _.min(yValuesForSelectedFilteredColumns)
            var max = _.max(yValuesForSelectedFilteredColumns)
            if (min > 0) {
                min = 0
            }
            return [min, max]
        } else {
            return yDomain
        }
    }, [yValuesForSelectedFilteredColumns, yDomain])

    const yScale = useMemo(() => {
        if(yScaleType === "log") {
            return scaleLog({
                range: [0, chart.height],
                domain: [1/1000000, _yDomainFiltered[1]],
                nice: true
            })
        } else {
            return scaleLinear({
                range: [0, chart.height],
                domain: _yDomainFiltered,
                nice: true
            })
        }
        
    }, [chart.height, _yDomainFiltered, yScaleType])

    const yScaleArea = useMemo(() => {
        if(yScaleType === "log") {
            return scaleLog({
                range: [0, chart.height],
                domain: [1/1000000, _yDomainFiltered[1]],
                nice: true
            })
        } else {
            return scaleLinear({
                range: [chart.height, 0],
                domain: _yDomainFiltered,
                nice: true
            })
        }
        
        
    }, [chart.height, _yDomainFiltered, yScaleType])

    const yScaleTimeline = useMemo(() => {
        if(yScaleType === "log") {
            return scaleLog({
                range: [0, timelineHeight],
                domain: [1/1000000, _yDomainFiltered[1]],
                nice: true
            })
        } else {
            return scaleLinear({
                range: [0, timelineHeight],
                domain: _yDomain
            })
        }
        
    }, [timelineHeight, _yDomain, _yDomainFiltered, yScaleType])

    const yScaleTimelineArea = useMemo(() => {
        if(yScaleType === "log") {
            return scaleLog({
                range: [0, timelineHeight],
                domain: [1/1000000, _yDomainFiltered[1]],
                nice: true
            })
        } else {
            return scaleLinear({
                range: [timelineHeight, 0],
                domain: _yDomain,
                nice: true
            })
        }
        
    }, [timelineHeight, _yDomain, _yDomainFiltered, yScaleType])



    /**
     * Prepare chart notes
     */

    const allChartNotes = useMemo(() => {
        var allNotes = []
        if(custom_note) {
            if(_.isArray(custom_note)) {
                allNotes = allNotes.concat(custom_note)
            } else {
                allNotes.push(custom_note)
            }
        }
        if(_.isArray(notes)) {
            allNotes = allNotes.concat(notes)
        }

        if(newNotes) {
            allNotes = allNotes.concat(newNotes)
        }
        if(newNotePreview) {
            allNotes.push(newNotePreview)
        }
        allNotes.forEach((n, n_i) => {
            if (!_.has(n, "id")) {
                n.id = `temp-id-${n_i}`
            }
        })

        return allNotes
    }, [custom_note, notes, newNotes, newNotePreview])
    
    const chartNotesInXRange = useMemo(() => {
        
        return allChartNotes.filter(note => {
            if(_.has(note, "date") && dayjs.isDayjs(note.date)) {
                return note.date.isBetween(_xDomainFiltered[0], _xDomainFiltered[1]) 
            } else {
                return false
            }
            
        })
    }, [ allChartNotes, _xDomainFiltered])

    useEffect(() => {
        if(brushZoomInitialized === false) {
            setBrushZoomInitialized(true)
            if(xDomain !== "auto") {                
                setFilteredData(_data.filter(p => {
                    if(xValueType === "date") {
                        return dayjs(p[xKey]).isAfter(
                                dayjs(xDomain[0]).add(-1, "day")
                            )
                            && dayjs(p[xKey]).isBefore(
                                dayjs(xDomain[1]).add(1, "day")
                            )
                    }
                }))
            }
        }
        
    }, [brushZoomInitialized, xDomain, _data, xKey, xValueType])

    var _containerMargins = _.cloneDeep(containerMargins)
    
    var xAxisLabelsPosition = "outside"

    if(windowWidth < rightAxisBreakpoint || _width < 700) {
        _containerMargins.right = -10
        xAxisLabelsPosition = "inside"
    }

    if(_width < 700 && windowWidth > 900) {
        xAxisLabelsPosition = "outside"
    }


    /**
     * Colors preparation
     */
    const colColors = _columns.map((col, col_i) => {
        var col_t = _columns.length === 1 ? 0.5 : col_i / (_columns.length - 1)
        var colColor = color
        if(_.isFunction(color)) {
            colColor = color(col_t)
        }
        return colColor
    })



    var dataColumnsProps = {
        columns: _filteredColumns,
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

    dataColumnsTimelineProps.data = _data
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

    const touchEnabled = isTouchEnabled()
    const hovered = hoveredXValue !== false

    return (
        <RecoilRoot>
        <ChartContext.Provider value={{
                colColors: colColors,
                hovered: hovered,
                columnsToggled: columnsToggled,
                setColumnsToggled: setColumnsToggled,
                toggleColumn: (col) => {
                    if(columnsToggled.includes(col)) {
                        setColumnsToggled(
                            columnsToggled.filter(c => c !== col)
                        )
                    } else {
                        var newColsToggled = _.cloneDeep(columnsToggled)
                        newColsToggled.push(col)
                        setColumnsToggled(
                            newColsToggled
                        )
                    }
                },
                addNote: (newNoteParams) => {
                    setNewNotes(newNotes.concat([newNoteParams]))
                },
                setNewNotePreview,
                controllingZoomBrush,
                setControllingZoomBrush,
                editedNotes,
                setEditedNotes,
                editingNote,
                setEditingNote
            }}>
            <Box className={styles["chart"]}
                ref={containerRef}
                style={{
                    marginLeft: _.get(_containerMargins, "left"),
                    marginTop: _.get(_containerMargins, "top"),
                    marginBottom: _.get(_containerMargins, "bottom"),
                    marginRight: _.get(_containerMargins, "right"),
                }}
                pointerEvents="none"
                zIndex={10}
                paddingTop="10px"
                >
                {_.isNumber(_width) && (
                    <>
                    <Box position="absolute" left="0px" right="0px"
                        style={{
                            marginLeft: _.get(_margins, "left"),
                            marginTop: _.get(_margins, "top"),
                            marginBottom: _.get(_margins, "bottom"),
                            marginRight: _.get(_margins, "right")
                        }}
                        zIndex={-1}
                        opacity={hovered ? 0.2 : 1}
                        >
                        <ChartNotes
                            editedNotes={editedNotes}
                            notes={chartNotesInXRange}
                            xScale={xScale}
                            yScale={yScale}
                            chart={chart}
                            />
                    </Box>
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
                        {badgesLegend && (
                            <BadgesLegend
                                columns={columns}
                                labelText={badgesLegendText}
                                />
                        )}
                        <HoverLabelsOverlay
                            data={_data}
                            columns={_filteredColumns}
                            xKey={xKey}
                            xValueType={xValueType}
                            hoveredXValue={hoveredXValue}
                            yAxisTickLabel={yAxisTickLabel}
                            noDataTooltipPlaceholder={noDataTooltipPlaceholder}
                            chart={chart}
                            xScale={xScale}
                            yScale={yScale}
                            colColors={colColors}
                            />
                        
                        
                    </Box>
                    <svg width={_width} height={_height}
                        style={{
                            position: "absolute",
                            zIndex: -20
                        }}
                        >
                        <g transform={`translate(${_margins.left}, ${margins.top})`}>
                            <g style={{pointerEvents: "none"}}>
                            <Grid
                                xScale={xScale}
                                yScale={yScale}
                                chart={chart}
                                yTickCount={yTickCount}
                                />
                            </g>
                        </g>
                    </svg>
                    <svg width={_width} height={_height}>
                        
                        <g transform={`translate(${_margins.left}, ${margins.top})`}>
                            <text
                                fontSize="0.7rem"
                                x={0}
                                y={-15}
                                fontWeight="bold"
                                >
                                {name}
                            </text>
                            <g style={{pointerEvents: "none"}}>
                            
                            
                            
                                
                                <DataColumns {...dataColumnsProps} />
                                <HoverTooltip
                                    data={_data}
                                    columns={_filteredColumns}
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
                                    yAxisTickLabel={yAxisTickLabel}
                                    dimValues={overlay === "weekly_trend"}
                                    ticks={yTickCount}
                                    />
                                <AxisBottom
                                    xScale={xScale}
                                    chart={chart}
                                    />
                            <g opacity={hovered ? 0.5 : 1}>
                            {overlay === "weekly_trend" && (
                                <WeeklyTrend
                                    data={data}
                                    chart={chart}
                                    xScale={xScale}
                                    yScale={yScale}
                                    endDate={endDate}
                                    trendKey={columns[0]}
                                    xDomainFiltered={_xDomainFiltered}
                                    />
                            )}
                            </g>
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
                            {noteEditingEnabled === true && (
                                <NotesXAxisOverlay
                                    chart={chart}
                                    margins={_margins}
                                    xScale={xScale}
                                    xValueType={xValueType}
                                    snapFunction={hoverSnapFunction}
                                    />
                            )}
                            
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
                            xDomain={_xDomainFromData}
                            xDomainFiltered={_xDomainFiltered}
                            height={timelineHeight}
                            setFilteredData={handleBrushMove}
                            xValueType={xValueType}
                            />
                    )}
                    </>
                )}
                
            </Box>
            {!touchEnabled && (
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    position="relative"
                    top="-30px"
                    pointerEvents="none"
                    >
                    <Text
                        onPointerDown={() => {
                            exportAsImage(containerRef.current, name)
                        }}
                        cursor="pointer"
                        _hover={{
                            background: "black",
                            color: "white"
                        }}
                        fontSize="0.7rem"
                        textAlign="right"     
                        pointerEvents="initial"               
                        >
                        Download as PNG
                    </Text>
                </Box>
            )}
            
        </ChartContext.Provider>
        </RecoilRoot>
    )
})


Chart.displayName = "Chart"

export default Chart