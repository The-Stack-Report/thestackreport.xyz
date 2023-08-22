import React from "react"

const EntrypointUsageChart = ({
    entrypoint,
    endDate
}) => {
    return (
        <div>
            <h1>Entrypoint Usage Chart</h1>
            <p>Entrypoint: {entrypoint}</p>
            <p>End Date: {endDate}</p>
        </div>
    )
}

export default EntrypointUsageChart