import React, { useRef, useEffect, useState, RefObject } from 'react';
import { Video, BarChart3, Zap, Map, FileText, TrendingUp, Clock, AlertTriangle, CheckCircle, ChevronDown, ClipboardList } from 'lucide-react';
import { InlineMonitoring } from './InlineMonitoring';
import { ProductionMetricsToday } from './ProductionMetricsToday';
import { PredictiveAlerts } from './PredictiveAlerts';
import { Alert } from './AlertsDrawer';
import { ProductionMetrics } from './ProductionMetrics';

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

interface HereAndNowProps {
  assetName: string;
  assetLocation: any;
  alerts: Alert[];
  onRadioOperator: (id: string) => void;
  onVerifyPlan: () => void;
  onShowMap: () => void;
  onShowVideo: () => void;
  onAlert: () => void;
  monitorRef?: RefObject<HTMLDivElement | null>;
}

const sections = [
  { id: 'monitoring', label: 'Video Monitoring', icon: Video     },
  { id: 'predictive', label: 'Risk Mitigation',   icon: Zap       },
  { id: 'production', label: 'Production',       icon: BarChart3 },
];

export function HereAndNow({
  assetName, assetLocation, alerts, onRadioOperator, onVerifyPlan, onShowMap, onShowVideo, onAlert, monitorRef
}: HereAndNowProps) {
  const [activeSection, setActiveSection] = useState('monitoring');

  const monitoringRef = useRef<HTMLDivElement>(null);
  const productionRef = useRef<HTMLDivElement>(null);
  const riskRef       = useRef<HTMLDivElement>(null);

  const [isRiskCollapsed, setIsRiskCollapsed] = useState(false);

  const [isProductionCollapsed, setIsProductionCollapsed] = useState(false);
  const [volumeData] = useState<VolumeData>(mockVolumeData);

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    monitoring: monitoringRef,
    predictive: riskRef,
    production: productionRef,
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


  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-foreground mb-2">How are we doing today?</h2>
        <p className="text-muted-foreground">Risk mitigation and real-time safety monitoring</p>
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
      <div className="space-y-6">

        {/* 1. Video Monitoring */}
        <div ref={monitorRef || monitoringRef} className="scroll-mt-16">
          <InlineMonitoring
            location={assetLocation}
            assetName={assetName}
            alerts={alerts}
            onRadioOperator={onRadioOperator}
            onVerifyPlan={onVerifyPlan}
            onShowMap={onShowMap}
            onShowVideo={onShowVideo}
            onAlert={onAlert}
          />
        </div>

        {/* 2. Risk Mitigation — Predictive Alerts */}
        <div ref={riskRef} className="scroll-mt-16 bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
          <button 
            onClick={() => setIsRiskCollapsed(!isRiskCollapsed)}
            className="w-full text-left p-6 hover:bg-muted/30 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-foreground" />
              <h3 className="text-foreground">Risk Mitigation</h3>
            </div>
            <div className={`p-2 rounded-lg bg-muted border border-border group-hover:bg-background transition-all ${isRiskCollapsed ? '' : 'rotate-180'}`}>
              <ChevronDown className="w-5 h-5 text-foreground" />
            </div>
          </button>

          {!isRiskCollapsed && (
            <div className="p-6 pt-0">
              <PredictiveAlerts />
            </div>
          )}
        </div>

        {/* 3. Shift Production Detail (Duplicated from Shift Review) */}
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
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
