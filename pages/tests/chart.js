import React from "react"
import Head from "next/head"
import { Container } from "@chakra-ui/layout"
import {
    Heading,
    SimpleGrid,
    Box
} from "@chakra-ui/react"
import PageLayout from "components/PageLayout"
import _ from "lodash"
import Chart from "components/Charts/Chart"
import dayjs from "dayjs"
import { gridScale } from "utils/colorScales"
import * as d3 from "d3"
import prepareDf from "utils/data/prepareDf"
import chroma from "chroma-js"

var testData = _.range(100).map(val => {
    return {
        x: val,
        y: val,
        y2: Math.sin(val/4) * 20,
        y3: 100 + Math.cos(val/7) * 13,
        y4: val * val / 50
    }
})

var datesTestData = _.range(50).map(val => {
    return {
        date: dayjs().add(val, "day"),
        y: val
    }
})

var grayScale = chroma.scale(["rgb(0,0,0)", "rgb(100,100,100)"])

const ChartTestPage = ({dailyData}) => {
    var tezosSampleData = dailyData.map(p => {
        return {
            ...p,
            date: dayjs(p["date"])
        }
    })

    var nrCols = _.keys(_.first(tezosSampleData)).filter(c => c !== "date")
    return (
        <PageLayout>
            <Head>
                <title>Charts tests</title>
            </Head>
            <Container maxW="container.xl" paddingTop="8rem" paddingBottom="8rem">
                <Heading>
                    Charts
                </Heading>
                <Chart
                    data={tezosSampleData}
                    xKey={"date"}
                    columns={["transactions", "transaction_groups"]}
                    timelineBrush={true}
                    color={grayScale}
                    />
                <Chart
                    data={tezosSampleData}
                    xKey={"date"}
                    columns={["wallets_sending_transactions", "contracts_sending_transactions"]}
                    timelineBrush={true}
                    color={grayScale}
                    />
                <Chart
                    data={tezosSampleData}
                    xKey={"date"}
                    columns={nrCols}
                    timelineBrush={true}
                    color={gridScale(0.5)}
                    columnToggles={true}
                    />
                <Chart
                    data={testData}
                    columns={["y", "y2", "y3", "y4"]}
                    xKey={"x"}
                    timelineBrush={true}
                    color="rgb(150,150,150)"
                    />
                <Chart
                    data={testData}
                    columns={["y4", "y3", "y", "y2" ]}
                    xKey={"x"}
                    color={gridScale(0)}
                    timelineBrush={true}
                    type="area"
                    />
                <Chart
                    data={testData}
                    columns={["y"]}
                    xKey={"x"}
                    type="bar"
                    color={gridScale(0)}
                    timelineBrush={true}
                    />
                <Chart
                    data={datesTestData}
                    columns={["y"]}
                    xKey={"date"}
                    type="bar"
                    color={gridScale(1)}
                    timelineBrush={true}
                    />
                <SimpleGrid
                    columns={2}
                    spacing={10}
                    >
                    <Box>
                        <Chart
                            data={tezosSampleData}
                            xKey={"date"}
                            columns={["transactions", "transaction_groups"]}
                            timelineBrush={true}
                            color={grayScale}
                            />
                    </Box>
                    <Box>
                        <Chart
                            data={tezosSampleData}
                            xKey={"date"}
                            columns={["transactions", "transaction_groups"]}
                            timelineBrush={true}
                            color={grayScale}
                            />
                    </Box>
                </SimpleGrid>
            </Container>
        </PageLayout>
    )
}


var tezosTestDataUrl = "https://the-stack-report.ams3.cdn.digitaloceanspaces.com/datasets/tezos/chain/tezos-daily-chain-stats.csv"

export async function getServerSideProps() {
    var isProd = process.env.NODE_ENV === "production"

    if(isProd) {
        return {
            redirect: {
                permanent: false,
                destination: "/",
            },
          }
    } else {
        
        const resp = await fetch(tezosTestDataUrl)
        var dailyData = await resp.text()
        dailyData = d3.csvParse(dailyData)
        var nrCols = _.keys(_.first(dailyData)).filter(c => c !== "date")

        dailyData = prepareDf(
            dailyData,
            ["date"],
            nrCols
            )

        return {
            props: {
            dailyData: JSON.parse(JSON.stringify(dailyData))
        }}
    }

}


export default ChartTestPage