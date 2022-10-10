import _ from "lodash"

export const interpretationLayerContent = _.trim(`
The Stack Report is a platform for data-driven storytelling & analytics.

Supporting users, developers and investors in the Tezos ecosystem to learn about the ideas, projects and experiments in developing a new de-centralized tech stack for the internet.

In the [chart catalog](/chart-catalog) and on the [smart contract dashboards](/dashboards/tezos) pages a large number of graphs and data visualizations can be found, displaying on-chain activity by users and systems.

Making meaning out of data often requires extra context.

The <i>Interpretation Layer</i> is a set of tools to add context and meaning to charts and datasets on The Stack Report data platform.

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


<div>
<ModelChart
model="contract"
_key="KT1RJ6PbjHpwc3M5rw5s2Nbmefwbuwbdxton"
view="entrypoints-daily"
custom_note='[{"note":"Second #Objkt4Objkt event", "date": "2021-09-10"}, {"note":"New marketplace contract", "date": "2021-06-29"}, {"note": "first #Objkt4objkt event.", "date": "2021-04-25"}]'
end_date="2021-11-01"
/>
</div>
---


*When will it be available?*

Initially the *interpretation layer* will launch in **beta mode**. 

*How can I get access?*

You can get access to the tools by connecting your wallet and owning a *beta access token*.

These beta access tokens can be purchased through objkt.com. 

On the [account page](/connected-account) you can validate that you own the correct token.

*Who is this for?*

This initial launch is meant for Tezos enthusiasts who love to explore Tezos data and educate others.



*What does beta mean?*

The beta is meant to validate the concept, gather feedback on the UX and catch bugs before scaling up the interpretation layer. Beta access is managed through the beta community access token.
During beta testing we’ll also further develop the business model, so when the interpretation layer leaves beta there is a big chance the access pattern will evolve.


`)