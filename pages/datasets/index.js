import Head from "next/head"
import { 
    Container
} from "@chakra-ui/layout"
import {
    Heading,
    Text,
    Box,
    Divider
} from "@chakra-ui/react"
import { connectToDatabase } from "utils/mongo_db"
import _ from "lodash"
import Link from 'next/link'
import dayjs from "dayjs"
import PageLayout from "components/PageLayout"
import DataTable from "components/DataTable"

const tableCols = [
    "key",
    "spaces_url",
    "upload_date",
]

const DatasetsCatalogPage = ({ datasets }) => {
    // const recentDatasets = datasets.filter(dataset => dataset.date)
    var datasetsWithUploadDt = datasets.map(dataset => {
        return {
            ...dataset,
            upload_dt: dayjs(dataset.upload_date)
        }
    })
    var today = dayjs()
    var todayMin30 = today.subtract(30, "day")

    console.log(datasets)

    var recentDatasets = datasetsWithUploadDt.filter(dataset => dataset.upload_dt.isAfter(todayMin30))

    var olderDatasets = datasetsWithUploadDt.filter(dataset => !dataset.upload_dt.isAfter(todayMin30))

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
                    Dataset catalog
                </Heading>
                <Heading
                    as="h2"
                    marginTop={{
                        base: "2rem",
                        md: "4rem"
                    }}
                    marginBottom="2rem"
                    fontSize="1.5rem"
                    >
                    Recent datasets
                </Heading>
                <Text
                    fontSize="sm"
                    marginBottom="1rem"
                    >
                    Updated or uploaded datasets within the last 30 days.
                </Text>
                <DataTable
                    data={recentDatasets}
                    columns={[ "key", "upload_date" ]}
                    rowLink={(row) => `/datasets/${row.key}`}
                    />
                <Box height={{base: "2rem", md: "4rem"}} />
                <Divider />
                <Heading
                    as="h2"
                    marginTop={{
                        base: "2rem",
                        md: "4rem"
                    }}
                    marginBottom="2rem"
                    fontSize="1.5rem"
                    >
                    Old datasets
                </Heading>
                <DataTable
                    data={olderDatasets}
                    columns={[ "key", "upload_date" ]}
                    rowLink={(row) => `/datasets/${row.key}`}
                    rowProps={{color: "gray.500"}}
                    />
                
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
            .sort({"upload_date": -1})
            .toArray()
        datasets = JSON.parse(JSON.stringify(datasets))
        cache = datasets

        return { props: {datasets: datasets} }
    }
}

export default DatasetsCatalogPage