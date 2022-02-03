import React from "react"
import MainMenu from "components/MainMenu"
import Footer from "components/Footer"
import StatsOverlay from "components/StatsOverlay"
import styles from "./PageLayout.module.scss"


const PageLayout = ({ children }) => {
    return (
        <div className={styles["page-layout"]}>
            <MainMenu />
            <main>{children}</main>
            <Footer />
        </div>
    )
}

export default PageLayout