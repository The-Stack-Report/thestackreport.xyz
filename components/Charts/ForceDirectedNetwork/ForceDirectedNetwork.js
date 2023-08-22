import React, {
    useState,
    useEffect,
    useRef,
    useMemo
} from "react"
import {
    Box
} from "@chakra-ui/react"
import useDebounce from "utils/hooks/useDebounce";
import { useDebouncedCallback } from 'use-debounce'
import _ from "lodash"
import ForceGraph2D from "react-force-graph-2d";
import customXForce from "./customXForce";
import * as d3 from "d3";
import SelectedNodeCard from "./components/SelectedNodeCard";

var forceXTicks = 0

const ForceDirectedNetwork = ({
    data,
    width,
    height,
}) => {
    const fgRef = useRef();
    const containerRef = useRef();
    const [zoomTransform, setZoomTransform] = useState({x: 0, y: 0, k: 1})
    const [isDragging, setIsDragging] = useState(false)
    const [isVisible, setIsVisible] = useState(true)
    const [hoveredNode, setHoveredNode] = useState(false)
    const [initialZoomDone, setInitialZoomDone] = useState(false)
    const [selectedNode, setSelectedNode] = useState(false)

    // Add event listener to window for pointer up events to set dragging to false
    useEffect(() => {
        const handlePointerUp = () => {
            setIsDragging(false)
        }
        window.addEventListener("pointerup", handlePointerUp)
        return () => {
            window.removeEventListener("pointerup", handlePointerUp)
        }
    }, [])

    // See if container rect is visible upon window scrolling with a configurable amount of margin
    useEffect(() => {
        const handleScroll = () => {
            if(containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect()
                const MARGIN = 200
                const isVisible = containerRect.top < window.innerHeight - MARGIN && containerRect.bottom > MARGIN
                setIsVisible(isVisible)

                if(isVisible === false) {
                    fgRef.current.pauseAnimation()
                } else {
                    fgRef.current.resumeAnimation()
                }
            }
        }
        window.addEventListener("scroll", handleScroll)
        return () => {
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])


    useEffect(() => {
        if(fgRef.current) {
            const fg = fgRef.current;

            // Deactivate existing forces
            fg.d3Force('center', d3.forceCenter().strength(1));
            fg.d3Force('charge', null);
            fg.d3Force("charge", d3.forceManyBody().strength(-70).distanceMax(250))
            fg.d3Force("charge2", d3.forceManyBody().strength(50).distanceMin(2000))
            fg.d3Force("x", customXForce().x(0).strength(n => {
                return -3
            }))

            fg.d3Force("y", d3.forceY().strength(0.001))

            fg.d3Force("link", d3.forceLink().id(d => d.id).distance((l) => {
                return l.distance
                return 10
            }).strength(0.6))
            // fg.d3Force('charge', d3.forceManyBody().strength(-30));

            // Add collision and bounding box forces
            fg.d3Force('collide', d3.forceCollide(6));

            fg.d3Force('box', () => {

                data.nodes.forEach(node => {
                const x = node.x || 0, y = node.y || 0;

                var X_LOWER = width / 2 * -1
                var X_UPPER = width / 2

                var Y_LOWER = height / 2 * -1
                var Y_UPPER = height / 2

                const r = 4;

                node.vx = Math.max(-1, Math.min(1, node.vx));
                node.vy = Math.max(-1, Math.min(1, node.vy));

                if (x - r < X_LOWER) {
                    node.x = X_LOWER + r;
                    node.vx = Math.abs(node.vx)
                }; // bounce on left wall
                if (x + r > X_UPPER) {
                    node.x = X_UPPER - r;
                    node.vx = -Math.abs(node.vx)
                }; // bounce on right wall

                if (y - r < Y_LOWER) {
                    node.y = Y_LOWER + r;
                    node.vy = Math.abs(node.vy)
                }; // bounce on top wall
                if (y + r > Y_UPPER) {
                    node.y = Y_UPPER - r;
                    node.vy = -Math.abs(node.vy)
                };


                // bounce on box walls
                });
            })
        }
    }, [fgRef, data.nodes, height, width]);

    var linkedNodeIDs = useMemo(() => {
        // Create array of node IDs that are directly linked with selected node
        var selectedNodeId = _.get(selectedNode, "id", false)
        if(selectedNodeId) {
            return data.links.filter(link => {
                return link.source.id === selectedNodeId || link.target.id === selectedNodeId
            }).map(link => {
                return link.source.id === selectedNodeId ? link.target.id : link.source.id
            })
        } else {
            return []
        }
    }, [selectedNode, data])

    var paralax = 1/3

    var bgSizeScaling = 20
    var kScaled = zoomTransform ? zoomTransform.k : 1
    kScaled = (kScaled - 1) / 3 + 1
    var backgroundSizeZoom = `${_.round(bgSizeScaling*zoomTransform.k)}px ${_.round(bgSizeScaling*kScaled)}px`

    var bgX = 0 + (zoomTransform ? zoomTransform.x*paralax : 0)
    var bgY = 0 + (zoomTransform ? zoomTransform.y*paralax : 0)
    var bgPosition = `${_.round(bgX)}px ${_.round(bgY)}px, ${backgroundSizeZoom}`

    var backgroundSize = "20px 20px"


    var cursor = isDragging ? "grabbing" : "grab"

    if(_.isObject(hoveredNode)) {
        cursor = "pointer"
    }

    return (
        <Box
            backgroundImage="radial-gradient(rgb(230,230,230) 1px, transparent 0)"
            backgroundSize={backgroundSize}
            backgroundPosition={bgPosition}
            cursor={cursor}
            _hover={{
                backgroundImage:"radial-gradient(rgb(150,150,150) 1px, transparent 0)"
            }}
            onPointerDown={() => {
                setIsDragging(true)
            }}
            onPointerUp={() => {
                setIsDragging(false)
            }}
            ref={containerRef}
            position="relative"
            height={height}
            >
            <SelectedNodeCard
                node={selectedNode}
                setSelectedNode={setSelectedNode}
                />
            <ForceGraph2D
                ref={fgRef}
                graphData={data}
                nodeAutoColorBy="group"
                enableNodeDrag={true}
                cooldownTime={Infinity}
                d3VelocityDecay={0.3}
                d3AlphaDecay={0.01}
                warmupTicks={100}
                cooldownTicks={1000}
                minZoom={1}
                maxZoom={3}
                enableZoomInteraction={false}
                linkCurvature={0.25}
                linkWidth={1}
                linkColor={(link) => {
                    var linkTargetingSelectedNode = _.get(selectedNode, "id", false) === _.get(link, "target.id", false)
                    var linkSourceSelectedNode = _.get(selectedNode, "id", false) === _.get(link, "source.id", false)
                    if (_.isObject(selectedNode) && !linkTargetingSelectedNode && !linkSourceSelectedNode) {
                        return `rgba(150,150,150,0.2)`
                    }

                    return _.get(link, "styles.color", "grey")
                }}
                linkDirectionalParticles={(link) => {
                    return _.clamp(link.value, 1, 15)
                }}
                linkDirectionalParticleWidth={3}
                linkDirectionalParticleSpeed={0.005}
                onZoom={(transform) => {
                    var x = _.floor(transform.x)
                    var y = _.floor(transform.y)
                    var k = _.floor(transform.k)
                    if(x !== _.floor(zoomTransform.x) ||
                        y !== _.floor(zoomTransform.y) ||
                        k !== _.floor(zoomTransform.k) ) {
                        setZoomTransform(transform)
                    }
                }}
                onEngineStop={() => {
                    if (initialZoomDone === false) {
                        fgRef.current.zoomToFit(100, 100)
                        setInitialZoomDone(true)
                    }
                }}

                nodeCanvasObject={(node, ctx, globalScale) => {
                    var nodeIsSelected = _.get(selectedNode, "id", false) === _.get(node, "id", false)

                    var label = _.get(node, "label", node.id)
                    const fontSize = _.get(node, "styles.fontSize", 10)/globalScale;
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(label).width;
                    const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
                    // ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    // if(node.type === "callee") {
                    //     ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
                    // }
                    var bgFillColor = _.get(node, "styles.backgroundColor", "rgba(255,255,255,0.8)")
                    var textFillColor = _.get(node, "styles.textColor", "red")
                    if(_.isObject(selectedNode) && !nodeIsSelected) {
                        if(linkedNodeIDs.includes(node.id)) {
                            bgFillColor = bgFillColor.replace("0.8", "0.8")
                            textFillColor = textFillColor.replace("1.0", "0.9")
                        } else {
                            bgFillColor = bgFillColor.replace("0.8", "0.2")
                            textFillColor = textFillColor.replace("1.0", "0.2")
                        }
                    }

                    
                    ctx.fillStyle = bgFillColor

                    // Set fill opacity to 0.8 by default

                    ctx.fillRect(node.x - bckgDimensions[0] / 2, node.y - bckgDimensions[1] / 2, ...bckgDimensions);
                    
                    ctx.fillStyle = textFillColor
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    
                    ctx.fillText(label, node.x, node.y);

                    var hoverBounds = {
                        x: node.x - bckgDimensions[0] / 2,
                        y: node.y - bckgDimensions[1] / 2,
                        width: bckgDimensions[0],
                        height: bckgDimensions[1]
                    }

                    const DRAW_COORDINATES = false
                    if(DRAW_COORDINATES) {
                        ctx.fillText(_.round(node.x), node.x, node.y - 10)
                    }


                    if (_.has(node, "subLabel") && _.isString(node.subLabel) && node.subLabel.length > 0) {
                        var subLabelSpacing = 1
                        var labelShift = bckgDimensions[1] + subLabelSpacing
                        ctx.fillStyle = bgFillColor
                        ctx.fillRect(
                            node.x - bckgDimensions[0] / 2,
                            node.y - bckgDimensions[1] / 2 + labelShift,
                            ...bckgDimensions);
                        ctx.fillStyle = textFillColor
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        
                        ctx.fillText(node.subLabel, node.x, node.y + labelShift);

                        hoverBounds.height += labelShift 

                    }

                    if(_.get(node, "id", false) === _.get(hoveredNode, "id", false)) {
                        var HOVER_PADDING = 1

                        ctx.fillStyle = "rgba(0,0,0,0.1)"
                        ctx.strokeStyle = "#2A4858"
                        ctx.lineWidth = 1
                        ctx.strokeRect(
                            hoverBounds.x - HOVER_PADDING,
                            hoverBounds.y - HOVER_PADDING,
                            hoverBounds.width + HOVER_PADDING*2,
                            hoverBounds.height + HOVER_PADDING * 2
                        )
                    }

                    node.__hoverBounds = hoverBounds
                }}

                nodePointerAreaPaint={(node, color, ctx) => {
                    ctx.fillStyle = color;
                    const bckgDimensions = node.__hoverBounds;
                    bckgDimensions && ctx.fillRect(
                        bckgDimensions.x,
                        bckgDimensions.y,
                        bckgDimensions.width,
                        bckgDimensions.height
                    );
                }}

                onNodeHover={(node) => {
                    setHoveredNode(node)
                }}

                onNodeClick={(node, event) => {
                    var selectedNodeId = _.get(selectedNode, "id", false)
                    var nodeId = _.get(node, "id", false)
                    if(selectedNode && selectedNode.id === node.id) {
                        setSelectedNode(false)
                    } else {
                        setSelectedNode(node)
                    }
                }}

                onNodeDragEnd={node => {
                    node.fx = node.x;
                    node.fy = node.y;
                    node.fz = node.z;
                  }}

                width={width}
                height={height}
                />
        </Box>
    )
}

const ForceDirectedNetworkWrapper = ({
    data,
    width,
    height
}) => {
    const containerRef = useRef(null)
    const [containerRendered, setContainerRendered] = useState(false)
    const [windowResizeCounter, setWindowResizeCounter] = useState(0)


    useEffect(() => {
        if(windowResizeCounter === 0) setWindowResizeCounter(1) 
    }, [windowResizeCounter])

    const handleResize = useDebouncedCallback(
        () => setWindowResizeCounter((c) => c + 1), 50
    );
    
    useEffect(() => {
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [handleResize]);

    useEffect(() => {
        if(containerRef.current) {
            setContainerRendered(true)
        }
    }, [])

    const containerWidth = containerRendered ? containerRef.current.offsetWidth : 0

    var renderWidth = useDebounce(containerWidth, 100)

    return (
        <Box
            width={width}
            height={height}
            ref={containerRef}
            overflow={"hidden"}
            >
                {containerRendered && (
                <ForceDirectedNetwork
                    data={_.cloneDeep(data)}
                    width={renderWidth}
                    height={height}
                    containerRef={containerRef}
                    containerRendered={containerRendered}
                    />
            )}
        </Box>
    )
}


export default ForceDirectedNetworkWrapper