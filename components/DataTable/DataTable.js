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
import dayjs from "dayjs"
import WrappedLink from "components/WrappedLink"
import Link from 'next/link'

const DataTable = ({
    data,
    columns = false,
    columnNames = false,
    customColumns = {},
    rowLink = false,
    rowProps = {}
}) => {
    const borderStyle = "1px solid rgb(220,220,220)"

    var _columns = columns
    if(!_.isArray(_columns)) {
        _columns = Object.keys(data[0])
    }

    return (
        <Box
            border={borderStyle}
            >
            <TableContainer>
                <Table size="sm">
                    <Thead>
                        <Tr>
                            {_columns.map((col, col_i) => {
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

                            var _rowProps = rowProps

                            if(rowLink) {
                                _rowProps = {
                                    ..._rowProps,
                                    cursor: "pointer",
                                    _hover: {
                                        background: "black",
                                        color: "white"
                                    }
                                }
                            }


                            var colBody = (
                                <Tr
                                    key={row_i}
                                    {..._rowProps}
                                    >
                                    {_columns.map((col, col_i, cols) => {
                                        var colContentGenerator = _.get(customColumns, col)
                                        var colContent = _.get(row, col, "not-found")
                                        if(colContentGenerator) {
                                            colContent = colContentGenerator(row)
                                        }
                                        if(_.isNumber(colContent)) {
                                            colContent = colContent.toLocaleString()
                                        } else if(dayjs.isDayjs(colContent)) {
                                            colContent = colContent.format("MMMM D, YYYY h:mm A")
                                        } else if(_.isArray(colContent)) {
                                            colContent = colContent.join(", ")
                                        } else if (React.isValidElement(colContent)) {
                                            colContent = colContent
                                        } else if(_.isObject(colContent)) {
                                            colContent = JSON.stringify(colContent)
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

                            if(rowLink) {
                                var link = rowLink(row)
                                return (
                                    <Link href={link} key={row_i} passHref={true}>
                                        {colBody}
                                    </Link>
                                )
                            } else {
                                return (
                                    <React.Fragment key={row_i}>
                                    {colBody}
                                    </React.Fragment>
                                )
                            }
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
        </Box>
    )
}

export default DataTable