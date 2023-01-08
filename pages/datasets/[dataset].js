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
    SimpleGrid,
    Grid,
    GridItem,
    Divider
} from "@chakra-ui/react"
import { connectToDatabase } from "utils/mongo_db"
import _ from "lodash"
import Link from 'next/link'
import PageLayout from "components/PageLayout"
import WrappedLink from "components/WrappedLink"
import MarkdownWrapper from "components/MarkdownWrapper"

const DatasetPage = ({ dataset, error = false, errorMessage = false }) => {
    const spaces_url = _.get(dataset, "spaces_url", false)
    const columns = _.get(dataset, "columns", false)
    const name = _.get(dataset, "name", false)
    const description_md = _.get(dataset, "description_md", false)

    return (
        <PageLayout>
            <Head>
                <title>Dataset</title>
                <meta name="description" content="Dataset page." />

            </Head>
            <Container maxW="container.xl" style={{paddingTop: 100}}>
                {error ? (
                    <React.Fragment>
                        <Text>{errorMessage}</Text>
                        <WrappedLink
                            href="/datasets"
                            >
                            <Text fontSize="0.7rem" textDecoration="underline">
                            Back to datasets overview
                            </Text>
                        </WrappedLink>
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
                            <WrappedLink
                                href="/datasets"
                                fontSize="0.7rem"
                                marginTop="1rem"
                                >
                                To datasets overview
                            </WrappedLink>
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
                            Dataset: <Text as="span" fontWeight="bold">{_.get(dataset, "key")}</Text>
                        </Heading>
                        <Box>
                            <Text
                                marginBottom="1rem"
                                >
                                Uploaded: {_.get(dataset, "upload_date", false)}
                            </Text>
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
                        <Box maxW="container.sm" marginTop="2rem">
                            {description_md && (
                                <>
                                <Text textTransform="uppercase">
                                    Description
                                </Text>
                                <MarkdownWrapper
                                    markdownText={description_md}
                                    />
                                </>
                            )}
                        </Box>

                        {columns && (
                            <Box marginTop="2rem" marginBottom="4rem">
                                <Divider />
                                <Text textTransform="uppercase">
                                    Columns in dataset
                                </Text>
                                
                                    {columns.map((col, col_i) => {
                                        return (
                                            <Box
                                                paddingBottom="1rem"
                                                border="1px solid rgb(220,220,220)"
                                                marginBottom="-1px"
                                                paddingTop="0.25rem"
                                                paddingLeft="0.5rem"
                                                key={col_i}
                                                >
                                                <Grid
                                                    templateColumns="repeat(3, 1fr)"
                                                    >
                                                    <GridItem
                                                        colSpan={{
                                                            base: 1,
                                                            sm: 2,
                                                            md: 1
                                                        }}
                                                        >
                                                    <Text
                                                        fontWeight="bold"
                                                        marginRight="1rem"
                                                        fontSize="sm"
                                                        >
                                                    {_.get(col, "column", false)}
                                                    </Text>
                                                    </GridItem>
                                                    <GridItem colSpan={2}>
                                                    <Box
                                                        paddingRight="2rem"
                                                        fontSize="sm"
                                                        >
                                                        <MarkdownWrapper
                                                            markdownText={_.get(col, "description_md", "")}
                                                            />
                                                    </Box>
                                                    </GridItem>
                                                </Grid>
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
    const key = _.get(context, "query.dataset", false)
    if(key) {
        if(_.has(datasetsCache, key)) {
            console.log("using blocks cache for: ", key)
            console.log(datasetsCache[key])
            return {
                props: {
                    block: datasetsCache[key],
                    error: false
                }
            }
        } else {
            const { db } = await connectToDatabase()
            var dataset = await db.collection('datasets')
                .findOne({"key": key})
            if(!_.has(dataset, '_id')) {
                return { props: { errorMessage: "Incorrect dataset key.", error: true }}
            } else {
                dataset = JSON.parse(JSON.stringify(dataset))

                // datasetsCache[key] = dataset
                return { props: {
                    dataset: dataset,
                    error: false
                }}
            }
        }
    } else {
        return { props: {errorMessage: "Missing dataset key.", error: true} }
    }
}


export default DatasetPage