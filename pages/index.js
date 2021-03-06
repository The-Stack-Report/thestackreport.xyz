import Head from "next/head"
import {
    Container,
    SimpleGrid,
    Box,
    Text,
    Heading
} from "@chakra-ui/react"
import PageLayout from 'components/PageLayout'
import FeaturedArticleBanner from "components/FeaturedArticleBanner"
import ArticleList from "components/ArticleList"
import DataBlock from "components/DataBlock"
import { CMS_URL } from 'constants/cms'
import _ from "lodash"
import { connectToDatabase } from "utils/mongo_db"
import WrappedLink from "components/WrappedLink"
import MarkdownWrapper from "components/MarkdownWrapper"
import TopContractsLandingPageWidget from "components/TopContractsLandingPageWidget"


const LandingPage = ({ landing, latestArticles, topContractsStats }) => {
    const featured = _.get(landing, "attributes.featured.data", false)
    const aboutText = _.get(landing, "attributes.about_tsr", "")
    const googleArticlesCarouselJson = {
        "@context":"https://schema.org",
        "@type":"ItemList",
        "itemListElement": latestArticles.map((article, article_i) => {
            return {
                "@type": "ListItem",
                "position": article_i,
                "url": `https://thestackreport.xyz/articles/${article.attributes.slug}`
            }
        })
    }
    const featuredId = _.get(featured, "id", false)
    var latestArticlesWithoutFeatured = latestArticles.filter(article => article.id !== featuredId).slice(0, 5)

    return (
        <PageLayout>
            
            <Head>
                <title>The Stack Report</title>
                <meta name="description" content="Data driven reporting and visualisations from within the Tezos ecosystem." />
                <script type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(googleArticlesCarouselJson)}}
                    />
            </Head>
            <FeaturedArticleBanner
                article={featured}
                />
            <Container maxW="container.xl" marginTop="4rem">
                New!
                <br />
                <WrappedLink
                    href="/dashboards/tezos"
                    >
                {`Dashboards >>>`}
                </WrappedLink>
            </Container>
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
                        articles={latestArticlesWithoutFeatured}
                        />
                    <Text>{">> "}
                    <WrappedLink
                        href="/articles">
                            All articles
                        </WrappedLink>
                    </Text>
                    
                </Box>
                <Box>
                    <Text
                        fontWeight="bold"
                        textTransform="uppercase"
                        fontSize="0.7rem"
                        >
                        Top tezos contract dashboards <Text as="span" fontWeight="light">by nr of</Text> contract calls 
                        <Text as="span" fontWeight="light">
                            {" "}past 2 weeks.
                        </Text>
                    </Text>
                    <TopContractsLandingPageWidget
                        contracts={topContractsStats}
                        />
                    <Box paddingTop="2rem" paddingBottom="2rem">
                        <WrappedLink href="/dashboards/tezos">
                            Search through all Tezos contract dashboards
                        </WrappedLink>
                    </Box>
                </Box>
            </SimpleGrid>
            </Container>
            <Box
                borderTop="1px solid rgb(200,200,200)"
                marginTop="4rem"
                >
                <Container maxW="container.xl">
                <Box
                    borderLeft="1px solid rgb(200,200,200)"
                    borderRight="1px solid rgb(200,200,200)"
                    marginLeft="-1px"
                    marginRight="-1px"
                    padding="0.5rem"
                    paddingTop="2rem"
                    paddingRight="1rem"
                    >
                    <Box maxW="60rem">
                    <Heading
                        fontWeight="thin"
                        marginBottom="1rem"
                        >
                        About The Stack Report
                    </Heading>
                    <MarkdownWrapper
                        markdownText={aboutText}
                        />
                    <br />
                    <WrappedLink
                        href="/about"
                        >
                        Read more
                    </WrappedLink>
                    <br />
                    </Box>
                </Box>
                </Container>
            </Box>
        </PageLayout>
    )
}

const landingPageContent = "/landing-page?populate=*"
const recentArticlesApi = "/articles?sort=Published:desc&populate=%2A"
const topContractsBlocks = ""

var topContractsStatsCache = []

export async function getServerSideProps(context) {

    var returnProps = {
        landing: {},
        latestArticles: [],
        recentWeekly: [],
        recentMonthly: [],
        topContractsStats: []
        
    }
    try {
        const resp = await fetch(CMS_URL + landingPageContent)
        const data = await resp.json()
        returnProps.landing = data.data

        const articles_resp = await fetch(CMS_URL + recentArticlesApi)
        var recentArticles = await articles_resp.json()
        // Get data from response and filter out articles in preview mode
        returnProps.latestArticles = _.get(recentArticles, "data", []).filter(
            article => {
                var previewMode = _.get(article, "attributes.preview", false)
                var envIsDevelopment = process.env.ENVIRONMENT === "development"
                if(envIsDevelopment) {
                    return true
                } else {
                    return !previewMode
                }
            }
        )

        const { db } = await connectToDatabase()

        var cursor = await db.collection("contracts_metadata")
            .find({
                "sort_positions.by_calls_past_14_days": {$exists: true}
            })
            .sort([
                ["sort_positions.by_calls_past_14_days", 1]
            ])
            .limit(5)
        
        var topContractsMeta = await cursor.toArray()
        await cursor.close()
        var topContractsMetaData = JSON.parse(JSON.stringify(topContractsMeta))

        returnProps.topContractsStats = topContractsMetaData

        
    } catch (err) {
        console.log("error in landing page server side props: ", err)
    }
    return {
        props: returnProps
    }
}

export default LandingPage