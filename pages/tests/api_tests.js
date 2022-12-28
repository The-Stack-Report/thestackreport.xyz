import { useState } from "react"
import {
    Container,
    Box,
    Button,
    Text
} from "@chakra-ui/react"

const ApiTestsPage = () => {

    return (

        <Container>
            <Button onPointerDown={() => {
                fetch("/api/rate_limit_test").then(resp => {
                    console.log(resp)
                })
            }}>Rate limit</Button>
        </Container>
    )
}

export default ApiTestsPage