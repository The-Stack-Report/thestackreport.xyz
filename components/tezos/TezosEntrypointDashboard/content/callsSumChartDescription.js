import _ from "lodash"

const title = "About calls to entrypoint summed chart"
const textMd = (entrypoint) => {
    return _.trim(`
Entrypoints are targetted in transactions.

The above chart shows the cumulative value of the data from the chart before it. The line shows the total number of transactions targetting entrypoints by name *${entrypoint}* as it grows over time.
`)
}

const contents = {
    title,
    textMd
}

export default contents