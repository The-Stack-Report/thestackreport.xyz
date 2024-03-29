import React, { useState, useEffect, useMemo } from "react"
import {
    Box,
    Text
} from "@chakra-ui/react"
import _ from "lodash"
import * as d3 from "d3"
import prepareDf from "utils/data/prepareDf"
import Chart from "components/Charts/Chart"
import { Link } from "@chakra-ui/next-js"
import { chartCMSProps } from "constants/cms"

const ChartLoader = ({
    chart,
    ...props
}) => {
    const [data, setData] = useState(false)
    const [dataset, setDataset] = useState(false)
    const [dataLoading, setDataLoading] = useState(false)
    const [dataLoadError, setDataLoadError] = useState(false)

    useEffect(() => {
        if(data === false && dataLoading === false) {
            setDataLoading(true)
            var url = _.get(chart, "dataset_url", false)
            if(_.isString(url)) {
                fetch(url).then(resp => {
                    if(resp.status === 200) {
                        return resp.text()
                    } else {
                        console.log('error loading data: ', resp)
                        setDataLoadError(resp.status)
                    }
                }).then(respText => {
                    var fileType = "csv"
                if(!_.isString(respText)) {
                    console.log("response data text is not text...")
                    console.log(respText)
                } else {
                    if(respText.startsWith("{") || respText.startsWith("[")) {
                        fileType = "json"
                    }
                    var fileData = []
                    if(fileType == "csv") {
                        fileData = d3.csvParse(respText)
                        var nrCols = _.keys(_.first(fileData)).filter(c => c !== "date")

                        var parsedData = prepareDf(
                            fileData,
                            ["date"],
                            nrCols
                        )
                        setData(parsedData)
                        setDataLoading(false)
                    }
                    }
                })
            }
        }
    }, [chart, data, dataLoading])

    var showState = "chart"
    if(data === false && dataLoading === false) {
        showState = "initial"
    } else if(data === false && dataLoading === true) {
        showState = "loading-data"
    } else if(data && dataLoading === false) {
    }

    var noteEditingEnabled = false
    var chartId = false
    if(_.has(chart, "slug")) {
        noteEditingEnabled = true
        chartId = chart.slug
    }

    var chartProps = {
        data: data,
        chartId: chartId,
        noteEditingEnabled: noteEditingEnabled
    }

    chartCMSProps.forEach(prop => {
        var providedProp = _.get(chart, prop.CMS_key, false)
        if(providedProp !== undefined && providedProp !== null && providedProp !== false) {
            var prepFunction = _.get(prop, "prepFunction", false)
            if(_.isFunction(prepFunction)) {
                chartProps[prop.propKey] = prepFunction(providedProp)
            } else {
                chartProps[prop.propKey] = providedProp
                if(_.isNull(chartProps[prop.propKey])) {
                    chartProps[prop.propKey] = false
                }
            }
        }
    })

    // Add chart loader props
    chartProps = {
        ...chartProps,
        ...props
    }
    
    return (
        <Box>
            {showState === "initial" && (
                <Box
                    height={_.get(props, "height", 400)}
                    border={"1px solid grey"}
                    >
                    {_.get(chart, "name", "")}
                </Box>
            )}
            {showState === "loading-data" && (
                <Box
                    height={_.get(props, "height", 400)}
                    border={"1px solid grey"}
                    >
                </Box>
            )}
            {showState === "chart" && (
                <Box>
                    
                    <Chart
                        {...chartProps}
                        />
                    <Text
                        color="gray.500"
                        fontSize="0.7rem"
                        textAlign="right"
                        position="relative"
                        top="0px"
                        zIndex="100"
                        >
                        Chart:{" "}
                        <Link href={`/charts/${_.get(chart, "slug", "not-found")}`}>
                            {`#${_.get(chart, "slug", "not-found")}`}
                        </Link>
                    </Text>
                </Box>
            )}
        </Box>
    )
}

export default ChartLoader