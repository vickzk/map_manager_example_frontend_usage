import { Waypoint, MapManagerStatus } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Edit, Trash2, Plus } from "lucide-react";
import { useState } from "react";

interface RightSidebarProps {
  status: MapManagerStatus;
  waypoints: Waypoint[];
  onCreateWaypoint: (name: string, x: number, y: number) => void;
  onDeleteWaypoint: (waypointId: string) => void;
  onEditWaypoint?: (waypointId: string, updates: Partial<Waypoint>) => void;
  pendingWaypointPosition?: { x: number; y: number } | null;
}

export function RightSidebar({
  status,
  waypoints,
  onCreateWaypoint,
  onDeleteWaypoint,
  onEditWaypoint,
  pendingWaypointPosition,
}: RightSidebarProps) {
  const [newWaypointName, setNewWaypointName] = useState("");
  const [showCreateWaypoint, setShowCreateWaypoint] = useState(false);
  const [editingWaypointId, setEditingWaypointId] = useState<string | null>(null);
  const [editWaypointName, setEditWaypointName] = useState("");

  const handleCreateWaypoint = () => {
    if (newWaypointName.trim() && pendingWaypointPosition) {
      onCreateWaypoint(newWaypointName.trim(), pendingWaypointPosition.x, pendingWaypointPosition.y);
      setNewWaypointName("");
      setShowCreateWaypoint(false);
    }
  };

  const handleEditWaypoint = (waypointId: string) => {
    const waypoint = waypoints.find(wp => wp.id === waypointId);
    if (waypoint) {
      setEditingWaypointId(waypointId);
      setEditWaypointName(waypoint.name);
    }
  };

  const handleSaveWaypointEdit = () => {
    if (editingWaypointId && editWaypointName.trim()) {
      onEditWaypoint?.(editingWaypointId, { name: editWaypointName.trim() });
      setEditingWaypointId(null);
      setEditWaypointName("");
    }
  };

  return (
    <motion.div 
      className="w-80 bg-white shadow-lg border-l border-border flex flex-col"
      animate={{ 
        x: status.state === 'MAPPING' ? 320 : 0,
        opacity: status.state === 'MAPPING' ? 0 : 1 
      }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      data-testid="right-sidebar"
    >
      <AnimatePresence mode="wait">
        {status.state === 'ACTIVE' && (
          <motion.div
            key="waypoints-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-hidden"
          >
            {/* Waypoints Panel */}
            <div className="p-4">
              <h2 id="waypoint-panel" className="text-lg font-semibold text-foreground mb-3">Current Map Waypoints</h2>
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {waypoints.map((waypoint) => (
                    <Card key={waypoint.id} className="cursor-pointer hover:border-primary transition-colors">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-green-500" />
                            <div className="flex-1">
                              <span className="text-sm font-medium text-foreground block">{waypoint.name}</span>
                              <div className="text-xs text-muted-foreground">
                                x: {Math.round(waypoint.x)}, y: {Math.round(waypoint.y)}
                              </div>
                              {waypoint.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {waypoint.tags.map((tag, index) => (
                                    <span key={index} className="text-xs bg-primary/10 text-primary px-1 py-0.5 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditWaypoint(waypoint.id);
                              }}
                              data-testid={`button-edit-waypoint-${waypoint.id}`}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteWaypoint(waypoint.id);
                              }}
                              data-testid={`button-delete-waypoint-${waypoint.id}`}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {waypoints.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No waypoints on this map</p>
                      <p className="text-xs">Click on the map to add waypoints</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <Dialog open={showCreateWaypoint} onOpenChange={setShowCreateWaypoint}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full mt-4" 
                    variant="outline"
                    disabled={!pendingWaypointPosition}
                    data-testid="button-add-waypoint"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Waypoint
                    {pendingWaypointPosition && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({Math.round(pendingWaypointPosition.x)}, {Math.round(pendingWaypointPosition.y)})
                      </span>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent data-testid="dialog-create-waypoint">
                  <DialogHeader>
                    <DialogTitle>Create New Waypoint</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="waypoint-name">Waypoint Name</Label>
                      <Input
                        id="waypoint-name"
                        placeholder="Enter waypoint name"
                        value={newWaypointName}
                        onChange={(e) => setNewWaypointName(e.target.value)}
                        data-testid="input-waypoint-name"
                      />
                    </div>
                    {pendingWaypointPosition && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="waypoint-x">X Position</Label>
                          <Input
                            id="waypoint-x"
                            value={Math.round(pendingWaypointPosition.x)}
                            readOnly
                            data-testid="input-waypoint-x"
                          />
                        </div>
                        <div>
                          <Label htmlFor="waypoint-y">Y Position</Label>
                          <Input
                            id="waypoint-y"
                            value={Math.round(pendingWaypointPosition.y)}
                            readOnly
                            data-testid="input-waypoint-y"
                          />
                        </div>
                      </div>
                    )}
                    <div className="flex space-x-3 pt-4">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowCreateWaypoint(false)}
                        data-testid="button-cancel-waypoint"
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 success"
                        onClick={handleCreateWaypoint}
                        disabled={!newWaypointName.trim()}
                        data-testid="button-save-waypoint"
                      >
                        Create Waypoint
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Waypoint Dialog */}
      <Dialog open={!!editingWaypointId} onOpenChange={() => setEditingWaypointId(null)}>
        <DialogContent data-testid="dialog-edit-waypoint">
          <DialogHeader>
            <DialogTitle>Edit Waypoint</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-waypoint-name">Waypoint Name</Label>
              <Input
                id="edit-waypoint-name"
                placeholder="Enter new waypoint name"
                value={editWaypointName}
                onChange={(e) => setEditWaypointName(e.target.value)}
                data-testid="input-edit-waypoint-name"
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setEditingWaypointId(null)}
                data-testid="button-cancel-edit-waypoint"
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 success"
                onClick={handleSaveWaypointEdit}
                disabled={!editWaypointName.trim()}
                data-testid="button-save-edit-waypoint"
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