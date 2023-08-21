import _ from "lodash"

export default _.trim(`
The above charts block space share statistics.

Block space is a finite virtual resource, limited by the underlying physical costs to computation and data storage.
This is measured by the *gas used* metric and paid for through the *baker fee*.

Looking at share of block space used by a smart contract gives insight into how much  "block space marketshare" this contract consumes.
Depending on the type & function of the smart contract this can come from a single or many users.

The first chart shows the percentage of transactions which are calls to this contract relative to the total nr of transactions and contract calls for that day.
The second chart shows xtz spent on baker fees for transaction on this contract relative to total baker fee xtz spent. 

`)