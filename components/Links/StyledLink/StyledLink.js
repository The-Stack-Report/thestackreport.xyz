import React from "react"
import NextLink from "next/link"
import { Box, Link, Text } from "@chakra-ui/react"
import _ from "lodash"

const StyledLink = ({
        href="",
        children,
        as="span",
        inline=false,
        passHref=false,
        textDecoration="underline",
        _hover={},
        ...props }) => {

    var hoverProps = {
        color: "white",
        background: "black",
        ..._hover
    }
    return (
        <>
        <NextLink href={href} >
            <Text
                as={as}
                textDecoration={textDecoration}
                _hover={hoverProps}
                {...props}
                >
                {children}
            </Text>
        </NextLink>
        {inline === false && (
            <>
            <br />
            </>
        )}
        </>
    )
}

export default StyledLink