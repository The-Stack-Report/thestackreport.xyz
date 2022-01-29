import React from "react"
import Link from "next/link"
import {
    Box,
    Text
} from "@chakra-ui/react"
import _ from "lodash"

const CategoriesTags = ({ categories }) => {
    return (
        <div style={{display: "flex"}}>
            {categories.map((category, c_i) => {
                return (
                    <Link
                        href={`/categories/${_.get(category, "attributes.Category", false)}`}
                        passHref={true}
                        key={category.id}
                        >
                        <Box
                            width="fluid"
                            background="black"
                            paddingLeft="0.35rem"
                            paddingRight="0.35rem"
                            marginTop="0.35rem"
                            marginRight="0.35rem"
                            border="1px solid black"
                            key={c_i}
                            cursor="pointer"
                            _hover={{
                                opacity: 0.8
                            }}
                            >
                            <Text
                                fontSize="0.7rem"
                                color="white"
                                >
                                {_.get(category, "attributes.Category", false)}
                            </Text>
                        </Box>
                    </Link>
                )
            })}
        </div>
    )
}

export default CategoriesTags