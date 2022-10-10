import React from "react"
import {
    Box,
    Divider,
    Text,
    Button,
    Input,
    InputGroup,
    InputRightAddon,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon
} from "@chakra-ui/react"
import ContractStatsCarousel from "./components/ContractStatsCarousel"
import EntrypointsXtzStats from "./components/EntrypointsXtzStats"
import AreaChart from "components/Charts/AreaChart"
import Chart from "components/Charts/Chart"
import { gridScale } from "utils/colorScales"
import dayjs from "dayjs"
import _ from "lodash"
import BadgesLegend from "components/Charts/components/BadgesLegend"
import chroma from "chroma-js"
import AccordionExplainer from "components/AccordionExplainer"
import ContractTransactionFlow from "components/ContractTransactionFlow"
import StatsByEntrypoint from "./components/StatsByEntrypoint"
import PatternDivider from "components/PatternDivider"

import contractCallsChartDescription from "./content/contractCallsChartDescription"
import usageChartDescription from "./content/usageChartDescription"
import sentTransactionsDescription from "./content/sentTransactionsDescription"
import flowDescription from "./content/flowDescription"
import bakerFeesChartDescription from "./content/bakerFeesChartDescription"
import blockSpaceShareDescription from "./content/blockSpaceShareDescription"

const grayScale = chroma.scale([
    "rgb(0,0,0)",
    "rgb(150,150,150)"
])


const TezosContractDashboard = ({
    contract,
    dailyStats,
    xtzEntrypointsStats,
    sectionsAsDict
}) => {
    var cols = _.sortBy(dailyStats.entrypoints, "count").reverse().map(p => p.entrypoint)

    const contract_address = _.get(contract, "address", "no-address")

    const sortPosition = _.get(contract, "sort_positions.by_calls_past_14_days", false)
    var color = "black"
    if(_.isNumber(sortPosition)) {
        color = gridScale(_.clamp(sortPosition / 100, 0, 1))
    }
    var xDomain = [
        _.first(dailyStats.byDay),
        _.last(dailyStats.byDay)
    ].map(d => dayjs(d.date).startOf("day"))

    var usage = _.get(dailyStats, "usageByDay", [])
    if(_.isArray(usage) && usage.length === 0) usage = false

    var sentByDay = _.get(dailyStats, "sentByDay", [])
    if(_.isArray(sentByDay) && sentByDay.length === 0) sentByDay = false

    var tableKeys = [
        "sum",
        "max",
        "median",
        "mean"
    ]

    console.log(dailyStats)

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
            <Box id={sectionsAsDict["contract-usage"].id} />
            <ContractStatsCarousel
                contract={contract}
                dailyStats={dailyStats}
                />
            <Text
                fontWeight="bold"
                marginTop="3rem"
                as="h1"
                >
                Contract calls per entrypoint
            </Text>
            <Chart
                name=" "
                data={dailyStats.byDay}
                dataHash={contract_address}
                type="area"
                columns={cols}
                xKey={"date"}
                xDomain={xDomain}
                width={"dynamic"}
                color={color}
                height={300}
                timelineBrush={true}
                badgesLegend={true}
                noDataTooltipPlaceholder={"No calls for date: "}
                badgesLegendText = "Nr of calls to entrypoints"
                noteEditingEnabled={true}
                chartId={`${contract_address}-daily-entrypoint-calls`}
                />
            <AccordionExplainer
                title={"About smart contract entrypoints"}
                textMd={contractCallsChartDescription}
                />
           
            {_.isArray(usage) && (
                <>
                <PatternDivider />
                <Text
                    fontWeight="bold"
                    marginTop="2rem"
                    as="h1"
                    >
                    Contract users
                    <Text as="span" fontWeight="light" color="gray.500">
                        {` (wallets & other contracts)`}
                    </Text>
                </Text>
                <Chart
                    name=" "
                    data={usage}
                    dataHash={contract_address}
                    type="line"
                    columns={[
                        "wallets_sending_transactions",
                        "contracts_sending_transactions"
                    ]}
                    color={grayScale}
                    xKey="date"
                    height={250}
                    timelineBrush={true}
                    badgesLegend={true}
                    noDataTooltipPlaceholder={"No accounts active for date: "}
                    badgesLegendText = "Nr of accounts active, split by wallet/contract."
                    />
                <AccordionExplainer
                    title={"About smart contract users"}
                    textMd={usageChartDescription}
                    />
                </>
            )}
            {_.isArray(sentByDay) && (
                <>
                <PatternDivider />
                <Text
                    fontWeight="bold"
                    marginTop="2rem"
                    as="h1"
                    >
                    Contract-generated transactions
                    <Text as="span" fontWeight="light" color="gray.500">
                        {` (Grouped by target, top 100 accounts)`}
                    </Text>
                </Text>
                <Chart
                    name=" "
                    data={sentByDay}
                    dataHash={contract_address}
                    type="line"
                    columns={dailyStats.targetsShortened}
                    color={grayScale}
                    xKey="date"
                    height={250}
                    timelineBrush={true}
                    badgesLegend={true}
                    />
                <AccordionExplainer
                    title={"About sent transactions"}
                    textMd={sentTransactionsDescription}
                    />
                </>
            )}
            <PatternDivider />
            <Box id={sectionsAsDict["contract-transaction-flow"].id} />
            <ContractTransactionFlow
                contract={{
                    ...contract,
                    dailyStats: dailyStats
                }}
                color={color}
                />
            <AccordionExplainer
                    title={"About transaction flow"}
                    textMd={flowDescription}
                    />
            <Box minHeight="4rem" />
            <PatternDivider />
            
            {_.has(dailyStats.blockSpaceStatsByDay[0], "contract_call_share_percentage") ? (
                <>
                <Box id={sectionsAsDict["baker-fees"].id} />
                <Text
                    fontWeight="bold"
                    marginTop="2rem"
                    as="h1"
                    >
                    Baker fees
                </Text>
                <Chart
                    name=" "
                    data={dailyStats.blockSpaceStatsByDay}
                    dataHash={contract_address}
                    type="line"
                    columns={[
                        "baker_fee_xtz_sum"
                    ]}
                    height={200}
                    yTickCount={2}
                    color={grayScale}
                    yAxisTickLabel={"xtz"}
                    timelineBrush={true}
                    badgesLegend={true}
                    badgesLegendText = "Total xtz paid as baker fee."
                    />
                <Chart
                    name=" "
                    data={dailyStats.blockSpaceStatsByDay}
                    dataHash={contract_address}
                    type="line"
                    columns={[
                        "baker_fee_xtz_median"
                    ]}
                    height={200}
                    yTickCount={2}
                    color={grayScale}
                    yAxisTickLabel={"xtz"}
                    timelineBrush={true}
                    badgesLegend={true}
                    badgesLegendText = "Median xtz paid as baker fee."
                    />
                <Chart
                    name=" "
                    data={dailyStats.blockSpaceStatsByDay}
                    dataHash={contract_address}
                    type="line"
                    columns={[
                        "baker_fee_xtz_max"
                    ]}
                    height={200}
                    yTickCount={2}
                    color={grayScale}
                    yAxisTickLabel={"xtz"}
                    timelineBrush={true}
                    badgesLegend={true}
                    badgesLegendText = "Max xtz paid as baker fee."
                    />
                <AccordionExplainer
                    title="About baker fee statistics."
                    textMd={bakerFeesChartDescription}
                    />

                    
                <PatternDivider />
                <Box id={sectionsAsDict["block-share"].id} />
                <Text
                    fontWeight="bold"
                    marginTop="2rem"
                    as="h1"
                    >
                    Block share
                </Text>
                <Chart
                    name=" "
                    data={dailyStats.blockSpaceStatsByDay}
                    dataHash={contract_address}
                    type="line"
                    columns={[
                        "contract_call_share_percentage",
                        "transaction_share_percentage"
                    ]}
                    height={200}
                    yTickCount={2}
                    color={grayScale}
                    yAxisTickLabel={"%"}
                    timelineBrush={true}
                    badgesLegend={true}
                    />
                <Chart
                    name=" "
                    data={dailyStats.blockSpaceStatsByDay}
                    dataHash={contract_address}
                    type="line"
                    columns={[
                        "baker_fee_share_percentage"
                    ]}
                    height={200}
                    yTickCount={2}
                    color={grayScale}
                    yAxisTickLabel={"%"}
                    timelineBrush={true}
                    badgesLegend={true}
                    />
                <AccordionExplainer
                    title="About block space statistics."
                    textMd={blockSpaceShareDescription}
                    />

                </>
            ) : (
                <Text>Block share data not calculated yet for contract.</Text>
            )}
            
            <PatternDivider />
            <Text id={sectionsAsDict["contract-xtz-statistics"].id}
                as="h2"
                >
                Contract XTZ statistics
            </Text>
            {xtzEntrypointsStats ? (
                <>
                
                <EntrypointsXtzStats
                    contract={contract}
                    xtzEntrypointsStats={xtzEntrypointsStats} />
                </>
            ) : (
                <Text
                    paddingTop="2rem"
                    paddingBottom="2rem"
                    textAlign="center"
                    fontStyle="italic"
                    >
                    {_.get(dailyStats, "xtz_to_contract", false) == -1 ? (
                        <>
                        No XTZ statistics available for this contract. 
                        </>
                    ) : (
                        <>
                        Contract has {_.get(dailyStats, "xtz_to_contract", false)} xtz in and {_.get(dailyStats, "xtz_from_contract", false)} xtz out.
                        Nothing to display.
                        </>
                    )}
                </Text>
            )}
            <Box minHeight="8rem" />
            {false && (
              <>
                <StatsByEntrypoint
                    contract={contract}
                    dailyStats={dailyStats}
                    />
                <Box minHeight="8rem" />
              </>  
            )}
            
        </div>
    )
}

export default TezosContractDashboard