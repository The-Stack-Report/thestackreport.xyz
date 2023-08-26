import React, { useMemo } from "react"
import loadDataset from "utils/hooks/loadDataset"
import {
    Box,
    Text
} from "@chakra-ui/react"
import Chart from "components/Charts/Chart"
import prepareDf from "utils/data/prepareDf"
import { Link } from "@chakra-ui/next-js"
import chroma from "chroma-js"

const EntrypointAccountsChart = ({
    entrypoint,
    chartProps
}) => {
    const timeseriesIdentifier = `the-stack-report--tezos-entrypoint-${entrypoint}-time-series`
    
    const {
        data: timeseries,
        dataset: tSeriesDataset,
        isLoading: timeseriesIsLoading
    } = loadDataset(timeseriesIdentifier, (raw) => {
        return prepareDf(raw, ["date"],
            [
                "transactions",
                "senders",
                "targets",
                "wallet_senders",
                "wallet_targets",
                "contract_senders",
                "contract_targets",
            ]
        )
    })

    var processedTimeseries = useMemo(() => {
        if(timeseries) {
            var transactions_sum = 0
            return timeseries.map((row) => {
                transactions_sum += row.transactions
                row["transactions_sum"] = transactions_sum
                row[`${entrypoint} calls`] = row.transactions
                row[`Contracts targeted`] = row.targets
                row[`Accounts sending`] = row.senders
                row[`${entrypoint} calls sum`] = row.transactions_sum
                return row
            })
        }
        return false
    }, [timeseries])
    
    const HEIGHT = 300


    if (timeseriesIsLoading || !processedTimeseries) {
        return (
            <Box
                height={HEIGHT}
                width="100%"
                >
                <Text>Loading {entrypoint}...</Text>
            </Box>
        )
    }

    var _props = {
        ...chartProps
    }

    return (
        <Box>
            <Chart
                data={processedTimeseries}
                dataset={tSeriesDataset}
                xKey={"date"}
                columns={[
                    "Contracts targeted",
                    "Accounts sending"
                ]}
                columnColors={{
                    "Contracts targeted": chroma("#2A4858").brighten(2).saturate(1.8).hex(),
                    "Accounts sending": chroma("#2A4858").saturate(0.8).hex()
                }}
                badgesLegend={true}
                timelineBrush={true}
                name ={`Accounts involved with ${entrypoint} calls per day.`}
                badgesLegendText="link"
                chartId={`tezos-entrypoint-analysis-${entrypoint}-accounts-involved-per-day`}
                noteEditingEnabled={true}
                showChartNotes={true}
                height={300}
                {..._props}
                />
            <Text
                fontSize="0.7rem"
                textAlign="right"
                marginBottom="1rem"
                color="gray.500"
                >
                Dashboard:{" "}
                <Link
                    href={`/dashboards/tezos/entrypoints/${entrypoint}`}
                    >
                    {entrypoint}
                </Link>
            </Text>
        </Box>
    )
}

export default EntrypointAccountsChart