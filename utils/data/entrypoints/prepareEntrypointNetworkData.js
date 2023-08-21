import _ from "lodash"
import chroma from "chroma-js"


function prepareEntrypointNetworkData(data, TOP_NODES_COUNT=200, CONTAINER_WIDTH = 1000) {

    var callerCounter = 0
    var calleeCounter = 0

    var calleeNodeIndexes = []

    var nodes = data.nodes.slice(0, TOP_NODES_COUNT).map((node, i) => {

        // Classifying nodes as caller and/or callee
        var isCaller = false
        var isCallee = false

        if(node.transactions_to_node > 0) {
            isCallee = true
            calleeCounter++
            calleeNodeIndexes.push(i)
        }
        if(node.transactions_from_node > 0) {
            isCaller = true
            callerCounter++
        }

        var node_id = node.id
        var nodeLabelShortened = `${node_id.slice(0, 4)}...${node_id.slice(node_id.length - 4, node_id.length)}`
        var label = nodeLabelShortened
        
        var subLabel = false

        var alias = _.get(node, "alias", false)

        if(_.isString(alias) && alias.length > 0) {
            label = alias
            subLabel = nodeLabelShortened
            var max_alias_label_length = 20
            if (label.length > max_alias_label_length) {
                label = label.slice(0, max_alias_label_length) + "..."
            }
        }

        return {
            ...node,
            label: label,
            subLabel: subLabel,
            isCaller: isCaller,
            isCallee: isCallee,
            caller_index: callerCounter,
            callee_index: calleeCounter
        }
    })
    

    // Applying node style attributes
    nodes = nodes.map((node, i) => {

        var backgroundColor = "rgba(255,255,255,0.8)"
        var fontSize = 8

        var textColor = "rgba(150,150,150,1.0)"

        if(node.isCallee) {
            backgroundColor = "rgba(0,0,0,0.8)"
            textColor =  "rgba(255,255,255,1.0)"
            if(node.callee_index === 1) {
                fontSize = 20
            } else if(node.callee_index < 3) {
                fontSize = 12
            }
        } else if(node.isCaller) {
            if (node.caller_index < 5) {
                fontSize = 12
            }
        }
       

        return {
            ...node,
            styles: {
                textColor: textColor,
                backgroundColor: backgroundColor,
                fontSize: fontSize

            }
        }
    })

    if (_.inRange(calleeCounter, 2, 5)) {
        var RADIUS = _.clamp(CONTAINER_WIDTH  / 4, 100, 250)
        var Y_FLATTENING = 0.5
        _.range(calleeCounter).forEach(i => {
            nodes[calleeNodeIndexes[i]].fx = Math.sin(i / calleeCounter * 2 * Math.PI + Math.PI * 0.5) * RADIUS
            nodes[calleeNodeIndexes[i]].fy = Math.cos(i / calleeCounter * 2 * Math.PI + Math.PI * 0.5) * RADIUS * Y_FLATTENING
        })
    } else {
        nodes[calleeNodeIndexes[0]].fx = 0
        nodes[calleeNodeIndexes[0]].fy = 0
    }

    if(nodes.length === 2) {
        nodes.forEach((node, node_i) => {
            if(node.isCallee) {
                node.fx = 100
                node.fy = -50 + node_i * 100
            }
        })
        // nodes[0].fx = 50
        // nodes[0].fy = -20
        // nodes[1].fx = -50
        // nodes[1].fy = 20
    }

    


    var nodesSlicedCount = data.nodes.length - nodes.length
    var nodeIds = nodes.map(node => node.id)

    var links = data.links.filter(link => {
        return nodeIds.includes(link.sender) && nodeIds.includes(link.target)
    })
    var totalLinks = links.length
    var maxTransactionsLinks = _.max(links.map(link => link.transactions))

    var linkColorScale = chroma.scale(['#2A4858','#fafa6e']).domain([0, 1]).mode('lch')

    var MAX_LINK_DISTANCE = 200
    var MIN_LINK_DISTANCE = 20
    var LINK_DISTANCE_RANGE = MAX_LINK_DISTANCE - MIN_LINK_DISTANCE
    var CONTAINER_WIDTH_ADJUSTMENT = _.clamp(CONTAINER_WIDTH / 1000, 0.5, 1)
    links = links.map((l, i) => {
        var l_time = i / totalLinks
        return {
            ...l,
            source: l.sender,
            l_time: l_time,
            distance: MAX_LINK_DISTANCE - Math.round(l.transactions / maxTransactionsLinks * LINK_DISTANCE_RANGE) / CONTAINER_WIDTH_ADJUSTMENT,
            value: Math.round(l.transactions / maxTransactionsLinks * 10),
            styles: {
                color: linkColorScale(l_time).hex()
            }
        }
    }).reverse()


    if(nodes.length === 4 && links.length === 2) {
        var RADIUS = 100
        var Y_FLATTENING = 0.5
        _.range(nodes.length).forEach(i => {
            if (nodes[i].isCallee) {
            nodes[i].fx = Math.sin(i / calleeCounter * 1 * Math.PI + Math.PI * 0.6) * RADIUS
            nodes[i].fy = Math.cos(i / calleeCounter * 1 * Math.PI + Math.PI * 0.6) * RADIUS * Y_FLATTENING
            }
        })
    }
    if(nodes.length === 3 && links.length === 2) {
        var RADIUS = 100
        var Y_FLATTENING = 0.5
        _.range(nodes.length).forEach(i => {
            if (nodes[i].isCallee) {
            nodes[i].fx = Math.sin(i / calleeCounter * 1 * Math.PI + Math.PI * 1.5) * RADIUS
            nodes[i].fy = Math.cos(i / calleeCounter * 1 * Math.PI + Math.PI * 1.5) * RADIUS * Y_FLATTENING
            }
        })
    }

    var linksSlicedCount = data.links.length - links.length


    var remainingNodeCount = data.remaining_node_count + nodesSlicedCount
    var remainingLinkCount = data.remaining_link_count + linksSlicedCount
    var reducedNetwork = {
        nodes: nodes.reverse(),
        links: links,
        reduction: "top 100 nodes",
        remaining_node_count: remainingNodeCount,
        remaining_link_count: remainingLinkCount
    }

    return reducedNetwork
}

export default prepareEntrypointNetworkData