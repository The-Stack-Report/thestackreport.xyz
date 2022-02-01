import React from "react"
import Image from "next/image"
import {
    Box,
    Text,
    Link,
    Container
} from "@chakra-ui/react"
import _ from "lodash"
import dayjs from "dayjs"
import { basicImgLoader } from "utils/basicImgLoader"


const FeaturedArticleBanner = ({ article }) => {
    var articleSet = _.isObject(article)
    const articleId = _.get(article, "id")
    const articleSlug = _.get(article, "attributes.slug", "not-found")
    const title = _.get(article, "attributes.Title", "Featured article not set.")
    const bannerImgSrc = _.get(article, "attributes.banner_image_url", "https://the-stack-report.ams3.digitaloceanspaces.com/website_assets/Article_missing_img.png")
    return (
        <div style={{position: "relative", borderBottom: "1px solid black"}}>
            <div style={{
                minHeight: 400
            }}>
            <Image
                loader={basicImgLoader}
                src={bannerImgSrc}
                alt={`Image for featured article: ${title}`}
                layout="fill"
                objectFit="cover"
                />
            </div>
            <div style={{position: "absolute", bottom: 20, left: 0, right: 0}}>
                <Container
                    maxW="container.xl"
                    >
                    <div style={{display: "flex"}}>
                    <Box
                        width="fluid"
                        background="black"
                        paddingLeft="0.35rem"
                        paddingRight="0.35rem"
                        marginRight="0.7rem"
                        border="1px solid black"
                        >
                        <Text
                            fontSize="0.7rem"
                            color="white"
                            >
                            Featured
                        </Text>
                    </Box>
                    <Box
                        width="fluid"
                        background="white"
                        border="1px solid black"
                        opacity={0.9}
                        paddingLeft="0.35rem"
                        paddingRight="0.35rem"
                        >
                        <Text
                            fontSize="0.7rem"
                            color="black"
                            >
                            {dayjs(_.get(article, "attributes.Published", false)).format("MMMM D, YYYY h:mm A")}
                        </Text>
                    </Box>
                    </div>
                    <div style={{display: "flex", marginTop: "0.7rem"}}>
                        <Box
                            width="fluid"
                            background="white"
                            border="1px solid black"
                            marginBottom="2rem"
                            >
                            <Link
                                href={`/articles/${articleSlug}`}
                                fontSize={{
                                    base: "2rem",
                                    md: "2rem",
                                    lg: "3rem"
                                }}
                                >
                                {title}
                            </Link>
                        </Box>
                    </div>
                </Container>
            </div>
        </div>
    )
}

export default FeaturedArticleBanner