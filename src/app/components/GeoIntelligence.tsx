import { useState } from 'react';
import { Map, MapPin, Activity, Layers, Search, Play, Pause, AlertTriangle, Navigation, Maximize2 } from 'lucide-react';

interface RiskHeatmapData {
  zone: string;
  incidents: number;
  severity: 'low' | 'medium' | 'high';
}

interface CostCodeActivity {
  code: string;
  description: string;
  duration: string;
  location: { lat: number; lng: number };
}

const mockHeatmapData: RiskHeatmapData[] = [
  { zone: 'Zone A - North Clearing', incidents: 12, severity: 'medium' },
  { zone: 'Zone B - East Excavation', incidents: 23, severity: 'high' },
  { zone: 'Zone C - South Foundation', incidents: 7, severity: 'low' },
];

const mockCostCodeActivity: CostCodeActivity[] = [
  { code: 'CC-2401', description: 'Earthwork & Grading', duration: '4h 32m', location: { lat: 40.7128, lng: -74.0060 } },
  { code: 'CC-2402', description: 'Excavation', duration: '2h 18m', location: { lat: 40.7138, lng: -74.0070 } },
  { code: 'CC-2403', description: 'Material Transport', duration: '1h 45m', location: { lat: 40.7118, lng: -74.0050 } },
];

export function GeoIntelligence() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'var(--destructive)';
      case 'medium': return 'var(--color-warning)';
      case 'low': return 'var(--color-success)';
      default: return 'var(--border)';
    }
  };

  return (
    <div className="bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
      {/* Header */}
      <div className="px-6 py-4 bg-muted border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Map className="w-5 h-5 text-foreground" />
            <h3 className="text-foreground">Geo Intelligence</h3>
            <div className="px-3 py-1 bg-primary/10 rounded-full">
              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-primary" style={{ fontSize: 'var(--text-sm)' }}>
                Live Tracking
              </span>
            </div>
          </div>

          {/* Map Controls */}
          <div className="flex items-center gap-2">
            <button
              className="min-w-[60px] min-h-[60px] flex items-center justify-center gap-2 px-4 rounded-[var(--radius-button)] bg-card border-2 border-border hover:bg-accent transition-colors"
              title="Search Location"
            >
              <Search className="w-5 h-5 text-foreground" />
            </button>
            <button
              className="min-w-[60px] min-h-[60px] flex items-center justify-center gap-2 px-4 rounded-[var(--radius-button)] bg-card border-2 border-border hover:bg-accent transition-colors"
              title="Toggle Layers"
            >
              <Layers className="w-5 h-5 text-foreground" />
            </button>
            <button
              className="min-w-[60px] min-h-[60px] flex items-center justify-center gap-2 px-4 rounded-[var(--radius-button)] bg-card border-2 border-border hover:bg-accent transition-colors"
              title="Expand Map"
            >
              <Maximize2 className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Map View Placeholder */}
        <div className="mb-6 bg-muted rounded-[var(--radius-card)] border-2 border-border overflow-hidden">
          <div className="relative aspect-video bg-gradient-to-br from-muted to-accent/20">
            {/* Map Placeholder Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <Navigation className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-2" style={{ fontSize: 'var(--text-lg)' }}>
                  Job Site Map View
                </p>
                <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  3D Point Cloud • Real-Time Asset Tracking • Risk Heatmaps
                </p>
              </div>
            </div>

            {/* Playback Controls Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm rounded-full border-2 border-border shadow-[var(--elevation-lg)] px-4 py-3 flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-full bg-primary text-white hover:opacity-90 transition-opacity"
                title={isPlaying ? "Pause Playback" : "Play Incident Playback"}
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              
              <div className="px-4 py-2 bg-muted rounded-full">
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  {isPlaying ? 'Playing: 14:32 / 24:15' : 'Ready to Playback'}
                </span>
              </div>
            </div>

            {/* Asset Markers Overlay */}
            <div className="absolute top-4 right-4 space-y-2">
              <div className="bg-card/95 backdrop-blur-sm rounded-[var(--radius-button)] border-2 border-border px-3 py-2 flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  Active Asset
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Risk Heatmap Data */}
          <div className="bg-background rounded-[var(--radius-card)] border-2 border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-foreground" />
              <h4 className="text-foreground">Risk Event Heatmap</h4>
            </div>

            <div className="space-y-3">
              {mockHeatmapData.map((zone, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedZone(zone.zone)}
                  className={`w-full text-left p-4 rounded-[var(--radius-button)] border-2 transition-all ${
                    selectedZone === zone.zone 
                      ? 'border-primary bg-accent' 
                      : 'border-border bg-card hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                      {zone.zone}
                    </span>
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getSeverityColor(zone.severity) }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                      {zone.incidents} incidents
                    </span>
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                      {zone.severity.toUpperCase()}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cost Code Activity */}
          <div className="bg-background rounded-[var(--radius-card)] border-2 border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-foreground" />
              <h4 className="text-foreground">Cost Code Activity</h4>
            </div>

            <div className="space-y-3">
              {mockCostCodeActivity.map((activity, index) => (
                <div
                  key={index}
                  className="p-4 rounded-[var(--radius-button)] border-2 border-border bg-card"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                        {activity.code}
                      </span>
                    </div>
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-primary" style={{ fontSize: 'var(--text-sm)' }}>
                      {activity.duration}
                    </span>
                  </div>
                  <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                    {activity.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spatial Analysis Info */}
        <div className="mt-6 p-4 bg-accent/30 rounded-[var(--radius-card)] border-2 border-primary/20">
          <div className="flex items-start gap-3">
            <Map className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                Spatial Validation Active
              </p>
              <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                Comparing actual work sequences against planned schedule. Point cloud accuracy: ±2cm
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="px-6 py-3 bg-muted border-t border-border">
        <p className="text-muted-foreground font-[family-name:var(--font-family)] text-center" style={{ fontSize: 'var(--text-xs)' }}>
          Map data synchronized with real-time asset telemetry and 3D point cloud measurements
        </p>
      </div>
    </div>
  );
}
