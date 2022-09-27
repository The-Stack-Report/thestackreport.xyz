import React from "react"
import {
    Box,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    Text
} from "@chakra-ui/react"
import DataTable from "components/DataTable"

const StatsByEntrypoint = ({
    contract,
    dailyStats
}) => {
    console.log(contract, dailyStats)
    var entrypointsXtzStatsTotal = _.get(dailyStats, "xtz_per_entrypoint", false)
    var entrypoints = dailyStats.entrypoints.map(p => p.entrypoint)
    console.log(entrypointsXtzStatsTotal)


    return (
        <Box>
            <Tabs>
                <TabList
                    overflowX="scroll"
                    height="3rem"
                    overflowY="hidden"
                    >
                    {entrypoints.map(entrypoint => {
                        return (
                            <Tab key={entrypoint}
                                fontSize="0.8rem"
                                paddingLeft="0.5rem"
                                paddingRight="0.5rem"
                                paddingTop="0rem"
                                paddingBottom="1rem"
                                lineHeight="0.1rem"
                                height="2.5rem"
                                position="relative"
                                top="0.2rem"
                                >
                                
                                {entrypoint}
                            </Tab>
                        )
                    })}
                </TabList>
                <TabPanels>
                    {entrypoints.map(entrypoint => {
                        var inStats = _.get(entrypointsXtzStatsTotal, `${entrypoint}_in`, false)
                        var outStats = _.get(entrypointsXtzStatsTotal, `${entrypoint}_out`, false)


                        console.log(inStats, outStats)
                        var inStatsFlat = _.keys(inStats).map(key => {
                            return {
                                key: `${entrypoint}_in.${key}`,
                                value: inStats[key]
                            }
                        })

                        var outStatsFlat = _.keys(outStats).map(key => {
                            return {
                                key: `${entrypoint}_out.${key}`,
                                value: outStats[key]
                            }
                        })
                        return (
                            <TabPanel
                                key={entrypoint}
                                >
                                <DataTable data={inStatsFlat} columns={["key", "value"]} />
                            </TabPanel>
                        )
                    })}
                </TabPanels>
            </Tabs>
        </Box>
    )
}

export default StatsByEntrypoint