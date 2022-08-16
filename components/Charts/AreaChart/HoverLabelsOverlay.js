import React from "react"
import {
    Box,
    Text
} from "@chakra-ui/react"
import styles from "./AreaChart.module.scss"
import _ from "lodash"
import { secureChromaToCssColor } from "utils/colorUtils"

const HoverLabelsOverlay = ({
    data,
    columns,
    xKey,
    hoveredXValue,
    chart,
    margins,
    xScale,
    yScale,
    colColors
}) => {
    if(hoveredXValue === false) {
        return null
    }
    var data_i = _.findIndex(data, p => hoveredXValue.isSame(p[xKey], "day"))
    var hoveredData = data[data_i + 1]

    var xPosition = xScale(hoveredXValue)

    var boxWidth = 300

    var columnsToShow = columns.map((col, col_i) => {
        var colVal = _.get(hoveredData, col, false)
        var areaColor = colColors[col_i]
        return {
            value: colVal,
            label: col,
            color: areaColor
        }
    }).filter(c => _.isNumber(c.value) && c.value > 0)
    var rowHeight = 22
    var boxHeight = columnsToShow.length * rowHeight
    if(columnsToShow.length === 0) {
        boxHeight = rowHeight
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
                <Text
                    fontSize="0.7rem"
                    padding="3px"
                    color="gray.500"
                    >
                    No calls for date {" "}
                        <span style={{fontStyle: "italic", fontWeight: "bold"}}>
                        {hoveredXValue.format("MMMM D, YYYY")}
                        </span> 
                </Text>
                </Box>
            ) : (
                <React.Fragment>
                    {columnsToShow.map((col, col_i) => {
                        var isLast = col_i === columnsToShow.length - 1
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
                                    minWidth="80px"
                                    fontSize="0.7rem"
                                    padding="3px"
                                    fontWeight="bold"
                                    >
                                    {`${col.value.toLocaleString()} `}
                                </Text>
                                <Text
                                    fontSize="0.7rem"
                                    padding="3px"
                                    color="gray.500"
                                    >
                                {`calls to `}
                                </Text>
                                <Text
                                    fontSize="0.7rem"
                                    padding="3px"
                                    color={secureChromaToCssColor(col.color)}
                                    fontWeight="bold"
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