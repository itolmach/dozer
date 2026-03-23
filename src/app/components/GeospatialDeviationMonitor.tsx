import { useState, useEffect } from 'react';
import { 
  Mountain, 
  AlertTriangle, 
  CheckCircle, 
  Send, 
  X, 
  TrendingUp, 
  TrendingDown,
  Briefcase,
  AlertCircle,
  Clock,
  MapPin,
  Camera,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock3,
  Timer
} from 'lucide-react';

interface DeviationEvent {
  id: string;
  timestamp: Date;
  location: { lat: number; lng: number; elevation: number };
  deviationType: 'bedrock' | 'soft_soil' | 'water' | 'debris' | 'unknown';
  severity: 'minor' | 'moderate' | 'major';
  verticalDeviation: number; // Reinterpreted as schedule variance in days
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
  designElevation: number; // % target
  currentElevation: number; // % actual
  deviation: number; // variance %
  percentComplete: number;
  area: number;
  status: 'ahead' | 'on-track' | 'behind';
}

const mockDeviations: DeviationEvent[] = [
  {
    id: 'DEV-001',
    timestamp: new Date(Date.now() - 1000 * 60 * 2),
    location: { lat: 34.0522, lng: -118.2437, elevation: 142.3 },
    deviationType: 'bedrock',
    severity: 'major',
    verticalDeviation: 3.5, // 3.5 days behind
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
    verticalDeviation: -1.2, // 1.2 days ahead
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
    verticalDeviation: 0.5,
    designElevation: 139.0,
    actualElevation: 139.15,
    status: 'monitoring',
    telemetryConfidence: 72
  }
];

const mockHeatMapZones: HeatMapZone[] = [
  {
    id: 'PRJ-ALPHA',
    name: 'Project Alpha - Phase 1',
    designElevation: 100,
    currentElevation: 105,
    deviation: 5,
    percentComplete: 95,
    area: 1250,
    status: 'ahead'
  },
  {
    id: 'PRJ-BETA',
    name: 'North Perimeter Expansion',
    designElevation: 100,
    currentElevation: 100,
    deviation: 0,
    percentComplete: 88,
    area: 1580,
    status: 'on-track'
  },
  {
    id: 'PRJ-GAMMA',
    name: 'Section 7B Utility Trench',
    designElevation: 100,
    currentElevation: 92,
    deviation: -8,
    percentComplete: 62,
    area: 940,
    status: 'behind'
  },
  {
    id: 'PRJ-DELTA',
    name: 'Interstate 405 Drainage',
    designElevation: 100,
    currentElevation: 102,
    deviation: 2,
    percentComplete: 78,
    area: 1120,
    status: 'on-track'
  },
  {
    id: 'PRJ-EPSILON',
    name: 'Southern Access Road',
    designElevation: 100,
    currentElevation: 85,
    deviation: -15,
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

  useEffect(() => {
    const timer = setInterval(() => {
      setDeviations(prev => prev.map(dev => {
        if (dev.status === 'monitoring' && dev.telemetryConfidence > 85) {
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
      bedrock: 'Bedrock Delay',
      soft_soil: 'Material Impediment',
      water: 'Logistical Bottleneck',
      debris: 'Site Obstruction',
      unknown: 'Unforeseen Risk'
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
      issue: `${getDeviationTypeLabel(deviation.deviationType)} detected at location ${deviation.location.lat.toFixed(4)}, ${deviation.location.lng.toFixed(4)}`,
      proposedSolution: '',
      urgency: deviation.severity === 'major' ? 'high' : deviation.severity === 'moderate' ? 'medium' : 'low',
      attachments: []
    });
    setShowChangeRequest(true);
  };

  const handleSubmitChangeRequest = () => {
    console.log('Submitting schedule mitigation request:', {
      ...changeRequest,
      id: `SMR-${Date.now()}`,
      timestamp: new Date(),
      status: 'submitted'
    });
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
            <Briefcase className="w-5 h-5 text-foreground" />
            <h3 className="text-foreground">Assignments</h3>
            {criticalDeviations.length > 0 && (
              <div className="px-3 py-1 bg-destructive rounded-full flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-white" />
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-white" style={{ fontSize: 'var(--text-sm)' }}>
                  {criticalDeviations.length} High Risk
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
              Operational Status: ACTIVE
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Project Progress & Schedule Variance */}
        <div className="mb-6 bg-background rounded-[var(--radius-card)] border-2 border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock3 className="w-5 h-5 text-foreground" />
              <h4 className="text-foreground">Project Progress &amp; Schedule Variance</h4>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-color-success" />
                <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  Ahead of Schedule
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-destructive" />
                <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  Behind Schedule
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {heatMapZones.map((zone) => (
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
                          Scheduled Target
                        </p>
                        <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                          {zone.designElevation}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                          Actual Progress
                        </p>
                        <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                          {zone.currentElevation}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                          Variance
                        </p>
                        <div className="flex items-center gap-1">
                          {zone.deviation > 0 ? (
                            <TrendingUp className="w-4 h-4 text-color-success" />
                          ) : zone.deviation < 0 ? (
                            <TrendingDown className="w-4 h-4 text-destructive" />
                          ) : null}
                          <p className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                            Math.abs(zone.deviation) > 10 ? 'text-destructive' : zone.deviation < 0 ? 'text-color-warning' : 'text-color-success'
                          }`} style={{ fontSize: 'var(--text-sm)' }}>
                            {zone.deviation >= 0 ? '+' : ''}{zone.deviation}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar with Schedule Variance Indicator */}
                  <div className="relative">
                    <div className="h-8 bg-muted rounded-[var(--radius-button)] overflow-hidden border border-border">
                      <div 
                        className="h-full bg-primary transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${zone.percentComplete}%` }}
                      >
                        <span className="text-white font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xs)' }}>
                          {zone.percentComplete}% COMPLETE
                        </span>
                      </div>
                    </div>
                    {/* Variance severity indicator overlay */}
                    {Math.abs(zone.deviation) > 5 && (
                      <div 
                        className="absolute top-0 right-0 h-8 rounded-r-[var(--radius-button)] opacity-30"
                        style={{ 
                          width: `${Math.min(Math.abs(zone.deviation), 100)}%`,
                          backgroundColor: zone.deviation > 0 ? 'var(--color-success)' : 'var(--destructive)'
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
            ))}
          </div>
        </div>

        {/* Schedule Risk Alerts */}
        <div className="bg-background rounded-[var(--radius-card)] border-2 border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-foreground" />
              <h4 className="text-foreground">Schedule Risk Alerts</h4>
              <div className="px-2 py-1 bg-muted rounded-full">
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-xs)' }}>
                  {activeDeviations.length} Active
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

                    {/* Monitoring Notice */}
                    {isMonitoring && (
                      <div className="mb-3 p-3 bg-primary/10 rounded-[var(--radius-button)] border border-primary/20">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                            Validating risk data... Validating telemetry signal
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Risk Details */}
                    <div className="grid grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Impact Type
                        </p>
                        <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                          {deviation.verticalDeviation > 0 ? 'Delay' : 'Ahead'}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Variance
                        </p>
                        <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                          {Math.abs(deviation.verticalDeviation).toFixed(1)} Days
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Severity
                        </p>
                        <p className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] uppercase ${
                          deviation.severity === 'major' ? 'text-destructive' : 'text-foreground'
                        }`} style={{ fontSize: 'var(--text-sm)' }}>
                          {deviation.severity}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Confidence
                        </p>
                        <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                          {deviation.telemetryConfidence}%
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {deviation.status === 'confirmed' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCreateChangeRequest(deviation)}
                          className="flex-1 min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                          <Timer className="w-5 h-5" />
                          <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-base)' }}>
                            Request Schedule Mitigation
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
                  No active project risks detected
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mitigation Request Modal */}
      {showChangeRequest && selectedDeviation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl bg-card rounded-[var(--radius-card)] border-2 border-border shadow-[var(--elevation-lg)] max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 bg-primary border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="w-6 h-6 text-white" />
                <h3 className="text-white font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xl)' }}>
                  Project Schedule Mitigation Request
                </h3>
              </div>
              <button
                onClick={() => setShowChangeRequest(false)}
                className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-[var(--radius-button)] hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6 p-4 bg-muted rounded-[var(--radius-card)] border border-border">
                <h4 className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-3" style={{ fontSize: 'var(--text-base)' }}>
                  Risk Context
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                      Risk Type
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
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                    Requested By *
                  </label>
                  <input
                    type="text"
                    value={changeRequest.requestedBy}
                    onChange={(e) => setChangeRequest({ ...changeRequest, requestedBy: e.target.value })}
                    className="w-full min-h-[60px] px-4 py-3 bg-input-background border-2 border-border rounded-[var(--radius-input)] focus:border-ring focus:outline-none font-[family-name:var(--font-family)] text-foreground"
                    style={{ fontSize: 'var(--text-base)' }}
                  />
                </div>

                <div>
                  <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                    Mitigation Strategy *
                  </label>
                  <textarea
                    value={changeRequest.proposedSolution}
                    onChange={(e) => setChangeRequest({ ...changeRequest, proposedSolution: e.target.value })}
                    placeholder="Describe the recommended schedule adjustment or remediation approach..."
                    rows={4}
                    className="w-full px-4 py-3 bg-input-background border-2 border-border rounded-[var(--radius-input)] focus:border-ring focus:outline-none font-[family-name:var(--font-family)] text-foreground resize-none"
                    style={{ fontSize: 'var(--text-base)' }}
                  />
                </div>

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
              </div>
            </div>

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
                Submit to Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
