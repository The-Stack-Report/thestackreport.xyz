import React from "react"
import Head from "next/head"
import {
    Container
} from "@chakra-ui/layout"
import {
    Heading,
    Text,
    Spinner,
    Center,
    Badge,
    Box
} from "@chakra-ui/react"
import { connectToDatabase } from "utils/mongo_db"
import PageLayout from "components/PageLayout"
import TezosContractDashboard from "components/TezosContractDashboard"
import WrappedLink from "components/WrappedLink"
import StyledLink from "components/Links/StyledLink"
import _ from "lodash"
import prepareContractDailyStats from "utils/data/contracts/prepareContractDailyStats"
import { getUrl } from "utils/serverCache"
import prepareDf from "utils/data/prepareDf"
import InPageNavigator from "components/InPageNavigator"


var sections = [
    {
        title: "Contract usage",
        id: "contract-usage"
    },
    {
        title: "Transaction flow",
        id: "contract-transaction-flow"
    },
    {
        title: "Baker fees",
        id: "baker-fees"
    },
    {
        title: "Block share",
        id: "block-share"
    },
    
    {
        title: "XTZ statistics",
        id: "contract-xtz-statistics"
    }
]

var sectionsAsDict = {}

sections.forEach(section => {
    sectionsAsDict[section.id] = section
})

const ContractPage = ({
    error,
    errorMessage = "error-message-undefined",
    contract_meta,
    dailyStats = false,
    xtzEntrypointsStats = false
}) => {
    var address = _.get(contract_meta, "address", 'no-address')
    var alias = _.get(contract_meta, "tzkt_account_data.alias", address)

    return (
        <PageLayout>
            <Head>
                <title>{`Dashboard - ${alias}`}</title>
                <meta name="description" content="Dashboard page." />
            </Head>
            <InPageNavigator
                sections={sections}
                contentOffset={"8rem"}
                >
            <Container maxW="container.xl" paddingTop="7rem" id="page-top">
                {error ? (
                    <React.Fragment>
                        <Text>{errorMessage}</Text>
                        <Box height="0.5rem" />
                        <WrappedLink
                            href="/dashboards/tezos" 
                            >
                            <Text 
                                fontSize="0.7rem"
                                paddingTop="0.5rem"
                                textDecoration="underline"
                                >
                                Back to contract dashboards overview.
                            </Text>
                        </WrappedLink>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Box
                            position="absolute"
                            paddingTop={{
                                base: "0.5rem",
                                md: "1rem"
                            }}
                            >
                        <StyledLink href="/dashboards/tezos" fontSize="0.7rem">
                            To Tezos dashboards overview
                        </StyledLink>
                        </Box>
                        
                        <Heading
                            marginTop={{
                                base: "2.5rem",
                                md: "4rem"
                            }}
                            fontWeight="thin"
                            >
                            {alias}
                        </Heading>
                        <Badge
                            color="gray.500"
                            variant="outline"
                            size="small"
                            fontSize="0.7rem"
                            >
                            Tezos contract
                        </Badge>
                            {(contract_meta && dailyStats) ? (
                                <TezosContractDashboard
                                    contract={contract_meta}
                                    dailyStats={dailyStats}
                                    xtzEntrypointsStats={xtzEntrypointsStats}
                                    sectionsAsDict={sectionsAsDict}
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
            </InPageNavigator>
        </PageLayout>
    )
}

function xtzStatsPrepFunc(rawDf) {
    var nrCols = _.keys(_.first(rawDf)).filter(c => c !== "date")
    var preppedData = prepareDf(
        rawDf,
        ["date"],
        nrCols
    )
    preppedData.forEach(p => {
        p['date'] = p['date'].toJSON()
    })

    return preppedData
}

export async function getServerSideProps(context) {
    const address = _.get(context, "query.contract", false)
    var returnData = { props: {errorMessage: "Error.", error: true} }
    if(address) {
        try {
            const { db } = await connectToDatabase()
            var contract_meta = await db.collection("contracts_metadata")
                .findOne({"address": address})
            contract_meta = JSON.parse(JSON.stringify(contract_meta))

            var dailyStats = await getUrl(
                `https://the-stack-report.ams3.digitaloceanspaces.com/datasets/tezos/contracts_daily_stats/${address}-daily-stats.json`,
                120,
                prepareContractDailyStats
            )



            var xtzEntrypointsStats = await getUrl(
                `https://the-stack-report.ams3.digitaloceanspaces.com/datasets/tezos/contracts_daily_stats/${address}-entrypoints-daily-xtz-stats.csv`,
                120,
                xtzStatsPrepFunc
            )
            returnData =  {
                props: {
                    contract_meta: contract_meta,
                    dailyStats: dailyStats,
                    xtzEntrypointsStats: xtzEntrypointsStats
                }
            }
            


        } catch(err) {
            console.error(err)
            returnData = { props: {errorMessage: "Request error.", error: true} }
        }
        return returnData
    } else {
        return { props: {errorMessage: "Missing contract address.", error: true} }
    }
}

export default ContractPage