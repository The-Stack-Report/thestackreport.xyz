import React from "react"
import { decorationLineStyle } from "styles/chartStyles"
import _ from "lodash"
import dayjs from "dayjs"

const Grid = ({
	chart,
	xScale,
	yScale,
	xTickCount = 5,
	yTickCount = 5
}) => {
	const width = _.get(chart, "width", false)
	const height = _.get(chart, "height", false)
	if(!_.isNumber(width)) return null
	if(_.isNaN(width)) return null
	if(!_.isNumber(height)) return null
	if(_.isNaN(height)) return null
	return (
		<g>
			<rect
				width={width}
				height={height}
				style={decorationLineStyle}
				/>
			{xScale.ticks(xTickCount).map((t, t_i) => {
				const t_pos = xScale(t)
				if (!_.isNumber(t_pos)) return null
				if(_.isNaN(t_pos)) return null
				if (dayjs(t).hour() !== 0) return null
				return (
					<line
						key={`x-${t_i}`}
						x1={t_pos}
						x2={t_pos}
						y1={0}
						y2={height}
						style={decorationLineStyle}
						/>
				)
			})}
			{yScale.ticks(yTickCount).map((t, t_i) => {
				const t_pos = chart.height - yScale(t)
				if (!_.isNumber(t_pos)) return null
				if(_.isNaN(t_pos)) return null
				return (
					<line
						key={`y-${t_i}`}
						y1={t_pos}
						y2={t_pos}
						x1={0}
						x2={width}
						style={decorationLineStyle}
						/>
				)
			})}
		</g>
	)
}

export default Grid