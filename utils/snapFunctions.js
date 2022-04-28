import dayjs from "dayjs"
import _ from "lodash"

export function snapToEndOfDay(dt) {
    if(dayjs.isDayjs(dt)) {
        return dt.subtract(12, "hour").endOf("day")
    } else if(_.isString(dt) || dt instanceof Date) {
        return dayjs(dt).subtract(12, "hour").endOf("day")
    } else {
        return dt
    }
}
