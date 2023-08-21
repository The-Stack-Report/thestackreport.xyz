import _ from "lodash"

const title = "About accounts involved with entrypoint chart"
const textMd = _.trim(`
Tezos accounts can be involved with entrypoint transactions in two ways. Either as *caller* of an entrypoint, being the account sending the transaction,
or as *callee* of an entrypoint, being the account that is targetted in the transaction.
In the case of transactions that involve an entrypoint, the targetted account is always a smart contract.
While the sending account in the transaction can be either a smart contract or a regular account.

The above chart shows the number of accounts per day which are involved with the specifically named entrypoint across all contracts on the Tezos chain.

Depending on the entrypoint name for which the chart is shown the number of accounts sending and contracts targetted can be within the same range or be vastly different.
Some entrypoint names will only be used by one or a few smart contracts, while having thousands of accounts sending transactions to them. In that case the *contracts targeted* metric will be shown very close to the baseline and can hardly be visually differentiated.

`)

const contents = {
    title,
    textMd
}
export default contents