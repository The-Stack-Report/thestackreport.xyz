import _ from "lodash"

export const title = "About entrypoint transactions analysis"
export const textMd = (entrypoint) => { return _.trim(`
This page provides you with a number of charts visualizing Tezos transactions that target entrypoints by name *${entrypoint}*.
All charts and tables shown, are based on the same underlying slice of Tezos transactions. To put it in technical terms, this is the underlying (simplified) SQL query:

\`SELECT * FROM transactions WHERE entrypoint = '${entrypoint}'\`

Which stands at the basis for the various datasets visualized on this page.

The above network visualization shows the **top accounts** involved, sorted on *number of transactions* targetting entrypoints by name *${entrypoint}*.
In <span style="background:black;color:white;">black</span> are the smart contract accounts that had *${entrypoint}* entrypoint calls.
The <span style="background:rgb(240,240,240);">white</span> nodes are the accounts that sent transactions to *${entrypoint}* entrypoints.

---
#### Network tips & tricks

These kinds of networks can be quite large and complex, quickly turning into "hairballs" when visualizing them. Here are some tips to help navigate the visualization:

- **Zoom in** to see more details
- **Drag nodes** to reposition them
- **Drag the background** to move the entire network
- **Click on nodes** to highlight connections

`)}

const contents = {
    title,
    textMd
}

export default contents