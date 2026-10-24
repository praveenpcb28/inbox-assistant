import React from 'react';
import { useOnlineStatus } from './useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded-xl bg-amber-600 text-white px-4 py-2.5 text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom-2 duration-200"
    >
      <WifiOff className="w-4 h-4 shrink-0" />
      <span>Offline Mode — Cached data is displayed. Actions will queue until reconnected.</span>
    </div>
  );
};
