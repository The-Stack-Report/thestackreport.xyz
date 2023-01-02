// Boolean toggles to quickly toggle on/off specific website features.


const NEXT_PUBLIC_ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT

export const WALLET_CONNECTION = NEXT_PUBLIC_ENVIRONMENT === "development" ? true : false

export const INTERPRETATION_LAYER = NEXT_PUBLIC_ENVIRONMENT === "development" ? true : true

export const INTERPRETATION_LAYER_CHART_NOTES = NEXT_PUBLIC_ENVIRONMENT === "development" ? true : false

if(NEXT_PUBLIC_ENVIRONMENT === "development") {
    console.log("Running in development mode")
    console.log("NEXT_PUBLIC_ENVIRONMENT: ", NEXT_PUBLIC_ENVIRONMENT)
    console.log("NEXT_PUBLIC_ENVIRONMENT === 'development': ", NEXT_PUBLIC_ENVIRONMENT === "development")
    console.log("WALLET_CONNECTION: ", WALLET_CONNECTION)
}