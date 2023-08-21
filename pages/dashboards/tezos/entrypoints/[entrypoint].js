import React from "react"
import Head from "next/head"
import PageLayout from 'components/PageLayout'
import {
    Heading,
    Text,
    Box,
    Container
} from "@chakra-ui/react"
import _ from "lodash"
import S_Dataset from "models/server/S_Dataset"
import Dataset from "models/Dataset"
import prepareDf from "utils/data/prepareDf"
import InPageNavigator from "components/InPageNavigator"
import { Link } from "@chakra-ui/next-js"
import TezosEntrypointDashboard from "components/tezos/TezosEntrypointDashboard"


var sections = [
    {
        title: "Entrypoint network",
        id: "entrypoint-network"
    },
    {
        title: "Entrypoint usage",
        id: "entrypoint-usage"
    },
    {
        title: "Accounts involved",
        id: "accounts-involved"
    }
    
]

var sectionsAsDict = {}

sections.forEach(section => {
    sectionsAsDict[section.id] = section
})

const TezosEntrypointAnalysisPage = ({
    entrypoint,
    timeseries,
    timeseriesDatasetJson,

    topAccountsCalling,
    topAccountsCallingDatasetJson,

    topContractsTargeted,
    topContractsTargetedDatasetJson,

    entrypointSummary,
    entrypointSummaryDatasetJson

}) => {
    

    var t_series = []
    var tSeriesDataset = {}

    var topAccountsCallingDf = []
    var topAccountsCallingDataset = {}

    var topContractsTargetedDf = []
    var topContractsTargetedDataset = {}

    var entrypointSummaryDataset = {}
    
    
    try {
        t_series = prepareDf(timeseries, ["date"],
            [
                "transactions",
                "senders",
                "targets"
            ]
        )

        tSeriesDataset = new Dataset(timeseriesDatasetJson)

        var transactions_sum = 0
        t_series.forEach((row) => {
            transactions_sum += row.transactions
            row["transactions_sum"] = transactions_sum
            row[`${entrypoint} calls`] = row.transactions
            row[`Contracts targeted`] = row.targets
            row[`Accounts sending`] = row.senders
            row[`${entrypoint} calls sum`] = row.transactions_sum
        })

        topAccountsCallingDf = prepareDf(topAccountsCalling, ["Last Transaction"],
            [
                "Transactions",
                "Unique Targets"
            ]
        )

        topAccountsCallingDf.forEach(row => {
            row["name"] = row["tzkt_alias"]
            if(!row["name"]) {
                row["name"] = row["address"]
            }
        })

        topAccountsCallingDataset = new Dataset(topAccountsCallingDatasetJson)

        topContractsTargetedDf = prepareDf(topContractsTargeted, ["Last Transaction"],
            [
                "Transactions",
                "Unique Targets"
            ]
        )
        topContractsTargetedDf.forEach(row => {
            row["name"] = row["tzkt_alias"]
            if(!row["name"]) {
                row["name"] = row["address"]
            }
        })

        topContractsTargetedDataset = new Dataset(topContractsTargetedDatasetJson)

        entrypointSummaryDataset = new Dataset(entrypointSummaryDatasetJson)


    } catch (e) {
        console.log(e)
    }
    
    var dataLoaded = t_series.length > 0 && _.keys(tSeriesDataset).length > 0

    var renderedSections = sections

    if (!dataLoaded) {
        renderedSections = []
    }

    return (
        <PageLayout>
            <Head>
                <title>{entrypoint} entrypoint analysis</title>
                <meta name="description" content={`Tezos blockchain analysis of transactions targetting entrypoint ${entrypoint}.`} />
            </Head>
            <InPageNavigator
                sections={renderedSections}
                contentOffset={"6.5rem"}
                >
                <Container maxW="container.xl" id="page-top">
                    <Box
                        position="absolute"
                        top="4rem"
                        paddingTop={{
                            base: "6rem",
                            md: "6rem"
                        }}
                        zIndex={100}
                        >
                        <Link href="/dashboards/tezos/entrypoints" fontSize="0.7rem">
                            To Tezos entrypoints overview
                        </Link>
                    </Box>
                    
                    <Heading
                        marginTop={{
                            base: "9rem",
                            md: "9rem"
                        }}
                        top="3rem"
                        position="absolute"
                        zIndex={100}
                        pointerEvents={"none"}
                        >
                        {entrypoint}<br />
                        <Text as="span" fontWeight="light" opacity={0.5}>
                        entrypoint analysis
                        </Text>
                    </Heading>
                </Container>
                {dataLoaded ? (
                    <TezosEntrypointDashboard
                        entrypoint={entrypoint}
                        calls_timeseries={t_series}
                        tSeriesDataset={tSeriesDataset}
                        topAccountsCallingDf={topAccountsCallingDf}
                        topAccountsCallingDataset={topAccountsCallingDataset}
                        topContractsTargetedDf={topContractsTargetedDf}
                        topContractsTargetedDataset={topContractsTargetedDataset}
                        entrypointSummary={entrypointSummary}
                        entrypointSummaryDataset={entrypointSummaryDataset}
                        sections={sectionsAsDict}
                        />
                ) : (
                    <Container maxW="container.xl">
                        <Text marginTop="25rem" marginBottom="15rem" textAlign="center">
                            Data unavailable for entrypoint {entrypoint}.
                        </Text>
                    </Container>
                )}
                
            </InPageNavigator>
        </PageLayout>
    )
}

export async function getServerSideProps(context) {
    const entrypoint = _.get(context, "query.entrypoint", false)
    
    var timeseriesDataset = new S_Dataset()
    await timeseriesDataset.from_identifier(`the-stack-report--tezos-entrypoint-${entrypoint}-time-series`)
    var timeseriesFile = await timeseriesDataset.load_file()

    var topAccountsCallingDataset = new S_Dataset()
    await topAccountsCallingDataset.from_identifier(`the-stack-report--tezos-entrypoint-${entrypoint}-accounts-calling-top-100`)
    var topAccountsCallingFile = await topAccountsCallingDataset.load_file()

    var topContractsTargetedDataset = new S_Dataset()
    await topContractsTargetedDataset.from_identifier(`the-stack-report--tezos-entrypoint-${entrypoint}-smart-contracts-top-100`)
    var topContractsTargetedFile = await topContractsTargetedDataset.load_file()

    var entrypointSummaryDataset = new S_Dataset()
    await entrypointSummaryDataset.from_identifier(`the-stack-report--tezos-entrypoint-${entrypoint}-summary`)
    var entrypointSummaryFile = await entrypointSummaryDataset.load_file()


    return {
        props: {
            entrypoint: entrypoint,
            timeseriesDatasetJson: timeseriesDataset.to_json(),
            timeseries: timeseriesFile,
            topAccountsCallingDatasetJson: topAccountsCallingDataset.to_json(),
            topAccountsCalling: topAccountsCallingFile,
            topContractsTargetedDatasetJson: topContractsTargetedDataset.to_json(),
            topContractsTargeted: topContractsTargetedFile,
            entrypointSummaryDatasetJson: entrypointSummaryDataset.to_json(),
            entrypointSummary: entrypointSummaryFile
        }
    }
}


export default TezosEntrypointAnalysisPage