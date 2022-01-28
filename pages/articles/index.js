import Head from "next/head"

import { Container } from "@chakra-ui/layout"
import {
    Heading,
    GridItem,
    SimpleGrid,
} from "@chakra-ui/react"
import ArticleList from "components/ArticleList"
import _ from "lodash"
import { CMS_URL } from 'constants/cms'
import PageLayout from 'components/PageLayout'


const ArticlesPage = ({ articles }) => {
    console.log(articles)
    return (
        <PageLayout>
            <Head>
                <title>The Stack Report - News</title>
                <meta name="description" content="Articles page" />
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
                        <Heading as="h1" fontWeight="thin">
                            News
                        </Heading>
                        {_.isArray(articles.data) && (
                            <ArticleList articles={articles.data} />
                        )}
                    </GridItem>
                        <GridItem>
                        <Heading as="h2" fontWeight="thin">
                            Categories
                        </Heading>
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
        const resp = await fetch(CMS_URL + "/articles?sort=Published:desc&populate=%2A")
        const data = await resp.json()
        return {
            props: {
                articles: data
            }
        }
    }
}

export default ArticlesPage