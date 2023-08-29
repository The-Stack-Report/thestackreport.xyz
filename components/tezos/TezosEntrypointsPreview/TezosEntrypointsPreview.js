import React, { useEffect, useState } from "react"
import {
    Box,
    Text,
    useBreakpointValue
} from "@chakra-ui/react"
import { Link } from "@chakra-ui/next-js"
import TezosEntrypointCard from "components/tezos/TezosEntrypointCard"
import loadDataset from "utils/hooks/loadDataset"
import * as d3 from "d3"
import _ from "lodash"

const TezosEntrypointsPreview = ({
    providedData = false,
    highlightWords = []
    }) => {
    const [showing, setShowing] = useState(1)

    const PREVIEW_COUNT = useBreakpointValue({
        base: 6,
        md: 6,
        lg: 15,
        xl: 25
    }, {
        fallback: 15
    })
    var {
        loading,
        loadingError,
        dataset,
        cardWidth = {base: "12rem"},
        data
    } = loadDataset({
        identifier: "the-stack-report--tezos-entrypoints-rich-statistics-index",
        shouldLoad: providedData ? false : true
    }, (rawText) => {
        var parsedData = d3.csvParse(rawText)
        parsedData = parsedData.map((row) => {
            row["transactions"] = _.toInteger(row.transactions)
            row["senders"] = _.toInteger(row.senders)
            row["targets"] = _.toInteger(row.targets)
            row["wallet_senders"] = _.toInteger(row.wallet_senders)
            row["contract_senders"] = _.toInteger(row.contract_senders)
            if(row["transactions"] === 0) row["transactions"] = false
            if(row["senders"] === 0) row["senders"] = false
            if(row["targets"] === 0) row["targets"] = false
            return row
        })
        parsedData = _.sortBy(parsedData, "transactions").reverse()
        return parsedData
    })
    
    var showData = []
    if(providedData) {
        showData = providedData.slice(0, PREVIEW_COUNT)
    } else {
        if(_.isArray(data) && data.length > 10) {
            showData = data.slice(0, PREVIEW_COUNT)
        } 
    }
    showData = showData.filter(p => p !== false)
    var showingValues = showing
    if (showingValues > PREVIEW_COUNT) {
        showingValues = PREVIEW_COUNT
    }
    if(showingValues > showData.length) {
        showingValues = showData.length
    }
    showData = showData.slice(0, 100)
    return (
        <Box>
            <Box
                display="flex"
                gap="1rem"
                flexWrap={"wrap"}
                marginBottom="4rem"
                >
                {showData.map((entrypoint, i) => {
                    return (
                        <TezosEntrypointCard
                            key={entrypoint.entrypoint}
                            entrypoint={entrypoint.entrypoint}
                            entrypointData={entrypoint}
                            cardWidth={cardWidth}
                            loadDataDelay={i * 100}
                            highlightWords={highlightWords}
                            />
                    )
                })}
            </Box>
        </Box>
    )
}

export default TezosEntrypointsPreview