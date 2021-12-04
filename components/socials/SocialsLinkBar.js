import React from "react"
import InstagramIcon from "./icons/InstagramIcon"
import LinkedInIcon from "./icons/LinkedInIcon"
import TezosIcon from "./icons/TezosIcon"
import TwitterIcon from "./icons/TwitterIcon"
import styles from "styles/SocialsLinkBar.module.scss"

const SocialsLinkBar = () => {
    return (
        <div className={styles["socials-link-bar"]}>
            <a href="/instagram">
                <TezosIcon />
            </a>
            <a href="https://twitter.com/thestackreport">
                <TwitterIcon />
            </a>
            <a href="/instagram">
                <InstagramIcon />
            </a>
            <a href="/instagram">
                <LinkedInIcon />
            </a>
        </div>
    )
}

export default SocialsLinkBar