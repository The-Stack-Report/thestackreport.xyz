import React, { useContext, useState, useEffect } from "react"
import {
    WalletContext
} from "components/Wallet"
import {
    Box,
    Button,
    Text,
    Tooltip
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
import {
    connectedAccountLinkProps,
    displayNameTextProps,
    displayModeIconProps,
    getSignatureButtonProps,
    disconnectButtonProps,
    signInErrorMessageProps,
    interpretationLayerLinkProps,
    interpretationLayerTextProps,
    connectWalletButtonProps
} from "./elementProps"
import StyledLink from "components/Links/StyledLink"

const WalletMenuWidget = () => {
    const walletContext = useContext(WalletContext)
    const [accountNameDisplayMode, setAccountNameDisplayMode] = useState("account-name")
    const [isFrontEnd, setIsFrontEnd] = useState(false)

    useEffect(() => {
        if (typeof window !== "undefined" && isFrontEnd === false) {
            setIsFrontEnd(true)
        }
    }, [isFrontEnd])

    // console.log("wallet context in wallet menu widget:")
    // console.log(walletContext)

    var accountName = _.get(walletContext, "displayName", '-')

    var containerBoxProps = {
        justifyContent: "end",
        display: "flex",
        width: "100%"
    }
    

    var displayName = accountName
    if(accountNameDisplayMode === "address") {
        displayName = walletContext.address
    }
    var isSafari = false
    if (typeof window !== "undefined") {
        isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }
    if(isFrontEnd === false) {
        return null
    }
    if(WALLET_CONNECTION === false) {
        return null
    }


    return (
        <Box className={styles["wallet-menu-widget"]} >
            {walletContext.connectionState === ACCOUNT_ACTIVE ? (
                <>
                <Box {...containerBoxProps}>
                <WrappedLink
                    href="/connected-account"
                    {...connectedAccountLinkProps}
                    renderAsText={false}
                    >
                    <Text {...displayNameTextProps}>
                    {displayName}
                    </Text>
                </WrappedLink>
                <Text {...displayModeIconProps}
                    onPointerDown={() => {
                        if(accountNameDisplayMode === "address") {
                            setAccountNameDisplayMode("alias")
                        } else {
                            setAccountNameDisplayMode("address")
                        }
                    }} >
                    <RepeatIcon marginTop="-0.2rem" marginLeft="-7px" />
                </Text>
                </Box>
                {walletContext.signInState === "init" && (
                    <Box {...containerBoxProps} paddingTop="0.5rem">
                        <Tooltip
                            label="Sends sign in message to your wallet."
                            placement="bottom-end"
                            >
                            <Button {...getSignatureButtonProps}
                                onPointerDown={() => {
                                    walletContext.actions.requestPermissions()
                                    // walletContext.setSignInState("ready-for-signature-request")
                                }}
                                >
                                Get signature
                            </Button>
                        </Tooltip>
                    </Box>
                )}
                {_.includes(["ready-for-signature-request", "triggered"], walletContext.signInState) && (
                    <Box {...containerBoxProps} paddingTop="0.25rem">
                        <Text
                            color="black"
                            background="rgba(255,255,255,0.8)"
                            padding="0.25rem"
                            fontSize="0.8rem"
                            >
                            Waiting for wallet response
                        </Text>
                    </Box>
                )}
                <Box {...containerBoxProps} paddingTop="0.25rem">
                <Button {...disconnectButtonProps}
                    onPointerDown={() => {
                        walletContext.actions.disconnect();
                    }}
                    >
                    
                    {"Disconnect"}
                    <LinkIcon marginLeft="0.6rem" />
                </Button>
                </Box>
                <Box {...containerBoxProps}>
                {(walletContext.signInState === "sign-in-error") && (
                    <Text {...signInErrorMessageProps} className={styles["sign-in-error-message"]} >
                        Sign in error.
                    </Text>
                )}
                </Box>
                </>
            ) : (
                <>
                <Box {...containerBoxProps} >
                        <Box paddingRight="5px">
                            <StyledLink href="/interpretation-layer" {...interpretationLayerLinkProps} >
                                <Text {...interpretationLayerTextProps} >
                                    {"Interpretation layer "}
                                    <ArrowForwardIcon
                                        position="relative"
                                        top="-1px"
                                        className={styles["connect-label-icon"]}
                                        />
                                </Text>
                            </StyledLink>

                        </Box>
                    <Box>
                    <Tooltip
                        label="Sends permission request & sign in message to your wallet."
                        placement="bottom-end"
                        >
                    <Button {...connectWalletButtonProps(isSafari)}
                        onPointerDown={() => {
                            walletContext.actions.requestPermissions()
                        }}
                        >
                        Connect wallet{" "}
                        <LinkIcon
                            marginLeft="0.6rem"
                            />
                    </Button>
                    </Tooltip>
                    </Box>
                </Box>
                <Box {...containerBoxProps} paddingTop={isSafari ? "0.25rem" : "0rem"}>
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