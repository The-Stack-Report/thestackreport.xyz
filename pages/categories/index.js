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
import dayjs from "dayjs"

const CategoriesPage = ({ categories }) => {
    return (
        <PageLayout>
            <Head>
                <title>The Stack Report - Categories</title>
                <meta name="description" content="Articles by category." />
            </Head>
            <Container maxW="container.xl" paddingTop="8rem">
                <Heading
                    as="h1"
                    fontWeight="thin"
                    marginBottom="2rem"
                    >
                    Articles by category.
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
                        const articles = _.get(attrs, "articles.data", [])
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
                                    {attrs.Category}
                                </Heading>
                                <Box
                                    paddingLeft="1rem"
                                    borderLeft="1px solid rgb(150,150,150)"
                                    minHeight="8rem"
                                    >
                                {articles.length > 0 ? (
                                    <div>
                                    {articles.map(article => {
                                        return (
                                            <Box marginBottom="1rem"
                                                key={article.id}
                                                >
                                                <WrappedLink
                                                    href={`/articles/${_.get(article, "attributes.slug", "no-slug-found")}`}
                                                    >
                                                    {article.attributes.Title}
                                                </WrappedLink>
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
    const categoriesResp = await fetch(CMS_URL + "/categories?populate=*")
    const categories = await categoriesResp.json()
    return {
        props: {
            categories: _.get(categories, "data", [])
        }
    }
}


export default CategoriesPage