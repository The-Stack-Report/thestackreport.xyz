import React, { useMemo } from "react"
import {
    scaleLinear,
    scaleLog,
    scaleTime
} from "@visx/scale"

function useScales({
    chart,
    _xDomainFromData,
    _xDomainFiltered,
    xValueType,

    _yDomain,
    _yDomainFiltered,
    yScaleType,

    timelineHeight
}) {

    const xScaleFull = useMemo(() => {
        if(xValueType === "number") {
            return scaleLinear({
                range: [0, chart.width],
                domain: _xDomainFromData
            })
        } else if(xValueType === "date") {
            return scaleTime({
                range: [0, chart.width],
                domain: _xDomainFromData
            })
        }
    }, [chart.width, _xDomainFromData, xValueType])


    const xScale = useMemo(() => {
        if(xValueType === "number") {
            return scaleLinear({
                range: [0, chart.width],
                domain: _xDomainFiltered
            })
        } else if(xValueType === "date") {
            return scaleTime({
                range: [0, chart.width],
                domain: _xDomainFiltered
            })
        }
    }, [chart.width, _xDomainFiltered, xValueType])



    const yScale = useMemo(() => {
        if(yScaleType === "log") {
            return scaleLog({
                range: [0, chart.height],
                domain: [1/1000000, _yDomainFiltered[1]],
                nice: true
            })
        } else {
            return scaleLinear({
                range: [0, chart.height],
                domain: _yDomainFiltered,
                nice: true
            })
        }
        
    }, [chart.height, _yDomainFiltered, yScaleType])


    const yScaleArea = useMemo(() => {
        if(yScaleType === "log") {
            return scaleLog({
                range: [0, chart.height],
                domain: [1/1000000, _yDomainFiltered[1]],
                nice: true
            })
        } else {
            return scaleLinear({
                range: [chart.height, 0],
                domain: _yDomainFiltered,
                nice: true
            })
        }
    }, [chart.height, _yDomainFiltered, yScaleType])



    const yScaleTimeline = useMemo(() => {
        if(yScaleType === "log") {
            return scaleLog({
                range: [0, timelineHeight],
                domain: [1/1000000, _yDomainFiltered[1]],
                nice: true
            })
        } else {
            return scaleLinear({
                range: [0, timelineHeight],
                domain: _yDomain
            })
        }
        
    }, [timelineHeight, _yDomain, _yDomainFiltered, yScaleType])


    const yScaleTimelineArea = useMemo(() => {
        if(yScaleType === "log") {
            return scaleLog({
                range: [0, timelineHeight],
                domain: [1/1000000, _yDomainFiltered[1]],
                nice: true
            })
        } else {
            return scaleLinear({
                range: [timelineHeight, 0],
                domain: _yDomain,
                nice: true
            })
        }
        
    }, [timelineHeight, _yDomain, _yDomainFiltered, yScaleType])

    return {
        xScaleFull: xScaleFull,
        xScale: xScale,
        yScale: yScale,
        yScaleArea: yScaleArea,
        yScaleTimeline: yScaleTimeline,
        yScaleTimelineArea: yScaleTimelineArea
    }
}

export default useScales