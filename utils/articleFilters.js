import _ from "lodash"

export function filterPreviewMode(article) {
    var previewMode = _.get(article, "attributes.preview", false)
    var envIsDevelopment = process.env.ENVIRONMENT === "development"
    if(envIsDevelopment) {
        return true
    } else {
        return !previewMode
    }
}