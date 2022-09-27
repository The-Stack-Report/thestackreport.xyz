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
    textMd = ""
}) => {
    return (
        <Accordion allowToggle marginTop="1rem" marginBottom="2rem" border="0px solid transparent">
                <AccordionItem>
                    <h3>
                        <AccordionButton>
                        <AccordionIcon />
                            <Box flex='1' textAlign="right" fontWeight="bold" fontSize="0.8rem">
                                {title}<Text fontWeight="light" color="gray.500" as="span" paddingRight="0.5rem">{` (click to expand) `}</Text>
                            </Box>
                            
                        </AccordionButton>
                    </h3>
                    <AccordionPanel pb={4}>
                        <Box maxW="600px" paddingTop="1rem" paddingBottom="1rem">
                            <MarkdownWrapper
                                markdownText={textMd}
                                />
                        </Box>
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
    )
}

export default AccordionExplainer