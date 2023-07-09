import React, { useState, useEffect } from "react"
import Head from "next/head"
import PageLayout from 'components/PageLayout'
import {
    Heading,
    Text,
    Box,
    Divider,
    Container
} from "@chakra-ui/react"
import _ from "lodash"
import S_Dataset from "models/server/S_Dataset"
import prepareDf from "utils/data/prepareDf"
import Chart from "components/Charts/Chart"
import InPageNavigator from "components/InPageNavigator"
import PatternDivider from "components/PatternDivider"


var sections = [
    {
        title: "Entrypoint usage",
        id: "entrypoint-usage"
    },
    {
        title: "Entrypoint network",
        id: "entrypoint-network"
    }
]

var sectionsAsDict = {}

sections.forEach(section => {
    sectionsAsDict[section.id] = section
})

const TezosEntrypointSemanticAnalysisPage = ({
    entrypoint,
    timeseries
}) => {
    console.log(timeseries)

    var t_series = prepareDf(timeseries, ["date"],
        [
            "transactions",
            "senders",
            "targets"
        ]
    )

    var transactions_sum = 0
    t_series.forEach((row) => {
        transactions_sum += row.transactions
        row["transactions_sum"] = transactions_sum
        row[`${entrypoint} calls`] = row.transactions
        row[`${entrypoint} calls sum`] = row.transactions_sum
    })

    console.log(t_series)
    return (
        <PageLayout>
            <Head>
                <title>{entrypoint} entrypoint analysis</title>
                <meta name="description" content={`Tezos blockchain smart contract entrypoint semantic analysis for entrypoint ${entrypoint}.`} />
            </Head>
            <InPageNavigator
                sections={sections}
                >
            <Container maxW="container.xl" paddingTop="8rem" id="page-top">
                <Heading>
                    {entrypoint} entrypoint analysis
                </Heading>
                <Divider />
                <Box
                    maxWidth="40rem"
                    id={sectionsAsDict["entrypoint-usage"].id}
                    >
                    <Text marginBottom="1rem">
                        Tezos smart contract entrypoint semantic analysis.
                    </Text>
                    <Text>
                        {entrypoint}
                    </Text>
                </Box>
                <Divider />
                <Chart
                    data={t_series}
                    xKey={"date"}
                    columns={[
                        `${entrypoint} calls`,
                        "senders",
                        "targets"
                    ]}
                    color="rgb(0,50,190)"
                    badgesLegend={true}
                    timelineBrush={true}
                    badgesLegendText = "Nr of calls to entrypoints"
                    chartId={`tezos-entrypoint-semantic-analysis-${entrypoint}-time-series`}
                    noteEditingEnabled={true}
                    showChartNotes={true}
                    />
                <PatternDivider />
                <Chart
                    data={t_series}
                    xKey={"date"}
                    columns={[
                        `${entrypoint} calls sum`
                    ]}
                    color="rgb(0,20,150)"
                    badgesLegend={true}
                    timelineBrush={true}
                    badgesLegendText = "Nr of calls to entrypoints"
                    chartId={`tezos-entrypoint-semantic-analysis-${entrypoint}-time-series`}
                    noteEditingEnabled={true}
                    showChartNotes={true}
                    />
                <PatternDivider />
                <Box
                    id={sectionsAsDict["entrypoint-network"].id}
                    >
                    <Text>
                        Network
                    </Text>
                </Box>
            </Container>
            </InPageNavigator>
        </PageLayout>
    )
}

export async function getServerSideProps(context) {
    const entrypoint = _.get(context, "query.entrypoint", false)
    
    var timeseriesDataset = new S_Dataset()
    await timeseriesDataset.from_identifier(`the-stack-report--tezos-entrypoint-time-series-${entrypoint}`)
    var timeseriesFile = await timeseriesDataset.load_file()
    return {
        props: {
            entrypoint: entrypoint,
            timeseries: timeseriesFile
        }
    }
}


export default TezosEntrypointSemanticAnalysisPage