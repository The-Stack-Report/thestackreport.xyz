import React from "react"
import styles from "styles/Footer.module.scss"
import { Container } from "@chakra-ui/layout"
import {
    SimpleGrid,
    Box,
    Text
} from "@chakra-ui/react"
import WrappedLink from "components/WrappedLink"
import SocialsLinkList from "components/socials/SocialsLinkList"

const Footer = () => {
    return (
        <div className={styles["footer"]}>
            <Container maxW="container.xl">
            <Box
                paddingTop="4rem"
                paddingBottom="8rem"
                paddingLeft="0.5rem"
                paddingRight="0.5rem"
                borderLeft="1px solid rgb(200,200,200)"
                borderRight="1px solid rgb(200,200,200)"
                >
                <Text as="h1"
                    fontWeight="light"
                    textTransform="uppercase"
                    marginBottom="2rem"
                    >
                    The Stack Report
                </Text>
                <SimpleGrid columns={[1, 1, 2]} spacing={8}>
                    <Box>
                        <Text as="h2"
                            marginBottom="1rem"
                            fontWeight="bold"
                            >
                            Pages
                        </Text>
                        <WrappedLink href="/articles" >
                            Articles
                        </WrappedLink>
                        <WrappedLink href="/data_blocks" >
                            Data visuals
                        </WrappedLink>
                        <WrappedLink href="/about" >
                            About
                        </WrappedLink>
                    </Box>
                    <Box>
                        <Text as="h2"
                            marginBottom="1rem"
                            fontWeight="bold"
                            >
                            About
                        </Text>
                        <Text
                            maxWidth="400px"
                            >
                        The Stack Report covers the most important stories in the Tezos ecosystem through blockchain data visualisations.
                        </Text>
                        <Text as="h2"
                            marginTop="2rem"
                            marginBottom="1rem"
                            fontWeight="bold"
                            >
                            Links
                        </Text>
                        <SocialsLinkList />
                    </Box>
                </SimpleGrid>
            </Box>
            </Container>
        </div>
    )
}

export default Footer