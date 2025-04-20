// RefreshButton.tsx
"use client";

import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { refreshPositions } from './actions' // Import the server action

export default function RefreshButton() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Call the server action to revalidate the data
      await refreshPositions();
      
      // Force a hard refresh of the page to show new data
      window.location.reload();
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      // Reset the refreshing state
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };
  
  return (
    <button
      onClick={handleRefresh}
      className="flex items-center justify-center p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md transition-all"
      title="Refresh positions"
      disabled={isRefreshing}
    >
      <RefreshCw 
        size={20} 
        className={`${isRefreshing ? 'animate-spin' : ''}`}
      />
    </button>
  );
}
