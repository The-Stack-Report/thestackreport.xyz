import React, { useMemo } from "react"
import {
    Box,
    Text,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody
} from "@chakra-ui/react"
import _ from "lodash"

const DataTable = ({
    data,
    columns = false,
    columnNames = false,
    customColumns = {}
}) => {
    const borderStyle = "1px solid rgb(220,220,220)"

    return (
        <Box
            border={borderStyle}
            >
            <TableContainer>
                <Table size="sm">
                    <Thead>
                        <Tr>
                            {columns.map((col, col_i) => {
                                var colName = _.get(columnNames, col_i, col)
                                return (
                                    <Th
                                        key={col_i}
                                        >
                                        {colName}
                                    </Th>
                                )
                            })}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((row, row_i, rows) => {
                            return (
                                <Tr
                                    key={row_i}
                                    >
                                    {columns.map((col, col_i, cols) => {
                                        var colContentGenerator = _.get(customColumns, col)
                                        var colContent = _.get(row, col, "not-found")
                                        if(colContentGenerator) {
                                            colContent = colContentGenerator(row)
                                        }
                                        if(_.isNumber(colContent)) {
                                            colContent = colContent.toLocaleString()
                                        }
                                        return (
                                            <Td
                                                key={col_i}
                                                fontSize="0.8rem"
                                                >
                                                {colContent}
                                            </Td>
                                        )
                                    })}
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default DataTable