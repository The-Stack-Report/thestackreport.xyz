import React from "react"
import {
    Image,
    Box
} from "@chakra-ui/react"
import { basicImgLoader } from "utils/basicImgLoader"

const BannerImage = ({
    imageSrc,
    height = false
}) => {
    var boxProps = {
        overflow: "hidden"
    }
    if(height) {
        boxProps.height = height
    }

    return (
        <Box {...boxProps}>
            <Image
                src={imageSrc}
                loader={basicImgLoader}
                alt="Banner Image"
                layout="fill"
                objectFit="cover"
                unoptimized={true}
                />
        </Box>
    )
}

export default BannerImage