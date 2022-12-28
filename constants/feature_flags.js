// Boolean toggles to quickly toggle on/off specific website features.


const NEXT_PUBLIC_ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT

console.log("NEXT_PUBLIC_ENVIRONMENT: ", NEXT_PUBLIC_ENVIRONMENT)
console.log("NEXT_PUBLIC_ENVIRONMENT === 'development': ", NEXT_PUBLIC_ENVIRONMENT === "development")

export const WALLET_CONNECTION = NEXT_PUBLIC_ENVIRONMENT === "development" ? true : false
console.log("WALLET_CONNECTION: ", WALLET_CONNECTION)

export const INTERPRETATION_LAYER = NEXT_PUBLIC_ENVIRONMENT === "development" ? true : true

export const INTERPRETATION_LAYER_CHART_NOTES = NEXT_PUBLIC_ENVIRONMENT === "development" ? true : false