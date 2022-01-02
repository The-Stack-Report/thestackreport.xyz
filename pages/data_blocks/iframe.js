import Head from 'next/head'
import React from 'react'
import {
    Text,
    Heading
} from "@chakra-ui/react"
import _ from "lodash"
import { connectToDatabase } from "utils/mongo_db"

import SilentVideo from "components/SilentVideo"

const BlockIFramePage = ({block, error, errorMessage}) => {
    const spaces_url = _.get(block, "spaces_url", false)
    return (
        <div>
            <Head>
                <title>Data block embed</title>
                <meta name="description" content="Data block embed view." />

            </Head>
            {error ? (
                <div>
                    <Text>{errorMessage}</Text>
                </div>
                ) : (
                <React.Fragment>
                    {spaces_url && (
                        <SilentVideo
                            src={spaces_url} 
                            resolution={block.video_meta}
                            />
                    )}
                </React.Fragment>
            )}
            
        </div>
    )
}

var blocksCache = {}

export async function getServerSideProps(context) {
    const data_key = _.get(context, "query.block", false)
    if(data_key) {
        if(_.has(blocksCache, data_key)) {
            console.log("using blocks cache for: ", data_key)
            return {
                props: {
                    block: blocksCache[data_key],
                    error: false
                }
            }
        } else {
            const { db } = await connectToDatabase()
            var block = await db.collection("data_blocks")
                .findOne({"vid_key": data_key})
            if (!_.has(block, "_id")) {
                return { props: {errorMessage: "Incorrect block key.", error: true} }
            } else {
                block._id = block._id.toString()
                blocksCache[data_key] = block
                return {
                    props: {
                        block: block,
                        error: false
                    }
                }
            }
        }
        
        
    } else {
        return { props: {errorMessage: "Missing block key.", error: true} }
    }   
    
}
export default BlockIFramePage