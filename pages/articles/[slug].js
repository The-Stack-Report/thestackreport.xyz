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

const ArticlePage = ({ article, error, errorMessage="Error" }) => {
    const attrs = _.get(article, "attributes", {})
    return (
        <PageLayout>
            <Head>
                <title>{_.get(attrs, "Title", "Not-found")}</title>
                <meta name="description" content={_.get(attrs, "description", "not-found")} />
            </Head>
            
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
                            Back to overview.
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
                            src={attrs.banner_image_url}
                            alt={attrs.Title}
                            layout="fill"
                            objectFit="cover"
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
                                    Back to article list
                                </WrappedLink>
                            <Article
                                article={attrs}
                                />
                        </Box>
                    </Container>
                    </>
                )}
            
        </PageLayout>
    )
}

export async function getServerSideProps(context) {
    const pid = _.get(context, "query.slug", false)
    if(pid) {
        const CMS_query = CMS_URL + `/articles?filters[slug][$eq]=${pid}&populate=*`
        const resp = await fetch(CMS_query)
        console.log(resp)
        if(resp.status === 200) {
            const respData = await resp.json()
            const data = respData.data
            if(data.length > 0) {
                return {
                    props: {
                        article: JSON.parse(JSON.stringify(_.first(data))),
                        error: false
                    }
                }
            } else {
                return { props: {errorMessage: "Article not found.", error: true} }
            }
        } else {
            return { props: {errorMessage: "Article not found.", error: true} }
        }
    } else {
        return { props: {errorMessage: "Undefined article.", error: true} }
    }
}

export default ArticlePage