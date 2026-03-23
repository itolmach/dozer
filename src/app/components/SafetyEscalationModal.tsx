import { useState } from 'react';
import { 
  AlertTriangle, 
  ShieldAlert,
  User,
  Clock,
  MapPin,
  FileText,
  Download,
  CheckCircle,
  Radio,
  Activity
} from 'lucide-react';

interface RedZoneEvent {
  id: string;
  timestamp: string;
  assetId: string;
  assetName: string;
  location: {
    zone: string;
    coordinates: string;
  };
  wearableId: string;
  personName: string;
  severity: 'CRITICAL' | 'HIGH';
  proximityDistance: number; // in meters
  assetSpeed: number; // km/h
  eventType: 'RED_ZONE_INCURSION';
}

interface ForensicDataPackage {
  eventId: string;
  preTriggerTelemetry: {
    timestamp: string;
    assetSpeed: number;
    engineRPM: number;
    fuelRate: number;
    gpsCoordinates: string;
    proximity: number;
  }[];
  wearableData: {
    timestamp: string;
    heartRate: number;
    location: string;
    movementSpeed: number;
  }[];
  environmentalConditions: {
    visibility: string;
    temperature: string;
    weatherCondition: string;
  };
}

interface SafetyEscalationModalProps {
  event: RedZoneEvent;
  onSignOff: (supervisorName: string, notes: string) => void;
}

export function SafetyEscalationModal({ event, onSignOff }: SafetyEscalationModalProps) {
  const [supervisorName, setSupervisorName] = useState('');
  const [incidentNotes, setIncidentNotes] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isExportingForensic, setIsExportingForensic] = useState(false);
  const [forensicExported, setForensicExported] = useState(false);
  const [isSigningOff, setIsSigningOff] = useState(false);
  const [signOffComplete, setSignOffComplete] = useState(false);

  // Calculate time since event
  const eventTime = new Date(event.timestamp);
  const now = new Date();
  const secondsSinceEvent = Math.floor((now.getTime() - eventTime.getTime()) / 1000);
  const minutesSinceEvent = Math.floor(secondsSinceEvent / 60);

  // Mock forensic data (in real app, this would be pulled from backend)
  const generateForensicData = (): ForensicDataPackage => {
    const preTriggerTelemetry = [];
    const wearableData = [];
    const eventTimestamp = new Date(event.timestamp);

    // Generate 30 seconds of pre-event telemetry (1 second intervals)
    for (let i = 30; i >= 0; i--) {
      const timestamp = new Date(eventTimestamp.getTime() - (i * 1000));
      preTriggerTelemetry.push({
        timestamp: timestamp.toISOString(),
        assetSpeed: event.assetSpeed - (i * 0.2) + Math.random() * 2,
        engineRPM: 1850 + Math.random() * 100,
        fuelRate: 18.5 + Math.random() * 2,
        gpsCoordinates: `${event.location.coordinates}`,
        proximity: event.proximityDistance + (i * 0.5)
      });

      wearableData.push({
        timestamp: timestamp.toISOString(),
        heartRate: 72 + Math.floor(Math.random() * 20),
        location: event.location.zone,
        movementSpeed: 1.2 + Math.random() * 0.5
      });
    }

    return {
      eventId: event.id,
      preTriggerTelemetry,
      wearableData,
      environmentalConditions: {
        visibility: 'Clear, 10+ km',
        temperature: '22°C',
        weatherCondition: 'Sunny, No precipitation'
      }
    };
  };

  const handleExportForensicData = () => {
    setIsExportingForensic(true);

    // Simulate forensic data export
    setTimeout(() => {
      const forensicData = generateForensicData();
      
      // Create downloadable JSON file
      const dataStr = JSON.stringify(forensicData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `FORENSIC_${event.id}_${event.timestamp.replace(/[:.]/g, '-')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsExportingForensic(false);
      setForensicExported(true);

      // Log for audit trail
      console.log('Forensic data exported:', {
        eventId: event.id,
        exportedBy: 'Current User',
        exportTimestamp: new Date().toISOString(),
        dataPoints: forensicData.preTriggerTelemetry.length
      });
    }, 1500);
  };

  const handleSignOff = () => {
    setValidationError('');

    // Validation
    if (!supervisorName.trim()) {
      setValidationError('Supervisor name is required for digital sign-off');
      return;
    }

    if (supervisorName.trim().length < 3) {
      setValidationError('Supervisor name must be at least 3 characters');
      return;
    }

    if (!incidentNotes.trim()) {
      setValidationError('Incident notes are required - document what action was taken');
      return;
    }

    if (incidentNotes.trim().length < 10) {
      setValidationError('Incident notes must be at least 10 characters - provide sufficient detail');
      return;
    }

    // Begin sign-off process
    setIsSigningOff(true);

    // Simulate saving to audit trail (1.5 seconds)
    setTimeout(() => {
      // Mark sign-off as complete
      setSignOffComplete(true);
      
      // Log to audit trail
      console.log('=== SAFETY INCIDENT SIGNED OFF ===');
      console.log('Event ID:', event.id);
      console.log('Supervisor:', supervisorName);
      console.log('Timestamp:', new Date().toISOString());
      console.log('Incident Notes:', incidentNotes);
      console.log('Forensic Data Exported:', forensicExported ? 'Yes' : 'No');
      console.log('================================');

      // Wait 2 seconds to show success state, then unlock UI
      setTimeout(() => {
        onSignOff(supervisorName, incidentNotes);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[9999]">
      {/* Pulsing Alert Border (only show if not signed off) */}
      {!signOffComplete && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 border-8 border-destructive animate-pulse"></div>
        </div>
      )}

      {/* Success Overlay - Shows after sign-off complete */}
      {signOffComplete && (
        <div className="absolute inset-0 bg-color-success/20 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="bg-card rounded-[var(--radius-card)] border-8 border-color-success shadow-[var(--elevation-xl)] p-12 max-w-2xl mx-8 text-center">
            <div className="w-32 h-32 rounded-full bg-color-success/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-20 h-20 text-color-success" />
            </div>
            <h2 className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground mb-4" style={{ fontSize: 'var(--text-3xl)' }}>
              Sign-Off Complete
            </h2>
            <p className="font-[family-name:var(--font-family)] text-foreground mb-6" style={{ fontSize: 'var(--text-lg)' }}>
              Incident documented and saved to audit trail.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3 text-foreground">
                <div className="w-3 h-3 rounded-full bg-color-success animate-pulse"></div>
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                  Supervisor: {supervisorName}
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 text-foreground">
                <div className="w-3 h-3 rounded-full bg-color-success animate-pulse"></div>
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                  Event ID: {event.id}
                </span>
              </div>
              <div className="flex items-center justify-center gap-3 text-foreground">
                <div className="w-3 h-3 rounded-full bg-color-success animate-pulse"></div>
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                  Unlocking dashboard...
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card rounded-[var(--radius-card)] border-8 border-destructive shadow-[var(--elevation-xl)] max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col m-8">
        {/* Critical Alert Header */}
        <div className="sticky top-0 bg-destructive text-white px-8 py-6 border-b-8 border-destructive/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="min-w-[80px] min-h-[80px] rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)]" style={{ fontSize: 'var(--text-3xl)' }}>
                    SAFETY ESCALATION - RED ZONE INCURSION
                  </h2>
                  <div className="px-4 py-2 bg-white/20 rounded-full">
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)]" style={{ fontSize: 'var(--text-sm)' }}>
                      CRITICAL
                    </span>
                  </div>
                </div>
                <p className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-base)' }}>
                  System locked until supervisor digital sign-off is completed
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                Time Since Event
              </div>
              <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)]" style={{ fontSize: 'var(--text-3xl)' }}>
                {minutesSinceEvent}:{String(secondsSinceEvent % 60).padStart(2, '0')}
              </div>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-destructive/20 border-b-4 border-destructive/50 px-8 py-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
            <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
              Person-In-Vicinity wearable sensor detected unauthorized personnel within the red zone safety perimeter. All operations must be reviewed before continuing.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Event Details */}
            <div className="bg-background rounded-[var(--radius-card)] border-4 border-destructive p-6">
              <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground mb-6" style={{ fontSize: 'var(--text-xl)' }}>
                Incident Details
              </h3>

              <div className="grid grid-cols-2 gap-6">
                {/* Event ID */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-foreground" />
                    <div className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                      Event ID
                    </div>
                  </div>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                    {event.id}
                  </div>
                </div>

                {/* Timestamp */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-foreground" />
                    <div className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                      Event Timestamp
                    </div>
                  </div>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                    {new Date(event.timestamp).toLocaleString()}
                  </div>
                </div>

                {/* Asset */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-foreground" />
                    <div className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                      Asset Involved
                    </div>
                  </div>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                    {event.assetName}
                  </div>
                  <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                    ID: {event.assetId}
                  </div>
                </div>

                {/* Person */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-foreground" />
                    <div className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                      Person In Vicinity
                    </div>
                  </div>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                    {event.personName}
                  </div>
                  <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                    Wearable ID: {event.wearableId}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-foreground" />
                    <div className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                      Location
                    </div>
                  </div>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                    {event.location.zone}
                  </div>
                  <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                    {event.location.coordinates}
                  </div>
                </div>

                {/* Proximity */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Radio className="w-5 h-5 text-foreground" />
                    <div className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                      Proximity Distance
                    </div>
                  </div>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-2xl)' }}>
                    {event.proximityDistance.toFixed(1)}m
                  </div>
                  <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                    Asset Speed: {event.assetSpeed.toFixed(1)} km/h
                  </div>
                </div>
              </div>
            </div>

            {/* Forensic Data Export */}
            <div className="bg-muted/50 rounded-[var(--radius-card)] border-2 border-border p-6">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Download className="w-6 h-6 text-foreground" />
                    <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                      Forensic Data Package
                    </h4>
                  </div>
                  <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                    Export 30 seconds of pre-event telemetry data for legal review and incident investigation. 
                    Includes asset telemetry, wearable sensor data, and environmental conditions.
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-foreground">
                      <div className="w-2 h-2 rounded-full bg-foreground"></div>
                      <span className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                        30-second pre-trigger asset telemetry (speed, RPM, fuel, GPS)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <div className="w-2 h-2 rounded-full bg-foreground"></div>
                      <span className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                        Wearable sensor data (heart rate, location, movement)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <div className="w-2 h-2 rounded-full bg-foreground"></div>
                      <span className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                        Environmental conditions snapshot
                      </span>
                    </div>
                  </div>
                  {forensicExported && (
                    <div className="mt-4 p-3 bg-color-success/20 rounded-[var(--radius-button)] border-2 border-color-success">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-color-success" />
                        <span className="text-color-success font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-sm)' }}>
                          Forensic data exported successfully
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleExportForensicData}
                  disabled={isExportingForensic}
                  className="min-w-[200px] min-h-[80px] px-6 rounded-[var(--radius-button)] bg-foreground text-background hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-50 flex-shrink-0"
                >
                  <Download className="w-6 h-6" />
                  <div className="text-left">
                    <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)]" style={{ fontSize: 'var(--text-base)' }}>
                      {isExportingForensic ? 'Exporting...' : 'Export Forensic Data'}
                    </div>
                    <div className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                      Legal Review Package
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Validation Error */}
            {validationError && (
              <div className="p-4 bg-destructive/10 rounded-[var(--radius-card)] border-2 border-destructive">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <p className="text-destructive font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-sm)' }}>
                    {validationError}
                  </p>
                </div>
              </div>
            )}

            {/* Digital Sign-Off Form */}
            <div className="bg-background rounded-[var(--radius-card)] border-4 border-primary p-6">
              <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground mb-4" style={{ fontSize: 'var(--text-xl)' }}>
                Mandatory Supervisor Digital Sign-Off
              </h3>
              <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-6" style={{ fontSize: 'var(--text-sm)' }}>
                Document incident response and authorize UI unlock. This sign-off becomes part of the permanent safety audit trail.
              </p>

              <div className="space-y-6">
                {/* Supervisor Name */}
                <div>
                  <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-3" style={{ fontSize: 'var(--text-base)' }}>
                    Supervisor Name (Full Name) *
                  </label>
                  <input
                    type="text"
                    value={supervisorName}
                    onChange={(e) => setSupervisorName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full min-h-[70px] px-6 py-4 bg-muted rounded-[var(--radius-button)] border-4 border-border focus:border-primary focus:outline-none font-[family-name:var(--font-family)] text-foreground placeholder:text-muted-foreground"
                    style={{ fontSize: 'var(--text-lg)' }}
                  />
                </div>

                {/* Incident Notes */}
                <div>
                  <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-3" style={{ fontSize: 'var(--text-base)' }}>
                    Incident Notes & Action Taken *
                  </label>
                  <textarea
                    value={incidentNotes}
                    onChange={(e) => setIncidentNotes(e.target.value)}
                    placeholder="Document what happened, actions taken, and any follow-up required..."
                    rows={6}
                    className="w-full px-6 py-4 bg-muted rounded-[var(--radius-button)] border-4 border-border focus:border-primary focus:outline-none font-[family-name:var(--font-family)] text-foreground placeholder:text-muted-foreground resize-none"
                    style={{ fontSize: 'var(--text-base)' }}
                  />
                  <div className="mt-2 text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                    Minimum 10 characters required. Be specific about corrective actions.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Sign-Off Action */}
        <div className="sticky bottom-0 bg-primary border-t-8 border-primary/30 px-8 py-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <div className="text-white">
              <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] mb-1" style={{ fontSize: 'var(--text-lg)' }}>
                System Locked - Awaiting Sign-Off
              </div>
              <div className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                Complete all fields above to unlock the dashboard and resume operations
              </div>
            </div>
            <button
              onClick={handleSignOff}
              disabled={isSigningOff}
              className="min-w-[280px] min-h-[80px] px-8 rounded-[var(--radius-button)] bg-white text-primary hover:bg-white/90 transition-all flex items-center justify-center gap-3 shadow-[var(--elevation-lg)] disabled:opacity-70"
            >
              <CheckCircle className="w-7 h-7" />
              <div className="text-left">
                <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)]" style={{ fontSize: 'var(--text-xl)' }}>
                  {isSigningOff ? 'Processing Sign-Off...' : 'Complete Digital Sign-Off'}
                </div>
                <div className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  {isSigningOff ? 'Saving to audit trail' : 'Unlock Dashboard'}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}