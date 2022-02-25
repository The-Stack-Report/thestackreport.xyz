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
import Controls from "./Controls"
import Image from "next/image"
import getStillFrame from "./blockUtils/getStillFrame"

const fetcher = (url) => fetch(url).then((res) => res.json())

const DataBlock = ({
    block = false,
    z_i = false,
    autoPlayOnLoad = false
}) => {
    const [showControls, setShowControls] = useState(false)
    const [tapToggle, setTapToggle] = useState(false)
    const [loaded, setLoaded] = useState(false)
    const [showStillFramePreview, setShowStillFramePreview] = useState(true)
    const [showVideo, setShowVideo] = useState(false)
    const [initiatedAutoPlay, setInitiatedAutoplay] = useState(false)
    const [vidLoaded, setVidLoaded] = useState(false) // Callback from video element
    const [vidPlaying, setVidPlaying] = useState(false)
    const [resizeCounter, setResizeCounter] = useState(0)
    const [initialSizing, setInitialSizing] = useState(0)
    const [pausedByUser, setPausedByUser] = useState(false)
    const [hoveredFirstTime, setHoveredFirstTime] = useState(false)
    const containerRef = useRef(null)

    useEffect(() => {
        if(initialSizing === 0) {
            setInitialSizing(1)
        }
    }, [initialSizing])
    useEffect(() => {
        if(loaded === false && autoPlayOnLoad) {
            setLoaded(true)
            setShowVideo(true)
        }
    },[loaded, autoPlayOnLoad])

    useEffect(() => {
        if(vidLoaded && autoPlayOnLoad && !initiatedAutoPlay) {
            setInitiatedAutoplay(true)
            setVidPlaying(true)
        }
    }, [vidLoaded, autoPlayOnLoad, initiatedAutoPlay])

    useEffect(() => {
        const onResize = () => {
            if(showControls) {
                setShowControls(false)
            }
            setResizeCounter(resizeCounter + 1)
        }
        window.addEventListener("resize", onResize);
        return () => {
            window.removeEventListener("resize", onResize)
        }
    }, [showControls, resizeCounter]);

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
        cursor: "crosshair",
    }

    if(z_i) {
        containerStyle.zIndex = z_i
    }
    var stillUrl = getStillFrame(block)
    if(_.isString(stillUrl)) {
        stillUrl = stillUrl.replace("the-stack-report.ams3.digitaloceanspaces.com", "the-stack-report.ams3.cdn.digitaloceanspaces.com")
    }
    var boxPadding = 2
    return (
        <div className='data-block'
            style={containerStyle}
            ref={containerRef}
            onPointerEnter={() => {
                setShowControls(true)
                setHoveredFirstTime(true)
                if(vidLoaded === false) {
                    setLoaded(true)
                    setShowVideo(true)
                } else {
                    if(pausedByUser === false) {
                        setVidPlaying(true)
                    }
                }
            }}
            onPointerLeave={() => {
                setShowControls(false)
            }}
            onPointerDown={(e) => {
                setTapToggle(!tapToggle)
            }}
            >
                <Box
                    style={{
                        position: "relative",
                        padding: boxPadding,
                        width: containerWidth - boxPadding * 2,
                        height: (containerWidth - boxPadding * 2) * aspectRatio
                    }}
                    >
                    <div style={{
                        opacity: (stillUrl && showStillFramePreview && !vidPlaying) ? 1 : 0,
                        transition: "opacity 0.1s",
                        position: "relative",
                        width: containerWidth - 4,
                        left: -2,
                        top: -2,
                        height: dynamicHeight,
                        overflow: "hidden",
                        zIndex: 2
                        }}>
                        {_.isString(stillUrl) && (
                            <Image src={stillUrl} alt="Data block chart" layout="fill"
                                />
                        )}
                        
                    </div>
                    <div style={{
                        position: "absolute", 
                        top: 0, 
                        left: 0, 
                        right: 0,
                        opacity: (stillUrl && showStillFramePreview && !vidPlaying) ? 0 : 1,
                        transition: "opacity 0.1s",
                    }}>
                    {showVideo && (
                        <SilentVideo
                            src={block.spaces_url}
                            resolution={resolution}
                            hasLoaded={() => {
                                setVidLoaded(true)
                                if(hoveredFirstTime && pausedByUser === false) {
                                    setVidPlaying(true)
                                }
                            }}
                            />
                    )}
                    </div>
                </Box>
                <Link style={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        textAlign: "right",
                        zIndex: showing ? 111 : 100,
                        opacity: showing ? 1 : 0
                    }}
                    href={`/data_blocks/${encodeURIComponent(block.vid_key)}`}
                    color="black"
                    background="white"
                    _hover={{
                        background: "black",
                        color: "white"
                    }}
                    fontSize="xs"
                    pointerEvents={showing ? "initial" : "none"}
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
                    border: showing ? "1px solid rgba(0,0,0,1)" : "1px solid rgba(0,0,0,0.0)",
                    borderRadius: 2,
                    boxShadow: tapToggle ? "4px 4px 0px 0px rgba(0, 0, 0, .8)" : "none",
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
                        pointerEvents: showing ? "auto" : "none"
                    }} />
                    <div style={{
                        opacity: showing ? 1 : 0,
                        pointerEvents: showing ? "auto" : "none",
                        left: 0,
                        right: 0,
                        padding: 5,
                        paddingBottom: 0,
                        transition: "opacity 0.1s",
                        background: "white",
                    }}>
                        <Button
                            width="100%"
                            fullwidth="true"
                            target="_blank"
                            size="xs"
                            colorScheme="white"
                            color="black"
                            border="1px solid black"
                            borderRadius="30px"
                            onPointerDown={(e) => {
                                if(vidPlaying) {
                                    setPausedByUser(true)
                                    setVidPlaying(false)
                                } else {
                                    setVidPlaying(true)
                                }
                                e.stopPropagation();
                            }}
                            opacity={0.4}
                            _hover={{
                                background: "black",
                                color: "white",
                                opacity: 1
                            }}
                            >
                            {vidPlaying ? "Playing" : "Pauzed"}
                        </Button>
                    <Text
                        textTransform="uppercase"
                        fontWeight="bold"
                        fontSize="0.7rem"
                        >
                        For sharing
                    </Text>
                    <Controls
                        block={block}
                        />
                        
                    </div>
                </div>
        </div>
    )
}

const expectedBlockProperties = [
    "vid_key",
    "spaces_url"
]

export const DataBlockDynamic = ({
    block_key,
    autoPlayOnLoad = false
}) => {
    const { data, error } = useSWR(`/api/data_block?vid_key=${block_key}`, fetcher)
    if (error) return <div>Failed to load block: {block_key}</div>
    if (!data) return <div>loading...</div>
    var dataDocs = _.get(data, "docs", [])
    if (dataDocs.length === 0) return <div>No block found with key: {block_key}</div>
    var block = _.first(dataDocs)

    return (
        <DataBlock block={block} autoPlayOnLoad={autoPlayOnLoad} />
    )
}

export default DataBlock