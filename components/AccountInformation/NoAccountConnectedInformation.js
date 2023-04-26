import React, { useContext } from "react"
import { WalletContext } from "components/Wallet"
import {
    Heading,
    Text,
    Button,
    Box
} from "@chakra-ui/react"
import {
    LinkIcon
} from "@chakra-ui/icons"
import { Link } from "@chakra-ui/next-js"


const NoAccountConnectedInformation = () => {
    const walletContext = useContext(WalletContext)

    return (
        <>
        <Heading fontWeight="thin" marginBottom="2rem">
                Account page
        </Heading>
        <Text>A number of extra features on <Link href="/">thestackreport.xyz</Link> are enabled when you connect your account.</Text>
        <Text marginTop="2rem">See the <Link href="interpretation-layer">Interpretation Layer</Link> page for more information about account-enabled features.</Text>
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