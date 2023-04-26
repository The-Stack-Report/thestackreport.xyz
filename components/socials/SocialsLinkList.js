import React from "react"
import InstagramIcon from "./icons/InstagramIcon"
import LinkedInIcon from "./icons/LinkedInIcon"
import TezosIcon from "./icons/TezosIcon"
import TwitterIcon from "./icons/TwitterIcon"
import MastodonIcon from "./icons/MastodonIcon"
import { Box } from "@chakra-ui/react"
import { Link } from "@chakra-ui/next-js"
import styles from "./SocialsLinkList.module.scss"

const SocialsLinkList = () => {
    return (
        <div className={styles["socials-link-list"]}>
            <Box display="flex">
                <TezosIcon />
                <Link href="https://app.tezos.domains/domain/thestackreport.tez" >
                    thestackreport.tez
                </Link>
            </Box>
            <br />
            <Box display="flex">
                <MastodonIcon />
                <Link href="https://mastodon.social/@thestackreport" >
                    Mastodon
                </Link>
            </Box>
            <br />

            <Box display="flex">
                <TwitterIcon />
                <Link href="https://twitter.com/thestackreport" >
                    Twitter
                </Link>
            </Box>
            <br />

            <Box display="flex">
                <InstagramIcon />
                <Link href="https://www.instagram.com/stackreport/" >
                    Instagram
                </Link>
            </Box>
            <br />

            <Box display="flex">
                <LinkedInIcon />
                <Link href="https://www.linkedin.com/company/the-stack-report/" >
                    Linkedin
                </Link>
            </Box>
        </div>
    )
}

export default SocialsLinkList