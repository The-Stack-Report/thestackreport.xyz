import Head from "next/head"

import MainMenu from "components/MainMenu"

import { 
    Container
} from "@chakra-ui/layout"
import {
    Heading,
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
} from "@chakra-ui/react"
import { connectToDatabase } from "utils/mongo_db"
import _ from "lodash"
import Footer from "components/Footer"
import Link from 'next/link'


const tableCols = [
    "key",
    "spaces_url",
    "upload_date",
]

const DatasetsCatalogPage = ({ datasets }) => {
    return (
        <div>
            <Head>
                <title>Datasets</title>
                <meta name="description" content="Datasets catalog used for The Stack Report graphs." />
            </Head>
            <MainMenu />
            <Container maxW="container.xl" style={{paddingTop:100}}>
                <Heading as="h1" fontWeight="thin">
                    Datasets - catalog
                </Heading>
                <Table>
                    <Thead>
                        <Tr>
                            {tableCols.map(col => {
                                return (
                                    <Th key={col}>
                                        {col}
                                    </Th>
                                )
                            })}
                        </Tr>
                    </Thead>
                    <Tbody>
                    {datasets.map(dataset => {
                        return (
                            <Link
                                href={`/datasets/dataset?key=${dataset.key}`}
                                key={dataset._id}
                                passHref={true}
                                >
                            <Tr
                                _hover={{
                                    cursor: "pointer",
                                    background: "black",
                                    color: "teal.500"
                                }}
                                >
                                {tableCols.map(col => {
                                    var colVal = _.get(dataset, col, "")
                                    colVal = colVal.replace("https://the-stack-report.ams3.cdn.digitaloceanspaces.com", "...")
                                    return (
                                        <Th
                                            key={col}
                                            style={{
                                                maxWidth: 0,
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap"
                                            }}
                                            >
                                            {colVal}
                                        </Th>
                                    )
                                })}
                                
                            </Tr>
                            </Link>
                        )
                    })}
                    </Tbody>
                </Table>
            </Container>
            <Footer />
        </div>
    )
}

var cache = false

export async function getServerSideProps(context) {
    if(cache) {
        return {props: {datasets: cache}}
    } else {
        const { db } = await connectToDatabase()
        var datasets = await db.collection("datasets")
            .find()
            .toArray()
        datasets = datasets.map(dataset => {
            return {
                ...dataset,
                _id: dataset._id.toString(),
                upload_date: dataset.upload_date.toString()
            }
        })

        return { props: {datasets: datasets} }
    }
}

export default DatasetsCatalogPage