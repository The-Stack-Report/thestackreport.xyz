import React from "react"
import {
    Box,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from "@chakra-ui/react"
import _ from "lodash"

const StatsTable = ({ contract }) => {
    var contract_calls_past_two_weeks = _.get(contract, "past_14_days.total_calls")
    if (_.isNumber(contract_calls_past_two_weeks)) {
        contract_calls_past_two_weeks = contract_calls_past_two_weeks.toLocaleString()
    }

    var total_transactions_count = _.get(contract, "total_contract_calls", 0)

    if (_.isNumber(total_transactions_count)) {
        total_transactions_count = total_transactions_count.toLocaleString()
    }
    return (
        <Box>
            <TableContainer>
                <Table
                    variant='simple'
                    size="sm"
                    fontSize="0.7rem"
                    >
                    <Tbody>
                        <Tr>
                            <Td fontSize="0.7rem" paddingLeft="0px" >Calls past 2 weeks</Td>
                            <Td fontSize="0.7rem" paddingLeft="0px" >{contract_calls_past_two_weeks}</Td>
                        </Tr>
                        <Tr>
                            <Td fontSize="0.7rem" paddingLeft="0px" >Total calls</Td>
                            <Td fontSize="0.7rem" paddingLeft="0px" >{total_transactions_count}</Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default StatsTable