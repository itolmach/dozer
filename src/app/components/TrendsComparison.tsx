import React, { useState, useRef, useEffect } from 'react';
import { InlineCADDesignView } from './InlineCADDesignView';
import { GeospatialDeviationMonitor } from './GeospatialDeviationMonitor';
import { PredictivePlanningAlerts } from './PredictivePlanningAlerts';
import { ReportExport } from './ReportExport';
import { BarChart3, DraftingCompass, Layers, Calendar, CalendarDays, CalendarRange, Zap, FileText } from 'lucide-react';

interface TrendsComparisonProps {
  assetName: string;
  assetModel?: string;
}

type TimeRange = 'daily' | 'weekly' | 'monthly';

const sections = [
  { id: 'gnss',       label: 'Engineering Grade',      icon: DraftingCompass },
  { id: 'geo',        label: 'Geospatial Terrain',     icon: Layers          },
  { id: 'predictive', label: 'Predictive Risk',        icon: Zap             },
  { id: 'reports',    label: 'Report Export',          icon: FileText        },
];

export function TrendsComparison({ assetName, assetModel = '' }: TrendsComparisonProps) {
  const [activeRange, setActiveRange] = useState<TimeRange>('daily');
  const [activeSection, setActiveSection] = useState('gnss');

  const gnssRef      = useRef<HTMLDivElement>(null);
  const geoRef       = useRef<HTMLDivElement>(null);
  const predictiveRef = useRef<HTMLDivElement>(null);
  const reportsRef   = useRef<HTMLDivElement>(null);

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    gnss: gnssRef,
    geo: geoRef,
    predictive: predictiveRef,
    reports: reportsRef,
  };

  // Track which section is on screen
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    Object.entries(sectionRefs).forEach(([id, ref]) => {
      if (!ref.current) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.3 }
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
      {/* Main Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-foreground mb-2">Trends &amp; Comparison</h2>
          <p className="text-muted-foreground">Engineering grade verification and geospatial terrain analysis</p>
        </div>

        <div className="flex items-center gap-6">
          {/* Time Range Selector */}
          <div className="flex gap-2 bg-muted/30 rounded-2xl p-1.5 border border-border/40 shadow-inner">
            <button
              onClick={() => setActiveRange('daily')}
              className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300
                ${activeRange === 'daily' ? 'bg-card text-foreground shadow-sm scale-[1.05] border border-border/60' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
              title="Daily Analysis"
            >
              <Calendar className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button
              onClick={() => setActiveRange('weekly')}
              className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300
                ${activeRange === 'weekly' ? 'bg-card text-foreground shadow-sm scale-[1.05] border border-border/60' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
              title="Weekly Summary"
            >
              <CalendarDays className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button
              onClick={() => setActiveRange('monthly')}
              className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300
                ${activeRange === 'monthly' ? 'bg-card text-foreground shadow-sm scale-[1.05] border border-border/60' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}
              title="Monthly Trends"
            >
              <CalendarRange className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          <div className="w-px h-10 bg-border/60" />

          <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-xl border border-border/40 h-12">
            <BarChart3 className="w-5 h-5 text-foreground/70" />
            <span className="text-foreground/90 font-medium">Technical Analysis Mode</span>
          </div>
        </div>
      </div>

      {/* Sticky Section Sub-Navigation */}
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
      <div className="grid grid-cols-1 gap-12">

        {/* 1. GNSS vs CAD */}
        <div ref={gnssRef} className="space-y-4 scroll-mt-16">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DraftingCompass className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Engineering Grade Verification</h3>
              <p className="text-sm text-muted-foreground font-[family-name:var(--font-family)]">Real-time GNSS telemetry vs. 3D CAD design models</p>
            </div>
          </div>
          <InlineCADDesignView assetName={assetName} />
        </div>

        {/* 2. Geospatial Terrain */}
        <div ref={geoRef} className="space-y-4 scroll-mt-16">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Geospatial Terrain Analysis</h3>
              <p className="text-sm text-muted-foreground font-[family-name:var(--font-family)]">Automated deviation detection and vertical progress mapping</p>
            </div>
          </div>
          <GeospatialDeviationMonitor />
        </div>

        {/* 3. Predictive Risk Modeling */}
        <div ref={predictiveRef} className="space-y-4 scroll-mt-16">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Predictive Risk Modeling</h3>
              <p className="text-sm text-muted-foreground font-[family-name:var(--font-family)]">AI-powered risk forecasting and operational anomaly detection</p>
            </div>
          </div>
          <PredictivePlanningAlerts />
        </div>

        {/* 4. Report Export Center */}
        <div ref={reportsRef} className="space-y-4 scroll-mt-16">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Report Export Center</h3>
              <p className="text-sm text-muted-foreground font-[family-name:var(--font-family)]">Generate progress payment and post-mortem reports for this asset</p>
            </div>
          </div>
          <ReportExport
            inline
            assetName={assetName}
            assetModel={assetModel}
            projectName="Interstate 405 Expansion - Section 7B"
            contractorName="Granite Construction Company"
            ownerName="California Department of Transportation (Caltrans)"
          />
        </div>

      </div>
    </div>
  );
}

