import React from "react"
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
    var {
        data,
        columns
    } = props

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
    return (
        <div>
        <DataSheetGrid
            value={data}
            columns={dataSheetColumns}
            rowHeight={20}
            height={2000}
            addRowsComponent={false}
            gutterColumn={{ basis: 60 }} 
            />
        </div>
    )
}

export default DataSheet