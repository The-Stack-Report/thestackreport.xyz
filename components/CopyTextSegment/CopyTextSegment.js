import React, { useEffect, useState } from "react"
import {
    Text
} from "@chakra-ui/react"
import { CopyIcon } from "@chakra-ui/icons"

const CopyTextSegment = ({
    text,
    displayText = false,
    showText = true
}) => {
    const [clicked, setClicked] = useState(false)
    useEffect(() => {
        if (clicked) {
            setTimeout(() => {
                setClicked(false)
            }, 100)
        }
    }, [clicked])
    var background = "transparent"
    var hoverBackground = "black"
    if (clicked) {
        background = "rgba(0,0,0,0.5)"
        hoverBackground = "rgba(0,0,0,0.5)"
    }

    return (
        <Text
            cursor="copy"
            pointerEvents="initial"
            fontStyle={"italic"}
            background={background}
            _hover={{
                background: hoverBackground,
                color: "white"
            }}
            onPointerDown={() => {
                navigator.clipboard.writeText(text)
                setClicked(true)
            }}
            userSelect={"none"}
            >
            {displayText && displayText}
            {showText && text}
            <CopyIcon marginLeft="0.5rem" />
        </Text>
    )
}

export default CopyTextSegment