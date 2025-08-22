// TutorialDriver.tsx
import { useEffect } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export default function TutorialDriver() {
  useEffect(() => {
    const tour = driver({
      showProgress: true,
      allowClose: true,
      overlayOpacity: 0.5,
      stagePadding: 6,
      nextBtnText: "Next",
      prevBtnText: "Back",
      doneBtnText: "Done",
    });

    tour.setSteps([
      {
        element: "#map",
        popover: {
          title: "Welcome",
          description:
            "Welcome to the example front-end system that uses the Map Manager backend.",
          side: "bottom",
          align: "start",
        },
      },
      {
        element: "#map-list",
        popover: {
          title: "Available Maps",
          description:
            "These are the available maps stored in the robot. Click a map to load it. The backend can load 2D, 3D, or OctoMaps.",
          side: "right",
        },
      },
      {
        element: "#map-actions",
        popover: {
          title: "Map Actions (UI coming soon)",
          description:
            "Rename, delete, and archive actions will appear here. (Backend support already exists.)",
          side: "left",
        },
      },
      {
        element: "#start-mapping-btn",
        popover: {
          title: "Start Mapping",
          description:
            "This calls Map Manager → Robot Adapter, stops active mode nodes, and starts mapping nodes to scan a new map.",
          side: "top",
        },
      },
      {
        element: "#save-map-btn",
        popover: {
          title: "Save Map",
          description:
            "Save the current map to the backend. You can also stop the mapping process when done.",
          side: "top",
        },
      },
      {
        element: "#stop-mapping-btn",
        popover: {
          title: "Stop Mapping",
          description:
            "Stops the mapping nodes on the robot via Map Manager.",
          side: "top",
        },
      },
      {
        element: "#waypoint-panel",
        popover: {
          title: "Waypoints",
          description:
            "Hover to select, create new waypoints, rename, and delete them for navigation flows.",
          side: "left",
        },
      },
      {
        element: "#robot-state",
        popover: {
          title: "Robot State",
          description:
            "See live robot state/telemetry here (as provided by the backend).",
          side: "left",
        },
      },
      {
        element: "#annotations-panel",
        popover: {
          title: "Annotations (UI coming soon)",
          description:
            "Draw regions/annotations on the map. UI coming soon (backend already supports it).",
          side: "right",
        },
      },
      {
        element: "#edit-map-panel",
        popover: {
          title: "Map Editing (UI coming soon)",
          description:
            "Edit map features here. UI coming soon, backend support exists.",
          side: "right",
        },
      },
      {
        element: "#map",
        popover: {
          title: "All Set!",
          description:
            "Thanks—this is the Map Manager usage tutorial. These features work for any robot with a Map Manager adapter (plugin).",
          side: "bottom",
        },
      },
    ]);

    // start immediately on mount
    tour.drive();
  }, []);

  return null;
}
