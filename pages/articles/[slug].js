import Head from "next/head"
import PageLayout from 'components/PageLayout'
import _ from "lodash"
import { CMS_URL } from 'constants/cms'
import { Container } from '@chakra-ui/layout'
import {
    Text,
    Box
} from "@chakra-ui/react"
import Article from 'components/Article'
import WrappedLink from "components/WrappedLink"
import Image from "next/image"
import { basicImgLoader } from "utils/basicImgLoader"
import {
    placeholderImg
} from "constants/cms"


const ArticlePage = ({ article, error, errorMessage="Error" }) => {
    const attrs = _.get(article, "attributes", {})
    var authors = _.get(attrs, "authors.data", [])
    if(!_.isArray(authors)) {
        authors = []
    }
    var googleNewsJson = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "headline": _.get(attrs, "Title", "no-title"),
        "image": [
            attrs.banner_image_url
        ],
        "datePublished": _.get(attrs, "publishedAt", ""),
        "dateModified": _.get(attrs, "publishedAt", ""),
        "author": authors.map(author => {
            return {
                "@type": "Person",
                "name": _.get(author, "attributes.first_name", ""),
                "url": `https://www.twitter.com/${_.get(author, "attributes.twitter", "thestackreport")}`
            }
        })
    }

    var bannerImgSrc = _.get(article, "attributes.banner_image_url", placeholderImg)
    
    if (!_.isString(bannerImgSrc)) {
        bannerImgSrc = placeholderImg
    }
    return (
        <PageLayout>
            <Head>
                <title>{_.get(attrs, "Title", "Not-found")}</title>
                <meta name="description" content={_.get(attrs, "meta_description", "not-found")} />
                <script type="application/ld+json"
                    dangerouslySetInnerHTML={{__html: JSON.stringify(googleNewsJson)}}
                    />
                
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@thestackreport" />
                <meta name="twitter:title" content={_.get(attrs, "Title", "Not-found")} />
                <meta name="twitter:creator" content="@thestackreport" />
                <meta name="twitter:description" content={_.get(attrs, "meta_description", "not-found")} />
                <meta name="twitter:image" content={bannerImgSrc} />

                <meta name="og:title" content={_.get(attrs, "Title", "Not-found")} />
                <meta name="og:image" content={bannerImgSrc} />
                <meta name="og:description" content={_.get(attrs, "meta_description", "not-found")} />
            </Head>
            <Box overflow="hidden">
                {error ? (
                    <Container
                        maxW="container.md" style={{paddingTop: 200, paddingBottom: 100}}
                        borderLeft="1px solid rgb(200,200,200)"
                        minH="100vh"
                        >
                        <Text
                            as="h1"
                            fontSize="2rem"
                            fontWeight="thin"
                            marginBottom="2rem"
                            >
                            {errorMessage}
                        </Text>
                        <WrappedLink href="/articles">
                            To latest articles
                        </WrappedLink>
                    </Container>
                ) : (
                    <>
                    <Box height="4rem"></Box>
                    <div style={{
                        position: "absolute",
                        width: "100%",
                        height: "20rem",
                        overflow: "hidden",
                        zIndex: 1,
                        borderBottom: "1px solid rgb(200,200,200)"
                        }}>
                        <Image
                            loader={basicImgLoader}
                            src={bannerImgSrc}
                            alt={_.get(attrs, "Title", "")}
                            layout="fill"
                            objectFit="cover"
                            unoptimized={true}
                            />
                    </div>
                    <Container
                        position="relative"
                        zIndex={2}
                        
                        maxW="container.xl"
                        >
                        <Box
                            height="20rem"
                            borderLeft="1px solid rgb(200,200,200)"
                            borderRight="1px solid rgb(200,200,200)"
                            marginLeft="-1px"
                            marginRight="-1px"
                            >
                            
                        </Box>
                    </Container>
                    <Container maxW="container.xl">
                        <Box
                            borderLeft={{
                                base: 0,
                                md: "1px solid rgb(200,200,200)"
                            }}
                            marginLeft="-1px"
                            padding={{
                                base: 0,
                                sm: 0,
                                md: "1rem"
                            }}
                            paddingTop="4rem"
                            paddingBottom="4rem"
                            >
                            <WrappedLink href="/articles"
                                fontSize="0.7rem"
                                >
                                To latest articles
                            </WrappedLink>
                            <Article
                                article={attrs}
                                />
                            <Box minHeight="4rem" />
                        </Box>
                    </Container>
                    </>
                )}
            </Box>
        </PageLayout>
    )
}

export async function getServerSideProps(context) {
    const pid = _.get(context, "query.slug", false)
    try {
        if(pid) {
            const CMS_query = CMS_URL + `/articles?filters[slug][$eq]=${pid}&populate=*`
            const resp = await fetch(CMS_query)
            if(resp.status === 200) {
                const respData = await resp.json()
                const data = respData.data
                var article = _.first(data)
                var previewMode = _.get(article, "attributes.preview", false)
                console.log("preview mode: ", previewMode)
                if(process.env.ENVIRONMENT === "development") {
                    return {
                        props: {
                            article: JSON.parse(JSON.stringify(article)),
                            error: false
                        }
                    }
                } else {
                    if(data.length > 0) {
                        if(previewMode) {
                            return { props: {errorMessage: "Article not found.", error: true} }
                        } else {
                            return {
                                props: {
                                    article: JSON.parse(JSON.stringify(article)),
                                    error: false
                                }
                            }
                        }
                        
                    } else {
                        return { props: {errorMessage: "Article not found.", error: true} }
                    }
                }
                
            } else {
                return { props: {errorMessage: "Article not found.", error: true} }
            }
        } else {
            return { props: {errorMessage: "Undefined article.", error: true} }
        }
    } catch(err) {
        console.log("server side article fetch error: ", err)
        return { props: {errorMessage: "Db error.", err: true} }
    }
    
}

export default ArticlePage