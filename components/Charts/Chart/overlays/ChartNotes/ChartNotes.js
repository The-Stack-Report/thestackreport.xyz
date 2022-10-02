import React from "react"
import { INTERPRETATION_LAYER_CHART_NOTES } from "constants/feature_flags"
import Note from "./Note"
import {
    Box
} from "@chakra-ui/react"

const ChartNotes = ({ notes, xScale, yScale }) => {


    // TODO: Implement collision detection for notes
    var notesWithPosition = notes.map((note, note_i) => {
        var notePadding = 5
        var charWidth = 7
        var noteWidth = notePadding * 2 + note.note.length * charWidth
        var nodePos = 6
        return {
            ...note,
            position: {
                x: xScale(note.date),
                y: 0
            },
            noteLineColor: "rgb(220,220,220)",
            notePadding: notePadding,
            size: {
                width: noteWidth,
                height: `${22}px`
            }
        }
    })

    return (
        <>
        {INTERPRETATION_LAYER_CHART_NOTES  && (
            <Box position="absolute">
            {notesWithPosition.map((note, note_i) => {
                
                return (
                    <Note note={note} key={note_i} />
                )
            })}
            </Box>
        )}
        </>
    )
}

export default ChartNotes