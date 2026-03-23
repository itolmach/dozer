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
  FileText,
  CheckCircle,
  Gauge,
  Filter,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  DollarSign
} from 'lucide-react';


export function ProductionMetricsToday() {
  const [dataFilter, setDataFilter] = useState<'raw' | 'normalized'>('raw');

  // Mock velocity data
  const velocityData = {
    current: 142,
    target: 180,
    unit: 'yd³/hr'
  };

  const velocityPercent = (velocityData.current / velocityData.target) * 100;
  const getVelocityStatus = () => {
    if (velocityPercent >= 100) return { label: 'On Target', color: 'var(--color-success)' };
    if (velocityPercent >= 85) return { label: 'Acceptable', color: 'var(--color-warning)' };
    return { label: 'At Risk', color: 'var(--destructive)' };
  };
  const velocityStatus = getVelocityStatus();

  const totalIdleMinutes = 75; // Mock total
  const unattributedIdleMinutes = 32; // Mock unattributed

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

        {/* Production Velocity Card - Moved from Shift Review */}
        <div className="mb-6 bg-background rounded-[var(--radius-card)] border-2 border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-foreground" />
              <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                Current Velocity
              </h4>
            </div>
            
            {/* Data Filter Toggle */}
            <div className="flex items-center gap-2 bg-muted rounded-full p-1 border-2 border-border">
              <button
                onClick={() => setDataFilter('raw')}
                className={`px-4 py-2 rounded-full transition-all font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] flex items-center gap-2 ${
                  dataFilter === 'raw'
                    ? 'bg-foreground text-background'
                    : 'text-foreground hover:bg-accent'
                }`}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                <Filter className="w-4 h-4" />
                Raw
              </button>
              <button
                onClick={() => setDataFilter('normalized')}
                className={`px-4 py-2 rounded-full transition-all font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] flex items-center gap-2 ${
                  dataFilter === 'normalized'
                    ? 'bg-foreground text-background'
                    : 'text-foreground hover:bg-accent'
                }`}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                <Filter className="w-4 h-4" />
                Normalized
              </button>
            </div>
          </div>

          <div className="flex items-center gap-12">
            {/* Circular Gauge Visual */}
            <div className="relative w-48 h-48 flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="var(--border)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={velocityStatus.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${Math.min(velocityPercent * 2.51, 251.2)} 251.2`}
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground" style={{ fontSize: 'var(--text-3xl)' }}>
                  {velocityData.current}
                </div>
                <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  {velocityData.unit}
                </div>
              </div>
            </div>

            {/* Performance Indicators */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-[var(--radius-button)] border-2 border-border">
                <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                  Performance
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)]" style={{ fontSize: 'var(--text-2xl)', color: velocityStatus.color }}>
                    {Math.round(velocityPercent)}%
                  </span>
                  <div className="px-2 py-0.5 rounded-full" style={{ backgroundColor: `${velocityStatus.color}20` }}>
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)]" style={{ fontSize: 'var(--text-[10px])', color: velocityStatus.color }}>
                      {velocityStatus.label.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-[var(--radius-button)] border-2 border-border">
                <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                  Target Baseline
                </div>
                <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
                  {velocityData.target} <span className="text-muted-foreground font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>{velocityData.unit}</span>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-[var(--radius-button)] border-2 border-border col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                      Variance from Bid
                    </div>
                    <div className={`font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] ${velocityData.current >= velocityData.target ? 'text-color-success' : 'text-destructive'}`} style={{ fontSize: 'var(--text-xl)' }}>
                      {velocityData.current >= velocityData.target ? '+' : ''}{velocityData.current - velocityData.target} {velocityData.unit}
                    </div>
                  </div>
                  {dataFilter === 'normalized' && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                      <TrendingUp className="w-3 h-3 text-primary" />
                      <span className="text-primary font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-[10px])' }}>
                        NORMALIZED
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
