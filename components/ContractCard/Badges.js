import React from "react"
import {
    Stack,
    Badge
} from "@chakra-ui/react"


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