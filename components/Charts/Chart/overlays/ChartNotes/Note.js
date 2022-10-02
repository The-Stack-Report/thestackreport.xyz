import React from "react"
import {
    Box,
    Text
} from "@chakra-ui/react"

const ChartNote = ({ note }) => {
    var noteLineColor = note.noteLineColor
    return (
        <Box position="absolute"
            left={`${note.position.x}px`}
            top={`calc(-${note.size.height} - 5px)`}
            >
            <Box
            width={note.size.width}
            height={note.size.height}
            background="white"
            border="1px solid rgb(220,220,220)"
            fontSize="0.7rem"
            padding="1px"
            paddingLeft={`${note.notePadding}px`}
            paddingRight={`${note.notePadding}px`}
            zIndex={-2}
            >
            <Text margin="0px" padding="0px">{note.note}</Text>
            </Box>
            <Box
                height="125px"
                width="2px"
                background={`${noteLineColor}`}
                position="absolute"
                left="-1px"
                top="-0px"
                zIndex={-1}
                >

            </Box>
        </Box>
    )
}

export default ChartNote