import React from "react"
import Head from "next/head"
import {
    Container
} from "@chakra-ui/layout"
import {
    Heading,
    Text,
    Input,
    InputGroup,
    InputRightElement,
    Button,
    Box,
    Grid,
    GridItem,
    Divider
} from "@chakra-ui/react"
import { connectToDatabase } from "utils/mongo_db"
import _ from "lodash"
import PageLayout from "components/PageLayout"
import { Link } from "@chakra-ui/next-js"
import MarkdownWrapper from "components/MarkdownWrapper"
import Dataset from "models/Dataset"
import DataSheet from "components/DataSheet"

const DatasetPage = ({ dataset, error = false, errorMessage = false }) => {
    const spaces_url = _.get(dataset, "url", false)
    const title = _.get(dataset, "title", "")
    var _dataset = new Dataset(dataset)
    const description = _.get(dataset, "description", "Dataset without description.")

    var datasetAsList = _dataset.to_list()
    return (
        <PageLayout>
            <Head>
                <title>{title} - Dataset</title>
                <meta
                    name="description"
                    content={description} />

            </Head>
            <Container maxW="container.xl" style={{paddingTop: 100}}>
                {error ? (
                    <React.Fragment>
                        <Text>{errorMessage}</Text>
                        <Link
                            href="/datasets"
                            >
                            <Text fontSize="0.7rem" textDecoration="underline">
                            Back to datasets overview
                            </Text>
                        </Link>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Box
                            position="absolute"
                            paddingTop={{
                                base: "0rem",
                                md: "1rem"
                            }}
                            >
                            <Link
                                href="/datasets"
                                fontSize="0.7rem"
                                marginTop="1rem"
                                >
                                To datasets overview
                            </Link>
                        </Box>
                        <Heading
                            as="h1"
                            fontWeight="thin"
                            marginTop={{
                                base: "2rem",
                                md: "4rem"
                            }}
                            marginBottom="2rem"
                            >
                            Dataset: <Text as="span" fontWeight="bold">{_.get(dataset, "title")}</Text>
                        </Heading>
                        <Box>
                            <Box display="flex">
                            <InputGroup size="md">
                                <Input
                                    fontSize="small"
                                    value={spaces_url}
                                    readOnly={true}
                                    />
                                <InputRightElement width="6rem">
                                    <Button
                                        h="2rem"
                                        marginTop="0.35rem"
                                        size="sm"
                                        marginRight="0.2rem"
                                        borderRadius="0.2rem"
                                        _hover={{
                                            bg: "black",
                                            color: "white"
                                        }}
                                        onPointerDown={() => {
                                            navigator.clipboard.writeText(spaces_url).then(function() {
                                                /* clipboard successfully set */
                                                console.log(`Copied ${spaces_url} to clipboard.`)
                                            }, function() {
                                            /* clipboard write failed */
                                            });
                                        }}

                                        >
                                        Copy url
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                            <Button as="a" href={spaces_url} download
                                width="300px"
                                marginLeft="1rem"
                                >
                                Download
                            </Button>
                            </Box>
                            
                        </Box>
                        {datasetAsList.length > 0 && (
                            <Box paddingTop="2rem" paddingBottom="6rem" maxW="container.md">
                                <Text marginBottom="1.5rem">
                                    About this dataset:
                                </Text>
                                {datasetAsList.map(prop => {
                                    return (
                                        <Box key={prop.key}>
                                            <Text
                                                fontSize="0.7rem"
                                                fontWeight="bold"
                                                >
                                                {prop.key}
                                            </Text>
                                            <Text marginBottom="1rem">
                                                {prop.value}
                                            </Text>
                                        </Box>
                                    )
                                })}
                            </Box>
                        )}
                        
                    </React.Fragment>
                )}
                
            </Container>
        </PageLayout>
    )
}

var datasetsCache = {}

export async function getServerSideProps(context) {
    const identifier = _.get(context, "query.dataset", false)
    if(identifier) {
        if(_.has(datasetsCache, identifier)) {
            return {
                props: {
                    block: datasetsCache[identifier],
                    error: false
                }
            }
        } else {
            const { db } = await connectToDatabase()
            var dataset = await db.collection('datasets')
                .findOne({"identifier": identifier})
            if(!_.has(dataset, '_id')) {
                return { props: { errorMessage: "Incorrect dataset identifier.", error: true }}
            } else {
                dataset = JSON.parse(JSON.stringify(dataset))

                return { props: {
                    dataset: dataset,
                    error: false
                }}
            }
        }
    } else {
        return { props: {errorMessage: "Missing dataset identifier.", error: true} }
    }
}


export default DatasetPage