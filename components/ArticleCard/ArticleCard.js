import React from "react"
import Link from 'next/link'
import WrappedLink from "components/WrappedLink"
import Image from "next/image"
import {
    Box,
    Text
} from "@chakra-ui/react"
import _ from "lodash"
import dayjs from "dayjs"
import { basicImgLoader } from "utils/basicImgLoader"
import {
    placeholderImg
} from "constants/cms"

const ArticleCard = ({
    article,
    height="14rem",
    marginBottom="0.5rem"
}) => {
    const attrs = article.attributes
    const authors = _.get(attrs, "authors.data", false)
    const categories = _.get(attrs, "categories.data", false)
    var bannerImgUrl = _.get(attrs, "banner_image_url", false)
    if(!_.isString(bannerImgUrl)) {
        bannerImgUrl = placeholderImg
    }

    var previewMode = _.get(attrs, "preview", false)
    return (
        <WrappedLink
            href={`/articles/${_.get(attrs, "slug", "no-slug-set-for-article")}`}
            >
            <Box key={article.id}
                border={"1px solid black"}
                marginBottom={marginBottom}
                cursor={"pointer"}
                _hover={{
                    top: 0
                }}
                height={height}
                position="relative"
                role="group"
                >
                <Box
                    position="absolute"
                    width="100%"
                    height="100%"
                    zIndex={20}
                    _groupHover={{
                        border: "6px solid black"
                    }}
                    />
                <div style={{position: "relative", width: "100%", height: "100%", overflow: "hidden"}}>
                <Image
                    loader={basicImgLoader}
                    src={bannerImgUrl}
                    alt={_.get(attrs, "Title", "no-title")}
                    fill={true}
                    unoptimized={true}
                    style={{objectFit: "cover"}}
                    />
                </div>
                {previewMode && (
                    <Box
                        position="absolute"
                        zIndex="1000"
                        color="rgb(200,50,150)"
                        top="0px"
                        left="0px"
                        right="0px"
                        textAlign="center"
                        >
                        PREVIEW
                    </Box>
                )}
                <div
                    style={{
                        position: "absolute",
                        bottom: 5,
                        right: 5,
                        left: 5,
                        zIndex: 10,
                    }}>
                    <div style={{display: "flex", alignItems: "end", textAlign: "right"}}>
                        <Box
                            width="fluid"
                            background="white"
                            border="1px solid black"
                            opacity={0.9}
                            paddingLeft="0.35rem"
                            paddingRight="0.35rem"
                            marginLeft="auto"
                            marginBottom="0.35rem"
                            >
                            <Text
                                fontSize="0.7rem"
                                color="black"
                                >
                                {dayjs(_.get(article, "attributes.Published", false)).format("MMMM D, YYYY h:mm A")}
                            </Text>
                        </Box>
                    </div>
                    {(authors && false) && (
                        <div style={{display: "flex", alignItems: "end", textAlign: "right"}}>
                            <Box
                                width="fluid"
                                opacity={0.9}
                                paddingLeft="0.35rem"
                                paddingRight="0.35rem"
                                marginLeft="auto">
                                <Text
                                    fontSize="0.7rem"
                                    >
                                    By: 
                                </Text>
                            </Box>
                            {authors.map((author, author_i, author_a) => {
                                return (
                                    <Box
                                        width="fluid"
                                        key={author.id}
                                        >
                                        <Text
                                            fontSize="0.7rem"
                                            fontWeight="bold"
                                            textTransform="uppercase"
                                            >
                                            {_.get(author, "attributes.first_name", false)}
                                        </Text>
                                        {(author_i < author_a.length - 1 && (
                                            <Text
                                            fontSize="0.7rem"
                                            >
                                            {','}
                                        </Text>
                                        ))}
                                    </Box>
                                )
                            })}
                        </div>
                    )}
                    <div style={{display: "flex", alignItems: "end", textAlign: "right"}}>
                    <Text
                        textDecoration="underline"
                        _groupHover={{
                            bg: "black",
                            color: "white"
                        }}
                        width="fluid"
                        textAlign="right"
                        paddingLeft="0.35rem"
                        paddingRight="0.35rem"
                        marginLeft="auto"
                        background="white"
                        >
                        {_.get(attrs, "Title", 'no-title')}
                    </Text>
                    </div>
                    <div style={{display: "flex", alignItems: "end", textAlign: "right"}}>
                    <Text
                        fontSize="0.7rem"
                        _groupHover={{
                            bg: "black",
                            color: "white"
                        }}
                        marginTop="0.35rem"
                        textAlign="right"
                        marginLeft="auto"
                        paddingLeft="0.35rem"
                        paddingRight="0.35rem"
                        width="fluid"
                        color="gray400"
                        background="white"
                        >
                        {_.get(attrs, "Snippet", "no-snippet")}
                    </Text>
                    </div>
                    {categories && (
                        <div style={{display: "flex", alignItems: "end", textAlign: "right", marginTop: "0.35rem"}}>
                            {categories.map((category, c_i) => {
                                return (
                                    <Box
                                        width="fluid"
                                        background="black"
                                        paddingLeft="0.35rem"
                                        paddingRight="0.35rem"
                                        marginLeft="auto"
                                        border="1px solid black"
                                        key={c_i}
                                        >
                                        <Text
                                            fontSize="0.7rem"
                                            color="white"
                                            >
                                            {_.get(category, "attributes.Category", false)}
                                        </Text>
                                    </Box>
                                )
                            })}
                        </div>
                    )}
                </div>
            </Box>
        </WrappedLink>
    )
}

export default ArticleCard