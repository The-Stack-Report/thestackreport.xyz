import React, { useState, useEffect, useMemo } from "react"
import Head from "next/head"
import { Container } from "@chakra-ui/layout"
import {
    Heading,
    Box,
    Text,
    Divider
} from "@chakra-ui/react"
import PageLayout from "components/PageLayout"
import _ from "lodash"
import { CMS_URL } from 'constants/cms'
import ChartLoader from "components/Charts/ChartLoader"
import prepareChartMetadata from "utils/prepareChartMetadata"
import WrappedLink from "components/WrappedLink"
import MarkdownWrapper from "components/MarkdownWrapper"

const ChartPage = ({ chart }) => {
    const richDescription = _.get(chart, "rich_description", false)
    console.log(richDescription)
    return (
        <PageLayout>
            <Head>
                <title>TSR - Chart: {_.get(chart, "name", "")}</title>
                <meta name="description" content={_.get(chart, "description", "")} />

            </Head>
            <Container maxW="container.xl" paddingTop="100px" paddingBottom="100px">
                        <Box
                            position="absolute"
                            paddingTop={{
                                base: "0rem",
                                md: "1rem"
                            }}
                            >
                        <WrappedLink href="/charts" fontSize="0.7rem">
                            To charts overview
                        </WrappedLink>
                        </Box>
                <Heading
                    marginTop={{
                        base: "2rem",
                        md: "4rem"
                    }}
                    marginBottom="2rem"
                    fontWeight="thin"
                    >
                    {"Chart - "}
                    <Text as="span" fontWeight="bold" textTransform="uppercase">
                        {_.get(chart, "name","")}
                    </Text>
                </Heading>
                {_.isObject(chart) && (
                    <ChartLoader
                        chart={chart}
                        timelineBrush={true}
                        />
                )}
                {_.isString(richDescription) && (
                    <>
                    <Divider />
                    <Box maxWidth="700px">
                        <Heading as="h5" fontWeight="thin" fontSize="1.6rem" paddingTop="1rem" paddingBottom="2rem">About this chart</Heading>
                    <MarkdownWrapper markdownText={richDescription} />
                    </Box>
                    </>
                )}
                
            </Container>
        </PageLayout>
    )
}

export async function getServerSideProps(context) {
    const chartSlug = _.get(context, "query.chart", false)
    var returnData = { props: {errorMessage: "Error.", error: true} }

    if(chartSlug) {
        try {
            const fetchUrl = CMS_URL + `/charts?filters[slug][$eq]=${chartSlug}&populate=*`
            const resp = await fetch(fetchUrl)
            if(resp.status === 200) {
                var data = await resp.json()
                data = _.get(data, "data", [])
                if(data.length > 0) {
                    var chartObj = _.first(data)
                    returnData = {
                        props: {
                            chart: prepareChartMetadata(_.get(chartObj, "attributes", {}))
                        }
                    }
                } else {
                    console.log(`response successful but chart not found for slug: ${chartSlug}`)
                    returnData = { props: {errorMessage: "Chart not found.", error: true} }
                }
            } else {
                console.log(`Error in requesting CMS`)

                returnData = { props: {errorMessage: "Chart not found.", error: true} }

            }

        } catch(err) {
            console.log(err)
        }
    }
    return returnData
}

export default ChartPage