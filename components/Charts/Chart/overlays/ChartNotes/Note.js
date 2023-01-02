import React, { useState, useEffect, useMemo, useContext } from "react"
import {
    Box,
    Text,
    Editable,
    EditableInput,
    EditablePreview,
    Input,
} from "@chakra-ui/react"

import _ from "lodash"
import styles from "./Note.module.scss"
import { ChartContext } from "components/Charts/Chart/Chart"
import { WalletContext } from "components/Wallet/WalletContext"
import EditableControls from "./EditableControls"


/**
 * Chart note
 */
const ChartNote = ({ note }) => {
    const chartContext = useContext(ChartContext)
    const walletContext = useContext(WalletContext)
    const [hovered, setHovered] = useState(false)
    const [editedNoteText, setEditedNoteText] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const isEditable = useMemo(() => {
        const currentAccount = _.get(walletContext, "address", "no-logged-in-address")
        const noteOwner = _.get(note, "owner", "no-note-owner-set")
        return currentAccount === noteOwner
    }, [note, walletContext])

    const isCurated = useMemo(() => {
        const noteVisibility = _.get(note, "visibility", false)
        return noteVisibility === "curated"
    }, [note])

    const isStorable = useMemo(() => {
        // Account has interpretation layer access token.
        const hasBetaAccess = _.get(walletContext, "hasBetaAccess", false)
        return isEditable && hasBetaAccess && !isCurated
    }, [isEditable, walletContext, isCurated])


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
    if(isEditing) {
        groupZIndex = 100
    }

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

    var noteBoxLeft = 0

    var notePosition = note.position.x

    if(note.labelAlignment==="end") {
        // noteBoxLeft = -note.size.width
        notePosition = note.position.x - note.size.width
    }

    var visibility = _.get(note, "visibility", "not-set")

    return (
        <Box role="group" className={styles['note-group']} opacity={groupOpacity}>
        <Box
            position="absolute"
            left={`${notePosition}px`}
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
                position="relative"
                left={noteBoxLeft}
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
                    {_.toUpper(visibility)}
                </Text>
                
                {isEditable ? (
                    <Editable
                        defaultValue={note.note}
                        value={editableValue}
                        borderRadius={0}
                        onChange={(newNoteValue) => {
                            if(!isCurated) {
                                var trimmed = newNoteValue
                                if (newNoteValue.length < characterLimit + 1) {
                                    setEditedNoteText(trimmed)
                                    if(_.has(note, "id")) {
                                        var prevEditedNotesFromContext = _.cloneDeep(chartContext.editedNotes)
                                        prevEditedNotesFromContext[note.id] = trimmed
                                        chartContext.setEditedNotes(prevEditedNotesFromContext)
                                    }
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
                            left="0px"
                            top="0px"
                            >
                        <EditableControls
                            leftPos={note.labelAlignment==="end" ? `-150px` : `${note.size.width}px`}
                            isCurated={isCurated}
                            setIsEditing={(_editing) => {
                                setIsEditing(_editing)
                                if(_editing) {
                                    chartContext.setEditingNote(_.get(note, 'id'))
                                } else {
                                    chartContext.setEditingNote(false)
                                }
                            }}
                            isStorable={isStorable}
                            noteType={noteType}
                            
                            storeCallback={() => {
                                const accountAddress = _.get(walletContext, "address", false)
                                const betaAccessContract = _.get(walletContext, "decodedJwt.decodedIdToken.beta_access.contractAddress", false)
                                var betaAccessNft = _.get(walletContext, "decodedJwt.decodedIdToken.beta_access.tokens[0]", false)
                                var betaAccessNft = _.toNumber(betaAccessNft)

                                var accessToken = _.get(walletContext, "userAccessToken.accessToken", false)

                                note.note = editedNoteText
                                if(accountAddress && betaAccessContract && betaAccessNft && accessToken) {
                                    var reqBody = {
                                        "accountAddress": accountAddress,
                                        "betaAccessContract": betaAccessContract,
                                        "betaAccessToken": betaAccessNft,
                                        "note": note
                                    }

                                    const bearerAuth = `Bearer ${accessToken}`


                                    fetch("/api/chart_note", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "authorization": bearerAuth,
                                        },
                                        body: JSON.stringify(reqBody)
                                    }).then(resp => {
                                        // Todo: Update cached note with db ID

                                        if(resp.status === 200) {
                                            resp.json().then(json => {
                                                const dbId = _.get(json, "insertedId", false)
                                                var updatedNote = {
                                                    ...note,
                                                    noteSource: "db",
                                                    id: dbId
                                                }
                                                chartContext.setNewNotes(
                                                    chartContext.newNotes.filter(n => n.id !== note.id)
                                                )
                                                chartContext.setApiNotes(
                                                    chartContext.apiNotes.concat([updatedNote])
                                                )
                                            })
                                        } else {
                                            console.log("Error in storing note: ",resp)
                                        }
                                    })
                                }
                                
                            }}
                            revertNote={() => {
                                

                            }}
                            deleteCallback={() => {
                                console.log("Delete note: ", note)
                                var noteSource = _.get(note, "noteSource", false)
                                if(noteSource === "initialized") {
                                    chartContext.setNewNotes(chartContext.newNotes.filter(n => n.id !== note.id))
                                } else {
                                    var accessToken = _.get(walletContext, "userAccessToken.accessToken", false)
                                    const bearerAuth = `Bearer ${accessToken}`
                                    fetch(`/api/chart_note?note_id=${note.id}`, {
                                        method: "DELETE",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "authorization": bearerAuth,
                                        }
                                    }).then(resp => {
                                        console.log("Delete note response: ", resp)
                                        if(resp.status === 200) {
                                            chartContext.setNewNotes(chartContext.newNotes.filter(n => n.id !== note.id))
                                            chartContext.setApiNotes(chartContext.apiNotes.filter(n => n.id !== note.id))
                                        }
                                        // Remove note from state 
                                    })
                                }
                            }}
                            communityToggleCallback={() => {
                                const accountAddress = _.get(walletContext, "address", false)
                                const betaAccessContract = _.get(walletContext, "decodedJwt.decodedIdToken.beta_access.contractAddress", false)
                                var betaAccessNft = _.get(walletContext, "decodedJwt.decodedIdToken.beta_access.tokens[0]", false)
                                var betaAccessNft = _.toNumber(betaAccessNft)

                                var accessToken = _.get(walletContext, "userAccessToken.accessToken", false)

                                if(note.visibility === "private") {
                                    note.visibility = "community"
                                } else {
                                    note.visibility = "private"
                                }

                                if(accountAddress && betaAccessContract && betaAccessNft && accessToken) {
                                    var reqBody = {
                                        "accountAddress": accountAddress,
                                        "betaAccessContract": betaAccessContract,
                                        "betaAccessToken": betaAccessNft,
                                        "note": note
                                    }

                                    const bearerAuth = `Bearer ${accessToken}`

                                    console.log("posting note: ", reqBody)
                                    fetch("/api/chart_note", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json",
                                            "authorization": bearerAuth,
                                        },
                                        body: JSON.stringify(reqBody)
                                    }).then(resp => {
                                        // Todo: Update cached note with db ID

                                        if(resp.status === 200) {
                                            resp.json().then(json => {
                                                const dbId = _.get(json, "insertedId", false)
                                                var updatedNote = {
                                                    ...note,
                                                    noteSource: "db",
                                                    id: dbId
                                                }
                                                chartContext.setNewNotes(
                                                    chartContext.newNotes.filter(n => n.id !== note.id)
                                                )
                                                chartContext.setApiNotes(
                                                    chartContext.apiNotes.concat([updatedNote])
                                                )
                                            })
                                        } else {
                                            console.log("Error in storing note: ",resp)
                                        }
                                    })
                                }
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
                    left={note.labelAlignment === "end" ? note.size.width : `-1px`}
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