import React from "react"
import { decorationLineStyle } from "styles/chartStyles"


const Grid = ({
	chart,
	xScale,
	yScale,
	xTickCount = 5,
	yTickCount = 5
}) => {
	return (
		<g>
			<rect
				width={chart.width}
				height={chart.height}
				style={decorationLineStyle}
				/>
			{xScale.ticks(xTickCount).map((t, t_i) => {
				const t_pos = xScale(t)
				return (
					<line
						key={`x-${t_i}`}
						x1={t_pos}
						x2={t_pos}
						y1={0}
						y2={chart.height}
						style={decorationLineStyle}
						/>
				)
			})}
			{yScale.ticks(yTickCount).map((t, t_i) => {
				const t_pos = yScale(t)
				console.log(t_pos)
				return (
					<line
						key={`y-${t_i}`}
						y1={t_pos}
						y2={t_pos}
						x1={0}
						x2={chart.width}
						style={decorationLineStyle}
						/>
				)
			})}
		</g>
	)
}

export default Grid