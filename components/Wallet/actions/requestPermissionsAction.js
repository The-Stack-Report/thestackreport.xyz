import { getDAppClient } from "utils/dAppClient"
import { logEvent } from "utils/interactionLogging"
import {
    CONNECTION_ERROR,
    PERMISSIONS_GIVEN,
    ACCOUNT_ACTIVE,
} from "../states"


async function _requestPermissions(dAppClient) {
    var permissions = false
    var connectionError = false
    try {
        permissions = await dAppClient.requestPermissions()
    } catch (error) {
        console.log("Got error: ", error)
        connectionError = error
    }
    return {
        permissions: permissions,
        connectionError: connectionError
    }
}



export function createRequestPermissions({
        walletContextSessionId,
        logWalletEvent,

        setActiveAccount,
        setSignInState,
        setPermissions,
        setConnectionState
    }) {
    return function requestPermissions() {

        var dAppClient = getDAppClient()

        logWalletEvent({
            action: "request-permissions-triggered",
            category: "wallet-connection",
            sessionId: walletContextSessionId
        })

        _requestPermissions(dAppClient).then(resp => {
            if(resp.connectionError) {
                setConnectionState(CONNECTION_ERROR)

                logWalletEvent({
                    action: "request-permissions-error",
                    category: "wallet-connection",
                    value: _.toString(resp.connectionError),
                    sessionId: walletContextSessionId
                })

            } else {
                setConnectionState(PERMISSIONS_GIVEN)

                logWalletEvent({
                    action: "request-permissions-success",
                    category: "wallet-connection",
                    sessionId: walletContextSessionId
                })
                

                dAppClient.getActiveAccount().then(activeAccount => {
                    if(_.isObject(activeAccount) && _.has(activeAccount, "address")) {
                        setActiveAccount(activeAccount)
                        setSignInState("ready-for-signature-request")
                        setPermissions(resp.permissions)
                        setConnectionState(ACCOUNT_ACTIVE)

                        logWalletEvent({
                            action: "request-permissions-success-active-account",
                            value: _.get(activeAccount, "address", "no-address-found"),
                            category: "wallet-connection",
                            sessionId: walletContextSessionId
                        })
                    }
                })
            }
        })
    }
}