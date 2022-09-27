import _ from "lodash"
import React from "react"


var axisRoundingMultiples = [
	{
		multiple: 1_000_000,
		text: "M"
	},
	{
		multiple: 1_000_000_000,
		text: "B"
	}
]

const AxisRight = ({
	chart,
	yScale,
	ticks = 5,
	labelsPosition = "outside",
	yAxisTickLabel = "",
	dimValues
}) => {
	var domainTop = yScale.domain()[1]

	var topMultiple = axisRoundingMultiples.filter(m => m.multiple < domainTop)
	topMultiple = _.last(topMultiple)

	var multipleRounding = _.get(topMultiple, "multiple", 1)
	var multipleText = _.get(topMultiple, "text", "")

	return (
		<g transform={`translate(${chart.width}, 0)`} >
			{yScale.ticks(ticks).map((t, t_i, t_a) => {

				var tickLabelOpacity = 1

				if(labelsPosition === "inside" && dimValues && t_i < t_a.length - 1) {
					tickLabelOpacity = 0.1
				}
				var roundedTickValue = t

				if (multipleRounding !== 1) {
					roundedTickValue = _.round(t / multipleRounding, 1)
				}
				roundedTickValue = roundedTickValue.toLocaleString()
				var tickLabelString = `${roundedTickValue}${multipleText} ${yAxisTickLabel}`
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
									{tickLabelString}
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
									{tickLabelString}
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