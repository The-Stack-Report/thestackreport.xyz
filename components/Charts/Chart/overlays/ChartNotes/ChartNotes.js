import React from "react"
import { INTERPRETATION_LAYER_CHART_NOTES } from "constants/feature_flags"
import Note from "./Note"
import {
    Box
} from "@chakra-ui/react"
import _ from "lodash"

function overlaps(box1, box2, padding=3) {
    return _.some([
        _.inRange(box1.position.x - padding, box2.position.x, box2.position.x + box2.size.width),
        _.inRange(box1.position.x + box1.size.width - padding, box2.position.x, box2.position.x + box2.size.width)
    ])
}


function checkNoteCollisions(inputNote, collisionNotes) {
    return _.some(collisionNotes.map(n => overlaps(inputNote, n)))
}

const ChartNotes = ({ notes, xScale, yScale, chart, editedNotes }) => {


    // TODO: Implement collision detection for notes

    var layers = _.range(5).map(v => {
        return {
            layer: v,
            notes: []
        }
    })

    var notesWithPosition = notes.map((note, note_i) => {
        var notePadding = 5
        var charWidth = 6.75

        var noteText = note.note

        if(_.has(note, "id")) {
            if(_.has(editedNotes, note.id)) {
                noteText = editedNotes[note.id]
            }
        }

        var noteTextLength = noteText.length
        if(noteTextLength < 3) {
            noteTextLength = 3
        }

        
        var noteWidth = 4 + notePadding * 2 + noteTextLength * charWidth

        var nodePos = 6

        var yPos = -5

        var noteHeight = 22

        return {
            ...note,
            position: {
                x: xScale(note.date),
                y: yPos
            },
            noteLineColor: "rgb(220,220,220)",
            notePadding: notePadding,
            size: {
                width: noteWidth,
                height: 22
            },
            lineHeight: Math.abs(yPos) + chart.height + noteHeight
        }
    })

    // Add stacking layers
    notesWithPosition = _.sortBy(notesWithPosition, "position.x")
    notesWithPosition.forEach((note, note_i) => {
        var layer = 0

        while (checkNoteCollisions(note, layers[layer].notes) && layer < 4) {
            layer += 1
        }

        layers[layer].notes.push(note)
        note.layer = layer
        note.position.y -= layer * 25

        note.lineHeight += layer * 25
    })

    return (
        <>
        {INTERPRETATION_LAYER_CHART_NOTES  && (
            <Box position="absolute">
            {notesWithPosition.map((note, note_i) => {
                return (
                    <Note note={note} key={note.id} />
                )
            })}
            </Box>
        )}
        </>
    )
}

export default ChartNotes