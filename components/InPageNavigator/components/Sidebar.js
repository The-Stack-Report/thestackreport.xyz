import React from "react"
import {
    Box,
    Grid,
    GridItem,
    Text
} from "@chakra-ui/react"
import AnchorLink from "components/AnchorLink"
import _ from "lodash"


const Sidebar = ({
    sections,
    currentSectionIndex,
    sidebarWidth,
    contentOffset
}) => {
    return (
        <>
        <Box minHeight={contentOffset} />
        <Box
            position="sticky"
            top="10px"
            userSelect="none"
            left={`0px`}
            paddingLeft="0.5rem"
            zIndex={200}
            maxWidth={sidebarWidth - 10}
            fontSize="0.9rem"
            background="white"
            height="0px"
            >
            <AnchorLink href={`#page-top`}>
                <Text
                    color={currentSectionIndex - 1 === -1 ? "black" : "gray.500"}
                    _hover={{
                        color: "white",
                        background: "black"
                    }}
                    >
                    Page content
                </Text>
            </AnchorLink>
            {sections.map((section, section_i) => {
                return (
                    <Box
                        marginTop="1rem"
                        paddingRight="2rem"
                        pointerEvents="initial"
                        key={section_i}
                        position="relative"
                        _hover={{
                            background: "black",
                            color: "white"
                        }}
                        role="group"
                        >
                        <AnchorLink
                            href={`#${_.get(section, "id", "")}`}
                            offset={100}
                            >
                            <Text
                                position="absolute"
                                top="0"
                                left="0"
                                color={currentSectionIndex - 1 === section_i ? "gray.800" : "gray.300"}
                                _groupHover={{
                                    color: "white"
                                }}
                                >
                            {`${section_i + 1}:`}
                            </Text>
                            <Text
                                position="relative"
                                left="20px"
                                color={currentSectionIndex - 1 === section_i ? "black" : "gray.500"}
                                _groupHover={{
                                    color: "white"
                                }}
                                >
                            {_.get(section, "title", '')}
                            </Text>
                        </AnchorLink>
                    </Box>
                )
            })}
        </Box>
        </>
    )
}

export default Sidebar