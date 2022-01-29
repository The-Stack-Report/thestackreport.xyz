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



const ArticlesPage = ({ articles, categories }) => {
    console.log(articles)
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
                    gap="4rem"
                    >
                    <GridItem
                        colSpan={2}
                        >
                        <Heading
                            as="h1"
                            fontWeight="thin"
                            marginTop="4rem"
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
                        <Box height="4rem" />
                    </GridItem>
                        <GridItem>
                        <Heading
                            as="h2"
                            fontWeight="thin"
                            marginTop="4rem"
                            marginBottom="2rem"
                            >
                            Categories
                        </Heading>
                        {categories && (
                            <CategoriesTags categories={categories} />
                        )}
                        <Box height="4rem"/>
                    </GridItem>
                </SimpleGrid>
                
            </Container>
        </PageLayout>
    )
}

var articlesCache = false

export async function getServerSideProps(context) {
    if(articlesCache) {

    } else {
        const articlesResp = await fetch(CMS_URL + "/articles?sort=Published:desc&populate=%2A")
        const articles = await articlesResp.json()

        const categoriesResp = await fetch(CMS_URL + "/categories")
        const categories = await categoriesResp.json()

        return {
            props: {
                articles: _.get(articles, "data", []),
                categories: _.get(categories, "data", [])
            }
        }
    }
}

export default ArticlesPage