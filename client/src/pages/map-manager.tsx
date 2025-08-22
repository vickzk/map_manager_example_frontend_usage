import { useState } from "react";
import { Header } from "@/components/header";
import { LeftSidebar } from "@/components/left-sidebar";
import { RightSidebar } from "@/components/right-sidebar";
import { MapViewer } from "@/components/map-viewer";
import { useMapManager } from "@/hooks/use-map-manager";

export default function MapManager() {
  const [pendingWaypointPosition, setPendingWaypointPosition] = useState<{ x: number; y: number } | null>(null);
  
  const {
    status,
    maps,
    waypoints,
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
  } = useMapManager();

  const handleEditMap = (mapId: string, newName: string) => {
    renameMap(mapId, newName);
  };

  const handleDeleteMap = (mapId: string) => {
    deleteMap(mapId);
  };

  const handleMapClick = (x: number, y: number) => {
    if (status.state === 'ACTIVE') {
      setPendingWaypointPosition({ x, y });
    }
  };

  const handleWaypointDrag = (waypointId: string, x: number, y: number) => {
    updateWaypoint(waypointId, { x, y });
  };

  const handleCreateWaypoint = (name: string, x: number, y: number) => {
    createWaypoint(name, x, y);
    setPendingWaypointPosition(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header status={status} />
      
      <div className="flex h-screen pt-16">
        <LeftSidebar
          status={status}
          maps={maps}
          onStartMapping={startMapping}
          onStopMapping={stopMapping}
          onSaveMapping={saveMapping}
          onLoadMap={loadMap}
          onEditMap={handleEditMap}
          onDeleteMap={handleDeleteMap}
        />
        
        <MapViewer
          status={status}
          waypoints={waypoints}
          onMapClick={handleMapClick}
          onWaypointDrag={handleWaypointDrag}
        />

        <RightSidebar
          status={status}
          waypoints={waypoints}
          onCreateWaypoint={handleCreateWaypoint}
          onDeleteWaypoint={deleteWaypoint}
          onEditWaypoint={updateWaypoint}
          pendingWaypointPosition={pendingWaypointPosition}
        />
      </div>
    </div>
  );
}
