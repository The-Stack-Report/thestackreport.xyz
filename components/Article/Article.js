import React from "react"
import {
    UnorderedList,
    Button,
    Text,
    SimpleGrid,
    Box,
    Grid,
    GridItem
} from "@chakra-ui/react"
import _ from "lodash"
import MarkdownWrapper from "components/MarkdownWrapper"
import CategoriesTags from "components/CategoriesTags"
import dayjs from "dayjs"




const Article = ({ article }) => {
    const categories = _.get(article, "categories.data", false)
    return (
        <div className="tsr-article">
            <Box height={{base: "2rem", md: "4rem"}}></Box>
            <Text
                fontSize="0.7rem"
                >
                {dayjs(_.get(article, "Published", false)).format("MMMM D, YYYY h:mm A")}
            </Text>
            {categories && (
                <CategoriesTags categories={categories} />
            )}
            <Text
                as="h1"
                fontSize={{
                    base: "2rem",
                    sm: "3rem",
                    md: "4rem"
                }}
                maxW="container.md"
                textTransform="uppercase"
                fontWeight="thin"
                marginBottom="2rem"
                >
                {article.Title}
            </Text>
            <Grid
                templateColumns='repeat(5, 1fr)'
                gap={4}
                >
                <GridItem
                    colSpan={1}
                    display={{
                        base: "none",
                        sm: "none",
                        md: "initial"
                    }}
                    >
                    <Text
                        fontWeight="light"
                        color="rgb(200,200,200)"
                        >
                    {">>"}
                    </Text>
                </GridItem>
                <GridItem
                    colSpan={{
                        base: 5,
                        sm: 5,
                        md: 4
                    }}
                    >
                    <Box maxW="container.sm">
                        <MarkdownWrapper
                            markdownText={_.get(article, "Content", "# content missing")}
                            />
                    </Box>
                </GridItem>
            </Grid>
        </div>
    )
}

export default Article