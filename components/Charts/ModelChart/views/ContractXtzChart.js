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

    const [metaData, setMetaData] = useState(false)
    const [loadingMeta, setLoadingMeta] = useState(false)

    var preparedData = useMemo(() => {
        if(_.isString(data)) {
            return xtzStatsPrepFunc(data)
        } else {
            return false
        }
    }, [data])

    useEffect(() => {
        if(metaData === false && loadingMeta === false) {
            setLoadingMeta(true)
            fetch(`/api/contract?address=${address}`)
                .then(resp => {
                    if(resp.status === 200) {
                        return resp.json()

                    }
                })
                .then(metaDataResp => {
                    setMetaData(metaDataResp)
                })
        }
        
    }, [metaData, loadingMeta, address])


    if(isLoading === true || !_.isObject(metaData)) {
        return (
            <div style={{height: 200}}>
                Loading {address}
            </div>
        )
    }

    var contract = metaData
    

    
    return (
        <div>
            {preparedData ? (
                <ChartRenderer
                    address={address}
                    contract={contract}
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
    address,
    data,
    contract,
    view,
    chartProps
}) => {
    var defaultCols = _.keys(_.first(data)).filter(c => c.endsWith("sum"))
    var color = "black"

    var _props = {

    }

    var cols = defaultCols
    if(_.has(chartProps, "initialColumnToggles")) {
        cols = chartProps.initialColumnToggles
    }

    cols = _.sortBy(cols.map(c => {
        return {
            c: c,
            total: _.sum(data.map(p => _.get(p, c, 0)))
        }
    }), "total").map(c => c.c).reverse()

    _props = {
        ..._props,
        ...chartProps
    }
    return (
        <>
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
        <Text
            fontSize="0.7rem"
            textAlign="right"
            marginBottom="1rem"
            color="gray.500"
            >
            Dashboard:{" "}
        <WrappedLink href={`/dashboards/tezos/contracts/${address}#xtz-statistics`}>
            
            {_.get(contract, "tzkt_account_data.alias", address)}
            
        </WrappedLink>
        </Text>
        </>
    )
}

export default ContractXtzChart