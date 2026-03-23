import React, { useState } from 'react';
import { 
  X, 
  Map, 
  Layers, 
  MapPin, 
  Navigation, 
  Activity, 
  Grid3x3,
  AlertTriangle,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Clock,
  Shield,
  Users,
  Ban,
  Target,
  Zap,
  Maximize2,
  Signal
} from 'lucide-react';

interface InlineMapViewProps {
  assetName?: string;
  isHistorical?: boolean;
  location?: {
    lat: number;
    lng: number;
    siteName: string;
  };
}

export function InlineMapView({ assetName, location, isHistorical = false }: InlineMapViewProps) {
  // Reuse the logic from UnifiedMapView but simplified for inline use
  const [mapLayers, setMapLayers] = useState([
    { id: 'cycles', name: 'Production Cycles', enabled: true, icon: <Activity className="w-4 h-4" />, color: 'var(--primary)' },
    { id: 'heatmap', name: 'Progress Heatmap', enabled: true, icon: <Layers className="w-4 h-4" />, color: 'var(--color-warning)' },
    { id: 'risk', name: 'Risk Zones', enabled: true, icon: <AlertTriangle className="w-4 h-4" />, color: 'var(--destructive)' },
    { id: 'zones', name: 'Volume Zones', enabled: true, icon: <Grid3x3 className="w-4 h-4" />, color: 'var(--color-success)' },
    { id: 'asset', name: 'Asset Position', enabled: true, icon: <MapPin className="w-4 h-4" />, color: 'var(--primary)' },
  ]);

  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const toggleLayer = (layerId: string) => {
    setMapLayers(layers =>
      layers.map(layer =>
        layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
  };

  const isLayerEnabled = (layerId: string) => mapLayers.find(l => l.id === layerId)?.enabled;

  return (
    <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm flex flex-col h-[600px]">
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-foreground font-bold leading-tight text-lg">
              {isHistorical ? 'Safety Strategy Recap' : 'Safety Strategy Map'}
            </h3>
            <p className="text-muted-foreground text-sm font-medium">
              {isHistorical 
                ? 'Historical proximity trends & analytical production correlation' 
                : 'Real-time proximity monitoring & production correlation'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isHistorical ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent text-accent-foreground text-xs font-bold border border-border">
              <Clock className="w-3.5 h-3.5" />
              DAILY RECAP
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
              <Signal className="w-3.5 h-3.5" />
              LIVE
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Layer Controls - Sidebar */}
        <div className="w-[200px] border-r border-border p-4 space-y-2 overflow-y-auto bg-muted/5">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-2 mb-2 block">Overlay Layers</span>
          {mapLayers.map(layer => (
            <button
              key={layer.id}
              onClick={() => toggleLayer(layer.id)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                ${layer.enabled 
                  ? 'bg-primary/5 text-primary border border-primary/10' 
                  : 'text-muted-foreground hover:bg-muted/50 border border-transparent'
                }
              `}
            >
              <div className={`p-1.5 rounded-lg ${layer.enabled ? 'bg-primary/10' : 'bg-muted/50'}`}>
                {React.cloneElement(layer.icon as React.ReactElement<any>, { className: 'w-3.5 h-3.5' })}
              </div>
              <span className="text-xs font-bold truncate">{layer.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Map Canvas */}
        <div className="flex-1 relative bg-muted/10">
          <div className="absolute inset-0 flex items-center justify-center">
             {/* Mock SVG Map Implementation */}
             <svg 
              className="w-full h-full p-8" 
              viewBox="0 0 100 100" 
              style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)`, transition: 'transform 0.3s ease' }}
            >
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-border"/>
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
              
              {/* Central Asset */}
              {isLayerEnabled('asset') && (
                <g>
                  <circle cx="50" cy="50" r="3" fill="var(--primary)" stroke="white" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="10" fill="var(--primary)" opacity="0.1">
                    {!isHistorical && (
                      <>
                        <animate attributeName="r" from="3" to="12" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.3" to="0" dur="2s" repeatCount="indefinite" />
                      </>
                    )}
                  </circle>
                  <circle cx="50" cy="50" r="15" fill="none" stroke="var(--color-warning)" strokeWidth="0.2" strokeDasharray="1 1" />
                </g>
              )}

              {/* Risk Zones */}
              {isLayerEnabled('risk') && (
                <g>
                  <circle cx="30" cy="35" r="8" fill="var(--destructive)" opacity="0.1" />
                  <circle cx="30" cy="35" r="1.5" fill="var(--destructive)" />
                  <circle cx="65" cy="60" r="12" fill="var(--color-warning)" opacity="0.1" />
                  <circle cx="65" cy="60" r="1.5" fill="var(--color-warning)" />
                </g>
              )}

              {/* Production Path */}
              {isLayerEnabled('cycles') && (
                <path d="M 20 20 Q 50 10 80 40 T 50 80" fill="none" stroke="var(--primary)" strokeWidth="0.5" strokeDasharray="1 1" opacity="0.5" />
              )}
            </svg>
          </div>

          {/* Map Interaction Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button 
              onClick={() => setZoom(Math.min(zoom + 20, 200))}
              className="w-10 h-10 rounded-xl bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted/50 transition-all text-foreground"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setZoom(Math.max(zoom - 20, 60))}
              className="w-10 h-10 rounded-xl bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted/50 transition-all text-foreground"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setRotation((rotation + 90) % 360)}
              className="w-10 h-10 rounded-xl bg-card border border-border shadow-lg flex items-center justify-center hover:bg-muted/50 transition-all text-foreground"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>

          {/* Legend Overlay */}
          <div className="absolute top-6 left-6 p-4 rounded-2xl bg-card/80 backdrop-blur-md border border-border shadow-sm max-w-[180px]">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 block">Strategy Legend</span>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-[11px] font-medium text-foreground/80">Active Asset Cluster</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                <span className="text-[11px] font-medium text-foreground/80">Proximity Risk</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-color-warning" />
                <span className="text-[11px] font-medium text-foreground/80">Traffic Congestion</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Stats Bar */}
      <div className="p-4 border-t border-border grid grid-cols-4 gap-4 bg-muted/10">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">
            {isHistorical ? 'Avg. Correlation' : 'Correlation'}
          </span>
          <span className="text-sm font-bold text-destructive">
            {isHistorical ? 'Elevated (0.72)' : 'High Risk (0.84)'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">
            {isHistorical ? 'Total Incursions' : 'Incursions'}
          </span>
          <span className="text-sm font-bold text-foreground">
            {isHistorical ? '84 weekly' : '12 Total'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-muted-foreground uppercase">
            {isHistorical ? 'Trend Stability' : 'Safety Buffer'}
          </span>
          <span className={`text-sm font-bold ${isHistorical ? 'text-color-warning' : 'text-color-success'}`}>
            {isHistorical ? '-12% Variance' : 'Optimal (15ft)'}
          </span>
        </div>
        <div className="flex flex-col">
          <button className="h-full w-full rounded-lg bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary/20 transition-all flex items-center justify-center gap-1.5 uppercase">
            <Maximize2 className="w-3 h-3" />
            {isHistorical ? 'View Reports' : 'Open Full Intel'}
          </button>
        </div>
      </div>
    </div>
  );
}
