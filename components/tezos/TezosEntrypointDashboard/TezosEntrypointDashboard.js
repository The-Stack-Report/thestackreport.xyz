import React, { useEffect, useState } from "react"
import loadDataset from "utils/hooks/loadDataset"
import {
    Box,
    Text,
    Container,
    Divider,
    Heading,
    useBreakpointValue,  
    SimpleGrid
} from "@chakra-ui/react"
import { Link } from "@chakra-ui/next-js"
import PatternDivider from "components/PatternDivider"
import Chart from "components/Charts/Chart"
import ForceDirectedNetwork from "components/Charts/ForceDirectedNetwork"
import chroma from "chroma-js"
import _ from "lodash"
import prepareEntrypointNetworkData from "utils/data/entrypoints/prepareEntrypointNetworkData"
import NetworkStatistics from "./components/NetworkStatistics"
import DataTable from "components/DataTable"
import AccordionExplainer from "components/AccordionExplainer"
import CopyTextSegment from "components/CopyTextSegment"
import * as descriptionContent from "./content"


const TezosEntrypointDashboard = ({
    entrypoint,
    calls_timeseries,
    tSeriesDataset,
    topAccountsCallingDf,
    topAccountsCallingDataset,
    topContractsTargetedDf,
    topContractsTargetedDataset,
    entrypointSummary,
    entrypointSummaryDataset,
    sections
}) => {
    const networkHeight = useBreakpointValue({
        base: 500,
        md: 700,
        lg: 700,
        xl: 700
    })
    const networkNodes = useBreakpointValue({
        base: 50,
        md: 100,
        lg: 200,
        xl: 200
    })
    const [customNodeFilter, setCustomNodeFilter] = useState(false)
    const [rerenderNetwork, setRerenderNetwork] = useState(false)

    var {
        loading,
        loadingError,
        dataset,
        data,
        resetDataLoad
    } = loadDataset(`the-stack-report--tezos-entrypoint-${entrypoint}-network-reduced`, (rawText) => {
        var rawParsedData = JSON.parse(rawText)
        var windowWidth = _.get(window, "innerWidth", 1000)
        var nodeFilter = networkNodes
        if(customNodeFilter) {
            nodeFilter = customNodeFilter
        }

        var preparedNetwork = prepareEntrypointNetworkData(rawParsedData, nodeFilter, windowWidth)
        return preparedNetwork
    })

    useEffect(() => {
        if(_.isObject(data)) {
            setRerenderNetwork(false)
        }
        if(rerenderNetwork) {
            setTimeout(() => {

                resetDataLoad()
                setRerenderNetwork(false)
            }, 10)
        }
    }, [rerenderNetwork, data, resetDataLoad])

    return (
        <Box>
            <Box maxW="100%" paddingTop="85px">
                <Box
                    id={sections["entrypoint-network"].id}
                    >
                    <Box minHeight={`${networkHeight}px`}>
                        
                        {(_.isObject(data) && rerenderNetwork === false) ? (
                            <Box minHeight={`${networkHeight}px`}>
                                <ForceDirectedNetwork
                                    data={data}
                                    height={networkHeight}
                                    width={"100%"}
                                    />
                            </Box>
                        ) : (
                            <Box>
                                {loading && (
                                    <Text minHeight={`${networkHeight}px`} textAlign="center" paddingTop="5rem">
                                        Loading...
                                    </Text>
                                )}
                                {loadingError && (
                                    <Text minHeight={`${networkHeight}px`}  textAlign="center" paddingTop="5rem">
                                        Error loading data.
                                    </Text>
                                )}
                            </Box>
                        )}
                    </Box>
                    <Box>
                        <NetworkStatistics
                            entrypoint={entrypoint}
                            data={data}
                            entrypointSummary={entrypointSummary}
                            nodeCountCallback={(nodeCount) => {
                                setRerenderNetwork(true)
                                setCustomNodeFilter(nodeCount)
                            }}
                            />
                    </Box>
                    <Container maxW="container.xl">
                        <AccordionExplainer {...descriptionContent.overallDescription} generatorValue={entrypoint}  />
                    </Container>
                </Box>
            </Box>
            <Container maxW="container.xl">
                <PatternDivider marginTop="0rem" />
                <Box
                    maxWidth="40rem"
                    id={sections["entrypoint-usage"].id}
                    >
                    <Heading marginBottom="2rem">
                        {entrypoint} <br />
                        <Text as="span" fontWeight="light" opacity={0.5}>
                            Time series charts
                        </Text>
                    </Heading>
                </Box>
                <Chart
                    data={calls_timeseries}
                    dataset={tSeriesDataset}
                    xKey={"date"}
                    columns={[
                        `${entrypoint} calls`
                    ]}
                    color="#2A4858"
                    type="area"
                    badgesLegend={true}
                    timelineBrush={true}
                    name={`Nr of calls to ${entrypoint} entrypoints per day.`}
                    badgesLegendText = "Entrypoint"
                    chartId={`tezos-entrypoint-analysis-${entrypoint}-calls-per-day`}
                    noteEditingEnabled={true}
                    showChartNotes={true}
                    height={300}
                    />
                <AccordionExplainer {...descriptionContent.callsChartDesription} generatorValue={entrypoint} />
                <PatternDivider marginTop="0rem" />
                <Chart
                    data={calls_timeseries}
                    dataset={tSeriesDataset}
                    xKey={"date"}
                    columns={[
                        `${entrypoint} calls sum`
                    ]}
                    color="#2A4858"
                    badgesLegend={true}
                    timelineBrush={true}
                    name = {`Nr of calls to ${entrypoint} entrypoints cumulative.`}
                    badgesLegendText="entrypoint"
                    chartId={`tezos-entrypoint-analysis-${entrypoint}-calls-per-day-sum`}
                    noteEditingEnabled={true}
                    showChartNotes={true}
                    height={300}
                    />
                <AccordionExplainer {...descriptionContent.callsSumChartDescription} generatorValue={entrypoint}  />
            </Container>
            <Container maxW="container.xl">
                <PatternDivider marginTop="0rem" />
                <Chart
                    data={calls_timeseries}
                    dataset={tSeriesDataset}
                    xKey={"date"}
                    columns={[
                        "Contracts targeted",
                        "Accounts sending"
                    ]}
                    color={chroma.scale(["rgb(0,50,190)", "rgb(105,100,100)"])}
                    badgesLegend={true}
                    timelineBrush={true}
                    name ={`Accounts involved with ${entrypoint} calls per day.`}
                    badgesLegendText="link"
                    chartId={`tezos-entrypoint-analysis-${entrypoint}-accounts-involved-per-day`}
                    noteEditingEnabled={true}
                    showChartNotes={true}
                    height={300}
                    />
                <AccordionExplainer {...descriptionContent.accountsInvolvedChartDescription} generatorValue={entrypoint}  />
                <PatternDivider marginTop="0rem" />
            </Container>
            <Container maxW="container.xl">
                <Box>
                <Heading marginBottom="2rem">
                    {entrypoint} <br />
                    <Text as="span" fontWeight="light" opacity={0.5}>
                        Accounts involved
                    </Text>
                </Heading>
                </Box>
                <SimpleGrid columns={[1, 1, 1, 2]} spacing="2rem">
                <Box
                    id={sections["accounts-involved"].id}
                    paddingTop="2rem" paddingBottom="2rem"
                    >
                    <Text fontWeight="bold" fontSize="0.8rem" paddingBottom="0.5rem">
                        Top accounts calling
                        <Text as="i" fontWeight="normal">
                            {` ${entrypoint} `}
                        </Text>
                        entrypoint.
                    </Text>
                    <DataTable
                        data={topAccountsCallingDf.slice(0, 10)}
                        columns={[
                            "name",
                            "Transactions",
                            "Unique targets"
                        ]}
                        customColumns={{
                            "name": (row) => {
                                var address = row.address
                                if(address.startsWith("KT")) {
                                    return (
                                        <Link
                                            href={`/dashboards/tezos/contracts/${address}`}
                                            >
                                            {row.name}
                                        </Link>
                                    )
                                }
                                return (
                                    <CopyTextSegment text={row.address} showText={false} displayText={row.name.length > 0 ? row.name : row.address} />
                                )
                            }
                        }}
                        />
                    <Text paddingTop="0.5rem" paddingBottom="0.5rem" fontSize="0.8rem">
                        {entrypointSummary.senders > 10 ? (
                            <>
                            Top 10 out of {entrypointSummary.senders.toLocaleString()}
                            {" accounts "}
                            sorted on calls towards <i>{entrypoint}</i> entrypoints.
                            </>
                        ) : (
                            <>
                            Total of {entrypointSummary.senders.toLocaleString()}
                            {entrypointSummary.senders === 1 ? " account with " : " accounts sorted on nr of "}
                            calls towards <i>{entrypoint}</i> entrypoints.
                            </>
                        )}
                    </Text>
                </Box>
                <Box paddingTop="2rem" paddingBottom="2rem" >
                    <Text fontWeight="bold" fontSize="0.8rem" paddingBottom="0.5rem">
                        Top contracts with
                        <Text as="i" fontWeight="normal">
                            {` ${entrypoint} `}
                        </Text>
                        entrypoint targetted.
                    </Text>
                    <DataTable
                        data={topContractsTargetedDf.slice(0, 10)}
                        columns={[
                            "name",
                            "Transactions",
                            "Unique senders"
                        ]}
                        customColumns={{
                            "name": (row) => {
                                var address = row.address
                                if(address.startsWith("KT")) {
                                    return (
                                        <Link
                                            href={`/dashboards/tezos/contracts/${address}`}
                                            >
                                            {row.name}
                                        </Link>
                                    )
                                }
                                return (
                                    <CopyTextSegment text={row.address} showText={false} displayText={row.name.length > 0 ? row.name : row.address} />
                                )
                            }
                        }}
                        />
                    <Text paddingTop="0.5rem" paddingBottom="0.5rem" fontSize="0.8rem">
                        {entrypointSummary.targets > 10 ? (
                            <>
                            Top 10 out of {entrypointSummary.targets.toLocaleString()}
                            {" contracts "}
                            sorted on calls towards their <i>{entrypoint}</i> entrypoint.
                            </>
                        ) : (
                            <>
                            Total of {entrypointSummary.targets.toLocaleString()}
                            {entrypointSummary.targets === 1 ? " contract with " : " contracts sorted on nr of "}
                            calls towards their <i>{entrypoint}</i> entrypoint.
                            </>
                        )}
                        
                    </Text>
                </Box>
                
                </SimpleGrid>
                <AccordionExplainer {...descriptionContent.accountsInvolvedTablesDescription} generatorValue={entrypoint}  />
                <PatternDivider />
                
            </Container>
        </Box>
    )
}

export default TezosEntrypointDashboard