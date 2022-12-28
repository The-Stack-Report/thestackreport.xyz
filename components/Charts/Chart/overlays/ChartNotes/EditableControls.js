import { useEffect, useContext } from "react"
import {
    Box,
    Text,
    IconButton,
    ButtonGroup,
    useEditableControls,
    Tooltip
} from "@chakra-ui/react"
import {
    CheckIcon,
    CloseIcon,
    DeleteIcon
} from "@chakra-ui/icons"
import { WalletContext } from "components/Wallet"

const EditableControls = ({ setIsEditing, revertNote, isStorable, noteType, deleteCallback, storeCallback }) => {
    const {
        isEditing,
        getSubmitButtonProps,
        getCancelButtonProps,
        getEditButtonProps
    } = useEditableControls()
    const walletContext = useContext(WalletContext)


    useEffect(() => {
        setIsEditing(isEditing)
    }, [isEditing, setIsEditing])

    var submitButtonProps = getSubmitButtonProps()

    if(isStorable === false) {
        submitButtonProps.disabled = true
    }

    var canDelete = false

    if (isStorable === true) {
        canDelete = true
    } else if(noteType === "initialized") {
        canDelete = true
    }
 
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
            {isStorable === false && (
                <Text
                    color="orange"
                    position="absolute"
                    top="-1.5rem"
                    left="5px"
                    right="-200px"
                    onPointerDown={(e) => {
                        e.preventDefault();
                        walletContext.actions.requestPermissions()
                    }}
                    >
                    {"(Re-)connect wallet, to store."}
                </Text>
            )}
            <ButtonGroup justifyContent="end" size="xs" w="full" spacing={2} paddingLeft="5px" paddingRight="5px">
                <Tooltip label="Save" fontSize="0.7rem">
                <IconButton
                    icon={<CheckIcon />}
                    {...submitButtonProps}
                    onPointerDown={storeCallback}
                    isDisabled={!isStorable}
                    height="22px"
                    padding="0px"
                    marginBottom="0px"
                    variant="outline"
                    fontSize="0.6rem"
                    background="white"
                    size="xs" />
                </Tooltip>
                <Tooltip label="Revert" fontSize="0.7rem">
                <IconButton height="22px" padding="0px" marginBottom="0px" variant="outline" fontSize="0.6rem" background="white" size="xs" icon={<CloseIcon />} {...getCancelButtonProps()} />
                </Tooltip>
                <Tooltip label="Delete" fontSize="0.7rem">
                <IconButton onPointerDown={deleteCallback} 
                    isDisabled={!canDelete} height="22px" padding="0px" marginBottom="0px" variant="outline" fontSize="0.6rem" background="white" size="xs" icon={<DeleteIcon />} />
                </Tooltip>
            </ButtonGroup>
        </Box>
    ) : null
}

export default EditableControls