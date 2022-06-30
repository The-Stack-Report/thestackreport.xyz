import React, { useState, useEffect } from "react"
import {
    Box
} from "@chakra-ui/react"
import { NEXT_PUBLIC_CMS_URL } from 'constants/cms'
import _ from "lodash"
import ChartLoader from "components/Charts/ChartLoader"
import prepareChartMetadata from "utils/prepareChartMetadata"

const ChartBySlug = ({
    slug,
    chartProps = {}
}) => {
    const [chartData, setChartData] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loadError, setLoadError] = useState(false)
    useEffect(() => {
        if(chartData === false && isLoading === false) {
            var fetchUrl = NEXT_PUBLIC_CMS_URL + `/charts?filters[slug][$eq]=${slug}&populate=*`
            fetch(fetchUrl).then(resp => {
                if(resp.status === 200) {
                    return resp.json()
                } else {
                    console.log("error loading chart: ", slug, resp)
                }
            }).then(data => {
                var chart = _.get(data, "data[0].attributes", false)
                chart = prepareChartMetadata(chart)
                setChartData(chart)
            })
        }
    }, [slug, chartData, isLoading])
    return (
        <Box>
            {chartData && (
                <ChartLoader
                    chart={chartData}
                    timelineBrush={true}
                    {...chartProps}
                    />
            )}
        </Box>
    )
}

export default ChartBySlug