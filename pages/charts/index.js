import Head from "next/head"
import { Container } from "@chakra-ui/layout"
import {
    Heading,
    Box,
    Text
} from "@chakra-ui/react"
import PageLayout from "components/PageLayout"
import { CMS_URL } from 'constants/cms'
import _ from "lodash"
import prepareChartMetadata from "utils/prepareChartMetadata"
import ChartLoader from "components/Charts/ChartLoader"

const ChartsPage = ({ charts }) => {
    return (
        <PageLayout>
            <Head>
                <title>The Stack Report - Charts</title>
                <meta name="description" content="Charts by The Stack Report." />
            </Head>
            <Container maxW="container.xl" paddingTop="8rem">
                <Heading>
                    Charts
                </Heading>
                {charts.map((chart, chart_i) => {
                    return (
                        <Box
                            paddingBottom="2rem"
                            key={chart_i}
                            >
                        <ChartLoader
                            chart={chart}
                            timelineBrush={true}
                            />
                        </Box>
                    )
                })}
            </Container>
        </PageLayout>
    )
}

export async function getServerSideProps(context) {
    try {
        const fetchUrl = CMS_URL + "/charts"
        const chartsResp = await fetch(CMS_URL + "/charts")
        var respData = await chartsResp.json()
        var charts = _.get(respData, "data", [])
        charts = charts.map(c => prepareChartMetadata(c.attributes))
        return {
            props: {
                charts: charts
            }
        }
    } catch(err) {
        console.log("serverside error on categories page: ", err)
        return {
            props: { charts: [] }
        }
    }
}

export default ChartsPage