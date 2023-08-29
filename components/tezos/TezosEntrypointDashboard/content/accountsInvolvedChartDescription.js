import _ from "lodash"

const title = "About accounts involved with entrypoint chart"
const textMd = _.trim(`
Tezos accounts can be involved with entrypoint transactions in two ways. Either as *caller* of an entrypoint, being the *account sending* the transaction,
or as *callee* of an entrypoint, being the *smart contract targeted in the transaction.
In the case of transactions that involve an entrypoint, the *targeted account* is always a smart contract.
While the sending account in the transaction can be either a smart contract or a regular account. (It is also possible for smart contracts to generate transactions that target themselves)

The above chart shows the number of accounts per day which are involved with the specifically named entrypoint across all contracts on the Tezos chain.

Depending on the entrypoint name for which the chart is shown the number of accounts sending and contracts targeted can be within the same range or be vastly different.
Some entrypoint names will only be used by one or a few smart contracts, while having thousands of accounts sending transactions to them. In that case the *contracts targeted* metric will bee hardly visible on the baseline.
By clicking on the labels in the top left corner you can zoom in specifically on that metric.
`)

const contents = {
    title,
    textMd
}
export default contents