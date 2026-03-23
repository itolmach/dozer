import { useState } from 'react';
import { TrendingUp, Filter, Tag, BarChart3, AlertTriangle, Clock, DollarSign, Activity, MapPin, Navigation } from 'lucide-react';

type BenchmarkMode = 'bid-estimate' | 're-baseline';
type DataFilter = 'raw-average' | 'normalized';
type MaterialType = 'clay' | 'sand' | 'gravel' | 'mixed' | 'unknown';

interface VelocityMetrics {
  current: number;
  bidEstimate: number;
  reBaseline: number;
  unit: string;
}

interface ProductionCycle {
  id: string;
  name: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // minutes
  volumeMoved: number; // cubic yards
  totalCost: number; // dollars
  unitCost: number; // dollars per cubic yard
  bidPrice: number; // target unit cost
  rawVelocity: number; // yd³/hr
  normalizedVelocity: number; // yd³/hr (filtered)
  status: 'active' | 'completed' | 'predicted';
  variance: number; // percentage over/under bid
  aiContext: string; // AI-generated context
  workZone: string; // zone identifier
}

const mockVelocityData: VelocityMetrics = {
  current: 142,
  bidEstimate: 180,
  reBaseline: 155,
  unit: 'yd³/hr',
};

export function ProductionVelocity() {
  const [benchmarkMode, setBenchmarkMode] = useState<BenchmarkMode>('bid-estimate');

  const targetValue = benchmarkMode === 'bid-estimate' ? mockVelocityData.bidEstimate : mockVelocityData.reBaseline;
  const velocityPercent = (mockVelocityData.current / targetValue) * 100;

  const getVelocityStatus = () => {
    if (velocityPercent >= 100) return { label: 'On Target', color: 'var(--color-success)' };
    if (velocityPercent >= 85) return { label: 'Acceptable', color: 'var(--color-warning)' };
    return { label: 'At Risk', color: 'var(--destructive)' };
  };

  const status = getVelocityStatus();

  const materialTypes: { value: MaterialType; label: string; icon: string }[] = [
    { value: 'clay', label: 'Clay', icon: '🟫' },
    { value: 'sand', label: 'Sand', icon: '🟨' },
    { value: 'gravel', label: 'Gravel', icon: '⚪' },
    { value: 'mixed', label: 'Mixed', icon: '🔶' },
  ];

  const mockCycles: ProductionCycle[] = [
    {
      id: 'cycle-1',
      name: 'Excavate & Load - Dump Truck #3 (Clay Removal)',
      startTime: new Date(Date.now() - 1000 * 60 * 8),
      endTime: new Date(Date.now() - 1000 * 60 * 3),
      duration: 5.2,
      volumeMoved: 12.5,
      totalCost: 187.50,
      unitCost: 15.00,
      bidPrice: 12.50,
      rawVelocity: 144.2,
      normalizedVelocity: 156.8,
      status: 'completed',
      variance: 20.0,
      aiContext: 'Camera detected: Dump Truck #3, clay material, normal loading pattern',
      workZone: 'Zone A',
    },
    {
      id: 'cycle-2',
      name: 'Load & Transfer - Haul Truck #7 (Mixed Aggregate)',
      startTime: new Date(Date.now() - 1000 * 60 * 3),
      endTime: new Date(),
      duration: 3.0,
      volumeMoved: 8.3,
      totalCost: 95.80,
      unitCost: 11.54,
      bidPrice: 12.50,
      rawVelocity: 166.0,
      normalizedVelocity: 172.4,
      status: 'completed',
      variance: -7.7,
      aiContext: 'Camera detected: Haul Truck #7, mixed aggregate, operator optimizing bucket fill',
      workZone: 'Zone B',
    },
    {
      id: 'cycle-3',
      name: 'Predicted: Grading Pass - Foundation Prep',
      startTime: new Date(),
      duration: 4.5,
      volumeMoved: 10.2,
      totalCost: 140.75,
      unitCost: 13.80,
      bidPrice: 12.50,
      rawVelocity: 136.0,
      normalizedVelocity: 148.2,
      status: 'completed',
      variance: 10.4,
      aiContext: 'AI prediction based on current trajectory and upcoming grade work',
      workZone: 'Zone C',
    },
  ];

  const activeCyclesWithVariance = mockCycles.filter(c => c.variance > 0).length;
  const hasProductionVariance = activeCyclesWithVariance > 0;

  return (
    <div className="bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
      {/* Header */}
      <div className="px-6 py-4 bg-muted border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-foreground" />
            <h3 className="text-foreground">Cycle Performance Analysis</h3>
            <div 
              className="px-3 py-1 rounded-full"
              style={{ backgroundColor: `${status.color}15` }}
            >
              <span 
                className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" 
                style={{ fontSize: 'var(--text-sm)', color: status.color }}
              >
                {status.label}
              </span>
            </div>
          </div>

          {/* Benchmark Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-[family-name:var(--font-family)] mr-2" style={{ fontSize: 'var(--text-sm)' }}>
              Target:
            </span>
            <div className="bg-background rounded-full border-2 border-border p-1 flex items-center">
              <button
                onClick={() => setBenchmarkMode('bid-estimate')}
                className={`px-4 py-2 rounded-full transition-all font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] ${
                  benchmarkMode === 'bid-estimate'
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-accent'
                }`}
                style={{ fontSize: 'var(--text-sm)', minWidth: '120px' }}
              >
                Bid Estimate
              </button>
              <button
                onClick={() => setBenchmarkMode('re-baseline')}
                className={`px-4 py-2 rounded-full transition-all font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] ${
                  benchmarkMode === 're-baseline'
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-accent'
                }`}
                style={{ fontSize: 'var(--text-sm)', minWidth: '120px' }}
              >
                Re-Baseline
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Production Variance Alert */}
        {hasProductionVariance && (
          <div className="mb-6 p-4 bg-destructive/10 border-2 border-destructive rounded-[var(--radius-card)] flex items-start gap-4">
            <div className="p-2 bg-destructive rounded-full">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-destructive" style={{ fontSize: 'var(--text-base)' }}>
                Production Latency Detected
              </h4>
              <p className="text-destructive font-[family-name:var(--font-family)] mt-1" style={{ fontSize: 'var(--text-sm)' }}>
                AI Analysis: {activeCyclesWithVariance} cycles currently exceeding bid price due to material density variations.
              </p>
            </div>
          </div>
        )}

        {/* Cycle List */}
        <div className="space-y-6">
          {mockCycles.map((cycle) => {
            const isOverBudget = cycle.variance > 0;
            return (
              <div
                key={cycle.id}
                className="bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]"
              >
                {/* Cycle Header */}
                <div className="px-6 py-4 bg-muted/30 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-foreground" />
                    <span className="font-bold text-foreground uppercase tracking-widest" style={{ fontSize: 'var(--text-xs)' }}>
                      COMPLETED
                    </span>
                  </div>
                  <div className="bg-foreground text-background px-3 py-1 rounded-full">
                    <span className="font-bold" style={{ fontSize: 'var(--text-xs)' }}>
                      {isOverBudget ? '+' : ''}{cycle.variance.toFixed(1)}% vs Bid
                    </span>
                  </div>
                </div>

                {/* Cycle Content */}
                <div className="p-8">
                  {/* Title & AI Context */}
                  <div className="mb-6">
                    <h4 className="text-foreground font-bold mb-2" style={{ fontSize: 'var(--text-xl)' }}>
                      {cycle.name}
                    </h4>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-foreground rounded-full"></div>
                      <p className="italic font-medium" style={{ fontSize: 'var(--text-sm)' }}>
                        {cycle.aiContext}
                      </p>
                    </div>
                  </div>

                  {/* Asset Movement Map (Mock) */}
                  <div className="mb-8 bg-card rounded-xl border-2 border-border overflow-hidden relative group">
                    {/* Map Header */}
                    <div className="px-4 py-2 bg-muted/50 border-b border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-foreground" style={{ fontSize: 'var(--text-sm)' }}>Asset Movement — {cycle.workZone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Navigation className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-medium text-muted-foreground" style={{ fontSize: 'var(--text-xs)' }}>6 waypoints</span>
                      </div>
                    </div>
                    {/* Map Grid */}
                    <div className="h-[200px] relative bg-slate-50 overflow-hidden">
                      <div className="absolute inset-0 opacity-[0.03]" style={{ 
                        backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                        backgroundSize: '20px 20px'
                      }}></div>
                      {/* Movement Path SVG */}
                      <svg className="absolute inset-0 w-full h-full p-8" viewBox="0 0 400 100">
                        <path 
                          d="M 50,50 Q 200,100 350,50" 
                          fill="none" 
                          stroke="black" 
                          strokeWidth="3" 
                          strokeLinecap="round"
                        />
                        {/* Waypoints */}
                        <circle cx="50" cy="50" r="3" fill="black" />
                        <circle cx="125" cy="72" r="2.5" fill="black" />
                        <circle cx="200" cy="80" r="2.5" fill="black" />
                        <circle cx="275" cy="72" r="2.5" fill="black" />
                        <circle cx="350" cy="50" r="3" fill="black" />
                        
                        {/* Labels */}
                        <text x="50" y="40" textAnchor="middle" fontSize="10" fontWeight="bold">START</text>
                        <text x="350" y="40" textAnchor="middle" fontSize="10" fontWeight="bold">END</text>
                      </svg>
                      {/* GPS Coordinates Overlays */}
                      <div className="absolute bottom-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm border border-border rounded text-[10px] font-medium text-muted-foreground shadow-sm">
                        Start: 34.0522°, -118.2437°
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm border border-border rounded text-[10px] font-medium text-muted-foreground shadow-sm">
                        End: 34.0527°, -118.2442°
                      </div>
                    </div>
                  </div>

                  {/* Top Metrics Row */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="p-4 bg-muted/20 border-2 border-border/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground font-bold" style={{ fontSize: 'var(--text-xs)' }}>Duration</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-foreground font-bold" style={{ fontSize: 'var(--text-2xl)' }}>{cycle.duration.toFixed(1)}</span>
                        <span className="text-muted-foreground font-medium" style={{ fontSize: 'var(--text-sm)' }}>min</span>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/20 border-2 border-border/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground font-bold" style={{ fontSize: 'var(--text-xs)' }}>Volume</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-foreground font-bold" style={{ fontSize: 'var(--text-2xl)' }}>{cycle.volumeMoved.toFixed(1)}</span>
                        <span className="text-muted-foreground font-medium" style={{ fontSize: 'var(--text-sm)' }}>yd³</span>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/20 border-2 border-border/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground font-bold" style={{ fontSize: 'var(--text-xs)' }}>Total Cost</span>
                      </div>
                      <div className="text-foreground font-bold" style={{ fontSize: 'var(--text-2xl)' }}>
                        ${cycle.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>

                  {/* Unit Cost Comparison (Center Highlight) */}
                  <div className="mb-4 bg-card border-2 border-foreground rounded-xl overflow-hidden">
                    <div className="p-6 flex items-center justify-between">
                      <div className="flex-1">
                        <span className="text-muted-foreground font-bold block mb-1" style={{ fontSize: 'var(--text-xs)' }}>Unit Cost</span>
                        <div className="text-foreground font-bold" style={{ fontSize: 'var(--text-3xl)' }}>
                          ${cycle.unitCost.toFixed(2)}/yd³
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground font-bold block mb-1" style={{ fontSize: 'var(--text-xs)' }}>Bid Price</span>
                        <div className="text-foreground font-bold" style={{ fontSize: 'var(--text-2xl)' }}>
                          ${cycle.bidPrice.toFixed(2)}/yd³
                        </div>
                      </div>
                    </div>
                    {isOverBudget && (
                      <div className="px-6 py-3 bg-muted border-t border-border flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-muted-foreground" />
                        <p className="text-muted-foreground font-medium" style={{ fontSize: 'var(--text-sm)' }}>
                          Exceeding bid price - contributing to production variance
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bottom Velocity Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/20 border-2 border-border/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground font-bold" style={{ fontSize: 'var(--text-xs)' }}>Raw Velocity</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-foreground font-bold" style={{ fontSize: 'var(--text-xl)' }}>{cycle.rawVelocity.toFixed(1)}</span>
                        <span className="text-muted-foreground font-medium" style={{ fontSize: 'var(--text-sm)' }}>yd³/hr</span>
                      </div>
                    </div>
                    <div className="p-4 bg-muted/20 border-2 border-border/60 rounded-xl">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground font-bold" style={{ fontSize: 'var(--text-xs)' }}>Normalized Velocity</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-foreground font-bold" style={{ fontSize: 'var(--text-xl)' }}>{cycle.normalizedVelocity.toFixed(1)}</span>
                        <span className="text-muted-foreground font-medium" style={{ fontSize: 'var(--text-sm)' }}>yd³/hr</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Time Range */}
                  <div className="mt-6 text-[10px] text-muted-foreground font-medium">
                    {new Date(cycle.startTime).toLocaleTimeString()} - {cycle.endTime ? new Date(cycle.endTime).toLocaleTimeString() : 'Current'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Material Legend */}
        <div className="mt-6 flex flex-wrap gap-2">
          {materialTypes.map(m => (
            <div key={m.value} className="px-3 py-1 bg-muted rounded-full border border-border flex items-center gap-2">
              <span>{m.icon}</span>
              <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-xs)' }}>
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 py-3 bg-muted border-t border-border">
        <p className="text-muted-foreground font-[family-name:var(--font-family)] text-center" style={{ fontSize: 'var(--text-xs)' }}>
          Production velocity calculated from real-time telemetry and material load sensors
        </p>
      </div>
    </div>
  );
}