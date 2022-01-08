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
    block = false
}) => {
    const [showControls, setShowControls] = useState(false)
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

    const resolution = {
        width: _.get(block, "video_meta.width", 100),
        height: _.get(block, "video_meta.height", 100)
    }
    const aspectRatio = resolution.height / resolution.width
    const containerWidth =_.get(containerRef, "current.clientWidth", 100)
    const dynamicHeight = containerWidth * aspectRatio
    const bottomPanelHeight = 36


    return (
        <div className='data-block'
            style={{
                position: "relative",
                width: "100%",
                cursor: "crosshair"
            }}
            ref={containerRef}
            onPointerEnter={() => { setShowControls(true)}}
            onPointerLeave={() => { setShowControls(false)}}
            onPointerDown={() => { setShowControls(true)}}
            onPointerUp={() => { setShowControls(false)}}
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
                        zIndex: showControls ? 111 : 100,
                        opacity: showControls ? 1 : 0
                    }}
                    href={`/data_blocks/block?block=${block.vid_key}`}
                    color="black"
                    _hover={{
                        background: "black",
                        color: "white"
                    }}
                    fontSize="xs"
                    >
                        {block.title}
                        <br />

                    {block.name}
                    <br />
                    {block.merged_frames_at}
                </Link>
                <div style={{
                    position: "absolute",
                    border: showControls ? "1px solid rgba(0,0,0,1)" : "1px solid rgba(0,0,0,0.2)",
                    borderRadius: 2,
                    top: 0,
                    left: 0,
                    right: 0,
                    transition: "border 0.1s",
                    zIndex: showControls ? 109 : 100
                }}>
                    <div style={{
                        height: showControls ? dynamicHeight : dynamicHeight - bottomPanelHeight,
                        transition: "height 0.1s"
                    }} />
                    <div style={{
                        opacity: showControls ? 1 : 0,
                        pointerEvents: showControls ? "auto" : "none",
                        left: 0,
                        right: 0,
                        padding: 5,
                        paddingTop: 4,
                        transition: "opacity 0.1s",
                        background: "white"
                    }}>
                    <Button
                        width="100%"
                        fullwidth="true"
                        as="a"
                        href={block.spaces_url}
                        download={block.vid_key}
                        target="_blank"
                        size="xs"
                        colorScheme="white"
                        color="black"
                        border="1px solid black"
                        borderRadius="0"
                        _hover={{
                            background: "black",
                            color: "white"
                        }}
                        >
                        Download as video (mp4)
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