import React from "react"
import MainMenu from "components/MainMenu"
import Footer from "components/Footer"
import StatsOverlay from "components/StatsOverlay"

const PageLayout = ({ children }) => {
    return (
        <React.Fragment>
            <MainMenu />
            <main>{children}</main>
            <Footer />
        </React.Fragment>
    )
    

}

export default PageLayout