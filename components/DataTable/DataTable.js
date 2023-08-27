import React, { useState, useMemo } from "react"
import {
    Box,
    Text,
    TableContainer,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody,
    Button,
    SimpleGrid,
    Highlight
} from "@chakra-ui/react"
import _ from "lodash"
import dayjs from "dayjs"
import { Link } from '@chakra-ui/next-js'

const DataTable = ({
    data,
    columns = false,
    columnNames = false,
    customColumns = {},
    rowLink = false,
    colLinks = {},
    rowProps = {},
    highlightWords = [],
    maxRows = false
}) => {
    const [showTopRows, setShowTopRows] = useState(maxRows)
    const borderStyle = "1px solid rgb(220,220,220)"

    var _columns = columns
    if(!_.isArray(_columns) && data.length > 0) {
        _columns = _.keys(_.first(data))
    }

    const showShowMoreButton = useMemo(() => {
        if(showTopRows && data.length > showTopRows) {
            return true
        }
        return false
    }, [data.length, showTopRows])

    return (
        <Box>
            <Box
                border={borderStyle}
                >
                {data.length === 0 ? (
                    <Box>
                        No data
                    </Box>

                ) : (
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
                                    if(showTopRows && row_i >= showTopRows) {
                                        return null
                                    }

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
                                                    colContent = colContent.toLocaleString('en')
                                                    if(colContent.endsWith(".00")) {
                                                        colContent = colContent.slice(0, colContent.length - 3)
                                                    }
                                                } else if(dayjs.isDayjs(colContent)) {
                                                    colContent = colContent.format("MMMM D, YYYY h:mm A")
                                                } else if(_.isArray(colContent)) {
                                                    colContent = colContent.join(", ")
                                                } else if (React.isValidElement(colContent)) {
                                                    colContent = colContent
                                                } else if(_.isObject(colContent)) {
                                                    colContent = JSON.stringify(colContent)
                                                }
                                                if (_.isString(colContent)) {
                                                    colContent = (
                                                        <Highlight
                                                            query={highlightWords}
                                                            styles={{bg: 'black', color: "white" }}
                                                            >
                                                        {colContent}
                                                        </Highlight>
                                                    )
                                                }
                                                if(_.has(colLinks, col)) {
                                                    var link = colLinks[col](row)
                                                    colContent = (
                                                        <Link
                                                            href={link}
                                                            >
                                                            {colContent}
                                                        </Link>
                                                    )
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

                                    return (
                                        <React.Fragment key={row_i}>
                                        {colBody}
                                        </React.Fragment>
                                    )
                                })}
                                
                            </Tbody>
                        </Table>
                    </TableContainer>
                )}
                
            </Box>
            {showShowMoreButton && (
                <Box>
                    <Text fontSize='0.8rem' textAlign="right">
                        Showing {showTopRows} of {data.length.toLocaleString()} rows
                    </Text>
                <SimpleGrid columns={2} columnGap={2} paddingTop="0.5rem">
                <Button
                    size="xs"
                    background="black"
                    color="white"
                    _hover={{
                        background: "white",
                        color: "black",
                        border: "1px solid black"
                    }}
                    onPointerDown={() => {
                        const increment = 10
                        if(showTopRows + increment >= data.length) {
                            setShowTopRows(data.length)
                        } else {    
                            setShowTopRows(showTopRows + increment)
                        }
                    }}
                    >
                    Show more
                </Button>   
                <Button
                    size="xs"
                    background="black"
                    color="white"
                    _hover={{
                        background: "white",
                        color: "black",
                        border: "1px solid black"
                    }}
                    onPointerDown={() => {
                        setShowTopRows(data.length)
                    }}
                    >
                    Show all
                </Button>
                </SimpleGrid>
                </Box>
            )}
        </Box>
    )
}

export default DataTable