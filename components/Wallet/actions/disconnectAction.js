import { getDAppClient } from "utils/dAppClient";
import {
    INITIAL
} from "../states"

export function createDisconnect({
    walletContextSessionId,
    logWalletEvent,
    activeAccount,
    
    setConnectionState,
    setActiveAccount,
    setWalletError,
    setTzktAccountMeta,
    setDisconnectSuccessful
}) {
    return function disconnect() {
        var dAppClient = getDAppClient()
        var disconnectAccountAddress = _.get(activeAccount, "address", "no-address")
        
        logWalletEvent({
            action: "disconnect-initiated",
            value: disconnectAccountAddress,
            category: "wallet-connection",
            sessionId: walletContextSessionId
        })
        

        dAppClient.clearActiveAccount().then(() => {
            dAppClient.getActiveAccount().then(activeAccount => {
                console.log("Active account should be gone: ", activeAccount)
                if(activeAccount === undefined) {

                    setConnectionState(INITIAL)
                    setActiveAccount(false)
                    setWalletError(false)
                    setTzktAccountMeta(false)
                    setDisconnectSuccessful(true)

                    logWalletEvent({
                        action: "disconnect-successful",
                        value: disconnectAccountAddress,
                        category: "wallet-connection",
                        sessionId: walletContextSessionId
                    })

                } else {
                    console.log("Error in disconnecting")

                    setWalletError("Wallet connection error")

                    logWalletEvent({
                        action: "disconnect-error",
                        value: disconnectAccountAddress,
                        category: "wallet-connection",
                        sessionId: walletContextSessionId
                    })
                    
                    
                }
            })
        });
    }
}