import Head from "next/head"
import PageLayout from "components/PageLayout"
import {
    Container
} from "@chakra-ui/layout"
import { WALLET_CONNECTION } from "constants/feature_flags"
import AccountInformation from "components/AccountInformation"
import WrappedLink from "components/WrappedLink"


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