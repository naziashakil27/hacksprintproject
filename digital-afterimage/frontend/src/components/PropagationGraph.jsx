import React, { useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { HardDrive, User, Database, FileSpreadsheet, Share2, Globe, ShieldAlert, AlertTriangle, Eye, HelpCircle } from 'lucide-react';

// Custom Warm Node Component
const CustomGraphNode = ({ data }) => {
  const isPublic = data.is_critical_exposure || data.type === 'public_exposure';
  const isCopy = data.type === 'copy';
  const isUser = data.type === 'user';
  const isShare = data.type === 'share';
  const isStorage = data.type === 'storage';

  let borderClass = 'border-[#D8C9BC] bg-[#FFF9F4] text-[#342C28] shadow-subtle';
  let categoryLabel = 'SYSTEM';
  let icon = <HardDrive className="w-3.5 h-3.5 text-[#B86F62]" />;

  if (isPublic) {
    borderClass = 'border-[#A9564F] bg-[#F4E3D7] text-[#342C28] shadow-panel ring-1 ring-[#A9564F]/30';
    categoryLabel = 'EXPOSURE';
    icon = <Globe className="w-3.5 h-3.5 text-[#A9564F]" />;
  } else if (isShare) {
    borderClass = 'border-[#C28A58]/60 bg-[#F1E6DC] text-[#342C28]';
    categoryLabel = 'BOUNDARY';
    icon = <Share2 className="w-3.5 h-3.5 text-[#C28A58]" />;
  } else if (isCopy) {
    borderClass = 'border-[#D8C9BC] bg-[#FFF9F4] text-[#342C28]';
    categoryLabel = 'DERIVED COPY';
    icon = <FileSpreadsheet className="w-3.5 h-3.5 text-[#B86F62]" />;
  } else if (isUser) {
    borderClass = 'border-[#D8C9BC] bg-[#FFF9F4] text-[#342C28]';
    categoryLabel = 'ACTOR';
    icon = <User className="w-3.5 h-3.5 text-[#81746B]" />;
  } else if (isStorage) {
    borderClass = 'border-[#D8C9BC] bg-[#FFF9F4] text-[#342C28]';
    categoryLabel = 'STORAGE';
    icon = <Database className="w-3.5 h-3.5 text-[#443A35]" />;
  }

  // Evidence badge pill styling
  let badgeColor = 'bg-[#788B72]/15 text-[#788B72] border-[#788B72]/30';
  let badgeIcon = <Eye className="w-2.5 h-2.5" />;
  if (data.evidence_type === 'INFERRED') {
    badgeColor = 'bg-[#C28A58]/15 text-[#C28A58] border-[#C28A58]/30';
    badgeIcon = <AlertTriangle className="w-2.5 h-2.5" />;
  } else if (data.evidence_type === 'UNKNOWN') {
    badgeColor = 'bg-[#81746B]/15 text-[#81746B] border-[#81746B]/30';
    badgeIcon = <HelpCircle className="w-2.5 h-2.5" />;
  }

  return (
    <div className={`px-3.5 py-2.5 rounded-lg border min-w-[170px] font-sans ${borderClass}`}>
      <Handle type="target" position={Position.Left} className="!bg-[#B86F62] !w-2 !h-2" />
      
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-[#F1E6DC]">
            {icon}
          </div>
          <div>
            <div className="font-bold text-xs text-[#342C28] font-mono leading-tight">{data.label}</div>
            <div className="text-[9px] text-[#81746B] uppercase font-mono tracking-wider mt-0.5">{categoryLabel}</div>
          </div>
        </div>
      </div>

      <div className="mt-2 pt-1.5 border-t border-[#D8C9BC]/60 flex items-center justify-between gap-2 text-[10px] font-mono">
        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border ${badgeColor}`}>
          {badgeIcon}
          {data.evidence_type}
        </span>
        {data.timestamp && (
          <span className="text-[#81746B]">{data.timestamp}</span>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="!bg-[#B86F62] !w-2 !h-2" />
    </div>
  );
};

const nodeTypes = {
  customNode: CustomGraphNode,
};

export default function PropagationGraph({ 
  graphData, 
  sliderStep, 
  onNodeClick, 
  onEdgeClick 
}) {
  const { nodes, edges } = useMemo(() => {
    if (!graphData || !graphData.nodes) {
      return { nodes: [], edges: [] };
    }

    const totalSteps = graphData.nodes.length;
    const activeCount = sliderStep !== undefined 
      ? Math.max(1, Math.min(sliderStep + 1, totalSteps))
      : totalSteps;

    const visibleNodes = graphData.nodes.slice(0, activeCount).map((node, index) => {
      const posX = 30 + index * 210;
      const posY = 110 + (index % 2 === 0 ? -35 : 35);

      return {
        id: node.id,
        type: 'customNode',
        position: { x: posX, y: posY },
        data: node,
      };
    });

    const nodeIdsSet = new Set(visibleNodes.map(n => n.id));

    const visibleEdges = (graphData.edges || [])
      .filter(e => nodeIdsSet.has(e.source) && nodeIdsSet.has(e.target))
      .map(edge => {
        const isCriticalEdge = edge.action === 'PUBLIC_ACCESS_ENABLED' || edge.risk_weight >= 25;
        const isInferredEdge = edge.evidence_type === 'INFERRED';
        const isUnknownEdge = edge.evidence_type === 'UNKNOWN';

        let strokeColor = '#B86F62'; // Terracotta solid default
        let strokeDash = 'none';
        let strokeWidth = 2;

        if (isCriticalEdge) {
          strokeColor = '#A9564F'; // Critical red/terracotta
          strokeWidth = 2.5;
        } else if (isInferredEdge) {
          strokeColor = '#C28A58'; // Inferred amber
          strokeDash = '6,6';
        } else if (isUnknownEdge) {
          strokeColor = '#81746B'; // Unknown gray
          strokeDash = '3,3';
        }

        return {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          animated: true,
          label: edge.label,
          labelStyle: { fill: '#342C28', fontSize: 9, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 },
          labelBgStyle: { fill: '#FFF9F4', fillOpacity: 0.95, rx: 3 },
          labelBgPadding: [5, 3],
          style: {
            stroke: strokeColor,
            strokeWidth: strokeWidth,
            strokeDasharray: strokeDash,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: strokeColor,
          },
          data: edge,
        };
      });

    return { nodes: visibleNodes, edges: visibleEdges };
  }, [graphData, sliderStep]);

  return (
    <div className="w-full h-full min-h-[420px] bg-[#FFF9F4] relative rounded-xl border border-[#D8C9BC] overflow-hidden shadow-panel">
      {/* Visual Header Banner */}
      <div className="absolute top-3 left-4 z-10 flex items-center gap-2 bg-[#F1E6DC]/90 border border-[#D8C9BC] rounded-lg px-3 py-1.5 font-mono text-xs text-[#342C28] shadow-subtle">
        <ShieldAlert className="w-4 h-4 text-[#B86F62]" />
        <span className="font-bold">PROPAGATION MAP</span>
        <span className="text-[#81746B] text-[10px] uppercase">| Forensic Telemetry View</span>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => onNodeClick && onNodeClick(node.data)}
        onEdgeClick={(_, edge) => onEdgeClick && onEdgeClick(edge.data)}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Background color="#E6D9CD" gap={24} size={1} />
        <Controls className="!bg-[#FFF9F4] !border-[#D8C9BC] !text-[#342C28] shadow-subtle" />
      </ReactFlow>
    </div>
  );
}
