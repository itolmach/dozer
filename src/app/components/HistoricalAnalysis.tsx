import React, { useState, useRef, useEffect } from 'react';
import { ProductionMetrics } from './ProductionMetrics';
import { PreShiftReview } from './PreShiftReview';
import { ProductionVelocity } from './ProductionVelocity';
import { DailyPrepFlow } from './DailyPrepFlow';
import { DowntimeAttributionModal } from './DowntimeAttributionModal';
import { SafetyIntelligenceMap } from './SafetyIntelligenceMap';
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Target, 
  Activity, 
  Zap, 
  ClipboardList,
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Map
} from 'lucide-react';

interface VolumeData {
  totalMoved: number;
  todayMoved: number;
  hourlyRate: number;
  targetDaily: number;
  percentComplete: number;
}

const mockVolumeData: VolumeData = {
  totalMoved: 24567.5,
  todayMoved: 892.3,
  hourlyRate: 127.5,
  targetDaily: 1200,
  percentComplete: 74.4
};

interface IdleTimeSegment {
  id: string;
  startTime: string;
  endTime: string;
  duration: number; // minutes
  attributed: boolean;
  taskCode?: string;
  taskName?: string;
}

type TimeRange = 'daily' | 'weekly' | 'monthly';

interface HistoricalAnalysisProps {
  onScrollToPlan?: () => void;
  onScrollToMap?: () => void;
  onScrollToVideo?: () => void;
  videoRef?: React.RefObject<HTMLDivElement | null>;
  assetName: string;
  assetLocation: any;
}

const sections = [
  { id: 'safety-map', label: 'Location Review',       icon: Map           },
  { id: 'production', label: 'Shift Production',      icon: FileText      },
  { id: 'preshift',   label: 'Action Items',          icon: ClipboardList },
  { id: 'dailyprep',  label: 'Shift Plan',            icon: Calendar      },
];

export function HistoricalAnalysis({ onScrollToPlan, onScrollToMap, onScrollToVideo, videoRef, assetName, assetLocation }: HistoricalAnalysisProps) {
  const [activeRange] = useState<TimeRange>('daily');
  const [volumeData] = useState<VolumeData>(mockVolumeData);
  const [activeSection, setActiveSection] = useState('production');
  const [isProductionCollapsed, setIsProductionCollapsed] = useState(false);
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);
  const [isPreshiftCollapsed, setIsPreshiftCollapsed] = useState(false);
  const [isDailyPrepCollapsed, setIsDailyPrepCollapsed] = useState(false);

  const dailyprepRef  = useRef<HTMLDivElement>(null);
  const productionRef = useRef<HTMLDivElement>(null);
  const preshiftRef   = useRef<HTMLDivElement>(null);
  const mapRef        = useRef<HTMLDivElement>(null);

  const [showAttributionModal, setShowAttributionModal] = useState(false);
  const [selectedIdleSegment, setSelectedIdleSegment] = useState<IdleTimeSegment | null>(null);
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

  const unattributedIdleMinutes = idleSegments
    .filter(seg => !seg.attributed)
    .reduce((sum, seg) => sum + seg.duration, 0);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    'safety-map': mapRef,
    production: productionRef,
    preshift: preshiftRef,
    dailyprep: dailyprepRef,
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    Object.entries(sectionRefs).forEach(([id, ref]) => {
      if (!ref.current) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.25 }
      );
      obs.observe(ref.current);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs[id]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  };

  const productivityMetrics = { hoursOperated: 8.5, materialMoved: 245, fuelEfficiency: 92 };

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-foreground mb-2">Shift Review — Game Tape</h2>
          <p className="text-muted-foreground">Review trends, generate reports, and establish action items</p>
        </div>
        <button
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-muted/30 border border-border/40 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-300 shadow-inner"
          title="Filter by Timeframe (Daily/Weekly/Monthly)"
        >
          <Calendar className="w-5 h-5 stroke-[1.5]" />
        </button>
      </div>

      {/* Sticky Sub-Navigation */}
      <div className="sticky top-0 z-20 -mx-8 px-8 py-2 bg-background/90 backdrop-blur-md border-b border-border/60 mb-8">
        <div className="flex items-center gap-1">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                font-[family-name:var(--font-family)]
                ${activeSection === id
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-8">

        {/* 1. Location Review */}
        <div ref={mapRef} className="scroll-mt-16 bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
          <button
            onClick={() => setIsMapCollapsed(!isMapCollapsed)}
            className="w-full text-left p-6 hover:bg-muted/30 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Map className="w-6 h-6 text-foreground" />
              <h3 className="text-foreground">Location Review</h3>
            </div>
            <div className={`p-2 rounded-lg bg-muted border border-border group-hover:bg-background transition-all ${isMapCollapsed ? '' : 'rotate-180'}`}>
              <ChevronDown className="w-5 h-5 text-foreground" />
            </div>
          </button>

          {!isMapCollapsed && (
            <div className="p-0">
              <SafetyIntelligenceMap
                assetName={assetName}
                assetLocation={assetLocation}
                videoRef={videoRef}
              />
            </div>
          )}
        </div>

        {/* 2. Shift Production Detail */}
        <div ref={productionRef} className="scroll-mt-16 bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
          <button
            onClick={() => setIsProductionCollapsed(!isProductionCollapsed)}
            className="w-full text-left p-6 hover:bg-muted/30 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-foreground" />
              <h3 className="text-foreground">Shift Production</h3>
            </div>
            <div className={`p-2 rounded-lg bg-muted border border-border group-hover:bg-background transition-all ${isProductionCollapsed ? '' : 'rotate-180'}`}>
              <ChevronDown className="w-5 h-5 text-foreground" />
            </div>
          </button>

          {!isProductionCollapsed && (
            <div className="p-6 pt-0">
              {/* Volume Moved — Running Total (Embedded) */}
          <div className="mb-8 p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-[var(--radius-card)] border-2 border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="min-w-[50px] min-h-[50px] flex items-center justify-center rounded-[var(--radius-button)] bg-primary">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-foreground font-semibold" style={{ fontSize: 'var(--text-lg)' }}>Volume Moved — Running Total</h4>
                <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                  Real-time cubic yard calculation
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white/50 rounded-xl border border-border p-3">
                <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-0.5" style={{ fontSize: '10px' }}>Total Moved</p>
                <p className="text-foreground font-[var(--font-weight-bold)]" style={{ fontSize: 'var(--text-2xl)' }}>{volumeData.totalMoved.toLocaleString()}</p>
                <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: '10px' }}>cubic yards</p>
              </div>
              <div className="bg-white/50 rounded-xl border border-border p-3">
                <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-0.5" style={{ fontSize: '10px' }}>Today</p>
                <p className="text-foreground font-[var(--font-weight-bold)]" style={{ fontSize: 'var(--text-2xl)' }}>{volumeData.todayMoved.toLocaleString()}</p>
                <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: '10px' }}>{((volumeData.todayMoved / volumeData.targetDaily) * 100).toFixed(1)}% of target</p>
              </div>
              <div className="bg-white/50 rounded-xl border border-border p-3">
                <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-0.5" style={{ fontSize: '10px' }}>Hourly Rate</p>
                <p className="text-foreground font-[var(--font-weight-bold)]" style={{ fontSize: 'var(--text-2xl)' }}>{volumeData.hourlyRate.toFixed(1)}</p>
                <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: '10px' }}>cy³/hour</p>
              </div>
              <div className="bg-white/50 rounded-xl border border-border p-3">
                <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-0.5" style={{ fontSize: '10px' }}>Progress</p>
                <p className="text-foreground font-[var(--font-weight-bold)]" style={{ fontSize: 'var(--text-2xl)' }}>{volumeData.percentComplete.toFixed(1)}%</p>
                <div className="mt-1.5 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500" style={{ width: `${volumeData.percentComplete}%` }} />
                </div>
              </div>
            </div>
          </div>

          <ProductionMetrics />

          {/* Idle Time Attribution Section */}
          {idleSegments.length > 0 && (
            <div className="mt-8 p-6 bg-muted/30 rounded-[var(--radius-card)] border-2 border-border/60">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-foreground" />
                  <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
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

              <div className="space-y-3">
                {idleSegments.map(segment => (
                  <div
                    key={segment.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 ${
                      segment.attributed
                        ? 'bg-background border-border/40 hover:border-border/80'
                        : 'bg-color-warning/5 border-color-warning/40 hover:border-color-warning shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-6 flex-1">
                      <div className="text-center min-w-[100px] py-1 border-r border-border/40 pr-6">
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                          {segment.startTime}
                        </div>
                        <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: '11px' }}>
                          to {segment.endTime}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
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
                          <div className="text-color-warning font-[family-name:var(--font-family)] mt-0.5" style={{ fontSize: 'var(--text-sm)' }}>
                            Not yet attributed to cost code
                          </div>
                        )}
                      </div>
                    </div>
                    {!segment.attributed && (
                      <button
                        onClick={() => handleAttributeIdleTime(segment)}
                        className="min-h-[52px] px-6 rounded-xl bg-foreground text-background hover:opacity-90 transition-all flex items-center justify-center gap-2 font-[var(--font-weight-semibold)] shadow-sm active:scale-[0.98]"
                      >
                        <FileText className="w-4 h-4" />
                        <span className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                          Attribute to Code
                        </span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
            <div className="mt-8 pt-8 border-t-2 border-border/60">
              <ProductionVelocity />
            </div>
          </div>
        )}
      </div>

        {/* 3. Pre-Shift Review & Handover */}
        <div ref={preshiftRef} className="scroll-mt-16 bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
          <button
            onClick={() => setIsPreshiftCollapsed(!isPreshiftCollapsed)}
            className="w-full text-left p-6 hover:bg-muted/30 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <ClipboardList className="w-6 h-6 text-foreground" />
              <h3 className="text-foreground">Action Items</h3>
            </div>
            <div className={`p-2 rounded-lg bg-muted border border-border group-hover:bg-background transition-all ${isPreshiftCollapsed ? '' : 'rotate-180'}`}>
              <ChevronDown className="w-5 h-5 text-foreground" />
            </div>
          </button>

          {!isPreshiftCollapsed && (
            <div className="p-6 pt-0">
              <PreShiftReview
                videoRef={videoRef}
                assetName={assetName}
                assetLocation={assetLocation}
              />
            </div>
          )}
        </div>



        {/* 4. Daily Shift Preparation */}
        <div ref={dailyprepRef} className="scroll-mt-16 bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
          <button 
            onClick={() => setIsDailyPrepCollapsed(!isDailyPrepCollapsed)}
            className="w-full text-left p-6 hover:bg-muted/30 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-foreground" />
              <h3 className="text-foreground">Shift Plan</h3>
            </div>
            <div className={`p-2 rounded-lg bg-muted border border-border group-hover:bg-background transition-all ${isDailyPrepCollapsed ? '' : 'rotate-180'}`}>
              <ChevronDown className="w-5 h-5 text-foreground" />
            </div>
          </button>

          {!isDailyPrepCollapsed && (
            <div className="p-6 pt-0">
              <DailyPrepFlow
                inline
                assetName={assetName}
                assetId="JD-650-001"
              />
            </div>
          )}
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
    </div>
  );
}