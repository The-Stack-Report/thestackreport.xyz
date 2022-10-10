import React from "react"
import styles from "styles/MainMenu.module.scss"
import SocialsLinkBar from "components/socials/SocialsLinkBar"
import Ticker from "components/Ticker"
import Link from 'next/link'
import {
    Text
} from "@chakra-ui/react"
import {
    WalletMenuWidget
} from "components/Wallet"
import { WALLET_CONNECTION } from "constants/feature_flags"


const MainMenu = () => {
    console.log("Main menu wallet connection: ", WALLET_CONNECTION)
    return (
        <div className={styles["main-menu"]}>
            <h1>
                <Text
                    fontWeight="bold"
                    color="black"
                    textDecoration="none"
                    _hover={{
                        background: "black",
                        color: "white"
                    }}
                    as="a" href="/">
                    The Stack Report
                </Text>
            </h1>
            <div className={styles["links-section"]}>
                <SocialsLinkBar />
            </div>
            <div className={styles["ticker-container"]}>
                <Ticker />
            </div>
            <div className={styles["wallet-menu-widget-container"]}>
                {WALLET_CONNECTION && (
                    <WalletMenuWidget />
                )}
            </div>
        </div>
    )
}

export default MainMenu