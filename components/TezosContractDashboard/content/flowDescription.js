import _ from "lodash"

export default _.trim(`
The above visual shows three elements combined. The first table contains the top accounts (both wallets and other contracts) that generate transactions targetting this contract.

The central pie chart displays the distribution of entrypoints being called by those accounts.

Calling an entrypoint triggers the smart contract code to run. This might trigger new transactions coming from that smart contract code. These transactions can have other targets again.

A common pattern is for example an NFT marketplace contract which is being called by various wallets and generates transactions that are then targetting the NFT contract. 
`)