export var connectedAccountLinkProps = {
    display: "inline-block",
    marginLeft: "auto",
    borderRadius: "0.25rem",
    pointerEvents: "initial",
    _hover: {
        background: "black",
        color: "white",
        borderRadius: "0.25rem"
    }
}

export var displayNameTextProps = {
    fontSize: "0.8rem",
    padding: "0.25rem",
    paddingLeft: "0.8rem",
    paddingRight: "0.8rem",
    background: "white",
    width: "fluid",
    border: "0px solid transparent",
    borderRadius: "0.25rem",
    textAlign: "right",
    _hover: {
        background: "black",
        color: "white",
        borderRadius: "0.25rem"
    }
}

export var displayModeIconProps = {
    fontSize: "0.8rem",
    padding: "0.25rem",
    paddingLeft: "1rem",
    paddingRight: "0.8rem",
    background: "white",
    width: "30px",
    border: "0px solid transparent",
    borderRadius: "2rem",
    textAlign: "right",
    userSelect: "none",
    pointerEvents: "initial",
    cursor: "pointer",
    marginLeft: "0.25rem",
    _hover: {
        background: "black",
        color: "white",
        borderRadius: "2rem"
    }
}

export var getSignatureButtonProps = {
    size: "sm",
    padding: "0.25rem",
    paddingLeft: "0.8rem",
    paddingRight: "0.8rem",
    fontSize: "0.8rem",
    background: "white",
    width: "fluid",
    border: "0px solid transparent",
    borderRadius: "0.25rem",
    color: "black"
}

export var disconnectButtonProps = {
    size: "sm",
    padding: "0.25rem",
    paddingLeft: "1rem",
    paddingRight: "0.7rem",
    fontSize: "0.8rem",
    background: "white",
    width: "fluid",
    border: "0px solid transparent",
    borderRadius: "0.25rem",
    opacity: 0.3,
    _hover: {
        background: "black",
        color: "white",
        opacity: 1
    }
}

export var signInErrorMessageProps = {
    color: "white",
    fontSize: "0.8rem",
    background: "rgb(220,20,10)",
    width: "fluid",
    fontWeight: "bold",
    marginLeft: "auto",
    paddingLeft: "0.25rem",
}

export var interpretationLayerLinkProps = {
    display: "inline-block",
    textDecoration: "none",
    pointerEvents: "initial",
    _hover: {
        background: "transparent",
        color: "white",
        textDecoration: "underline",
        borderRadius: "0.25rem"
    },
    borderRadius: "0.25rem",
}

export var interpretationLayerTextProps = {
    fontSize: "0.8rem",
    padding: "0.14rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    background: "rgba(0,0,0,0.5)",
    color: "white",
    position: "relative",
    left: "0px",
    borderRadius: "0.25rem",
    overflow: "hidden",
    userSelect: "none"
}

export var connectWalletButtonProps = (isSafari) => {
    return {
        size: "small",
        padding: "0.25rem",
        paddingLeft: "1rem",
        paddingRight: "0.8rem",
        fontSize: "0.8rem",
        background: "white",
        width: "fluid",
        border: "0px solid transparent",
        borderRadius: "0.25rem",
        marginBottom: "0px",
        outline: "none",
        outlineOffset: "0px",
        verticalAlign: "top",
        overflow: "visible",
        marginTop: isSafari ? "0.15rem" : "0rem"
    }
}