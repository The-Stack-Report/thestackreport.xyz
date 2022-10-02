import React, { useContext } from "react"
import { WalletContext } from "components/Wallet"
import WrappedLink from "components/WrappedLink"
import {
    Heading,
    Text,
    Button,
    Box
} from "@chakra-ui/react"
import {
    LinkIcon
} from "@chakra-ui/icons"


const NoAccountConnectedInformation = () => {
    const walletContext = useContext(WalletContext)

    return (
        <>
        <Heading fontWeight="thin" marginBottom="2rem">
                Account page
        </Heading>
        <Text>A number of extra features on <WrappedLink inline={true} href="/">thestackreport.xyz</WrappedLink> are enabled when you connect your account.</Text>
        <Text marginTop="2rem">See the <WrappedLink inline={true} href="interpretation-layer">Interpretation Layer</WrappedLink> page for more information about account-enabled features.</Text>
        <Box paddingTop="2rem">
        <Button
            onPointerDown={() => {
                walletContext.actions.requestPermissions()
            }}
            width="fluid"
            >
            Connect wallet
            <LinkIcon marginLeft="0.6rem" />
        </Button>
        </Box>
        </>
        
    )
}

export default NoAccountConnectedInformation