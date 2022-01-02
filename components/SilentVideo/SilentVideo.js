import React, { useState, useEffect, useRef } from "react"
var silentVideoRenderedCounter = 0
// First count nr of videos rendered on page
const margin = 20

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
        play_when_in_page=true
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

    var vidStyle = {
        // border: "1px solid blue",
        minHeight: "81%" // TODO: Make dynamic based on video aspect ratio
    }
    if(onScreen) {
        // vidStyle.border = "1px solid rgb(255,155,0)"
    }
    return (
        <video
            ref={vidRef}
            width={"100%"}
            controls={false}
            muted={true}
            autoPlay={true}
            loop={true}
            playsInline={true}
            style={vidStyle}
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
    )
}

export default SilentVideo