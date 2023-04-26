import React, { useContext, useEffect, useState, useMemo } from "react"
import {
    Heading,
    Box,
    Text,
    Button,
    Input,
    InputGroup,
    InputRightAddon,
    Image,
    SimpleGrid
} from "@chakra-ui/react"
import {
    Container, Divider
} from "@chakra-ui/layout"
import { WalletContext } from "components/Wallet"
import { ACCOUNT_ACTIVE } from "components/Wallet/states"
import NoAccountConnectedInformation from "./NoAccountConnectedInformation"
import ChartNotesList from "components/ChartNotesList"
import _ from "lodash"
import { Link } from "@chakra-ui/next-js"

const AccountInformation = ({ account }) => {
    const [accountChartNotes, setAccountChartNotes] = useState(false)

    const walletContext = useContext(WalletContext)
    
    const address = _.get(walletContext, "address", 'no-address')

    const displayName = _.get(walletContext, "displayName", address)

    const hasBetaAccess = _.get(walletContext, "hasBetaAccess", false)

    const signInState = _.get(walletContext, "signInState", false)

    var connectionState = useMemo(() => {
        return _.get(walletContext, "connectionState", false)
    }, [walletContext])

    var accessToken = useMemo(() => {
        if(connectionState === "ACCOUNT_ACTIVE") {
            return _.get(walletContext, "userAccessToken.accessToken", false)
        }
        return false
    }, [connectionState, walletContext])

    useEffect(() => {
        if(walletContext.connectionState === ACCOUNT_ACTIVE && accountChartNotes === false) {
            const fetchAccountChartNotes = async () => {
                var headers = {}
                if(accessToken) {
                    headers["authorization"] = `Bearer ${accessToken}`
                }
                const response = await fetch(`/api/account_chart_notes?address=${address}`, {
                    method: "GET",
                    headers: headers
                })
                const data = await response.json()
                console.log(data)
                setAccountChartNotes(data)
            }
            fetchAccountChartNotes()
        }
    }, [accessToken, walletContext, accountChartNotes, address])


    const betaAccessContract = _.get(walletContext, "decodedJwt.decodedIdToken.beta_access.contractAddress", false)
    var betaAccessToken = _.get(walletContext, "decodedJwt.decodedIdToken.beta_access.tokens[0]", false)
    var betaAccessToken = _.toNumber(betaAccessToken)
    var accessTokens = _.get(walletContext, "decodedJwt.decodedIdToken.beta_access.tokens", [])

    console.log("accountChartNotes", accountChartNotes)

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
                        You have access to the <Link href="/interpretation-layer">Interpretation Layer</Link> based on your ownership of the following {accessTokens.length > 1 ? "cards" : "card"}:
                    </Text>
                    <SimpleGrid minChildWidth={`200px`} >
                        {accessTokens.map(accessToken => {
                            var imgPreviewSrc = `https://assets.objkt.media/file/assets-003/${betaAccessContract}/${accessToken}/thumb288`
                            var paddedTokenNr = accessToken.toString().padStart(4, '0')
                            var cdnPreview = `https://the-stack-report.ams3.cdn.digitaloceanspaces.com/access_cards_2023/thumbnail_1k_card_${paddedTokenNr}.png`
                            var objktTokenUrl = `https://objkt.com/asset/KT1LaCf37XyoR4eNCzMnw6Ccp5bfPFQrKYxe/${accessToken.toString()}`
                            return (
                                <Box key={accessToken} borderRadius="0.25rem" marginTop="1rem" marginBottom="1rem" marginRight="1rem">
                                    <Link
                                        href={objktTokenUrl}
                                        >
                                    <Image
                                        borderRadius="0.25rem"
                                        src={cdnPreview}
                                        maxWidth="200px"
                                        width="100%"
                                        alt="Beta access token"
                                        />
                                    </Link>
                                </Box>
                            )
                        })}
                        
                    </SimpleGrid>
                    <Divider paddingTop="2rem" />
                    <Text paddingTop="2rem">
                        Your chart notes:
                    </Text>
                    {_.isArray(accountChartNotes) && accountChartNotes.length > 0 ? (
                        <ChartNotesList notes={accountChartNotes} />
                    ) : (
                        <Text>
                            You do not have any chart notes yet.
                        </Text>
                    )}
                    </>
                ) : (
                    <Text>
                        You do not have beta access.
                        
                        Check the page on the <Link href="/interpretation-layer">interpretation layer</Link> to learn how to get beta access.
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