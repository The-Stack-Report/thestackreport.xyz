import React, { useState, useContext } from "react"
import { Bar } from "@visx/shape"
import { findHoveredXValue } from "utils/chart-interactions"
import dayjs from "dayjs"
import { INTERPRETATION_LAYER_CHART_NOTES } from "constants/feature_flags"
import { ChartContext } from "components/Charts/Chart/Chart"
import { WalletContext } from "components/Wallet"
import _ from "lodash"

var newNoteCounter = 0

const NotesXAxisOverlay = ({
        notes,
        xScale,
        xValueType = "number",
        chart,
        chartId,
        margins,
        snapFunction = (val) => val
    }) => {
    const chartContext = useContext(ChartContext)
    const walletContext = useContext(WalletContext)
    const[addNoteXValue, setAddNoteXValue] = useState(false)
    const height = 40
    const width = _.get(chart, "width", false)

    if(!_.isNumber(width)) return null
	if(_.isNaN(width)) return null
	if(!_.isNumber(height)) return null
	if(_.isNaN(height)) return null

    function handleHover(e) {
        if(chartContext.controllingZoomBrush === false) {
            var x = findHoveredXValue(e, snapFunction, xScale, xValueType, margins)
            setAddNoteXValue(x)

            var newNoteLabel = `New note`
            if(dayjs.isDayjs(x)) {
                newNoteLabel += `: ${x.format("MMM D, YYYY")}`
            }
            chartContext.setNewNotePreview({
                date: x,
                note: newNoteLabel,
                noteSource: "preview",

            })
        }
        
    }

    var addNoteXLabel = false

    if (dayjs.isDayjs(addNoteXValue)) {
        addNoteXLabel = addNoteXValue.format("YYYY-MM-DD")
    }

    return (
        <>
        {INTERPRETATION_LAYER_CHART_NOTES && (
            <>
            <Bar
                x={-10}
                y={chart.height + 1}
                width={width + 20}
                height={height}
                onPointerMove={handleHover}
                onPointerLeave={() => {
                    setAddNoteXValue(false)
                    chartContext.setNewNotePreview(false)
                }}
                fill="transparent"
                cursor={chartContext.controllingZoomBrush ? "initial" : "copy"}
                pointerEvents="initial"
                onPointerDown={() => {
                    if(chartContext.controllingZoomBrush === false) {
                        console.log("pointer down x axis overlay")
                        var newNoteLabel = `New note`
                        if(dayjs.isDayjs(addNoteXValue)) {
                            newNoteLabel += `: ${addNoteXValue.format("MMM D, YYYY")}`
                        }

                        newNoteCounter += 1
                        chartContext.addNote({
                            date: addNoteXValue,
                            note: newNoteLabel,
                            noteSource: "initialized",
                            visibility: "private",
                            chartId: chartId,
                            owner: _.get(walletContext, "address", false),
                            id: `${newNoteLabel}-${newNoteCounter}-${dayjs().format("h:mm:ss")}`
                        })
                    }
                    
                }}
                />
            <line
                x1={xScale(addNoteXValue) - 0.5}
                y1={0}
                x2={xScale(addNoteXValue) - 0.5}
                y2={chart.height + 25}
                stroke="rgb(0,0,0)"
                strokeOpacity={0.3}
                strokeWidth={1}
                />
            <line
                x1={xScale(addNoteXValue) - 3}
                y1={chart.height + 25}
                x2={xScale(addNoteXValue) + 3}
                y2={chart.height + 25}
                stroke="rgb(0,0,0)"
                strokeOpacity={0.3}
                strokeWidth={1}
                />
            </>
        )}
        </>
    )
}

export default NotesXAxisOverlay