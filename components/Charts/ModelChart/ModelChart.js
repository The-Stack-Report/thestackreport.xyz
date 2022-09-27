import React, { useState, useEffect } from "react"
import * as contractModel from "./models/contract" 
import ContractUsageChart from "./views/ContractUsageChart"
import ContractXtzChart from "./views/ContractXtzChart"
import ContractBlockShareChart from "./views/ContractBlockShareChart"
import ContractBakerFeeChart from "./views/ContractBakerFeeChart"
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

    const blockShareViews = ["transaction-share", "fee-share"]

    if (modelConfig) {
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
        
    }

    return (
        <div>
            Model chart
        </div>
    )
}

export default ModelChart