import _ from "lodash"

const title = "About calls to entrypoint chart"
const textMd = (entrypoint) => {
    return _.trim(`
Entrypoints are targetted in transactions.

The above chart shows the number of transactions per day targeting entrypoints by name *${entrypoint}* across all smart contracts on the Tezos chain.

Dataset will include only data within the first and last called timestamps, so depending on the entrypoint, the chart may only show a date range relevant for the specific entrypoint.
`)
}

const contents = {
    title,
    textMd
}

export default contents