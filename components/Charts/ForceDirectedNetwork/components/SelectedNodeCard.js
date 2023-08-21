import React from "react"
import {
    Box,
    Container,
    Text,
    Button
} from "@chakra-ui/react"
import CopyTextSegment from "components/CopyTextSegment"
import { Link } from "@chakra-ui/next-js"

const SelectedNodeCard = ({
    node,
    setSelectedNode
}) => {
    return (
        <Box
            position="absolute"
            bottom={node ? "40px" : "0px"}
            transition={"bottom 0.25s"}
            left="0rem"
            right="0rem"
            zIndex="100"
            >
            <Container maxW="container.xl" position="relative">
                <Box
                    background="rgba(255,255,255,0.8)"
                    cursor="auto"
                    boxShadow="base"
                    padding="0.25rem"
                    fontSize="0.8rem"
                    borderRadius="1rem"
                    paddingLeft="1rem"
                    display="flex"
                    >
                    {node === false ? (
                        <Text color={"rgba(255,255,255,0.0)"}>Placeholder</Text>
                    ) : (
                        <React.Fragment>
                            <Text paddingRight="0.5rem">
                                Selected node:
                            </Text>
                            {node.id.startsWith("tz") && (
                                <CopyTextSegment
                                    text={node.alias.length > 0 ? node.alias : node.id}
                                    />
                            )}
                            {node.id.startsWith("KT1") && (
                                <React.Fragment>
                                <Link
                                    href={`/dashboards/tezos/contracts/${node.id}`}
                                    target="_blank"
                                    pointerEvents="initial"
                                    marginRight="1rem"
                                    >
                                    <Text>
                                        {node.alias.length > 0 ? node.alias : node.id}
                                    </Text>
                                    
                                </Link>
                                <CopyTextSegment
                                    text={node.id}
                                    displayText="Copy address"
                                    showText={false}
                                    />
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                    
                </Box>
                <Button
                    size="xs"
                    width="fluid"
                    position="absolute"
                    top="0.1rem"
                    right="1.1rem"
                    pointerEvents="initial"
                    background="black"
                    color="white"
                    borderRadius="1rem"
                    _hover={{
                        color: "black",
                        background: "white"
                    }}
                    onPointerDown={() => {
                        setSelectedNode(false)
                    }}
                    >
                    Reset selection
                </Button>
            </Container>
        </Box>
    )
}

export default SelectedNodeCard