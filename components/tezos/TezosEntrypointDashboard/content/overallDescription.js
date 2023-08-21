import _ from "lodash"

export const title = "About entrypoint transactions analysis"
export const textMd = _.trim(`
Code within Tezos smart contracts can specify entrypoints to be specified and targetted in transactions. 

The above network visualization shows the top accounts involved sorted on *number of transactions* targetting entrypoints by a specific name.

In <span style="background:black;color:white;">black</span> are the smart contract accounts that had entrypoint calls.

`)

const contents = {
    title,
    textMd
}

export default contents