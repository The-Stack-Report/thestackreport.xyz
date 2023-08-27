import React from "react"
import {
    Box,
    SimpleGrid,
    Text
} from "@chakra-ui/react"
import ContractCard from "components/ContractCard"
import _ from "lodash"


const ContractsCardsTable = ({
    contracts,
    highlightTerm
}) => {
    var highlight = ""
    if(_.isString(highlightTerm) && highlightTerm.length > 0) {
        highlight = highlightTerm
    }

    // return (<Text> Hi</Text>)
    return (
        <Box className='contracts-cards-table'>
            {_.isArray(contracts) ? (
                <Box>
                    <Text>Contracts</Text>
                    {contracts.length > 0 ? (
                        <SimpleGrid
                            columns={{
                                sm: 1,
                                md: 2,
                                lg: 3,
                                xl: 4
                            }}
                            spacing="10px"
                            >
                            {contracts.map(contract => {
                                const sortPosition = _.get(contract, "sort_positions.by_calls_past_14_days", 0)
                                return (
                                    <Box
                                        key={contract.address}
                                        position="relative"
                                        >
                                        <Text
                                            position="absolute"
                                            top={"-1rem"}
                                            right="0rem"
                                            fontSize="0.7rem"
                                            color="gray.500"
                                            textAlign="right"
                                            >
                                            sort position {`#${sortPosition.toLocaleString()}`}
                                        </Text>
                                        <ContractCard
                                            contract={contract}
                                            highlightTerm={highlight}
                                            sortPosition={sortPosition}
                                            />
                                    </Box>
                                )}
                            )}
                        </SimpleGrid>
                    ) : (
                        <p>No contracts provided</p>
                    )}
                    
                </Box>
            ) : (
                <p>No contracts provided</p>
            )}
            
        </Box>
    )
}

export default ContractsCardsTable