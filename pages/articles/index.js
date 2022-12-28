import Head from "next/head"
import { Container } from "@chakra-ui/layout"
import {
    Heading,
    GridItem,
    SimpleGrid,
    Box,
    Text
} from "@chakra-ui/react"
import ArticleList from "components/ArticleList"
import _ from "lodash"
import { CMS_URL } from 'constants/cms'
import CategoriesTags from "components/CategoriesTags"
import PageLayout from 'components/PageLayout'
import WrappedLink from "components/WrappedLink"



const ArticlesPage = ({ articles, categories }) => {
    return (
        <PageLayout>
            <Head>
                <title>The Stack Report - News</title>
                <meta name="description" content="Recent articles on The Stack Report" />
            </Head>
            <Container maxW="container.xl" style={{paddingTop: 100}}>
                <SimpleGrid
                    minChildWidth="300px"
                    columns={[4]}
                    gap={{
                        base: "1rem",
                        md: "4rem"
                    }}
                    >
                    <GridItem
                        colSpan={2}
                        >
                        <Heading
                            as="h1"
                            fontWeight="thin"
                            marginTop={{
                                base: "2rem",
                                md: "4rem"
                            }}
                            marginBottom="2rem"
                            >
                            Latest articles
                        </Heading>
                        {articles.length > 0 ? (
                            <ArticleList articles={articles} />
                        ) : (
                            <Text>
                                No current articles.
                            </Text>
                        )}
                        <Box height={{
                                base: "2rem",
                                md: "4rem"
                            }} />
                    </GridItem>
                        <GridItem>
                        <Heading
                            as="h2"
                            fontWeight="thin"
                            marginTop={{
                                base: "2rem",
                                md: "4rem"
                            }}
                            marginBottom="2rem"
                            >
                            Categories
                        </Heading>
                        {categories && (
                            <CategoriesTags categories={categories} />
                        )}
                        <Box fontSize="0.8rem" marginTop="2rem">
                        <WrappedLink href="/categories">
                            To categories overview
                        </WrappedLink>
                        </Box>
                        <Box height="4rem"/>
                    </GridItem>
                </SimpleGrid>
                
            </Container>
        </PageLayout>
    )
}

var articlesCache = false

export async function getServerSideProps(context) {
    try {
        if(articlesCache) {

        } else {
            const articlesResp = await fetch(CMS_URL + "/articles?pagination[pageSize]=1000&sort=Published:desc&populate=%2A")
            var articles = await articlesResp.json()
    
            
            articles = _.get(articles, "data", [])
            articles = articles.filter(article => {
                var previewMode = _.get(article, "attributes.preview", false)
                var envIsDevelopment = process.env.ENVIRONMENT === "development"
                if(envIsDevelopment) {
                    return true
                } else {
                    return !previewMode
                }
            })

            const categoriesResp = await fetch(CMS_URL + "/categories")
            const categories = await categoriesResp.json()

            
            return {
                props: {
                    articles: articles,
                    categories: _.get(categories, "data", [])
                }
            }
        }
    } catch(err) {
        console.error("server side error fetching article page content: ", err)
        return {
            props: {articles: [], categories: []}
        }
    }
    
}

export default ArticlesPage