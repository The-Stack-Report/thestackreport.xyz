import React from "react"
import styles from "styles/Ticker.module.scss"

const Ticker = () => {
    return (
        <div className={styles["ticker-wrap"]}>
            <div className={styles["ticker"]}>
                <div className={"ticker__item"}>
                    Data-driven reporting from within the Tezos ecosystem.
                </div>
                <div className={"ticker__item"}>
                    The Stack Report - Launching early 2022.
                </div>
                <div className={"ticker__item"}>
                    Data-driven reporting from within the Tezos ecosystem.
                </div>
            </div>
        </div>
    )
}

export default Ticker