import React, { useState, useEffect, useMemo } from "react"
import useFetch from "react-fetch-hook"
import Chart from "components/Charts/Chart"
import { gridScale, grayScale } from "utils/colorScales"
import dayjs from "dayjs"

import WrappedLink from "components/WrappedLink"
import {
    Text
} from "@chakra-ui/react"
import prepareDf from "utils/data/prepareDf"
import * as d3 from "d3"
import _ from "lodash"

function xtzStatsPrepFunc(rawText) {
    var rawDf = d3.csvParse(rawText)
    console.log(rawDf)
    var nrCols = _.keys(_.first(rawDf)).filter(c => c !== "date")
    var preppedData = prepareDf(
        rawDf,
        ["date"],
        nrCols
    )
    return preppedData
}


function xtzUrl(address) {
    var url = `https://the-stack-report.ams3.digitaloceanspaces.com/datasets/tezos/contracts_daily_stats/${address}-entrypoints-daily-xtz-stats.csv`
    console.log("fetch url: ", url)
    return url
}

var ContractXtzChart = ({
    address,
    view,
    chartProps
}) => {
    const { isLoading, data, error } = useFetch(xtzUrl(address), {
        formatter: (resp) => {
            return resp.text()
        }
    })
    var preparedData = useMemo(() => {
        if(_.isString(data)) {
            return xtzStatsPrepFunc(data)
        } else {
            return false
        }
    }, [data])
    return (
        <div>
            {preparedData ? (
                <ChartRenderer
                    data={preparedData}
                    view={view}
                    chartProps={chartProps}
                    />
            ) : (
                <p>Loading</p>
            )}
            
        </div>
    )
}

const ChartRenderer = ({
    data,
    view,
    chartProps
}) => {
    var defaultCols = _.keys(_.first(data)).filter(c => c.endsWith("sum"))
    var color = "black"


    var _props = {

    }

    var cols = defaultCols
    console.log(chartProps)
    if(_.has(chartProps, "initialColumnToggles")) {
        cols = chartProps.initialColumnToggles
    }

    _props = {
        ..._props,
        ...chartProps
    }
    return (
        <Chart
            data={data}
            columns={cols}
            color={color}
            height={300}
            timelineBrush={true}
            badgesLegend={true}
            yAxisTickLabel="xtz"
            {..._props}
            />
    )
}

export default ContractXtzChart