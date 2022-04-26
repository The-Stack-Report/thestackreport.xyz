import React, { useState, useEffect } from "react"
import Head from "next/head"
import {
    Container
} from "@chakra-ui/layout"
import {
    Heading,
    Text,
    Spinner,
    Center,
    Box
} from "@chakra-ui/react"
import { connectToDatabase } from "utils/mongo_db"
import PageLayout from "components/PageLayout"
import TezosContractDashboard from "components/TezosContractDashboard"
import WrappedLink from "components/WrappedLink"
import _ from "lodash"
import prepareContractDailyStats from "utils/data/contracts/prepareContractDailyStats"

const ContractPage = ({
    error,
    contract_meta,
    dailyStats = false
}) => {
    var address = _.get(contract_meta, "address", 'no-address')
    var alias = _.get(contract_meta, "tzkt_account_data.alias", address)
    console.log("rendering contract dashboard page for: ", alias)
    return (
        <PageLayout>
            <Head>
                <title>Dashboard - {alias}</title>
                <meta name="description" content="Dashboard page." />
            </Head>
            <Container maxW="container.xl" paddingTop="8rem">
                {error ? (
                    <React.Fragment>
                        <Text>{errorMessage}</Text>
                        <WrappedLink
                            href="/dashboards/contracts" 
                            fontSize="0.7rem"
                            >
                            Back to contract dashboards overview.
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
                        <WrappedLink href="/dashboards/tezos" fontSize="0.7rem">
                            To Tezos dashboards overview
                        </WrappedLink>
                        </Box>
                        <Heading
                            marginTop={{
                                base: "2rem",
                                md: "4rem"
                            }}
                            marginBottom="2rem"
                            fontWeight="thin"
                            >
                                {alias}
                            </Heading>
                            {(contract_meta && dailyStats) ? (
                                <TezosContractDashboard
                                    contract={contract_meta}
                                    dailyStats={dailyStats}
                                    />
                            ) : (
                                <Center
                                    paddingTop="8rem"
                                    >
                                <Spinner />
                                </Center>
                            )}
                    </React.Fragment>
                )}
            </Container>
        </PageLayout>
    )
}

export async function getServerSideProps(context) {
    const address = _.get(context, "query.contract", false)
    console.log(`getting server side data for ${address} dashboard page.`)
    var returnData = { props: {errorMessage: "Error.", error: true} }
    if(address) {
        try {
            console.log("connecting to db")
            const { db } = await connectToDatabase()
            var contract_meta = await db.collection("contracts_metadata")
                .findOne({"address": address})
            contract_meta = JSON.parse(JSON.stringify(contract_meta))

            console.log("got contract meta from mongodb")
            console.log("getting digitalocean stats")

            const resp = await fetch(`https://the-stack-report.ams3.digitaloceanspaces.com/datasets/tezos/contracts_daily_stats/${address}-daily-stats.json`)
            const full_daily_data = await resp.json()
            var dailyStats = JSON.parse(JSON.stringify(prepareContractDailyStats(full_daily_data)))
            console.log("got and processed daily stats from digitalocean")

            
            returnData =  {
                props: {
                    contract_meta: contract_meta,
                    dailyStats: dailyStats
                }
            }
            


        } catch(err) {
            console.error(err)
            returnData = { props: {errorMessage: "Request error.", error: true} }
        }
        console.log("try catch complete")
        return returnData
    } else {
        return { props: {errorMessage: "Missing contract address.", error: true} }
    }
}

export default ContractPage