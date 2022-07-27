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
import AreaChart from "components/Charts/AreaChart"
import Chart from "components/Charts/Chart"
import { gridScale } from "utils/colorScales"
import dayjs from "dayjs"
import _ from "lodash"
import BadgesLegend from "components/Charts/components/BadgesLegend"
import chroma from "chroma-js"
import AccordionExplainer from "components/AccordionExplainer"
import ContractTransactionFlow from "components/ContractTransactionFlow"

const grayScale = chroma.scale([
    "rgb(0,0,0)",
    "rgb(150,150,150)"
])

const contractCallsChartDescription = _.trim(`
Tezos *smart contracts* are programs that can run on the Tezos blockchain.
Developers can implement any amount of *endpoints* which can be *called* through adding a transaction to the chain.

The above chart shows the amount of transactions per day that successfully *called* an entrypoint of the smart contract.


`)

const usageChartDescription = _.trim(`
Contracts can be called by any type of account on the Tezos blockchain. There are currently two main types of accounts: 'wallet' accounts and 'contract' accounts.

When a wallet account calls a smart contract, this usually comes from an interaction with a dApp interface which is then approved by the user in their Wallet app.
In the case of a smart contract calling another smart contract, this usually comes from the smart contract code executing some sort of function.

The above chart shows the number of *wallets* calling the contract per day 
and the number of *contracts* calling the contract per day.

For more explanation on account types, see: [opentezos.operations](https://opentezos.com/tezos-basics/operations/)


`)

const sentTransactionsDescription = _.trim(`
When smart contract entrypoints are called, the smart contract code can generate new transactions targetting other wallets or smart contract entrypoints.
The above chart displays these historic transactions for the top 100 accounts/entrypoints being targetted.
`)

const flowDescription = _.trim(`
The above visual shows three elements combined. The first table contains the top accounts (both wallets and other contracts) that generate transactions targetting this contract.

The central pie chart displays the distribution of entrypoints being called by those accounts.

Calling an entrypoint triggers the smart contract code to run. This might trigger new transactions coming from that smart contract code. These transactions can have other targets again.

A common pattern is for example an NFT marketplace contract which is being called by various wallets and generates transactions that are then targetting the NFT contract. 
`)


const TezosContractDashboard = ({
    contract,
    dailyStats
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
                />
            <AccordionExplainer
                title={"About smart contract entrypoints"}
                textMd={contractCallsChartDescription}
                />
           
            {_.isArray(usage) && (
                <>
                <Divider />
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
                <Divider />
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
            <Divider />
            <Box minHeight="6rem" />
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
            <Box minHeight="8rem" />
        </div>
    )
}

export default TezosContractDashboard