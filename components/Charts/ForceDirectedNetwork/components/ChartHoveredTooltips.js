import React from "react"
import {
    Box,
    Container,
    Text,
    Button,
    Kbd
} from "@chakra-ui/react"

const ChartHoveredTooltips = ({
    selectedNode,
    chartHovered
}) => {
    var bottomPos = 0

    var opacity = 0

    

    if (selectedNode) {
        bottomPos += 35
        opacity = 0.5
    }

    if (chartHovered) {
        bottomPos += 40
        opacity = 1
        if (selectedNode) {
            opacity = 0.5
        }
    } else {
        opacity = 0
    }

    


    bottomPos = `${bottomPos}px`
    return (
        <Box
            position="absolute"
            bottom={bottomPos}
            opacity={opacity}
            transition={"bottom 0.25s, opacity 0.25s"}
            left="0rem"
            right="0rem"
            zIndex="99"
            >
            <Container maxW="container.xl" position="relative">
                <Box
                    cursor="auto"
                    pointerEvents="none"
                    padding="0.25rem"
                    fontSize="0.8rem"
                    borderRadius="1rem"
                    paddingLeft="1rem"
                    display="flex"
                    >
                    <Text>
                        Hold <Kbd>Shift</Kbd> to zoom.
                    </Text>
                </Box>
            </Container>
        </Box>
    )
}

export default ChartHoveredTooltips