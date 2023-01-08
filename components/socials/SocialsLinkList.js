import React from "react"
import InstagramIcon from "./icons/InstagramIcon"
import LinkedInIcon from "./icons/LinkedInIcon"
import TezosIcon from "./icons/TezosIcon"
import TwitterIcon from "./icons/TwitterIcon"
import WrappedLink from "components/WrappedLink"
import StyledLink from "components/Links/StyledLink"
import { Text, Box } from "@chakra-ui/react"
import styles from "./SocialsLinkList.module.scss"

const SocialsLinkList = () => {
    return (
        <div className={styles["socials-link-list"]}>
            <Box display="flex">
                <TezosIcon />
                <StyledLink href="https://app.tezos.domains/domain/thestackreport.tez" >
                    thestackreport.tez
                </StyledLink>
            </Box>
            <br />

            <Box display="flex">
                <TwitterIcon />
                <StyledLink href="https://twitter.com/thestackreport" >
                    Twitter
                </StyledLink>
            </Box>
            <br />

            <Box display="flex">
                <InstagramIcon />
                <StyledLink href="https://www.instagram.com/stackreport/" >
                    Instagram
                </StyledLink>
            </Box>
            <br />

            <Box display="flex">
                <LinkedInIcon />
                <StyledLink href="https://www.linkedin.com/company/the-stack-report/" >
                    Linkedin
                </StyledLink>
            </Box>
        </div>
    )
}

export default SocialsLinkList