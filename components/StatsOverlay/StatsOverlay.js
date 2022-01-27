import React from "react"
import styles from "./StatsOverlay.module.scss"
import _ from "lodash"

const StatsOverlay = () => {
    var downlinkSpeed = false
    if(typeof navigator !== "undefined") {
        downlinkSpeed = _.get(navigator, "connection.downlink", false)
    }
    return (
        <div className={styles["stats-overlay"]}>
            {_.isNumber(downlinkSpeed) && (
                <p className={styles["connection-speed"]}>
                {downlinkSpeed} MB/s downlink
                </p>
            )}  
        </div>
    )
}

export default StatsOverlay