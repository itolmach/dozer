import { useState } from 'react';
import { 
  Activity, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Info,
  AlertOctagon,
  Droplet,
  Wrench,
  TrendingUp,
  AlertTriangle,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle
} from 'lucide-react';
import { DowntimeAttributionModal } from './DowntimeAttributionModal';
import { MaintenanceAlerts } from './MaintenanceAlerts';

interface IdleTimeSegment {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  attributed: boolean;
  taskCode?: string;
  taskName?: string;
}

export function ProductionMetricsToday() {
  const [showAttributionModal, setShowAttributionModal] = useState(false);
  const [selectedIdleSegment, setSelectedIdleSegment] = useState<IdleTimeSegment | null>(null);

  // Mock idle time segments
  const [idleSegments, setIdleSegments] = useState<IdleTimeSegment[]>([
    {
      id: 'IDLE-001',
      startTime: '09:15 AM',
      endTime: '09:47 AM',
      duration: 32,
      attributed: false
    },
    {
      id: 'IDLE-002',
      startTime: '11:30 AM',
      endTime: '12:13 PM',
      duration: 43,
      attributed: true,
      taskCode: 'CC-4200',
      taskName: 'Rock Blasting Delay'
    }
  ]);
  const handleAttributeIdleTime = (segment: IdleTimeSegment) => {
    setSelectedIdleSegment(segment);
    setShowAttributionModal(true);
  };

  const handleAttributionComplete = (taskCode: string, taskName: string, isOverhead: boolean) => {
    if (selectedIdleSegment) {
      setIdleSegments(prev =>
        prev.map(seg =>
          seg.id === selectedIdleSegment.id
            ? {
                ...seg,
                attributed: true,
                taskCode,
                taskName
              }
            : seg
        )
      );
    }
    setShowAttributionModal(false);
    setSelectedIdleSegment(null);
  };

  const totalIdleMinutes = idleSegments.reduce((sum, seg) => sum + seg.duration, 0);
  const unattributedIdleMinutes = idleSegments
    .filter(seg => !seg.attributed)
    .reduce((sum, seg) => sum + seg.duration, 0);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <>
      <div className="bg-card rounded-[var(--radius-card)] border-2 border-border p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-foreground" />
            <h3 className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-lg)' }}>
              Production Metrics - Today
            </h3>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-full">
            <TrendingUp className="w-4 h-4 text-foreground" />
            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
              88% Efficiency
            </span>
          </div>
        </div>

        {/* Time Metrics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Active Time */}
          <div className="bg-background rounded-[var(--radius-card)] border-2 border-border p-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-color-success rounded-full"></div>
              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                Active Time
              </span>
            </div>
            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-3xl)' }}>
              8h 45m
            </div>
          </div>

          {/* Idle Time with Attribution Status */}
          <div className="bg-background rounded-[var(--radius-card)] border-2 border-border p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${unattributedIdleMinutes > 0 ? 'bg-color-warning' : 'bg-muted-foreground'}`}></div>
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                  Idle Time
                </span>
              </div>
              {unattributedIdleMinutes > 0 && (
                <div className="px-2 py-1 bg-color-warning/20 rounded-full">
                  <span className="text-color-warning font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xs)' }}>
                    NEEDS CODING
                  </span>
                </div>
              )}
            </div>
            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-3xl)' }}>
              {formatDuration(totalIdleMinutes)}
            </div>
            {unattributedIdleMinutes > 0 && (
              <div className="mt-2 text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                {formatDuration(unattributedIdleMinutes)} unattributed
              </div>
            )}
          </div>

          {/* Total Time */}
          <div className="bg-background rounded-[var(--radius-card)] border-2 border-border p-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-foreground" />
              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                Total Time
              </span>
            </div>
            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-3xl)' }}>
              10h 0m
            </div>
          </div>
        </div>

        {/* Idle Time Attribution Section */}
        {idleSegments.length > 0 && (
          <div className="mb-6 p-4 bg-muted/50 rounded-[var(--radius-card)] border-2 border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-foreground" />
                <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                  Downtime Tracking
                </h4>
              </div>
              {unattributedIdleMinutes > 0 && (
                <div className="flex items-center gap-2 px-3 py-1 bg-color-warning/20 rounded-full">
                  <AlertTriangle className="w-4 h-4 text-color-warning" />
                  <span className="text-color-warning font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-sm)' }}>
                    Action Required
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              {idleSegments.map(segment => (
                <div
                  key={segment.id}
                  className={`flex items-center justify-between p-3 rounded-[var(--radius-button)] border-2 ${
                    segment.attributed
                      ? 'bg-background border-border'
                      : 'bg-color-warning/10 border-color-warning'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-center min-w-[100px]">
                      <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                        {segment.startTime}
                      </div>
                      <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                        to {segment.endTime}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                        {formatDuration(segment.duration)} idle
                      </div>
                      {segment.attributed ? (
                        <div className="flex items-center gap-2 mt-1">
                          <CheckCircle className="w-4 h-4 text-color-success" />
                          <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                            {segment.taskCode}: {segment.taskName}
                          </span>
                        </div>
                      ) : (
                        <div className="text-color-warning font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                          Not yet attributed to cost code
                        </div>
                      )}
                    </div>
                  </div>
                  {!segment.attributed && (
                    <button
                      onClick={() => handleAttributeIdleTime(segment)}
                      className="min-w-[180px] min-h-[60px] px-6 py-3 rounded-[var(--radius-button)] bg-foreground text-background hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <FileText className="w-5 h-5" />
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                        Attribute to Code
                      </span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dual-Tier Alert System - Consourced from MaintenanceAlerts */}
        <div className="space-y-4">
          <MaintenanceAlerts />
        </div>
      </div>

      {/* Downtime Attribution Modal */}
      {showAttributionModal && selectedIdleSegment && (
        <DowntimeAttributionModal
          segment={selectedIdleSegment}
          onComplete={handleAttributionComplete}
          onCancel={() => {
            setShowAttributionModal(false);
            setSelectedIdleSegment(null);
          }}
        />
      )}
    </>
  );
}
