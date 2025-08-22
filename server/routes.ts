import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMapSchema, insertWaypointSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Map routes
  app.get("/api/maps", async (req, res) => {
    try {
      const maps = await storage.getMaps();
      res.json(maps);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch maps" });
    }
  });

  app.get("/api/maps/:id", async (req, res) => {
    try {
      const map = await storage.getMap(req.params.id);
      if (!map) {
        return res.status(404).json({ error: "Map not found" });
      }
      res.json(map);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch map" });
    }
  });

  app.post("/api/maps", async (req, res) => {
    try {
      const mapData = insertMapSchema.parse(req.body);
      const map = await storage.createMap(mapData);
      res.status(201).json(map);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid map data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create map" });
    }
  });

  app.patch("/api/maps/:id", async (req, res) => {
    try {
      const updates = req.body;
      const map = await storage.updateMap(req.params.id, updates);
      if (!map) {
        return res.status(404).json({ error: "Map not found" });
      }
      res.json(map);
    } catch (error) {
      res.status(500).json({ error: "Failed to update map" });
    }
  });

  app.delete("/api/maps/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMap(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Map not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete map" });
    }
  });

  // Waypoint routes
  app.get("/api/waypoints", async (req, res) => {
    try {
      const mapId = req.query.mapId as string | undefined;
      const waypoints = await storage.getWaypoints(mapId);
      res.json(waypoints);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch waypoints" });
    }
  });

  app.get("/api/waypoints/:id", async (req, res) => {
    try {
      const waypoint = await storage.getWaypoint(req.params.id);
      if (!waypoint) {
        return res.status(404).json({ error: "Waypoint not found" });
      }
      res.json(waypoint);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch waypoint" });
    }
  });

  app.post("/api/waypoints", async (req, res) => {
    try {
      const waypointData = insertWaypointSchema.parse(req.body);
      const waypoint = await storage.createWaypoint(waypointData);
      res.status(201).json(waypoint);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid waypoint data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create waypoint" });
    }
  });

  app.patch("/api/waypoints/:id", async (req, res) => {
    try {
      const updates = req.body;
      const waypoint = await storage.updateWaypoint(req.params.id, updates);
      if (!waypoint) {
        return res.status(404).json({ error: "Waypoint not found" });
      }
      res.json(waypoint);
    } catch (error) {
      res.status(500).json({ error: "Failed to update waypoint" });
    }
  });

  app.delete("/api/waypoints/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteWaypoint(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Waypoint not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete waypoint" });
    }
  });

  // Map Manager state simulation endpoints
  app.post("/api/mapping/start", async (req, res) => {
    try {
      // Simulate starting mapping process
      res.json({ success: true, message: "Mapping started" });
    } catch (error) {
      res.status(500).json({ error: "Failed to start mapping" });
    }
  });

  app.post("/api/mapping/stop", async (req, res) => {
    try {
      // Simulate stopping mapping process
      res.json({ success: true, message: "Mapping stopped" });
    } catch (error) {
      res.status(500).json({ error: "Failed to stop mapping" });
    }
  });

  app.post("/api/mapping/save", async (req, res) => {
    try {
      const { mapName } = req.body;
      if (!mapName) {
        return res.status(400).json({ error: "Map name is required" });
      }
      
      // Create new map from current mapping session
      const mapData = {
        name: mapName.toLowerCase().replace(/\s+/g, '_'),
        label: mapName,
        fileName: `${mapName.toLowerCase().replace(/\s+/g, '_')}.png`,
        isArchived: false,
        isActive: false,
      };
      
      const map = await storage.createMap(mapData);
      res.json({ success: true, message: "Map saved successfully", map });
    } catch (error) {
      res.status(500).json({ error: "Failed to save map" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
