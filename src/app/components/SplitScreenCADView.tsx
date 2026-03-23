import { useState } from 'react';
import { X, Satellite, Box, AlertTriangle, TrendingDown, TrendingUp, DollarSign, FileText, Target, Layers, Info } from 'lucide-react';

interface GNSSPosition {
  lat: number;
  lng: number;
  elevation: number;
  accuracy: number;
}

interface CADDesignPoint {
  elevation: number;
  tolerance: number;
}

interface ExcavationMetrics {
  overExcavation: number; // percentage
  underFill: number; // percentage
  volumeOverDug: number; // cubic yards
  budgetImpact: number; // dollars
  reworkRequired: boolean;
  costCode: string;
}

interface SplitScreenCADViewProps {
  onClose: () => void;
  assetName: string;
  costCode?: string;
}

export function SplitScreenCADView({ onClose, assetName, costCode = 'CSI 31 22 00' }: SplitScreenCADViewProps) {
  const [showToleranceZone, setShowToleranceZone] = useState(true);
  const [showVolumeMetrics, setShowVolumeMetrics] = useState(true);

  // Mock real-time GNSS data
  const [gnssPosition] = useState<GNSSPosition>({
    lat: 34.0522,
    lng: -118.2437,
    elevation: 285.42, // feet
    accuracy: 0.8, // inches
  });

  // Mock CAD design elevation at current position
  const [designPoint] = useState<CADDesignPoint>({
    elevation: 287.00, // feet - design grade
    tolerance: 0.10, // feet (1.2 inches)
  });

  // Calculate variance
  const elevationVariance = gnssPosition.elevation - designPoint.elevation;
  const isOverExcavated = elevationVariance < -designPoint.tolerance;
  const isUnderFilled = elevationVariance > designPoint.tolerance;
  const isWithinTolerance = Math.abs(elevationVariance) <= designPoint.tolerance;

  // Mock excavation metrics
  const [metrics] = useState<ExcavationMetrics>({
    overExcavation: 12.3, // percentage of area
    underFill: 4.2, // percentage of area
    volumeOverDug: 847, // cubic yards
    budgetImpact: 18940, // dollars (cost of rework)
    reworkRequired: true,
    costCode: costCode,
  });

  const getStatusColor = () => {
    if (isWithinTolerance) return 'var(--color-success)';
    if (isOverExcavated) return 'var(--destructive)';
    return 'var(--color-warning)';
  };

  const getStatusText = () => {
    if (isWithinTolerance) return 'Within Tolerance';
    if (isOverExcavated) return 'Over-Excavated';
    return 'Under-Filled';
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-[var(--radius-card)] border-4 border-primary shadow-[var(--elevation-xl)] max-w-[95vw] w-full h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-primary text-white px-6 py-4 border-b-4 border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Satellite className="w-6 h-6" />
              <div>
                <h2 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xl)' }}>
                  GNSS vs CAD Design Grade - Real-Time Monitoring
                </h2>
                <p className="font-[family-name:var(--font-family)] opacity-90" style={{ fontSize: 'var(--text-sm)' }}>
                  {assetName} • Cost Code: {costCode}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              title="Close Split View"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Critical Alert Banner */}
        {metrics.reworkRequired && (
          <div className="bg-destructive/10 border-b-4 border-destructive px-6 py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-lg)' }}>
                    Budget Bleed Alert - Rework Required
                  </span>
                  <div className="px-3 py-1 bg-destructive rounded-full">
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-white" style={{ fontSize: 'var(--text-sm)' }}>
                      Cost Impact: ${metrics.budgetImpact.toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-destructive font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-base)' }}>
                  Over-excavation detected: {metrics.volumeOverDug.toLocaleString()} yd³ excavated beyond design grade. Material must be replaced and re-compacted, resulting in double cost attribution to {costCode}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Split Screen Content */}
        <div className="flex-1 overflow-hidden">
          <div className="grid grid-cols-2 gap-0 h-full">
            {/* Left Panel - 3D CAD Model */}
            <div className="border-r-2 border-border bg-muted flex flex-col overflow-hidden">
              <div className="bg-card border-b-2 border-border px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Box className="w-5 h-5 text-foreground" />
                    <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                      3D CAD Design Model
                    </h3>
                  </div>
                  <button
                    onClick={() => setShowToleranceZone(!showToleranceZone)}
                    className={`min-h-[44px] px-3 py-2 rounded-[var(--radius-button)] border-2 transition-all ${
                      showToleranceZone
                        ? 'bg-primary/10 border-primary text-primary'
                        : 'bg-card border-border text-foreground hover:bg-accent'
                    }`}
                  >
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                      {showToleranceZone ? 'Hide' : 'Show'} Tolerance Zone
                    </span>
                  </button>
                </div>
              </div>

              {/* CAD Model Visualization */}
              <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-muted via-accent/20 to-muted">
                {/* 3D Grid Background */}
                <svg className="w-full h-full opacity-30" viewBox="0 0 200 200" preserveAspectRatio="none">
                  <defs>
                    <pattern id="cad-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground"/>
                    </pattern>
                  </defs>
                  <rect width="200" height="200" fill="url(#cad-grid)" />
                </svg>

                {/* Design Grade Surface (3D representation) */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-[80%] h-[60%]">
                    {/* Design surface plane */}
                    <div 
                      className="absolute inset-0 bg-primary/20 border-2 border-primary rounded-[var(--radius-button)]"
                      style={{
                        transform: 'perspective(800px) rotateX(45deg)',
                        transformOrigin: 'center',
                      }}
                    >
                      {/* Grid on surface */}
                      <svg className="w-full h-full opacity-50" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                          <pattern id="surface-grid" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-primary"/>
                          </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#surface-grid)" />
                      </svg>

                      {/* Tolerance zone overlay */}
                      {showToleranceZone && (
                        <div className="absolute inset-0 bg-color-success/10 border-2 border-color-success/30 rounded-[var(--radius-button)]">
                          <div className="absolute top-2 left-2 px-2 py-1 bg-color-success/20 rounded text-color-success font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-xs)' }}>
                            ±{designPoint.tolerance * 12}" Tolerance
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Design elevation marker */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <div className="bg-card/95 backdrop-blur-sm rounded-[var(--radius-button)] border-2 border-primary px-4 py-2">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] text-center mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Design Grade
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-primary text-center" style={{ fontSize: 'var(--text-lg)' }}>
                          {designPoint.elevation.toFixed(2)}'
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CAD Info Overlay */}
                <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-[var(--radius-button)] border-2 border-border p-3">
                  <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                    Model: Final_Grade_Rev12.dwg
                  </div>
                  <div className="flex items-center gap-3 text-foreground">
                    <div className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                      <span className="text-muted-foreground">Station:</span> 42+75.3
                    </div>
                    <div className="w-px h-4 bg-border"></div>
                    <div className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                      <span className="text-muted-foreground">Offset:</span> 12.5'
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel - Real-Time GNSS Position */}
            <div className="bg-background flex flex-col overflow-hidden">
              <div className="bg-card border-b-2 border-border px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Satellite className="w-5 h-5 text-foreground" />
                    <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                      Real-Time GNSS Position
                    </h3>
                    <div className="flex items-center gap-1 px-2 py-1 bg-color-success/10 rounded-full">
                      <div className="w-2 h-2 bg-color-success rounded-full animate-pulse"></div>
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-color-success" style={{ fontSize: 'var(--text-xs)' }}>
                        LIVE
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-[var(--radius-button)]">
                    <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                      Accuracy:
                    </span>
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-color-success" style={{ fontSize: 'var(--text-sm)' }}>
                      ±{gnssPosition.accuracy}"
                    </span>
                  </div>
                </div>
              </div>

              {/* GNSS Position Visualization */}
              <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-accent/10 via-background to-accent/10">
                {/* Similar 3D Grid */}
                <svg className="w-full h-full opacity-20" viewBox="0 0 200 200" preserveAspectRatio="none">
                  <rect width="200" height="200" fill="url(#cad-grid)" />
                </svg>

                {/* Actual position surface */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-[80%] h-[60%]">
                    {/* Actual excavation surface */}
                    <div 
                      className={`absolute inset-0 border-2 rounded-[var(--radius-button)]`}
                      style={{
                        backgroundColor: `${getStatusColor()}20`,
                        borderColor: getStatusColor(),
                        transform: 'perspective(800px) rotateX(45deg)',
                        transformOrigin: 'center',
                      }}
                    >
                      {/* Bucket position indicator */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div 
                          className="w-12 h-12 rounded-full border-4 border-white shadow-[var(--elevation-lg)] flex items-center justify-center animate-pulse"
                          style={{ backgroundColor: getStatusColor() }}
                        >
                          <Target className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Current elevation marker */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-16 z-10">
                      <div 
                        className="bg-card/95 backdrop-blur-sm rounded-[var(--radius-button)] border-2 px-4 py-2"
                        style={{ borderColor: getStatusColor() }}
                      >
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] text-center mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Current Elevation
                        </div>
                        <div 
                          className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-center"
                          style={{ fontSize: 'var(--text-lg)', color: getStatusColor() }}
                        >
                          {gnssPosition.elevation.toFixed(2)}'
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Variance Indicator - Prominent */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2">
                  <div 
                    className="bg-card/95 backdrop-blur-sm rounded-[var(--radius-card)] border-4 px-6 py-4 shadow-[var(--elevation-xl)]"
                    style={{ borderColor: getStatusColor() }}
                  >
                    <div className="text-center mb-2">
                      <div 
                        className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-1"
                        style={{ fontSize: 'var(--text-sm)', color: getStatusColor() }}
                      >
                        {getStatusText()}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        {elevationVariance < 0 ? (
                          <TrendingDown className="w-6 h-6" style={{ color: getStatusColor() }} />
                        ) : (
                          <TrendingUp className="w-6 h-6" style={{ color: getStatusColor() }} />
                        )}
                        <span 
                          className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]"
                          style={{ fontSize: 'var(--text-3xl)', color: getStatusColor() }}
                        >
                          {Math.abs(elevationVariance).toFixed(2)}'
                        </span>
                      </div>
                      <div className="text-muted-foreground font-[family-name:var(--font-family)] mt-1" style={{ fontSize: 'var(--text-xs)' }}>
                        {elevationVariance < 0 ? 'Below' : 'Above'} Design Grade ({Math.abs(elevationVariance * 12).toFixed(1)}")
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Metrics Panel */}
        <div className="bg-muted border-t-2 border-border px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Toggle Volume Metrics */}
            <button
              onClick={() => setShowVolumeMetrics(!showVolumeMetrics)}
              className="min-w-[60px] min-h-[60px] flex items-center justify-center gap-2 px-4 rounded-[var(--radius-button)] bg-card border-2 border-border hover:bg-accent transition-colors"
            >
              <Layers className="w-5 h-5 text-foreground" />
              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                {showVolumeMetrics ? 'Hide' : 'Show'} Metrics
              </span>
            </button>

            {/* Metrics Display */}
            {showVolumeMetrics && (
              <>
                {/* Over-Excavation */}
                <div className="flex-1 bg-destructive/10 rounded-[var(--radius-card)] border-2 border-destructive p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingDown className="w-5 h-5 text-destructive" />
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-destructive" style={{ fontSize: 'var(--text-base)' }}>
                          Over-Excavation
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-2xl)' }}>
                          {metrics.overExcavation}%
                        </span>
                        <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                          of area
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                        Excess Volume
                      </div>
                      <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-lg)' }}>
                        {metrics.volumeOverDug.toLocaleString()} yd³
                      </div>
                    </div>
                  </div>
                </div>

                {/* Under-Fill */}
                <div className="flex-1 bg-color-warning/10 rounded-[var(--radius-card)] border-2 border-color-warning p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-5 h-5 text-color-warning" />
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-color-warning" style={{ fontSize: 'var(--text-base)' }}>
                          Under-Fill
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-color-warning" style={{ fontSize: 'var(--text-2xl)' }}>
                          {metrics.underFill}%
                        </span>
                        <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                          of area
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                        Additional Required
                      </div>
                      <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-color-warning" style={{ fontSize: 'var(--text-lg)' }}>
                        {Math.round(metrics.volumeOverDug * (metrics.underFill / metrics.overExcavation)).toLocaleString()} yd³
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget Impact */}
                <div className="flex-1 bg-primary/10 rounded-[var(--radius-card)] border-2 border-primary p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-5 h-5 text-primary" />
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-primary" style={{ fontSize: 'var(--text-base)' }}>
                          Budget Impact
                        </span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-primary" style={{ fontSize: 'var(--text-2xl)' }}>
                          ${metrics.budgetImpact.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                        Cost Code
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4 text-primary" />
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-primary" style={{ fontSize: 'var(--text-sm)' }}>
                          {metrics.costCode}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info Footer */}
        <div className="bg-card border-t border-border px-6 py-2">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Info className="w-4 h-4" />
            <p className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
              Real-time comparison between GNSS bucket position and CAD design grade • Over-excavation triggers double cost attribution to {costCode}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
