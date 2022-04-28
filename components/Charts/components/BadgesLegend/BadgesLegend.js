import React, { useContext } from "react"
import {
    Box,
    Text,
    Badge
} from "@chakra-ui/react"
import { AreaChartContext } from "components/Charts/AreaChart/AreaChart"
import _ from "lodash"

const BadgesLegend = ({
    columns,
    colColors = false,
    labelText = "Nr of calls to entrypoints",
    boxPositionTop="-20px"
}) => {
    const chartContext = useContext(AreaChartContext)
    var _colColors = colColors
    if(_colColors === false) {
        _colColors = _.get(chartContext, 'colColors', ["rgb(0,255,0)", "rgb(0,0,255)"])
    }

    return (
        <Box position="absolute"
            padding="0.5rem"
            top={boxPositionTop}
            left="-6px"
            width="500px"
            opacity={_.get(chartContext, 'hovered', false) ? 0.1 : 1}
            style={{transition: "opacity 0.1s"}}
            >
            <Text fontSize="0.5rem" fontWeight="bold" textTransform="uppercase"
                marginBottom="-5px"
                >
                {labelText}
            </Text>
            {columns.slice(0, 11).map((col, col_i) => {
                var colColor = _colColors[col_i % _colColors.length]
                if(!_.isString(colColor)) {
                        if(_.has(colColor, "_rgb")) {
                            colColor = colColor.hex()
                        }
                        
                }
                return (
                    <Box marginBottom="-10px"
                        key={col_i}
                        >
                    <Badge
                        color={"white"}
                        variant="solid"
                        background={colColor}
                        size="small"
                        fontSize="0.5rem"
                        margin="0.1rem"
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
    )
}

export default BadgesLegend