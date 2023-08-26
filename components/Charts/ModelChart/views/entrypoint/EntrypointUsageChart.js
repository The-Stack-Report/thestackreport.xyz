import React, { useMemo } from "react"
import loadDataset from "utils/hooks/loadDataset"
import {
    Box,
    Text
} from "@chakra-ui/react"
import Chart from "components/Charts/Chart"
import prepareDf from "utils/data/prepareDf"
import { Link } from "@chakra-ui/next-js"

const EntrypointUsageChart = ({
    entrypoint,
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


    if (timeseriesIsLoading || !timeseries) {
        return (
            <Box
                height={HEIGHT}
                width="100%"
                >
                <Text>Loading {entrypoint}...</Text>
            </Box>
        )
    }

    

    return (
        <Box>
            <Chart
                data={processedTimeseries}
                dataset={tSeriesDataset}
                xKey={"date"}
                columns={[
                    `${entrypoint} calls`
                ]}
                color="#2A4858"
                badgesLegend={true}
                timelineBrush={true}
                name = {`Nr of calls to ${entrypoint} entrypoints per day.`}
                badgesLegendText="entrypoint"
                chartId={`tezos-entrypoint-analysis-${entrypoint}-calls-per-day-sum`}
                noteEditingEnabled={true}
                showChartNotes={true}
                height={300}
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

export default EntrypointUsageChart