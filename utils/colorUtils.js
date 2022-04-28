import _ from "lodash"

export function secureChromaToCssColor(c) {
    if (_.has(c, "_rgb")) {
        return c.hex()
    } else if(_.isString(c)) {
        return c
    } else {
        return "rgb(255,0,0)"
    }
}