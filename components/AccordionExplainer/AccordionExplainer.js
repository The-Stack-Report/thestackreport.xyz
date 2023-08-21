import React from "react"
import {
    Box,
    Divider,
    Text,
    Button,
    Input,
    InputGroup,
    InputRightAddon,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon
} from "@chakra-ui/react"
import MarkdownWrapper from "components/MarkdownWrapper"


const AccordionExplainer = ({
    title = "",
    textMd = "",
    textAlign = "right",
    generatorValue = "",
}) => {
    var textContent = textMd
    if (typeof textMd === "function") {
        textContent = textMd(generatorValue)
    }

    var titleContent = title
    if (typeof title === "function") {
        titleContent = title(generatorValue)
    }

    return (
        <Accordion
            allowToggle
            marginTop="1rem"
            marginBottom="2rem"
            border="0px solid transparent"
            onChange={() => {
                console.log("Toggled accordion: ", title)
            }}
            >
                <AccordionItem>
                    <h3>
                        <AccordionButton>
                        <AccordionIcon />
                            <Box flex='1' textAlign={textAlign} fontWeight="bold" fontSize="0.8rem">
                                {titleContent}<Text fontWeight="light" color="gray.500" as="span" paddingRight="0.5rem">{` (click to expand) `}</Text>
                            </Box>
                            
                        </AccordionButton>
                    </h3>
                    <AccordionPanel pb={4}>
                        <Box maxW="600px" paddingTop="1rem" paddingBottom="1rem">
                            <MarkdownWrapper
                                markdownText={textContent}
                                />
                        </Box>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
    )
}

export default AccordionExplainer