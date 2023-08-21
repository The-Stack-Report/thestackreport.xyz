import React, {
    useState,
    useRef,
    useEffect,
    useMemo,
    createContext,
    useContext
} from "react"
import _ from "lodash"
import {
    marginsDefault,
    marginsMdDefault,
    marginsXl2Default,
    containerDefaultMargins
} from "components/Charts/constants/marginDefaults"
import useWindowSize from "utils/useWindowSize"
import { breakpoints } from "styles/breakpoints"
import dayjs from "dayjs"
import Grid from "components/Charts/components/Grid"
import HoverOverlay from "components/Charts/components/HoverOverlay"
import HoverLabelsOverlay from "./HoverLabelsOverlay"
import HoverTooltip from "./HoverTooltip"
import {
    Box,
    Text,
    Tooltip
} from "@chakra-ui/react"
import styles from "./Chart.module.scss"
import { useDebouncedCallback } from 'use-debounce'
import AxisRight from "components/Charts/components/AxisRight"
import AxisBottom from "components/Charts/components/AxisBottom"
import DataColumns from "./DataColumns"
import TimelineBrush from "./TimelineBrush"
import BadgesLegend from "components/Charts/components/BadgesLegend"
import DatasetPreview from "components/Charts/components/DatasetPreview"
import ChartNotes from "./overlays/ChartNotes"
import { snapToEndOfDay } from "utils/snapFunctions"
import { exportAsImage } from "utils/exportAsImage"
import isTouchEnabled from "utils/isTouchEnabled"
import WeeklyTrend from "./overlays/WeeklyTrend"
import isBetween from "dayjs/plugin/isBetween"
import NotesXAxisOverlay from "components/Charts/components/NotesXAxisOverlay"
import NoteAlertMessages from "./overlays/ChartNotes/NoteAlertMessages"
import { RecoilRoot } from "recoil"
import NotesSettings from "./overlays/ChartNotes/NotesSettings"
import { WalletContext } from "components/Wallet/WalletContext"
import useChartNotes from "./overlays/ChartNotes/useChartNotes"
import useScales from "./hooks/useScales"
import usePreparedData from "./hooks/usePreparedData"
import useDomains from "./hooks/useDomains"

dayjs.extend(isBetween)

function dateKeyVal(val) {
    return dayjs.isDayjs(val) ? val : dayjs(val)
}

var rightAxisBreakpoint = 1367

export const ChartContext = createContext()

const noteLayersVisibilityInitialState = {
    curated: true,
    community: false,
    private: true
}

const Chart = React.memo((props) => {
    const {
        name = "Chart",
        chartId = false,
        data = [],
        dataset = false,
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
        endDate = false,
        showChartNotes = false
    } = props
        
    const _data = usePreparedData({ data, xValTransform })
    const containerRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width: width, height: 400 })
    const [windowResizeCounter, setWindowResizeCounter] = useState(0)
    const [filteredData, setFilteredData] = useState(_data)
    const [brushMoved, setBrushMoved] = useState(false)
    const [brushZoomInitialized, setBrushZoomInitialized] = useState(false)
    const [columnsToggled, setColumnsToggled] = useState(initialColumnToggles)
    const [selectedNote, setSelectedNote] = useState(false)
    
    const [controllingZoomBrush, setControllingZoomBrush] = useState(false)
    const [editedNotes, setEditedNotes] = useState({})
    const [editingNote, setEditingNote] = useState(false)
    const [hoveredXValue, setHoveredXValue] = useState(false)
    const [noteLayers, setNoteLayers] = useState(noteLayersVisibilityInitialState)
   
    const walletContext = useContext(WalletContext)


    useEffect(() => {
        setBrushZoomInitialized(false)
    }, [dataHash])
    
    useEffect(() => {
        if(windowResizeCounter === 0) setWindowResizeCounter(1) 
    }, [windowResizeCounter])

    const handleResize = useDebouncedCallback(
        () => setWindowResizeCounter((c) => c + 1), 50
    );

    useEffect(() => {
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
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


    const windowSize = useWindowSize()

    const _height = useMemo(() => {
        if(windowSize.height < height * 0.75) {
            return windowSize.height * 0.6
        } else {
            return height
        }
    }, [windowSize, height])

    useEffect(() => {
        if(containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            })
        }
    }, [containerRef, windowResizeCounter])

    const windowWidth = useMemo(() => {
        return _.get(windowSize, "width", 500)
    }, [windowSize])



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


    

    
    

    /****************************************
     * Prepare domains
     */

    const {
        _xDomainFromData,
        _xDomainFiltered,

        _yDomain,
        _yDomainFiltered
    } = useDomains({
        brushMoved,
        xDomain,
        xValueType,
        xValues,
        xValuesFiltered,
        yDomain,
        _data,
        filteredData,
        _columns,
        _filteredColumns,
        type
    })

    

    
    /****************************************
     * Prepare scales
     */

    const {
        xScale,
        xScaleFull,
        yScale,
        yScaleArea,
        yScaleTimeline,
        yScaleTimelineArea
    } = useScales({
        chart,
        _xDomainFromData,
        _xDomainFiltered,
        xValueType,

        _yDomain,
        _yDomainFiltered,
        yScaleType,

        timelineHeight
    })

    
    /****************************************
     * Prepare chart notes
     */

    

    const chartNotesState = useChartNotes({
        chartId: chartId,
        walletContext: walletContext,
        propNotes: notes,
        custom_note: custom_note,
        _xDomainFiltered: _xDomainFiltered,
        noteLayers: noteLayers
    })

    var apiNotes = useMemo(() => _.get(chartNotesState, "notes", []) , [chartNotesState])

    const {
        allChartNotes,
        notesInXRange,
        communityNotesVisible,
        visibleChartNotes,
        communityNotesInXRange
    } = chartNotesState

    /****************************************
     * Initialize brush zoom
     */

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


    /****************************************
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
    var hovered = hoveredXValue !== false

    var hoveredChart = hoveredXValue !== false

    if (chartNotesState.hoveredNote) {
        hovered = true
    }


    const handleBrushMove = (newFilteredData) => {
        setFilteredData(newFilteredData)
        setBrushMoved(true)
    }
    
    return (
        <RecoilRoot>
        <ChartContext.Provider value={{
                colColors: colColors,
                hovered: hovered,
                columnsToggled: columnsToggled,
                setColumnsToggled: setColumnsToggled,
                toggleColumn: (col) => {
                    if(columnsToggled.includes(col)) {
                        setColumnsToggled( columnsToggled.filter(c => c !== col) )
                    } else {
                        var newColsToggled = _.cloneDeep(columnsToggled)
                        newColsToggled.push(col)
                        setColumnsToggled(newColsToggled)
                    }
                },
                addNote: (newNoteParams) => {
                    chartNotesState.setNewNotes(chartNotesState.newNotes.concat([newNoteParams]))
                },
                newNotes: chartNotesState.newNotes,
                setNewNotes: chartNotesState.newNotes,
                apiNotes,
                postNote: chartNotesState.postNote,
                deleteNote: chartNotesState.deleteNote,
                setNewNotePreview: chartNotesState.setNewNotePreview,
                controllingZoomBrush,
                setControllingZoomBrush,
                editedNotes,
                setEditedNotes,
                editingNote,
                setEditingNote,
                noteLayers,
                setNoteLayers,

                hoveredNote: chartNotesState.hoveredNote,
                setHoveredNote: chartNotesState.setHoveredNote
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
                    {showChartNotes && (
                        <>
                            <Box
                                position="absolute"
                                left="0px"
                                right="0px"
                                style={{
                                    marginLeft: _.get(_margins, "left"),
                                    marginTop: _.get(_margins, "top"),
                                    marginBottom: _.get(_margins, "bottom"),
                                    marginRight: _.get(_margins, "right")
                                }}
                                zIndex={-1}
                                opacity={hoveredChart ? 0.2 : 1}
                                >
                                <ChartNotes
                                    editedNotes={editedNotes}
                                    notes={visibleChartNotes}
                                    xScale={xScale}
                                    yScale={yScale}
                                    chart={chart}
                                    chartId={chartId}
                                    />
                            </Box>
                            <>
                            {noteEditingEnabled && (
                                <>
                                <Tooltip label="Show community notes." placement="top">
                                <Box
                                    position="absolute"
                                    zIndex={-100}
                                    top="13px"
                                    left={`${_margins.left}px`}
                                    width={`${chart.width}px`}
                                    height="22px"
                                    cursor="pointer"
                                    background="transparent"
                                    pointerEvents="initial"
                                    border="1px solid transparent"
                                    _hover={{
                                        background: "rgba(0,0,0,0.02)",
                                        border: "1px solid rgba(0,0,0,0.1)"
                                    }}
                                    onPointerDown={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                        setNoteLayers({
                                            ...noteLayers,
                                            community: !noteLayers.community
                                        })
                                        chartNotesState.setHoveredNote(false)
                                    }}
                                    
                                    >
                                    {communityNotesVisible.map((note, note_i) => {
                                        var leftPos = xScale(note.date)
                                        if(!noteLayers.community) {
                                            return (
                                                <Box
                                                    key={note_i}
                                                    width="4px"
                                                    height="10px"
                                                    borderRadius="2px"
                                                    position="absolute"
                                                    left={`${leftPos-2}px`}
                                                    top="7px"
                                                    background="gray.500"
                                                    opacity={0.3}
                                                    />
                                            )
                                        }
                                        return null
                                        
                                    })}
                                    
                                </Box>
                                </Tooltip>
                                <Box
                                    position="absolute"
                                    left={`${chart.width + 20}px`}
                                    top="-40px"
                                    zIndex={10}
                                    >
                                    <NotesSettings />
                                </Box>
                                
                                </>
                            )}
                            </>
                        </>
                    )}
                    

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
                                    chartId={chartId}
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
                    {dataset && (
                        <React.Fragment>
                            <Text
                                fontSize="0.7rem"
                                opacity={0.5}
                                marginLeft="1rem"
                                marginRight="1rem"
                                >-</Text>
                        <DatasetPreview
                            dataset={dataset}
                            />
                        </React.Fragment>
                    )}
                </Box>
            )}
            
            <NoteAlertMessages />
        </ChartContext.Provider>
        </RecoilRoot>
    )
})


Chart.displayName = "Chart"

export default Chart