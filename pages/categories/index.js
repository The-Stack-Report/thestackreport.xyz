import Head from "next/head"
import { Container } from "@chakra-ui/layout"
import {
    SimpleGrid,
    Heading,
    Box,
    Text
} from "@chakra-ui/react"
import PageLayout from "components/PageLayout"
import { CMS_URL } from 'constants/cms'
import _ from "lodash"
import WrappedLink from "components/WrappedLink"
import { Link } from "@chakra-ui/next-js"
import dayjs from "dayjs"
import ArticleCard from "components/ArticleCard"

const CategoriesPage = ({ categories }) => {
    return (
        <PageLayout>
            <Head>
                <title>The Stack Report - Categories</title>
                <meta name="description" content="Articles by category." />
            </Head>
            <Container maxW="container.xl" paddingTop="100px">
                <Heading
                    as="h1"
                    fontWeight="thin"
                    marginTop={{
                        base: "2rem",
                        md: "4rem"
                    }}
                    marginBottom="2rem"
                    >
                    Articles by category
                </Heading>
                <SimpleGrid
                    columns={{
                        base: 1,
                        md: 2,
                        lg: 3
                    }}
                    spacing={10}
                    
                    >
                    {categories.map((category) => {
                        const attrs = category.attributes
                        var articles = _.get(attrs, "articles.data", []).map((article) => {
                            return {
                                ...article,
                                published: _.get(article, "attributes.Published", false)
                            }
                        })

                        articles = _.sortBy(articles, "published").reverse()
                        console.log(articles)

                        var categoryTitle = attrs.Category

                        return (
                            <Box
                                key={category.id}
                                marginBottom="6rem"
                                >
                                <Heading
                                    textTransform="uppercase"
                                    fontSize="1rem"
                                    fontWeight="bold"
                                    marginBottom="0.5rem"
                                    >
                                    {categoryTitle}
                                </Heading>
                                <Box
                                    paddingLeft="1rem"
                                    borderLeft="1px solid rgb(150,150,150)"
                                    minHeight="8rem"
                                    >
                                {articles.length > 0 ? (
                                    <div>
                                    {articles.map(article => {

                                        if (categoryTitle === "Deep dives") {
                                            return (
                                                <Box key={article.id} marginBottom="0rem">
                                                <ArticleCard article={article} height="10rem" marginBottom="-1rem" />
                                                </Box>
                                            )
                                        }

                                        if (categoryTitle === "Announcements") {
                                            return (
                                                <Box key={article.id} marginBottom="0rem">
                                                <ArticleCard article={article} height="12rem" marginBottom="-1rem" />
                                                </Box>
                                            )
                                        }
                                        return (
                                            <Box marginBottom="1rem"
                                                key={article.id}
                                                >
                                                <Link
                                                    href={`/articles/${_.get(article, "attributes.slug", "no-slug-found")}`}
                                                    >
                                                    {article.attributes.Title}
                                                </Link>
                                                <Text
                                                    fontSize="0.7rem"
                                                    >
                                                    {dayjs(_.get(article, "attributes.Published", false)).format("MMMM D, YYYY h:mm A")}
                                                </Text>
                                            </Box>
                                        )
                                    })}
                                    </div>
                                ) : (
                                    <Text
                                        maxW="200px"
                                        
                                        >
                                        No articles (yet) for this category.
                                    </Text>
                                )}
                                </Box>
                            </Box>
                        )
                    })}
                </SimpleGrid>
            </Container>
        </PageLayout>
    )
}

export async function getServerSideProps(context) {
    try {
        const categoriesResp = await fetch(CMS_URL + "/categories?populate=*")
        const categories = await categoriesResp.json()

        var categoriesList = _.get(categories, "data", []).reverse()


        return {
            props: {
                categories: categoriesList
            }
        }
    } catch(err) {
        console.log("serverside error on categories page: ", err)
        return {
            props: { categories: [] }
        }
    }
    
}


export default CategoriesPage