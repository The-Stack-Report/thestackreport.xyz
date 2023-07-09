import React from "react"
import styles from "styles/Footer.module.scss"
import { Container } from "@chakra-ui/layout"
import {
    SimpleGrid,
    Box,
    Text
} from "@chakra-ui/react"
import { Link } from "@chakra-ui/next-js"
import SocialsLinkList from "components/socials/SocialsLinkList"
import PatternDivider from "components/PatternDivider"

const Footer = () => {
    return (
        <div className={styles["footer"]}>
            <Container maxW="container.xl">
            <Box
                paddingTop="3rem"
                paddingBottom="1rem"
                borderLeft="1px solid rgb(200,200,200)"
                borderRight="1px solid rgb(200,200,200)"
                marginLeft="-1px"
                marginRight="-1px"
                >
                <Text as="h1"
                    fontWeight="light"
                    textTransform="uppercase"
                    marginBottom="2rem"
                    marginLeft="0.5rem"
                    >
                    The Stack Report
                </Text>
                <SimpleGrid
                    marginLeft="0.5rem"
                    marginRight="0.5rem"
                    paddingBottom="4rem"
                    columns={[1, 2, 3]}
                    spacing={8}
                    >
                    <Box>
                        <Text as="h2"
                            fontWeight="bold"
                            marginBottom="1rem"
                            >
                            Pages
                        </Text>
                        <Text>
                            <Link href="/articles">
                                Articles
                            </Link>
                        </Text>
                        <br />
                        <Text>
                            <Link href="/categories">
                                Categories
                            </Link>
                        </Text>
                        <br />
                        <Text>
                            <Link href="/dashboards/tezos" >
                                Dashboards
                            </Link>
                        </Text>
                        <br />
                        <Text>
                            <Link href="/datasets" >
                                Datasets
                            </Link>
                        </Text>
                        <br />
                        <Text>
                            <Link href="/about" >
                                About
                            </Link>
                        </Text>
                    </Box>
                    <Box>
                    <Text as="h2"
                            marginBottom="1rem"
                            fontWeight="bold"
                            >
                            Links
                        </Text>
                        <SocialsLinkList />
                    </Box>
                    <Box>
                        <Link href="/about"
                            fontWeight="bold"
                            >
                            About
                        </Link>
                        <Text
                            marginTop="1rem"
                            paddingRight={{
                                base: 0,
                                md: "2rem"
                            }}
                            >
                        The Stack Report covers the most important stories in the Tezos ecosystem through blockchain data visualisations.
                        </Text>
                    </Box>
                </SimpleGrid>
                <PatternDivider marginTop={"0rem"} marginBottom={"5rem"} />
                <Box
                    paddingLeft="0.5rem"
                    textAlign={"center"}
                    >
                    <Text
                        fontWeight="bold"
                        marginBottom="1rem"
                        >
                        Credits & dependencies
                    </Text>
                    <Text>
                        The Stack Report <i>Tezos</i> integrations built with:{" "}<br />
                        <Link href="https://siwt.xyz/">
                            {"Sign-In With Tezos (SIWT)"}
                        </Link>{", "}
                        <Link href="https://github.com/airgap-it/beacon-sdk">
                            {"Beacon SDK"}
                        </Link>{", "}
                        <Link href="https://github.com/baking-bad/tzkt">
                            {"TzKT"}
                        </Link>{", "}
                        <Link href="https://gitlab.com/tezos-kiln/kiln">
                            {"Kiln"}
                        </Link>{", "}
                        <Link href="https://gitlab.com/tezos/tezos">
                            {"Octez"}
                        </Link>
                    </Text>
                </Box>
                <PatternDivider marginTop={"5rem"} marginBottom={"0rem"} />
                <Box
                    paddingTop="6rem"
                    paddingLeft="0.5rem"
                    fontSize="0.8rem"
                    opacity="0.5"
                    textAlign="center"
                    >
                    <Text>The Stack Report is a
                        <Link
                            href="https://dialectic.design/"
                            marginLeft="0.5rem"
                            marginRight="0.5rem"
                            fontFamily="Freehand"
                            fontSize="1rem"
                            textDecoration={'none'}
                            >
                        Dialectic Design
                        </Link>
                        production.
                    </Text>
                </Box>
            </Box>
            </Container>
        </div>
    )
}

export default Footer