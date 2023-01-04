import React from "react"
import {
    SimpleGrid,
    Box,
    Text,
    Flex,
    Center,
    Heading,

} from "@chakra-ui/react"
import WrappedLink from "components/WrappedLink"
import ArticleCard from "components/ArticleCard"
import { INTERPRETATION_LAYER_VISUAL_URL } from "constants/imageAssets"

const QuickLinksWidget = ({ latestWeeklies }) => {
    return (
        <>
        <Text
            textAlign="center"
            fontWeight="bold"
            textTransform="uppercase"
            fontSize="0.7rem"
            marginBottom="1rem"
            color="gray.600"
            >
            Quick links
        </Text>
        <SimpleGrid columns={[1, 1, 3]} spacingX="1rem" spacingY="2rem">
        
            <WrappedLink
                href="/interpretation-layer"
                inline={true}
                _hover={{
                    background: "white"
                }}
                >
                <Box border="1px solid black" height="10rem">
                    <Box
                        height="10rem"
                        border="6px solid transparent"
                        position="relative"
                        _hover={{
                            border: "6px solid black"
                        }}
                        backgroundImage={INTERPRETATION_LAYER_VISUAL_URL}
                        backgroundSize="cover"
                        backgroundPosition="center"
                        backgroundRepeat="no-repeat"
                        role="group"
                        overflow="hidden"
                        >
                        <Flex height="10rem"
                            minWidth='max-content' alignItems='center' justifyContent='center'
                            >
                            <Center>
                                <Text
                                    position="relative"
                                    top="-0.5rem"
                                    _groupHover={{background: "black", color: "white"}}
                                    >
                                {`Interpretation Layer`}
                                </Text>
                            </Center>
                        </Flex>
                        <Text
                            position="absolute"
                            bottom="5px"
                            fontSize="xs"
                            _groupHover={{color: "black"}}
                            textAlign="center"
                            left="10px"
                            right="10px"
                            userSelect={"none"}
                            >
                            Community features to add & share knowledge.
                        </Text>
                    </Box>
                </Box>
            </WrappedLink>
            
            <WrappedLink
                    href="/dashboards/tezos"
                    inline={true}
                    _hover={{
                        background: "white"
                    }}
                    >
            <Box border="1px solid black" height="10rem">
                <Box
                    border="6px solid transparent"
                    _hover={{
                        border: "6px solid black"
                    }}
                    height="10rem"
                    role="group"
                    >
                
                    <Box
                        backgroundImage="https://the-stack-report.ams3.cdn.digitaloceanspaces.com/website_assets/decorations/TSR%20Dashboards%20visual%202022.png"
                        backgroundSize="cover"
                        backgroundPosition="center"
                        backgroundRepeat="no-repeat"
                        position="relative"
                        top="-0.8rem"
                        left="1.5rem"
                        >
                        <Flex
                            height="10rem"
                            position="relative"
                            left="-1rem"
                            minWidth='max-content' alignItems='center' justifyContent='center'
                            >
                            <Center>
                            
                                <Text
                                    textAlign="center"
                                    background="white"
                                    _groupHover={{
                                        background: "black",
                                        color: "white"
                                    }}
                                    >
                                    Dashboards
                                </Text>
                        </Center>
                        </Flex>
                        <Text
                            position="absolute"
                            bottom="5px"
                            fontSize="xs"
                            _groupHover={{color: "black"}}
                            textAlign="center"
                            left="-1rem"
                            right="10px"
                            >
                            Tezos smart contract usage visualisations.
                            <br />
                        </Text>
                    </Box>
                </Box>
            </Box>
            </WrappedLink>
                {latestWeeklies.slice(0, 1).map((weekly, weekly_i) => {
                    return (
                            <ArticleCard
                                article={weekly}
                                height="10rem"
                                marginBottom="0rem"
                                key={weekly.id}
                                />
                        )
                    })
                }
        </SimpleGrid>
    </>
    )
}

export default QuickLinksWidget