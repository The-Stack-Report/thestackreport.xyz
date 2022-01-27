import _ from "lodash"

export default function getStillFrame(block) {
    var stills = _.get(block, "stills", [])
    var previewStillFrame = false
    if(_.isArray(stills) && stills.length > 0) {
        previewStillFrame = stills[0]
    }
    var stillUrl = _.get(previewStillFrame, "spaces_url", false)
    if(stillUrl === null) {
        stillUrl = false
    }
    return stillUrl
}