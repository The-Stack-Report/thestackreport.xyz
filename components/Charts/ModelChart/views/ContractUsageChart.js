import React, { useState, useEffect } from "react"
import useFetch from "react-fetch-hook"
import prepareContractDailyStats from "utils/data/contracts/prepareContractDailyStats"
import Chart from "components/Charts/Chart"
import { gridScale, grayScale } from "utils/colorScales"
import dayjs from "dayjs"

import WrappedLink from "components/WrappedLink"
import StyledLink from "components/Links/StyledLink"
import {
    Text
} from "@chakra-ui/react"


var ContractUsageChart = ({
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

    var _props = {
        xDomain: xDomain
    }

    // Merge props parsed from markdown into the component
    _props = {
        ..._props,
        ...chartProps
    }

    var usage = _.get(contract, "usageByDay", [])
    if(_.isArray(usage) && usage.length === 0) usage = false

    return (
        <div>
            {isLoading ? (
                <p>Loading data for {address}</p>
            ) : (
                <>
                
                {view === "entrypoints-daily" && (
                    <>
                        <Text
                            fontWeight="bold"
                            fontSize="0.8rem"
                            paddingBottom="2rem"
                            >
                            <Text
                            as="span"
                            fontWeight="light"
                            >
                            Entrypoints called{" "}
                            </Text>
                            <WrappedLink href={`/dashboards/tezos/contracts/${address}`}>
                            {_.get(contract, "tzkt_account_data.alias", address)}
                            </WrappedLink>
                        </Text>
                        <Chart
                            name=" "
                            data={contract.byDay}
                            dataHash={address}
                            type="area"
                            columns={cols}
                            xKey={"date"}
                            width={"dynamic"}
                            color={color}
                            height={300}
                            timelineBrush={true}
                            badgesLegend={true}
                            noDataTooltipPlaceholder={"No calls for date: "}
                            badgesLegendText = "Nr of calls to entrypoints"
                            noteEditingEnabled={true}
                            chartId={`${address}-daily-entrypoint-calls`}
                            {..._props}
                            />
                    </>
                )}
                {view === "accounts-active-daily" && (
                    <>
                    <Text
                        fontWeight="bold"

                        fontSize="0.8rem"
                        >
                        <Text
                        as="span"
                        fontWeight="light"
                        >
                        Accounts using{" "}
                        </Text>
                        <StyledLink href={`/dashboards/tezos/contracts/${address}`}>
                        {_.get(contract, "tzkt_account_data.alias", address)}
                        </StyledLink>
                    </Text>
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
                        noDataTooltipPlaceholder={"No accounts active for date: "}
                        badgesLegendText = "Nr of accounts active, split by wallet/contract."
                        {..._props}
                        />
                    </>
                )}
                <Text
                    fontSize="0.7rem"
                    textAlign="right"
                    marginBottom="1rem"
                    color="gray.500"
                    >
                    Dashboard:{" "}
                    <StyledLink href={`/dashboards/tezos/contracts/${address}`}>
                        {_.get(contract, "tzkt_account_data.alias", address)}
                    </StyledLink>
                </Text>
                </>
            )}
        </div>
    )
}

export default ContractUsageChart