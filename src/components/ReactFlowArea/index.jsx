import React, { useState, useCallback } from "react";
import styles from "./index.module.scss";

import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const CustomNode = ({ data }) => {
  return (
    <div className={`archer-element ${data.label.className}`}>
      <div className="left">
        <img src={data.label.image.src} alt="" />
        <h4>{data.label.heading}</h4>
        <p>{data.label.subheading}</p>
      </div>
      <div className="right">
        <img src={data.label.image.imgSrc} alt="" />
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const initialNodes = [
  {
    id: "1",
    type: "customNode",
    position: { x: 0, y: 0 },
    data: {
      label: {
        className: "my-custom-node",
        image: {
          src: "../../assets/offering1_1.svg",
          imgSrc: "../../assets/offering1_1_img.svg",
        },
        heading: "Custom Node",
        subheading: "This is a custom node",
      },
    },
  },
  {
    id: "2",
    data: { label: "Another Node" },
    position: { x: 200, y: 200 },
  },
];

const initialEdges = [{ id: "edge-1", source: "1", target: "2" }];

const nodeTypes = { customNode: CustomNode };

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
      <Background />
      <Controls />
    </ReactFlow>
  );
};

export default Flow;
