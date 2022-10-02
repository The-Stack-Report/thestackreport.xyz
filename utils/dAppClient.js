import { DAppClient } from "@airgap/beacon-sdk"

var dAppClient = false

export function getDAppClient() {
    
    if(dAppClient) {
        return dAppClient
    }

    if (typeof window !== "undefined") {
        dAppClient = new DAppClient({ name: "The Stack Report"})
        return dAppClient
    }

    return false
}