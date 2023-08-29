import _ from "lodash"

const title = "About accounts involved with entrypoint tables"
const textMd = (entrypoint) => _.trim(`
The table on the left shows the top 10 accounts sending transactions to any entrypoint by name *${entrypoint}*.

The table on the right shows the top 10 smart contracts with an entrypoint by name *${entrypoint}* being targeted in transactions.
`)

const contents = {
    title,
    textMd
}

export default contents