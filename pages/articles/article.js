import Head from 'next/head'
import MainMenu from 'components/MainMenu'

import { Container } from '@chakra-ui/layout'
import {
    Text
} from "@chakra-ui/react"
import _ from "lodash"
import Footer from "components/Footer"
import { CMS_URL } from 'constants/cms'
import React from 'react'
import Article from 'components/Article'

const ArticlePage = ({ article, error, errorMessage="Error"}) => {
    const data = _.get(article, "data", {})
    const attrs = _.get(data, "attributes", {})
    const content = _.get(attrs, "Content", "")
    return (
        <div>
            <Head>
                <title>{_.get(attrs, "Title", "Not-found")}</title>
                <meta name="description" content={_.get(attrs, "description", "not-found")} />
            </Head>
            <MainMenu />
            <Container maxW="container.sm" style={{paddingTop: 100, paddingBottom: 100}}>
                {error ? (
                    <div>
                        <Text>{errorMessage}</Text>
                        <Text as="a" href="/articles">
                            Back to overview.
                        </Text>
                    </div>
                ) : (
                    <Article
                        article={attrs}
                        />
                )}
            </Container>
            <Footer />
        </div>
    )
}

var articlesCache = {}

export async function getServerSideProps(context) {
    const id = _.get(context, "query.id", false)
    if(id) {
        if(_.has(articlesCache, id)) {

        } else {
            const resp = await fetch(CMS_URL + `/articles/${id}`)
            if (resp.status === 200) {
                const data = await resp.json()
                return {
                    props: {
                        article: data,
                        error: false
                    }
                }
            } else {
                return { props: {errorMessage: "Incorrect id.", error: true} }
            }
        }
    } else {
        return { props: {errorMessage: "Missing id.", error: true} }
    }
}

export default ArticlePage