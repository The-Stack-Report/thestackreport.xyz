import React, { useContext } from "react"
import {
    Heading,
    Box,
    Text,
    Button,
    Input,
    InputGroup,
    InputRightAddon,
    Image
} from "@chakra-ui/react"
import {
    Container
} from "@chakra-ui/layout"
import { WalletContext } from "components/Wallet"
import { ACCOUNT_ACTIVE } from "components/Wallet/states"
import WrappedLink from "components/WrappedLink"
import NoAccountConnectedInformation from "./NoAccountConnectedInformation"
import _ from "lodash"

const AccountInformation = ({ account }) => {
    const walletContext = useContext(WalletContext)

    console.log(walletContext)

    
    const address = _.get(walletContext, "address", 'no-address')

    const displayName = _.get(walletContext, "displayName", address)

    const hasBetaAccess = _.get(walletContext, "hasBetaAccess", false)

    const signInState = _.get(walletContext, "signInState", false)

    const betaAccessContract = _.get(walletContext, "decodedJwt.decodedIdToken.beta_access.contractAddress", false)
    var betaAccessToken = _.get(walletContext, "decodedJwt.decodedIdToken.beta_access.tokens[0]", false)
    var betaAccessToken = _.toNumber(betaAccessToken)

    console.log(betaAccessContract, betaAccessToken)

    var tokenImgPreview = `https://assets.objkt.media/file/assets-003/${betaAccessContract}/${betaAccessToken}/thumb288`

    tokenImgPreview = "https://the-stack-report.ams3.digitaloceanspaces.com/website_assets/tests/tsr-access-pass-test.png"

    return (
        <Container paddingBottom="8rem">
        <>
        {walletContext.connectionState === ACCOUNT_ACTIVE ? (
            <>
            <Heading
                fontWeight='thin'
                >
                Your connected account
            </Heading>
            <Text
                paddingTop="2rem"
                >
                Welcome <i>{displayName}</i>.
            </Text>
            <Text paddingTop="2rem">
                You are connected to the stack report with the following account:
            </Text>
            <Box maxW="container.sm" paddingTop="2rem">
                <InputGroup
                    size="sm"
                    marginTop="0.5rem"
                    marginBottom="0.5rem"
                    >
                    
                    <Input
                        pr='4.5rem'
                        value={address}
                        onFocus={(e) => e.target.select()}
                        readOnly={true}
                        />
                    <InputRightAddon>Account address</InputRightAddon>
                </InputGroup>
            </Box>
            {signInState === "signature-validated" ? (
                <Box paddingTop="2rem">
                {hasBetaAccess ? (
                    <>
                    <Text>
                        You have access to the <WrappedLink href="/interpretation-layer">Interpretation Layer</WrappedLink> based on your ownership of the following token:
                    </Text>
                    <Box borderRadius="0.25rem" marginTop="1rem" marginBottom="1rem">
                    <WrappedLink
                        href={`https://objkt.com/asset/${betaAccessContract}/${betaAccessToken}`}
                        >
                    <Image
                        borderRadius="0.25rem"
                        src={tokenImgPreview}
                        maxWidth="200px"
                        width="100%"
                        alt="Beta access token"
                        />
                    </WrappedLink>
                    </Box>
                    </>
                ) : (
                    <Text>
                        You do not have beta access.
                        
                        Check the page on the <WrappedLink href="/interpretation-layer">interpretation layer</WrappedLink> to learn how to get beta access.
                    </Text>
                )}
                </Box>
            ) : (
                <>
                <Box paddingTop="2rem">
                <Text>You are not fully signed in yet. A log-in message needs to be signed to verify account ownership.</Text>
                <Button
                    background="white"
                    color="black"
                    width="fluid"
                    fontSize="0.8rem"
                    padding="0.25rem"
                    paddingLeft="0.8rem"
                    paddingRight="0.8rem"
                    border="0px solid transparent"
                    borderRadius="0.25rem"
                    size="sm"
                    marginTop="1rem"
                    onPointerDown={() => {
                        walletContext.actions.requestPermissions()
                        // walletContext.setSignInState("ready-for-signature-request")
                    }}
                    >
                    Get signature
                </Button>
                </Box>
                </>
            )}
            
            </>
        ) : (
            <NoAccountConnectedInformation />
        )}
            
        </>
        </Container>
    )
}

export default AccountInformation