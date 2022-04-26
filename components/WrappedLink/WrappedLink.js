import React from "react"
import NextLink from "next/link"
import { Box, Link } from "@chakra-ui/react"

const WrappedLink = ({
        href,
        children,
        inline=false,
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
            passHref={true}
            >
            <Link
                href={href}
                {...linkProps}
                {...props}
                >
            {children}
            </Link>
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