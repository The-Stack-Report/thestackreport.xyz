import React from "react"
import {
    Box,
    Container,
    Button,
    Text,
    SimpleGrid
} from "@chakra-ui/react"
import _ from "lodash"
import DataSheet from "components/DataSheet"
import PatternDivider from "components/PatternDivider"
import dayjs from "dayjs"

const NetworkStatistics = ({
    entrypoint,
    data,
    entrypointSummary,
    nodeCountCallback,
}) => {
    var showingPartialNetwork = _.get(data, "remaining_node_count") > 0 || _.get(data, "remaining_link_count") > 0

    if(!_.isObject(data)) {
        showingPartialNetwork = true
    }

    var buttonProps = {
        border: "1px solid black",
        color: "black",
        background: "transparent",
        size: "xs",
        marginLeft: "0.25rem",
        marginRight: "0.25rem",
        width: "4rem",
        _hover: {
            background: "black",
            color: "white"
        }
    }

    const nodeSelectionButtonValues = [
        50,
        100, 
        200
    ].reverse()

    return (
        <Container
            maxW="container.xl"
            >
            <Box
                marginBottom="1rem"
                border="1px solid rgb(240,240,240)"
                marginTop="-2rem"
                fontSize="0.9rem"
                padding="0.5rem"
                background="white"
                boxShadow='base'
                position="relative"
                zIndex={100}
                >
                {showingPartialNetwork ? (
                    <Box>
                        <SimpleGrid columns={[1, 1, 2]} spacing="2rem">
                        <Text>
                            Showing partial network of top <strong>{_.get(data, "nodes.length")} nodes</strong> and <strong>{_.get(data, "links.length")} links</strong>.
                        </Text>
                        <Box
                            display="flex"
                            flexDirection="row-reverse"
                            >
                            <Text>nodes</Text>
                            {nodeSelectionButtonValues.map(value => {
                                return (
                                    <Button {...buttonProps}
                                        onPointerDown={() => {
                                            nodeCountCallback(value)
                                        }}
                                        key={value}
                                        >
                                        {value}
                                    </Button>
                                )
                            })}
                            
                            <Text>
                                Show top
                            </Text>
                        </Box>
                        </SimpleGrid>
                        <Text color="gray.500">
                            <i>{_.get(data, "remaining_node_count", 0).toLocaleString()} nodes</i> and <i>{_.get(data, "remaining_link_count", 0).toLocaleString()} links</i> hidden for rendering performance.
                        </Text>
                        
                    </Box>
                ) : (
                    <Box>
                        <Text>
                            Showing full network of {_.get(data, "nodes.length", 0).toLocaleString()} nodes and {_.get(data, "links.length", 0).toLocaleString()} links.
                        </Text>
                    </Box>
                )}
                <PatternDivider
                    marginTop="1rem"
                    marginBottom="1rem"
                    />
                <DataSheet
                    data={[entrypointSummary]}
                    columns={[
                        {
                            key: "entrypoint",
                            title: "Entrypoint",
                            type: "text"
                        },
                        {
                            key: "transactions",
                            title: "Transactions",
                            type: "int"
                        },
                        {
                            key: "senders",
                            title: "Senders",
                            type: "int"
                        },
                        {
                            key: "targets",
                            title: "Targets",
                            type: "int"
                        }
                    ]}
                    />
                <Text marginTop="0.5rem"  color="gray.500">Total statistics for entrypoints named <i>{entrypoint}</i> across the full tezos chain. Data up to and including {dayjs(entrypointSummary.date_formatted).subtract(1, "days").format("MMMM D, YYYY")}.</Text>
                
            </Box>
        </Container>
    )
}


export default NetworkStatistics
