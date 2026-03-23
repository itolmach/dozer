import { useState } from 'react';
import { Gauge, TrendingUp, Filter, Tag, ChevronRight, BarChart3, AlertTriangle, Clock, TrendingDown, DollarSign, Activity, MapPin, Navigation } from 'lucide-react';

type BenchmarkMode = 'bid-estimate' | 're-baseline';
type DataFilter = 'raw-average' | 'normalized';
type MaterialType = 'clay' | 'sand' | 'gravel' | 'mixed' | 'unknown';
type ViewMode = 'total' | 'cycles';

interface GeoPoint {
  lat: number;
  lng: number;
  timestamp: Date;
}

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
  geoPath: GeoPoint[]; // asset movement path
  workZone: string; // zone identifier
}

const mockVelocityData: VelocityMetrics = {
  current: 142,
  bidEstimate: 180,
  reBaseline: 155,
  unit: 'yd³/hr',
};

// Re-baseline metadata
const reBaselineMetadata = {
  createdDate: new Date('2026-02-15'),
  createdBy: 'Project Manager - Sarah Johnson',
  reason: 'Adjusted for unexpected bedrock conditions discovered in Zone B',
  adjustmentPercent: -13.9, // -13.9% from original bid
  approvedBy: 'Senior Estimator - James Wilson'
};

export function ProductionVelocity() {
  const [benchmarkMode, setBenchmarkMode] = useState<BenchmarkMode>('bid-estimate');
  const [dataFilter, setDataFilter] = useState<DataFilter>('raw-average');
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>('unknown');
  const [viewMode, setViewMode] = useState<ViewMode>('total');

  const targetValue = benchmarkMode === 'bid-estimate' ? mockVelocityData.bidEstimate : mockVelocityData.reBaseline;
  const velocityPercent = (mockVelocityData.current / targetValue) * 100;
  const isAtRisk = velocityPercent < 85; // Below 85% of target is "At Risk"

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

  // Mock cycle data - AI-generated cycle names based on camera view and context
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
      variance: 20.0, // 20% over bid
      aiContext: 'Camera detected: Dump Truck #3, clay material, normal loading pattern',
      geoPath: [
        { lat: 34.0522, lng: -118.2437, timestamp: new Date(Date.now() - 1000 * 60 * 8) },
        { lat: 34.0523, lng: -118.2438, timestamp: new Date(Date.now() - 1000 * 60 * 7) },
        { lat: 34.0524, lng: -118.2439, timestamp: new Date(Date.now() - 1000 * 60 * 6) },
        { lat: 34.0525, lng: -118.2440, timestamp: new Date(Date.now() - 1000 * 60 * 5) },
        { lat: 34.0526, lng: -118.2441, timestamp: new Date(Date.now() - 1000 * 60 * 4) },
        { lat: 34.0527, lng: -118.2442, timestamp: new Date(Date.now() - 1000 * 60 * 3) },
      ],
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
      status: 'active',
      variance: -7.7, // 7.7% under bid (good)
      aiContext: 'Camera detected: Haul Truck #7, mixed aggregate, operator optimizing bucket fill',
      geoPath: [
        { lat: 34.0522, lng: -118.2437, timestamp: new Date(Date.now() - 1000 * 60 * 3) },
        { lat: 34.0523, lng: -118.2438, timestamp: new Date(Date.now() - 1000 * 60 * 2) },
        { lat: 34.0524, lng: -118.2439, timestamp: new Date(Date.now() - 1000 * 60 * 1) },
        { lat: 34.0525, lng: -118.2440, timestamp: new Date() },
      ],
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
      status: 'predicted',
      variance: 10.4, // 10.4% over bid
      aiContext: 'AI prediction based on current trajectory and upcoming grade work',
      geoPath: [
        { lat: 34.0522, lng: -118.2437, timestamp: new Date() },
        { lat: 34.0523, lng: -118.2438, timestamp: new Date(Date.now() + 1000 * 60 * 1) },
        { lat: 34.0524, lng: -118.2439, timestamp: new Date(Date.now() + 1000 * 60 * 2) },
        { lat: 34.0525, lng: -118.2440, timestamp: new Date(Date.now() + 1000 * 60 * 3) },
        { lat: 34.0526, lng: -118.2441, timestamp: new Date(Date.now() + 1000 * 60 * 4) },
        { lat: 34.0527, lng: -118.2442, timestamp: new Date(Date.now() + 1000 * 60 * 5) },
      ],
      workZone: 'Zone C',
    },
  ];

  const activeCyclesWithVariance = mockCycles.filter(c => c.status !== 'predicted' && c.variance > 0).length;
  const hasProductionVariance = activeCyclesWithVariance > 0;

  return (
    <div className="bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
      {/* Header */}
      <div className="px-6 py-4 bg-muted border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Gauge className="w-5 h-5 text-foreground" />
            <h3 className="text-foreground">Production Velocity</h3>
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
        {/* View Mode Toggle */}
        <div className="mb-6 flex items-center justify-center">
          <div className="bg-background rounded-full border-4 border-primary/20 p-1 flex items-center shadow-[var(--elevation-md)]">
            <button
              onClick={() => setViewMode('total')}
              className={`min-w-[180px] min-h-[60px] px-6 py-3 rounded-full transition-all font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] flex items-center justify-center gap-2 ${
                viewMode === 'total'
                  ? 'bg-primary text-white shadow-[var(--elevation-sm)]'
                  : 'text-foreground hover:bg-accent'
              }`}
              style={{ fontSize: 'var(--text-base)' }}
            >
              <Gauge className="w-5 h-5" />
              Total Velocity
            </button>
            <button
              onClick={() => setViewMode('cycles')}
              className={`min-w-[180px] min-h-[60px] px-6 py-3 rounded-full transition-all font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] flex items-center justify-center gap-2 ${
                viewMode === 'cycles'
                  ? 'bg-primary text-white shadow-[var(--elevation-sm)]'
                  : 'text-foreground hover:bg-accent'
              }`}
              style={{ fontSize: 'var(--text-base)' }}
            >
              <BarChart3 className="w-5 h-5" />
              Cycle Analysis
              {hasProductionVariance && (
                <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              )}
            </button>
          </div>
        </div>

        {/* Production Variance Alert */}
        {viewMode === 'cycles' && hasProductionVariance && (
          <div className="mb-6 bg-destructive/10 rounded-[var(--radius-card)] border-4 border-destructive p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
              <div className="flex-1">
                <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive mb-2" style={{ fontSize: 'var(--text-lg)' }}>
                  Production Variance Alert
                </div>
                <p className="text-destructive font-[family-name:var(--font-family)] mb-3" style={{ fontSize: 'var(--text-base)' }}>
                  {activeCyclesWithVariance} cycle{activeCyclesWithVariance !== 1 ? 's' : ''} exceeding bid price unit cost. Current production rate will result in budget overrun if sustained.
                </p>
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 bg-destructive rounded-[var(--radius-button)]">
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-white" style={{ fontSize: 'var(--text-sm)' }}>
                      Project Manager Notification Required
                    </span>
                  </div>
                  <button className="min-h-[44px] px-4 py-2 bg-card hover:bg-accent border-2 border-destructive rounded-[var(--radius-button)] transition-colors">
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                      Review Cycles →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Baseline Comparison Information Banner */}
        <div className="mb-6 bg-primary/5 rounded-[var(--radius-card)] border-2 border-primary/20 overflow-hidden">
          <div className="px-6 py-4 bg-primary/10 border-b border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gauge className="w-5 h-5 text-primary" />
                <h4 className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-lg)' }}>
                  Velocity Measurement Baseline
                </h4>
              </div>
              <div className="px-3 py-1 bg-primary rounded-full">
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-white" style={{ fontSize: 'var(--text-sm)' }}>
                  {benchmarkMode === 'bid-estimate' ? 'Original Bid' : 'Re-Baseline Active'}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {benchmarkMode === 'bid-estimate' ? (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-8 bg-primary rounded-full"></div>
                    <h5 className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                      Original Bid Estimate
                    </h5>
                  </div>
                  <p className="text-foreground font-[family-name:var(--font-family)] mb-4" style={{ fontSize: 'var(--text-base)' }}>
                    Measuring velocity against the <span className="font-[var(--font-weight-semibold)]">original bid estimate</span> created during the proposal phase.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-background rounded-[var(--radius-button)] border border-border">
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                        Bid Target
                      </span>
                      <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                        {mockVelocityData.bidEstimate} {mockVelocityData.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background rounded-[var(--radius-button)] border border-border">
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                        Current Performance
                      </span>
                      <span className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]`} style={{ fontSize: 'var(--text-base)', color: velocityPercent >= 100 ? 'var(--color-success)' : 'var(--destructive)' }}>
                        {Math.round(velocityPercent)}% of Bid
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-background rounded-[var(--radius-button)] border-2 border-border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingDown className="w-5 h-5 text-muted-foreground" />
                    <h5 className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                      Re-Baseline Available
                    </h5>
                  </div>
                  <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-3" style={{ fontSize: 'var(--text-sm)' }}>
                    A re-baseline was created on {reBaselineMetadata.createdDate.toLocaleDateString()} adjusting targets by {reBaselineMetadata.adjustmentPercent}%.
                  </p>
                  <div className="p-3 bg-accent/30 rounded-[var(--radius-button)] border border-primary/20 mb-3">
                    <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] italic" style={{ fontSize: 'var(--text-sm)' }}>
                      "{reBaselineMetadata.reason}"
                    </p>
                  </div>
                  <button
                    onClick={() => setBenchmarkMode('re-baseline')}
                    className="w-full min-h-[60px] px-4 py-3 bg-primary text-white rounded-[var(--radius-button)] hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]"
                    style={{ fontSize: 'var(--text-base)' }}
                  >
                    <ChevronRight className="w-5 h-5" />
                    Switch to Re-Baseline View
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-8 bg-primary rounded-full"></div>
                    <h5 className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                      Re-Baseline Active
                    </h5>
                  </div>
                  <p className="text-foreground font-[family-name:var(--font-family)] mb-4" style={{ fontSize: 'var(--text-base)' }}>
                    Measuring velocity against the <span className="font-[var(--font-weight-semibold)]">adjusted re-baseline</span> created after project start based on actual field conditions.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-background rounded-[var(--radius-button)] border border-border">
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                        Re-Baseline Target
                      </span>
                      <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                        {mockVelocityData.reBaseline} {mockVelocityData.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-background rounded-[var(--radius-button)] border border-border">
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                        Current Performance
                      </span>
                      <span className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]`} style={{ fontSize: 'var(--text-base)', color: velocityPercent >= 100 ? 'var(--color-success)' : 'var(--destructive)' }}>
                        {Math.round(velocityPercent)}% of Baseline
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-[var(--radius-button)] border border-primary/20">
                      <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                        Adjustment from Bid
                      </span>
                      <span className="text-primary font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                        {reBaselineMetadata.adjustmentPercent}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-background rounded-[var(--radius-button)] border-2 border-border p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-foreground" />
                    <h5 className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                      Re-Baseline Details
                    </h5>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div>
                      <span className="text-muted-foreground font-[family-name:var(--font-family)] block mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                        Created Date
                      </span>
                      <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                        {reBaselineMetadata.createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-[family-name:var(--font-family)] block mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                        Created By
                      </span>
                      <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                        {reBaselineMetadata.createdBy}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground font-[family-name:var(--font-family)] block mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                        Approved By
                      </span>
                      <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                        {reBaselineMetadata.approvedBy}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-border">
                      <span className="text-muted-foreground font-[family-name:var(--font-family)] block mb-2" style={{ fontSize: 'var(--text-xs)' }}>
                        Justification
                      </span>
                      <div className="p-3 bg-accent/30 rounded-[var(--radius-button)] border border-primary/20">
                        <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] italic" style={{ fontSize: 'var(--text-sm)' }}>
                          "{reBaselineMetadata.reason}"
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setBenchmarkMode('bid-estimate')}
                    className="w-full min-h-[60px] px-4 py-3 bg-secondary hover:bg-accent border-2 border-border rounded-[var(--radius-button)] transition-colors flex items-center justify-center gap-2 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground"
                    style={{ fontSize: 'var(--text-base)' }}
                  >
                    <ChevronRight className="w-5 h-5 rotate-180" />
                    View Original Bid Estimate
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conditional View Rendering */}
        {viewMode === 'total' ? (
          <>
            {/* Velocity Gauge */}
            <div className="mb-6 bg-background rounded-[var(--radius-card)] border-2 border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-foreground" />
                  <h4 className="text-foreground">Current Velocity</h4>
                </div>
                
                {/* Data Filter Toggle */}
                <div className="flex items-center gap-2 bg-card rounded-full border-2 border-border p-1">
                  <button
                    onClick={() => setDataFilter('raw-average')}
                    className={`px-3 py-2 rounded-full transition-all font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] flex items-center gap-2 ${
                      dataFilter === 'raw-average'
                        ? 'bg-foreground text-white'
                        : 'text-foreground hover:bg-accent'
                    }`}
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    <Filter className="w-4 h-4" />
                    Raw
                  </button>
                  <button
                    onClick={() => setDataFilter('normalized')}
                    className={`px-3 py-2 rounded-full transition-all font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] flex items-center gap-2 ${
                      dataFilter === 'normalized'
                        ? 'bg-foreground text-white'
                        : 'text-foreground hover:bg-accent'
                    }`}
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    <Filter className="w-4 h-4" />
                    Normalized
                  </button>
                </div>
              </div>

              {/* Circular Gauge Visual */}
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-64 h-64">
                  {/* Background Circle */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background Arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="var(--border)"
                      strokeWidth="8"
                    />
                    {/* Progress Arc */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke={status.color}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${Math.min(velocityPercent * 2.51, 251.2)} 251.2`}
                      style={{ transition: 'stroke-dasharray 0.5s ease' }}
                    />
                  </svg>
                  
                  {/* Center Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-4xl)' }}>
                      {mockVelocityData.current}
                    </div>
                    <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-base)' }}>
                      {mockVelocityData.unit}
                    </div>
                    <div 
                      className="mt-2 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]"
                      style={{ fontSize: 'var(--text-lg)', color: status.color }}
                    >
                      {Math.round(velocityPercent)}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Comparison Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-card rounded-[var(--radius-button)] border-2 border-border">
                  <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                    Target ({benchmarkMode === 'bid-estimate' ? 'Bid' : 'Baseline'})
                  </div>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
                    {targetValue} <span className="text-muted-foreground" style={{ fontSize: 'var(--text-base)' }}>{mockVelocityData.unit}</span>
                  </div>
                </div>
                
                <div className="p-4 bg-card rounded-[var(--radius-button)] border-2 border-border">
                  <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                    Variance
                  </div>
                  <div 
                    className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" 
                    style={{ fontSize: 'var(--text-2xl)', color: velocityPercent >= 100 ? 'var(--color-success)' : 'var(--destructive)' }}
                  >
                    {velocityPercent >= 100 ? '+' : ''}{mockVelocityData.current - targetValue} <span className="text-muted-foreground" style={{ fontSize: 'var(--text-base)' }}>{mockVelocityData.unit}</span>
                  </div>
                </div>
              </div>

              {/* Filter Info Banner */}
              {dataFilter === 'normalized' && (
                <div className="mt-4 p-3 bg-accent/30 rounded-[var(--radius-button)] border border-primary/20">
                  <div className="flex items-start gap-2">
                    <Filter className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                      Showing normalized rate with cycle-time noise filtered (traffic, delays, idle)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Cycle Analysis */}
            <div className="bg-background rounded-[var(--radius-card)] border-2 border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-foreground" />
                <h4 className="text-foreground">Cycle Analysis</h4>
              </div>

              <p className="text-muted-foreground mb-4 font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                Review individual cycles for detailed performance metrics
              </p>

              {/* Cycle List */}
              <div className="space-y-4">
                {mockCycles.map((cycle) => {
                  const isOverBudget = cycle.variance > 0;
                  const cycleVelocity = dataFilter === 'normalized' ? cycle.normalizedVelocity : cycle.rawVelocity;

                  return (
                    <div
                      key={cycle.id}
                      className={`bg-card rounded-[var(--radius-card)] border-2 overflow-hidden ${
                        cycle.status === 'active'
                          ? 'border-primary shadow-[var(--elevation-md)]'
                          : cycle.status === 'predicted'
                          ? 'border-border opacity-75'
                          : isOverBudget
                          ? 'border-destructive/50'
                          : 'border-color-success/50'
                      }`}
                    >
                      {/* Cycle Header */}
                      <div className={`px-4 py-3 flex items-center justify-between ${
                        cycle.status === 'active'
                          ? 'bg-primary/10'
                          : cycle.status === 'predicted'
                          ? 'bg-muted'
                          : isOverBudget
                          ? 'bg-destructive/5'
                          : 'bg-color-success/5'
                      }`}>
                        <div className="flex items-center gap-2">
                          {cycle.status === 'active' ? (
                            <Activity className="w-5 h-5 text-primary animate-pulse" />
                          ) : cycle.status === 'predicted' ? (
                            <TrendingUp className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <Clock className="w-5 h-5 text-foreground" />
                          )}
                          <span 
                            className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                              cycle.status === 'active' ? 'text-primary' : 'text-foreground'
                            }`}
                            style={{ fontSize: 'var(--text-base)' }}
                          >
                            {cycle.status === 'active' ? 'ACTIVE CYCLE' : cycle.status === 'predicted' ? 'PREDICTED' : 'COMPLETED'}
                          </span>
                          {cycle.status === 'active' && (
                            <div className="px-2 py-1 bg-primary rounded-full">
                              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-white" style={{ fontSize: 'var(--text-xs)' }}>
                                LIVE
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {/* Variance Badge */}
                        {cycle.status !== 'predicted' && (
                          <div className={`px-3 py-1 rounded-full ${
                            isOverBudget ? 'bg-destructive' : 'bg-color-success'
                          }`}>
                            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-white" style={{ fontSize: 'var(--text-sm)' }}>
                              {isOverBudget ? '+' : ''}{cycle.variance.toFixed(1)}% vs Bid
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Cycle Content */}
                      <div className="p-4">
                        {/* AI-Generated Cycle Name */}
                        <div className="mb-3">
                          <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontSize: 'var(--text-lg)' }}>
                            {cycle.name}
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span className="font-[family-name:var(--font-family)] italic" style={{ fontSize: 'var(--text-sm)' }}>
                              {cycle.aiContext}
                            </span>
                          </div>
                        </div>

                        {/* Geolocation Map Snippet */}
                        <div className="mb-3 bg-accent/20 rounded-[var(--radius-card)] border-2 border-primary/20 overflow-hidden">
                          <div className="px-3 py-2 bg-muted/50 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                                Asset Movement - {cycle.workZone}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Navigation className="w-3 h-3" />
                              <span className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                                {cycle.geoPath.length} waypoints
                              </span>
                            </div>
                          </div>
                          
                          {/* Map Canvas */}
                          <div className="relative h-[180px] bg-gradient-to-br from-accent/30 via-background to-accent/20">
                            {/* Grid Pattern */}
                            <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
                              <defs>
                                <pattern id={`map-grid-${cycle.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground"/>
                                </pattern>
                              </defs>
                              <rect width="100%" height="100%" fill={`url(#map-grid-${cycle.id})`} />
                            </svg>

                            {/* Calculate normalized positions for SVG */}
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                              {/* Asset Movement Path */}
                              <polyline
                                points={cycle.geoPath.map((point, idx) => {
                                  // Normalize lat/lng to 0-100 range for visualization
                                  const x = 10 + (idx / (cycle.geoPath.length - 1)) * 80;
                                  const y = 50 + Math.sin(idx * 0.5) * 20; // Simulate variation
                                  return `${x},${y}`;
                                }).join(' ')}
                                fill="none"
                                stroke="var(--primary)"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                opacity={cycle.status === 'predicted' ? '0.5' : '1'}
                                strokeDasharray={cycle.status === 'predicted' ? '4 2' : '0'}
                              />

                              {/* Waypoint Markers */}
                              {cycle.geoPath.map((point, idx) => {
                                const x = 10 + (idx / (cycle.geoPath.length - 1)) * 80;
                                const y = 50 + Math.sin(idx * 0.5) * 20;
                                const isStart = idx === 0;
                                const isEnd = idx === cycle.geoPath.length - 1;
                                const isCurrent = cycle.status === 'active' && isEnd;

                                return (
                                  <g key={idx}>
                                    {/* Marker Circle */}
                                    <circle
                                      cx={x}
                                      cy={y}
                                      r={isStart || isEnd ? 3 : 1.5}
                                      fill={isStart ? 'var(--color-success)' : isEnd ? 'var(--primary)' : 'var(--primary)'}
                                      stroke="white"
                                      strokeWidth={isStart || isEnd ? 1 : 0.5}
                                      opacity={isStart || isEnd ? 1 : 0.6}
                                    />
                                    
                                    {/* Pulsing animation for current position */}
                                    {isCurrent && (
                                      <circle
                                        cx={x}
                                        cy={y}
                                        r={5}
                                        fill="none"
                                        stroke="var(--primary)"
                                        strokeWidth="1"
                                        opacity="0.6"
                                      >
                                        <animate
                                          attributeName="r"
                                          from="3"
                                          to="8"
                                          dur="1.5s"
                                          repeatCount="indefinite"
                                        />
                                        <animate
                                          attributeName="opacity"
                                          from="0.8"
                                          to="0"
                                          dur="1.5s"
                                          repeatCount="indefinite"
                                        />
                                      </circle>
                                    )}
                                  </g>
                                );
                              })}

                              {/* Start Label */}
                              <text
                                x={10}
                                y={50 + Math.sin(0) * 20 - 5}
                                fontSize="4"
                                fill="var(--color-success)"
                                fontWeight="600"
                                textAnchor="middle"
                                fontFamily="var(--font-family)"
                              >
                                START
                              </text>

                              {/* End/Current Label */}
                              <text
                                x={90}
                                y={50 + Math.sin((cycle.geoPath.length - 1) * 0.5) * 20 - 5}
                                fontSize="4"
                                fill="var(--primary)"
                                fontWeight="600"
                                textAnchor="middle"
                                fontFamily="var(--font-family)"
                              >
                                {cycle.status === 'active' ? 'CURRENT' : cycle.status === 'predicted' ? 'PREDICTED' : 'END'}
                              </text>
                            </svg>

                            {/* Coordinates Overlay */}
                            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                              <div className="px-2 py-1 bg-card/90 backdrop-blur-sm rounded border border-border">
                                <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                                  Start: {cycle.geoPath[0].lat.toFixed(4)}°, {cycle.geoPath[0].lng.toFixed(4)}°
                                </div>
                              </div>
                              <div className="px-2 py-1 bg-card/90 backdrop-blur-sm rounded border border-primary">
                                <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-primary" style={{ fontSize: 'var(--text-xs)' }}>
                                  {cycle.status === 'active' ? 'Current' : 'End'}: {cycle.geoPath[cycle.geoPath.length - 1].lat.toFixed(4)}°, {cycle.geoPath[cycle.geoPath.length - 1].lng.toFixed(4)}°
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-3 gap-3 mb-3">
                          {/* Duration */}
                          <div className="p-3 bg-background rounded-[var(--radius-button)] border border-border">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                                Duration
                              </span>
                            </div>
                            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                              {cycle.duration.toFixed(1)}
                              <span className="text-muted-foreground font-[var(--font-weight-normal)] ml-1" style={{ fontSize: 'var(--text-sm)' }}>
                                min
                              </span>
                            </div>
                          </div>

                          {/* Volume */}
                          <div className="p-3 bg-background rounded-[var(--radius-button)] border border-border">
                            <div className="flex items-center gap-1.5 mb-1">
                              <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                              </svg>
                              <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                                Volume
                              </span>
                            </div>
                            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                              {cycle.volumeMoved.toFixed(1)}
                              <span className="text-muted-foreground font-[var(--font-weight-normal)] ml-1" style={{ fontSize: 'var(--text-sm)' }}>
                                yd³
                              </span>
                            </div>
                          </div>

                          {/* Total Cost */}
                          <div className="p-3 bg-background rounded-[var(--radius-button)] border border-border">
                            <div className="flex items-center gap-1.5 mb-1">
                              <DollarSign className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                                Total Cost
                              </span>
                            </div>
                            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                              ${cycle.totalCost.toFixed(2)}
                            </div>
                          </div>
                        </div>

                        {/* Unit Cost Comparison */}
                        <div className={`p-4 rounded-[var(--radius-card)] border-2 ${
                          isOverBudget ? 'bg-destructive/5 border-destructive' : 'bg-color-success/5 border-color-success'
                        }`}>
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                                Unit Cost
                              </div>
                              <div 
                                className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]`}
                                style={{ fontSize: 'var(--text-2xl)', color: isOverBudget ? 'var(--destructive)' : 'var(--color-success)' }}
                              >
                                ${cycle.unitCost.toFixed(2)}/yd³
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                                Bid Price
                              </div>
                              <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xl)' }}>
                                ${cycle.bidPrice.toFixed(2)}/yd³
                              </div>
                            </div>
                          </div>

                          {/* Variance Indicator */}
                          {isOverBudget && cycle.status !== 'predicted' && (
                            <div className="flex items-center gap-2 p-2 bg-destructive/10 rounded-[var(--radius-button)]">
                              <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0" />
                              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                                Exceeding bid price - contributing to production variance
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Velocity Metrics */}
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          <div className="p-3 bg-muted rounded-[var(--radius-button)] border border-border">
                            <div className="flex items-center gap-1.5 mb-1">
                              <TrendingUp className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                                Raw Velocity
                              </span>
                            </div>
                            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                              {cycle.rawVelocity.toFixed(1)}
                              <span className="text-muted-foreground font-[var(--font-weight-normal)] ml-1" style={{ fontSize: 'var(--text-sm)' }}>
                                yd³/hr
                              </span>
                            </div>
                          </div>

                          <div className="p-3 bg-muted rounded-[var(--radius-button)] border border-border">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Filter className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                                Normalized Velocity
                              </span>
                            </div>
                            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                              {cycle.normalizedVelocity.toFixed(1)}
                              <span className="text-muted-foreground font-[var(--font-weight-normal)] ml-1" style={{ fontSize: 'var(--text-sm)' }}>
                                yd³/hr
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                            {cycle.status === 'active' 
                              ? `Started: ${cycle.startTime.toLocaleTimeString()}`
                              : cycle.status === 'predicted'
                              ? `Predicted Start: ${cycle.startTime.toLocaleTimeString()}`
                              : `${cycle.startTime.toLocaleTimeString()} - ${cycle.endTime?.toLocaleTimeString()}`
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Material Type ID Section - Only show in Total view */}
        {viewMode === 'total' && (
          null
        )}
      </div>

      {/* Info Footer */}
      <div className="px-6 py-3 bg-muted border-t border-border">
        <p className="text-muted-foreground font-[family-name:var(--font-family)] text-center" style={{ fontSize: 'var(--text-xs)' }}>
          Production velocity calculated from real-time telemetry and material load sensors
        </p>
      </div>
    </div>
  );
}