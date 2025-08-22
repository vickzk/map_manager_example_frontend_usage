import { useState, useCallback } from "react";
import { MapManagerState, MapManagerStatus, Map, Waypoint } from "@shared/schema";
import { mockMaps, mockWaypoints } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export interface UseMapManagerReturn {
  status: MapManagerStatus;
  maps: Map[];
  waypoints: Waypoint[];
  currentMap: Map | undefined;
  startMapping: () => void;
  stopMapping: () => void;
  saveMapping: (mapName: string) => void;
  loadMap: (mapId: string) => void;
  createWaypoint: (name: string, x: number, y: number) => void;
  deleteWaypoint: (waypointId: string) => void;
  updateWaypoint: (waypointId: string, updates: Partial<Waypoint>) => void;
  renameMap: (mapId: string, newLabel: string) => void;
  deleteMap: (mapId: string) => void;
}

export function useMapManager(): UseMapManagerReturn {
  const { toast } = useToast();
  const [status, setStatus] = useState<MapManagerStatus>({
    state: 'ACTIVE',
    currentMapId: mockMaps[0].id,
    isTransitioning: false,
  });
  const [maps, setMaps] = useState<Map[]>(mockMaps);
  const [waypoints, setWaypoints] = useState<Waypoint[]>(mockWaypoints);

  const currentMap = maps.find(map => map.id === status.currentMapId);
  const currentMapWaypoints = waypoints.filter(wp => wp.mapId === status.currentMapId);

  const startMapping = useCallback(() => {
    setStatus(prev => ({ ...prev, isTransitioning: true }));
    setTimeout(() => {
      setStatus(prev => ({ 
        ...prev, 
        state: 'MAPPING', 
        isTransitioning: false 
      }));
      toast({
        title: "Mapping Started",
        description: "Started mapping process",
      });
    }, 300);
  }, [toast]);

  const stopMapping = useCallback(() => {
    setStatus(prev => ({ ...prev, isTransitioning: true }));
    setTimeout(() => {
      setStatus(prev => ({ 
        ...prev, 
        state: 'ACTIVE', 
        isTransitioning: false 
      }));
      toast({
        title: "Mapping Stopped",
        description: "Mapping process stopped",
      });
    }, 300);
  }, [toast]);

  const saveMapping = useCallback((mapName: string) => {
    const newMap: Map = {
      id: crypto.randomUUID(),
      name: mapName.toLowerCase().replace(/\s+/g, '_'),
      label: mapName,
      fileName: `${mapName.toLowerCase().replace(/\s+/g, '_')}.png`,
      createdAt: new Date(),
      updatedAt: new Date(),
      isArchived: false,
      isActive: false,
    };

    setMaps(prev => [...prev, newMap]);
    
    setTimeout(() => {
      setStatus(prev => ({ 
        ...prev, 
        state: 'ACTIVE', 
        isTransitioning: false 
      }));
      toast({
        title: "Map Saved",
        description: `Map "${mapName}" saved successfully`,
      });
    }, 1000);
  }, [toast]);

  const loadMap = useCallback((mapId: string) => {
    const map = maps.find(m => m.id === mapId);
    if (map) {
      setMaps(prev => prev.map(m => ({
        ...m,
        isActive: m.id === mapId
      })));
      setStatus(prev => ({ ...prev, currentMapId: mapId }));
      toast({
        title: "Map Loaded",
        description: `Loaded map: ${map.label}`,
      });
    }
  }, [maps, toast]);

  const createWaypoint = useCallback((name: string, x: number, y: number) => {
    if (!status.currentMapId) return;

    const newWaypoint: Waypoint = {
      id: crypto.randomUUID(),
      name,
      mapId: status.currentMapId,
      x,
      y,
      frameId: "",
      tags: [],
      createdAt: new Date(),
    };

    setWaypoints(prev => [...prev, newWaypoint]);
    toast({
      title: "Waypoint Created",
      description: `Waypoint "${name}" created successfully`,
    });
  }, [status.currentMapId, toast]);

  const deleteWaypoint = useCallback((waypointId: string) => {
    const waypoint = waypoints.find(wp => wp.id === waypointId);
    setWaypoints(prev => prev.filter(wp => wp.id !== waypointId));
    
    if (waypoint) {
      toast({
        title: "Waypoint Deleted",
        description: `Waypoint "${waypoint.name}" deleted`,
      });
    }
  }, [waypoints, toast]);

  const updateWaypoint = useCallback((waypointId: string, updates: Partial<Waypoint>) => {
    setWaypoints(prev => prev.map(wp => 
      wp.id === waypointId ? { ...wp, ...updates } : wp
    ));
  }, []);

  const renameMap = useCallback((mapId: string, newLabel: string) => {
    setMaps(prev => prev.map(map => 
      map.id === mapId 
        ? { ...map, label: newLabel, updatedAt: new Date() }
        : map
    ));
    toast({
      title: "Map Renamed",
      description: `Map renamed to "${newLabel}"`,
    });
  }, [toast]);

  const deleteMap = useCallback((mapId: string) => {
    const map = maps.find(m => m.id === mapId);
    setMaps(prev => prev.filter(m => m.id !== mapId));
    
    if (map) {
      toast({
        title: "Map Deleted",
        description: `Map "${map.label}" deleted successfully`,
      });
      
      // If we deleted the active map, switch to the first available map
      if (map.isActive && maps.length > 1) {
        const remainingMaps = maps.filter(m => m.id !== mapId);
        if (remainingMaps.length > 0) {
          loadMap(remainingMaps[0].id);
        }
      }
    }
  }, [maps, toast, loadMap]);

  return {
    status,
    maps,
    waypoints: currentMapWaypoints,
    currentMap,
    startMapping,
    stopMapping,
    saveMapping,
    loadMap,
    createWaypoint,
    deleteWaypoint,
    updateWaypoint,
    renameMap,
    deleteMap,
  };
}
