import React, { useMemo, useRef } from "react"
import {
    scaleLinear,
    scaleTime
} from "@visx/scale"
import {
    AreaClosed
} from "@visx/shape"
import {
    Box,
    Text
} from "@chakra-ui/react"
import { curveLinear } from '@visx/curve';
import _ from "lodash"
import dayjs from "dayjs"
import chroma from "chroma-js"
import BadgesLegend from "components/Charts/components/BadgesLegend"

function dateKeyVal(val) {
    return dayjs.isDayjs(val) ? val : dayjs(val)
}

const CardAreaChart = React.memo(({
    data,
    columns,
    xKey = "date",
    color = "pink",
    dataDomain = [0, 100],
    xDomain = [0, 10],
    width = 400,
    height = 400,
    margins = {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    }
}) => {
    const chart = useMemo(
        () => {
            return {
                width: width - margins.left - margins.right,
                height: height - margins.top - margins.bottom
            }
        }
    , [width, height, margins])



    const yScale = useMemo(
        () => {
            return scaleLinear({
                range: [0, chart.height],
                domain: dataDomain,
                nice: true
            })
        }
    , [chart.height, dataDomain])

    const yScaleArea = useMemo(
        () => {
            return scaleLinear({
                range: [chart.height, 0],
                domain: dataDomain,
                nice: true
            })
        }
    , [chart.height, dataDomain])

    const xScale = useMemo(
        () => {
            return scaleTime({
                range: [0, chart.width],
                domain: xDomain
            })
        }
    , [chart.width, xDomain])
    const colColors = columns.map((col, col_i) => {
        var col_t = columns.length === 1 ? 0.5 : col_i / (columns.length - 1)
        var areaColor = color
        if(_.isFunction(color)) {
            areaColor = color(col_t)
        }
        return areaColor
    })

    var xAxisStartLabel = xDomain[0]
    var xAxisEndLabel = xDomain[1]

    if(dayjs.isDayjs(xAxisStartLabel)) {
        xAxisStartLabel = xAxisStartLabel.format("MMM D, YYYY")
    }
    if(dayjs.isDayjs(xAxisEndLabel)) {
        xAxisEndLabel = xAxisEndLabel.format("MMM D, YYYY")
    }
    return (
        <div className='area-chart'>
            <BadgesLegend
                columns={columns}
                colColors={colColors}
                boxPositionTop={"-12px"}
                labelText="Entrypoint calls"
                width={width}
                />
            <Box
                overflow="hidden"
                width={width}
                >
                <svg width={width} height={height}>
                    {columns.map((col, col_i) => {
                        var col_t = columns.length === 1 ? 0.5 : col_i / (columns.length - 1)
                        var areaColor = colColors[col_i]

                        return (
                            <React.Fragment
                                key={col_i}
                                >
                            <AreaClosed
                                data={data}
                                x={(d) => xScale(dateKeyVal(d.date))}
                                y={(d) => yScaleArea(_.get(d, col, 0))}
                                yScale={yScaleArea}
                                fill={chroma(areaColor).brighten(0.5 + col_t * 0.5)}
                                fillOpacity={0.8}
                                opacity={1}
                                stroke={areaColor}
                                curve={curveLinear}
                                />
                            </React.Fragment>
                        )
                    })}
                    
                </svg>
            </Box>
            <Box
                paddingTop="0.5rem"
                height="2rem"
                position="relative"
                >
                <Text
                    position="absolute"
                    top="0px"
                    left="0px"
                    fontSize="0.7rem"
                    color="gray.500"
                    zIndex={15}
                    >
                    {_.isString(xAxisStartLabel) ? xAxisStartLabel : "xAxisStartLabel"}
                </Text>
                <Text
                    position="absolute"
                    top="0px"
                    right="0px"
                    fontSize="0.7rem"
                    color="gray.500"
                    zIndex={15}
                    >
                    {_.isString(xAxisEndLabel) ? xAxisEndLabel : "xAxisEndLabel"}
                </Text>
            </Box>
        </div>
    )
}, (prev, next) => {
    if(prev.width !== next.width) {
        return false
    }
    if(prev.height !== next.height) {
        return false
    }
    return _.get(prev, "data", []).length === _.get(next, "data", []).length
})


CardAreaChart.displayName = "CardAreaChart"

export default CardAreaChart