import _ from "lodash"
import chroma from "chroma-js"

// export const CMS_URL = "https://the-stack-report-cms-y5pxm.ondigitalocean.app/api"
export const CMS_URL = process.env.CMS_URL

export const NEXT_PUBLIC_CMS_URL = process.env.NEXT_PUBLIC_CMS_URL

export var placeholderImg = "https://the-stack-report.ams3.digitaloceanspaces.com/website_assets/Article_missing_img.png"


export const chartCMSProps = [
    {
        CMS_key: "x_key",
        propKey: "xKey"
    },{
        CMS_key: "columns",
        propKey: "columns"
    },{
        CMS_key: "type",
        propKey: "type"
    },{
        CMS_key: "color",
        propKey: "color",
        prepFunction: (c) => {
            if(_.isString(c)) {
                return c
            } else if(_.isArray(c)) {
                return chroma.scale(c)
            } else {
                return "rgb(150,150,150)"
            }
        }
    },{
        CMS_key: "badges_legend",
        propKey: "badgesLegend"
    },{
        CMS_key: "badges_legend_text",
        propKey: "badgesLegendText"
    },{
        CMS_key: "name",
        propKey: "name",
    }
]