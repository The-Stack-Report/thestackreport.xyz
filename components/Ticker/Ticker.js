import React from "react"
import styles from "styles/Ticker.module.scss"

const Ticker = () => {
    console.log(styles)
    return (
        <div className={styles["ticker-wrap"]}>
            <div className={styles["ticker"]}>
                <div className={"ticker__item"}>
                    The Stack Report - Launching early 2022.
                </div>
                <div className={"ticker__item"}>
                    The Stack Report - Launching early 2022.
                </div>
                <div className={"ticker__item"}>
                    The Stack Report - Launching early 2022.
                </div>
                <div className={"ticker__item"}>
                    The Stack Report - Launching early 2022.
                </div>
            </div>
        </div>
    )
}

export default Ticker