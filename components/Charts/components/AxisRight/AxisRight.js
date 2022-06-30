import _ from "lodash"
import React from "react"

const AxisRight = ({
	chart,
	yScale,
	ticks = 5,
	labelsPosition = "outside",
	yAxisTickLabel = "",
	dimValues
}) => {
	return (
		<g transform={`translate(${chart.width}, 0)`} >
			{yScale.ticks(ticks).map((t, t_i, t_a) => {

				var tickLabelOpacity = 1

				if(labelsPosition === "inside" && dimValues && t_i < t_a.length - 1) {
					tickLabelOpacity = 0.1
				}
				return (
					<g transform={`translate(0, ${chart.height - yScale(t)})`}
						key={t_i}
						>
						{labelsPosition === "outside" && (
							<React.Fragment>
								<text
									x={5}
									y={-5}
									fontSize="0.8rem"
									>
									{t.toLocaleString()}
									{" "}
									{yAxisTickLabel}
								</text>
								<line
									x1={5}
									x2={25}
									y1={0}
									y2={0}
									stroke="black"
									strokeWidth={1}
									/>
							</React.Fragment>
						)}
						{labelsPosition === "inside" && (
							<React.Fragment>
								<text
									x={-5}
									y={-5}
									fontSize="0.8rem"
									textAnchor="end"
									opacity={tickLabelOpacity}
									>
									{t.toLocaleString()}
									{" "}
									{yAxisTickLabel}
								</text>
							</React.Fragment>
						)}
						
					</g>
				)
			})}
		</g>
	)
}

export default AxisRight