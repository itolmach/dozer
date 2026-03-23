import React, { useState, useRef, useEffect } from 'react';
import { InlineCADDesignView } from './InlineCADDesignView';
import { GeospatialDeviationMonitor } from './GeospatialDeviationMonitor';
import { PredictivePlanningAlerts } from './PredictivePlanningAlerts';
import { ReportExport } from './ReportExport';
import { DraftingCompass, Layers, Calendar, CalendarDays, CalendarRange, Zap, FileText, DollarSign, Fuel, Wrench, TrendingDown, Gauge, Database, Briefcase, ChevronRight, Quote, ChevronDown, Target, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

interface TrendsComparisonProps {
  assetName: string;
  assetModel?: string;
  rentalRate?: {
    activeRate?: number;
    activeRateSource?: string;
    hourlyRate: number;
    fuel: number;
    maintenance: number;
    depreciation: number;
  };
  utilization?: {
    rate: number; // percentage
    plannedMaintenance: number; // hours today
    unplannedDowntime: number; // hours today
    idleCost: number; // dollars lost today
  };
  onOpenDiagnostics?: () => void;
}

type TimeRange = 'daily' | 'weekly' | 'monthly';

const sections = [
  { id: 'velocity',   label: 'On-Track Velocity',      icon: Gauge           },
  { id: 'safety',     label: 'Safety Score',           icon: Target          },
  { id: 'safety-events', label: 'Safety Events',       icon: AlertTriangle   },
  { id: 'predictive', label: 'Risk Mitigation',          icon: Zap             },
  { id: 'reports',    label: 'Progress Reporting',      icon: FileText        },
];

export function TrendsComparison({ 
  assetName, 
  assetModel = '',
  rentalRate,
  utilization,
  onOpenDiagnostics
}: TrendsComparisonProps) {
  const [activeRange, setActiveRange] = useState<TimeRange>('daily');
  const [activeSection, setActiveSection] = useState('velocity');

  const velocityRef  = useRef<HTMLDivElement>(null);
  const safetyRef    = useRef<HTMLDivElement>(null);
  const safetyEventsRef = useRef<HTMLDivElement>(null);
  const predictiveRef = useRef<HTMLDivElement>(null);
  const reportsRef   = useRef<HTMLDivElement>(null);

  const [isVelocityCollapsed, setIsVelocityCollapsed] = useState(false);
  const [isSafetyCollapsed, setIsSafetyCollapsed] = useState(false);
  const [isSafetyEventsCollapsed, setIsSafetyEventsCollapsed] = useState(false);
  const [isPredictiveCollapsed, setIsPredictiveCollapsed] = useState(false);
  const [isReportsCollapsed, setIsReportsCollapsed] = useState(false);

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    velocity: velocityRef,
    safety: safetyRef,
    'safety-events': safetyEventsRef,
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

  const safetyScore = { current: 87, previous: 82, trend: 'up' as const };
  const productivityMetrics = { hoursOperated: 8.5, materialMoved: 245, fuelEfficiency: 92 };
  const trendData = [
    { label: 'Mon', value: 85 }, { label: 'Tue', value: 78 }, { label: 'Wed', value: 92 },
    { label: 'Thu', value: 88 }, { label: 'Fri', value: 87 }, { label: 'Sat', value: 90 }, { label: 'Sun', value: 87 },
  ];

  return (
    <div className="space-y-0">
      {/* Main Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          
          {/* Internal Rental Rate & Utilization Analytics Box */}
          {rentalRate && (
            <div className="px-5 py-4 rounded-xl bg-muted/30 border border-border/50 shadow-sm inline-block">
              <div className="flex items-center gap-6">
                {utilization && (
                  <>
                    <button 
                      onClick={onOpenDiagnostics}
                      className="flex flex-col hover:opacity-80 transition-opacity text-left"
                      title={utilization.rate < 70 ? 'Systemic friction detected - Click for CAN-bus diagnostics' : 'Click for CAN-bus diagnostics'}
                    >
                      <div className="flex items-center gap-2">
                        <Gauge className={`w-5 h-5 ${utilization.rate < 70 ? 'text-destructive' : utilization.rate < 85 ? 'text-color-warning' : 'text-color-success'}`} />
                        <div className={`font-bold ${
                          utilization.rate < 70 ? 'text-destructive' : utilization.rate < 85 ? 'text-color-warning' : 'text-color-success'
                        }`} style={{ fontSize: 'var(--text-lg)' }}>
                          {utilization.rate}%
                        </div>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight mt-0.5">
                        Utilization AVG
                      </div>
                    </button>
                    <div className="w-px h-10 bg-border/60"></div>
                  </>
                )}
                {rentalRate.activeRate !== undefined && (
                  <>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5 text-primary" />
                        <div className="font-bold text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                          ${rentalRate.activeRate.toFixed(2)}/hr
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Active Rate</span>
                        <span className="px-1.5 py-0.5 bg-primary/20 text-primary rounded-sm text-[9px] font-black uppercase leading-none">{rentalRate.activeRateSource || 'ERP'}</span>
                      </div>
                    </div>
                    <div className="w-px h-10 bg-border/60"></div>
                  </>
                )}
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-foreground/70" />
                    <div className="font-bold text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                      ${rentalRate.hourlyRate.toFixed(2)}/hr
                    </div>
                  </div>
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight mt-0.5">
                    Internal Rate
                  </div>
                </div>
                <div className="w-px h-10 bg-border/60"></div>
                <div className="flex flex-col gap-1 text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1" title="Fuel Cost">
                      <Fuel className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold text-foreground/80">${rentalRate.fuel.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1" title="Maintenance Cost">
                      <Wrench className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold text-foreground/80">${rentalRate.maintenance.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1" title="Depreciation Cost">
                      <TrendingDown className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold text-foreground/80">${rentalRate.depreciation.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="text-[9px] uppercase tracking-widest font-black opacity-30">Cost Components</div>
                </div>
              </div>
            </div>
          )}
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
      <div className="grid grid-cols-1 gap-8">

        {/* 0. Velocity Measurement Baseline */}
        <div ref={velocityRef} className="scroll-mt-16 bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
          <button 
            onClick={() => setIsVelocityCollapsed(!isVelocityCollapsed)}
            className="w-full text-left p-6 hover:bg-muted/30 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Gauge className="w-6 h-6 text-foreground" />
              <h3 className="text-foreground">On-Track Velocity</h3>
            </div>
            <div className={`p-2 rounded-lg bg-muted border border-border group-hover:bg-background transition-all ${isVelocityCollapsed ? '' : 'rotate-180'}`}>
              <ChevronDown className="w-5 h-5 text-foreground" />
            </div>
          </button>
          {!isVelocityCollapsed && (
            <div className="p-6 pt-0">
              <VelocityMeasurementBaseline inline />
              
              <div className="mt-8 pt-8 border-t-2 border-border/60">
                <div className="flex items-center gap-3 mb-6">
                  <DraftingCompass className="w-5 h-5 text-foreground" />
                  <h4 className="text-foreground font-semibold" style={{ fontSize: 'var(--text-lg)' }}>Deviation Mapping</h4>
                </div>
                <InlineCADDesignView assetName={assetName} />
              </div>

              <div className="mt-8 pt-8 border-t-2 border-border/60">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase className="w-5 h-5 text-foreground" />
                  <h4 className="text-foreground font-semibold" style={{ fontSize: 'var(--text-lg)' }}>Asset Assignments & Progress</h4>
                </div>
                <GeospatialDeviationMonitor />
              </div>
            </div>
          )}
        </div>

        {/* 1. Safety Score */}
        <div ref={safetyRef} className="scroll-mt-16 bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
          <button 
            onClick={() => setIsSafetyCollapsed(!isSafetyCollapsed)}
            className="w-full text-left p-6 hover:bg-muted/30 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-foreground" />
              <h3 className="text-foreground">Safety Performance Score</h3>
            </div>
            <div className={`p-2 rounded-lg bg-muted border border-border group-hover:bg-background transition-all ${isSafetyCollapsed ? '' : 'rotate-180'}`}>
              <ChevronDown className="w-5 h-5 text-foreground" />
            </div>
          </button>

          {!isSafetyCollapsed && (
            <div className="p-6 pt-0">
              <div className="flex items-center justify-between mb-6">
                <div></div> {/* Spacer */}
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
          )}
        </div>

        {/* 1.1 Safety Event Log */}
        <div ref={safetyEventsRef} className="scroll-mt-16 bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
          <button 
            onClick={() => setIsSafetyEventsCollapsed(!isSafetyEventsCollapsed)}
            className="w-full text-left p-6 hover:bg-muted/30 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-foreground" />
              <h3 className="text-foreground">Safety Event Log</h3>
            </div>
            <div className={`p-2 rounded-lg bg-muted border border-border group-hover:bg-background transition-all ${isSafetyEventsCollapsed ? '' : 'rotate-180'}`}>
              <ChevronDown className="w-5 h-5 text-foreground" />
            </div>
          </button>

          {!isSafetyEventsCollapsed && (
            <div className="p-6 pt-0">
              <div className="overflow-x-auto">
                <table className="w-full border-separate border-spacing-0">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Time</th>
                      <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Event Type</th>
                      <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Description</th>
                      <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Participants</th>
                      <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Severity</th>
                      <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border">Sign-off</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4 text-sm font-medium text-foreground border-b border-border/60">09:42 AM</td>
                      <td className="py-4 px-4 text-sm text-foreground border-b border-border/60">Red Zone Incursion</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground border-b border-border/60">Worker detected within 4.2m of machine counterweight. Auto-brake engaged.</td>
                      <td className="py-4 px-4 text-sm text-foreground border-b border-border/60">Michael Chen</td>
                      <td className="py-4 px-4 border-b border-border/60">
                        <span className="px-2 py-1 bg-color-error/10 text-color-error rounded text-[10px] font-bold uppercase">Critical</span>
                      </td>
                      <td className="py-4 px-4 border-b border-border/60">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-color-success" />
                          <span className="text-[11px] text-muted-foreground uppercase font-bold">Verified</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4 text-sm font-medium text-foreground border-b border-border/60">11:15 AM</td>
                      <td className="py-4 px-4 text-sm text-foreground border-b border-border/60">Speed Violation</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground border-b border-border/60">Maximum speed of 8.2 MPH reached in active pedestrian zone.</td>
                      <td className="py-4 px-4 text-sm text-foreground border-b border-border/60">John Doe (Operator)</td>
                      <td className="py-4 px-4 border-b border-border/60">
                        <span className="px-2 py-1 bg-color-warning/10 text-color-warning rounded text-[10px] font-bold uppercase">Warning</span>
                      </td>
                      <td className="py-4 px-4 border-b border-border/60">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-color-success" />
                          <span className="text-[11px] text-muted-foreground uppercase font-bold">Verified</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4 text-sm font-medium text-foreground border-b border-border/60">01:30 PM</td>
                      <td className="py-4 px-4 text-sm text-foreground border-b border-border/60">Slope Stability Alert</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground border-b border-border/60">Lateral tilt sensors detected 3.2° deviation from safe operating plane.</td>
                      <td className="py-4 px-4 text-sm text-foreground border-b border-border/60">JD-650-001</td>
                      <td className="py-4 px-4 border-b border-border/60">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-[10px] font-bold uppercase">Info</span>
                      </td>
                      <td className="py-4 px-4 border-b border-border/60">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full border border-border" />
                          <span className="text-[11px] text-muted-foreground uppercase font-bold">Pending</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 2. Predictive Risk Modeling */}
        <div ref={predictiveRef} className="scroll-mt-16 bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
          <button 
            onClick={() => setIsPredictiveCollapsed(!isPredictiveCollapsed)}
            className="w-full text-left p-6 hover:bg-muted/30 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-foreground" />
              <h3 className="text-foreground">Risk Mitigation</h3>
            </div>
            <div className={`p-2 rounded-lg bg-muted border border-border group-hover:bg-background transition-all ${isPredictiveCollapsed ? '' : 'rotate-180'}`}>
              <ChevronDown className="w-5 h-5 text-foreground" />
            </div>
          </button>
          {!isPredictiveCollapsed && (
            <div className="p-6 pt-0">
              <PredictivePlanningAlerts />
            </div>
          )}
        </div>

        {/* 4. Report Export Center */}
        <div ref={reportsRef} className="scroll-mt-16 bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
          <button 
            onClick={() => setIsReportsCollapsed(!isReportsCollapsed)}
            className="w-full text-left p-6 hover:bg-muted/30 transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-foreground" />
              <h3 className="text-foreground">Progress Reporting</h3>
            </div>
            <div className={`p-2 rounded-lg bg-muted border border-border group-hover:bg-background transition-all ${isReportsCollapsed ? '' : 'rotate-180'}`}>
              <ChevronDown className="w-5 h-5 text-foreground" />
            </div>
          </button>
          {!isReportsCollapsed && (
            <div className="p-6 pt-0">
              <ReportExport
                inline
                assetName={assetName}
                assetModel={assetModel}
                projectName="Interstate 405 Expansion - Section 7B"
                contractorName="Granite Construction Company"
                ownerName="California Department of Transportation (Caltrans)"
              />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function VelocityMeasurementBaseline({ inline }: { inline?: boolean }) {
  const [view, setView] = useState<'bid' | 'rebaseline'>('bid');

  return (
    <div className={`${inline ? '' : 'bg-muted/20 border border-border/50 rounded-2xl overflow-hidden shadow-sm'}`}>
      {!inline && (
        <div className="px-8 py-4 bg-muted/40 border-b border-border/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gauge className="w-5 h-5 text-foreground" />
            <h3 className="text-foreground font-bold" style={{ fontSize: 'var(--text-lg)' }}>On-Track Velocity</h3>
          </div>
          <div className="bg-foreground text-background px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider">
            Original Bid
          </div>
        </div>
      )}

      {/* Content Outer Grid */}
      <div className={`${inline ? 'p-4' : 'p-10'} grid grid-cols-1 lg:grid-cols-2 gap-12`}>
        {/* Left Column: Original Bid Estimate */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1.5 h-8 bg-foreground rounded-full"></div>
            <h4 className="text-foreground font-bold" style={{ fontSize: 'var(--text-xl)' }}>Original Bid Estimate</h4>
          </div>
          
          <p className="text-muted-foreground mb-8 text-[var(--text-base)]">
            Measuring velocity against the <span className="text-foreground font-bold">original bid estimate</span> created during the proposal phase.
          </p>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-background border border-border/60 rounded-xl shadow-sm">
              <span className="text-muted-foreground font-medium">Bid Target</span>
              <span className="text-foreground font-bold" style={{ fontSize: 'var(--text-lg)' }}>180 yd³/hr</span>
            </div>
            <div className="flex items-center justify-between p-5 bg-background border border-border/60 rounded-xl shadow-sm">
              <span className="text-muted-foreground font-medium">Current Performance</span>
              <span className="text-foreground font-bold" style={{ fontSize: 'var(--text-lg)' }}>79% of Bid</span>
            </div>
          </div>
        </div>

        {/* Right Column: Re-Baseline Card */}
        <div className="bg-card border-2 border-border/40 rounded-2xl p-8 flex flex-col shadow-lg relative overflow-hidden">
          {/* Subtle Background Icon Decoration */}
          <TrendingDown className="absolute -bottom-4 -right-4 w-32 h-32 text-foreground/[0.03] -rotate-12" />
          
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-6 h-6 text-foreground" />
            <h4 className="text-foreground font-bold" style={{ fontSize: 'var(--text-lg)' }}>Re-Baseline Available</h4>
          </div>

          <p className="text-muted-foreground text-sm mb-6">
            A re-baseline was created on 2/15/2026 adjusting targets by <span className="text-destructive font-bold">-13.9%</span>.
          </p>

          <div className="bg-muted/30 border border-border/40 rounded-xl p-5 mb-8 relative">
            <Quote className="w-5 h-5 text-muted-foreground/20 absolute top-2 left-2" />
            <p className="italic text-foreground/80 text-center font-medium" style={{ fontSize: 'var(--text-sm)' }}>
              "Adjusted for unexpected bedrock conditions discovered in Zone B"
            </p>
          </div>

          <button className="mt-auto w-full py-5 bg-foreground text-background rounded-xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-md active:scale-[0.99] group">
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            <span style={{ fontSize: 'var(--text-base)' }}>Switch to Re-Baseline View</span>
          </button>
        </div>
      </div>
    </div>
  );
}
