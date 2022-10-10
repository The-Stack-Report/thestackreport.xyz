import { localPoint } from "@visx/event"
import { clampDate } from "utils/dateUtils"
import dayjs from "dayjs"

export function findHoveredXValue(e, snapFunction, xScale, xValueType, margins) {
    var { x } = localPoint(e) || { x: 0 }
    x  -= margins.left
    var xDomain = xScale.domain()
    var x0 = 0
    if(xValueType === "date") {
        x0 = clampDate(snapFunction(xScale.invert(x)), dayjs(xDomain[0]).subtract(1, "second"), xDomain[1])

    } else {
        x0 = _.clamp(snapFunction(xScale.invert(x)), xDomain[0], xDomain[1])
    }
    return x0
}