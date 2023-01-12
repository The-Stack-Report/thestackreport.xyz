import React, { useEffect, useRef, useState } from "react"
import Head from "next/head"
import PageLayout from "components/PageLayout"
import {
    Container, Divider
} from "@chakra-ui/layout"
import {
    Box,
    Heading,
    Text,
} from "@chakra-ui/react"
import _ from "lodash"
import MarkdownWrapper from "components/MarkdownWrapper"
import { interpretationLayerContent, interpretationLayerFAQ } from "content/interpretation-layer-content"
import AccordionExplainer from "components/AccordionExplainer"
import BannerImage from "components/BannerImage"
import AccessCardsGrid from "components/AccessCardsGrid"
import { INTERPRETATION_LAYER_VISUAL_URL } from "constants/imageAssets"
import { INTERPRETATION_LAYER_CHART_NOTES } from "constants/feature_flags"

var placeholderContent = `
<div style="padding:0px;margin-bottom:20px; overflow: hidden">
<div style="max-width: 600px;">
<video width="100%"
autoplay
muted
loop
>
<source type="video/mp4" src="https://the-stack-report.ams3.cdn.digitaloceanspaces.com/articles_assets/2022/interpretation-layer-teaser-2022-min.mp4" />
</video>
</div>
</div>

The *Interpretation Layer* is a set of tools to add context and meaning to charts and datasets on the Stack Report.

And its coming soon!



The first set of features is currently in the final stages of internal testing and will be rolled out in multiple steps in the new year. 

Upon launch a set of *Interpretation Layer Access Cards* will be made available which allow you to get the most out of this growing set of tools.

Follow The Stack Report on [Twitter](https://twitter.com/thestackreport) for updates and further announcements.
`

var videoPlaceholder = `

`

var pageContentText = interpretationLayerContent
var pageFAQ = interpretationLayerFAQ

if(INTERPRETATION_LAYER_CHART_NOTES === false) {
    pageContentText = placeholderContent
    pageFAQ = []
}

var placeholderFAQ = []

const InterpretationLayerPage = ({ pageContent }) => {
    const paddingRef = useRef(null)

    const [leftPadding, setLeftPadding] = useState(false)

    console.log(paddingRef)

    useEffect(() => {
        if (paddingRef.current) {
            const padding = paddingRef.current.getBoundingClientRect().x
            setLeftPadding(padding)
        }
        if(leftPadding === false && paddingRef.current) {
            const padding = paddingRef.current.getBoundingClientRect().x
            setLeftPadding(padding)
        }
    }, [paddingRef, leftPadding])

    useEffect(() => {
        var resizeFunc = () => {
            if (paddingRef.current) {
                const padding = paddingRef.current.getBoundingClientRect().x
                setLeftPadding(padding)
            }
        }
        window.addEventListener('resize', resizeFunc)
        return () => {
            window.removeEventListener('resize', resizeFunc, [paddingRef])
        }
    })

    console.log(leftPadding)


    return (
        <PageLayout>
            <Head>
                <title>{_.get(pageContent, "title", 'Interpretation Layer')}</title>
                <meta name="description" content={_.get(pageContent, "meta_description", "not-found")} />
            </Head>
            <Container
                maxW="container.lg"
                paddingTop="10rem"
                >
                <Heading
                    fontWeight="thin"
                    marginBottom="2rem"
                    ref={paddingRef}
                    >
                    Interpretation Layer
                </Heading>
                <Box maxW="container.sm" paddingBottom="4rem">
                    <MarkdownWrapper markdownText={pageContentText} />
                </Box>
            </Container>
                <Box>
                    {INTERPRETATION_LAYER_CHART_NOTES === true && (
                        <AccessCardsGrid
                            leftPadding={leftPadding}
                            />
                    )}
                </Box>
            <Container maxW="container.lg">
                <Box maxW="container.sm" paddingBottom="4rem">
                    {pageFAQ.length > 0 && (
                        <Box marginTop="2rem">
                            <Divider />
                            <MarkdownWrapper markdownText="### Frequently Asked Questions" />
                        </Box>
                    )}
                    {pageFAQ.map((faq, i) => {
                        return (
                            <AccordionExplainer
                                key={i}
                                title={faq.question}
                                textMd={faq.answer}
                                textAlign="left"
                                />
                        )
                    })}
                </Box>
            </Container>
        </PageLayout>
    )
}

export default InterpretationLayerPage