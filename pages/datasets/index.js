import Head from "next/head"
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
    Box
} from "@chakra-ui/react"
import { connectToDatabase } from "utils/mongo_db"
import _ from "lodash"
import Link from 'next/link'
import dayjs from "dayjs"
import PageLayout from "components/PageLayout"

const tableCols = [
    "key",
    "spaces_url",
    "upload_date",
]

const DatasetsCatalogPage = ({ datasets }) => {
    return (
        <PageLayout>
            <Head>
                <title>Datasets</title>
                <meta name="description" content="Datasets catalog used for The Stack Report graphs." />
            </Head>
            <Container maxW="container.xl" style={{paddingTop:100}}>
                <Heading
                    as="h1"
                    fontWeight="thin"
                    marginTop={{
                        base: "2rem",
                        md: "4rem"
                    }}
                    marginBottom="2rem"
                    >
                    Datasets
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
                                href={`/datasets/${dataset.key}`}
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
                                {tableCols.map((col, col_i) => {
                                    var colVal = _.get(dataset, col, "")
                                    colVal = colVal.replace("https://the-stack-report.ams3.cdn.digitaloceanspaces.com", "...")
                                    if(col === "upload_date") {
                                        colVal = dayjs(colVal).format("MMMM D, YYYY h:mm A")
                                    }
                                    return (
                                        <Th
                                            key={col}
                                            style={{
                                                maxWidth: 0,
                                                width: col_i === 0 ? "40%" : "30%",
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
                <Box height={{base: "2rem", md: "4rem"}} />
            </Container>
        </PageLayout>
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
        datasets = JSON.parse(JSON.stringify(datasets))

        return { props: {datasets: datasets} }
    }
}

export default DatasetsCatalogPage