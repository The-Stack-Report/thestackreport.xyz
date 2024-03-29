import { Box, Text } from "@chakra-ui/react"
import { Link } from "@chakra-ui/next-js"
import React from "react"
import _ from "lodash"

const ChartNotesList = ({
    notes
}) => {
    console.log("chart notes list: ", notes)
    return (
        <Box paddingTop="2rem">
            {notes.map((note, index) => {
                var targetChart = note.chartId
                var targetUrl = `charts/${targetChart}`
                if(targetChart.startsWith("KT1")) {
                    targetUrl = `dashboards/tezos/contracts/${targetChart.slice(0, 36)}`
                }
                return (
                    <Box key={index} paddingBottom="2rem">
                        <Box display="flex">
                            <Text border="1px solid grey" fontSize="0.8rem" paddingLeft="0.5rem" paddingRight="0.5rem" width="fluid" >
                            {note.note}
                            </Text>
                        </Box>
                        <Text fontSize='0.8rem' color="grey">
                            Placed on <Link href={targetUrl}>{_.last(targetUrl.split("/"))}</Link>
                        </Text>
                    </Box>
                )
            })}
        </Box>
    )
}

export default ChartNotesList