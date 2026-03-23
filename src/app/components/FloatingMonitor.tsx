import { MapPin, Maximize2, Circle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface FloatingMonitorProps {
  onExpand: () => void;
  assetName: string;
}

export function FloatingMonitor({ onExpand, assetName }: FloatingMonitorProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).toUpperCase();
  };

  if (isMinimized) {
    return (
      <div className="absolute bottom-8 right-8 z-40">
        <button 
          onClick={() => setIsMinimized(false)}
          className="bg-black/80 backdrop-blur-md rounded-full p-3 border border-white/20 shadow-2xl text-white hover:bg-black transition-all active:scale-95"
        >
          <div className="flex items-center gap-2">
            <Circle className="w-2 h-2 fill-red-500 text-red-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase">Live View</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-8 right-8 z-40 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="relative w-[280px] aspect-video bg-[#0a0a0a] rounded-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden group">
        {/* Simulated Video Feed Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a1a1a_0%,_#0a0a0a_100%)]">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          {/* Mock Camera elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-32 border border-white/5 rounded-lg flex items-center justify-center">
            <div className="w-12 h-0.5 bg-white/5 rotate-45"></div>
            <div className="w-12 h-0.5 bg-white/5 -rotate-45"></div>
          </div>
        </div>

        {/* Live Indicator */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-white text-[10px] font-bold tracking-wider">
          <Circle className="w-1.5 h-1.5 fill-red-500 text-red-500 animate-pulse" />
          LIVE
        </div>

        {/* Timestamp */}
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-white text-[10px] font-medium tabular-nums font-mono">
          {formatTime(currentTime)}
        </div>

        {/* Expand Button - Floating in corner */}
        <button 
          onClick={onExpand}
          className="absolute bottom-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-md border border-white/20 rounded-lg flex items-center justify-center text-white shadow-lg hover:bg-black transition-all active:scale-95 group/expand"
          title="Return to full view"
        >
          <Maximize2 className="w-4 h-4 group-hover/expand:scale-110 transition-transform" />
        </button>

        {/* Minimize Action - Top Left Corner dot */}
        <button 
          onClick={() => setIsMinimized(true)}
          className="absolute top-1 left-1 w-2 h-2 bg-white/20 hover:bg-white/50 rounded-full transition-colors"
          title="Minimize"
        />

        {/* Hover Overlay Title */}
        <div className="absolute inset-x-0 bottom-0 py-2 px-3 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold truncate">{assetName} MONITOR</p>
        </div>
      </div>
    </div>
  );
}
