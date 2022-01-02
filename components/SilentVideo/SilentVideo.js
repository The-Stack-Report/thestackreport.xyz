import React, { useState, useEffect, useRef } from "react"
import _ from "lodash"
var silentVideoRenderedCounter = 0
// First count nr of videos rendered on page
const margin = -20

function vidWindowOverlap(vidRef, scrollTop) {
    return (
        _.inRange(vidRef.current.offsetTop - scrollTop, margin, window.innerHeight - margin) ||
        _.inRange((vidRef.current.offsetTop + vidRef.current.clientHeight) - scrollTop, margin, window.innerHeight - margin)
        ) 
}

const SilentVideo = ({
        src,
        type="video/mp4",
        autoplay=true,
        play_on_hover=true,
        play_when_in_page=true,
        resolution=false
    }) => {
    const vidRef = useRef(null)
    const [initialized, setInitialized] = useState(false)
    const [delayedLoad, setDelayedLoad] = useState(false)
    const [scrollTop, setScrollTop] = useState(-1)
    const [scrolling, setScrolling] = useState(false)
    const [onScreen, setOnScreen] = useState(false)
    
    useEffect(() => {
        if(initialized === false) {
            setInitialized(true)
            setTimeout(() => {
                setDelayedLoad(true)
                setScrollTop(document.documentElement.scrollTop)
                setOnScreen(vidWindowOverlap(vidRef, document.documentElement.scrollTop))
            }, silentVideoRenderedCounter * 100)
            silentVideoRenderedCounter += 1
        }
    })
    useEffect(() => {
        const onScroll = e => {
          setScrollTop(e.target.documentElement.scrollTop);
          setScrolling(e.target.documentElement.scrollTop > scrollTop);
          setOnScreen(vidWindowOverlap(vidRef, scrollTop))
        };
        window.addEventListener("scroll", onScroll);
    
        return () => window.removeEventListener("scroll", onScroll);
      }, [scrollTop]);

    var state_src = false
    if(delayedLoad && onScreen){
        state_src = src
    }
    var height = "50%"
    if(resolution) {
        height = _.get(vidRef, "current.clientWidth", 100) * resolution.height/resolution.width
    }
    return (
        <div style={{
            width: "100%",
            height: height,
            overflow: "hidden"
        }}>
            <video
                ref={vidRef}
                width={"100%"}
                height={height}
                controls={false}
                muted={true}
                autoPlay={true}
                loop={true}
                playsInline={true}
                onPointerEnter={() => {
                    if(play_on_hover) {
                        setDelayedLoad(true)
                    }
                }}
                >
                    {state_src && (
                        <source src={state_src} type={type} />
                    )}
                
            </video>
        </div>
    )
}

export default SilentVideo