import React from "react"
import InstagramIcon from "./icons/InstagramIcon"
import LinkedInIcon from "./icons/LinkedInIcon"
import TezosIcon from "./icons/TezosIcon"
import TwitterIcon from "./icons/TwitterIcon"

import styles from "styles/SocialsLinkBar.module.scss"

const SocialsLinkBar = () => {
    return (
        <div className={styles["socials-link-bar"]}>
            <a href="https://app.tezos.domains/domain/thestackreport.tez">
                <TezosIcon />
            </a>
            <a href="https://twitter.com/thestackreport">
                <TwitterIcon />
            </a>
            <a href="https://www.instagram.com/stackreport/">
                <InstagramIcon />
            </a>
            <a href="https://www.aedin.com/company/the-stack-report/">
                <LinkedInIcon />
            </a>
        </div>
    )
}

export default SocialsLinkBar