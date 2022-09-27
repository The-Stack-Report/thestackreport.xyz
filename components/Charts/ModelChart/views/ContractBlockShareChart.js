import React, { useState, useEffect } from "react"
import useFetch from "react-fetch-hook"
import _ from "lodash"
import prepareContractDailyStats from "utils/data/contracts/prepareContractDailyStats"
import Chart from "components/Charts/Chart"
import { gridScale, grayScale } from "utils/colorScales"
import dayjs from "dayjs"

import WrappedLink from "components/WrappedLink"
import {
    Text
} from "@chakra-ui/react"

const ContractBlockShareChart = ({
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
                    {view === "transaction-share" && (
                        <>
                        <Text
                            fontWeight="bold"
                            fontSize="0.8rem"
                            >
                            <Text
                            as="span"
                            fontWeight="light"
                            >
                            Block share in transactions{" "}
                            </Text>
                            <WrappedLink href={`/dashboards/tezos/contracts/${address}`}>
                            {_.get(contract, "tzkt_account_data.alias", address)}
                            </WrappedLink>
                        </Text>
                        <Chart
                            name=" "
                            data={contract.blockSpaceStatsByDay}
                            dataHash={address}
                            type="line"
                            columns={[
                                "contract_call_share_percentage",
                                "transaction_share_percentage"
                            ]}
                            xKey={"date"}
                            width={"dynamic"}
                            color={grayScale}
                            height={200}
                            timelineBrush={true}
                            badgesLegend={true}
                            noDataTooltipPlaceholder={"No share percentage for date: "}
                            badgesLegendText="Block space by"
                            yAxisTickLabel={"%"}
                            yTickCount={2}

                            {..._props}
                            />
                        </>
                    )}
                    {view === "fee-share" && (
                        <>
                        <Text
                            fontWeight="bold"
                            fontSize="0.8rem"
                            >
                            <Text
                            as="span"
                            fontWeight="light"
                            >
                            Block share in baker fees{" "}
                            </Text>
                            <WrappedLink href={`/dashboards/tezos/contracts/${address}`}>
                            {_.get(contract, "tzkt_account_data.alias", address)}
                            </WrappedLink>
                        </Text>
                        <Chart
                            name=" "
                            data={contract.blockSpaceStatsByDay}
                            dataHash={address}
                            type="line"
                            columns={[
                                "baker_fee_share_percentage"
                            ]}
                            xKey={"date"}
                            width={"dynamic"}
                            color={grayScale}
                            height={200}
                            timelineBrush={true}
                            badgesLegend={true}
                            noDataTooltipPlaceholder={"No baker fee percentage for date: "}
                            badgesLegendText = "Baker fee share"
                            yAxisTickLabel={"%"}
                            yTickCount={2}
                            {..._props}
                            />
                        </>
                    )}
                </>
            )}
        </div>
    )
}

export default ContractBlockShareChart