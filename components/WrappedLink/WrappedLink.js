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
            <Link
                href={href}
                {...props}
                >
            {children}
            </Link>
        {inline === false && (
            <>
            <br />
            </>
        )}
        </>
    )
}

export default WrappedLink