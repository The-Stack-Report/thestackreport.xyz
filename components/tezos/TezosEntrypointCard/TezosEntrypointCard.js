import React from "react"
import {
    Box,
    SimpleGrid,
    Text,
    useBreakpointValue
} from "@chakra-ui/react"
import { Link } from "@chakra-ui/next-js"
import loadDataset from "utils/hooks/loadDataset"
import chroma from "chroma-js"
import _ from "lodash"

var colorScale = chroma.scale(['#2A4858','#B8FAB1']).domain([0, 1]).mode('lch')

const TezosEntrypointCard = ({
    entrypoint,
    cardWidth = {base: "12rem"},
    loadDataDelay = 0
}) => {
    var maxCardWidth = useBreakpointValue(cardWidth)

    const DATASET_IDENTIFIER =  `the-stack-report--tezos-entrypoint-${entrypoint}-summary`
    const {
        loading,
        loadingError,
        dataset,
        data
    } = loadDataset(DATASET_IDENTIFIER, (rawText) => {
        try {
        var parsedData = JSON.parse(rawText)
        return parsedData
        } catch (e) {
            console.log(e)
            console.log("Error loading: ", DATASET_IDENTIFIER)
            return {}
        }
    })
    
    var senders = _.get(data, "senders", 0)
    var targets = _.get(data, "targets", 0)
    var transactions = _.get(data, "transactions", 0)
    var contract_senders = _.get(data, "contract_senders", 0)
    var wallet_senders = _.get(data, "wallet_senders", 0)


    var senders_and_targets = senders + targets
    var senders_fraction = senders / senders_and_targets
    var senders_percent = senders_fraction * 100
    var targets_fraction = targets / senders_and_targets
    var targets_percent = targets_fraction * 100

    var contract_senders_fraction = contract_senders / senders
    var contract_senders_percent = contract_senders_fraction * 100
    var wallet_senders_fraction = wallet_senders / senders
    var wallet_senders_percent = wallet_senders_fraction * 100

    return (
        <Box width={maxCardWidth} role="group">
            <Link
                href={`/dashboards/tezos/entrypoints/${entrypoint}`}
                textDecoration={"none"}
                >
                    <Box >
                        <Box>
                            <Text
                                textAlign="center"
                                fontWeight="light"
                                _groupHover={{ color: "black", textDecoration: "underline" }}
                                noOfLines={1}
                                >
                                {entrypoint}
                            </Text>
                        </Box>
                        <Box minHeight="6rem" >
                            <Box position="relative" boxShadow="base" borderRadius="3px" height="50px" overflow="hidden" background="gray.200">
                                <Box display="flex" height="1rem">
                                    <Box
                                        width={`${senders_percent.toFixed(2)}%`}
                                        overflow="hidden"
                                        height="50px"
                                        borderRight="1px solid black"
                                        >
                                        <Box height={wallet_senders_fraction * 50}   background={colorScale(1-senders_fraction).darken(-1).hex()} borderBottom="1px solid black"></Box>
                                        <Box height={contract_senders_fraction * 50} background={colorScale(1-senders_fraction).darken(1).hex()}></Box>
                                    </Box>
                                    <Box
                                        width={`${targets_percent.toFixed(2)}%`}
                                        background={colorScale(1-targets_fraction).darken(1).hex()}
                                        overflow="hidden"
                                        height="50px"
                                        >
                                    </Box>
                                </Box>
                                <SimpleGrid columns={2} position="absolute" top="0px" left="0px" right="0px">
                                    <Box>
                                        <Text
                                            fontSize="0.7rem"
                                            fontWeight="bold"
                                            color="white"
                                            paddingLeft="0.25rem"
                                            >
                                            {senders.toLocaleString()}
                                        </Text>
                                        <Text fontSize="0.7rem" color="gray.100" paddingLeft="0.25rem">
                                            senders
                                        </Text>
                                    </Box>
                                    <Box>
                                        <Text
                                            fontSize="0.7rem"
                                            textAlign="right"
                                            fontWeight="bold"
                                            color="white"
                                            paddingRight="0.25rem"
                                            >
                                            {targets.toLocaleString()}
                                        </Text>
                                        <Text fontSize="0.7rem" textAlign="right" color="gray.100" paddingRight="0.25rem">
                                            {targets === 1 ? "target" : "targets"}
                                        </Text>
                                    </Box>
                                </SimpleGrid>
                            </Box>
                            <Box fontSize="0.7rem" paddingTop="0rem"
                                >
                                <Text
                                    color={colorScale(1-senders_fraction).darken(-1).hex()}
                                    _groupHover={{ textDecoration: "underline" }}
                                    >
                                    <strong>{wallet_senders.toLocaleString()}</strong> from wallets
                                </Text>
                                <Text
                                    color={colorScale(1-senders_fraction).darken(1).hex()}
                                    _groupHover={{  textDecoration: "underline" }}
                                    >
                                    <strong>{contract_senders.toLocaleString()}</strong> from contracts.
                                </Text>
                            </Box>
                        </Box>
                    </Box>
            </Link>
        </Box>
    )
}

export default TezosEntrypointCard