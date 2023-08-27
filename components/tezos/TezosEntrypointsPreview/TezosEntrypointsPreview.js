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


    useEffect(() => {
        const interval = setInterval(() => {
            setShowing(showing => showing + 1)
        }, 50);
        return () => clearInterval(interval);
    }, []);

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
    } = loadDataset("the-stack-report--tezos-entrypoints-index", (rawText) => {
        var parsedData = d3.csvParse(rawText)
        return parsedData
    })
    
    var showData = []
    if(providedData) {
        showData = providedData.slice(0, PREVIEW_COUNT)
    } else {
        if(_.isArray(data) && data.length > 10) {
            showData = data.slice(0, PREVIEW_COUNT).map(p => p.Entrypoint)
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

    

    return (
        <Box>
            <Box
                display="flex"
                gap="1rem"
                flexWrap={"wrap"}
                marginBottom="4rem"
                >
                {showData.slice(0, showingValues).map((entrypoint, i) => {
                    return (
                        <TezosEntrypointCard
                            key={entrypoint ? entrypoint : `i_${i}`}
                            entrypoint={entrypoint}
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