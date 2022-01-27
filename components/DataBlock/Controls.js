import React from "react"
import {
    Button,
    Link,
    Text
} from "@chakra-ui/react"
import _ from "lodash"
import getStillFrame from "./blockUtils/getStillFrame"


const Controls = ({ block }) => {
    const tweetTextPreview = `${block.name} data visual:`
    const tweetUrl = `https://thestackreport.xyz/data_blocks/block?block=${block.vid_key.replace(/\s/g, "%2520")}`
    const stills = _.get(block, "stills", false)

    var firstStill = getStillFrame(block)
    return (
        <React.Fragment>
            <Button
                width="100%"
                fullwidth="true"
                as="a"
                target="_blank"
                size="xs"
                colorScheme="white"
                color="black"
                border="1px solid black"
                borderRadius="0"
                onPointerDown={(e) => {
                    e.stopPropagation();
                }}
                pointerEvents="initial"
                _hover={{
                    background: "black",
                    color: "white"
                }}

                href={block.spaces_url}
                download={block.vid_key}
                >
                Download as video (mp4)
            </Button>
            {_.isArray(stills) && stills.length === 1 && (
                <Button
                    width="100%"
                    fullwidth="true"
                    as="a"
                    target="_blank"
                    size="xs"
                    colorScheme="white"
                    color="black"
                    border="1px solid black"
                    borderRadius="0"
                    marginTop="0.25rem"
                    onPointerDown={(e) => {
                        e.stopPropagation();
                    }}
                    pointerEvents="initial"
                    _hover={{
                        background: "black",
                        color: "white"
                    }}
    
                    href={firstStill}
                    download={firstStill}
                    >
                    Download as still (.png)
                    </Button>
            )}
            <Button
                width="100%"
                fullwidth="true"
                as="a"
                target="_blank"
                size="xs"
                colorScheme="white"
                color="black"
                border="1px solid black"
                borderRadius="0"
                marginTop="0.25rem"
                onPointerDown={(e) => {
                    e.stopPropagation();
                }}
                pointerEvents="initial"
                _hover={{
                    background: "black",
                    color: "white"
                }}
                href={`https://twitter.com/intent/tweet?text=${tweetTextPreview}&url=${tweetUrl}&via=thestackreport`}
                >
                Tweet
                </Button>
                
                
        </React.Fragment>
    )
}

export default Controls