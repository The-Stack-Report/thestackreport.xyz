import React, { useRef, useState } from "react"
import {
    Box,
    Text,
    Badge
} from "@chakra-ui/react"
import WrappedLink from "components/WrappedLink"
import _ from "lodash"
import prepareContractDailyStats from "utils/data/contracts/prepareContractDailyStats"
import AreaChartBasic from "components/Charts/AreaChartBasic"
import { gridScale } from "utils/colorScales"
import dayjs from "dayjs"

const TopContractsLandingPageWidget = ({
    contracts
}) => {
    return (
        <Box 
            style={{userSelect: "none"}}
            >
            {contracts.map((contract, contract_i) => {
                var badges = []
                badges = badges.concat(
                    _.get(contract, "tzkt_account_data.tzips", [])
                )
                var recent_days_data = _.get(contract, "_preparedDailyStats", false)
                if(recent_days_data === false) {
                    recent_days_data = prepareContractDailyStats(_.get(contract, "past_14_days", false), contract)
                }

                var columns = _.sortBy(recent_days_data.entrypoints, "count").reverse().map(p => p.entrypoint)

                var color = "black"

                var sortPosition = contract_i
                if(_.isNumber(sortPosition)) {
                    color = gridScale(_.clamp(sortPosition / 100, 0, 1))
                }

                const colColors = columns.map((col, col_i) => {
                    var col_t = columns.length === 1 ? 0.5 : col_i / (columns.length - 1)
                    var areaColor = color
                    if(_.isFunction(color)) {
                        areaColor = color(col_t)
                    }
                    return areaColor
                })
                return (
                    <Box position="relative"
                        key={contract_i}
                        >
                    <WrappedLink href={`/dashboards/tezos/contracts/${contract.address}`} inline={true} >
                        <Box
                            _hover={{
                                background: "black"
                            }}
                            position="relative"
                            >
                            <Text
                                isTruncated
                                fontSize="1.5rem"
                                color="gray.500"
                                fontWeight="light"
                                style={{ textDecoration: 'none' }}
                                position="absolute"
                                top="0.25rem"
                                left="0.25rem"
                                right="1rem"
                                >
                                {_.get(contract, "tzkt_account_data.alias", contract.address)}
                            </Text>
                            <DataContent
                                data={recent_days_data}
                                sortPosition={sortPosition}
                                />
                        </Box>
                    </WrappedLink>
                    <Box>
                    <Text fontSize="0.7rem">
                        Contract calls past two weeks:{" "}
                        <Text as="span" fontWeight="bold">
                        {_.get(contract, "past_14_days.total_calls", 0).toLocaleString()}
                        </Text>
                    </Text>
                    <Box position="absolute" top="0.1rem" right=".2rem" zIndex={20}>
                        {columns.map((col, col_i) => {
                            var col_t = columns.length === 1 ? 0.5 : col_i / (columns.length - 1)
                            var colColor = colColors[col_i]

                            if(!_.isString(colColor)) {
                                    if(_.has(colColor, "_rgb")) {
                                        colColor = colColor.hex()
                                    }
                                    
                            }
                            var colSum = _.sum(recent_days_data.byDay.map(p => _.get(p, col, 0)))

                            return (
                                <Text
                                    fontSize="0.7rem"
                                    textAlign="right"
                                    key={col}
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
                                </Text>
                            )
                        })}
                    </Box>
                    </Box>
                    <Box height="1rem" />
                    </Box>
                )
            })}
        </Box>
    )
}


const defaultWidth = 288


const DataContent = ({
    data,
    sortPosition
}) => {
    const containerRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width:defaultWidth, height: 100 });
    const [windowResizeCounter, setWindowResizeCounter] = useState(0)
    var color = "black"
    var cols = _.sortBy(data.entrypoints, "count").reverse().map(p => p.entrypoint)
    if(_.isNumber(sortPosition)) {
        color = gridScale(_.clamp(sortPosition / 100, 0, 1))
    }
    const aspectRatio = 3/8

    var lastDate = _.last(data.byDay)
    lastDate = _.get(lastDate, "date", dayjs())
    if(_.isString(lastDate)) {
        lastDate = dayjs(lastDate)
    }
    var firstDate = _.first(data.byDay)
    firstDate = _.get(firstDate, "date", lastDate.subtract(7, "day"))
    if(_.isString(firstDate)) {
        firstDate = dayjs(firstDate)
    }
    return (
        <div>
            <AreaChartBasic
                data={data.byDay}
                dataDomain={data.dataDomain}
                columns={cols}
                xDomain={[firstDate, lastDate]}
                xKey={"date"}
                width={dimensions.width}
                height={dimensions.width * aspectRatio}
                color={color}
                />
        </div>
    )
}

export default TopContractsLandingPageWidget