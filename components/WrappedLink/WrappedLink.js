import React from "react"
import NextLink from "next/link"
import { Box, Link } from "@chakra-ui/react"

const WrappedLink = ({
        href,
        children,
        inline=false,
        ...props }) => {
    return (
        <>
        <NextLink
            href={href}
            passHref={true}
            >
            <Link
                {...props}
                >
            {children}
            </Link>
        </NextLink>
        {inline === false && (
            <br />
        )}
        </>
    )
}

export default WrappedLink