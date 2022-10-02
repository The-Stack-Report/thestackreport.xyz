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

export const WalletContext = createContext()

const logInteractionsToggle = true

function logWalletEvent(event) {
    if(logInteractionsToggle) {
        logEvent(event)
    }
}

export const WalletContextProvider = ({ children }) => {
    const [connectionState, setConnectionState] = useState(INITIAL)
    const [activeAccount, setActiveAccount] = useState(false)
    const [walletError, setWalletError] = useState(false)
    const [tzktAccountMeta, setTzktAccountMeta] = useState(false)
    const [disconnectSuccessful, setDisconnectSuccessful] = useState(false)
    const [walletContextSessionId, setWalletContextSessionId] = useState(`wallet-session-${uuidv4()}`)

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

        setConnectionState,
        setActiveAccount,
        setWalletError,
        setTzktAccountMeta,
        setDisconnectSuccessful
        
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