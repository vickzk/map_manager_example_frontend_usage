# Overview

This is a Universal Map Manager web application for ROS 2 robotics systems. The application provides a complete map lifecycle management solution, allowing users to manage maps, waypoints, and annotations across robotic systems. It features an interactive map viewer where users can visualize maps, create and manage waypoints, and switch between different operational states (ACTIVE and MAPPING modes).

The application is built as a full-stack web solution with a React frontend and Express backend, designed to handle map data management for robotics applications. It includes features for map visualization, waypoint management, real-time status monitoring, and an intuitive user interface for robotics operators.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built using React with TypeScript and follows a modern component-based architecture. The UI framework is built on shadcn/ui components with Radix UI primitives, providing a consistent and accessible design system. Styling is handled through Tailwind CSS with custom CSS variables for theming.

The frontend uses Wouter for lightweight client-side routing and TanStack Query for server state management and caching. Framer Motion is integrated for smooth animations, particularly for map interactions and status transitions. The application follows a hook-based pattern with custom hooks like `useMapManager` for business logic encapsulation.

## Backend Architecture
The server is built with Express.js and follows a RESTful API design pattern. The backend implements a clean separation of concerns with dedicated route handlers, storage abstractions, and middleware for request logging and error handling.

The storage layer uses an interface-based approach (`IStorage`) with a current in-memory implementation (`MemStorage`) that includes mock data for development. This design allows for easy migration to persistent storage solutions like PostgreSQL with Drizzle ORM, which is already configured in the project.

## Data Models
The application uses a well-defined schema with TypeScript types for Maps and Waypoints. Maps contain metadata like name, label, filename, and status flags (isActive, isArchived). Waypoints are associated with maps and include position coordinates (x, y), frame references, and tagging capabilities.

The system includes a MapManagerState type system that tracks operational modes ('ACTIVE' for normal operation, 'MAPPING' for map creation) with transition states for smooth UI updates.

## Development Tooling
The project is configured with Vite for fast development builds and hot module replacement. TypeScript configuration supports path mapping for clean imports, and the build process uses esbuild for production bundling. PostCSS handles CSS processing with Tailwind and Autoprefixer.

## API Design
The REST API follows conventional patterns with endpoints for CRUD operations on maps and waypoints. Routes are organized by resource type (/api/maps, /api/waypoints) with proper HTTP methods and status codes. The API includes request validation using Zod schemas and comprehensive error handling.

# External Dependencies

## Database Layer
Drizzle ORM is configured for PostgreSQL with schema definitions and migration support. The Neon serverless database driver is set up for cloud database connectivity. Database configuration expects a DATABASE_URL environment variable for connection.

## UI Component Library
The application uses shadcn/ui as the primary component library, built on top of Radix UI primitives. This provides accessible, unstyled components that are customized with Tailwind CSS. Additional UI dependencies include Framer Motion for animations and React Hook Form with Zod resolvers for form validation.

## Development Dependencies
Vite serves as the build tool with React plugin support and Replit-specific development enhancements. The project includes TypeScript for type safety, TanStack Query for server state management, and Wouter for lightweight routing.

## Styling Framework
Tailwind CSS provides utility-first styling with a custom configuration that includes design tokens for consistent theming. The setup includes custom CSS variables for colors and spacing, with PostCSS for processing.

## Robotics Context
While not directly integrated, the application is designed to interface with ROS 2 systems for map and waypoint management. The data models and API structure support integration with robotics middleware for real-world deployment scenarios.