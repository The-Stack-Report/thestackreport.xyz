import React from "react"
import ReactMarkdown from 'react-markdown'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer';
import rehypeRaw from 'rehype-raw'
import { DataBlockDynamic } from "components/DataBlock/DataBlock"
import ModelChart from "components/Charts/ModelChart"
import ChartBySlug from "components/Charts/ChartBySlug"
import {
    UnorderedList,
    Button,
    Text,
    Box,
    Divider,
    Code
} from "@chakra-ui/react"
import _ from "lodash"
import dayjs from "dayjs"
import prepareChartProps from "./prepareChartProps"

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
            <Box style={{marginTop: "3rem", marginBottom: "3rem"}}
                paddingRight={{
                    base: "0rem",
                    md: "2rem"
                }}
                >
            <DataBlockDynamic block_key={block_key} autoPlayOnLoad={false} />
            </Box>
        )
    },
    "code": (props) => {
        return (
            <Code>
                {props.children}
            </Code>
        )
    },
    "chart": (props) => {
        
        // Get chart slug from children
        var chartSlug = _.get(props, "children[0]", false)

        if(chartSlug === false) {
            chartSlug = _.get(props, "node.properties.slug", false)
        }
        if(_.isString(chartSlug)) {
            chartSlug = chartSlug.trim()
        }

        var chartProps = prepareChartProps(props)

        


        return (
            <Box
                marginTop="3rem"
                marginBottom="3rem"
                overflow="visible"
                >
                {_.isString(chartSlug) ? (
                    <ChartBySlug
                        slug={chartSlug}
                        chartProps={chartProps}
                        />
                ) : (
                    <Text>Chart key missing</Text>
                )}
            </Box>
        )
    },
    "modelchart": ({children, ...props}) => {
        var chartProps = prepareChartProps(props)
        return (
            <ModelChart
                {...props}
                chartProps={chartProps}
                />
        )
    },
     "button": ({children, ...props}) => {
        return (
            <Button {...props}
                _hover={{
                    color: "white",
                    bg: "black"
                }}
                >
                {children}
            </Button>
        )
    },
    "blockquote": ({children, ...props}) => {
        return (
            <Box
                borderRadius={5}
                marginTop="1rem"
                marginBottom="1rem"
                fontStyle="italic"
                >
                {`"`}
                <Box
                    paddingLeft={{
                        base: "1rem",
                        md: "2rem"
                    }}
                    paddingRight={{
                        base: "1rem",
                        md: "2rem"
                    }}
                    >
                {children}
                </Box>
                <Text textAlign="right"
                    paddingRight="2rem"
                    >
                    {`"`}
                </Text>
            </Box>
        )
    },
    "hr": ({children, ...props}) => {
        return (
            <Divider
                borderBottom="1px solid rgb(220,220,220)"
                />
        )
    },
    "p": ({children, ...props}) => {
        return (
            <Text {...props} marginBottom="1.2rem">
                {children}
            </Text>
        )
    }
}


const MarkdownWrapper = ({ markdownText }) => {
    return (
        <div className='markdown-wrapper'>
        <ReactMarkdown
            components={ChakraUIRenderer(markdownComponents)}
            rehypePlugins={[rehypeRaw]}
            >
            {markdownText}
        </ReactMarkdown>
        </div>
    )
}

export default MarkdownWrapper