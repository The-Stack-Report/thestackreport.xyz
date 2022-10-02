import Head from "next/head"
import PageLayout from "components/PageLayout"
import {
    Container
} from "@chakra-ui/layout"
import {
    Box,
    Heading
} from "@chakra-ui/react"
import { WALLET_CONNECTION } from "constants/feature_flags"
import AccountInformation from "components/AccountInformation"


const ConnectedAccountPage = () => {
    return (
        <PageLayout>
            <Head>
                <title>Connected account</title>
                <meta name="description" content="Page with information about your connected account." />
            </Head>
            <Container
                maxW="container.xl"
                paddingTop="9rem"
                >
                {WALLET_CONNECTION ? (
                    <>
                     <AccountInformation />
                    </>
                ) : (
                    <WrappedLink href="/">
                        Go to home
                    </WrappedLink>
                )}
                
                
            </Container>
        </PageLayout>
    )
}

export default ConnectedAccountPage