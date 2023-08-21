import _ from "lodash"

export default _.trim(`
The above charts show statistics on baker fees paid for calls to this smart contract.

Baker fees are added to transactions and have a twofold function.
There is a minimum baking fee which is meant to cover the data and computation cost of adding a transaction to the blockchain.

Tezos bakers can choose to prioritize inclusion of transactions with a higher fee.
This implicitly turns *block space* into an asset sold to the highest bidder (i.e. the agent who includes the highest baker fee in the transaction).

Peaks in total xtz paid for baker fees (first chart), but especially a high **max** value (third chart) indicate attempts to actively try to get priority for transactions on that day from a shared baker.
`)