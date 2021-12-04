import React from "react"
import styles from "styles/MainMenu.module.scss"
import SocialsLinkBar from "components/socials/SocialsLinkBar"
import Ticker from "components/Ticker"
const MainMenu = () => {
    return (
        <div className={styles["main-menu"]}>
            <h1><a href="/">The Stack Report</a>
                <span>Data-driven reporting from within the Tezos ecosystem.</span>
            </h1>
            <div className={styles["links-section"]}>
                <SocialsLinkBar />
            </div>
            <div className={styles["ticker-container"]}>
                <Ticker />
            </div>
        </div>
    )
}

export default MainMenu