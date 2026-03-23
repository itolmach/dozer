import { 
  Activity, 
  Zap, 
  Flame, 
  Target, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Percent,
  Columns2,
  X
} from 'lucide-react';
import { useState } from 'react';
import { SplitViewComparison } from './SplitViewComparison';

interface ProjectBid {
  id: string;
  name: string;
  location: string;
  completedDate: string;
  estimatedProfit: number; // percentage
  actualProfit: number; // percentage
  planAdherence: number; // percentage (how close to planned schedule/quantities)
  laborVariability: number; // coefficient of variation
  fuelVariability: number;
  machineWearVariability: number;
  environmentalDifficulty: number; // 0-100
}

interface ComparativeAnalysisProps {
  environmentalDifficulty: number;
  successMetric: 'profit' | 'consistency';
  onDifficultyChange: (value: number) => void;
  onMetricChange: (metric: 'profit' | 'consistency') => void;
}

export function ComparativeAnalysis({ 
  environmentalDifficulty,
  successMetric,
  onDifficultyChange,
  onMetricChange
}: ComparativeAnalysisProps) {
  const [showSplitView, setShowSplitView] = useState(false);
  
  // Mock historical bid data
  const historicalBids: ProjectBid[] = [
    {
      id: '1',
      name: 'I-405 Expansion (Current)',
      location: 'Los Angeles, CA',
      completedDate: 'March 2026',
      estimatedProfit: 18.5,
      actualProfit: 14.2,
      planAdherence: 92.3,
      laborVariability: 0.28, // 28% coefficient of variation
      fuelVariability: 0.15, // 15% CV
      machineWearVariability: 0.42, // 42% CV - highest volatility
      environmentalDifficulty: 45,
    },
    {
      id: '2',
      name: 'SR-99 Tunnel Bypass',
      location: 'Seattle, WA',
      completedDate: 'December 2025',
      estimatedProfit: 22.0,
      actualProfit: 19.8,
      planAdherence: 88.5,
      laborVariability: 0.32,
      fuelVariability: 0.12,
      machineWearVariability: 0.51, // Machine wear was most volatile
      environmentalDifficulty: 72, // Rainy, cold environment
    },
    {
      id: '3',
      name: 'Trans-Alaska Pipeline Maintenance',
      location: 'Prudhoe Bay, AK',
      completedDate: 'August 2025',
      estimatedProfit: 28.0,
      actualProfit: 24.5,
      planAdherence: 76.2, // Hard to stick to plan in extreme conditions
      laborVariability: 0.45, // Labor most volatile in Alaska
      fuelVariability: 0.38,
      machineWearVariability: 0.35,
      environmentalDifficulty: 98, // Extreme environment
    },
    {
      id: '4',
      name: 'I-35 Widening Project',
      location: 'Austin, TX',
      completedDate: 'June 2025',
      estimatedProfit: 16.5,
      actualProfit: 17.2,
      planAdherence: 94.8, // Excellent adherence
      laborVariability: 0.18,
      fuelVariability: 0.22, // Fuel prices more volatile in TX
      machineWearVariability: 0.19,
      environmentalDifficulty: 25, // Mild environment
    },
    {
      id: '5',
      name: 'Port of Long Beach Expansion',
      location: 'Long Beach, CA',
      completedDate: 'March 2025',
      estimatedProfit: 20.0,
      actualProfit: 16.8,
      planAdherence: 85.3,
      laborVariability: 0.35,
      fuelVariability: 0.14,
      machineWearVariability: 0.48, // High machine wear variability
      environmentalDifficulty: 38,
    },
  ];

  // Identify most volatile variable across all projects
  const getMostVolatileVariable = (): 'labor' | 'fuel' | 'machineWear' => {
    const avgLaborCV = historicalBids.reduce((sum, bid) => sum + bid.laborVariability, 0) / historicalBids.length;
    const avgFuelCV = historicalBids.reduce((sum, bid) => sum + bid.fuelVariability, 0) / historicalBids.length;
    const avgMachineWearCV = historicalBids.reduce((sum, bid) => sum + bid.machineWearVariability, 0) / historicalBids.length;

    if (avgMachineWearCV > avgLaborCV && avgMachineWearCV > avgFuelCV) return 'machineWear';
    if (avgLaborCV > avgFuelCV) return 'labor';
    return 'fuel';
  };

  const mostVolatile = getMostVolatileVariable();

  // Normalize metrics based on environmental difficulty
  const getNormalizedScore = (bid: ProjectBid): number => {
    // Environmental difficulty adjustment factor (higher difficulty = harder to achieve goals)
    const difficultyFactor = 1 - (bid.environmentalDifficulty / 100) * 0.3;
    
    if (successMetric === 'profit') {
      // Normalize profit by environmental difficulty
      const normalizedProfit = bid.actualProfit / difficultyFactor;
      return normalizedProfit;
    } else {
      // Normalize plan adherence by environmental difficulty
      const normalizedAdherence = bid.planAdherence / difficultyFactor;
      return normalizedAdherence;
    }
  };

  const sortedBids = [...historicalBids].sort((a, b) => getNormalizedScore(b) - getNormalizedScore(a));

  const getEnvironmentLabel = (difficulty: number): string => {
    if (difficulty < 30) return 'Mild (Texas, Arizona)';
    if (difficulty < 60) return 'Moderate (California, Nevada)';
    if (difficulty < 80) return 'Challenging (Washington, Colorado)';
    return 'Extreme (Alaska, North Dakota)';
  };

  const getVariableIcon = (variable: 'labor' | 'fuel' | 'machineWear') => {
    if (variable === 'labor') return <Activity className="w-5 h-5" />;
    if (variable === 'fuel') return <Zap className="w-5 h-5" />;
    return <Flame className="w-5 h-5" />;
  };

  const getVariableLabel = (variable: 'labor' | 'fuel' | 'machineWear') => {
    if (variable === 'labor') return 'Labor Costs';
    if (variable === 'fuel') return 'Fuel Prices';
    return 'Machine Wear & Tear';
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-2" style={{ fontSize: 'var(--text-lg)' }}>
            Comparative Analysis - Multi-Project Intelligence
          </h4>
          <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
            Benchmarking across recent bids with environmental normalization
          </p>
        </div>
        
        {/* Split View Button */}
        <button
          onClick={() => setShowSplitView(true)}
          className="min-w-[60px] min-h-[60px] px-6 py-3 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Columns2 className="w-5 h-5" />
          <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-sm)' }}>
            Split View Comparison
          </span>
        </button>
      </div>

      {/* Analysis Controls */}
      <div className="bg-muted/50 rounded-[var(--radius-card)] border-2 border-border p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Success Metric Toggle */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-foreground" />
              <label className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                Success Metric Context
              </label>
            </div>
            
            <div className="flex items-center gap-2 bg-background rounded-full p-1 border-2 border-border">
              <button
                onClick={() => onMetricChange('profit')}
                className={`flex-1 min-h-[60px] px-6 py-3 rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] transition-all ${
                  successMetric === 'profit'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-foreground hover:bg-muted'
                }`}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                <div className="flex flex-col items-center gap-1">
                  <DollarSign className="w-5 h-5" />
                  <span>Profit Margin</span>
                </div>
              </button>
              <button
                onClick={() => onMetricChange('consistency')}
                className={`flex-1 min-h-[60px] px-6 py-3 rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] transition-all ${
                  successMetric === 'consistency'
                    ? 'bg-primary text-white shadow-md'
                    : 'text-foreground hover:bg-muted'
                }`}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                <div className="flex flex-col items-center gap-1">
                  <Target className="w-5 h-5" />
                  <span>Plan Adherence</span>
                </div>
              </button>
            </div>

            <p className="mt-3 text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
              {successMetric === 'profit' 
                ? 'Rankings based on actual profit margin achieved'
                : 'Rankings based on adherence to planned schedule and quantities'}
            </p>
          </div>

          {/* Environmental Difficulty Weighting Slider */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-foreground" />
                <label className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                  Environmental Difficulty Weighting
                </label>
              </div>
              <div className="px-3 py-1.5 bg-primary/10 rounded-full border border-primary">
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-primary" style={{ fontSize: 'var(--text-sm)' }}>
                  {environmentalDifficulty}%
                </span>
              </div>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={environmentalDifficulty}
              onChange={(e) => onDifficultyChange(Number(e.target.value))}
              className="w-full min-h-[60px] accent-primary cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${environmentalDifficulty}%, var(--border) ${environmentalDifficulty}%, var(--border) 100%)`
              }}
            />

            <div className="flex items-center justify-between mt-2">
              <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                Texas
              </span>
              <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                California
              </span>
              <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                Washington
              </span>
              <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                Alaska
              </span>
            </div>

            <div className="mt-3 p-3 bg-background rounded-[var(--radius-button)] border border-border">
              <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                <span className="font-[var(--font-weight-semibold)]">Current: {getEnvironmentLabel(environmentalDifficulty)}</span><br />
                Metrics are normalized to account for environmental challenges
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Most Volatile Variable Alert */}
      <div className="p-6 bg-destructive/10 rounded-[var(--radius-card)] border-2 border-destructive">
        <div className="flex items-start gap-4">
          <div className="min-w-[60px] min-h-[60px] rounded-full bg-destructive flex items-center justify-center flex-shrink-0 text-white">
            {getVariableIcon(mostVolatile)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h5 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-base)' }}>
                Highest Volatility Detected: {getVariableLabel(mostVolatile)}
              </h5>
            </div>
            <p className="text-foreground font-[family-name:var(--font-family)] mb-3" style={{ fontSize: 'var(--text-sm)' }}>
              Across the last 5 projects, <span className="font-[var(--font-weight-semibold)] text-destructive">{getVariableLabel(mostVolatile)}</span> showed the highest variance 
              (coefficient of variation: {(historicalBids.reduce((sum, bid) => {
                if (mostVolatile === 'labor') return sum + bid.laborVariability;
                if (mostVolatile === 'fuel') return sum + bid.fuelVariability;
                return sum + bid.machineWearVariability;
              }, 0) / historicalBids.length * 100).toFixed(1)}%). 
              This variable should receive increased scrutiny in future bid risk assessments.
            </p>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-background rounded-[var(--radius-button)]">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-foreground" />
                  <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                    Labor
                  </span>
                </div>
                <div className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                  mostVolatile === 'labor' ? 'text-destructive' : 'text-foreground'
                }`} style={{ fontSize: 'var(--text-base)' }}>
                  {(historicalBids.reduce((sum, bid) => sum + bid.laborVariability, 0) / historicalBids.length * 100).toFixed(1)}% CV
                </div>
              </div>

              <div className="p-3 bg-background rounded-[var(--radius-button)]">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-foreground" />
                  <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                    Fuel
                  </span>
                </div>
                <div className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                  mostVolatile === 'fuel' ? 'text-destructive' : 'text-foreground'
                }`} style={{ fontSize: 'var(--text-base)' }}>
                  {(historicalBids.reduce((sum, bid) => sum + bid.fuelVariability, 0) / historicalBids.length * 100).toFixed(1)}% CV
                </div>
              </div>

              <div className="p-3 bg-background rounded-[var(--radius-button)]">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="w-4 h-4 text-foreground" />
                  <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                    Machine Wear
                  </span>
                </div>
                <div className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                  mostVolatile === 'machineWear' ? 'text-destructive' : 'text-foreground'
                }`} style={{ fontSize: 'var(--text-base)' }}>
                  {(historicalBids.reduce((sum, bid) => sum + bid.machineWearVariability, 0) / historicalBids.length * 100).toFixed(1)}% CV
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comparative Bid Performance Table */}
      <div className="border-2 border-border rounded-[var(--radius-card)] overflow-hidden">
        <div className="bg-muted px-6 py-4 border-b-2 border-border">
          <h5 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
            Recent Projects Ranked by {successMetric === 'profit' ? 'Profit Margin' : 'Production Consistency'}
          </h5>
          <p className="text-muted-foreground font-[family-name:var(--font-family)] mt-1" style={{ fontSize: 'var(--text-xs)' }}>
            Normalized for environmental difficulty at {environmentalDifficulty}% weighting
          </p>
        </div>

        <div className="divide-y divide-border">
          {sortedBids.map((bid, index) => {
            const normalizedScore = getNormalizedScore(bid);
            const isCurrentProject = bid.name.includes('Current');
            
            return (
              <div 
                key={bid.id} 
                className={`p-6 ${isCurrentProject ? 'bg-primary/5' : 'bg-background'} ${
                  index === 0 ? 'border-l-4 border-l-color-success' : ''
                }`}
              >
                <div className="flex items-start gap-6">
                  {/* Rank Badge */}
                  <div className={`min-w-[60px] min-h-[60px] rounded-full flex items-center justify-center flex-shrink-0 ${
                    index === 0 
                      ? 'bg-color-success'
                      : index === 1
                      ? 'bg-primary'
                      : 'bg-muted border-2 border-border'
                  }`}>
                    <span className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                      index <= 1 ? 'text-white' : 'text-foreground'
                    }`} style={{ fontSize: 'var(--text-xl)' }}>
                      #{index + 1}
                    </span>
                  </div>

                  {/* Project Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h6 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                            {bid.name}
                          </h6>
                          {isCurrentProject && (
                            <span className="px-2 py-0.5 bg-primary rounded text-white font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                              CURRENT
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                          {bid.location} • Completed {bid.completedDate}
                        </p>
                      </div>

                      {/* Normalized Score */}
                      <div className="text-right">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Normalized Score
                        </div>
                        <div className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                          index === 0 ? 'text-color-success' : 'text-foreground'
                        }`} style={{ fontSize: 'var(--text-2xl)' }}>
                          {normalizedScore.toFixed(1)}{successMetric === 'profit' ? '%' : ''}
                        </div>
                      </div>
                    </div>

                    {/* Performance Metrics */}
                    <div className="grid grid-cols-5 gap-4">
                      {/* Profit */}
                      <div className="p-3 bg-muted rounded-[var(--radius-button)]">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Profit Margin
                        </div>
                        <div className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                          bid.actualProfit >= bid.estimatedProfit ? 'text-color-success' : 'text-destructive'
                        }`} style={{ fontSize: 'var(--text-base)' }}>
                          {bid.actualProfit.toFixed(1)}%
                        </div>
                        <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                          Target: {bid.estimatedProfit.toFixed(1)}%
                        </div>
                      </div>

                      {/* Plan Adherence */}
                      <div className="p-3 bg-muted rounded-[var(--radius-button)]">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Plan Adherence
                        </div>
                        <div className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                          bid.planAdherence >= 90 ? 'text-color-success' : bid.planAdherence >= 80 ? 'text-color-warning' : 'text-destructive'
                        }`} style={{ fontSize: 'var(--text-base)' }}>
                          {bid.planAdherence.toFixed(1)}%
                        </div>
                      </div>

                      {/* Labor Variability */}
                      <div className="p-3 bg-muted rounded-[var(--radius-button)]">
                        <div className="flex items-center gap-1 mb-1">
                          <Activity className="w-3 h-3 text-muted-foreground" />
                          <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                            Labor CV
                          </div>
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                          {(bid.laborVariability * 100).toFixed(0)}%
                        </div>
                      </div>

                      {/* Fuel Variability */}
                      <div className="p-3 bg-muted rounded-[var(--radius-button)]">
                        <div className="flex items-center gap-1 mb-1">
                          <Zap className="w-3 h-3 text-muted-foreground" />
                          <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                            Fuel CV
                          </div>
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                          {(bid.fuelVariability * 100).toFixed(0)}%
                        </div>
                      </div>

                      {/* Machine Wear Variability */}
                      <div className="p-3 bg-muted rounded-[var(--radius-button)]">
                        <div className="flex items-center gap-1 mb-1">
                          <Flame className="w-3 h-3 text-muted-foreground" />
                          <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                            Wear CV
                          </div>
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                          {(bid.machineWearVariability * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>

                    {/* Environment Badge */}
                    <div className="mt-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-background rounded-full border border-border">
                        <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                          Environment:
                        </span>
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xs)' }}>
                          {getEnvironmentLabel(bid.environmentalDifficulty)} ({bid.environmentalDifficulty}%)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Insights */}
      <div className="p-6 bg-primary/10 rounded-[var(--radius-card)] border-2 border-primary/30">
        <div className="flex items-start gap-3">
          <Target className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h5 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-2" style={{ fontSize: 'var(--text-base)' }}>
              Comparative Intelligence Synthesis
            </h5>
            <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
              When normalized for environmental difficulty, the data shows that {successMetric === 'profit' ? 'profit margins' : 'production consistency'} 
              {' '}can vary significantly based on site conditions. Projects in extreme environments (Alaska: 98% difficulty) show{' '}
              {successMetric === 'profit' 
                ? 'higher nominal profit margins but lower adherence to planned execution' 
                : 'significantly lower plan adherence despite higher profit targets'}.
              {' '}Use this comparative analysis to adjust risk premiums and bid strategies for future projects with similar environmental profiles.
            </p>
          </div>
        </div>
      </div>
      
      {/* Split View Modal */}
      {showSplitView && (
        <SplitViewComparison 
          projects={historicalBids}
          onClose={() => setShowSplitView(false)}
        />
      )}
    </div>
  );
}