import {
    Box,
    Wrap,
    WrapItem
} from "@chakra-ui/react"
import dayjs from "dayjs"
import StatBox from "./StatBox"
import _ from "lodash"

const stats = [
    {
        valuePath: "past_14_days.total_calls",
        label: "Contract calls past 2 weeks",
        helpText: "past_14_days_date_range"
    },
    {
        valuePath: "total_contract_calls",
        label: "Total nr of contract calls",
        helpText: "total_date_range"
    }
]


const ContractStatsCarousel = ({ contract, dailyStats }) => {
    return (
        <div className='contracts-stats-banner'>
            <Wrap>
            {stats.map((stat, stat_i) => {
                var value = _.get(contract, stat.valuePath, null)
                if(_.isNumber(value)) {
                    value = value.toLocaleString()
                }
                var helpText = _.get(stat, "helpText", false)
                if(helpText === "past_14_days_date_range") {
                    var date_range = [
                        _.first(contract.past_14_days.by_day),
                        _.last(contract.past_14_days.by_day)
                    ].map(d => dayjs(_.get(d, "date")).format("MMM D, YYYY"))
                    helpText = `${date_range[0]} - ${date_range[1]}`
                }

                if(helpText === "total_date_range") {
                    var date_range = [
                        _.first(dailyStats.byDay),
                        _.last(dailyStats.byDay)
                    ].map(d => dayjs(_.get(d, "date")).format("MMM D, YYYY"))
                    helpText = `${date_range[0]} - ${date_range[1]}`
                }
                return (
                    <WrapItem
                        key={stat_i}
                        >
                    <StatBox
                        value={value}
                        label={stat.label}
                        helpText={helpText}
                        />
                    </WrapItem>
                )
            })}
            </Wrap>
        </div>
    )
}


export default ContractStatsCarousel