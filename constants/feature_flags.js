// Boolean toggles to quickly toggle on/off specific website features.


const ENVIRONMENT = process.env.ENVIRONMENT

console.log("Environment: ", ENVIRONMENT)

export const WALLET_CONNECTION = ENVIRONMENT === "production" ? false : true

export const INTERPRETATION_LAYER = ENVIRONMENT === "production" ? false : true

export const INTERPRETATION_LAYER_CHART_NOTES = ENVIRONMENT === "production" ? false : true