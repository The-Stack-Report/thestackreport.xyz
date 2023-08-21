import React from "react"
import {
    Box,
    Text
} from "@chakra-ui/react"
import { Link } from "@chakra-ui/next-js"

const DashboardsCategoriesNavigation = ({
    categories,
    urlPrefix="/categories"
}) => {
    return (
        <Box display="flex" paddingBottom="2rem" fontSize="0.7rem" color="gray.500">
            <Text paddingRight="0.5rem">Categories:</Text>
            {categories.map((category, i) => {
                return (
                    <React.Fragment key={i}>
                        <Link href={`${urlPrefix}/${category}`}>
                            <Text paddingRight="0.5rem">{category}</Text>
                        </Link>
                        {i < categories.length - 1 && (
                            <Text paddingRight="0.5rem">{" / "}</Text>
                        )}
                    </React.Fragment>
                )
            })}
        </Box>
    )
}

export default DashboardsCategoriesNavigation