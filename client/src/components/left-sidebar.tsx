import { Map, MapManagerStatus } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, Play, Download, Square, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

interface LeftSidebarProps {
  status: MapManagerStatus;
  maps: Map[];
  onStartMapping: () => void;
  onStopMapping: () => void;
  onSaveMapping: (name: string) => void;
  onLoadMap: (mapId: string) => void;
  onEditMap?: (mapId: string, newName: string) => void;
  onDeleteMap?: (mapId: string) => void;
}

export function LeftSidebar({
  status,
  maps,
  onStartMapping,
  onStopMapping,
  onSaveMapping,
  onLoadMap,
  onEditMap,
  onDeleteMap,
}: LeftSidebarProps) {
  const [saveMapName, setSaveMapName] = useState("");
  const [showSaveMap, setShowSaveMap] = useState(false);
  const [editingMapId, setEditingMapId] = useState<string | null>(null);
  const [editMapName, setEditMapName] = useState("");

  const handleSaveMap = () => {
    if (saveMapName.trim()) {
      onSaveMapping(saveMapName.trim());
      setSaveMapName("");
      setShowSaveMap(false);
    }
  };

  const handleEditMap = (mapId: string) => {
    const map = maps.find(m => m.id === mapId);
    if (map) {
      setEditingMapId(mapId);
      setEditMapName(map.label);
    }
  };

  const handleSaveMapEdit = () => {
    if (editingMapId && editMapName.trim()) {
      onEditMap?.(editingMapId, editMapName.trim());
      setEditingMapId(null);
      setEditMapName("");
    }
  };

  return (
    <motion.div 
      className="w-80 bg-white shadow-lg border-r border-border flex flex-col"
      animate={{ 
        width: status.state === 'MAPPING' ? 240 : 320
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      data-testid="left-sidebar"
    >
      <AnimatePresence mode="wait">
        {status.state === 'ACTIVE' && (
          <motion.div
            key="active-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-hidden"
          >
            {/* Map List Panel */}
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground mb-3">Available Maps</h2>
              <ScrollArea className="h-80">
                <div className="space-y-2">
                  {maps.map((map) => (
                    <Card 
                      key={map.id}
                      className={`cursor-pointer transition-colors hover:border-primary ${
                        map.isActive ? 'border-primary bg-accent' : ''
                      }`}
                      onClick={() => onLoadMap(map.id)}
                      data-testid={`card-map-${map.id}`}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`text-lg ${map.isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                              🗺️
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{map.label}</p>
                              <p className="text-xs text-muted-foreground">
                                Updated: {map.updatedAt.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditMap(map.id);
                              }}
                              data-testid={`button-edit-map-${map.id}`}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteMap?.(map.id);
                              }}
                              data-testid={`button-delete-map-${map.id}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </motion.div>
        )}
        
        {status.state === 'MAPPING' && (
          <motion.div
            key="mapping-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-hidden p-6"
          >
            <div className="text-center space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="mx-auto w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full"
              />
              
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">Mapping Mode</h2>
                <p className="text-sm text-muted-foreground">
                  Robot is actively creating a new map
                </p>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-medium text-orange-800 mb-2">Current Session</h3>
                <div className="space-y-2 text-sm text-orange-700">
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <motion.span
                      key={Math.floor(Date.now() / 1000)}
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      {new Date(Date.now()).toLocaleTimeString()}
                    </motion.span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium">Recording</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <p>• Click "Stop Mapping" when complete</p>
                <p>• Use "Save Current Map" to store the new map</p>
                <p>• Waypoints are hidden during mapping</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Panel */}
      <div className="border-t border-border p-4">
        <AnimatePresence mode="wait">
          {status.state === 'ACTIVE' ? (
            <motion.div
              key="active-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <Button 
                className="w-full warning"
                onClick={onStartMapping}
                data-testid="button-start-mapping"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Mapping
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                data-testid="button-export-map"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Map
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="mapping-controls"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <Button 
                variant="destructive"
                className="w-full"
                onClick={onStopMapping}
                data-testid="button-stop-mapping"
              >
                <Square className="h-4 w-4 mr-2" />
                Stop Mapping
              </Button>
              
              <Dialog open={showSaveMap} onOpenChange={setShowSaveMap}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full success"
                    data-testid="button-save-mapping"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Current Map
                  </Button>
                </DialogTrigger>
                <DialogContent data-testid="dialog-save-map">
                  <DialogHeader>
                    <DialogTitle>Save Map</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="map-name">Map Name</Label>
                      <Input
                        id="map-name"
                        placeholder="Enter map name"
                        value={saveMapName}
                        onChange={(e) => setSaveMapName(e.target.value)}
                        data-testid="input-map-name"
                      />
                    </div>
                    <div className="flex space-x-3 pt-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowSaveMap(false)}
                        data-testid="button-cancel-save"
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 success"
                        onClick={handleSaveMap}
                        disabled={!saveMapName.trim()}
                        data-testid="button-confirm-save"
                      >
                        Save Map
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit Map Dialog */}
      <Dialog open={!!editingMapId} onOpenChange={() => setEditingMapId(null)}>
        <DialogContent data-testid="dialog-edit-map">
          <DialogHeader>
            <DialogTitle>Edit Map</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-map-name">Map Name</Label>
              <Input
                id="edit-map-name"
                placeholder="Enter new map name"
                value={editMapName}
                onChange={(e) => setEditMapName(e.target.value)}
                data-testid="input-edit-map-name"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setEditingMapId(null)}
                data-testid="button-cancel-edit-map"
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 success"
                onClick={handleSaveMapEdit}
                disabled={!editMapName.trim()}
                data-testid="button-save-edit-map"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}