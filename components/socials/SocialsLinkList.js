import React from "react"
import InstagramIcon from "./icons/InstagramIcon"
import LinkedInIcon from "./icons/LinkedInIcon"
import TezosIcon from "./icons/TezosIcon"
import TwitterIcon from "./icons/TwitterIcon"
import WrappedLink from "components/WrappedLink"
import { Text } from "@chakra-ui/react"
import styles from "./SocialsLinkList.module.scss"

const SocialsLinkList = () => {
    return (
        <div className={styles["socials-link-list"]}>
            <WrappedLink
                href="https://app.tezos.domains/domain/thestackreport.tez"
                style={{display: "flex"}}
                    >
                <TezosIcon />
                thestackreport.tez
            </WrappedLink>
            <WrappedLink
                href="https://twitter.com/thestackreport"
                style={{display: "flex"}}
                    >
                <TwitterIcon />
                Twitter
            </WrappedLink>
            <WrappedLink
                href="https://www.instagram.com/stackreport/"
                style={{display: "flex"}}
                    >
                <InstagramIcon />
                Instagram
            </WrappedLink>
            <WrappedLink
                href="https://www.linkedin.com/company/the-stack-report/"
                style={{display: "flex"}}
                    >
                <LinkedInIcon />
                Linkedin
            </WrappedLink>
        </div>
    )
}

export default SocialsLinkList