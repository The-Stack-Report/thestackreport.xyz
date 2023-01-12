import React, { useState, useEffect, useMemo } from 'react';
import dayjs from 'dayjs';
import _ from 'lodash';

function useChartNotes({
    chartId,
    custom_note,
    propNotes,
    _xDomainFiltered,
    noteLayers,
    walletContext
}) {
    const [notes, setNotes] = useState([]);
    const [newNotes, setNewNotes] = useState([]);
    const [notesFetched, setNotesFetched] = useState(false);
    const [fetchedWithToken, setFetchedWithToken] = useState(false);
    const [newNotePreview, setNewNotePreview] = useState(false)
    const [hoveredNote, setHoveredNote] = useState(false)

    var connectionState = useMemo(() => {
        return _.get(walletContext, "connectionState", false)
    }, [walletContext])


    var accessToken = useMemo(() => {
        if(connectionState === "ACCOUNT_ACTIVE") {
            return _.get(walletContext, "userAccessToken.accessToken", false)
        }
        return false
    }, [connectionState, walletContext])

    var activeAccountAddress = useMemo(() => {
        return _.get(walletContext, "address", false)
    }, [walletContext])

    useEffect(() => {
        // if active account address changes,
        // update all new notes that do not have an owner yet to be from the new address
        if(_.isString(activeAccountAddress) && activeAccountAddress.startsWith("tz1")) {
            setNewNotes(newNotes.map(n => {
                if(_.isString(n.owner) && n.owner.startsWith("tz1")) {
                    return n
                }
                return {
                    ...n,
                    owner: activeAccountAddress
                }
            }))
        }
    }, [activeAccountAddress, newNotes])

    /****************************************
     * Data loading
     */
    // console.log("chart notes access token: ", accessToken, walletContext)
    useEffect(() => {
        if(notesFetched === false && _.isString(chartId)) {
            setNotesFetched(true);
            var headers = {}
            if(accessToken) {
                headers["authorization"] = `Bearer ${accessToken}`
                setFetchedWithToken(accessToken)
            }

            var fetchOptions = {
                method: "GET",
                headers: headers
            }

            var fetchUrl = `/api/chart_note?chart_id=${chartId}`
            fetch(fetchUrl, fetchOptions)
                .then(response => response.json())
                .then(data => {
                    var authorizationState = _.get(data, "authorizationState", false)
                    console.log(authorizationState)

                    if(authorizationState === "failed") {
                        console.log("authorization failed on fetching notes, clearing token.")
                        walletContext.clearUserAccessToken()
                    }

                    var parsedNotes = []
                    if(_.has(data, "notes")) {
                        parsedNotes = data.notes.map(p => {
                            return {
                                ...p,
                                date: dayjs(p.date),
                                id: p._id,
                                noteSource: "api"
                            }
                        })
                    }
                    setNotes(parsedNotes);
                })
        } else {
            if(accessToken && accessToken !== fetchedWithToken) {
                setNotesFetched(false);
            }
        }

    }, [notesFetched, chartId, accessToken, fetchedWithToken, walletContext]);

    const currentNoteIDs = useMemo(() => {
        return notes.map(n => _.get(n, "_id", false))
    }, [notes])

    /****************************************
     * Note subset preparation
     */

    const allChartNotes = useMemo(() => {
        var allNotes = []
        if(custom_note) {
            if(_.isArray(custom_note)) {
                allNotes = allNotes.concat(custom_note)
            } else {
                allNotes.push(custom_note)
            }
        }
        if(_.isArray(propNotes)) {
            allNotes = allNotes.concat(propNotes)
        }

        if(newNotes) {
            allNotes = allNotes.concat(newNotes)
        }
        if(_.isArray(notes)) {
            allNotes = allNotes.concat(notes)
        }

        if(newNotePreview) {
            allNotes.push(newNotePreview)
        }
        allNotes.forEach((n, n_i) => {
            if (!_.has(n, "id")) {
                n.id = `temp-id-${n_i}`
            }
        })

        return allNotes
    }, [custom_note, propNotes, newNotePreview, notes, newNotes])

    var notesInXRange = useMemo(() => {
        return allChartNotes.filter(note => {
            if(_.has(note, "date") && dayjs.isDayjs(note.date)) {
                return note.date.isBetween(_xDomainFiltered[0], _xDomainFiltered[1])
            } else {
                return false
            }
        })
    }, [allChartNotes, _xDomainFiltered])

    const communityNotesVisible = useMemo(() => {
        return notesInXRange.filter(note => {
            return _.get(note, "visibility", false) === "community"
        })
    }, [notesInXRange])

    const visibleChartNotes = useMemo(() => {
        return notesInXRange.filter(note => {
            var noteLayersVisible = _.toPairs(noteLayers).filter(p => p[1] === true).map(p => p[0])
            noteLayersVisible.concat("initialized")
            var noteSource = _.get(note, 'noteSource', false)
            var previewNoteSourceStates = ["preview", "initialized"]
            if(previewNoteSourceStates.includes(noteSource)) {
                return true
            }
            if(_.get(note, "noteSource", false) === "custom_markdown") {
                return true
            }
            return noteLayersVisible.includes(_.get(note, "visibility", false))
        })
    }, [ notesInXRange, noteLayers])

    const communityNotesInXRange = useMemo(() => {
        return notesInXRange.filter(note => {
            return _.get(note, "visibility", false) === "community"
        })
    }, [notesInXRange])



    /****************************************
     * Callbacks
     */

    function postNote(updatedNote) {
        const accountAddress = _.get(walletContext, "address", false)
        const betaAccessContract = _.get(walletContext, "decodedJwt.decodedIdToken.beta_access.contractAddress", false)
        var betaAccessNft = _.get(walletContext, "decodedJwt.decodedIdToken.beta_access.tokens[0]", false)
        var betaAccessNft = _.toNumber(betaAccessNft)

        if(accountAddress && betaAccessContract && betaAccessNft && accessToken) {
            var reqBody = {
                "accountAddress": accountAddress,
                "betaAccessContract": betaAccessContract,
                "betaAccessToken": betaAccessNft,
                "note": updatedNote
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
                        const dbId = _.get(json, "_id", false)
                        var prevId = _.get(updatedNote, "id", false)
                        var confirmedNote = {
                            ...updatedNote,
                            noteSource: "db",
                            id: dbId,
                            _id: dbId
                        }
                        if(currentNoteIDs.includes(dbId)) {
                            setNotes(
                                notes.map(n => {
                                    if(n.id === dbId) {
                                        return confirmedNote
                                    } else {
                                        return n
                                    }
                                })
                            )
                        } else if(updatedNote.noteSource === "initialized") {
                            if(notes.map(n => n.id).includes(confirmedNote.id)) {
                                setNotes(
                                    notes.map(n => {
                                        if(n.id === updatedNote.id) {
                                            return confirmedNote
                                        } else {
                                            return n
                                        }
                                    })
                                )
                            } else {
                                setNotes(
                                    notes.concat([confirmedNote])
                                )
                                setNewNotes(newNotes.filter(n => n.id !== prevId))
                            }
                            
                        } else {
                            setNotes(
                                notes.concat([confirmedNote])
                            )
                        }
                    })
                } else {
                    console.log("Error in storing note: ",resp)
                }
            })
        }
    }


    function deleteNote(noteToBeDeleted) {
        var noteSource = _.get(noteToBeDeleted, "noteSource", false)
        if(noteSource === "initialized") {
            setNewNotes(newNotes.filter(n => n.id !== noteToBeDeleted.id))
        } else {
            var accessToken = _.get(walletContext, "userAccessToken.accessToken", false)
            const bearerAuth = `Bearer ${accessToken}`
            fetch(`/api/chart_note?note_id=${noteToBeDeleted.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "authorization": bearerAuth,
                }
            }).then(resp => {
                if(resp.status === 200) {
                    setNewNotes(newNotes.filter(n => n.id !== noteToBeDeleted.id))
                    setNotes(notes.filter(n => n.id !== noteToBeDeleted.id))
                }
                // Remove note from state 
            })
        }
    }
    
    return {
        notes,
        allChartNotes,
        notesInXRange,
        communityNotesVisible,
        newNotes,
        visibleChartNotes,
        communityNotesInXRange,

        postNote,
        setNewNotes,
        deleteNote,
        setNewNotePreview,

        hoveredNote,
        setHoveredNote
    };
}

export default useChartNotes