'use client'
// This component is dynamically imported (ssr: false) due to Leaflet's browser-only requirement.
// Do NOT import this directly — use SupplierGeoMap.tsx which wraps it with next/dynamic.

import { useEffect } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

interface Node {
  id: string
  name: string
  lat: number
  lng: number
  status: string
  risk_score: number
  type: string
}

interface Edge {
  source: string
  target: string
  weight: number
}

interface Props {
  nodes: Node[]
  edges: Edge[]
  offline: Set<string>
  onNodeClick: (id: string) => void
}

const STATUS_COLORS: Record<string, string> = {
  green: '#10b981',
  amber: '#f59e0b',
  red: '#ef4444',
  offline: '#6b7280',
}

function FitBounds({ nodes }: { nodes: Node[] }) {
  const map = useMap()
  useEffect(() => {
    if (nodes.length > 0) {
      const lats = nodes.map(n => n.lat)
      const lngs = nodes.map(n => n.lng)
      map.fitBounds(
        [[Math.min(...lats) - 1, Math.min(...lngs) - 1], [Math.max(...lats) + 1, Math.max(...lngs) + 1]],
        { padding: [30, 30] }
      )
    }
  }, [nodes, map])
  return null
}

export default function LeafletMap({ nodes, edges, offline, onNodeClick }: Props) {
  const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]))

  return (
    <MapContainer
      center={[22.0, 82.0]}
      zoom={5}
      style={{ height: '420px', width: '100%', borderRadius: '12px', zIndex: 1 }}
      scrollWheelZoom={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      <FitBounds nodes={nodes} />

      {/* Draw edges as thin lines */}
      {edges.map((edge, i) => {
        const src = nodeById[edge.source]
        const tgt = nodeById[edge.target]
        if (!src || !tgt) return null
        return (
          <Polyline
            key={`edge-${i}`}
            positions={[[src.lat, src.lng], [tgt.lat, tgt.lng]]}
            color="rgba(59,130,246,0.35)"
            weight={1.5}
            dashArray="4 4"
          />
        )
      })}

      {/* Draw node dots */}
      {nodes.map((node) => {
        const isOffline = offline.has(node.id)
        const status = isOffline ? 'offline' : node.status
        const color = STATUS_COLORS[status] || STATUS_COLORS.green
        const radius = 10 + node.risk_score * 12

        return (
          <CircleMarker
            key={node.id}
            center={[node.lat, node.lng]}
            radius={radius}
            pathOptions={{
              fillColor: color,
              color: isOffline ? '#374151' : color,
              weight: 2,
              opacity: 1,
              fillOpacity: isOffline ? 0.3 : 0.75,
            }}
            eventHandlers={{ click: () => onNodeClick(node.id) }}
          >
            <Popup>
              <div style={{ minWidth: '140px' }}>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>{node.name}</p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>Type: {node.type}</p>
                <p style={{ fontSize: '12px', color: '#6b7280' }}>Risk Score: {(node.risk_score * 100).toFixed(0)}%</p>
                <p style={{ fontSize: '12px', color: isOffline ? '#ef4444' : color, fontWeight: 600, marginTop: 4 }}>
                  Status: {isOffline ? '⚠️ Offline (Simulated)' : status.toUpperCase()}
                </p>
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: 4 }}>Click to toggle disruption simulation</p>
              </div>
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
