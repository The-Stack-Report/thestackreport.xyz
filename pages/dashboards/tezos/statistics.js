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
import ChartBySlug from "components/Charts/ChartBySlug"
import dayjs from "dayjs"
import _ from "lodash"
import { findDataRangeInData } from "utils/dataRangeUtils"
import MarkdownWrapper from "components/MarkdownWrapper"
import prepareDf from "utils/data/prepareDf"
import AnchorLink from "components/AnchorLink"
import BadgesLegend from "components/Charts/components/BadgesLegend"
import InPageNavigator from "components/InPageNavigator"

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

const sections = [
    {
        chartSlug: "tezos-chain-transactions",
        id: "tezos-chain-transactions",
        title: "Transactions"
    },
    {
        chartSlug: "tezos-chain-wallet-sender-transactions",
        id: "tezos-chain-wallet-sender-transactions",
        title: "Transactions by wallets"
    },
    {
        chartSlug: "tezos-chain-wallet-targeted-transactions",
        id: "tezos-chain-wallet-targeted-transactions",
        title: "Transactions to wallets"
    },
    {
        chartSlug: "tezos-chain-contracts-sending-transactions",
        id: "tezos-chain-contracts-sending-transactions",
        title: "Contract transactions"
    },
    {
        chartSlug: "daily-active-wallets",
        id: "daily-active-wallets",
        title: "Daily active wallets"
    },
    {
        chartSlug: "tezos-chain-wallets-involved-in-transactions",
        id: "tezos-chain-wallets-involved-in-transactions",
        title: "Wallets involved in transactions"
    }
]


const TezosStatisticsPage = () => {


    return (
        <PageLayout>
            <Head>
                <title>Tezos statistics</title>
                <meta name="description" content="Tezos blockchain statistics." />

            </Head>
            <InPageNavigator
                sections={sections}
                contentOffset={"8rem"}
                >
                <Container maxW="container.xl" paddingTop="8rem" id="page-top">
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
                    {sections.map((section, section_i) => {
                        return (
                            <Box
                                paddingBottom="3rem"
                                paddingTop="3rem"
                                key={`${section_i}`}
                                id={section.id}
                                >
                                <ChartBySlug
                                    slug={_.get(section, "chartSlug")}
                                    />
                            </Box>
                        )
                    })}
                    
                    <Box height="8rem" />
                </Container>
            </InPageNavigator>
            
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

export default TezosStatisticsPage