import React from "react"
import {
    Text,
    Heading,
    UnorderedList,
    ListItem,
    Button
} from "@chakra-ui/react"
import ReactMarkdown from 'react-markdown'
import _ from "lodash"
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import rehypeRaw from 'rehype-raw'
import { DataBlockDynamic } from "components/DataBlock/DataBlock"

const ULMarkdown = (props) => {
    return (
        <UnorderedList marginBottom={"1rem"}>
            {props.children}
        </UnorderedList>
    )
}

var markdownComponents = {
    "ul": ULMarkdown,
    "data_block": (props) => {
        var block_key = _.get(props, "children[0]", false)
        if(block_key === false) {
            block_key = _.get(props, "node.properties.key", false)
        }
        return (
            <div style={{marginTop: "2rem", marginBottom: "2rem"}}>
            <DataBlockDynamic block_key={block_key} />
            </div>
        )
    },
    "button": ({children, ...props}) => {
        return (
            <Button {...props}>{children}</Button>
        )
    }
}

const Article = ({ article }) => {
    return (
        <div className="tsr-article">
            <ReactMarkdown
                components={ChakraUIRenderer(markdownComponents)}
                rehypePlugins={[rehypeRaw]}
                >
                {_.get(article, "Content", "# content missing")}
            </ReactMarkdown>
        </div>
    )
}

export default Article