import React from "react"
import {
    Box,
    Text,
    useBreakpointValue
} from "@chakra-ui/react"
import DataTable from "components/DataTable"
import WrappedLink from "components/WrappedLink"
import PieChart from "components/Charts/PieChart"
import PieArrowTop from "./components/PieArrowTop"
import PieArrowBottom from "./components/PieArrowBottom"
import _ from "lodash"

const ContractTransactionFlow = ({
    contract,
    color
}) => {
    const pieChartMargins = useBreakpointValue({ base: 60, md: 40})
    const pieChartMaxHeight = useBreakpointValue({ base: 300, md: 400})


    var contract_address = _.get(contract, "address")
    var contract_alias = _.get(contract, "tzkt_account_data.alias", contract_address)
    var dailyStats = _.get(contract, "dailyStats")
    var topCallers = _.get(dailyStats, "top_100_callers", [])
    var topTargets = _.get(dailyStats, "top_100_targets", [])
    var top10Callers = topCallers.slice(0, 10)
    var top10Targets = topTargets.slice(0, 10)

    var topCallersTableFooter = ""


    var topTargetsTableFooter = ""


    var donutData = _.get(dailyStats, "entrypoints", []).map(p => {
        return {
            key: p.entrypoint,
            value: p.count
        }
    })

    var totalSenders = _.get(contract, "usage.total_senders", 0)
    var totalTargetted = _.get(contract, "usage.total_targetted", 0)

    return (
        <div>
            <Text
                fontWeight="light"
                as="h2"
                fontSize="1.4rem"
                paddingBottom="2rem"
                textAlign="center"
                >
                Contract transaction flow
            </Text>
            <Box
                maxW="600px"
                >
                <Text
                    fontSize="0.8rem"
                    paddingBottom="0.5rem"
                    >
                    Top accounts calling:{" "}
                    <Text as="span" fontWeight="bold">
                    {_.get(contract, "tzkt_account_data.alias", contract_address)}
                    </Text>
                </Text>
                <DataTable
                    data={top10Callers}
                    columns={["sender_address", "count"]}
                    customColumns={{
                        sender_address: (row) => {
                            var sender_addr = _.get(row, "sender_address", "not-found")
                            if(sender_addr.startsWith("KT")) {
                                return (
                                    <WrappedLink
                                        href={`/dashboards/tezos/contracts/${sender_addr}`}
                                        >
                                        {sender_addr}
                                    </WrappedLink>
                                )
                            }
                            return (
                                <Text>
                                    {sender_addr}
                                </Text>
                            )
                        }
                    }}
                    footer={""}
                    />
                {top10Callers.length <totalSenders && (
                <Text
                    fontSize="0.8rem"
                    paddingTop="0.5rem"
                    paddingLeft="1.2rem"
                    >
                    Top 10 from total of <strong>{totalSenders.toLocaleString()}</strong> callers.
                </Text>
                )}
                
            </Box>
            <Box position="relative">
            
            <Box
                padding="2rem"
                textAlign="center"
                overflow="visible"
                >
                <PieArrowTop
                    maxHeight={pieChartMaxHeight}
                    />
                <PieChart
                    margins={pieChartMargins}
                    maxHeight={pieChartMaxHeight}
                    data={donutData}
                    color={color}
                    centerLabelTopLine={contract_alias}
                    centerLabelBottomLine={"Entrypoints"}
                    />
                <PieArrowBottom
                    />
            </Box>
            </Box>
            <Box
                display="flex"
                justifyContent="right"
                >
                <Box
                    maxW="600px"
                    flexGrow={1}
                    >
                    
                    <DataTable
                        data={top10Targets}
                        columns={["target_entrypoint", "count"]}
                        customColumns={{
                            target_entrypoint: (row) => {
                                var target_entrypoint = _.get(row, "target_entrypoint", "not-found")
                                var split_values = []
                                if(target_entrypoint.startsWith("KT")) {
                                    split_values = target_entrypoint.split(".")
                                }
                                
                                if(split_values.length > 1) {
                                    return (
                                        <Text
                                            noOfLines={2}
                                            display={{
                                                base: "initial",
                                                md: "flex"
                                            }}
                                            >
                                            <WrappedLink
                                                href={`/dashboards/tezos/contracts/${split_values[0]}`}
                                                >
                                                {split_values[0]}
                                                
                                            </WrappedLink>
                                            <Text as="span">
                                                {`.${split_values[1]}`}
                                                </Text>
                                        </Text>
                                    )
                                }
                                return (
                                    <Text>
                                        {target_entrypoint} with link
                                    </Text>
                                )
                            }
                        }}
                        />
                    <Box
                        paddingTop="0.5rem"
                        paddingRight="0.5rem"
                        >
                    {top10Targets.length < totalTargetted ? (
                        <Text
                            fontSize="0.8rem"
                            paddingBottom="1rem"
                            textAlign="right"
                            >
                            {`Top accounts (& entrypoints) targetted`}
                            <br />
                            in transactions by: {" "}
                            <Text as="span" fontWeight="bold">
                            {_.get(contract, "tzkt_account_data.alias", contract_address)}
                            </Text>
                        </Text>
                    ) : (
                        <Text
                            fontSize="0.8rem"
                            paddingBottom="1rem"
                            textAlign="right"
                            >
                            {'Top 10 accounts (& entrypoints) from total of'} {`${totalTargetted.toLocaleString()} targetted in transactions by:`}
                            <br />
                            <Text as="span" fontWeight="bold">
                            {_.get(contract, "tzkt_account_data.alias", contract_address)}
                            </Text>
                        </Text>
                    )}
                    </Box>
                    
                </Box>
            </Box>
        </div>
    )
}

export default ContractTransactionFlow