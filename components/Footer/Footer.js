import React from "react"
import styles from "styles/Footer.module.scss"
import { Container } from "@chakra-ui/layout"
import {
    SimpleGrid,
    Box,
    Text
} from "@chakra-ui/react"
import StyledLink from "components/Links/StyledLink"
import SocialsLinkList from "components/socials/SocialsLinkList"

const Footer = () => {
    return (
        <div className={styles["footer"]}>
            <Container maxW="container.xl">
            <Box
                paddingTop="3rem"
                paddingBottom="8rem"
                paddingLeft="0.5rem"
                paddingRight="0.5rem"
                borderLeft="1px solid rgb(200,200,200)"
                borderRight="1px solid rgb(200,200,200)"
                marginLeft="-1px"
                marginRight="-1px"
                >
                <Text as="h1"
                    fontWeight="light"
                    textTransform="uppercase"
                    marginBottom="2rem"
                    >
                    The Stack Report
                </Text>
                <SimpleGrid columns={[1, 2, 3]} spacing={8}>
                    <Box>
                        <Text as="h2"
                            marginBottom="1rem"
                            fontWeight="bold"
                            >
                            Pages
                        </Text>
                        <StyledLink href="/articles" >
                            Articles
                        </StyledLink>
                        <br />
                        <StyledLink href="/categories" >
                            Categories
                        </StyledLink>
                        <br />
                        <StyledLink href="/dashboards/tezos" >
                            Dashboards
                        </StyledLink>
                        <br />
                        <StyledLink href="/datasets" >
                            Datasets
                        </StyledLink>
                        <br />
                        <StyledLink href="/about" >
                            About
                        </StyledLink>
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
                        <StyledLink href="/about"
                            fontWeight="bold"
                            >
                            About
                        </StyledLink>
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
            </Box>
            </Container>
        </div>
    )
}

export default Footer