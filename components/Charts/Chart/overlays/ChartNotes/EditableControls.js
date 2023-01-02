import { useEffect, useContext } from "react"
import {
    Box,
    Text,
    IconButton,
    ButtonGroup,
    useEditableControls,
    Tooltip,
    Checkbox
} from "@chakra-ui/react"
import {
    CheckIcon,
    CloseIcon,
    DeleteIcon,
    ViewIcon,
    ViewOffIcon
} from "@chakra-ui/icons"
import { WalletContext } from "components/Wallet"

const EditableControls = ({
        isCurated,
        setIsEditing,
        revertNote,
        isStorable,
        noteType,
        deleteCallback,
        storeCallback,
        communityToggleCallback,
        leftPos
    }) => {
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

    var _deleteCallback = () => {}
    if(canDelete) _deleteCallback = deleteCallback

    var _storeCallback = () => {}
    if(isStorable) _storeCallback = storeCallback

    var onEditMessage = "(Re-)connect wallet, to store."

    if(isCurated) onEditMessage = "Curated notes cannot be edited."

    var communityVisibleIcon = <ViewOffIcon />
    var communityVisibleLabel = "Hide from community"

    var iconButtonProps = {
        size: "xs",
        height: "22px",
        padding: "0px",
        marginBottom: "0px",
        variant: "outline",
        fontSize: "0.6rem",
        borderRadius: "0px",
        background: "white"
    }
    
    return isEditing ? (
        <>
        <Box
            position="absolute"
            width="140px"
            left={leftPos}
            top="-1px"
            pointerEvents="initial"
            background="white"
            border="0px solid transparent"
            padding="0px"
            marginLeft="2px"
            zIndex={100}
            borderRadius="2px"
            >
            {isStorable === false && (
                <Text
                    color="orange"
                    position="absolute"
                    top={isCurated ? "0px" : "-1.5rem"}
                    left="5px"
                    right="-200px"
                    cursor="initial"
                    >
                    {onEditMessage}
                </Text>
            )}
            {isCurated === false && (
                <ButtonGroup justifyContent="end" size="xs" w="full" spacing={2} paddingLeft="5px" paddingRight="5px">
                    <Tooltip label="Save" fontSize="0.7rem">
                    <IconButton
                        icon={<CheckIcon />}
                        {...submitButtonProps}
                        onPointerDown={_storeCallback}
                        isDisabled={!isStorable}
                        {...iconButtonProps} />
                    </Tooltip>
                    <Tooltip label="Revert" fontSize="0.7rem">
                    <IconButton 
                        {...iconButtonProps} 
                        icon={<CloseIcon />} {...getCancelButtonProps()} />
                    </Tooltip>
                    <Tooltip label="Delete" fontSize="0.7rem">
                    <IconButton
                        onPointerDown={_deleteCallback} 
                        isDisabled={!canDelete}
                        {...iconButtonProps}
                        size="xs" icon={<DeleteIcon />} />
                    </Tooltip>
                    
                </ButtonGroup>
            )}
        </Box>
        <Box
            position="absolute"
            width="50px"
            left="-53px"
            top="-1px"
            pointerEvents="initial"
            background="white"
            border="0px solid transparent"
            padding="0px"
            zIndex={100}
            borderRadius="2px"
            >
            {isCurated === false && (
                <ButtonGroup justifyContent="end" size="xs" w="full" spacing={2} paddingLeft="5px" paddingRight="5px">
                    <Tooltip label="Show to community" fontSize='0.7rem'>
                        <IconButton
                            icon={<ViewIcon />}
                            onPointerDown={(e) => {
                                e.preventDefault();
                                communityToggleCallback()
                            }}
                            {...iconButtonProps}
                            />
                    </Tooltip>
                </ButtonGroup>

            )}
        </Box>
        </>
    ) : null
}

export default EditableControls