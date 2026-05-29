'use client';

export interface EventItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  status: string;
  bundle_version: number;
  current_bundle_id?: string;
  north?: number;
  south?: number;
  east?: number;
  west?: number;
  center_lat?: number;
  center_lng?: number;
  bundle_url?: string;
  bundle_size?: number;
  metadata?: Record<string, any>;
}

export interface POIItem {
  id: string;
  name_en: string;
  name_hi?: string;
  name_or?: string;
  latitude: number;
  longitude: number;
  category_name: string;
  category_id?: string;
  description?: string;
  distance?: number;
  time?: number;
}

export interface NodeItem {
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  node_type?: string;
  poi_id?: string | null;
  is_entrance?: boolean;
}

export interface EdgeItem {
  id?: string;
  start_node_id: string;
  end_node_id: string;
}

// Dijkstra Shortest Path Router for route graph pathfinding
export class DijkstraRouter {
  static findShortestPath(
    nodes: NodeItem[],
    edges: EdgeItem[],
    startNodeId: string,
    endNodeId: string
  ): NodeItem[] | null {
    if (startNodeId === endNodeId) {
      const node = nodes.find(n => n.id === startNodeId);
      return node ? [node] : null;
    }

    const graph: { [key: string]: { node: NodeItem; neighbors: { targetId: string; distance: number }[] } } = {};
    
    nodes.forEach(node => {
      graph[node.id] = { node, neighbors: [] };
    });

    const getDistance = (n1: NodeItem, n2: NodeItem) => {
      const R = 6371e3; // Earth radius in meters
      const toRad = (d: number) => (d * Math.PI) / 180;
      const dLat = toRad(n2.latitude - n1.latitude);
      const dLng = toRad(n2.longitude - n1.longitude);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(n1.latitude)) *
          Math.cos(toRad(n2.latitude)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    edges.forEach(edge => {
      const startId = edge.start_node_id || (edge as any).startNodeId;
      const endId = edge.end_node_id || (edge as any).endNodeId;

      if (graph[startId] && graph[endId]) {
        const dist = getDistance(graph[startId].node, graph[endId].node);
        graph[startId].neighbors.push({ targetId: endId, distance: dist });
        graph[endId].neighbors.push({ targetId: startId, distance: dist });
      }
    });

    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const unvisited = new Set<string>();

    nodes.forEach(node => {
      distances[node.id] = Infinity;
      previous[node.id] = null;
      unvisited.add(node.id);
    });

    if (distances[startNodeId] === undefined || distances[endNodeId] === undefined) {
      return null;
    }

    distances[startNodeId] = 0;

    while (unvisited.size > 0) {
      let currentNodeId: string | null = null;
      let minDistance = Infinity;

      unvisited.forEach(nodeId => {
        if (distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          currentNodeId = nodeId;
        }
      });

      if (currentNodeId === null || minDistance === Infinity) {
        break;
      }

      if (currentNodeId === endNodeId) {
        break;
      }

      unvisited.delete(currentNodeId);

      const neighbors = graph[currentNodeId].neighbors;
      for (const neighbor of neighbors) {
        if (!unvisited.has(neighbor.targetId)) continue;

        const alt = distances[currentNodeId] + neighbor.distance;
        if (alt < distances[neighbor.targetId]) {
          distances[neighbor.targetId] = alt;
          previous[neighbor.targetId] = currentNodeId;
        }
      }
    }

    if (distances[endNodeId] === Infinity) {
      return null;
    }

    const pathIds: string[] = [];
    let curr: string | null = endNodeId;
    while (curr !== null) {
      pathIds.push(curr);
      curr = previous[curr];
    }
    pathIds.reverse();

    return pathIds.map(id => graph[id].node);
  }
}

// Fallback Mock Events in case API is disconnected or empty
export const MOCK_EVENTS: EventItem[] = [
  {
    id: 'mock-rath-yatra',
    name: 'RATH YATRA 2025 - PURI',
    slug: 'rath-yatra-2025',
    description: 'Annual chariot festival of Lord Jagannath in Puri, Odisha. Includes sectors for Grand Road, Beach Road, and key transit points.',
    status: 'published',
    bundle_version: 2,
    current_bundle_id: 'bundle-abc-123',
    north: 19.8150,
    south: 19.7950,
    east: 85.8350,
    west: 85.8150,
    center_lat: 19.8050,
    center_lng: 85.8250,
  },
  {
    id: 'mock-kumbh-mela',
    name: 'KUMBH MELA 2025 - PRAYAGRAJ',
    slug: 'kumbh-mela-2025',
    description: 'Mass bathing festival at the Sangam confluence of rivers in Prayagraj. Offline zones cover Sector 1 to 5, bathing ghats, and police help centers.',
    status: 'published',
    bundle_version: 1,
    current_bundle_id: 'bundle-kumbh-456',
    north: 25.4350,
    south: 25.4150,
    east: 81.8950,
    west: 81.8750,
    center_lat: 25.4250,
    center_lng: 81.8850,
  },
  {
    id: 'mock-thrissur-pooram',
    name: 'THRISSUR POORAM 2026',
    slug: 'thrissur-pooram-2026',
    description: 'Grand temple festival of Kerala featuring elephant processions, traditional music, and fireworks at Vadakkunnathan Temple, Thrissur.',
    status: 'published',
    bundle_version: 3,
    current_bundle_id: 'bundle-pooram-789',
    north: 10.5340,
    south: 10.5140,
    east: 76.2240,
    west: 76.2040,
    center_lat: 10.5244,
    center_lng: 76.2144,
  }
];

export const MOCK_POIS: POIItem[] = [
  { id: 'poi-1', name_en: 'Toilet Block — Gate 4', latitude: 19.8056, longitude: 85.8194, category_name: 'toilet', description: 'Open • Male & Female' },
];

export const MOCK_NODES: NodeItem[] = [
  { id: 'n1', latitude: 19.8048, longitude: 85.8188, name: 'Main Gate' },
  { id: 'n2', latitude: 19.8055, longitude: 85.8208, name: 'Water Booth' },
  { id: 'n3', latitude: 19.8068, longitude: 85.8240, name: 'Transit Center' },
  { id: 'n4', latitude: 19.8080, longitude: 85.8276, name: 'Sector 3' },
  { id: 'n5', latitude: 19.8099, longitude: 85.8335, name: 'Chariot Stand' },
];

export const MOCK_EDGES: EdgeItem[] = [
  { start_node_id: 'n1', end_node_id: 'n2' },
  { start_node_id: 'n2', end_node_id: 'n3' },
  { start_node_id: 'n3', end_node_id: 'n4' },
  { start_node_id: 'n4', end_node_id: 'n5' },
];

export function getHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function getCompassBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const lambda1 = (lon1 * Math.PI) / 180;
  const lambda2 = (lon2 * Math.PI) / 180;

  const y = Math.sin(lambda2 - lambda1) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(lambda2 - lambda1);
  
  const theta = Math.atan2(y, x);
  const bearing = ((theta * 180) / Math.PI + 360) % 360;
  
  return Math.round(bearing);
}

export function findOptimalEntranceNode(
  userLat: number,
  userLng: number,
  destNode: NodeItem,
  nodes: NodeItem[],
  edges: EdgeItem[]
): { nearestNodeToUser: NodeItem; minUserDist: number } {
  let nearestNode = nodes[0];
  let minGeomDist = Infinity;
  nodes.forEach((node) => {
    const dist = getHaversineDistance(userLat, userLng, node.latitude, node.longitude);
    if (dist < minGeomDist) {
      minGeomDist = dist;
      nearestNode = node;
    }
  });

  if (minGeomDist <= 100) {
    return { nearestNodeToUser: nearestNode, minUserDist: minGeomDist };
  }

  const entranceNodes = nodes.filter((node) => node.is_entrance);

  if (entranceNodes.length === 0) {
    return { nearestNodeToUser: nearestNode, minUserDist: minGeomDist };
  }

  let bestEntrance = entranceNodes[0];
  let minTotalDist = Infinity;
  let minUserDistForBest = getHaversineDistance(userLat, userLng, bestEntrance.latitude, bestEntrance.longitude);
  let foundValidPath = false;

  entranceNodes.forEach((entrance) => {
    const distToEntrance = getHaversineDistance(userLat, userLng, entrance.latitude, entrance.longitude);
    const path = DijkstraRouter.findShortestPath(nodes, edges, entrance.id, destNode.id);
    
    if (path && path.length > 0) {
      foundValidPath = true;
      let pathDist = 0;
      for (let i = 0; i < path.length - 1; i++) {
        pathDist += getHaversineDistance(path[i].latitude, path[i].longitude, path[i+1].latitude, path[i+1].longitude);
      }
      const totalDist = distToEntrance + pathDist;
      if (totalDist < minTotalDist) {
        minTotalDist = totalDist;
        bestEntrance = entrance;
        minUserDistForBest = distToEntrance;
      }
    }
  });

  if (!foundValidPath) {
    let nearestEntrance = entranceNodes[0];
    let minEntranceGeomDist = Infinity;
    entranceNodes.forEach((entrance) => {
      const dist = getHaversineDistance(userLat, userLng, entrance.latitude, entrance.longitude);
      if (dist < minEntranceGeomDist) {
        minEntranceGeomDist = dist;
        nearestEntrance = entrance;
      }
    });
    return { 
      nearestNodeToUser: nearestEntrance, 
      minUserDist: minEntranceGeomDist 
    };
  }

  return { nearestNodeToUser: bestEntrance, minUserDist: minUserDistForBest };
}

export const sanitizeBackendUrl = (url: string): string => {
  if (!url) return '';
  let cleaned = url.trim();
  cleaned = cleaned.replace(/\/+$/, '');
  if (cleaned && !/^https?:\/\//i.test(cleaned)) {
    cleaned = 'http://' + cleaned;
  }
  return cleaned;
};
