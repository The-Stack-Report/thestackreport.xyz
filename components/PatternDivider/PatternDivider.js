import React from "react"
import {
    PatternLines
} from "@visx/pattern"
import {
    Box
} from "@chakra-ui/react"
import {
    Bar
} from "@visx/shape"
import _ from "lodash"

const defaultMargin = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
}

const PatternDivider = ({
    marginTop =    90,
    marginBottom = 90,
    patternHeight = 10,
    color = 'rgb(200,200,200)'
}) => {
    const uniq_id = _.uniqueId()
    return (
        <Box marginTop={marginTop} marginBottom={marginBottom}>
            <svg width="100%" height={patternHeight}>
            <PatternLines
                id={`pattern-line-divider-${uniq_id}`}
                height={7}
                width={7}
                stroke={color}
                strokeWidth={1}
                orientation={['diagonal']}
                />
            <Bar
                fill={`url(#pattern-line-divider-${uniq_id})`}
                height={patternHeight}
                width={"100%"}
                rx={patternHeight / 2}
                />
            </svg>
        </Box>
    )
}

export default PatternDivider