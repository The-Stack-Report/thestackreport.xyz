import React from "react"
import { Bar } from "@visx/shape"
import { localPoint } from "@visx/event"
import { clampDate } from "utils/dateUtils"
import dayjs from "dayjs"
import _ from "lodash"

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
        var { x } = localPoint(e) || { x: 0 }
        x  -= margins.left
        var xDomain = xScale.domain()
        var x0 = 0
        if(xValueType === "date") {
            x0 = clampDate(snapFunction(xScale.invert(x)), dayjs(xDomain[0]).subtract(1, "second"), xDomain[1])

        } else {
            x0 = _.clamp(snapFunction(xScale.invert(x)), xDomain[0], xDomain[1])
        }
        if(x0 !== hoveredXValue) {
            setHoveredXValue(x0)
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
            />
    )
}

export default HoverOverlay