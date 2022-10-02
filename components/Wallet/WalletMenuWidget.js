import React, { useContext, useState } from "react"
import {
    WalletContext
} from "components/Wallet"
import {
    Box,
    Button,
    Text
} from "@chakra-ui/react"
import _ from "lodash"
import {
    ACCOUNT_ACTIVE
} from "components/Wallet/states"
import {
    InfoOutlineIcon,
    ArrowForwardIcon,
    LinkIcon,
    CheckIcon,
    RepeatIcon
} from "@chakra-ui/icons"
import styles from "./wallet-menu-widget.module.scss"
import WrappedLink from "components/WrappedLink"
import { WALLET_CONNECTION } from "constants/feature_flags"

const WalletMenuWidget = () => {
    const walletContext = useContext(WalletContext)
    const [accountNameDisplayMode, setAccountNameDisplayMode] = useState("account-name")

    // console.log("wallet context in wallet menu widget:")
    // console.log(walletContext)

    var accountName = _.get(walletContext, "displayName", '-')

    var containerBoxProps = {
        paddingTop: "0.25rem",
        display: "flex",
        width: "100%",
        alignItems: "end",
        textAlign: "right"
    }
    
    if(WALLET_CONNECTION === false) {
        return (
            <></>
        )
    }

    var displayName = accountName
    if(accountNameDisplayMode === "address") {
        displayName = walletContext.address
    }

    return (
        <Box
            
            position="absolute"
            top="0px"
            right="3px"
            left="3px"
            className={styles["wallet-menu-widget"]}
            
            >
            
            {walletContext.connectionState === ACCOUNT_ACTIVE ? (
                <>
                <Box {...containerBoxProps}>
                <WrappedLink href="/connected-account"
                    display="inline-block"
                    marginLeft="auto"
                    borderRadius="0.25rem"
                    _hover={{
                        background: "black",
                        color: "white",
                        borderRadius: "0.25rem"
                    }}
                    >
                <Text
                    fontSize="0.8rem"
                    padding="0.25rem"
                    paddingLeft="0.8rem"
                    paddingRight="0.8rem"
                    background="white"
                    width="fluid"
                    border="0px solid transparent"
                    borderRadius="0.25rem"
                    textAlign="right"
                    _hover={{
                        background: "black",
                        color: "white",
                        borderRadius: "0.25rem"
                    }}
                    >
                    {displayName}
                </Text>
                </WrappedLink>
                <Text
                    fontSize="0.8rem"
                    padding="0.25rem"
                    paddingLeft="1rem"
                    paddingRight="0.8rem"
                    background="white"
                    width="30px"
                    border="0px solid transparent"
                    borderRadius="2rem"
                    textAlign="right"
                    userSelect="none"
                    onPointerDown={() => {
                        if(accountNameDisplayMode === "address") {
                            setAccountNameDisplayMode("alias")
                        } else {
                            setAccountNameDisplayMode("address")
                        }
                    }}
                    cursor="pointer"
                    marginLeft="0.25rem"
                    _hover={{
                        background: "black",
                        color: "white",
                        borderRadius: "2rem"
                    }}
                    >
                <RepeatIcon
                    marginTop="-0.2rem"
                    marginLeft="-7px"
                    
                    />

                </Text>
                </Box>
                <Box {...containerBoxProps}>
                <Button
                    size="small"
                    onPointerDown={() => {
                        walletContext.actions.disconnect();
                    }}
                    fontSize="0.8rem"
                    width="fluid"
                    marginLeft="auto"
                    padding="0.25rem"
                    paddingLeft="1rem"
                    paddingRight="0.7rem"
                    borderRadius="0.25rem"
                    backgroundColor="white"
                    opacity={0.3}
                    _hover={{
                        color: "white",
                        background: "black",
                        opacity: 1
                    }}
                    >
                    
                    {"Disconnect"}
                    <LinkIcon marginLeft="0.6rem" />
                </Button>
                </Box>
                </>
            ) : (
                <>
                <Box {...containerBoxProps} >
                    <Box width="fluid" marginLeft="auto">
                    <WrappedLink href="/interpretation-layer"
                        display="inline-block"
                        textDecoration="none"
                        _hover={{
                            background: "transparent",
                            color: "white",
                            textDecoration: "underline",
                            borderRadius: "0.25rem"
                        }}
                        borderRadius="0.25rem"
                        >
                        <Text
                            color="white"
                            fontSize="0.8rem"
                            position="relative"
                            top="-0px"
                            left="-5px"
                            background="rgba(0,0,0,0.5)"
                            padding="0.14rem"
                            paddingLeft="1rem"
                            paddingRight="1rem"
                            borderRadius="0.25rem"
                            overflow="hidden"
                            userSelect="none"
                            >
                            {"Interpretation layer "}
                            <ArrowForwardIcon
                                position="relative"
                                top="-1px"
                                className={styles["connect-label-icon"]}
                                />
                        </Text>
                        </WrappedLink>

                    </Box>
                    <Button
                        size="small"
                        onPointerDown={() => {
                            walletContext.actions.requestPermissions()
                        }}
                        padding="0.25rem"
                        paddingLeft="1rem"
                        paddingRight="0.8rem"
                        fontSize="0.8rem"
                        backgroundColor="white"
                        width="fluid"
                        border="0px solid transparent"
                        borderRadius="0.25rem"
                        >
                        Connect wallet{" "}
                        <LinkIcon
                            marginLeft="0.6rem"
                            />
                    </Button>
                </Box>
                <Box {...containerBoxProps}>
                    {(walletContext.disconnectSuccessful) && (
                        <Text
                            background="rgb(10,205,10)"
                            width="fluid"
                            color="white"
                            fontSize="0.8rem"
                            fontWeight="bold"
                            marginLeft="auto"
                            paddingLeft="0.25rem"
                            className={styles["disconnect-success-message"]}
                            >
                            Successfully disconnected.
                            <CheckIcon marginLeft="0.25rem" marginRight="0.4rem" marginTop="-2px" />
                        </Text>
                    )}
                </Box>
                </>
            )}
        </Box>
    )
}

export default WalletMenuWidget