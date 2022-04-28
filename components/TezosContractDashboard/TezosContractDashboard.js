import React from "react"
import {
    Box,
    Divider,
    Text,
    Button,
    Input,
    InputGroup,
    InputRightAddon
} from "@chakra-ui/react"
import ContractStatsCarousel from "./components/ContractStatsCarousel"
import AreaChart from "components/Charts/AreaChart"
import { gridScale } from "utils/colorScales"
import dayjs from "dayjs"
import _ from "lodash"
import BadgesLegend from "components/Charts/components/BadgesLegend"

const TezosContractDashboard = ({
    contract,
    dailyStats
}) => {
    var cols = _.sortBy(dailyStats.entrypoints, "count").reverse().map(p => p.entrypoint)

    const sortPosition = _.get(contract, "sort_positions.by_calls_past_14_days", false)
    var color = "black"
    if(_.isNumber(sortPosition)) {
        color = gridScale(_.clamp(sortPosition / 100, 0, 1))
    }

    var xDomain = [
        _.first(dailyStats.byDay),
        _.last(dailyStats.byDay)
    ].map(d => dayjs(d.date))

    return (
        <div className='tezos-contract-dashboard'>
            <InputGroup
                size="sm"
                marginTop="0.5rem"
                marginBottom="0.5rem"
                >
                
                <Input
                    pr='4.5rem'
                    value={contract.address}
                    onFocus={(e) => e.target.select()}
                    readOnly={true}
                    />
                <InputRightAddon>contract address</InputRightAddon>
            </InputGroup>
            <Divider marginTop="0.5rem" marginBottom="0.5rem" />
            <Text
                color="gray.500"
                fontSize="0.7rem"
                textAlign="right"
                marginTop="-5px"
                marginBottom="10px"
                >
                {`Dashboard displays historic contract data, refreshing daily. Showing data up to: ${xDomain[1].format("MMMM D, YYYY")}`}
            </Text>
            <ContractStatsCarousel
                contract={contract}
                dailyStats={dailyStats}
                />
            <Text
                fontWeight="bold"
                marginTop="2rem"
                fontSize="xl"
                >
                Contract calls per entrypoint
            </Text>
            <AreaChart
                data={dailyStats.byDay}
                dataDomain={dailyStats.dataDomain}
                columns={cols}
                xKey={"date"}
                xDomain={xDomain}
                width={"dynamic"}
                color={color}
                height={300}
                >
                <BadgesLegend
                    columns={cols}
                    />
            </AreaChart>
            <Divider marginTop="1rem" marginBottom="2rem" />
            <Box minHeight="8rem" />

        </div>
    )
}

export default TezosContractDashboard