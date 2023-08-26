import React, { useState, useEffect } from "react"
import * as contractModel from "./models/contract"
import * as entrypointModel from "./models/entrypoint"

import ContractUsageChart from "./views/contract/ContractUsageChart"
import ContractXtzChart from "./views/contract/ContractXtzChart"
import ContractBlockShareChart from "./views/contract/ContractBlockShareChart"
import ContractBakerFeeChart from "./views/contract/ContractBakerFeeChart"

import EntrypointUsageChart from "./views/entrypoint/EntrypointUsageChart"
import EntrypointUsageSumChart from "./views/entrypoint/EntrypointUsageSumChart"
import EntrypointAccountsChart from "./views/entrypoint/EntrypointAccountsChart"

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
        } else if(model === "entrypoint") {
            modelConfig = entrypointModel
        }
    }

    const blockShareViews = ["transaction-share", "fee-share"]

    console.log("Model chart with the following properties:", {
        model,
        _key,
        view,
        chartProps,
        modelConfig})

    if (modelConfig && model === "contract") {
        if (view === "entrypoints-xtz-daily") {
            return (
                <ContractXtzChart
                    address={_key}
                    view={view}
                    chartProps={chartProps}
                    />
            )
        } else if(view === "baker-fee") {
            return (
                <ContractBakerFeeChart
                    address={_key}
                    view={view}
                    chartProps={chartProps}
                    />
            )
        } else if(blockShareViews.includes(view)) {
            return (
                <ContractBlockShareChart
                    address={_key}
                    view={view}
                    chartProps={chartProps}
                    />
            )
        } else {
            return (
                <ContractUsageChart
                    address={_key}
                    view={view}
                    chartProps={chartProps}
                    />
            )
        }
    } else if (modelConfig && model === "entrypoint") {
        console.log(view)
        if (view === "calls") {
            return (
                <EntrypointUsageChart
                    entrypoint={_key}
                    view={view}
                    chartProps={chartProps}
                    />
            )
        } else if(view === "calls-sum") {
            return (
                <EntrypointUsageSumChart
                    entrypoint={_key}
                    view={view}
                    chartProps={chartProps}
                    />
            )
        } else if(view === "accounts-involved") {
            return (
                <EntrypointAccountsChart
                    entrypoint={_key}
                    view={view}
                    chartProps={chartProps}
                    />
            )
        }
        return (
            <div>Entrypoint mode</div>
        )
    }

    return (
        <div>
            Model chart
        </div>
    )
}

export default ModelChart