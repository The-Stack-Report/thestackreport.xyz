import React from "react"
import {
    Box,
    useBreakpointValue
} from "@chakra-ui/react"
import {
    ArrowDownIcon
} from "@chakra-ui/icons"

const PieArrowBottom = () => {
    const arrowType = useBreakpointValue({ base: "direct", md: "partial", lg: "corner"})
    if (arrowType === "direct") {
        return (
            <Box
                textAlign="center"
                >
                <ArrowDownIcon />
            </Box>
        )
    }
    if(arrowType === "partial") {
        return (
            <Box
                textAlign="center"
                >
                <ArrowDownIcon />
            </Box>
        )
    }
    return (
        <Box></Box>
    )
}

export default PieArrowBottom