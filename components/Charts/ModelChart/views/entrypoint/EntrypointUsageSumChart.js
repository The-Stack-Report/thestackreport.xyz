import React from "react"

const EntrypointUsageSumChart = ({
    entrypoint,
    endDate
}) => {
    return (
        <div>
            <h1>Entrypoint Usage Sum Chart</h1>
            <p>Entrypoint: {entrypoint}</p>
            <p>End Date: {endDate}</p>
        </div>
    )
}

export default EntrypointUsageSumChart