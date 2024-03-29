import React, { useRef, useState, useEffect } from "react"
import {
    Box,
    Text,
    Heading,
    Image
} from "@chakra-ui/react"
import _ from "lodash"
import CardAreaChart from "./CardAreaChart"
import prepareContractDailyStats from "utils/data/contracts/prepareContractDailyStats"
import Highlighter from "react-highlight-words"
import styles from "./ContractCard.module.scss"
import dayjs from "dayjs"
import { gridScale } from "utils/colorScales"
import StatsTable from "./StatsTable"
import Badges from "./Badges"
import { useDebouncedCallback } from 'use-debounce'
import { Link } from "@chakra-ui/next-js"


const ContractCard = React.memo(({
    contract,
    highlightTerm,
    sortPosition,
}) => {
    var alias = _.get(contract, "tzkt_account_data.alias", contract.address)

    var badges = []
    

    badges = badges.concat(
        _.get(contract, "tzkt_account_data.tzips", [])
    )
    var recent_days_data = _.get(contract, "_preparedDailyStats", false)
    if(recent_days_data === false) {
        recent_days_data = prepareContractDailyStats(_.get(contract, "past_14_days", false), contract)
    }

    return (
        <Box position="relative" paddingBottom="2rem">
            <Link
                href={`/dashboards/tezos/contracts/${contract.address}`}
                textDecoration="none"
                >
                <Box
                    key={contract.address}
                    shadow="sm"
                    borderWidth="1px"
                    padding="0.5rem"
                    _hover={{
                        background: "black",
                        color: "white"
                    }}
                    role="group"
                    maxW="100%"
                    className={styles["contract-card"]}
                    >
                    <CardDataContent
                        data={recent_days_data}
                        sortPosition={sortPosition}
                        />
                    <Box minHeight="7rem" paddingTop="1.5rem"   
                        overflow="hidden"
                        maxW="100%"
                        >
                        <div style={{width: "100%", overflow: "hidden", position: "relative", height: 30}}>
                            <Box position="absolute"
                                top="0px"
                                left="0px"
                                right="0px"
                                >
                                <Heading fontSize="xl"
                                    textDecoration="underline"
                                    noOfLines={1}
                                    maxW="100%"
                                    >
                                    <Highlighter
                                        highlightClassName={styles["search-term-highlight"]}
                                        searchWords={[highlightTerm]}
                                        autoEscape={true}
                                        textToHighlight={alias}
                                        />
                                        
                                </Heading>
                            </Box>
                        </div>
                        <div style={{width: "100%", overflow: "hidden", position: "relative", height: 30}}>
                            <Text fontSize="0.7rem"
                                noOfLines={1}
                                color="gray.500"
                                >
                                <Highlighter
                                    highlightClassName={styles["search-term-highlight"]}
                                    searchWords={[highlightTerm]}
                                    autoEscape={true}
                                    textToHighlight={contract.address}
                                    />
                            </Text>

                        </div>
                        <StatsTable
                            contract={contract}
                            />
                        <Badges badges={badges} />  

                    </Box>
                </Box>
            </Link>
        </Box>
    )
}, (prev, next) => {
    if (prev.contract.address !== next.contract.address) {
        return false
    }
    if(prev.highlightTerm !== next.highlightTerm) {
        return false
    }
    return true
})

ContractCard.displayName = "ContractCard"

const defaultWidth = 288

const CardDataContent = React.memo(({
    data,
    sortPosition
}) => {
    const containerRef = useRef(null)
    const [dimensions, setDimensions] = useState({ width:defaultWidth, height: 300 });
    const [windowResizeCounter, setWindowResizeCounter] = useState(0)


    useEffect(() => {
        if(containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            })
        }
    }, [containerRef, windowResizeCounter])

    const handleResize = useDebouncedCallback(
        () => {
            setWindowResizeCounter((c) => c + 1)
        },
        100
    );

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
      }, [handleResize]);

    const aspectRatio = 5/8

    var cols = _.sortBy(data.entrypoints, "count").reverse().map(p => p.entrypoint)

    var lastDate = _.last(data.byDay)
    lastDate = _.get(lastDate, "date", dayjs())
    if(_.isString(lastDate)) {
        lastDate = dayjs(lastDate)
    }
    var firstDate = _.first(data.byDay)
    firstDate = _.get(firstDate, "date", lastDate.subtract(7, "day"))
    if(_.isString(firstDate)) {
        firstDate = dayjs(firstDate)
    }

    var color = "black"
    if(_.isNumber(sortPosition)) {
        color = gridScale(_.clamp(sortPosition / 100, 0, 1))
    }
    return (
        <Box position="relative" ref={containerRef}>
            <Image
                alt="grey background"
                src="/dashboard-card-bg.png"
                width="100%"
                />
            <div style={{position: "absolute", top: 0, left: 0, right: 0, zIndex: 10}}>
            <CardAreaChart
                data={data.byDay}
                dataDomain={data.dataDomain}
                columns={cols}
                xDomain={[firstDate, lastDate]}
                xKey={"date"}
                width={dimensions.width}
                height={dimensions.width * aspectRatio}
                color={color}
                />
            </div>
        </Box>
                
    )
}, (prev, next) => prev.data.length === next.data.length)

CardDataContent.displayName = "CardDataContent"




export default ContractCard