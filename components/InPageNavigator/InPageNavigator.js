import React, { useMemo, useEffect } from "react"
import _ from "lodash"

import useWindowSize from "utils/useWindowSize"
import { breakpoints } from "styles/breakpoints"
import Sidebar from "./components/Sidebar"
import TopMenu from "./components/TopMenu"
import useScrollPosition from "utils/useScrollPosition"
import {
    Box
} from "@chakra-ui/react"

const SIDEBAR_MODE = "SIDEBAR_MODE"

const TOP_MENU_MODE = "TOP_MENU_MODE"

function getOffsetTopForElementId(id) {
    if (typeof window === "undefined") {
        return 0
    }
    const anchor = document.getElementById(id);
    if ( _.isNull(anchor) ) {
        return 0
    }
    const offsetTop = anchor.getBoundingClientRect().top + window.pageYOffset;
    return offsetTop
}

const InPageNavigator = ({
    sections,
    sidebarWidth = 200,
    contentOffset = 0,
    children
}) => {
    const windowSize = useWindowSize()
    const scrollPosition = useScrollPosition()

    const windowWidth = useMemo(() => {
        return _.get(windowSize, "width", 500)
    }, [windowSize])

    const displayMode = useMemo(() => {
        if (windowWidth > breakpoints.xl + sidebarWidth * 2) {
            return SIDEBAR_MODE
        } else {
            return TOP_MENU_MODE
        }
    }, [windowWidth, sidebarWidth])

    const currentSectionIndex = useMemo(() => {
        return sections.length - sections.map(section => getOffsetTopForElementId(section.id)).filter(offset => {
            return offset - 105 > (scrollPosition - 1) // Tiny offset for initial serverside page render
        }).length
    }, [scrollPosition, sections])

    var contentContainerOffset = useMemo(() => {
        if(displayMode === SIDEBAR_MODE) {
            return `-${contentOffset}`
        } else {
            return`-${contentOffset}`
        }
    }, [displayMode, contentOffset])

    var contentPadding = useMemo(() => {
        if(displayMode === SIDEBAR_MODE) {
            return `0`
        } else {
            return "1rem"
        }
    }, [displayMode])
    return (
        <>
        {displayMode === SIDEBAR_MODE && (
            <Sidebar
                sections={sections}
                currentSectionIndex={currentSectionIndex}
                sidebarWidth={200}
                contentOffset={contentOffset}
                />
        )}
        {displayMode === TOP_MENU_MODE && (
            <TopMenu
                sections={sections}
                activeSectionId={0}
                contentOffset={contentOffset}
                currentSectionIndex={currentSectionIndex}
                scrollPosition={scrollPosition}
                />
        )}
        <Box
            marginTop={contentContainerOffset}
            paddingTop={contentPadding}
            overflow="hidden"
            >
            {children}
        </Box>
        </>
    )
}

export default InPageNavigator