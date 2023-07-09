import React from "react"
import Head from "next/head"
import PageLayout from "components/PageLayout"
import {
    Heading,
    Text,
    Box,
    Divider,
    Container
} from "@chakra-ui/react"
import S_Dataset from "models/server/S_Dataset"
import _ from "lodash"
import DataTable from "components/DataTable"

const TezosEntrypointsIndexPage = ({
    entrypoints=['test1', 'test2']
}) => {
    console.log(entrypoints)
    return (
        <PageLayout>
            <Head>
                <title>Tezos entrypoints</title>
                <meta name="description" content="Tezos blockchain smart contract entrypoints." />
            </Head>
            <Container maxW="container.xl" paddingTop="8rem" id="page-top">
                <Heading>
                    Tezos entrypoints
                </Heading>
                <Divider />
                <Box
                    maxWidth="40rem"
                    >
                    <Text marginBottom="1rem">
                        Tezos smart contract entrypoints.
                    </Text>
                    <DataTable
                        data={entrypoints}
                        columns={["Entrypoint", "calls"]}
                        colLinks={{
                            "Entrypoint": (row) => {
                                return `/dashboards/tezos/entrypoints/${row.Entrypoint}`
                            }
                        }}
                        />
                </Box>
            </Container>
        </PageLayout>
    )
}

export async function getServerSideProps(context) {
    var dataset = new S_Dataset()
    await dataset.from_identifier("the-stack-report--tezos-entrypoints-index")
    var file = await dataset.load_file()
    return {
        props: {
            entrypoints: file
        }
    }
}

export default TezosEntrypointsIndexPage