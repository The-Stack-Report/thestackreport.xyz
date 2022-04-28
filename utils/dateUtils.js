import dayjs from "dayjs"

export function toDayjs(date) {
	if (dayjs.isDayjs(date)) {
		return date
	} else {
		return dayjs(date)
	}
}

export function clampDate(date, min, max) {
	var dt = toDayjs(date)
	if (dt.isBefore(toDayjs(min))) {
		dt = min
	} else if(dt.isAfter(toDayjs(max))) {
		dt = max
	}
	return dayjs.isDayjs(dt) ? dt : dayjs(dt)

}
