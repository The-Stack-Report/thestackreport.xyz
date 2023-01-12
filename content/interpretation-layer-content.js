import _ from "lodash"

export const interpretationLayerContent = _.trim(`
The Stack Report is a platform to learn about the creation of a de-centralized tech stack for the internet.

Supporting users, developers and investors in the Tezos ecosystem with pro-active analysis and tools that expose the data streams from the Tezos network.

In the [chart catalog](/charts) and on the [smart contract dashboards](/dashboards/tezos) pages a large number of graphs and data visualizations can be found, displaying on-chain activity by users and systems.

Making meaning out of data often requires extra context.

The <i>Interpretation Layer</i> is intended to become a set of tools to add context and meaning to charts and datasets on The Stack Report data platform.

Chart Notes, as will be introduced below, is the first component of the interpretation layer. Allowing community members to place and share notes on top of Stack Report charts.

More tools to interpret & share datasets and data visuals will be added to the interpretation layer in the future.

Access to the tools that make up the Interpretation Layer is managed through a set of digital Access Cards which you can hold in a Tezos wallet account. 

---

### Chart Notes

**Chart Notes** is the first of these tools to be made available. These are publicly visible *notes* that can be left behind by *community members* as well as the stack report team.

See below for a chart with a note placed on it.

<div>
<ModelChart
model="contract"
_key="KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton"
view="entrypoints-daily"
custom_note='{"note":"#OBJKT4OBJKT ED.1", "date": "2021-04-25"}'
end_date="2021-11-01"
show_chart_notes="yes"
/>
</div>

---

Notes are fixed to a specific chart and can be placed at a specific date. The note can be edited by the author at any time.

---

### Access Cards

Access to the tools that make up the Interpretation Layer is managed through a set of digital cards. These can be added to your Tezos account.

The full Access Card collection can be found on Objkt.com at: [https://objkt.com/collection/KT1LaCf37XyoR4eNCzMnw6Ccp5bfPFQrKYxe](https://objkt.com/collection/KT1LaCf37XyoR4eNCzMnw6Ccp5bfPFQrKYxe).

The Stack Report uses Access Cards to manage the growth of users on the platform in a controlled manner.

*New cards* will be added in the future as the set of tools and community of interested users grows.

Below is a selection of the cards that are currently available.

---


`)

export const interpretationLayerFAQ = [
    {
        question: "When will it be available?",
        answer: "The *Interpretation Layer* is live now!"
    },
    {
        question: "How can I get access?",
        answer: "You can get access to the tools by connecting your wallet and owning an *Access Card*.\n\nThese Cards can be acquired through objkt.com. \n\nOn the [account page](/connected-account) you can confirm that you own a valid card."
    },
    {
        question: "Who is this for?",
        answer: "This initial launch is meant for Tezos enthusiasts who love to explore Tezos data and educate others."
    },
    {
        question: "What is the interpretation layer?",
        answer: "The *interpretation layer* is a set of tools to add context and meaning to charts and datasets on The Stack Report data platform."
    },
    {
        question: "What is a chart note?",
        answer: "Chart notes are publicly visible *notes* that can be left behind by *community members* as well as the stack report team."
    },
    {
        question: "How do I place a note on a chart?",
        answer: "When you hover over the X Axis with the mouse cursor, you will see a preview of a note to be placed. Once you click, a new note will be instantiated in the front-end. Only after you press save on the note itself, the new note will be stored in the database."
    },
    {
        question: "Where are Chart Notes stored?",
        answer: "Chart notes are stored in a database maintained by The Stack Report. Currently they are not stored on the blockchain."
    },
    {
        question: "What are the Access Cards?",
        answer: "The Interpretation Layer Access Cards are tokens that give the holder authorization to access to the interpretation layer tools. \n\nThese Cards can be acquired through objkt.com. \n\nOn the [account page](/connected-account) you can confirm that you own a valid card."
    },
    {
        question: "How is supply managed?",
        answer: "The purpose of the Access Cards is to grow the community of users on the platform in a controlled manner. \n\n*New cards* will be added in the future as set of tools and community of interested users grows."
    },
    {
        question: "Are Chart Notes moderated?",
        answer: `Yes! Chart notes are meant to provide further context & educational value.\n\nThe Stack Report will actively remove notes and even block accounts of Access Cards holders who post notes that do not add to this intended goal.
        
        `
    }
]