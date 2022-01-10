import Head from "next/head"
import MainMenu from "components/MainMenu"

import { Container } from "@chakra-ui/layout"
import {
    Text,
    Heading,
    Grid,
    GridItem,
    Image,
    SimpleGrid,
    Box
} from "@chakra-ui/react"
import _ from "lodash"
import Footer from "components/Footer"
import Link from "next/link"
import { CMS_URL } from 'constants/cms'

const ArticlesPage = ({ articles }) => {
    console.log(articles)
    return (
        <div>
            <Head>
                <title>The Stack Report - News</title>
                <meta name="description" content="Articles page" />
            </Head>
            <MainMenu />
            <Container maxW="container.sm" style={{paddingTop: 100}}>
                <Heading as="h1" fontWeight="thin">
                    News
                </Heading>
                {articles.data.map((_article, i) => {
                    var article = _article.attributes
                    var direction = i % 2 === 0
                    var elements = []
                    elements.push( (
                        <Heading as="h2">
                                {article.Title}
                        </Heading>
                    ) )

                    elements.push( (
                        <Image src={_.get(article, "banner_image_url", "")} alt={_.get(article, "title", "not-found")} />
                    ) )

                    if(direction) {
                        elements = elements.reverse()
                    }
                    return (
                        <Box marginBottom="4rem"
                            key={_article.id}
                            >
                        <Link passHref={true} href={`/articles/article?id=${_article.id}`}>
                            <SimpleGrid columns={{sm: 1, md: 2}}>
                                
                                {elements.map((elem, elem_i) => {
                                    return (
                                        <GridItem key={elem_i}>
                                            {elem}
                                        </GridItem>
                                    )
                                })}
                            </SimpleGrid>
                            
                        </Link>
                        </Box>
                    )
                })}
            </Container>
            <Footer />
        </div>
    )
}

var articlesCache = false

export async function getServerSideProps(context) {
    if(articlesCache) {

    } else {
        const resp = await fetch(CMS_URL + "/articles")
        const data = await resp.json()
        return {
            props: {
                articles: data
            }
        }
    }
}

export default ArticlesPage