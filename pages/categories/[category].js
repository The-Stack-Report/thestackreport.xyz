import Head from "next/head"
import PageLayout from 'components/PageLayout'
import _ from "lodash"
import { CMS_URL } from 'constants/cms'
import { Container } from '@chakra-ui/layout'
import {
    Text,
    Heading,
    Box,
    Grid,
    GridItem
} from "@chakra-ui/react"
import WrappedLink from "components/WrappedLink"
import ArticleList from "components/ArticleList"


const CategoryPage = ({category, error, errorMessage}) => {
    const attrs = _.get(category, "attributes", {})
    const articles = _.get(attrs, "articles.data", [])
    return (
        <PageLayout>
            <Head>
                <title>Category: {_.get(attrs, "Category", "Not-found")}</title>
                <meta name="description" content={`Articles for category: ${_.get(attrs, "Category", "not-found")}`} />
            </Head>
            {error ? (
                    <Container
                        maxW="container.md" style={{paddingTop: 200, paddingBottom: 100}}
                        borderLeft="1px solid rgb(200,200,200)"
                        minH="60vh"
                        >
                        <Text
                            as="h1"
                            fontSize="2rem"
                            fontWeight="thin"
                            marginBottom="2rem"
                            >
                            {errorMessage}
                        </Text>
                        <WrappedLink href="/categories">
                            To categories overview
                        </WrappedLink>
                    </Container>
                ) : (
                    <>
                    <Container
                        paddingTop="100px"
                        maxW="container.xl"
                        >
                        <Box
                            position="absolute"
                            paddingTop={{
                                base: "0rem",
                                md: "1rem"
                            }}
                            >
                        <WrappedLink href="/categories" fontSize="0.7rem">
                            To categories overview
                        </WrappedLink>
                        </Box>
                        <Heading
                            marginTop={{
                                base: "2rem",
                                md: "4rem"
                            }}
                            marginBottom="2rem"
                            fontWeight="thin"
                            >
                            {"Category - "}
                            <Text as="span" fontWeight="bold" textTransform="uppercase">
                                {_.get(attrs, "Category", "-")}
                            </Text>
                        </Heading>
                    </Container>
                    <Container maxW="container.md">
                            {articles.length > 0 ? (
                                <ArticleList articles={articles} />
                            ) : (
                                <Text>
                                    No articles for category yet.
                                </Text>
                            )}
                            </Container>
                    <Container maxW="container.xl">
                            <Box height="2rem" />
                            <Box style={{textAlign: "right"}}>
                            <WrappedLink
                                href="/articles" fontSize="0.7rem">
                                To latest articles
                            </WrappedLink>
                            </Box>
                            <Box height="4rem" />
                    </Container>
                    </>
                )}
        </PageLayout>
    )
}

export async function getServerSideProps(context) {
    const categoryName = _.get(context, "query.category", false)
    if(categoryName) {
        const CMS_QUERY = CMS_URL + `/categories?filters[Category][$eq]=${categoryName}&populate[articles][populate]=*`
        const resp = await fetch(CMS_QUERY)
        if(resp.status === 200) {
            var category = await resp.json()
            category = _.get(category, "data[0]", false)
            if(category) {
                return {
                    props: {
                        category: category,
                        error: false
                    }
                }
            } else {
                return { props: {errorMessage: "Category not found.", error: true} }
            }
        } else {
            console.log(resp)
            return { props: {errorMessage: "Undefined category.", error: true} }
        }
    }
}

export default CategoryPage