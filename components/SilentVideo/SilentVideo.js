import React, { useState, useEffect, useRef } from "react"
import _ from "lodash"
var silentVideoRenderedCounter = 0
// First count nr of videos rendered on page
const margin = -100

function vidWindowOverlap(vidRef, scrollTop) {
    const bounds = vidRef.current.getBoundingClientRect()
    return _.some([
        _.inRange(bounds.top, margin, window.innerHeight - margin),
        _.inRange((bounds.top + bounds.height), margin, window.innerHeight - margin)
    ])
}

const SilentVideo = ({
        src,
        type="video/mp4",
        autoplay=true,
        play_on_hover=true,
        play_when_in_page=true,
        resolution=false
    }) => {
    const containerRef = useRef(null)
    const vidRef = useRef(null)
    const [initialized, setInitialized] = useState(false)
    const [delayedLoad, setDelayedLoad] = useState(false)
    const [scrollTop, setScrollTop] = useState(-1)
    const [scrolling, setScrolling] = useState(false)
    const [onScreen, setOnScreen] = useState(false)
    const [playing, setPlaying] = useState(false)
    const [loadCheckCounter, setLoadCheckCounter] = useState(0)
    
    useEffect(() => {
        if(initialized === false) {
            setInitialized(true)
            setTimeout(() => {
                setDelayedLoad(true)
                setScrollTop(document.documentElement.scrollTop)
                setOnScreen(vidWindowOverlap(containerRef, document.documentElement.scrollTop))
            }, silentVideoRenderedCounter * 100)
            silentVideoRenderedCounter += 1
        }
    }, [initialized])

    useEffect(() => {
        const onScroll = e => {
          setScrollTop(e.target.documentElement.scrollTop);
          setScrolling(e.target.documentElement.scrollTop > scrollTop);
          setOnScreen(vidWindowOverlap(containerRef, scrollTop))
        };
        window.addEventListener("scroll", onScroll);
    
        return () => window.removeEventListener("scroll", onScroll);
      }, [scrollTop]);
    
    useEffect(() => {
        if(_.isNull(vidRef.current) && vidWindowOverlap(containerRef, scrollTop)) {
            setTimeout(() => {
                setLoadCheckCounter(loadCheckCounter + 1)
            }, 100 + Math.random() * 500)
        } else if(!_.isNull(vidRef.current) && playing === false) {
            var player = vidRef.current
            player.controls = false
            player.playsinline = true
            player.muted = true
            player.setAttribute("muted", "")
            player.autoplay = true
            player.load()
            setTimeout(() => {
                const promise = player.play()
            }, 10 + Math.random() * 10)
            setPlaying(true)
            
            // vidRef.current.play()
        }
    }, [vidRef, playing, scrollTop, loadCheckCounter])

    var state_src = false
    if(delayedLoad && onScreen){
        state_src = src
    }
    var height = "50%"
    if(resolution) {
        height = _.get(containerRef, "current.clientWidth", 100) * resolution.height/resolution.width
    }
    return (
        <div style={{
                width: "100%",
                height: height,
                overflow: "hidden",
            }}
            onPointerEnter={() => {
                if(play_on_hover) {
                    setDelayedLoad(true)
                }
            }}
            ref={containerRef}
            >
            {state_src && (
            <video
                ref={vidRef}
                width={"100%"}
                height={height}
                controls={false}
                muted={true}
                autoPlay={true}
                loop={true}
                playsInline={true}
                
                >
                <source src={state_src} type={type} />
            </video>
            )}
        </div>
    )
}

export default SilentVideo