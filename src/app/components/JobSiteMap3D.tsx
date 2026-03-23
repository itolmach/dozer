import { useState } from 'react';
import { Map, Layers, AlertTriangle, Signal, FileEdit, Maximize2, RotateCw, ZoomIn, ZoomOut, Grid3x3, MapPin } from 'lucide-react';

interface VolumeData {
  zone: string;
  volumeMoved: number;
  finishGrade: number;
  percentComplete: number;
  coordinates: { x: number; y: number };
}

interface TelemetryStatus {
  latency: number; // in milliseconds
  lastUpdate: Date;
  isLagging: boolean;
}

const mockVolumeData: VolumeData[] = [
  { zone: 'Zone A-1', volumeMoved: 2340, finishGrade: 2500, percentComplete: 93.6, coordinates: { x: 25, y: 30 } },
  { zone: 'Zone A-2', volumeMoved: 1820, finishGrade: 2500, percentComplete: 72.8, coordinates: { x: 45, y: 35 } },
  { zone: 'Zone B-1', volumeMoved: 2450, finishGrade: 2500, percentComplete: 98.0, coordinates: { x: 65, y: 40 } },
  { zone: 'Zone B-2', volumeMoved: 1560, finishGrade: 2500, percentComplete: 62.4, coordinates: { x: 35, y: 60 } },
  { zone: 'Zone C-1', volumeMoved: 2100, finishGrade: 2500, percentComplete: 84.0, coordinates: { x: 55, y: 65 } },
];

export function JobSiteMap3D() {
  const [heatmapEnabled, setHeatmapEnabled] = useState(true);
  const [showDesignChangeModal, setShowDesignChangeModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);

  // Mock telemetry status - in real app this would come from live data
  const [telemetryStatus] = useState<TelemetryStatus>({
    latency: 1850, // milliseconds
    lastUpdate: new Date(Date.now() - 1850),
    isLagging: true, // true if latency > 1000ms
  });

  const LATENCY_THRESHOLD = 1000; // 1 second threshold

  const getProgressColor = (percent: number) => {
    if (percent >= 95) return 'var(--color-success)';
    if (percent >= 75) return 'var(--color-warning)';
    return 'var(--destructive)';
  };

  const getHeatmapIntensity = (percent: number) => {
    // Returns opacity for heatmap visualization
    return Math.min(percent / 100, 1);
  };

  return (
    <div className="bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
      {/* Header */}
      <div className="px-6 py-4 bg-muted border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Grid3x3 className="w-5 h-5 text-foreground" />
            <h3 className="text-foreground">3D Job Site Map</h3>
            <div className="px-3 py-1 bg-primary/10 rounded-full">
              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-primary" style={{ fontSize: 'var(--text-sm)' }}>
                Live Tracking
              </span>
            </div>
          </div>

          {/* Map Controls */}
          <div className="flex items-center gap-2">
            {/* Heatmap Toggle */}
            <button
              onClick={() => setHeatmapEnabled(!heatmapEnabled)}
              className={`min-w-[60px] min-h-[60px] flex items-center justify-center gap-2 px-4 rounded-[var(--radius-button)] border-2 transition-all ${
                heatmapEnabled
                  ? 'bg-primary text-white border-primary'
                  : 'bg-card text-foreground border-border hover:bg-accent'
              }`}
              title="Toggle Heatmap Layer"
            >
              <Layers className="w-5 h-5" />
              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                Heatmap
              </span>
            </button>

            <button
              onClick={() => setRotation((rotation + 90) % 360)}
              className="min-w-[60px] min-h-[60px] flex items-center justify-center px-4 rounded-[var(--radius-button)] bg-card border-2 border-border hover:bg-accent transition-colors"
              title="Rotate View"
            >
              <RotateCw className="w-5 h-5 text-foreground" />
            </button>

            <button
              className="min-w-[60px] min-h-[60px] flex items-center justify-center px-4 rounded-[var(--radius-button)] bg-card border-2 border-border hover:bg-accent transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5 text-foreground" />
            </button>

            <button
              className="min-w-[60px] min-h-[60px] flex items-center justify-center px-4 rounded-[var(--radius-button)] bg-card border-2 border-border hover:bg-accent transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5 text-foreground" />
            </button>

            <button
              className="min-w-[60px] min-h-[60px] flex items-center justify-center px-4 rounded-[var(--radius-button)] bg-card border-2 border-border hover:bg-accent transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Latency Warning Banner */}
        {telemetryStatus.isLagging && (
          <div className="mb-4 p-4 bg-destructive/10 rounded-[var(--radius-card)] border-2 border-destructive">
            <div className="flex items-start gap-3">
              <Signal className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-base)' }}>
                    Telemetry Latency Alert
                  </span>
                  <div className="px-2 py-1 bg-destructive rounded-full">
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-white" style={{ fontSize: 'var(--text-xs)' }}>
                      {telemetryStatus.latency}ms
                    </span>
                  </div>
                </div>
                <p className="text-destructive font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  Bucket position updates are lagging beyond {LATENCY_THRESHOLD}ms threshold. Last update: {Math.round((Date.now() - telemetryStatus.lastUpdate.getTime()) / 1000)}s ago
                </p>
              </div>
              <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
            </div>
          </div>
        )}

        {/* 3D Map Visualization */}
        <div className="mb-6 bg-muted rounded-[var(--radius-card)] border-2 border-border overflow-hidden">
          <div 
            className="relative aspect-[16/10] bg-gradient-to-br from-muted via-accent/20 to-muted"
            style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.3s ease' }}
          >
            {/* 3D Map Placeholder with Grid */}
            <div className="absolute inset-0">
              {/* Grid overlay */}
              <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground"/>
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
              </svg>

              {/* Volume Data Points with Heatmap */}
              {mockVolumeData.map((data, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedZone(data.zone)}
                  className="absolute cursor-pointer transition-all hover:scale-110"
                  style={{
                    left: `${data.coordinates.x}%`,
                    top: `${data.coordinates.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  title={`${data.zone}: ${data.percentComplete}% complete`}
                >
                  {/* Heatmap visualization */}
                  {heatmapEnabled && (
                    <div
                      className="absolute -inset-8 rounded-full blur-xl transition-opacity"
                      style={{
                        backgroundColor: getProgressColor(data.percentComplete),
                        opacity: getHeatmapIntensity(data.percentComplete) * 0.4,
                      }}
                    ></div>
                  )}
                  
                  {/* Zone marker */}
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-full border-4 border-white shadow-[var(--elevation-lg)] flex items-center justify-center"
                      style={{
                        backgroundColor: getProgressColor(data.percentComplete),
                      }}
                    >
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Volume bar (3D effect) */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 bg-border rounded-sm" style={{ height: `${data.percentComplete}px` }}>
                      <div
                        className="w-full rounded-sm"
                        style={{
                          height: `${data.percentComplete}%`,
                          backgroundColor: getProgressColor(data.percentComplete),
                        }}
                      ></div>
                    </div>
                  </div>
                </button>
              ))}

              {/* Asset Position Indicator */}
              <div className="absolute" style={{ left: '50%', top: '45%', transform: 'translate(-50%, -50%)' }}>
                <div className="relative">
                  <div className="w-16 h-16 bg-primary rounded-full border-4 border-white shadow-[var(--elevation-lg)] flex items-center justify-center animate-pulse">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L4 7v10l8 5 8-5V7l-8-5z"/>
                    </svg>
                  </div>
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card/95 backdrop-blur-sm rounded-[var(--radius-button)] border-2 border-primary px-3 py-1 whitespace-nowrap">
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-primary" style={{ fontSize: 'var(--text-sm)' }}>
                      Active Asset
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend Overlay */}
            {heatmapEnabled && (
              <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm rounded-[var(--radius-button)] border-2 border-border p-4">
                <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-3" style={{ fontSize: 'var(--text-sm)' }}>
                  Volume Progress
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'var(--color-success)' }}></div>
                    <span className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                      95%+ Complete
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'var(--color-warning)' }}></div>
                    <span className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                      75-94% Complete
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'var(--destructive)' }}></div>
                    <span className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                      Below 75%
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* View Info Overlay */}
            <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-[var(--radius-button)] border-2 border-border px-4 py-2">
              <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                View: {rotation}° | 3D Elevation Model
              </span>
            </div>
          </div>
        </div>

        {/* Zone Details and Design Change Request */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Volume Progress Data */}
          <div className="bg-background rounded-[var(--radius-card)] border-2 border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-foreground" />
              <h4 className="text-foreground">Volume Moved vs Finish Grade</h4>
            </div>

            <div className="space-y-3">
              {mockVolumeData.map((data, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedZone(data.zone)}
                  className={`w-full text-left p-4 rounded-[var(--radius-button)] border-2 transition-all ${
                    selectedZone === data.zone
                      ? 'border-primary bg-accent'
                      : 'border-border bg-card hover:bg-accent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                      {data.zone}
                    </span>
                    <div 
                      className="px-2 py-1 rounded-full"
                      style={{ backgroundColor: `${getProgressColor(data.percentComplete)}20` }}
                    >
                      <span 
                        className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" 
                        style={{ fontSize: 'var(--text-sm)', color: getProgressColor(data.percentComplete) }}
                      >
                        {data.percentComplete}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-muted-foreground mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                    <span className="font-[family-name:var(--font-family)]">Moved: {data.volumeMoved.toLocaleString()} yd³</span>
                    <span className="font-[family-name:var(--font-family)]">Target: {data.finishGrade.toLocaleString()} yd³</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-3 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${data.percentComplete}%`,
                        backgroundColor: getProgressColor(data.percentComplete),
                      }}
                    ></div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* In-Field Design Change Request */}
          <div className="bg-background rounded-[var(--radius-card)] border-2 border-border p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileEdit className="w-5 h-5 text-foreground" />
              <h4 className="text-foreground">Field Design Changes</h4>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-accent/30 rounded-[var(--radius-button)] border-2 border-primary/20">
                <div className="flex items-start gap-3 mb-3">
                  <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-1" style={{ fontSize: 'var(--text-base)' }}>
                      Unexpected Site Conditions
                    </p>
                    <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                      Encounter bedrock, utility conflicts, or other deviations from plan? Submit a design change request to the VDC team immediately.
                    </p>
                  </div>
                </div>
              </div>

              {/* High-Contrast Action Button for Site Superintendent */}
              <button
                onClick={() => setShowDesignChangeModal(true)}
                className="w-full min-h-[80px] px-6 py-4 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity shadow-[var(--elevation-md)] border-4 border-primary/30"
              >
                <div className="flex items-center justify-center gap-3">
                  <FileEdit className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-1" style={{ fontSize: 'var(--text-lg)' }}>
                      Submit Design Change Request
                    </div>
                    <div className="font-[family-name:var(--font-family)] opacity-90" style={{ fontSize: 'var(--text-sm)' }}>
                      Alert VDC Team → Site Superintendent Only
                    </div>
                  </div>
                </div>
              </button>

              {/* Recent Requests */}
              <div className="pt-4 border-t-2 border-border">
                <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                  Recent Requests
                </div>
                <div className="space-y-2">
                  <div className="p-3 bg-card rounded-[var(--radius-button)] border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                        DCR-2024-047
                      </span>
                      <span className="px-2 py-1 bg-color-warning/10 text-color-warning rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-xs)' }}>
                        Pending
                      </span>
                    </div>
                    <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                      Bedrock @ Zone B-2 • Submitted 2h ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-background rounded-[var(--radius-card)] border-2 border-border p-4">
            <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
              Total Volume Moved
            </div>
            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
              {mockVolumeData.reduce((sum, d) => sum + d.volumeMoved, 0).toLocaleString()}
              <span className="text-muted-foreground ml-1" style={{ fontSize: 'var(--text-sm)' }}>yd³</span>
            </div>
          </div>

          <div className="bg-background rounded-[var(--radius-card)] border-2 border-border p-4">
            <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
              Overall Progress
            </div>
            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-primary" style={{ fontSize: 'var(--text-2xl)' }}>
              {Math.round(mockVolumeData.reduce((sum, d) => sum + d.percentComplete, 0) / mockVolumeData.length)}%
            </div>
          </div>

          <div className="bg-background rounded-[var(--radius-card)] border-2 border-border p-4">
            <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
              Active Zones
            </div>
            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
              {mockVolumeData.length}
            </div>
          </div>

          <div className="bg-background rounded-[var(--radius-card)] border-2 border-border p-4">
            <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
              Telemetry Status
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${telemetryStatus.isLagging ? 'bg-destructive animate-pulse' : 'bg-color-success'}`}></div>
              <span className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${telemetryStatus.isLagging ? 'text-destructive' : 'text-color-success'}`} style={{ fontSize: 'var(--text-base)' }}>
                {telemetryStatus.isLagging ? 'Lagging' : 'Normal'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Footer */}
      <div className="px-6 py-3 bg-muted border-t border-border">
        <p className="text-muted-foreground font-[family-name:var(--font-family)] text-center" style={{ fontSize: 'var(--text-xs)' }}>
          3D elevation model updated every 15 minutes • Heatmap shows vertical progress against design finish grade
        </p>
      </div>

      {/* Design Change Request Modal */}
      {showDesignChangeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-8">
          <div className="bg-card rounded-[var(--radius-card)] border-4 border-primary shadow-[var(--elevation-xl)] max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-primary text-white px-6 py-4 border-b-4 border-primary/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileEdit className="w-6 h-6" />
                  <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xl)' }}>
                    In-Field Design Change Request
                  </h3>
                </div>
                <button
                  onClick={() => setShowDesignChangeModal(false)}
                  className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-destructive/10 rounded-[var(--radius-button)] border-2 border-destructive/30">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                    <strong className="font-[var(--font-weight-semibold)]">Site Superintendent Authorization Required:</strong> This form alerts the VDC team of unexpected field conditions requiring design modifications.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-2" style={{ fontSize: 'var(--text-base)' }}>
                    Affected Zone
                  </label>
                  <select className="w-full min-h-[60px] px-4 py-3 bg-muted rounded-[var(--radius-button)] border-2 border-border focus:border-primary focus:outline-none font-[family-name:var(--font-family)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                    <option>Select Zone...</option>
                    {mockVolumeData.map((zone) => (
                      <option key={zone.zone} value={zone.zone}>{zone.zone}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-2" style={{ fontSize: 'var(--text-base)' }}>
                    Condition Type
                  </label>
                  <select className="w-full min-h-[60px] px-4 py-3 bg-muted rounded-[var(--radius-button)] border-2 border-border focus:border-primary focus:outline-none font-[family-name:var(--font-family)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                    <option>Select Condition...</option>
                    <option>Bedrock Encounter</option>
                    <option>Utility Conflict</option>
                    <option>Soil Condition Variance</option>
                    <option>Water/Drainage Issue</option>
                    <option>Survey Discrepancy</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-2" style={{ fontSize: 'var(--text-base)' }}>
                    Description
                  </label>
                  <textarea
                    className="w-full min-h-[120px] px-4 py-3 bg-muted rounded-[var(--radius-button)] border-2 border-border focus:border-primary focus:outline-none font-[family-name:var(--font-family)] text-foreground resize-none" 
                    style={{ fontSize: 'var(--text-base)' }}
                    placeholder="Describe the unexpected condition and impact on current work..."
                  ></textarea>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDesignChangeModal(false)}
                    className="flex-1 min-h-[70px] px-6 py-4 rounded-[var(--radius-button)] bg-muted border-2 border-border text-foreground hover:bg-accent transition-colors font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]"
                    style={{ fontSize: 'var(--text-base)' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setShowDesignChangeModal(false);
                      // In real app, this would submit to VDC team
                      console.log('Design change request submitted');
                    }}
                    className="flex-1 min-h-[70px] px-6 py-4 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] shadow-[var(--elevation-md)]"
                    style={{ fontSize: 'var(--text-base)' }}
                  >
                    Submit to VDC Team
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
