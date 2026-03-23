import React, { useState, useRef, useEffect } from 'react';
import { Calendar, TrendingUp, TrendingDown, FileText, Target, Activity, Zap, ClipboardList } from 'lucide-react';
import { ProductionMetrics } from './ProductionMetrics';
import { PreShiftReview } from './PreShiftReview';
import { ProductionVelocity } from './ProductionVelocity';
import { DailyPrepFlow } from './DailyPrepFlow';

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
  { id: 'dailyprep',  label: 'Shift Prep',       icon: Calendar      },
  { id: 'safety',     label: 'Safety Score',     icon: Target        },
  { id: 'production', label: 'Shift Production',  icon: FileText      },
  { id: 'velocity',   label: 'Velocity',          icon: Zap           },
  { id: 'volume',     label: 'Volume Totals',     icon: Activity      },
  { id: 'preshift',   label: 'Pre-Shift Review',  icon: ClipboardList },
];

export function HistoricalAnalysis({ onScrollToPlan, onScrollToMap, onScrollToVideo, videoRef, assetName, assetLocation }: HistoricalAnalysisProps) {
  const [activeRange] = useState<TimeRange>('daily');
  const [volumeData] = useState<VolumeData>(mockVolumeData);
  const [activeSection, setActiveSection] = useState('dailyprep');

  const dailyprepRef  = useRef<HTMLDivElement>(null);
  const safetyRef     = useRef<HTMLDivElement>(null);
  const productionRef = useRef<HTMLDivElement>(null);
  const velocityRef   = useRef<HTMLDivElement>(null);
  const volumeRef     = useRef<HTMLDivElement>(null);
  const preshiftRef   = useRef<HTMLDivElement>(null);

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    dailyprep: dailyprepRef,
    safety: safetyRef,
    production: productionRef,
    velocity: velocityRef,
    volume: volumeRef,
    preshift: preshiftRef,
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

  const safetyScore = { current: 87, previous: 82, trend: 'up' as const };
  const productivityMetrics = { hoursOperated: 8.5, materialMoved: 245, fuelEfficiency: 92 };
  const trendData = [
    { label: 'Mon', value: 85 }, { label: 'Tue', value: 78 }, { label: 'Wed', value: 92 },
    { label: 'Thu', value: 88 }, { label: 'Fri', value: 87 }, { label: 'Sat', value: 90 }, { label: 'Sun', value: 87 },
  ];

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

        {/* 0. Daily Shift Preparation */}
        <div ref={dailyprepRef} className="scroll-mt-16">
          <DailyPrepFlow
            inline
            assetName={assetName}
            assetId="JD-650-001"
          />
        </div>

        {/* 1. Safety Score */}
        <div ref={safetyRef} className="scroll-mt-16 bg-card rounded-[var(--radius-card)] border-2 border-border p-6 shadow-[var(--elevation-sm)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-foreground" />
              <h3 className="text-foreground">Safety Performance Score</h3>
            </div>
            <div className="flex items-center gap-2">
              {safetyScore.trend === 'up'
                ? <TrendingUp className="w-5 h-5 text-foreground" />
                : <TrendingDown className="w-5 h-5 text-muted-foreground" />
              }
              <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                +{safetyScore.current - safetyScore.previous} vs. previous period
              </span>
            </div>
          </div>

          <div className="flex items-end gap-8 mb-6">
            <div>
              <div className="text-[64px] font-[var(--font-weight-bold)] text-foreground leading-none mb-2">
                {safetyScore.current}
              </div>
              <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-base)' }}>
                out of 100
              </span>
            </div>
            <div className="flex-1 flex items-end gap-2 h-32">
              {trendData.map((point, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-muted rounded-t-sm relative" style={{ height: '100%' }}>
                    <div
                      className="absolute bottom-0 w-full bg-foreground rounded-t-sm transition-all"
                      style={{ height: `${point.value}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                    {point.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-[var(--radius-card)]">
              <p className="text-muted-foreground mb-1" style={{ fontSize: 'var(--text-sm)' }}>Hours Operated</p>
              <p className="text-foreground font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-lg)' }}>{productivityMetrics.hoursOperated} hrs</p>
            </div>
            <div className="p-4 bg-muted rounded-[var(--radius-card)]">
              <p className="text-muted-foreground mb-1" style={{ fontSize: 'var(--text-sm)' }}>Material Moved</p>
              <p className="text-foreground font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-lg)' }}>{productivityMetrics.materialMoved} yd³</p>
            </div>
            <div className="p-4 bg-muted rounded-[var(--radius-card)]">
              <p className="text-muted-foreground mb-1" style={{ fontSize: 'var(--text-sm)' }}>Fuel Efficiency</p>
              <p className="text-foreground font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-lg)' }}>{productivityMetrics.fuelEfficiency}%</p>
            </div>
          </div>
        </div>

        {/* 2. Shift Production Detail */}
        <div ref={productionRef} className="scroll-mt-16 bg-card rounded-[var(--radius-card)] border-2 border-border p-6 shadow-[var(--elevation-sm)]">
          <div className="mb-6">
            <h3 className="text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Shift Production Detail
            </h3>
            <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
              Comprehensive cost code breakdown for the current shift period.
            </p>
          </div>
          <ProductionMetrics />
        </div>

        {/* 3. Production Velocity */}
        <div ref={velocityRef} className="scroll-mt-16">
          <ProductionVelocity />
        </div>

        {/* 4. Volume Moved — Running Total */}
        <div ref={volumeRef} className="scroll-mt-16 bg-gradient-to-br from-primary/5 to-primary/10 rounded-[var(--radius-card)] border-2 border-primary/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-[var(--radius-button)] bg-primary">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-foreground mb-1">Volume Moved — Running Total</h4>
              <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                Real-time cubic yard calculation
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/50 rounded-[var(--radius-button)] border border-border p-4">
              <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>Total Moved</p>
              <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-3xl)' }}>{volumeData.totalMoved.toLocaleString()}</p>
              <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>cubic yards</p>
            </div>
            <div className="bg-white/50 rounded-[var(--radius-button)] border border-border p-4">
              <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>Today</p>
              <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-3xl)' }}>{volumeData.todayMoved.toLocaleString()}</p>
              <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>{((volumeData.todayMoved / volumeData.targetDaily) * 100).toFixed(1)}% of daily target</p>
            </div>
            <div className="bg-white/50 rounded-[var(--radius-button)] border border-border p-4">
              <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>Hourly Rate</p>
              <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-3xl)' }}>{volumeData.hourlyRate.toFixed(1)}</p>
              <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>cy³/hour</p>
            </div>
            <div className="bg-white/50 rounded-[var(--radius-button)] border border-border p-4">
              <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>Progress</p>
              <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-3xl)' }}>{volumeData.percentComplete.toFixed(1)}%</p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${volumeData.percentComplete}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* 5. Pre-Shift Review & Handover */}
        <div ref={preshiftRef} className="scroll-mt-16">
          <PreShiftReview
            videoRef={videoRef}
            assetName={assetName}
            assetLocation={assetLocation}
          />
        </div>

      </div>
    </div>
  );
}