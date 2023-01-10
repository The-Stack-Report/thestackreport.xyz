import React, { useContext } from "react"
import {
    Box,
    Text,
    Alert,
    AlertIcon
} from "@chakra-ui/react"
import { ChartContext } from "../../Chart"
import { WalletContext } from "components/Wallet"
import _ from "lodash"
import StyledLink from "components/Links/StyledLink"

const NoteAlertMessages = () => {
    const chartContext = useContext(ChartContext)
    const walletContext = useContext(WalletContext)

    const hasBetaAccess = _.get(walletContext, "hasBetaAccess", false)

    var displayMessage = false

    if(chartContext.newNotes.length > 0) {
        if (hasBetaAccess === false) {
            displayMessage = {
                message: (
                    <>
                    Notes can be stored with access to the
                    <StyledLink href="/interpretation-layer" marginLeft="0.6rem">{"Interpretation Layer"}</StyledLink>
                    </>
                ),
                secondLine: (
                    <Text
                        fontSize="0.7rem"
                        marginTop="0.5rem"
                        >
                        You might need to{" "}
                        <Text
                            as="span"
                            textDecoration="underline"
                            cursor="pointer"
                            _hover={{
                                background: "black",
                                color: "white"
                            }}
                            onPointerDown={() => {
                                walletContext.actions.requestPermissions()
                            }}>
                                {"(re-)connect"}
                            </Text> your wallet.
                    </Text>
                ),
                status: "warning",
            }
        }
    }

    return (
        <Box>
            {_.isObject(displayMessage) && (
                <>
                <Alert status={_.get(displayMessage, "status", "info")}
                    fontSize="0.7rem"
                    paddingTop="0.2rem"
                    paddingBottom="0.2rem"
                    >
                    <AlertIcon />
                    {_.get(displayMessage, "message", "message-not-set")}
                </Alert>
                {_.has(displayMessage, "secondLine") && (
                    <>
                    {_.get(displayMessage, "secondLine", "secondLine-not-set")}
                    </>
                )}
                </>
            )}
        </Box>
    )
}

export default NoteAlertMessages