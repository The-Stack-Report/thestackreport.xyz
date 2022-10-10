import React, { useState, useEffect, useMemo, useContext } from "react"
import {
    Box,
    Text,
    Editable,
    EditableInput,
    EditableTextarea,
    EditablePreview,
    useColorModeValue,
    IconButton,
    Input,
    useDisclosure,
    useEditableControls,
    ButtonGroup,
    SlideFade,
    Tooltip
} from "@chakra-ui/react"
import {
    CheckIcon,
    CloseIcon,
    DeleteIcon
} from "@chakra-ui/icons"
import _ from "lodash"
import styles from "./Note.module.scss"
import { ChartContext } from "components/Charts/Chart/Chart"

const EditableControls = ({ setIsEditing, revertNote }) => {
    const {
        isEditing,
        getSubmitButtonProps,
        getCancelButtonProps,
        getEditButtonProps
    } = useEditableControls()

    useEffect(() => {
        setIsEditing(isEditing)
    }, [isEditing])

    return isEditing ? (
        <Box
            position="absolute"
            width="140px"
            left="5px"
            top="0px"
            pointerEvents="initial"
            background="white"
            border="0px solid transparent"
            padding="0px"
            zIndex={100}
            borderRadius="2px"
            >
            <ButtonGroup justifyContent="end" size="xs" w="full" spacing={2} paddingLeft="5px" paddingRight="5px">
                <Tooltip label="Save" fontSize="0.7rem">
                <IconButton height="22px" padding="0px" marginBottom="0px" variant="outline" fontSize="0.6rem" background="white" size="xs" icon={<CheckIcon />} {...getSubmitButtonProps()} />
                </Tooltip>
                <Tooltip label="Revert" fontSize="0.7rem">
                <IconButton height="22px" padding="0px" marginBottom="0px" variant="outline" fontSize="0.6rem" background="white" size="xs" icon={<CloseIcon />} {...getCancelButtonProps()} />
                </Tooltip>
                <Tooltip label="Delete" fontSize="0.7rem">
                <IconButton height="22px" padding="0px" marginBottom="0px" variant="outline" fontSize="0.6rem" background="white" size="xs" icon={<DeleteIcon />} />
                </Tooltip>
            </ButtonGroup>
        </Box>
    ) : null
}

const ChartNote = ({ note }) => {
    const chartContext = useContext(ChartContext)
    const [hovered, setHovered] = useState(false)
    const [editedNoteText, setEditedNoteText] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const isEditable = useMemo(() => {
        // get current wallet account
        // check if wallet account is authorized to access interpretation layer
        // check if wallet account is owner of current note
        return true
        return false
    })

    var editableValue = useMemo(() => {
        if (editedNoteText !== false) {
            return editedNoteText
        } else {
            return note.note
        }
    }, [note.note, editedNoteText])
    

    var noteEdited = useMemo(() => {
        return note.note !== editableValue
    }, [note.note, editableValue])

    // Define rendering
    var noteLineColor = note.noteLineColor
    var topPos = `${-note.size.height + note.position.y}px`



    var groupOpacity = 1

    var hoverLineColor = `black`
    var noteType = _.get(note, "noteSource", "")
    var fontStyle = "normal"
    var borderStyle = "solid"

    var notePointerEvents = "initial"

    var groupZIndex = -3 - note.layer

    if(noteType === "preview") {
        noteLineColor = "rgb(100,100,125)"
        fontStyle = "italic"
        borderStyle = "dashed"
    }

    if(noteType === "initialized") {
        fontStyle = "italic"
    }

    if (noteEdited) {
        fontStyle = "italic"
    }
    console.log(_.get(note, "id"), isEditing)
    if(isEditing) {
        groupZIndex = 100
    }
    console.log(chartContext.editingNote)

    var otherNoteIsBeingEdited = useMemo(() => {
        if(chartContext.editingNote) {
            return chartContext.editingNote !== _.get(note, "id")
        } else {
            return false
        }
    }, [chartContext, note])

    if(otherNoteIsBeingEdited) {
        groupOpacity = 0.4
        notePointerEvents = "none"
    }

    var characterLimit = 50

    return (
        <Box role="group" className={styles['note-group']} opacity={groupOpacity}>
        <Box
            position="absolute"
            left={`${note.position.x}px`}
            top={topPos}
            zIndex={groupZIndex}
            className={styles["note-position-container"]}
            _groupHover={{
                zIndex: groupZIndex > -2 ? groupZIndex : -2
            }}
            pointerEvents={notePointerEvents}
            >
                <Text
                    opacity={isEditing ? 1 : 0}
                    position="absolute"
                    top={`-12px`}
                    left="0rem"
                    left="right"
                    fontWeight="bold"
                    fontSize="0.6rem"
                    color="black"
                    zIndex={-3}
                    background="white"
                    >
                    {editableValue.length}{`/${characterLimit}`}
                </Text>
                {noteType === "initialized" && (
                    <Text
                        opacity={1}
                        position="absolute"
                        top={`-13px`}
                        right="0rem"
                        textAlign="right"
                        fontSize="0.6rem"
                        color="gray.500"
                        background="white"
                        zIndex={-3}
                        >
                        Initialized
                    </Text>
                )}
                
            <Box
                width={`${note.size.width}px`}
                height={note.size.height}
                background="white"
                border={`1px solid ${noteLineColor}`}
                fontSize="0.7rem"
                padding="1px"
                paddingLeft={`${note.notePadding}px`}
                paddingRight={`${note.notePadding}px`}
                zIndex={-2}
                pointerEvents={notePointerEvents}
                cursor="pointer"
                borderStyle={borderStyle}
                overflow="visible"
                _hover={{
                    border: `1px solid ${hoverLineColor}`
                }}
                onPointerDown={() => {

                }}
                >
                <Text
                    opacity={0}
                    position="absolute"
                    top={`${note.size.height-10}px`}
                    right="-0rem"
                    width="200px"
                    pointerEvents="none"
                    textAlign="right"
                    fontWeight="bold"
                    fontSize="0.6rem"
                    className={styles['note-source-label']}
                    color="gray.500"
                    _groupHover={{
                        opacity: 1,
                        top: `${note.size.height}px`
                    }}
                    >
                    SRC: {_.toUpper(noteType)}
                </Text>
                
                {isEditable ? (
                    <Editable
                        defaultValue={note.note}
                        value={editableValue}
                        borderRadius={0}
                        onChange={(newNoteValue) => {
                            var trimmed = newNoteValue
                            if (newNoteValue.length < characterLimit + 1) {
                                setEditedNoteText(trimmed)
                                if(_.has(note, "id")) {
                                    var prevEditedNotesFromContext = _.cloneDeep(chartContext.editedNotes)
                                    prevEditedNotesFromContext[note.id] = trimmed
                                    chartContext.setEditedNotes(prevEditedNotesFromContext)
                                }
                            }
                            
                        }}
                        onSubmit={() => {
                            console.log("submitted")

                        }}
                        onCancel={() => {
                            console.log("canceled")
                            setEditedNoteText(note.note)
                            if(_.has(note, "id")) {
                                var prevEditedNotesFromContext = _.cloneDeep(chartContext.editedNotes)
                                if(_.has(prevEditedNotesFromContext, note.id)) {
                                    delete prevEditedNotesFromContext[note.id]
                                    chartContext.setEditedNotes(prevEditedNotesFromContext)
                                }
                            }
                        }}
                        >
                        <EditablePreview
                            fontStyle={fontStyle}
                            fontSize="0.7rem"
                            marginTop="-1px"
                            minWidth="20px"
                            whiteSpace="nowrap"
                            />
                        <Input
                            py={0}
                            px={0}
                            as={EditableInput}
                            size="xs"
                            outline="0px solid transparent"
                            outlineOffset="0px"
                            border="0px solid transparent"
                            boxShadow="0px"
                            fontStyle={fontStyle}
                            fontSize="0.7rem"
                            position="relative"
                            marginTop="-1px"
                            whiteSpace="nowrap"
                            zIndex={1}
                            _focus={{
                                border: "0px solid transparent",
                                marginTop: "-1.5px",
                                boxShadow: "none",
                                fontSize: "0.7rem",
                                outline: "none"
                            }}
                            />
                        <Box
                            position="absolute"
                            left="100%"
                            top="0px"
                            >
                        <EditableControls
                            setIsEditing={(_editing) => {
                                setIsEditing(_editing)
                                if(_editing) {
                                    chartContext.setEditingNote(_.get(note, 'id'))
                                } else {
                                    chartContext.setEditingNote(false)
                                }
                            }}
                            revertNote={() => {
                                

                            }}
                            />
                        </Box>
                    
                    </Editable>
                ) : (
                    <Text
                        margin="0px"
                        padding="0px"
                        fontStyle={fontStyle}
                        >
                        {note.note}
                    </Text>
                )}
                
                </Box>
                <Box
                    height={`${note.lineHeight}px`}
                    width="2px"
                    borderStyle={borderStyle}
                    border="0px solid transparent"
                    borderLeft={`2px solid ${noteLineColor}`}
                    background="transparent"
                    position="absolute"
                    left="-1px"
                    top="-0px"
                    zIndex={-1}
                    _groupHover={{
                        borderLeft: `2px solid ${hoverLineColor}`
                    }}
                    >

                </Box>
            </Box>
        </Box>
    )
}

export default ChartNote