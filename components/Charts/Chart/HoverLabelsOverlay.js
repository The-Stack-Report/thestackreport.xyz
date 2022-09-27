import React from "react"
import {
    Box,
    Text
} from "@chakra-ui/react"
import styles from "./Chart.module.scss"
import _ from "lodash"
import { secureChromaToCssColor } from "utils/colorUtils"

const HoverLabelsOverlay = ({
    data,
    columns,
    xKey,
    xValueType,
    hoveredXValue,
    chart,
    margins,
    yAxisTickLabel,
    xScale,
    yScale,
    colColors,
    noDataTooltipPlaceholder = "No data for date:",
    colMetricDescriptions = ` `
}) => {
    if(hoveredXValue === false) {
        return null
    }
    var data_i = 0
    if(xValueType === "date") {
        data_i = _.findIndex(data, p => hoveredXValue.isSame(p[xKey], "day"))
    } else {
        data_i = _.findIndex(data, p => hoveredXValue === p[xKey])
    }
    var hoveredData = data[data_i + 1]

    var xPosition = xScale(hoveredXValue)

    var boxWidth = 300

    var yDomainMax = yScale.domain()[1]

    var columnsToShow = columns.map((col, col_i) => {
        var colVal = _.get(hoveredData, col, false)
        var areaColor = colColors[col_i]
        return {
            value: colVal,
            label: col,
            color: areaColor
        }
    }).filter(c => _.isNumber(c.value) && c.value > 0)

    var colsToShowSorted = _.cloneDeep(columnsToShow)
    colsToShowSorted = _.sortBy(colsToShowSorted, "value").reverse()

    var limit = 12
    var limitExceeded = false
    var removedItems = 0
    if(colsToShowSorted.length > limit) {
        limitExceeded = true
        removedItems = colsToShowSorted.length - limit
        colsToShowSorted = colsToShowSorted.slice(0, limit)

        colsToShowSorted.push({
            label: `and ${removedItems} more.`
        })
    }

    var rowHeight = 22
    var boxHeight = colsToShowSorted.length * rowHeight
    if(colsToShowSorted.length === 0) {
        boxHeight = rowHeight
    }
    var hoverLabelReplacement = (<Text></Text>)

    if(xValueType === "date") {
        hoverLabelReplacement= (
            <Text
                fontSize="0.7rem"
                padding="3px"
                color="gray.500"
                >
                {noDataTooltipPlaceholder} {" "}
                    <span style={{fontStyle: "italic", fontWeight: "bold"}}>
                    {hoveredXValue.add(2, "minute").format("MMMM D, YYYY")}
                    </span> 
            </Text>
        )
    } else if(xValueType === "number") {
        <Text
                fontSize="0.7rem"
                padding="3px"
                color="gray.500"
                >
                No data for value {" "}
                    <span style={{fontStyle: "italic", fontWeight: "bold"}}>
                    {hoveredXValue.toLocaleString()}
                    </span> 
            </Text>
    }

   
    return (
        <Box
            className={styles["tooltip-labels-box"]}
            style={{position: "absolute"}}
            left={xPosition < chart.width * 0.7 ? xPosition : xPosition - boxWidth}
            top={-boxHeight - 5}
            background="white"
            border="1px solid rgb(220,220,220)"
            width={boxWidth}
            height={`${boxHeight}px`}
            >
            {columnsToShow.length === 0 ? (
                <Box>
                {hoverLabelReplacement}
                </Box>
            ) : (
                <React.Fragment>
                    {colsToShowSorted.map((col, col_i) => {
                        var isLast = col_i === columnsToShow.length - 1

                        var colValue = col.value
                        var colValueRounded = colValue
                        if(colValue > 1000) {
                            colValueRounded = _.round(colValueRounded)
                        }
                        var colValueLabel = `${colValueRounded}`
                        if(_.isNumber(colValue) && yDomainMax > 1) {
                            colValueLabel = colValue.toLocaleString()
                            if(colValue !== colValueRounded) {
                                colValueLabel = `~${colValueRounded.toLocaleString()}`
                            }
                        }
                        
                        return (
                            <Box
                                key={col_i}
                                overflow="hidden"
                                height={`${rowHeight}px`}
                                borderBottom={!isLast ? "1px solid rgb(200,200,200)" : "none"}
                                display="flex"
                                >
                                <Text
                                    noOfLines={1}
                                    minWidth="100px"
                                    fontSize="0.7rem"
                                    padding="3px"
                                    fontWeight="bold"
                                    >
                                    {`${colValueLabel} ${yAxisTickLabel}`}
                                </Text>
                                <Text
                                    fontSize="0.7rem"
                                    padding="3px"
                                    color="gray.500"
                                    >
                                {colMetricDescriptions}
                                </Text>
                                <Text
                                    fontSize="0.7rem"
                                    padding="3px"
                                    color={secureChromaToCssColor(col.color)}
                                    fontWeight="bold"
                                    noOfLines={1}
                                    >
                                {`${col.label}`}
                                </Text>
                            </Box>
                        )
                    })}
                </React.Fragment>
            )}
            
        </Box>
    )
}

export default HoverLabelsOverlay