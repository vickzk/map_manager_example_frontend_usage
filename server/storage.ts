import { type Map, type InsertMap, type Waypoint, type InsertWaypoint } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Map operations
  getMaps(): Promise<Map[]>;
  getMap(id: string): Promise<Map | undefined>;
  createMap(map: InsertMap): Promise<Map>;
  updateMap(id: string, updates: Partial<InsertMap>): Promise<Map | undefined>;
  deleteMap(id: string): Promise<boolean>;
  
  // Waypoint operations
  getWaypoints(mapId?: string): Promise<Waypoint[]>;
  getWaypoint(id: string): Promise<Waypoint | undefined>;
  createWaypoint(waypoint: InsertWaypoint): Promise<Waypoint>;
  updateWaypoint(id: string, updates: Partial<InsertWaypoint>): Promise<Waypoint | undefined>;
  deleteWaypoint(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private maps: Map<string, Map>;
  private waypoints: Map<string, Waypoint>;

  constructor() {
    this.maps = new Map();
    this.waypoints = new Map();
    this.initializeMockData();
  }

  private initializeMockData() {
    // Initialize with mock maps
    const mockMaps: Map[] = [
      {
        id: "d891fad6-bd99-484c-81b7-db8d1b8b663e",
        name: "husky_depot",
        label: "Husky Depot Map",
        fileName: "husky_depot_1755842153683.png",
        createdAt: new Date("2025-01-21T11:28:18Z"),
        updatedAt: new Date("2025-01-21T11:28:18Z"),
        isArchived: false,
        isActive: true,
      },
      {
        id: "22252ee8-98e1-4072-a03e-1613ebf29405",
        name: "warehouse_layout",
        label: "Warehouse Layout",
        fileName: "warehouse_layout.png",
        createdAt: new Date("2025-01-20T15:42:33Z"),
        updatedAt: new Date("2025-01-20T15:42:33Z"),
        isArchived: false,
        isActive: false,
      },
    ];

    const mockWaypoints: Waypoint[] = [
      {
        id: "7f1500cd-d32d-4e94-a5b0-68641334d3ab",
        name: "Entry Point",
        mapId: "d891fad6-bd99-484c-81b7-db8d1b8b663e",
        x: 120,
        y: 340,
        frameId: "",
        tags: ["entry", "navigation"],
        createdAt: new Date("2025-01-21T11:30:00Z"),
      },
      {
        id: "8g2601de-e43e-5fa5-b6c1-79752445e4bc",
        name: "Loading Dock",
        mapId: "d891fad6-bd99-484c-81b7-db8d1b8b663e",
        x: 580,
        y: 190,
        frameId: "",
        tags: ["loading", "dock"],
        createdAt: new Date("2025-01-21T11:32:00Z"),
      },
    ];

    mockMaps.forEach(map => this.maps.set(map.id, map));
    mockWaypoints.forEach(waypoint => this.waypoints.set(waypoint.id, waypoint));
  }

  async getMaps(): Promise<Map[]> {
    return Array.from(this.maps.values());
  }

  async getMap(id: string): Promise<Map | undefined> {
    return this.maps.get(id);
  }

  async createMap(insertMap: InsertMap): Promise<Map> {
    const id = randomUUID();
    const map: Map = {
      ...insertMap,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.maps.set(id, map);
    return map;
  }

  async updateMap(id: string, updates: Partial<InsertMap>): Promise<Map | undefined> {
    const map = this.maps.get(id);
    if (!map) return undefined;

    const updatedMap: Map = {
      ...map,
      ...updates,
      updatedAt: new Date(),
    };
    this.maps.set(id, updatedMap);
    return updatedMap;
  }

  async deleteMap(id: string): Promise<boolean> {
    return this.maps.delete(id);
  }

  async getWaypoints(mapId?: string): Promise<Waypoint[]> {
    const waypoints = Array.from(this.waypoints.values());
    return mapId ? waypoints.filter(wp => wp.mapId === mapId) : waypoints;
  }

  async getWaypoint(id: string): Promise<Waypoint | undefined> {
    return this.waypoints.get(id);
  }

  async createWaypoint(insertWaypoint: InsertWaypoint): Promise<Waypoint> {
    const id = randomUUID();
    const waypoint: Waypoint = {
      ...insertWaypoint,
      id,
      createdAt: new Date(),
    };
    this.waypoints.set(id, waypoint);
    return waypoint;
  }

  async updateWaypoint(id: string, updates: Partial<InsertWaypoint>): Promise<Waypoint | undefined> {
    const waypoint = this.waypoints.get(id);
    if (!waypoint) return undefined;

    const updatedWaypoint: Waypoint = {
      ...waypoint,
      ...updates,
    };
    this.waypoints.set(id, updatedWaypoint);
    return updatedWaypoint;
  }

  async deleteWaypoint(id: string): Promise<boolean> {
    return this.waypoints.delete(id);
  }
}

export const storage = new MemStorage();
