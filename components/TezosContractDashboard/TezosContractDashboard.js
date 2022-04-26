import React from "react"
import {
    Box,
    Divider,
    Text,
    Button,
    Input,
    InputGroup,
    InputLeftAddon
} from "@chakra-ui/react"
import ContractStatsCarousel from "./components/ContractStatsCarousel"
import AreaChart from "components/Charts/AreaChart"
import { gridScale } from "utils/colorScales"
import dayjs from "dayjs"
import _ from "lodash"

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
                <InputLeftAddon>contract address:</InputLeftAddon>
                <Input
                    pr='4.5rem'
                    value={contract.address}
                    onFocus={(e) => e.target.select()}
                    readOnly={true}
                    />
            </InputGroup>
            <Divider marginTop="0.5rem" marginBottom="0.5rem" />
            <ContractStatsCarousel
                contract={contract}
                dailyStats={dailyStats}
                />
            <AreaChart
                data={dailyStats.byDay}
                dataDomain={dailyStats.dataDomain}
                columns={cols}
                xKey={"date"}
                xDomain={xDomain}
                width={"dynamic"}
                color={color}
                height={400}
                />
            <Divider marginTop="1rem" marginBottom="2rem" />
            <Box minHeight="8rem" />

        </div>
    )
}

export default TezosContractDashboard