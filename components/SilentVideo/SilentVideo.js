import React from "react"

const SilentVideo = ({ src, type="video/mp4" }) => {
    return (
        <video
            width={"100%"}
            controls={false}
            muted={true}
            autoPlay={true}
            loop={true}
            >
            <source src={src} type={type} />
        </video>
    )
}

export default SilentVideo