// Pure Utility Helpers and Dijkstra Shortest Path Router for the Event Map

export const getHaversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const getCompassBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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
};

export const getDistanceToSegment = (
  userLat: number,
  userLng: number,
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const x = userLng;
  const y = userLat;
  const x1 = lng1;
  const y1 = lat1;
  const x2 = lng2;
  const y2 = lat2;

  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) {
    return getHaversineDistance(y, x, y1, x1);
  }

  let t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
  t = Math.max(0, Math.min(1, t));

  const closestLat = y1 + t * dy;
  const closestLng = x1 + t * dx;

  return getHaversineDistance(y, x, closestLat, closestLng);
};

export const getClosestPointOnSegment = (
  userLat: number,
  userLng: number,
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): { lat: number; lng: number } => {
  const x = userLng;
  const y = userLat;
  const x1 = lng1;
  const y1 = lat1;
  const x2 = lng2;
  const y2 = lat2;

  const dx = x2 - x1;
  const dy = y2 - y1;

  if (dx === 0 && dy === 0) {
    return { lat: y1, lng: x1 };
  }

  let t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy);
  t = Math.max(0, Math.min(1, t));

  return {
    lat: y1 + t * dy,
    lng: x1 + t * dx
  };
};

export const getCategoryEmoji = (cat: string): string => {
  const c = (cat || '').toLowerCase();
  if (c.includes('toilet') || c.includes('washroom') || c.includes('restroom')) return '🚺';
  if (c.includes('police') || c.includes('security') || c.includes('guard')) return '👮';
  if (c.includes('medical') || c.includes('hospital') || c.includes('first aid') || c.includes('camp')) return '🏥';
  if (c.includes('water') || c.includes('drinking')) return '💧';
  if (c.includes('food') || c.includes('canteen') || c.includes('dining')) return '🍽️';
  if (c.includes('temple') || c.includes('gate') || c.includes('darshan')) return '🛕';
  if (c.includes('help') || c.includes('information')) return 'ℹ️';
  return '📍';
};

export const DijkstraRouter = {
  findShortestPath(ns: any[], es: any[], startId: string, endId: string): any[] | null {
    const sNodeId = String(startId);
    const eNodeId = String(endId);

    if (sNodeId === eNodeId) {
      const node = ns.find(n => String(n.id) === sNodeId);
      return node ? [node] : null;
    }

    const graph: any = {};
    ns.forEach(node => {
      graph[String(node.id)] = { node, neighbors: [] };
    });

    const getDist = (n1: any, n2: any) => {
      return getHaversineDistance(Number(n1.latitude), Number(n1.longitude), Number(n2.latitude), Number(n2.longitude));
    };

    es.forEach(edge => {
      const sId = String(edge.start_node_id || edge.startNodeId);
      const eId = String(edge.end_node_id || edge.endNodeId);
      if (graph[sId] && graph[eId]) {
        const dist = getDist(graph[sId].node, graph[eId].node);
        graph[sId].neighbors.push({ targetId: eId, distance: dist });
        graph[eId].neighbors.push({ targetId: sId, distance: dist });
      }
    });

    const distances: any = {};
    const previous: any = {};
    const unvisited = new Set<string>();

    ns.forEach(node => {
      const nId = String(node.id);
      distances[nId] = Infinity;
      previous[nId] = null;
      unvisited.add(nId);
    });

    distances[sNodeId] = 0;

    while (unvisited.size > 0) {
      let currentNodeId: string | null = null;
      let minDistance = Infinity;

      unvisited.forEach(nodeId => {
        if (distances[nodeId] < minDistance) {
          minDistance = distances[nodeId];
          currentNodeId = nodeId;
        }
      });

      if (currentNodeId === null || distances[currentNodeId] === Infinity) {
        break;
      }

      if (currentNodeId === eNodeId) {
        break;
      }

      unvisited.delete(currentNodeId);

      const neighbors = graph[currentNodeId].neighbors;
      for (const neighbor of neighbors) {
        const neighborId = neighbor.targetId;
        if (!unvisited.has(neighborId)) continue;

        const alt = distances[currentNodeId] + neighbor.distance;
        if (alt < distances[neighborId]) {
          distances[neighborId] = alt;
          previous[neighborId] = currentNodeId;
        }
      }
    }

    if (distances[eNodeId] === Infinity) {
      return null;
    }

    const path: any[] = [];
    let currentId: string | null = eNodeId;
    while (currentId !== null) {
      const node = ns.find(n => String(n.id) === currentId);
      if (node) path.unshift(node);
      currentId = previous[currentId];
    }

    return path;
  }
};
