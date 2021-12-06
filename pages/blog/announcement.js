import Head from 'next/head'
import MainMenu from 'components/MainMenu'

import { Container, Divider, UnorderedList, ListItem } from '@chakra-ui/layout'
import styles from "styles/Blog.module.scss"
import { Button, Text, Heading } from "@chakra-ui/react"
import Footer from 'components/Footer'

const buttonProps = {
    background: "black",
    color: "white",
    marginBottom: 25,
    width: "100%",
    as:"a",
    _hover: {bg: "rgb(0,0,0,0.8)"}
  }


const PressReleasePage = () => {
    return (
        <div>
            <Head>
                <title>Announcing The Stack Report</title>
                <meta name="description" content="Announcing The Stack Report: A new publication providing data driven reporting and visualisations from within the Tezos ecosystem." />

            </Head>
            <MainMenu />

            <Container className={styles["blog-post"]} >
                <Heading as="h1" fontWeight="thin">
                Announcing The Stack Report, covering stories in the Tezos ecosystem through blockchain data visualisations.
                </Heading>
                <Text>
                Blockchain technology has the potential to become a new decentralised infrastructure layer for people to collaborate, communicate, exchange value and ideas. A new generation of builders from a diverse set of backgrounds is embedding new, challenging ideas into this next tech stack for society. Their stories are developing as we speak — and because this is happening digitally, open source, and “on chain”, we can all observe their stories as they happen.
                </Text>
                <br />
                <Text>
                The Stack Report will transform the data streams coming from this stack of digital, social and physical layers of this new decentralised world into data-driven weekly and monthly reporting and long-form deep dives into specific topics. Our focus will be on the self-amending, energy-efficient Tezos blockchain. The project will leverage existing and custom-developed blockchain data analysis tooling. Bringing together a small team of specialists in data science, visualisation & storytelling to capture the unique stories developing on the Tezos chain.
                </Text>
                <br />
                <Text
                    fontWeight="bold"
                    >
                    Who founded The Stack Report?
                </Text>
                <Text>
                    The Stack Report is initiated by Erwin Hoogerwoord.
                </Text>
                <br />
                <Text>
                “This initiative is an evolution of previous reporting I have been doing on NFT activity, creating weekly visual recaps of the Tezos-based HicEtNunc NFT platform using on-chain operations data. NFTs are one layer in this new decentralised stack of technologies. With The Stack Report I want to bring this kind of data-driven reporting to the rest of the Tezos tech stack, which is just as interesting.”
                </Text>
                <br />
                <Text
                    fontWeight="bold"
                    >
                    Why is this kind of reporting relevant?
                </Text>
                <Text>
                The core proposition of blockchains is that it can enable transactions between people and entities without relying on trust. The “trust-less” model of crypto aims to remove the trust-based relationship people have with their direct institutions and banks. Instead, this is replaced with a combination of cryptographic proof and transparency into the data and systems. Enabling potentially every participant to validate a publicly agreed-upon chain of transactions. This brings the expectation that enough participants in this kind of system will be able to build a deep enough understanding of the multiple layers of this tech stack to eliminate the much simpler trust relationship. The intention of The Stack Report is to provide an on-ramp for people to build that understanding.
                </Text>
                <br />
                <Text
                    fontWeight="bold"
                    >
                    What to expect?
                </Text>
                <Text>
                Early 2022, The Stack Report will start to produce weekly and monthly visual data-driven summaries on multiple facets of the Tezos tech stack. Covering aspects such as on-chain contract calls, network growth and code / protocol evolution. Next to that we will be doing research to create long-form stories delving into specific aspects of blockchain technology and applications.
                </Text>

                <br />
                <Text>
                    These stories will be shared across multiple channels.
                    To not miss out, be sure to follow <i>The Stack Report</i> across any or all of these platforms:
                </Text>
                <br />
                <UnorderedList>
                    <ListItem fontWeight="bold">
                        <a  href="https://twitter.com/thestackreport">
                        @thestackreport (Twitter)
                        </a>
                    </ListItem>
                    <ListItem fontWeight="bold">
                        <a href="https://www.instagram.com/stackreport/">
                        @thestackreport (Instagram)
                        </a>
                    </ListItem>
                    <ListItem fontWeight="bold">
                        <a href="https://www.linkedin.com/company/the-stack-report">
                        @the-stack-report (LinkedIn)
                        </a>
                    </ListItem>
                </UnorderedList>
                <br />
                <Text>
                    An example of previous reporting done on HicEtNunc NFT activity:
                </Text>
                <br />
                <Text fontWeight="bold" as="a" href="https://twitter.com/hoogerwoord/status/1429914919403720709?s=20">
                https://twitter.com/hoogerwoord/status/1429914919403720709?s=20
                </Text>
                <br />
                <br />
                <Text>
                    For more information, or if you wish to get involved, reach out to:
                    <br />
                    erwin @ dialectic.design
                </Text>
                <Divider marginTop={25} marginBottom={25} />
                <Button
                    {...buttonProps}
                    as="a"
                    href="https://dialectic.design/storage/app/media/The%20Stack%20Report/the-stack-report-announcement-press-release-december-6-2021.pdf"
                    download="Announcing The Stack Report - press release"
                    target="_blank"
                    >
                    Download announcement as PDF
                </Button>
                <Divider
                    marginBottom={25}
                    />
                <Text>
                    Watch and share the video teaser:
                </Text>
                <div style={{
                    padding: "75% 0 0 0",
                    position:"relative"
                }}>
                    <iframe
                        src="https://player.vimeo.com/video/653497706?h=3935981d26&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen={true}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%"
                        }}
                        title="The Stack Report - Announcement teaser">
                    </iframe>
                </div>
            </Container>
            <Footer />
        </div>
    )
}

export default PressReleasePage