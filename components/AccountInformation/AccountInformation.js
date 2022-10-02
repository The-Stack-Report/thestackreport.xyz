import React, { useContext } from "react"
import {
    Heading,
    Box,
    Text
} from "@chakra-ui/react"
import { WalletContext } from "components/Wallet"
import { ACCOUNT_ACTIVE } from "components/Wallet/states"
import WrappedLink from "components/WrappedLink"
import NoAccountConnectedInformation from "./NoAccountConnectedInformation"

const AccountInformation = ({ account }) => {
    const walletContext = useContext(WalletContext)
    return (
        <>
        {walletContext.connectionState === ACCOUNT_ACTIVE ? (
            <Heading
                fontWeight='thin'
                >
                Your connected account
            </Heading>
        ) : (
            <NoAccountConnectedInformation />
        )}
            
        </>
    )
}

export default AccountInformation