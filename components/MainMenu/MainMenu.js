import React from "react"
import styles from "styles/MainMenu.module.scss"
import SocialsLinkBar from "components/socials/SocialsLinkBar"
import Ticker from "components/Ticker"
import Link from 'next/link'


const MainMenu = () => {
    return (
        <div className={styles["main-menu"]}>
            <h1><Link href="/">The Stack Report</Link>
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