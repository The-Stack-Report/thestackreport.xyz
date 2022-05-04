import React from "react"

const TopContractsDataBlocksList = () => {
    return (
        <div>
            {topContracts4x1.map(block => {
                        return (
                            <Box
                                maxW="500"
                                marginBottom="2rem"
                                key={block._id}
                                border="0px solid transparent"
                                >
                            <DataBlock block={block} autoPlayOnLoad={true} />
                            </Box>
                        )
                    })}
        </div>
    )
}

export default TopContractsDataBlocksList