import React from "react"
import styles from "styles/MainMenu.module.scss"
import SocialsLinkBar from "components/socials/SocialsLinkBar"
import Ticker from "components/Ticker"
import {
    Text,
    Button,
    useColorMode
} from "@chakra-ui/react"
import WalletMenuWidget from "components/Wallet/WalletMenuWidget"
import { WALLET_CONNECTION } from "constants/feature_flags"


const MainMenu = () => {
    const { colorMode, toggleColorMode } = useColorMode();
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
            {false && (
                <div className={styles["menu-items"]}>
                <Button
                    onPointerDown={toggleColorMode}
                    >
                    Color mode
                </Button>
            </div>
            )}
            
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