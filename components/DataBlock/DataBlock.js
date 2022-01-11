import React, { useRef, useState, useEffect } from "react"
import useSWR from 'swr'
import SilentVideo from "components/SilentVideo"
import {
    Button,
    Box,
    Text,
    Link
} from "@chakra-ui/react"
import _ from "lodash"

const fetcher = (url) => fetch(url).then((res) => res.json())


const DataBlock = ({
    block = false,
    z_i = false
}) => {
    const [showControls, setShowControls] = useState(false)
    const [tapToggle, setTapToggle] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const containerRef = useRef(null)


    useEffect(() => {
        if(loaded === false) {
            setLoaded(true)
        }
    },[loaded])

    useEffect(() => {
        const onResize = () => {
            if(showControls) {
                setShowControls(false)
            }
        }
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize)
        }
    }, [showControls]);

    useEffect(() => {
        const onScroll = e => {
            setTapToggle(false)
        };
        window.addEventListener("scroll", onScroll);
    
        return () => window.removeEventListener("scroll", onScroll);
      }, []);

    const resolution = {
        width: _.get(block, "video_meta.width", 100),
        height: _.get(block, "video_meta.height", 100)
    }
    const aspectRatio = resolution.height / resolution.width
    const containerWidth =_.get(containerRef, "current.clientWidth", 100)
    const dynamicHeight = containerWidth * aspectRatio
    const bottomPanelHeight = 36

    var showing = _.some([showControls, tapToggle])

    var containerStyle = {
        position: "relative",
        width: "100%",
        cursor: "crosshair"
    }
    if(z_i) {
        containerStyle.zIndex = z_i
    }
    const tweetTextPreview = `${block.name} data visual:`
    const tweetUrl = `https://thestackreport.xyz/data_blocks/block?block=${block.vid_key.replace(/\s/g, "%2520")}`
    return (
        <div className='data-block'
            style={containerStyle}
            ref={containerRef}
            onPointerEnter={() => { setShowControls(true)}}
            onPointerLeave={() => {
                setShowControls(false)
            }}
            onPointerDown={(e) => {
                console.log("pointer down event: ", showControls)
                setTapToggle(!tapToggle)
            }}
            >
                <Box
                    style={{
                        position: "relative",
                        padding: 2
                    }}
                    
                    >
                    <SilentVideo
                        src={block.spaces_url}
                        resolution={resolution}
                        />
                </Box>
                <Link style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        textAlign: "right",
                        zIndex: showing ? 111 : 100,
                        opacity: showing ? 1 : 0
                    }}
                    href={`/data_blocks/block?block=${block.vid_key}`}
                    color="black"
                    _hover={{
                        background: "black",
                        color: "white"
                    }}
                    fontSize="xs"
                    onPointerDown={(e) => {
                        e.stopPropagation();
                    }}
                    >
                        {block.title}
                        <br />

                    {block.name}
                    <br />
                    {block.merged_frames_at}
                </Link>
                <div style={{
                    position: "absolute",
                    border: showing ? "1px solid rgba(0,0,0,1)" : "1px solid rgba(0,0,0,0.025)",
                    borderRadius: 2,
                    top: 0,
                    left: 0,
                    right: 0,
                    transition: "border 0.1s",
                    zIndex: showing ? 109 : 100,
                    pointerEvents: "none"
                }}>
                    <div style={{
                        height: showing ? dynamicHeight : dynamicHeight - bottomPanelHeight,
                        transition: "height 0.1s",
                        pointerEvents: "none"
                    }} />
                    <div style={{
                        opacity: showing ? 1 : 0,
                        pointerEvents: showing ? "auto" : "none",
                        left: 0,
                        right: 0,
                        padding: 5,
                        paddingTop: 4,
                        transition: "opacity 0.1s",
                        background: "white",
                        pointerEvents: "initial"
                    }}>
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
                    </div>
                </div>
        </div>
    )
}

export const DataBlockDynamic = ({
    block_key,
}) => {
    const { data, error } = useSWR(`/api/data_block?vid_key=${block_key}`, fetcher)
    if (error) return <div>Failed to load block: {block_key}</div>
    if (!data) return <div>loading...</div>
    if (data.docs.length === 0) return <div>No block found with key: {block_key}</div>

    return (
        <DataBlock block={_.first(data.docs)} />
    )
}

export default DataBlock