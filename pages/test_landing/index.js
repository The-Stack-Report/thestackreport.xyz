import Head from "next/head"
import {
    Container,
    SimpleGrid,
    Box,
    Text,
    Link
} from "@chakra-ui/react"
import PageLayout from 'components/PageLayout'
import FeaturedArticleBanner from "components/FeaturedArticleBanner"
import ArticleList from "components/ArticleList"
import DataBlock from "components/DataBlock"
import { CMS_URL } from 'constants/cms'
import _ from "lodash"
import { connectToDatabase } from "utils/mongo_db"


const LandingPage = ({ landing, latestArticles, topContracts4x1 }) => {
    const featured = _.get(landing, "attributes.featured.data", false)
    console.log(topContracts4x1)
    // var filteredArticles = latestArticles.filter(article => {
    //     console.log(article, featured)
    //     return true
    // })
    return (
        <PageLayout>
            <Head>
                <title>The Stack Report</title>
                <meta name="description" content="Data driven reporting and visualisations from within the Tezos ecosystem." />
            </Head>
            <FeaturedArticleBanner
                article={featured}
                />
            <Container maxW="container.xl" marginTop="4rem">
            <SimpleGrid columns={[1, 1, 2]} spacing={8}>
                <Box>
                    <Text
                        fontWeight="bold"
                        textTransform="uppercase"
                        fontSize="0.7rem"
                        >
                        Recent articles
                    </Text>
                    <ArticleList
                        articles={latestArticles.filter(article => article.id !== featured.id).slice(0, 5)}
                        />
                    <Text>{">> "}
                    <Link
                        href="/articles">
                            All articles
                        </Link>
                    </Text>
                    
                </Box>
                <Box>
                    <Text
                        fontWeight="bold"
                        textTransform="uppercase"
                        fontSize="0.7rem"
                        >
                        Top tezos contracts <Text as="span" fontWeight="light">by nr of</Text> contract calls 
                        <Text as="span" fontWeight="light">
                            {" "}past 60 days.
                        </Text>
                    </Text>
                    {topContracts4x1.map(block => {
                        return (
                            <Box
                                maxW="500"
                                marginBottom="2rem"
                                key={block._id}
                                border="0px solid transparent"
                                >
                            <DataBlock block={block} />
                            </Box>
                        )
                    })}
                </Box>
            </SimpleGrid>
            </Container>
        </PageLayout>
    )
}

const landingPageContent = "/landing-page?populate=*"
const recentArticlesApi = "/articles?sort=Published:desc&populate=%2A"
const topContractsBlocks = ""

export async function getServerSideProps(context) {
    const resp = await fetch(CMS_URL + landingPageContent)
    const data = await resp.json()

    const articles_resp = await fetch(CMS_URL + recentArticlesApi)
    var recentArticles = await articles_resp.json()
    recentArticles = _.get(recentArticles, "data", [])

    const { db } = await connectToDatabase()

    var topContracts4x1 = await db.collection("data_blocks")
        .find(
            {
                tags: {$in: ["top-contracts-4x1"]}
            },
            {
                $orderby: {
                    endDate: -1,
                }
            }
        )
        .limit(5)
        .toArray()
    
    topContracts4x1 = JSON.parse(JSON.stringify(topContracts4x1))

    topContracts4x1.sort((a, b) => a.attributes.position - b.attributes.position)

    
    return {
        props: {
            landing: data.data,
            latestArticles: recentArticles,
            recentWeekly: [],
            recentMonthly: [],
            topContracts4x1: topContracts4x1
            
        }
    }
}

export default LandingPage