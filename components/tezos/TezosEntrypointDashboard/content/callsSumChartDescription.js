import _ from "lodash"

const title = "About calls to entrypoint summed chart"
const textMd = (entrypoint) => {
    return _.trim(`
The above chart shows the cumulative value of the data from the chart before it. The line shows the total number of transactions targeting entrypoints by name *${entrypoint}*.
`)
}

const contents = {
    title,
    textMd
}

export default contents