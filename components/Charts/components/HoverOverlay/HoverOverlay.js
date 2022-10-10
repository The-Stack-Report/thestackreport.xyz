import React from "react"
import { Bar } from "@visx/shape"
import _ from "lodash"
import { findHoveredXValue } from "utils/chart-interactions"

const HoverOverlay = ({
    xScale,
    xValueType = "number",
    chart,
    margins,
    hoveredXValue,
    setHoveredXValue,
    snapFunction = (val) => val
}) => {
    const width = _.get(chart, "width", false)
	const height = _.get(chart, "height", false)
	if(!_.isNumber(width)) return null
	if(_.isNaN(width)) return null
	if(!_.isNumber(height)) return null
	if(_.isNaN(height)) return null
    
    function handleTooltip(e) {
        var x = findHoveredXValue(e, snapFunction, xScale, xValueType, margins)
        if(x !== hoveredXValue) {
            setHoveredXValue(x)
        }
    }
    function hideTooltip() {
        setHoveredXValue(false)
    }
    return (
        <Bar
            x={-10}
            y={0}
            width={width + 20}
            height={height}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
            fill="transparent"
            cursor="crosshair"
            pointerEvents="initial"
            />
    )
}

export default HoverOverlay