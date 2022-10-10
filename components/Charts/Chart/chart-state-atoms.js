import {
    atom
} from "recoil"

const noteChangeEffect = name => ({ setSelf, onSet }) => {
    console.log(name, "note change effect")
}

export const notesState = atom({
    key: "notes",
    default: [],
    effects: chartID => [
        noteChangeEffect(`${chartID} - chart id`)
    ]
})