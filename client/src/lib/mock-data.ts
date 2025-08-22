import { Map, Waypoint } from "@shared/schema";

export const mockMaps: Map[] = [
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
  {
    id: "773c7fba-2721-4ba0-92d3-1abbf4e93a6e",
    name: "office_floor_plan",
    label: "Office Floor Plan",
    fileName: "office_floor_plan.png",
    createdAt: new Date("2025-01-19T09:15:22Z"),
    updatedAt: new Date("2025-01-19T09:15:22Z"),
    isArchived: false,
    isActive: false,
  },
];

export const mockWaypoints: Waypoint[] = [
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
  {
    id: "9h3712ef-f54f-6gb6-c7d2-8a863556f5cd",
    name: "Staging Area",
    mapId: "d891fad6-bd99-484c-81b7-db8d1b8b663e",
    x: 410,
    y: 280,
    frameId: "",
    tags: ["staging", "operations"],
    createdAt: new Date("2025-01-21T11:34:00Z"),
  },
];
