import { MapManagerStatus } from "@shared/schema";
import { motion } from "framer-motion";

interface HeaderProps {
  status: MapManagerStatus;
}

export function Header({ status }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-border px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="text-2xl text-primary">🗺️</div>
            <h1 id="map" className="text-xl font-semibold text-foreground">Universal Map Manager</h1>
          </div>
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <span>ROS 2</span>
            <span>|</span>
            <span>v2.1.0</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <motion.div 
            className={`flex items-center space-x-2 px-3 py-1 rounded-full text-white text-sm font-medium ${
              status.state === 'ACTIVE' 
                ? 'bg-green-500' 
                : 'bg-orange-500'
            }`}
            animate={{ 
              scale: status.isTransitioning ? [1, 1.05, 1] : 1 
            }}
            transition={{ duration: 0.3 }}
            data-testid="status-indicator"
          >
            <motion.div 
              className="w-2 h-2 bg-white rounded-full"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            <span data-testid="status-text">{status.state}</span>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
