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
                            Back to overview.
                        </WrappedLink>
                    </Container>
                ) : (
                    <Container
                        paddingTop="8rem"
                        maxW="container.md"
                        >
                            <WrappedLink href="/categories">
                            Back to categories.
                        </WrappedLink>
                            <Heading
                                marginTop="2rem"
                                marginBottom="2rem"
                                >
                                {_.get(attrs, "Category", "-")}
                            </Heading>
                            {articles.length > 0 ? (
                                <ArticleList articles={articles} />
                            ) : (
                                <Text>
                                    No articles for category yet.
                                </Text>
                            )}
                            
                            <Box height="2rem" />
                            <Box style={{textAlign: "right"}}>
                            <WrappedLink
                                href="/articles">
                                To latest articles
                            </WrappedLink>
                            </Box>
                            <Box height="4rem" />
                    </Container>
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