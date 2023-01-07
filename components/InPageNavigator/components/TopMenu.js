import React, { useState, useRef, useEffect, useMemo } from "react"
import {
    Box,
    Text,
    SlideFade,
    useDisclosure
} from "@chakra-ui/react"
import { Container } from "@chakra-ui/layout"
import _ from "lodash"
import AnchorLink from "components/AnchorLink"
import {
    HamburgerIcon
} from "@chakra-ui/icons"

const TopMenu = ({
    sections,
    contentOffset,
    currentSectionIndex = 0,
    scrollPosition
}) => {
    const menuRef = useRef(null)
    const [menuDimensions, setMenuDimensions] = useState(false)
    const { isOpen, onToggle, onClose } = useDisclosure()
    const [onLoad, setOnLoad] = useState(false)
    const [isFrontEnd, setIsFrontEnd] = useState(false)

    useEffect(() => {
        if (typeof window !== "undefined" && isFrontEnd === false) {
            setIsFrontEnd(true)
        }
    }, [isFrontEnd])


   


    useEffect(() => {
        if(onLoad === false) {
            setOnLoad(true)
        }
    }, [onLoad])

    const menuOffset = useMemo(() => {
        var currentOffset = 0
        if(onLoad === false) {
            return 0
        }
        const node = menuRef?.current
        if(!_.isNull(node)) {
            currentOffset = node.getBoundingClientRect().y
        }
        return currentOffset + scrollPosition - scrollPosition
    }, [menuRef, scrollPosition, onLoad])

    var menuOpacity = menuOffset > 0 ? 0.5 : 1
    if(onLoad === false) {
        menuOpacity = 0
    }

    var usingSectionIndex = currentSectionIndex
    if(onLoad === false) {
        usingSectionIndex = 0
    }
    var sectionsWithIndex = [{title: "Contents"}].concat(sections)
    var currentSection = _.get(sectionsWithIndex, usingSectionIndex, false)

    if(isFrontEnd === false) {
        return null
    }

    return (
        <>
        <Box height={contentOffset}></Box>
        <Box
            position="sticky"
            top={0}
            zIndex="200"
            ref={menuRef}
            userSelect="none"
            >
            <Container maxW="container.xl" paddingTop="0rem"
                cursor="pointer"
                onPointerDown={() => {
                    onToggle()
                }}
                position="relative"
                zIndex="205"
                opacity={menuOpacity}
                >
                <HamburgerIcon
                    position="absolute"
                    top="1.5rem"
                    right="5"
                    color="black"
                    />
                <Text
                    fontSize="0.9rem"
                    background={menuOffset > 0 ? "rgba(255,255,255,1)" : "rgb(255,255,255, 0.9)"}
                    position="relative"
                    paddingTop="1rem"
                    paddingBottom="0.5rem"
                    borderBottom="1px solid rgb(220,220,220)"
                    zIndex="203"
                    _hover={{
                        color: "gray.500"
                    }}
                    >
                    <Text as="span" color="gray.500" fontStyle="italic">
                        Current section:{" "}
                    </Text>
                    {_.get(currentSection, "title", "-")}
                </Text>
            </Container>
            <Box height={0} overflow="visible" position="relative" zIndex="-1" top="0px">
            <Box position="absolute"
                    height="300px"
                    background="white"
                    top="-300px"
                    left="0px"
                    right="0px"
                    opacity={menuOffset > 0 ? 1 : 0}
                    zIndex="206"
                    pointerEvents="none"
                    />
            <SlideFade
                direction="top"
                in={isOpen}
                offsetY={-100}
                style={{pointerEvents: "none"}}
                >
                <Box
                    paddingTop="0.5rem"
                    paddingBottom="1rem"
                    position="relative"
                    pointerEvents="none"
                    borderBottom="1px solid rgb(220,220,220)"
                    background="white"
                    zIndex="100"
                    >
                    <Container maxW="container.xl"
                        pointerEvents={isOpen ? "initial" : "none"}
                        role="group"
                        _hover={{
                            background: "black"
                        }}
                        >
                        <AnchorLink
                            href={`#page-top`}
                            onSelectCallback={() => {
                                onClose()
                            }}
                            >
                            <Text
                                color={currentSectionIndex - 1 === -1 ? "black" : "gray.500"}
                                _groupHover={{
                                    color: "white"
                                }}
                                fontSize="0.9rem"
                                paddingTop="0.25rem"
                                paddingBottom="0.25rem"
                                >
                                Page content
                            </Text>
                        </AnchorLink>
                    </Container>
                    {sections.map((section, section_i) => {
                        return (
                            <Container maxW="container.xl"
                                cursor="pointer"
                                key={section_i}
                                pointerEvents={isOpen ? "initial" : "none"}
                                role="group"
                                _hover={{
                                    background: "black"
                                }}
                                >
                                <AnchorLink
                                    href={`#${_.get(section, "id", "")}`}
                                    offset={100}
                                    onSelectCallback={() => {
                                        onClose()
                                    }}
                                    >
                                    <Text
                                        fontSize="0.9rem"
                                        paddingTop="0.25rem"
                                        paddingBottom="0.25rem"
                                        color={currentSectionIndex - 1 === section_i ? "black" : "gray.500"}
                                        _groupHover={{
                                            color: "white"
                                        }}
                                        >
                                        <Text
                                            as="span"
                                            color={currentSectionIndex - 1 === section_i ? "gray.800" : "gray.300"}
                                            >
                                            {`${section_i + 1}: `}
                                        </Text>
                                        {section.title}
                                    </Text>
                                </AnchorLink>
                            </Container>
                        )
                    })}
                </Box>
            </SlideFade>
            </Box>
        </Box>
        </>
    )
}

export default TopMenu