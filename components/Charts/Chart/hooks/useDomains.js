import React, { useMemo } from "react"
import _  from "lodash"

function useDomains({
    brushMoved,

    xDomain,

    xValues,
    xValuesFiltered,
    xValueType,

    yDomain,


    _data,
    filteredData,
    _columns,
    _filteredColumns,
    type,
    
    
}) {


    const yValues = useMemo(() => {
        if(type === "boxplot") {
            return _data.map(p => {
                return _.get(p, `${_columns[0]}.max`, 0)
            })
        }
        return _.flatten(_data.map(p => {
            return _columns.map(c => _.get(p, c, false))
        }))
    }, [_data, _columns, type])

    const yValuesForSelectedFilteredColumns = useMemo(() => {
        if(type === "boxplot") {
            return filteredData.map(p => {
                return _.get(p, `${_columns[0]}.max`, 0)
            })
        }
        return _.flatten(filteredData.map(p => {
            return _filteredColumns.map(c => _.get(p, c, false))
        }))
    }, [filteredData, _filteredColumns, _columns, type])

    const yValuesFiltered = useMemo(() => {
        if(type === "boxplot") {
            return filteredData.map(p => {
                return _.get(p, `${_columns[0]}.max`, 0)
            })
        }
        return _.flatten(filteredData.map(p => {
            return _columns.map(c => _.get(p, c, false))
        }))
    }, [filteredData, _columns, type])



    const _xDomainFromData = useMemo(() => {
        if(xValueType === "number") {
            return [_.min(xValues), _.max(xValues)]
        } else if(xValueType === "date") {
            return [_.first(xValues), _.last(xValues)]
        } else {
            return xDomain
        }
    }, [xValueType, xDomain, xValues])

    const _xDomainFiltered = useMemo(() => {
        if(brushMoved === true || xDomain === "auto") {
            if(xValueType === "number") {
                return [_.min(xValuesFiltered), _.max(xValuesFiltered)]
            } else if(xValueType === "date") {
                return [_.first(xValuesFiltered), _.last(xValuesFiltered)]
            } else {
                xDomain
            }
        } else {
            return xDomain
        }
}, [xValuesFiltered, xDomain, xValueType, brushMoved])


    const _yDomain = useMemo(() => {
        if(yDomain === "auto") {
            var min = _.min(yValues)
            var max = _.max(yValues)
            if (min > 0) {
                min = 0
            }
            return [min, max]
        } else {
            return yDomain
        }
    }, [yValues, yDomain])

    const _yDomainFiltered = useMemo(() => {
        if(yDomain === "auto") {
            var min = _.min(yValuesForSelectedFilteredColumns)
            var max = _.max(yValuesForSelectedFilteredColumns)
            if (min > 0) {
                min = 0
            }
            return [min, max]
        } else {
            return yDomain
        }
    }, [yValuesForSelectedFilteredColumns, yDomain])

    return {
        _xDomainFromData: _xDomainFromData,
        _xDomainFiltered: _xDomainFiltered,
        _yDomain: _yDomain,
        _yDomainFiltered: _yDomainFiltered
    }
}

export default useDomains