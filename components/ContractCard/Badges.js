import React from "react"
import {
    Stack,
    Badge
} from "@chakra-ui/react"
import _ from "lodash"

const badgeColorCodes = {
    "fa2": "gray.500",
    "fa12": "purple.500"
}


const Badges = React.memo(({
    badges
}) => {
    return (
        <Stack direction='row'>
            {badges.map((badge, badge_i) => {
                const badgeColor = _.get(badgeColorCodes, badge, "gray.500")
                return (
                    <Badge
                        key={badge_i}
                        colorScheme={badgeColor}
                        variant="subtle"
                        style={{
                            textDecoration: "none"
                        }}
                        >
                        {badge}
                    </Badge>
                )
            })}
        </Stack>
    )
}, (prev, next) => {
    return prev.badges.length === next.badges.length
})

Badges.displayName = "Badges"

export default Badges