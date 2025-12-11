import { useState, useEffect } from 'react';
import api from '@/lib/api';

export function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      await api.get('/health', { timeout: 5000 });
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (isConnected === null && !isChecking) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg text-sm ${
        isConnected 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-red-100 text-red-800 border border-red-200'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          isChecking 
            ? 'bg-yellow-500 animate-pulse' 
            : isConnected 
              ? 'bg-green-500' 
              : 'bg-red-500'
        }`} />
        <span>
          {isChecking 
            ? 'Checking...' 
            : isConnected 
              ? 'Server Connected' 
              : 'Server Disconnected'
          }
        </span>
        {!isConnected && !isChecking && (
          <button 
            onClick={checkConnection}
            className="ml-2 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export default ConnectionStatus;