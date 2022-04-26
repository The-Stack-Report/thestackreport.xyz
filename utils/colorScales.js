import chroma from "chroma-js"

export var blueScale = chroma.scale([
    "rgb(100,100,250)",
    "rgb(255,100,255)"
])


export var redScale = chroma.scale([
    "rgb(0,0,50)",
    "rgb(100,0,120)"
])


export function gridScale(t) {
    return chroma.scale([
        blueScale(t),
        redScale(t)
    ])
}