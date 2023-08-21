import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    StatGroup,
    Box
} from "@chakra-ui/react"

const StatBox = ({
    value,
    label,
    helpText = ""
}) => {
    return (
        <Box
            shadow="sm"
            borderWidth="1px"
            padding="0.5rem"
            paddingRight="2rem"
            paddingBottom="0rem"

            >
        <Stat>
            <StatLabel>{label}</StatLabel>
            {value === "null" ? (
                <StatNumber
                    fontWeight="light"
                    opacity={0.5}
                    >
                    {value}
                </StatNumber>
            ) : (
                <StatNumber>{value}</StatNumber>
            )}
            
            <StatHelpText>{helpText}</StatHelpText>
        </Stat>
        </Box>
    )
}

export default StatBox