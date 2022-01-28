import Head from "next/head"
import { Container } from "@chakra-ui/layout"
import {
    Heading
} from "@chakra-ui/react"
import PageLayout from 'components/PageLayout'


const CategoryPage = ({ category, articles }) => {
    return (
        <PageLayout>
            <Head>
                <title>The Stack Report - Category</title>
            </Head>
            <Container maxW="container.xl" style={{paddingTop: 100}}>
            <Heading as="h1" fontWeight="thin">
                Category:
            </Heading>
            </Container>
        </PageLayout>
    )
}

export default CategoryPage