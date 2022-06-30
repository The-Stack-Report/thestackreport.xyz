import React, { useState, useEffect, useRef, useMemo } from "react"
import {
    Box,
    Button,
    RangeSlider,
    RangeSliderTrack,
    RangeSliderFilledTrack,
    RangeSliderThumb
} from "@chakra-ui/react"
import { PatternLines } from '@visx/pattern'
import DataColumns from "./DataColumns"
import { Brush } from '@visx/brush'
import isTouchEnabled from "utils/isTouchEnabled"
import dayjs from "dayjs"
import _ from "lodash"
import {
    dataInDateRange
} from "utils/dataRangeUtils"

const PATTERN_ID = 'brush_pattern';

const selectedBrushStyle = {
    fill: `url(#${PATTERN_ID})`,
    stroke: 'rgb(150,150,150)',
};

const TimelineBrush = ({
    dataColumnsProps,
    setFilteredData,
    width,
    margins,
    xDomain,
    xDomainFiltered,
    xValueType,
    xScaleFull,
    height= 30
}) => {
    const brushRef = useRef(null)

    const [touchEnabled, setTouchEnabled] = useState("initialized")
    const [touchSliderValues, setTouchSliderValues] = useState(false)
    var chart = dataColumnsProps.chart
    /**
     * Brush parameters preparation
     */

    const brushMargins = useMemo(() => {
        return {
            left: margins.left,
            right: margins.right,
            top: 0,
            bottom: 0
        }
    }, [margins])
    
        // Brush bounds
    const xMax = dataColumnsProps.chart.width
    const yMax = height
    const xBrushMax = xMax
    const yBrushMax = height


    useEffect(() => {
        if(touchSliderValues === false) {
            setTouchSliderValues(xDomain.map(p => {
                if(_.isNumber(p)) {
                    return p
                } else if(dayjs.isDayjs(p)) {
                    return p.unix()
                }
            }))
        }
    }, [touchSliderValues, xDomain])


    useEffect(() => {
        if(touchEnabled === "initialized") {
            setTouchEnabled(isTouchEnabled())
        }
    }, [touchEnabled])

    const initialBrushPosition = useMemo(() => {
        return {
            start: {x: xScaleFull(xDomainFiltered[0])},
            end: {x: xScaleFull(xDomainFiltered[1])}
        }
    }, [xDomainFiltered, xScaleFull])

    const onBrushChange = (domain) => {
        if(!domain) return
        const { x0, x1 } = domain
        var newDomain = [x0, x1]
        if(xValueType === "date") {
            newDomain = newDomain.map(p => dayjs(p))
            setFilteredData(dataInDateRange(dataColumnsProps.data, newDomain))
        } else {
            setFilteredData(dataColumnsProps.data.filter(p => {
                return _.inRange(p[dataColumnsProps.xKey], newDomain[0], newDomain[1])
            }))
        }
        
    }

    var xDomainValues = xDomain.map(d => {
        if (dayjs.isDayjs(d)) {
            return d.unix()
        } else {
            return d
        }
    })

    var brushPreviewWidth = dataColumnsProps.xScale(dayjs(touchSliderValues[1] * 1000)) - dataColumnsProps.xScale(dayjs(touchSliderValues[0] * 1000))
    if(_.isNaN(brushPreviewWidth)) {
        brushPreviewWidth = 0
    }
    return (
        <Box>
            <svg width={width} height={height}>
                <g transform={`translate(${margins.left}, 0)`}>
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
                            width={brushPreviewWidth}
                            height={30}
                            x={dataColumnsProps.xScale(dayjs(touchSliderValues[0] * 1000))}
                            y={0}
                            />
                    ) : (
                        <Brush
                            xScale={dataColumnsProps.xScale}
                            yScale={dataColumnsProps.yScale}
                            resizeTriggerAreas={['left', 'right']}
                            brushDirection="horizontal"
                            innerRef={brushRef}
                            width={xBrushMax}
                            height={yBrushMax}
                            handleSize={8}
                            margin={brushMargins}
                            onChange={onBrushChange}
                            onPointerDown={() => setFilteredData(dataColumnsProps.data)}
                            initialBrushPosition={initialBrushPosition}
                            selectedBoxStyle={selectedBrushStyle}
                            useWindowMoveEvents
                            />
                    )}
                    <g style={{pointerEvents: 'none'}}>
                        <DataColumns
                            {...dataColumnsProps}
                            />
                    </g>
                </g>
            </svg>
            {(touchEnabled === true && _.isArray(touchSliderValues)) && (
                <Box padding="1rem">
                    <RangeSlider
                        colorScheme="gray"
                        min={xDomainValues[0]}
                        max={xDomainValues[1]}
                        value={touchSliderValues}
                        onChange={(_range) => {
                            setTouchSliderValues(_range)
                            var multiplier = 1
                            if(xValueType === "date") {
                                multiplier = 1000
                            }
                            onBrushChange({
                                x0: _range[0] * multiplier,
                                x1: _range[1] * multiplier
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
                paddingBottom="0rem"
                paddingLeft={`${margins.left}px`}
                >
                <Button onPointerDown={() => {
                    if(xValueType === "date") {
                        setTouchSliderValues(xDomain.map(p => p.unix()))
                    } else {
                        setTouchSliderValues(xDomain)
                    }
                    onBrushChange({
                        x0: xDomain[0],
                        x1: xDomain[1]
                    })
                    
                    if (brushRef?.current) {
                        setFilteredData(dataColumnsProps.data);
                        brushRef.current.reset();
                    }
                    }}
                    size="small"
                    padding="0.3rem"
                    fontSize="0.8rem"
                    width="5rem"
                    marginRight="1rem" >
                    Reset
                </Button>
            </Box>
        </Box>
    )
}

export default TimelineBrush