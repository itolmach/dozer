import { useState, useEffect } from 'react';
import { 
  Mountain, 
  AlertTriangle, 
  CheckCircle, 
  Send, 
  X, 
  TrendingUp, 
  TrendingDown,
  Ruler,
  Layers,
  AlertCircle,
  Clock,
  MapPin,
  FileText,
  Camera,
  ArrowUpCircle,
  ArrowDownCircle
} from 'lucide-react';

interface DeviationEvent {
  id: string;
  timestamp: Date;
  location: { lat: number; lng: number; elevation: number };
  deviationType: 'bedrock' | 'soft_soil' | 'water' | 'debris' | 'unknown';
  severity: 'minor' | 'moderate' | 'major';
  verticalDeviation: number; // meters from design elevation
  designElevation: number;
  actualElevation: number;
  status: 'monitoring' | 'warning' | 'confirmed' | 'resolved';
  telemetryConfidence: number; // 0-100
}

interface DesignChangeRequest {
  id: string;
  deviationId: string;
  requestedBy: string;
  timestamp: Date;
  location: string;
  issue: string;
  proposedSolution: string;
  urgency: 'low' | 'medium' | 'high';
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  attachments: string[];
}


interface HeatMapZone {
  id: string;
  name: string;
  designElevation: number;
  currentElevation: number;
  deviation: number; // positive = above grade, negative = below grade
  percentComplete: number;
  area: number; // square meters
  status: 'ahead' | 'on-track' | 'behind';
}

const mockDeviations: DeviationEvent[] = [
  {
    id: 'DEV-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    location: { lat: 34.0522, lng: -118.2437, elevation: 142.3 },
    deviationType: 'bedrock',
    severity: 'major',
    verticalDeviation: 0.82,
    designElevation: 141.5,
    actualElevation: 142.32,
    status: 'confirmed',
    telemetryConfidence: 94
  },
  {
    id: 'DEV-002',
    timestamp: new Date(Date.now() - 1000 * 30),
    location: { lat: 34.0525, lng: -118.2440, elevation: 140.8 },
    deviationType: 'soft_soil',
    severity: 'moderate',
    verticalDeviation: -0.45,
    designElevation: 141.0,
    actualElevation: 140.55,
    status: 'warning',
    telemetryConfidence: 87
  },
  {
    id: 'DEV-003',
    timestamp: new Date(Date.now() - 1000 * 5),
    location: { lat: 34.0520, lng: -118.2435, elevation: 139.2 },
    deviationType: 'unknown',
    severity: 'minor',
    verticalDeviation: 0.15,
    designElevation: 139.0,
    actualElevation: 139.15,
    status: 'monitoring',
    telemetryConfidence: 72
  }
];


const mockHeatMapZones: HeatMapZone[] = [
  {
    id: 'ZONE-A1',
    name: 'Zone A-1 (North)',
    designElevation: 142.0,
    currentElevation: 142.1,
    deviation: 0.1,
    percentComplete: 95,
    area: 1250,
    status: 'ahead'
  },
  {
    id: 'ZONE-A2',
    name: 'Zone A-2 (Center)',
    designElevation: 141.5,
    currentElevation: 141.5,
    deviation: 0.0,
    percentComplete: 88,
    area: 1580,
    status: 'on-track'
  },
  {
    id: 'ZONE-A3',
    name: 'Zone A-3 (South)',
    designElevation: 140.8,
    currentElevation: 141.3,
    deviation: 0.5,
    percentComplete: 62,
    area: 940,
    status: 'behind'
  },
  {
    id: 'ZONE-B1',
    name: 'Zone B-1 (East)',
    designElevation: 139.5,
    currentElevation: 139.2,
    deviation: -0.3,
    percentComplete: 78,
    area: 1120,
    status: 'on-track'
  },
  {
    id: 'ZONE-B2',
    name: 'Zone B-2 (West)',
    designElevation: 138.9,
    currentElevation: 139.7,
    deviation: 0.8,
    percentComplete: 45,
    area: 1350,
    status: 'behind'
  }
];

export function GeospatialDeviationMonitor() {
  const [deviations, setDeviations] = useState<DeviationEvent[]>(mockDeviations);
  const [showChangeRequest, setShowChangeRequest] = useState(false);
  const [selectedDeviation, setSelectedDeviation] = useState<DeviationEvent | null>(null);
  const [heatMapZones] = useState<HeatMapZone[]>(mockHeatMapZones);
  const [changeRequest, setChangeRequest] = useState<Partial<DesignChangeRequest>>({
    requestedBy: '',
    issue: '',
    proposedSolution: '',
    urgency: 'medium',
    attachments: []
  });

  // Simulate monitoring → warning → confirmed progression
  useEffect(() => {
    const timer = setInterval(() => {
      setDeviations(prev => prev.map(dev => {
        if (dev.status === 'monitoring' && dev.telemetryConfidence > 85) {
          // After 3 seconds of monitoring with high confidence, upgrade to warning
          const age = Date.now() - dev.timestamp.getTime();
          if (age > 3000) {
            return { ...dev, status: 'warning' as const };
          }
        }
        return dev;
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getDeviationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      bedrock: 'Bedrock Encounter',
      soft_soil: 'Soft Soil',
      water: 'Water Intrusion',
      debris: 'Debris/Obstruction',
      unknown: 'Unknown Condition'
    };
    return labels[type] || type;
  };

  const getDeviationTypeIcon = (type: string) => {
    switch (type) {
      case 'bedrock': return <Mountain className="w-5 h-5" />;
      case 'soft_soil': return <TrendingDown className="w-5 h-5" />;
      case 'water': return <TrendingDown className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'monitoring': return 'var(--color-info)';
      case 'warning': return 'var(--color-warning)';
      case 'confirmed': return 'var(--destructive)';
      case 'resolved': return 'var(--color-success)';
      default: return 'var(--muted)';
    }
  };

  const getZoneStatusColor = (status: string) => {
    switch (status) {
      case 'ahead': return 'var(--color-success)';
      case 'on-track': return 'var(--color-info)';
      case 'behind': return 'var(--color-warning)';
      default: return 'var(--muted)';
    }
  };

  const handleCreateChangeRequest = (deviation: DeviationEvent) => {
    setSelectedDeviation(deviation);
    setChangeRequest({
      deviationId: deviation.id,
      requestedBy: 'Field Supervisor',
      issue: `${getDeviationTypeLabel(deviation.deviationType)} detected at elevation ${deviation.actualElevation.toFixed(2)}m (Design: ${deviation.designElevation.toFixed(2)}m)`,
      proposedSolution: '',
      urgency: deviation.severity === 'major' ? 'high' : deviation.severity === 'moderate' ? 'medium' : 'low',
      attachments: []
    });
    setShowChangeRequest(true);
  };

  const handleSubmitChangeRequest = () => {
    console.log('Submitting design change request:', {
      ...changeRequest,
      id: `DCR-${Date.now()}`,
      timestamp: new Date(),
      status: 'submitted'
    });
    
    // Reset form
    setShowChangeRequest(false);
    setChangeRequest({
      requestedBy: '',
      issue: '',
      proposedSolution: '',
      urgency: 'medium',
      attachments: []
    });
    setSelectedDeviation(null);
  };

  const activeDeviations = deviations.filter(d => d.status !== 'resolved');
  const criticalDeviations = activeDeviations.filter(d => d.severity === 'major');

  return (
    <div className="bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
      {/* Header */}
      <div className="px-6 py-4 bg-muted border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers className="w-5 h-5 text-foreground" />
            <h3 className="text-foreground">Geospatial Telemetry vs. 3D Design</h3>
            {criticalDeviations.length > 0 && (
              <div className="px-3 py-1 bg-destructive rounded-full flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-white" />
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-white" style={{ fontSize: 'var(--text-sm)' }}>
                  {criticalDeviations.length} Critical
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
              Last Update: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">

        {/* Heat Map - Vertical Progress vs Finish Grade */}
        <div className="mb-6 bg-background rounded-[var(--radius-card)] border-2 border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Ruler className="w-5 h-5 text-foreground" />
              <h4 className="text-foreground">Vertical Progress Heat Map</h4>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="w-4 h-4 text-foreground" />
                <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  Above Grade
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ArrowDownCircle className="w-4 h-4 text-foreground" />
                <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  Below Grade
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {heatMapZones.map((zone) => {
              const isAboveGrade = zone.deviation > 0;
              const deviationPercent = Math.min(Math.abs(zone.deviation) * 100, 100);
              
              return (
                <div
                  key={zone.id}
                  className="bg-card rounded-[var(--radius-button)] border-2 border-border overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: getZoneStatusColor(zone.status) }}
                        ></div>
                        <h5 className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                          {zone.name}
                        </h5>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                            Design Elevation
                          </p>
                          <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                            {zone.designElevation.toFixed(2)}m
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                            Current Elevation
                          </p>
                          <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                            {zone.currentElevation.toFixed(2)}m
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                            Deviation
                          </p>
                          <div className="flex items-center gap-1">
                            {isAboveGrade ? (
                              <ArrowUpCircle className="w-4 h-4 text-foreground" />
                            ) : zone.deviation < 0 ? (
                              <ArrowDownCircle className="w-4 h-4 text-foreground" />
                            ) : null}
                            <p className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                              Math.abs(zone.deviation) > 0.5 ? 'text-destructive' : 'text-foreground'
                            }`} style={{ fontSize: 'var(--text-sm)' }}>
                              {zone.deviation >= 0 ? '+' : ''}{zone.deviation.toFixed(2)}m
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar with Deviation Indicator */}
                    <div className="relative">
                      <div className="h-8 bg-muted rounded-[var(--radius-button)] overflow-hidden border border-border">
                        <div 
                          className="h-full bg-primary transition-all duration-500 flex items-center justify-end pr-2"
                          style={{ width: `${zone.percentComplete}%` }}
                        >
                          <span className="text-white font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xs)' }}>
                            {zone.percentComplete}%
                          </span>
                        </div>
                      </div>
                      {/* Deviation severity indicator overlay */}
                      {Math.abs(zone.deviation) > 0.3 && (
                        <div 
                          className="absolute top-0 right-0 h-8 rounded-r-[var(--radius-button)] opacity-30"
                          style={{ 
                            width: `${deviationPercent}%`,
                            backgroundColor: isAboveGrade ? 'var(--color-warning)' : 'var(--color-info)'
                          }}
                        ></div>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                        Area: {zone.area.toLocaleString()} m²
                      </span>
                      <span className="text-muted-foreground font-[family-name:var(--font-family)] uppercase" style={{ fontSize: 'var(--text-xs)' }}>
                        Status: {zone.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Deviation Alerts */}
        <div className="bg-background rounded-[var(--radius-card)] border-2 border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-foreground" />
              <h4 className="text-foreground">Active Deviation Alerts</h4>
              <div className="px-2 py-1 bg-muted rounded-full">
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-xs)' }}>
                  {activeDeviations.length}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {activeDeviations.map((deviation) => {
              const isMonitoring = deviation.status === 'monitoring';
              const age = Date.now() - deviation.timestamp.getTime();
              const ageSeconds = Math.floor(age / 1000);

              return (
                <div
                  key={deviation.id}
                  className={`rounded-[var(--radius-button)] border-2 overflow-hidden transition-all ${
                    isMonitoring 
                      ? 'border-primary/30 bg-primary/5 animate-pulse' 
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="p-4">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-[var(--radius-button)]"
                          style={{ backgroundColor: getStatusColor(deviation.status) }}
                        >
                          {getDeviationTypeIcon(deviation.deviationType)}
                          <span className="text-white ml-1"></span>
                        </div>
                        <div>
                          <h5 className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-1" style={{ fontSize: 'var(--text-base)' }}>
                            {getDeviationTypeLabel(deviation.deviationType)}
                          </h5>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                              {deviation.location.lat.toFixed(4)}°, {deviation.location.lng.toFixed(4)}°
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div 
                          className="px-3 py-1 rounded-full mb-2"
                          style={{ backgroundColor: getStatusColor(deviation.status) }}
                        >
                          <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-white uppercase" style={{ fontSize: 'var(--text-xs)' }}>
                            {deviation.status}
                          </span>
                        </div>
                        {isMonitoring && (
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                              {ageSeconds}s
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Monitoring Notice - Shows for first 3 seconds */}
                    {isMonitoring && ageSeconds < 3 && (
                      <div className="mb-3 p-3 bg-primary/10 rounded-[var(--radius-button)] border border-primary/20">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                            Monitoring deviation... Validating telemetry signal
                          </p>
                        </div>
                        <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all"
                            style={{ width: `${(ageSeconds / 3) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Deviation Details */}
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Design Elevation
                        </p>
                        <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-base)' }}>
                          {deviation.designElevation.toFixed(2)}m
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Actual Elevation
                        </p>
                        <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-base)' }}>
                          {deviation.actualElevation.toFixed(2)}m
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Deviation
                        </p>
                        <p className="text-destructive font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                          {deviation.verticalDeviation >= 0 ? '+' : ''}{deviation.verticalDeviation.toFixed(2)}m
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Confidence
                        </p>
                        <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-base)' }}>
                          {deviation.telemetryConfidence}%
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons - Only show for confirmed deviations */}
                    {deviation.status === 'confirmed' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCreateChangeRequest(deviation)}
                          className="flex-1 min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                          <FileText className="w-5 h-5" />
                          <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-base)' }}>
                            Create Design Change Request
                          </span>
                        </button>
                        <button
                          className="min-w-[60px] min-h-[60px] px-4 rounded-[var(--radius-button)] bg-secondary hover:bg-accent transition-colors flex items-center justify-center"
                          title="Attach Photo Evidence"
                        >
                          <Camera className="w-5 h-5 text-foreground" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {activeDeviations.length === 0 && (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 text-color-success mx-auto mb-3" />
                <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-1" style={{ fontSize: 'var(--text-base)' }}>
                  All Clear
                </p>
                <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  No active deviations detected
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Design Change Request Modal */}
      {showChangeRequest && selectedDeviation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-card rounded-[var(--radius-card)] border-2 border-border shadow-[var(--elevation-lg)] max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-primary border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-white" />
                <h3 className="text-white font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xl)' }}>
                  In-Field Design Change Request
                </h3>
              </div>
              <button
                onClick={() => setShowChangeRequest(false)}
                className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-[var(--radius-button)] hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Deviation Context */}
              <div className="mb-6 p-4 bg-muted rounded-[var(--radius-card)] border border-border">
                <h4 className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-3" style={{ fontSize: 'var(--text-base)' }}>
                  Deviation Context
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                      Type
                    </p>
                    <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                      {getDeviationTypeLabel(selectedDeviation.deviationType)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                      Severity
                    </p>
                    <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] uppercase" style={{ fontSize: 'var(--text-sm)' }}>
                      {selectedDeviation.severity}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                      Location
                    </p>
                    <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                      {selectedDeviation.location.lat.toFixed(4)}°, {selectedDeviation.location.lng.toFixed(4)}°
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                      Vertical Deviation
                    </p>
                    <p className="text-destructive font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-sm)' }}>
                      {selectedDeviation.verticalDeviation >= 0 ? '+' : ''}{selectedDeviation.verticalDeviation.toFixed(2)}m
                    </p>
                  </div>
                </div>
              </div>

              {/* Request Form */}
              <div className="space-y-6">
                {/* Requested By */}
                <div>
                  <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                    Requested By *
                  </label>
                  <input
                    type="text"
                    value={changeRequest.requestedBy}
                    onChange={(e) => setChangeRequest({ ...changeRequest, requestedBy: e.target.value })}
                    placeholder="Your name or role"
                    className="w-full min-h-[60px] px-4 py-3 bg-input-background border-2 border-border rounded-[var(--radius-input)] focus:border-ring focus:outline-none font-[family-name:var(--font-family)] text-foreground"
                    style={{ fontSize: 'var(--text-base)' }}
                  />
                </div>

                {/* Issue Description */}
                <div>
                  <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                    Issue Description *
                  </label>
                  <textarea
                    value={changeRequest.issue}
                    onChange={(e) => setChangeRequest({ ...changeRequest, issue: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 bg-input-background border-2 border-border rounded-[var(--radius-input)] focus:border-ring focus:outline-none font-[family-name:var(--font-family)] text-foreground resize-none"
                    style={{ fontSize: 'var(--text-base)' }}
                  />
                </div>

                {/* Proposed Solution */}
                <div>
                  <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                    Proposed Solution *
                  </label>
                  <textarea
                    value={changeRequest.proposedSolution}
                    onChange={(e) => setChangeRequest({ ...changeRequest, proposedSolution: e.target.value })}
                    placeholder="Describe the recommended design adjustment or remediation approach..."
                    rows={4}
                    className="w-full px-4 py-3 bg-input-background border-2 border-border rounded-[var(--radius-input)] focus:border-ring focus:outline-none font-[family-name:var(--font-family)] text-foreground resize-none"
                    style={{ fontSize: 'var(--text-base)' }}
                  />
                </div>

                {/* Urgency */}
                <div>
                  <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                    Urgency Level *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['low', 'medium', 'high'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => setChangeRequest({ ...changeRequest, urgency: level })}
                        className={`min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] border-2 transition-all font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] ${
                          changeRequest.urgency === level
                            ? 'border-primary bg-primary text-white'
                            : 'border-border bg-card text-foreground hover:bg-accent'
                        }`}
                        style={{ fontSize: 'var(--text-base)' }}
                      >
                        {level.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attachments Placeholder */}
                <div>
                  <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                    Attachments (Photos, Diagrams)
                  </label>
                  <div className="border-2 border-dashed border-border rounded-[var(--radius-button)] p-8 text-center hover:bg-accent/50 transition-colors cursor-pointer">
                    <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                      Click to upload or drag and drop
                    </p>
                    <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                      Photos, PDFs, or CAD files
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-muted border-t border-border flex items-center justify-between">
              <button
                onClick={() => setShowChangeRequest(false)}
                className="min-h-[60px] px-6 rounded-[var(--radius-button)] bg-secondary hover:bg-accent transition-colors font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground"
                style={{ fontSize: 'var(--text-base)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitChangeRequest}
                disabled={!changeRequest.requestedBy || !changeRequest.proposedSolution}
                className="min-h-[60px] px-6 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]"
                style={{ fontSize: 'var(--text-base)' }}
              >
                <Send className="w-5 h-5" />
                Submit to Office
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
