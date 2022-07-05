import React, { useState, useRef, useMemo, useEffect } from "react"
import {
    Box,
    useBreakpointValue
} from "@chakra-ui/react"
import {
    ArrowDownIcon
} from "@chakra-ui/icons"
import {
    Arc
} from '@visx/shape'
import { useDebouncedCallback } from 'use-debounce'
import * as d3 from "d3"
import _ from "lodash"

const linearLine = d3.line()
    .x(p => p.x)
    .y(p => p.y)
    .curve(d3.curveLinear)

const PieArrowTop = ({
    maxHeight = 500
}) => {
    const containerRef = useRef(null)
    const [dimensions, setDimensions] = useState({})
    const [windowResizeCounter, setWindowResizeCounter] = useState(0)
    const arrowType = useBreakpointValue({ base: "direct", md: "partial", lg: "corner"})

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

    useEffect(() => {
        if(windowResizeCounter === 0) {
            setWindowResizeCounter(1)
        }
    }, [windowResizeCounter])

    const _width = useMemo(() => {
        return _.get(dimensions, "width", maxHeight)
    }, [dimensions, maxHeight])


    if (arrowType === "direct") {
        return (
            <Box
                textAlign="center"
                >
                <ArrowDownIcon />
            </Box>
        )
    }
    if(arrowType === "partial") {
        return (
            <Box
                textAlign="center"
                >
                <ArrowDownIcon />
            </Box>
        )
    }
    
    // Returning arrow corner

    var radius = 20

    const p1 = {x: 50, y: 0}
    const p2 = {x: _width / 2 - (maxHeight / 2 + 30), y: maxHeight / 2}


    const p3 = {x: _width / 2 + (maxHeight / 2 + 30), y: maxHeight / 2}
    const p4 = {x: _width - 50, y: maxHeight - 5}

    const arrowSize = 5

    var inputArrowPoints = [
        {x: p2.x + 3, y: p2.y},
        {x: p2.x + 3 - arrowSize * 1.5, y: p2.y - arrowSize},
        {x: p2.x + 3 - arrowSize * 1.5, y: p2.y + arrowSize}
    ]
    var outputArrowPoints = [
        {x: p4.x, y: p4.y + 3},
        {x: p4.x - arrowSize, y: p4.y + 3 - arrowSize * 1.5},
        {x: p4.x + arrowSize, y: p4.y + 3 - arrowSize * 1.5},
    ]

    return (
        <Box
            ref={containerRef}
            position="absolute"
            pointerEvents="none"
            height={maxHeight}
            left={0}
            right={0}
            >
            <svg width={_width} height={maxHeight}>
                <line
                    x1={p1.x}
                    x2={p1.x}
                    y1={p1.y}
                    y2={p2.y - radius}
                    stroke="grey"
                    />
                <line
                    x1={p1.x + radius}
                    x2={p2.x}
                    y1={p2.y}
                    y2={p2.y}
                    stroke="grey"
                    />
                <g transform={`translate(${p1.x + radius}, ${p2.y - radius})`}>
                    <Arc
                        innerRadius={radius}
                        outerRadius={radius}
                        fill="transparent"
                        stroke="grey"
                        startAngle={Math.PI}
                        endAngle={Math.PI * 1.5}
                        />
                </g>
                <path
                    d={`${linearLine(inputArrowPoints)}Z`}
                    stroke="grey"
                    fill="white"
                    />


                <line
                    x1={p3.x}
                    x2={p4.x - radius}
                    y1={p3.y}
                    y2={p3.y}
                    stroke="grey"
                    />
                <line
                    x1={p4.x}
                    x2={p4.x}
                    y1={p3.y + radius}
                    y2={p4.y}
                    stroke="grey"
                    />
                <g transform={`translate(${p4.x - radius}, ${p3.y + radius})`}>
                    <Arc
                        innerRadius={radius}
                        outerRadius={radius}
                        fill="transparent"
                        stroke="grey"
                        startAngle={0}
                        endAngle={Math.PI * 0.5}
                        />
                </g>
                <path
                    d={`${linearLine(outputArrowPoints)}Z`}
                    stroke="grey"
                    fill="white"
                    />
            </svg>
        </Box>
    )
}

export default PieArrowTop