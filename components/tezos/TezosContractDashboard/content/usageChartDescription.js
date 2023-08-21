import _ from "lodash"

export default _.trim(`
Contracts can be called by any type of account on the Tezos blockchain. There are currently two main types of accounts: 'wallet' accounts and 'contract' accounts.

When a wallet account calls a smart contract, this usually comes from an interaction with a dApp interface which is then approved by the user in their Wallet app.
In the case of a smart contract calling another smart contract, this usually comes from the smart contract code executing some sort of function.

The above chart shows the number of *wallets* calling the contract per day 
and the number of *contracts* calling the contract per day.

For more explanation on account types, see: [opentezos.operations](https://opentezos.com/tezos-basics/operations/)


`)