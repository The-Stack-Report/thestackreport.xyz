import Head from "next/head"
import MainMenu from "components/MainMenu"
import {
    Container
} from "@chakra-ui/layout"
import {
    Heading,
    Text,
    Input,
    InputGroup,
    InputRightElement,
    Button
} from "@chakra-ui/react"
import { connectToDatabase } from "utils/mongo_db"
import _ from "lodash"
import Link from 'next/link'
import React from "react"

const DatasetPage = ({ dataset, error = false, errorMessage = false }) => {
    const spaces_url = _.get(dataset, "spaces_url", false)
    return (
        <div>
            <Head>
                <title>Dataset</title>
                <meta name="description" content="Dataset page." />

            </Head>
            <MainMenu />
            <Container maxW="container.lg" style={{paddingTop: 100}}>
                {error ? (
                    <React.Fragment>
                        <Text>{errorMessage}</Text>
                        <Link href="/datasets/catalog" passHref={true}>
                            <Text as="a">
                                Back to catalog.
                            </Text>
                        </Link>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Heading as="h1" fontWeight="thin">
                            Dataset: <Text as="span" fontWeight="bold">{_.get(dataset, "key")}</Text>
                        </Heading>
                        <Text>Uploaded: {_.get(dataset, "upload_date", false)}</Text>
                        <InputGroup size="md">
                            <Input
                                fontSize="small"
                                value={spaces_url}
                                readOnly={true}
                                />
                            <InputRightElement width="6rem">
                                <Button h="1.75rem" size="sm" marginRight="0.5rem"
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
                    </React.Fragment>
                )}
                
            </Container>
        </div>
    )
}

var datasetsCache = {}

export async function getServerSideProps(context) {
    const key = _.get(context, "query.key", false)
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
                dataset._id = dataset._id.toString()
                dataset.upload_date = dataset.upload_date.toString()

                datasetsCache[key] = dataset
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