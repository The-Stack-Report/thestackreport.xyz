import React, { useState, useEffect } from "react"
import useFetch from "react-fetch-hook"
import _ from "lodash"
import prepareContractDailyStats from "utils/data/contracts/prepareContractDailyStats"
import Chart from "components/Charts/Chart"
import { grayScale } from "utils/colorScales"
import dayjs from "dayjs"
import {
    Text
} from "@chakra-ui/react"
import { Link } from "@chakra-ui/next-js"


const ContractBakerFeeChart = ({
    address,
    view,
    chartProps
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
    }, [metaData, loadingMeta, address])
    
    // Returning loading placeholder when data is still being loaded.
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

    var xDomain = [
        _.first(contract.byDay),
        _.last(contract.byDay)
    ].map(d => dayjs(d.date))

    if(_.has(chartProps, "endDate") && chartProps.endDate) {
        xDomain[1] = dayjs(chartProps.endDate)
    }

    var _props = {
        xDomain: xDomain
    }

    // Merge props parsed from markdown into the component
    _props = {
        ..._props,
        ...chartProps
    }

    console.log(chartProps, _props)
    return (
        <div>
            {isLoading ? (
                <p>Loading data for {address}</p>
            ) : (
                <>
                <Text
                    fontWeight="bold"
                    fontSize="0.8rem"
                    >
                    <Text
                        as="span"
                        fontWeight="light"
                        >
                        Baker fees for{" "}
                        <Link
                            href={`/dashboards/tezos/contracts/${address}`}
                            fontWeight={"bold"}
                            >
                        {_.get(contract, "tzkt_account_data.alias", address)}
                        </Link>
                    </Text>
                </Text>
                <Chart
                    name=" "
                    data={contract.blockSpaceStatsByDay}
                    dataHash={address}
                    type="line"
                    columns={[
                        "baker_fee_xtz_sum"
                    ]}
                    xKey={"date"}
                    width={"dynamic"}
                    color={grayScale}
                    height={200}
                    timelineBrush={true}
                    badgesLegend={true}
                    noDataTooltipPlaceholder={"No baker fees for date: "}
                    badgesLegendText = "Baker fee xtz"
                    yAxisTickLabel={"xtz"}
                    yTickCount={2}

                    {..._props}
                    />
                </>
            )}
        </div>
    )
}

export default ContractBakerFeeChart