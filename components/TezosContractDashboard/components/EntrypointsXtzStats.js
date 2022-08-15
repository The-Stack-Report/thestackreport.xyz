import React from "react"
import {
    Box,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel
} from "@chakra-ui/react"
import Chart from "components/Charts/Chart"
import _ from "lodash"
import chroma from "chroma-js"

var xtzScale = chroma.scale([
    "rgb(10,35,190)",
    "rgb(100,200,250)",
    "rgb(150,220,220)"
])

xtzScale = chroma.scale([
    "rgb(40,49,49)",
    "rgb(100,100,100)",
    "rgb(220,220,220)"
])

const EntrypointsXtzStats = ({
    contract,
    xtzEntrypointsStats
}) => {

    var allCols = _.keys(_.first(xtzEntrypointsStats))

    var medianCols = allCols.filter(p => p.endsWith("median"))
    var meanCols = allCols.filter(p => p.endsWith("mean"))
    var sumCols = allCols.filter(p => p.endsWith("sum"))
    var maxColumns = allCols.filter(p => p.endsWith("max"))

    var address = _.get(contract, "address", 'no-address')
    var alias = _.get(contract, "tzkt_account_data.alias", address)

    return (
        <Box>
            <Chart
                name={`${alias} entrypoints xtz sum.`}
                timelineBrush={true}
                badgesLegend={true}
                data={xtzEntrypointsStats}
                columns={sumCols}
                color={xtzScale}
                yAxisTickLabel="xtz"
                />
            <Box minHeight="4rem" />
            <Chart
                name={`${alias} entrypoints xtz median.`}
                timelineBrush={true}
                badgesLegend={true}
                data={xtzEntrypointsStats}
                columns={medianCols}
                color={xtzScale}
                yAxisTickLabel="xtz"
                />
            <Box minHeight="4rem" />
            <Chart
                name={`${alias} entrypoints xtz mean.`}
                timelineBrush={true}
                badgesLegend={true}
                data={xtzEntrypointsStats}
                columns={meanCols}
                color={xtzScale}
                yAxisTickLabel="xtz"
                />
            <Box minHeight="4rem" />
            <Chart
                name={`${alias} entrypoints xtz max.`}
                timelineBrush={true}
                badgesLegend={true}
                data={xtzEntrypointsStats}
                columns={maxColumns}
                color={xtzScale}
                yAxisTickLabel="xtz"
                />
        </Box>
    )
}

export default EntrypointsXtzStats