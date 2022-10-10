import React, { useContext } from "react"
import {
    Box,
    Text,
    Badge
} from "@chakra-ui/react"
import { AreaChartContext } from "components/Charts/AreaChart/AreaChart"
import { ChartContext } from "components/Charts/Chart/Chart"
import _ from "lodash"

const BadgesLegend = ({
    columns,
    colColors = false,
    labelText = "Nr of calls to entrypoints",
    boxPositionTop="-8px",
    width="500px"
}) => {
    const areaChartContext = useContext(AreaChartContext)
    const chartContext = useContext(ChartContext)


    var columnsToggled = _.get(chartContext, "columnsToggled", columns)
    var toggleColumn = _.get(chartContext, "toggleColumn", false)

    var _colColors = colColors
    if(_colColors === false) {
        if(!_.isUndefined(areaChartContext)) {
            _colColors = _.get(areaChartContext, 'colColors', ["rgb(0,255,0)", "rgb(0,0,255)"])

        }
        if(!_.isUndefined(chartContext)) {
            _colColors = _.get(chartContext, 'colColors', ["rgb(0,255,0)", "rgb(0,0,255)"])

        }
    }
    if(_colColors === false) {
        _colColors = ["rgb(0,255,0)", "rgb(0,0,255)"]
    }

    return (
        <Box position="absolute"
            padding="0.5rem"
            top={boxPositionTop}
            left="-6px"
            right="0px"
            opacity={_.get(chartContext, 'hovered', false) ? 0.1 : 1}
            >
            <Text fontSize="0.5rem" fontWeight="bold" textTransform="uppercase"
                marginBottom="-5px"
                position="relative"
                zIndex={-10}
                >
                {labelText}
            </Text>
            <Box
                position="absolute"
                top="1rem"
                paddingBottom="0.5rem"
                style={{transition: "opacity 0.1s"}}
                >
                {columns.slice(0, 11).map((col, col_i) => {
                    var colColor = _colColors[col_i % _colColors.length]
                    if(!_.isString(colColor)) {
                            if(_.has(colColor, "_rgb")) {
                                colColor = colColor.hex()
                            }
                            
                    }
                    var colIsToggled = true
                    var opacity = 1
                    if(columnsToggled.length > 0) {
                        colIsToggled = columnsToggled.includes(col)
                    }

                    opacity = colIsToggled ? 1 : 0.2

                    var interactionProps = {}
                    if(_.isFunction(toggleColumn)) {
                        interactionProps["onPointerDown"] = () => {
                            toggleColumn(col)
                        }

                        interactionProps["cursor"] = "pointer"
                    }
                    return (
                        <Box marginBottom="0px"
                            key={col_i}
                            height={"14px"}
                            >
                        <Badge
                            color={"white"}
                            variant="solid"
                            background={colColor}
                            size="small"
                            fontSize="0.5rem"
                            margin="0.1rem"

                            pointerEvents="initial"
                            opacity={opacity}
                            {...interactionProps}
                            _hover={{
                                opacity: 0.8
                            }}
                            _groupHover={{
                                color: colColor,
                                background: "rgba(255,255,255,0.95)"
                            }}
                            >
                            {col}
                        </Badge>
                        </Box>
                    )
                })}
            </Box>
        </Box>
    )
}

export default BadgesLegend