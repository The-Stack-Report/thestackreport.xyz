import React, { useState, useRef, useEffect, useMemo } from "react"
import { useDebouncedCallback } from 'use-debounce'
import {
    Arc
} from '@visx/shape'
import {
    scaleLinear
} from "@visx/scale"
import _ from "lodash"
import chroma from "chroma-js"
import {
    useBreakpointValue
} from "@chakra-ui/react"


const PieChart = ({
    data,
    centerLabelTopLine = "",
    centerLabelBottomLine = "",
    size = "dynamic",
    color = "pink",
    radius = 150,
    margins = 20,
    maxHeight = 500
}) => {
    const containerRef = useRef(null)
    const [dimensions, setDimensions] = useState({ size: size })
    const [windowResizeCounter, setWindowResizeCounter] = useState(0)
    const labelMinShift = useBreakpointValue({ base: 10, md: 20})


    const handleResize = useDebouncedCallback(
        () => {
            setWindowResizeCounter((c) => c + 1)
        },
        5
    );

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    
    useEffect(() => {
        if(containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            })
        }
    }, [containerRef, windowResizeCounter])

    const _width = useMemo(() => {
        return _.get(dimensions, "width", maxHeight)
    }, [dimensions, maxHeight])

    const _height = useMemo(() => {
        return maxHeight
    }, [maxHeight])

    const _size = useMemo(() => {
        if(_.isNumber(size)) {
            return size
        } else {
            return _.min([_width, maxHeight])
        }
    }, [size, _width, maxHeight])

    const _radius = useMemo(() => {
        return _size / 2 - margins
    }, [_size, margins])

    const totalValue = useMemo(() => {
        return _.sum(data.map(p => _.get(p, "value", 0)))
    }, [data])

    const _dataProcessed = useMemo(() => {
        var sumValue = 0
        return _.sortBy(data, "value").reverse().map(p => {
            sumValue += _.get(p, "value", 0)
            return {
                ...p,
                _sumValue: _.cloneDeep(sumValue)
            }
        })
    }, [data])

    const radiusScale = useMemo(() => {
        return scaleLinear({
            range: [0, Math.PI * 2],
            domain: [0, totalValue]
        })
    }, [totalValue])

    const colColors = _dataProcessed.map((col, col_i) => {
        var col_t = _dataProcessed.length === 1 ? 0.5 : col_i / (_dataProcessed.length - 1)
        var colColor = color
        if(_.isFunction(color)) {
            colColor = color(col_t)
        }
        return colColor
    })

    var labelYDiff = 0
    var prevLabelYPos = 0
    return (
        <div
            ref={containerRef}
            >
            <svg width={_width} height={_height}
                style={{overflow: "visible"}}
                >
                <g transform={`translate(${_width /2}, ${_height / 2})`}>
                    <text
                        x={0}
                        y={-2}
                        fontSize="0.8rem"
                        fontWeight="bold"
                        textAnchor="middle"
                        >
                        {centerLabelTopLine}
                    </text>
                    <text
                        x={0}
                        y={2}
                        alignmentBaseline="hanging"
                        fontSize="0.8rem"
                        fontStyle="italic"
                        textAnchor="middle"
                        >
                        {centerLabelBottomLine}
                    </text>

                    {_dataProcessed.map((p, p_i, p_a) => {
                        var p_t = p_i / p_a.length
                        var val = _.get(p, "value", 0)
                        var startAngle = radiusScale(p._sumValue - val)
                        var endAngle = radiusScale(p._sumValue)

                        var angleDiff = endAngle - startAngle
                        var midAngle = startAngle + angleDiff / 2
                        var midAnglePos = {
                            x: Math.sin(Math.PI - midAngle) * _radius,
                            y: Math.cos(Math.PI - midAngle) * _radius
                        }
                        var labelRadialShift = 0.1
                        var labelPositions = [
                            {
                                x: Math.sin(Math.PI - midAngle - labelRadialShift) * _radius,
                                y: Math.cos(Math.PI - midAngle - labelRadialShift) * _radius
                            },{
                                x: Math.sin(Math.PI - midAngle) * _radius,
                                y: Math.cos(Math.PI - midAngle) * _radius
                            },{
                                x: Math.sin(Math.PI - midAngle + labelRadialShift) * _radius,
                                y: Math.cos(Math.PI - midAngle + labelRadialShift) * _radius
                            }
                        ]
                        labelPositions = _.sortBy(labelPositions, "y")

                        var fillColor = colColors[p_i]

                        var labelPos = _.cloneDeep(midAnglePos)
                        var labelAnchor = "start"
                        var radiusMultiplier = 2.5
                        if(labelPos.x > 0) {
                            labelPos.x += 20
                            var totalShift = Math.abs(labelPos.y/_radius) * radiusMultiplier
                            labelPositions.forEach((pos) => {
                                pos.x += _.max([labelMinShift * totalShift, labelMinShift])
                            })
                        } else {
                            labelPos.x -= 20
                            labelAnchor = "end"
                            var totalShift = Math.abs(labelPos.y/_radius) * radiusMultiplier
                            labelPositions.forEach((pos) => {
                                pos.x -= _.max([labelMinShift * totalShift, labelMinShift])
                            })
                        }

                        if(Math.abs(prevLabelYPos - midAnglePos.y) < 15) {
                            if(prevLabelYPos < midAnglePos.y) {
                                labelPos.y = prevLabelYPos + 20
                            } else {
                                labelPos.y = prevLabelYPos - 20
                            }
                        }

                        prevLabelYPos = labelPos.y
                        
                        var percentageValue = _.round(_.get(p, "value", 0)/totalValue * 100)
                        return (
                            <g key={p_i}>
                            
                            <Arc
                                innerRadius={_radius - 5}
                                outerRadius={_radius + 5}
                                startAngle={startAngle}
                                endAngle={endAngle - 0.02}
                                opacity={1}
                                fill={fillColor}
                                stroke={chroma(fillColor).darken(1.5)}
                                strokeWidth={1}
                                />
                            {percentageValue > 4 && (
                                <>
                                    <text
                                        x={labelPositions[0].x}
                                        y={labelPositions[1].y - 14}
                                        fontSize="0.7rem"
                                        textAnchor={labelAnchor}
                                        fontWeight="bold"
                                        >
                                        {_.get(p, "key", "key-not-found")}
                                    </text>
                                    <text
                                        x={labelPositions[1].x}
                                        y={labelPositions[1].y}
                                        fontSize="0.7rem"
                                        textAnchor={labelAnchor}
                                        >
                                        {_.get(p, "value", 0).toLocaleString()} calls
                                    </text>
                                    <text
                                        x={labelPositions[2].x}
                                        y={labelPositions[1].y + 14}
                                        fontSize="0.7rem"
                                        textAnchor={labelAnchor}
                                        opacity={0.6}
                                        fontStyle="italic"
                                        >
                                        {percentageValue}%
                                    </text>
                                </>
                            )}
                            </g>
                        )
                    })}
                </g>
            </svg>
        </div>
    )
}

export default PieChart