import React, { useState, useEffect } from "react"
import {
    Box
} from "@chakra-ui/react"
import {
    DataSheetGrid,
    checkboxColumn,
    textColumn,
    intColumn,
    floatColumn,
    keyColumn,
    CellProps
} from 'react-datasheet-grid'
import 'react-datasheet-grid/dist/style.css'

const DataSheet = (props) => {
    const [computedCols, setComputedCols] = useState(false)
    var {
        data,
        columns
    } = props

    useEffect(() => {
        var dataSheetColumns = columns.map((column) => {
            var colType = column.type || "text"
            if(colType === "text") {
                colType = textColumn
            } else if(colType === "int") {
                colType = intColumn
            } else if(colType === "float") {
                colType = floatColumn
            } else if(colType === "checkbox") {
                colType = checkboxColumn
            }
            return {
                ...keyColumn(column.key, colType),
                title: column.title
            }
        })
        setComputedCols(dataSheetColumns)
    }, [columns])
    return (
        <Box className="data-sheet">
            {computedCols && (
                <DataSheetGrid
                    value={data}
                    columns={computedCols}
                    rowHeight={20}
                    height={2000}
                    addRowsComponent={false}
                    gutterColumn={{ basis: 60 }} 
                    style={{
                        '--font-size': '0.8rem'
                    }}
                    />
            )}
        </Box>
    )
}

export default DataSheet