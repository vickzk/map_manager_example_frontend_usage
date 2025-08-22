import { useState, useRef, useCallback } from "react";
import { MapManagerStatus, Waypoint } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, ZoomOut, Home, MapPin } from "lucide-react";
import huskyDepotImage from "@assets/husky_depot_1755842153683.png";

interface MapViewerProps {
  status: MapManagerStatus;
  waypoints: Waypoint[];
  onMapClick: (x: number, y: number) => void;
  onWaypointDrag: (waypointId: string, x: number, y: number) => void;
}

export function MapViewer({
  status,
  waypoints,
  onMapClick,
  onWaypointDrag,
}: MapViewerProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!mapRef.current) return;

      const rect = mapRef.current.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left) / zoom);
      const y = Math.round((e.clientY - rect.top) / zoom);
      setMousePosition({ x, y });
    },
    [zoom]
  );

  const handleMapClick = useCallback(
    (e: React.MouseEvent) => {
      if (status.state !== "ACTIVE" || isDragging.current) return;

      if (!mapRef.current) return;

      const rect = mapRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;

      onMapClick(x, y);
    },
    [status.state, zoom, onMapClick]
  );

  const handleWaypointMouseDown = useCallback(
    (e: React.MouseEvent, waypointId: string) => {
      e.stopPropagation();
      isDragging.current = true;
      dragStart.current = { x: e.clientX, y: e.clientY };
    },
    []
  );

  const handleWaypointMouseUp = useCallback(
    (e: React.MouseEvent, waypointId: string) => {
      if (!isDragging.current || !mapRef.current) return;

      isDragging.current = false;
      const rect = mapRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom;
      const y = (e.clientY - rect.top) / zoom;

      onWaypointDrag(waypointId, x, y);
    },
    [zoom, onWaypointDrag]
  );

  const handleZoomIn = () => setZoom((prev) => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev / 1.2, 0.5));
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <main className="flex-1 relative overflow-hidden bg-muted">
      <div
        ref={mapRef}
        id="robot-state"
        className="w-full h-full relative cursor-crosshair"
        onClick={handleMapClick}
        onMouseMove={handleMouseMove}
        data-testid="map-container"
      >
        {/* Map Image Background */}
        <motion.div
          id="annotations-panel"
          className="absolute inset-0 bg-white"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: "top left",
          }}
        >
          <img
            src={huskyDepotImage}
            alt="Husky Depot warehouse floor plan"
            className="w-full h-full object-contain"
            style={{ imageRendering: "crisp-edges" }}
            draggable={false}
          />
        </motion.div>

        {/* Interactive Overlay */}
        <div id="edit-map-panel" className="absolute inset-0">
          {/* Coordinate Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg className="w-full h-full">
              <defs>
                <pattern
                  id="grid"
                  width="50"
                  height="50"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 50 0 L 0 0 0 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* Waypoint Markers */}
          <AnimatePresence>
            {status.state === "ACTIVE" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none"
                data-testid="waypoint-markers"
              >
                {waypoints.map((waypoint) => {
                  // Convert absolute coordinates to percentage for responsive positioning
                  const leftPercent = (waypoint.x / 800) * 100; // Assuming map width ~800px
                  const topPercent = (waypoint.y / 600) * 100; // Assuming map height ~600px

                  return (
                    <motion.div
                      key={waypoint.id}
                      className="absolute pointer-events-auto cursor-move group"
                      style={{
                        left: `${waypoint.x}px`,
                        top: `${waypoint.y}px`,
                        transform: `translate(-50%, -50%) scale(${1 / zoom})`,
                        transformOrigin: "center",
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 / zoom }}
                      whileHover={{ scale: 1.1 / zoom }}
                      onMouseDown={(e) =>
                        handleWaypointMouseDown(e, waypoint.id)
                      }
                      onMouseUp={(e) => handleWaypointMouseUp(e, waypoint.id)}
                      data-testid={`waypoint-marker-${waypoint.id}`}
                    >
                      <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg transition-transform">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                        {waypoint.name}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mapping Progress Overlay */}
          <AnimatePresence>
            {status.state === "MAPPING" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-orange-500 bg-opacity-10"
                data-testid="mapping-overlay"
              >
                <motion.div
                  className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold"
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  <div className="flex items-center space-x-2">
                    <motion.div
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                    <span>Mapping in Progress...</span>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Map Controls */}
        <div
          className="absolute top-4 right-4 flex flex-col space-y-2"
          data-testid="map-controls"
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={handleZoomIn}
            data-testid="button-zoom-in"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleZoomOut}
            data-testid="button-zoom-out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleResetView}
            data-testid="button-reset-view"
          >
            <Home className="h-4 w-4" />
          </Button>
        </div>

        {/* Coordinates Display */}
        <div
          className="absolute bottom-4 left-4 bg-black bg-opacity-75 text-white text-sm px-3 py-2 rounded"
          data-testid="coordinates-display"
        >
          <span data-testid="mouse-coordinates">
            x: {mousePosition.x}, y: {mousePosition.y}
          </span>
        </div>
      </div>
    </main>
  );
}
