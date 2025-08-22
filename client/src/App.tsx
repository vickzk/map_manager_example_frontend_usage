import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MapManager from "@/pages/map-manager";
import NotFound from "@/pages/not-found";
import Tutorial from "./components/Tutorial";
import 'driver.js/dist/driver.css';

function Routes() {
  return (
    <Switch>
      <Route path="/" component={MapManager} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <WouterRouter base="/map_manager_example_frontend_usage">
          <Routes />
          <Tutorial />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
