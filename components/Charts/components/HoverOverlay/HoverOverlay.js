import React from "react"
import { Bar } from "@visx/shape"
import { localPoint } from "@visx/event"
import { clampDate } from "utils/dateUtils"
import dayjs from "dayjs"

const HoverOverlay = ({
    xScale,
    chart,
    margins,
    hoveredXValue,
    setHoveredXValue,
    snapFunction = (val) => val
}) => {
    function handleTooltip(e) {
        var { x } = localPoint(e) || { x: 0 }
        x  -= margins.left
        var xDomain = xScale.domain()
        var x0 = clampDate(snapFunction(xScale.invert(x)), dayjs(xDomain[0]).subtract(1, "minute"), xDomain[1])
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
            width={chart.width + 20}
            height={chart.height}
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