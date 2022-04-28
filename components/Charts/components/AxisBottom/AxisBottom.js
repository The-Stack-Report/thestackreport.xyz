import React from "react"
import _ from "lodash"
import dayjs from "dayjs"

const AxisBottom = ({
	xScale,
	chart,
	ticks = 5
}) => {
	return (
		<g transform={`translate(0, ${chart.height})`} >
			{xScale.ticks(ticks).map((t, t_i) => {
				var dt = dayjs(t)
				var t_formatted = t
				if(dt) {
					t_formatted = dt.format("YY-MM")
				}
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
					</g>
				)
			})}

		</g>
	)
}

export default AxisBottom