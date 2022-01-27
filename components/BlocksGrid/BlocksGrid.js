import React, { useState } from "react"
import {
    SimpleGrid
} from "@chakra-ui/react"
import DataBlock from "components/DataBlock"
import _ from "lodash"

const BlocksGrid = React.memo(({
    blocks,
    pagination_query = false
}) => {
    const [pagesLoaded, setPagesLoaded] = useState(false)
    console.log("blocks grid render")
    return (
        <div>

                <SimpleGrid columns={{sm: 1, md: 2, lg: 3}} spacing="20px">
                    {blocks.map((block, block_i) => {
                        const spaces_url = _.get(block, "spaces_url", false)
                        return (
                                <DataBlock
                                    key={block._id}
                                    block={block}
                                    z_i={blocks.length + 10 - block_i}
                                    />
                        )
                    })}
                </SimpleGrid>
        </div>
    )
}, (prev, next) => {
    if(prev.blocks.length !== next.blocks.length) {
        return false
    }
    return _.every(prev.blocks.map((b, b_i) => b.vid_key === next.blocks[b_i].vid_key))
})

export default BlocksGrid