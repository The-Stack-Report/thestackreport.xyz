import React from "react"
import NextLink from "next/link"
import { Box, Link, Text } from "@chakra-ui/react"

const WrappedLink = ({
        href = "",
        children,
        inline=false,
        passHref=false,
        textDecoration = false,
        ...props }) => {
    var linkProps = {}
    if(textDecoration !== false) {
        linkProps["textDecoration"] = textDecoration
    }
    return (
        <>
        <NextLink
            href={href}
            passHref={passHref}
            >
            {children}
        </NextLink>
        {inline === false && (
            <>
            <br />
            </>
        )}
        </>
    )
}

export default WrappedLink