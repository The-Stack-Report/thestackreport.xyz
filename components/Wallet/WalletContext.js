import _ from "lodash"
import React, { createContext, useState, useEffect } from "react"
import { getDAppClient } from "utils/dAppClient"
import { logEvent } from "utils/interactionLogging"
import { v4 as uuidv4 } from 'uuid';
import { createRequestPermissions } from "./actions/requestPermissionsAction"
import { createDisconnect } from "./actions/disconnectAction";
import {
    INITIAL,
    PERMISSIONS_GIVEN,
    ESTABLISHING_CONNECTION,
    ACCOUNT_ACTIVE,
    DISCONNECTED,
    CONNECTION_ERROR
} from "./states"
import {
    createMessage,
    createMessagePayload
} from "@stakenow/siwt"

export const WalletContext = createContext()

const logInteractionsToggle = true

function logWalletEvent(event) {
    if(logInteractionsToggle) {
        logEvent(event)
    }
}

// Wallet Context maintains the state of the wallet connection
// and provides methods to interact with the wallet
// States:
// INITIAL: No wallet connected
// PERMISSIONS_GIVEN: User has given permissions to the dApp
// ESTABLISHING_CONNECTION: Wallet is connecting to the dApp
// ACCOUNT_ACTIVE: Wallet is connected to the dApp
// DISCONNECTED: Wallet is disconnected from the dApp
// CONNECTION_ERROR: Error connecting to the wallet
// States are defined in ./states.js
// 
// 

export const WalletContextProvider = ({ children }) => {
    const [connectionState, setConnectionState] = useState(INITIAL)
    const [activeAccount, setActiveAccount] = useState(false)
    const [walletError, setWalletError] = useState(false)
    const [tzktAccountMeta, setTzktAccountMeta] = useState(false)
    const [disconnectSuccessful, setDisconnectSuccessful] = useState(false)
    const [walletContextSessionId, setWalletContextSessionId] = useState(`wallet-session-${uuidv4()}`)
    const [signInState, setSignInState] = useState("init")
    const [permissions, setPermissions] = useState(false)
    const [signedPayload, setSignedPayload] = useState(false)
    const [userAccessToken, setUserAccessToken] = useState(false)

    /**
     * Check if a connection has been established already
     */
    useEffect(() => {
        if(connectionState === INITIAL) {
            var dAppClient = getDAppClient()
            dAppClient.getActiveAccount().then(activeAccount => {
                console.log("initial account: ", activeAccount)
                if(_.isObject(activeAccount) && _.has(activeAccount, "address")) {
                    setActiveAccount(activeAccount)
                    setConnectionState(ACCOUNT_ACTIVE)
                    logWalletEvent({
                        action: "active-account-initialized",
                        category: "wallet-connection",
                        sessionId: walletContextSessionId,
                        value: _.get(activeAccount, "address", "no-address")
                    })
                } else {
                    console.log("No active account: ", activeAccount)
                }
                
            }).catch(err => {
                console.log("error in getting active account: ", err)
            })
        }
    })

    /**
     * Fetch tzkt account data to display account name alias
     */

    useEffect(() => {
        if(activeAccount  && tzktAccountMeta === false) {
            const address = _.get(activeAccount, 'address', false)
            if(address) {
                fetch(`https://api.tzkt.io/v1/accounts/${address}/metadata`).then(resp => {
                    return resp.json()
                }).then(respData => {
                    console.log(respData)
                    setTzktAccountMeta(respData)
                })
            } else {
                setTzktAccountMeta("no-address")
            }
            
        }
    }, [activeAccount, tzktAccountMeta])

    /**
     * Send sign in message when active account
     */
    useEffect(() => {
        if(activeAccount && signInState === "ready-for-signature-request") {
            setSignInState("triggered")
            var address = _.get(activeAccount, "address")
            const messagePayload = createMessagePayload({
                dappUrl: 'thestackreport.xyz',
                pkh: address,
            })
            var dAppClient = getDAppClient()
            console.log("Active account present & sign-in state initial. Sending sign in request payload.", messagePayload)
            dAppClient.requestSignPayload(messagePayload).then(signedPayload => {
                setSignInState("signature-received")
                setSignedPayload(signedPayload)

                var reqBody = {
                    pk: _.get(permissions, "accountInfo.publicKey"),
                    message: messagePayload.payload,
                    pkh: address,
                    signature: signedPayload.signature,
                }

                console.log("initializing fetch")
                fetch("/api/verify_signature", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(reqBody)
                }).then(resp => {
                    return resp.json()
                }).then(respData => {
                    console.log("response from signature validation")
                    console.log(respData)
                    setSignInState("signature-validated")
                    setUserAccessToken(respData)
                        
                }).catch(err => {
                    console.log("error in validating signature")
                    console.log(err)
                    setSignInState("signature-validation-error")
                })

            }).catch(err => {
                console.log("error in signing message")
                console.log(err)
                setSignInState("sign-in-error")

            })
        }
    }, [activeAccount, signInState])

    /**
     * Disconnect timer to temporarily show a disconnect notification
     */
    useEffect(() => {
        if(disconnectSuccessful) {
            var timeout = setTimeout(() => {
                setDisconnectSuccessful(false)
            }, 10000)
            return () => {
                clearTimeout(timeout)
            }
        }

    }, [disconnectSuccessful])


    /**
     * Create action functions 
     */
    const actionGeneratorParams = {
        walletContextSessionId,
        logWalletEvent,
        activeAccount,
        signInState,
        signedPayload,

        setConnectionState,
        setActiveAccount,
        setWalletError,
        setTzktAccountMeta,
        setDisconnectSuccessful,
        setSignInState,
        setPermissions
        
        
    }

    var requestPermissions = createRequestPermissions(actionGeneratorParams)
    var disconnect = createDisconnect(actionGeneratorParams)

    

    var address = _.get(activeAccount, 'address', "-")
    var tzktAlias = _.get(tzktAccountMeta, 'alias', false)

    var displayName = tzktAlias ? tzktAlias : address

    console.log(tzktAccountMeta)

    var contextValue = {
        connectionState: connectionState,
        dAppClient: getDAppClient(),
        address: address,
        displayName: displayName,
        activeAccount: activeAccount,
        disconnectSuccessful: disconnectSuccessful,
        userAccessToken,
        signInState,
        signedPayload,

        setSignInState,
        
        actions: {
            requestPermissions: requestPermissions,
            disconnect: disconnect
        }
    }

    return (
        <WalletContext.Provider value={contextValue}>
            {children}
        </WalletContext.Provider>
    )
}