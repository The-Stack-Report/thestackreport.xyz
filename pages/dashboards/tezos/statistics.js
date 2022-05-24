import React, { useState, useEffect, useMemo } from "react"
import Head from "next/head"
import { Container } from "@chakra-ui/layout"
import {
    Heading,
    Text,
    Box,
    Divider,
    Link,
    Grid,
    GridItem
} from "@chakra-ui/react"
import PageLayout from "components/PageLayout"
import * as d3 from "d3"
import prepareDailyBlockchainStats from "utils/data/prepareDailyBlockchainStats"
import Chart from "components/Charts/Chart"
import dayjs from "dayjs"
import _ from "lodash"
import { findDataRangeInData } from "utils/dataRangeUtils"
import MarkdownWrapper from "components/MarkdownWrapper"
import prepareDf from "utils/data/prepareDf"
import AnchorLink from "components/AnchorLink"
import BadgesLegend from "components/Charts/components/BadgesLegend"

import chroma from "chroma-js"

const introduction = `This page shows historic statistics from the Tezos blockchain. Data is refreshed daily.

**About Tezos**

Tezos is a blockchain network for distributed applications. The network consists of nodes that people can run themselves. By staking the xtz token they are able to get baking rewards for validating blocks of transactions to the blockchain. 
People are able to add transactions from their wallet address to the blockchain through wallet software, which signs and sends the transaction to an initial node in the network.


This dashboard currently includes statistics related to *transactions* made on the blockchain.
Transactions are a subset of all operations on the Tezos chain.

For more information, read: [https://opentezos.com/tezos-basics/operations](https://opentezos.com/tezos-basics/operations)

`

var grayScaleColor = chroma.scale([
    "rgb(0,0,0)",
    "rgb(150,150,150)"
])

const charts = [
    {
        title: "Daily transactions",
        columns: ["total_transactions"],
        description: "Total number of transactions included in operations per day.",
        type: "line",
        dataset: "daily_chain_stats",
        color: grayScaleColor
    },

    {
        title: "Daily Active Wallets",
        columns: ["unique_sender_wallets", "unique_initiator_wallets"],
        description: "Total number of wallets sending/initiating transactions per day.",
        type: "line",
        dataset: "daily_chain_stats",
        color: grayScaleColor
    },
    {
        title: "Daily Called Contracts",
        columns: ["unique_targetted_contracts"],
        description: "",
        type: "line",
        dataset: "daily_chain_stats",
        color: grayScaleColor
    },
    {
        title: "Daily transactions & transaction groups",
        columns: ["total_transactions", "total_transaction_groups"],
        description: "",
        type: "line",
        dataset: "daily_chain_stats",
        color: grayScaleColor
    },
    {
        title: "Transaction to transaction-group ratio",
        columns: ["transaction_group_ratio"],
        description: "",
        type: "line",
        dataset: "daily_chain_stats",
        color: grayScaleColor
    },
    {
        title: "Transactions detailed stats",
        columns: [
            "total_transactions",
            "wallet_sender_transactions",
            "wallet_to_wallet_transactions",
            "wallet_to_contract_transactions",
            "contract_sender_transactions",
            "contract_to_contract_transactions",
            "contract_to_wallet_transactions"
            
        ],
        description: "A detailed look at transactions grouped by who is sending and who is receiving the transaction. These groupings are not mutually exclusive.",
        type: "line",
        dataset: "daily_chain_stats",
        color: grayScaleColor,
        columnToggles: true
    }
]


const TezosStatisticsPage = ({ dailyStatsOld, dailyChainStats }) => {
    const [dataOld, setDataOld] = useState(false)
    const [data, setData] = useState(false)
    

    useEffect(() => {
        if(dataOld === false) {
            var preparedStats = prepareDailyBlockchainStats(dailyStatsOld)
            setDataOld(preparedStats)
        }
        if(data === false) {
            var nrCols = _.keys(_.first(dailyChainStats)).filter(c => c !== "date")
            var preparedChainStats = prepareDf(
                dailyChainStats,
                ["date"],
                nrCols
            )
            setData(preparedChainStats)
        }
    }, [dailyStatsOld, dailyChainStats, data, dataOld])

    const datasets = useMemo(() => {
        return {
            old_data: dataOld,
            daily_chain_stats: data
        }
    }, [dataOld, data])

    return (
        <PageLayout>
            <Head>
                <title>Tezos statistics</title>
                <meta name="description" content="Tezos blockchain statistics." />

            </Head>
            <Box  padding="1rem" paddingTop="8rem" id="page-top" overflow="hidden">
                <Grid templateColumns="repeat(5, 1fr)" >
                    <GridItem
                        colSpan={{
                            base: 0,
                            sm: 0,
                            md: 1
                        }}
                        display={{
                            base: "none",
                            sm: "none",
                            md: "initial"
                        }}
                        >
                        <Box position="fixed" userSelect="none" pointerEvents="none" >
                            <Grid templateColumns="repeat(5, 1fr)">
                            <GridItem
                                colSpan={{
                                    base: 1,
                                    sm: 0,
                                    md: 1
                                }}
                                display={{
                                    base: "none",
                                    sm: "none",
                                    md: "initial"
                                }}
                                >
                                <AnchorLink href={`#page-top`}>
                                    <Text>Contents</Text>
                                </AnchorLink>
                                {charts.map((chart, chart_i) => {
                                    return (
                                        <Box
                                            paddingTop="1rem"
                                            paddingRight="2rem"
                                            pointerEvents="initial"
                                            key={chart_i}
                                            >
                                            <AnchorLink
                                                href={`#chart-${chart_i}`}
                                                offset={100}
                                                >
                                                <Text fontWeight="bold"
                                                    >
                                                {_.get(chart, "title", '')}
                                                </Text>
                                            </AnchorLink>
                                        </Box>
                                    )
                                })}
                            </GridItem>
                            </Grid>
                        </Box>
                    </GridItem>
                    <GridItem
                        colSpan={{
                            base: 5,
                            sm: 5,
                            md: 4,
                            lg: 3

                        }}>
                        <Heading>
                            Tezos Statistics
                        </Heading>
                        <Divider />
                        <Box
                            maxWidth="40rem"
                            >
                        <MarkdownWrapper
                            markdownText={introduction}
                            />
                        </Box>
                        
                        {charts.map((chart, chart_i) => {
                            var datasetKey = _.get(chart, "dataset", "")
                            var chartData = _.get(datasets, datasetKey, false)
                            var chartColumns = _.get(chart, "columns", [])
                            var chartType = _.get(chart, "type", "line")
                            var chartColor = _.get(chart, "color", "rgb(100,100,100)")
                            var columnToggles = _.get(chart, "columnToggles", false)
                            return (
                                <Box paddingBottom="2rem"
                                    key={chart_i}
                                    >
                                    <Divider />
                                    <Text
                                        id={`chart-${chart_i}`}
                                        fontWeight="bold"
                                        >
                                        {_.get(chart, "title", "")}
                                    </Text>
                                    {chartData && (
                                        <ChartContainer
                                            data={chartData}
                                            columns={chartColumns}
                                            type={chartType}
                                            color={chartColor}
                                            columnToggles={columnToggles}
                                            />
                                    )}
                                    <Text
                                        maxWidth="40rem"
                                        >
                                        {_.get(chart, "description", "")}
                                    </Text>
                                    
                                </Box>
                            )
                        })}
                        <Box height="8rem" />
                    </GridItem>
                </Grid>
                
            </Box>
        </PageLayout>
    )
}


const ChartContainer = ({
    data,
    columns,
    type="line",
    color,
    columnToggles
}) => {

    var dateCol = ["date"]
    var _data = data.map(p => {
        var _p = {}
        columns.forEach(c => {
            _p[c] = p[c]
        })
        dateCol.forEach(c => {
            _p[c] = p[c]
        })
        return _p
    })
    var xDomain = [
        _.first(_data),
        _.last(_data)
    ].map(d => dayjs(d.date))
    var dataDomain = findDataRangeInData(_data)
    return (
        <Chart
            data={_data}
            columns={columns}
            xKey={"date"}
            xDomain={xDomain}
            dataDomain={[0, dataDomain[1]]}
            width="dynamic"
            timelineBrush={true}
            type={type}
            color={color}
            columnToggles={columnToggles}
            >
            <BadgesLegend
                labelText="Metrics"
                columns={columns}
                />
        </Chart>
    )
}

var dailyStatsCache = false

var dailyStatsOldUrl = "https://the-stack-report.ams3.digitaloceanspaces.com/datasets/tezos/daily/2022-03-30/transactions_daily_stats_full.csv"

var tezosDailyChainStatsUrl = "https://the-stack-report.ams3.cdn.digitaloceanspaces.com/datasets/tezos/chain/tezos-daily-chain-stats.csv"

export async function getServerSideProps(context) {
    const resp = await fetch(dailyStatsOldUrl)
    var dailyDataOld = await resp.text()
    dailyDataOld = d3.csvParse(dailyDataOld)

    const resp2 = await fetch(tezosDailyChainStatsUrl)

    var dailyChainStats = await resp2.text()
    dailyChainStats = d3.csvParse(dailyChainStats)

    return {
        props: {
            dailyStatsOld: dailyDataOld,
            dailyChainStats:dailyChainStats
        }
    }
}

export default TezosStatisticsPage