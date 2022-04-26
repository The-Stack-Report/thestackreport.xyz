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


const LandingPage = ({ landing, latestArticles, topContracts4x1 }) => {
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
                        articles={latestArticles.filter(article => article.id !== featured.id).slice(0, 5)}
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
                            <DataBlock block={block} autoPlayOnLoad={true} />
                            </Box>
                        )
                    })}
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

export async function getServerSideProps(context) {

    var returnProps = {
        landing: {},
        latestArticles: [],
        recentWeekly: [],
        recentMonthly: [],
        topContracts4x1: []
        
    }
    console.log("Landing page serverside props.")
    try {
        const resp = await fetch(CMS_URL + landingPageContent)
        const data = await resp.json()

        returnProps.landing = data.data

        const articles_resp = await fetch(CMS_URL + recentArticlesApi)
        var recentArticles = await articles_resp.json()
        returnProps.latestArticles = _.get(recentArticles, "data", [])

        const { db } = await connectToDatabase()

        var cursor = await db.collection("data_blocks")
            .find(
                {
                    tags: {$in: ["top-contracts-4x1"]}
                }
            )
            .sort({endDate: -1})
            .limit(5)
        
        var topContracts4x1 = await cursor.toArray()
        await cursor.close()
        topContracts4x1 = JSON.parse(JSON.stringify(topContracts4x1))

        topContracts4x1.sort((a, b) => a.attributes.position - b.attributes.position)


        returnProps.topContracts4x1 = topContracts4x1

        
    } catch (err) {
        console.log("error in landing page server side props: ", err)
    }
    
    return {
        props: returnProps
    }
}

export default LandingPage