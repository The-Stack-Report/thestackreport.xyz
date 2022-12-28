import _ from "lodash"

export const interpretationLayerContent = _.trim(`
The Stack Report is a platform to learn about the creation of a de-centralized tech stack for the internet.

Supporting users, developers and investors in the Tezos ecosystem with pro-active analysis and tools that expose the data streams from the Tezos network.

In the [chart catalog](/charts) and on the [smart contract dashboards](/dashboards/tezos) pages a large number of graphs and data visualizations can be found, displaying on-chain activity by users and systems.

Making meaning out of data often requires extra context.

The <i>Interpretation Layer</i> is intended to become a set of tools to add context and meaning to charts and datasets on The Stack Report data platform.

Chart Notes, as will be introduced below, is the first component of the interpretation layer. Allowing community members to place and share notes on top of Stack Report charts.

More tools to interpret & share datasets and data visuals will be added to the interpretation layer in the future.

---

## Chart Notes

**Chart Notes** is the first of these tools to be made available. These are publicly visible *notes* that can be left behind by *community members* as well as the stack report team.

See below for what such a note looks like:

<div>
<ModelChart
model="contract"
_key="KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton"
view="entrypoints-daily"
custom_note='{"note":"#Objkt4Objkt event", "date": "2021-09-10"}'
end_date="2021-11-01"
/>
</div>

---

Notes are fixed to a specific chart and can be placed at a specific date. The note can be edited by the author at any time.



---

# FAQ

`)

export const interpretationLayerFAQ = [
    {
        question: "When will it be available?",
        answer: "Initially the *interpretation layer* will launch in **beta mode**."
    },
    {
        question: "How can I get access?",
        answer: "You can get access to the tools by connecting your wallet and owning a *beta access token*.\n\nThese beta access tokens can be purchased through objkt.com. \n\nOn the [account page](/connected-account) you can validate that you own the correct token."
    },
    {
        question: "Who is this for?",
        answer: "This initial launch is meant for Tezos enthusiasts who love to explore Tezos data and educate others."
    },
    {
        question: "What does beta mean?",
        answer: "The beta is meant to validate the concept, gather feedback on the UX and catch bugs before scaling up the interpretation layer. Beta access is managed through the beta community access token.\n\nDuring beta testing we’ll also further develop the business model, so when the interpretation layer leaves beta there is a big chance the access pattern will evolve."
    },
    {
        question: "What is the business model?",
        answer: "The business model is still being developed. The initial beta access token is a way to validate the concept and gather feedback. The beta access token will be replaced by a more long-term sustainable system. Early supporters of the interpretation layer will not be forgotten though!"
    },
    {
        question: "What is the interpretation layer?",
        answer: "The interpretation layer is a set of tools to add context and meaning to charts and datasets on The Stack Report data platform."
    },
    {
        question: "What is a chart note?",
        answer: "Chart notes are publicly visible *notes* that can be left behind by *community members* as well as the stack report team."
    },
    {
        question: "What is the beta community access token?",
        answer: "The beta community access token is a token that grants access to the interpretation layer tools. It is a way to validate the concept and gather feedback."
    }
]