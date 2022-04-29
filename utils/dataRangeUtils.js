import _ from "lodash"
import dayjs from "dayjs"

/**
 * Function that extracts numbers from each object attribute in a data array
 * and returns the max
 */
export function findMaxValueInData(data) {
	return _.max(_.flatten(data.map(p => {
		return _.values(p).filter(v => _.isNumber(v))
	})))
}

export function findDataRangeInData(data) {
	const values = _.flatten(data.map(p => {
		return _.values(p).filter(v => _.isNumber(v))
	}))

	return [_.min(values), _.max(values)]
}

export function dateInRange(date, range) {
	return date.isAfter(range[0]) && date.isBefore(range[1])
}

export function dataInDateRange(data, dateRange, dateKey="date") {
	var _dateRange = dateRange.map(d => {
		if (dayjs.isDayjs(d)) {
			return d
		} else {
			return dayjs(d)
		}
	})

	return data.filter(p => {
		if(_.has(p, dateKey)) {
			if(dayjs.isDayjs(p[dateKey])) {
				return dateInRange(_date, _dateRange)
			} else {
				var _date = dayjs(p[dateKey])
				return dateInRange(_date, _dateRange)
			}
		} else {
			return false
		}
	})
}


export function getDateRange(dates) {
	var datesParsed = _.sortBy(dates.map(date => {
		if(dayjs.isDayjs(date)) {
			return date
		}
		if(_.isString(date)) {
			return dayjs(date)
		}
		// Potentially a unix number
		if(_.isNumber(date)) {
			return dayjs(date)
		}
		throw "Unknown date type"
	}))
	return [
		_.first(datesParsed),
		_.last(datesParsed)
	]
}

function _datetimeToDate(date) {
	var _date = false
	if(dayjs.isDayjs(date)) {
		_date = date
	}
	if(_.isString(date)) {
		_date = dayjs(date)
	}
	// Potentially a unix number
	if(_.isNumber(date)) {
		_date = dayjs(date)
	}
	return dayjs(_date.format("YYYY-MM-DD"))
}


export function datetimeToDate(dates) {
	if (_.isArray(dates)) {
		return dates.map(d => _datetimeToDate(d))
	} else {
		return _datetimeToDate(dates)
	}
}

export default findMaxValueInData