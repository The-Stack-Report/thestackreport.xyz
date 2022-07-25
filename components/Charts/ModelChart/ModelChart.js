import React, { useState, useEffect } from "react"
import * as contractModel from "./models/contract" 
import useFetch from "react-fetch-hook"
import prepareContractDailyStats from "utils/data/contracts/prepareContractDailyStats"
import Chart from "components/Charts/Chart"
import { gridScale, grayScale } from "utils/colorScales"
import dayjs from "dayjs"
import _ from "lodash"

const ModelChart = ({
    model,
    _key,
    view,
    chartProps
}) => {
    const [loaded, setLoaded] = useState(false)

    // get model

    // get key dataset

    // get key view

    useEffect(() => {
        if(loaded === false) {
            setLoaded(true)
        }
    }, [loaded])

    var modelConfig = false
    if(loaded) {
        if(model === "contract") {
            modelConfig = contractModel
        }
    }



    if (modelConfig) {
        return (
            <ContractChartRenderer
                address={_key}
                view={view}
                />
        )
    }

    return (
        <div>
            Model chart
        </div>
    )
}

var ContractChartRenderer = ({
    address,
    view
}) => {
    const { isLoading, data } = useFetch(`https://the-stack-report.ams3.digitaloceanspaces.com/datasets/tezos/contracts_daily_stats/${address}-daily-stats.json`)
    const [metaData, setMetaData] = useState(false)
    const [loadingMeta, setLoadingMeta] = useState(false)


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
        
    })
    if(isLoading === true || !_.isObject(metaData)) {
        return (
            <div style={{height: 200}}>
                Loading {address}
            </div>
        )
    }

    



    var _contract = prepareContractDailyStats(data)

    var contract = {
        ...metaData,
        ..._contract
    }
    

    const sortPosition = _.get(contract, "sort_positions.by_calls_past_14_days", false)
    var color = "black"
    if(_.isNumber(sortPosition)) {
        color = gridScale(_.clamp(sortPosition / 100, 0, 1))
    }

    var cols = _.sortBy(contract.entrypoints, "count").reverse().map(p => p.entrypoint)

    var xDomain = [
        _.first(contract.byDay),
        _.last(contract.byDay)
    ].map(d => dayjs(d.date))

    var usage = _.get(contract, "usageByDay", [])
    if(_.isArray(usage) && usage.length === 0) usage = false

    return (
        <div>
            {isLoading ? (
                <p>Loading data for {address}</p>
            ) : (
                <>
                {view === "entrypoints-daily" && (
                    <Chart
                        name=" "
                        data={contract.byDay}
                        dataHash={address}
                        type="area"
                        columns={cols}
                        xKey={"date"}
                        xDomain={xDomain}
                        width={"dynamic"}
                        color={color}
                        height={300}
                        timelineBrush={true}
                        badgesLegend={true}
                        noDataTooltipPlaceholder={"No calls for date: "}
                        badgesLegendText = "Nr of calls to entrypoints"
                        />
                )}
                {view === "accounts-active-daily" && (
                    <Chart
                        name=" "
                        data={usage}
                        dataHash={address}
                        type="line"
                        columns={[
                            "wallets_sending_transactions",
                            "contracts_sending_transactions"
                        ]}
                        color={grayScale}
                        xKey="date"
                        height={250}
                        timelineBrush={true}
                        badgesLegend={true}
                        />
                )}
                </>
            )}
        </div>
    )
}

export default ModelChart