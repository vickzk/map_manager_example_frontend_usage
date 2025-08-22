import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const maps = pgTable("maps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  label: text("label").notNull(),
  fileName: text("file_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isArchived: boolean("is_archived").default(false).notNull(),
  isActive: boolean("is_active").default(false).notNull(),
});

export const waypoints = pgTable("waypoints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  mapId: varchar("map_id").references(() => maps.id).notNull(),
  x: real("x").notNull(),
  y: real("y").notNull(),
  frameId: text("frame_id").default("").notNull(),
  tags: text("tags").array().default([]).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMapSchema = createInsertSchema(maps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWaypointSchema = createInsertSchema(waypoints).omit({
  id: true,
  createdAt: true,
});

export type InsertMap = z.infer<typeof insertMapSchema>;
export type Map = typeof maps.$inferSelect;
export type InsertWaypoint = z.infer<typeof insertWaypointSchema>;
export type Waypoint = typeof waypoints.$inferSelect;

// Map Manager State Types
export type MapManagerState = 'ACTIVE' | 'MAPPING';

export interface MapManagerStatus {
  state: MapManagerState;
  currentMapId?: string;
  isTransitioning: boolean;
}
