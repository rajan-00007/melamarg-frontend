'use client';

import React, { useEffect, useRef } from 'react';
import { MapWrapperContainer } from './page.styled';

interface AdvisoryMiniMapProps {
  advisory: any;
  routeNodes: any[];
  routeEdges: any[];
  leafletLoaded: boolean;
}

export default function AdvisoryMiniMap({
  advisory,
  routeNodes,
  routeEdges,
  leafletLoaded
}: AdvisoryMiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!leafletLoaded || !containerRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    // Find start and end nodes to center the map and plot markers
    const startNode = routeNodes.find(n => n.id === advisory.start_node_id);
    const endNode = routeNodes.find(n => n.id === advisory.end_node_id);

    let center: [number, number] = [20.296, 85.824]; // Fallback to event area center
    if (startNode) {
      center = [Number(startNode.latitude), Number(startNode.longitude)];
    } else if (endNode) {
      center = [Number(endNode.latitude), Number(endNode.longitude)];
    }

    // Clean up previous map if exists
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Initialize local Leaflet map
    const map = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: !L.Browser.mobile,
      touchZoom: true,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      boxZoom: false
    }).setView(center, 16);

    mapRef.current = map;

    // Standard light tile layer matching other maps
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // Plot advisory edges (Blocked in Red, Detour in Green)
    if (advisory.edges && Array.isArray(advisory.edges)) {
      advisory.edges.forEach((ae: any) => {
        const edge = routeEdges.find(e => e.id === ae.edge_id);
        if (edge) {
          const sNode = routeNodes.find(n => n.id === edge.start_node_id || n.id === (edge as any).startNodeId);
          const eNode = routeNodes.find(n => n.id === edge.end_node_id || n.id === (edge as any).endNodeId);
          if (sNode && eNode) {
            const color = ae.status === 'blocked' ? '#ef4444' : '#10b981';
            
            // Visual thick corridor
            L.polyline([
              [Number(sNode.latitude), Number(sNode.longitude)],
              [Number(eNode.latitude), Number(eNode.longitude)]
            ], {
              color,
              weight: 12,
              opacity: 0.3,
              lineJoin: 'round',
              lineCap: 'round'
            }).addTo(map);

            // Center lines
            L.polyline([
              [Number(sNode.latitude), Number(sNode.longitude)],
              [Number(eNode.latitude), Number(eNode.longitude)]
            ], {
              color,
              weight: 3,
              opacity: 0.9,
              dashArray: ae.status === 'blocked' ? undefined : '5, 5',
              lineJoin: 'round',
              lineCap: 'round'
            }).addTo(map);
          }
        }
      });
    }

    // Add Start Node Marker (Red Circle)
    if (startNode) {
      const startIcon = L.divIcon({
        className: 'advisory-start-icon',
        html: `<div style="background-color: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.6);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      L.marker([Number(startNode.latitude), Number(startNode.longitude)], { icon: startIcon })
        .addTo(map)
        .bindTooltip(advisory.title || "Divert Start", { permanent: false, direction: 'top' });
    }

    // Add End Node Marker (Green Circle)
    if (endNode) {
      const endIcon = L.divIcon({
        className: 'advisory-end-icon',
        html: `<div style="background-color: #10b981; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.6);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      L.marker([Number(endNode.latitude), Number(endNode.longitude)], { icon: endIcon })
        .addTo(map)
        .bindTooltip("Divert End", { permanent: false, direction: 'top' });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [leafletLoaded, advisory, routeNodes, routeEdges]);

  return <MapWrapperContainer ref={containerRef} />;
}
