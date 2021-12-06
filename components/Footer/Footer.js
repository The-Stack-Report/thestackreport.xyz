import React from "react"
import styles from "styles/Footer.module.scss"
import { Container } from "@chakra-ui/layout"

const Footer = () => {
    return (
        <div className={styles["footer"]}>
            <Container maxW="container.xl" >
            <h1>The Stack Report</h1>
            <br />
            <p>Covering stories in the Tezos ecosystem through blockchain data visualisations.</p>
            <p>Coming to you, early 2022</p>
            </Container>
        </div>
    )
}

export default Footer