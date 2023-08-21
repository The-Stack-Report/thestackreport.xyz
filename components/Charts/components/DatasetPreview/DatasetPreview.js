import React, { useState } from "react"
import {
    Box,
    Text,
} from "@chakra-ui/react"
import {
    ExternalLinkIcon
} from "@chakra-ui/icons"
import { Link } from "@chakra-ui/next-js"

const previewAttributes = [
    {
        key: "title",
    },
    {
        key: "type",
    },
    {
        key: "identifier",
    },
    {
        key: "format"
    }
]

const DatasetPreview = ({
    dataset
}) => {
    const [ displayInfoToggle, setDisplayInfoToggle ] = useState(false)

    var infoBoxDisplayState="none"
    if (displayInfoToggle) {
        infoBoxDisplayState="initial"
    }
    return (
        <Box
            _hover={{
                background: "black",
                color: "white"
            }}
            role="group"
            pointerEvents="initial"
            >
            <Text
                fontSize="0.7rem"
                onPointerDown={() => setDisplayInfoToggle(!displayInfoToggle)}
                userSelect={"none"}
                >
                Dataset
            </Text>
            <Box
                position="absolute"
                top="100%"
                right="0px"
                width="500px"
                display={infoBoxDisplayState}
                background="white"
                _groupHover={{
                    background: "black",
                    color: "white",
                    display: "initial"
                }}
                _hover={{
                    border: "1px solid jet",
                }}
                fontSize="0.7rem"
                role="group"
                >
                {previewAttributes.map((attribute) => {

                    var textContents = (
                        <Text
                            display="inline-block"
                            textDecoration={attribute.key == "identifier" ? "underline" : "none"}
                            >
                            {dataset[attribute.key]}
                        </Text>
                    )

                    if (attribute.key == "identifier") {
                        textContents = (
                            <Link
                                href={`/datasets/${dataset[attribute.key]}`}
                                target="_blank"
                                _groupHover={{
                                    color: "white"
                                }}
                                >
                                {textContents}
                            </Link>
                        )
                    }
                    return (
                        <Box
                            key={attribute.key}
                            opacity={0.5}
                            _hover={{
                                opacity: 1
                            }}
                            position="relative"
                            left="0px"
                            right="0px"
                            cursor="text"
                            >
                            <Text
                                display="inline-block"
                                fontWeight="bold"
                                >
                                {attribute.key}:
                            </Text>
                            {textContents}
                        </Box>
                    )
                })}
                <Text
                    position="absolute"
                    top="100%"
                    color="black"
                    textAlign="right"
                    right="0px"
                    opacity={0}
                    _groupHover={{
                        opacity: 1
                    }}
                    >
                        <Link
                            href={`/datasets/${dataset.identifier}`}
                            target="_blank"
                            >
                    Open in new tab
                    <ExternalLinkIcon paddingLeft="0.2rem" marginTop={"-1px"} />
                    </Link>
                </Text>
            </Box>
            
        </Box>
    )
}

export default DatasetPreview