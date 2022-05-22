import React, { useContext } from "react"
import _ from "lodash"
import dayjs from "dayjs"
import { AreaChartContext } from "components/Charts/AreaChart/AreaChart"
import { ChartContext } from "components/Charts/Chart/Chart"

const AxisBottom = ({
	xScale,
	chart,
	ticks = 5
}) => {
	const areaChartContext = useContext(AreaChartContext)
	const chartContext = useContext(ChartContext)

	var hovered = false
	if(_.get(chartContext, "hovered", false)) {
		hovered = true
	} else if(_.get(areaChartContext, "hovered", false)) {
		hovered = true
	}
	return (
		<g transform={`translate(0, ${chart.height})`} >
			{xScale.ticks(ticks).map((t, t_i) => {
				if(_.isNumber(t)) {
					return (
						<g transform={`translate(${xScale(t)}, 0)`}>
							<text
								alignmentBaseline="hanging"
								x={5}
								y={5}
								fontSize="0.8rem"
								>
								{t.toLocaleString()}
							</text>
						</g>
					)
				} else {
					var dt = dayjs(t)
					var t_formatted = t
					if(dt) {
						t_formatted = dt.format("MMM D")
					}
					var monthNr = dt.month()
					var dayNr = dt.day()
					var dayInMonth = parseInt(dt.format("D"))
					var hour = dt.hour()
					if (hour !== 0) return null

					return (
						<g transform={`translate(${xScale(dt)}, 0)`}
							key={t_i}
							>
							<text
								alignmentBaseline="hanging"
								x={5}
								y={5}
								fontSize="0.8rem"
								
								>
							{t_formatted}
							</text>
							{(monthNr === 0 && dayInMonth === 1) && (
								<text
									alignmentBaseline="hanging"
									x={5}
									y={22}
									fontSize="0.8rem"
									fontWeight="bold"
									opacity={_.get(chartContext, 'hovered', false) ? 0.1 : 1}
									>
								{dt.format("YYYY")}
								</text>
							)}
						</g>
					)
				}
				
			})}

		</g>
	)
}

export default AxisBottom