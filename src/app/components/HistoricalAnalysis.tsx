import { Calendar, CalendarDays, CalendarRange, TrendingUp, TrendingDown, Video, FileText, Target, AlertTriangle, CheckCircle2, DraftingCompass, Map as MapIcon } from 'lucide-react';
import { useState } from 'react';
import { ProductionMetrics } from './ProductionMetrics';
import { InlineMapView } from './InlineMapView';
import { PreShiftReview } from './PreShiftReview';


interface VolumeData {
  totalMoved: number; // cubic yards
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

export function HistoricalAnalysis({ onScrollToPlan, onScrollToMap, onScrollToVideo, videoRef, assetName, assetLocation }: HistoricalAnalysisProps) {
  const [activeRange, setActiveRange] = useState<TimeRange>('daily');
  const [volumeData] = useState<VolumeData>(mockVolumeData);

  // Mock data
  const safetyScore = {
    current: 87,
    previous: 82,
    trend: 'up' as const,
  };

  const productivityMetrics = {
    hoursOperated: 8.5,
    materialMoved: 245,
    fuelEfficiency: 92,
  };

  const trendData = [
    { label: 'Mon', value: 85 },
    { label: 'Tue', value: 78 },
    { label: 'Wed', value: 92 },
    { label: 'Thu', value: 88 },
    { label: 'Fri', value: 87 },
    { label: 'Sat', value: 90 },
    { label: 'Sun', value: 87 },
  ];

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-foreground mb-2">Shift Review - Game Tape</h2>
            <p className="text-muted-foreground">Review trends, generate reports, and establish action items</p>
          </div>
          
          {/* Compact Timeframe Selector */}
          <button 
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-muted/30 border border-border/40 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-300 shadow-inner"
            title="Filter by Timeframe (Daily/Weekly/Monthly)"
          >
            <Calendar className="w-5.5 h-5.5 stroke-[1.5]" />
          </button>

          <div className="w-px h-10 bg-border/60 mx-2" />

          {/* Quick Access Icons */}
          <div className="flex gap-2 bg-muted/30 rounded-2xl p-1.5 border border-border/40 shadow-inner">
            <button
              onClick={onScrollToPlan}
              className="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:shadow-sm"
              title="Quick Access: Plan vs. Field"
            >
              <DraftingCompass className="w-5.5 h-5.5 stroke-[1.5]" />
            </button>
            <button
              onClick={onScrollToMap}
              className="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:shadow-sm"
              title="Quick Access: Map Recap"
            >
              <MapIcon className="w-5.5 h-5.5 stroke-[1.5]" />
            </button>
            <button
              onClick={onScrollToVideo}
              className="w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300 text-muted-foreground hover:bg-muted/50 hover:text-foreground hover:shadow-sm"
              title="Quick Access: Video Events"
            >
              <Video className="w-5.5 h-5.5 stroke-[1.5]" />
            </button>
          </div>
        </div>

        {/* 1. Safety Score Card */}
        <div className="bg-card rounded-[var(--radius-card)] border-2 border-border p-6 shadow-[var(--elevation-sm)]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-foreground" />
              <h3 className="text-foreground">Safety Performance Score</h3>
            </div>
            <div className="flex items-center gap-2">
              {safetyScore.trend === 'up' ? (
                <TrendingUp className="w-5 h-5 text-foreground" />
              ) : (
                <TrendingDown className="w-5 h-5 text-muted-foreground" />
              )}
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

            {/* Trend Chart */}
            <div className="flex-1 flex items-end gap-2 h-32">
              {trendData.map((point, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-muted rounded-t-sm relative" style={{ height: '100%' }}>
                    <div 
                      className="absolute bottom-0 w-full bg-foreground rounded-t-sm transition-all"
                      style={{ height: `${point.value}%` }}
                    ></div>
                  </div>
                  <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                    {point.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-[var(--radius-card)]">
              <p className="text-muted-foreground mb-1" style={{ fontSize: 'var(--text-sm)' }}>Hours Operated</p>
              <p className="text-foreground font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-lg)' }}>
                {productivityMetrics.hoursOperated} hrs
              </p>
            </div>
            <div className="p-4 bg-muted rounded-[var(--radius-card)]">
              <p className="text-muted-foreground mb-1" style={{ fontSize: 'var(--text-sm)' }}>Material Moved</p>
              <p className="text-foreground font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-lg)' }}>
                {productivityMetrics.materialMoved} yd³
              </p>
            </div>
            <div className="p-4 bg-muted rounded-[var(--radius-card)]">
              <p className="text-muted-foreground mb-1" style={{ fontSize: 'var(--text-sm)' }}>Fuel Efficiency</p>
              <p className="text-foreground font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-lg)' }}>
                {productivityMetrics.fuelEfficiency}%
              </p>
            </div>
          </div>
        </div>

        {/* 2. Shift Production Detail (Daily Breakdown) */}
        {activeRange === 'daily' && (
          <div className="bg-card rounded-[var(--radius-card)] border-2 border-border p-6 shadow-[var(--elevation-sm)]">
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
        )}

        {/* 3. Volume Moved - Real-Time Running Total */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-[var(--radius-card)] border-2 border-primary/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-[var(--radius-button)] bg-primary">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="text-foreground mb-1">Volume Moved - Running Total</h4>
              <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                Real-time cubic yard calculation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white/50 rounded-[var(--radius-button)] border border-border p-4">
              <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                Total Moved
              </p>
              <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-3xl)' }}>
                {volumeData.totalMoved.toLocaleString()}
              </p>
              <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                cubic yards
              </p>
            </div>

            <div className="bg-white/50 rounded-[var(--radius-button)] border border-border p-4">
              <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                Today
              </p>
              <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-3xl)' }}>
                {volumeData.todayMoved.toLocaleString()}
              </p>
              <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                {((volumeData.todayMoved / volumeData.targetDaily) * 100).toFixed(1)}% of daily target
              </p>
            </div>

            <div className="bg-white/50 rounded-[var(--radius-button)] border border-border p-4">
              <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                Hourly Rate
              </p>
              <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-3xl)' }}>
                {volumeData.hourlyRate.toFixed(1)}
              </p>
              <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                cy³/hour
              </p>
            </div>

            <div className="bg-white/50 rounded-[var(--radius-button)] border border-border p-4">
              <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                Progress
              </p>
              <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-3xl)' }}>
                {volumeData.percentComplete.toFixed(1)}%
              </p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                   className="h-full bg-primary transition-all duration-500"
                   style={{ width: `${volumeData.percentComplete}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>


        {/* Consolidated Pre-Shift Review & Handover Module */}
        <PreShiftReview 
          videoRef={videoRef} 
          assetName={assetName}
          assetLocation={assetLocation}
        />
    </div>
  );
}