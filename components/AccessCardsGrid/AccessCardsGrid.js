import React, { useEffect, useState, useMemo, useRef } from "react"
import {
    Box,
    Text,
    Image,
    Divider,
    Button
} from "@chakra-ui/react"
import { accessCardsTeztokQuery } from "./teztokQuery"
import _ from "lodash"
import StyledLink from "components/Links/StyledLink"
import WrappedLink from "components/WrappedLink"

const AccessCardsGrid = ({
    mode="available",
    leftPadding=0
}) => {
    const [accessCardsSalesData, setAccessCardsSalesData] = useState(false)
    const [sortKey, setSortKey] = useState("price")

    useEffect(() => {
        if(accessCardsSalesData === false) {
            fetch(`https://unstable-do-not-use-in-production-api.teztok.com/v1/graphql`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: accessCardsTeztokQuery,
                })
            }).then(res => res.json())
            .then(res => {
                setAccessCardsSalesData(res.data.tokens)
            })
        }
        
    }, [accessCardsSalesData])

    var availableCards = useMemo(() => {
        if(_.isArray(accessCardsSalesData)) {
            return accessCardsSalesData.filter(card => {
                return _.isNumber(card.price) && !_.isNull(card.price)
            })
        }
        return []
    }, [accessCardsSalesData])

    availableCards = _.sortBy(availableCards, sortKey)

    return (
        <Box>
            <Box
                paddingLeft={`${leftPadding}px`}
                paddingBottom="1rem">
                <Text fontWeight="bold" >
                    {availableCards.length} cards available.
                </Text>
                <Box display="flex">
                <Text fontSize='0.8rem' marginRight="0.5rem"
                    position="relative"
                    top="0.1rem"
                    >
                    Sort by:
                </Text>
                <Button
                    width="fluid"
                    size="xs"
                    marginRight="0.5rem"
                    onPointerDown={() => setSortKey("price")}
                    color={sortKey === "price" ? "white" : "black"}
                    bg={sortKey !== "price" ? "white" : "black"}
                    >
                    Price
                </Button>
                <Button
                    width="fluid"
                    size="xs"
                    marginRight="0.5rem"
                    onPointerDown={() => setSortKey("token_id")}
                    color={sortKey === "token_id" ? "white" : "black"}
                    bg={sortKey !== "token_id" ? "white" : "black"}
                    >
                    Number
                </Button>
                </Box>
            </Box>
            <Box overflowX="scroll">
                <Box
                    display="flex"
                    marginLeft={`${leftPadding}px`}
                    marginRight={`${leftPadding}px`}
                    width={`${availableCards.length * 180}px`}
                    paddingBottom="2rem"
                    >
                    {availableCards.map((card, card_i) => {
                        var paddedTokenNr = _.toNumber(card.token_id).toString().padStart(4, '0')
                        var cdnPreview = `https://the-stack-report.ams3.cdn.digitaloceanspaces.com/access_cards_2023/thumbnail_1k_card_${paddedTokenNr}.png`

                        return (
                            <a
                                key={card_i}
                                href={`https://objkt.com/asset/KT1LaCf37XyoR4eNCzMnw6Ccp5bfPFQrKYxe/${card.token_id}`}
                                target="_blank"
                                rel="noreferrer"
                                >
                                <Box width="160px" marginRight="20px" role="group">
                                    <Box
                                        paddingBottom="2rem"
                                        width="160px"
                                        border="1px solid grey"
                                        borderRadius="0.25rem"
                                        padding="0.25rem"
                                        _hover={{
                                            background: "gray.100"
                                        }}
                                        fontSize="0.8rem"
                                        >
                                        
                                            <Image
                                                borderRadius="0.25rem"
                                                src={cdnPreview}
                                                maxWidth="100%"
                                                width="100%"
                                                alt="Beta access token"
                                                />
                                                <Text
                                                    _groupHover={{
                                                        textDecoration: "underline"
                                                    }}
                                                    >
                                                    
                                                    {card.name}
                                                    </Text>
                                                    <Divider />
                                                    <Text>
                                                        Available for:<br />
                                                    <Text as="span" fontWeight="bold">
                                                    {card.price / 1_000_000} tez
                                                    </Text>
                                                    </Text>
                                                
                                    </Box>
                                    <Text
                                        fontSize="0.8rem"
                                        color="gray.500"
                                        width="160px"
                                        marginRight="20px"
                                        _groupHover={{
                                            textDecoration: "underline"
                                        }}
                                        >
                                        To: objkt.com
                                    </Text>
                                </Box>
                            </a>
                        )
                    })}
                </Box>
            </Box>
        </Box>
    )
}

export default AccessCardsGrid