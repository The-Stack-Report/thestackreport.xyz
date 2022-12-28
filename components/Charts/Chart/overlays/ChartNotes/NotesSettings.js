import React, { useState, useRef, useEffect, useContext } from "react"
import {
    Button,
    Checkbox,
    Stack,
    Text,
    HStack,
    Box
} from "@chakra-ui/react"
import { MdBuild } from "react-icons/md"
import { HamburgerIcon } from "@chakra-ui/icons"
import useOnClickOutside from "utils/hooks/onClickOutside"
import { ChartContext } from "components/Charts/Chart/Chart"

const NotesSettings = () => {
    const chartContext = useContext(ChartContext)
    const ref = useRef(null)
    const [showNotes, setShowNotes] = useState(false)

    useOnClickOutside(ref, () => {
        if(showNotes) {
            console.log("click outside")
            setShowNotes(false)
        }
    });

    useEffect(() => {
        if(showNotes === "toggled") {
            setTimeout(() => {
                setShowNotes(true)
            }, 100)
            
        }
    }, [showNotes])
    return (
        <Box>
            {showNotes && (
                <Box
                    position="absolute"
                    bottom="-17px"
                    right="10px"
                    background="white"
                    border="1px solid rgba(0,0,0,0.1)"
                    padding="0px"
                    paddingLeft="1rem"
                    paddingRight="0.25rem"
                    display={showNotes ? "initial" : "none"}
                    ref={ref}
                    >
                    <Text fontSize="0.7rem" fontWeight="bold" textTransform="uppercase" textAlign="right">Note layers</Text>
                    <HStack>
                        <Checkbox pointerEvents="initial" size="sm" textAlign="right"
                            isChecked={chartContext.noteLayers.curated}
                            onChange={() => {
                                chartContext.setNoteLayers({
                                    ...chartContext.noteLayers,
                                    curated: !chartContext.noteLayers.curated
                                })
                            }}
                            >
                            Curated
                        </Checkbox>
                        <Checkbox pointerEvents="initial" size="sm" textAlign="right"
                            isChecked={chartContext.noteLayers.community}
                            onChange={() => {
                                chartContext.setNoteLayers({
                                    ...chartContext.noteLayers,
                                    community: !chartContext.noteLayers.community
                                })
                            }}
                            >
                            Community
                        </Checkbox>
                        <Checkbox pointerEvents="initial" size="sm" textAlign="right"
                            isChecked={chartContext.noteLayers.user}
                            onChange={() => {
                                chartContext.setNoteLayers({
                                    ...chartContext.noteLayers,
                                    user: !chartContext.noteLayers.user
                                })
                            }}
                            >
                            Yours
                        </Checkbox>
                    </HStack>
                </Box>
            )}
            
            <Button
                variant='ghost'
                width="fluid"
                position="absolute"
                right="10px"
                top="22px"
                pointerEvents="initial"
                colorScheme='black'
                size="sm"
                _hover={{
                    background: "black",
                    color: "white"
                }}
                onPointerDown={() => {
                    if(showNotes === false) {
                        setShowNotes("toggled")
                    }
                }}
                >
                <HamburgerIcon />
            </Button>
            
        </Box>
    )
}

export default NotesSettings