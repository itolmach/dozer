import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Zap,
  Flame,
  Users,
  Info,
  Clock,
  Settings,
  ChevronRight
} from 'lucide-react';

interface ProjectSystemicHealthProps {
  assetName?: string;
  assetModel?: string;
  projectName?: string;
  contractorName?: string;
  ownerName?: string;
}

interface SystemicHealthMetrics {
  profitMargin: {
    current: number;
    target: number;
    trend: 'up' | 'down' | 'stable';
    riskLevel: 'healthy' | 'warning' | 'critical';
  };
  productionConsistency: {
    score: number; // 0-100
    variance: number; // coefficient of variation
    trend: 'improving' | 'declining' | 'stable';
    riskLevel: 'healthy' | 'warning' | 'critical';
  };
}

interface VariableVolatility {
  variable: 'Labor' | 'Fuel' | 'Machine Wear';
  volatilityCoefficient: number; // coefficient of variation
  trend: 'increasing' | 'decreasing' | 'stable';
  impactOnBid: number; // percentage impact
}

interface HistoricalBidVolatility {
  bidName: string;
  bidDate: string;
  mostVolatile: VariableVolatility;
  allVariables: {
    labor: number;
    fuel: number;
    machineWear: number;
  };
}

interface IdleTimeAttribution {
  assetId: string;
  assetName: string;
  idleHours: number;
  idleCost: number;
  currentAttribution: 'project-overhead' | 'specific-task';
  assignedTaskCode?: string;
  assignedTaskName?: string;
  canReassign: boolean;
}

const mockSystemicHealth: SystemicHealthMetrics = {
  profitMargin: {
    current: 14.2,
    target: 18.5,
    trend: 'down',
    riskLevel: 'warning'
  },
  productionConsistency: {
    score: 82.3,
    variance: 0.18, // 18% coefficient of variation
    trend: 'improving',
    riskLevel: 'healthy'
  }
};

const mockHistoricalVolatility: HistoricalBidVolatility[] = [
  {
    bidName: 'I-405 Expansion (Current)',
    bidDate: 'March 2026',
    mostVolatile: {
      variable: 'Machine Wear',
      volatilityCoefficient: 0.42,
      trend: 'increasing',
      impactOnBid: 8.3
    },
    allVariables: {
      labor: 0.28,
      fuel: 0.15,
      machineWear: 0.42
    }
  },
  {
    bidName: 'SR-99 Tunnel Bypass',
    bidDate: 'December 2025',
    mostVolatile: {
      variable: 'Machine Wear',
      volatilityCoefficient: 0.51,
      trend: 'stable',
      impactOnBid: 12.1
    },
    allVariables: {
      labor: 0.32,
      fuel: 0.12,
      machineWear: 0.51
    }
  },
  {
    bidName: 'Trans-Alaska Pipeline',
    bidDate: 'August 2025',
    mostVolatile: {
      variable: 'Labor',
      volatilityCoefficient: 0.45,
      trend: 'increasing',
      impactOnBid: 15.7
    },
    allVariables: {
      labor: 0.45,
      fuel: 0.38,
      machineWear: 0.35
    }
  }
];

const mockIdleTimeData: IdleTimeAttribution[] = [
  {
    assetId: 'JD-650-001',
    assetName: 'John Deere 650 Bulldozer',
    idleHours: 12.5,
    idleCost: 3587.50,
    currentAttribution: 'project-overhead',
    assignedTaskCode: 'CSI 31 22 00',
    assignedTaskName: 'Grading & Site Preparation',
    canReassign: true
  },
  {
    assetId: 'CAT-320-002',
    assetName: 'CAT 320 Excavator',
    idleHours: 8.2,
    idleCost: 2214.00,
    currentAttribution: 'specific-task',
    assignedTaskCode: 'CSI 31 23 16',
    assignedTaskName: 'Rock Blasting & Excavation',
    canReassign: true
  },
  {
    assetId: 'VOL-A40-003',
    assetName: 'Volvo A40 Articulated Truck',
    idleHours: 5.8,
    idleCost: 1624.00,
    currentAttribution: 'project-overhead',
    canReassign: true
  }
];

export function ProjectSystemicHealth(props?: ProjectSystemicHealthProps) {
  const [selectedIdleAsset, setSelectedIdleAsset] = useState<IdleTimeAttribution | null>(null);
  const [showAttributionModal, setShowAttributionModal] = useState(false);

  const getVariableIcon = (variable: string) => {
    switch (variable) {
      case 'Labor': return <Users className="w-5 h-5" />;
      case 'Fuel': return <Flame className="w-5 h-5" />;
      case 'Machine Wear': return <Zap className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getVariableColor = (variable: string) => {
    switch (variable) {
      case 'Labor': return 'var(--chart-1)';
      case 'Fuel': return 'var(--chart-2)';
      case 'Machine Wear': return 'var(--chart-3)';
      default: return 'var(--foreground)';
    }
  };

  const handleAttributionChange = (asset: IdleTimeAttribution, newAttribution: 'project-overhead' | 'specific-task') => {
    console.log('Updating idle time attribution:', {
      assetId: asset.assetId,
      fromAttribution: asset.currentAttribution,
      toAttribution: newAttribution,
      taskCode: newAttribution === 'specific-task' ? asset.assignedTaskCode : null,
      idleCost: asset.idleCost
    });
    setShowAttributionModal(false);
    setSelectedIdleAsset(null);
  };

  return (
    <div className="space-y-6">
      {/* Project Systemic Health Section */}
      <div className="bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
        <div className="px-6 py-4 bg-muted border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-foreground" />
              <h3 className="text-foreground">Project Systemic Health</h3>
              <div className="px-3 py-1 bg-primary/10 rounded-full">
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-primary" style={{ fontSize: 'var(--text-sm)' }}>
                  At a Glance
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Profit Margin */}
            <div className="bg-background rounded-[var(--radius-card)] border-2 border-border overflow-hidden">
              <div className={`px-4 py-3 border-b border-border ${
                mockSystemicHealth.profitMargin.riskLevel === 'healthy' 
                  ? 'bg-color-success/10' 
                  : mockSystemicHealth.profitMargin.riskLevel === 'warning'
                  ? 'bg-color-warning/10'
                  : 'bg-destructive/10'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className={`w-5 h-5`} style={{ 
                      color: mockSystemicHealth.profitMargin.riskLevel === 'healthy' 
                        ? 'var(--color-success)' 
                        : mockSystemicHealth.profitMargin.riskLevel === 'warning'
                        ? 'var(--color-warning)'
                        : 'var(--destructive)'
                    }} />
                    <h4 className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                      Profit Margin
                    </h4>
                  </div>
                  <div className={`px-3 py-1 rounded-full`} style={{ 
                    backgroundColor: mockSystemicHealth.profitMargin.riskLevel === 'healthy' 
                      ? 'var(--color-success)' 
                      : mockSystemicHealth.profitMargin.riskLevel === 'warning'
                      ? 'var(--color-warning)'
                      : 'var(--destructive)'
                  }}>
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-white uppercase" style={{ fontSize: 'var(--text-xs)' }}>
                      {mockSystemicHealth.profitMargin.riskLevel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Current vs Target */}
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                      Current Margin
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]`} style={{ 
                        fontSize: 'var(--text-4xl)',
                        color: mockSystemicHealth.profitMargin.current >= mockSystemicHealth.profitMargin.target 
                          ? 'var(--color-success)' 
                          : 'var(--destructive)'
                      }}>
                        {mockSystemicHealth.profitMargin.current}%
                      </span>
                      <div className="flex items-center gap-1">
                        {mockSystemicHealth.profitMargin.trend === 'down' ? (
                          <TrendingDown className="w-5 h-5 text-destructive" />
                        ) : mockSystemicHealth.profitMargin.trend === 'up' ? (
                          <TrendingUp className="w-5 h-5 text-color-success" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                      Target Margin
                    </div>
                    <div className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-2xl)' }}>
                      {mockSystemicHealth.profitMargin.target}%
                    </div>
                  </div>
                </div>

                {/* Visual Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                      Progress to Target
                    </span>
                    <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-xs)' }}>
                      {((mockSystemicHealth.profitMargin.current / mockSystemicHealth.profitMargin.target) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
                    <div 
                      className="h-full transition-all duration-500" 
                      style={{ 
                        width: `${Math.min((mockSystemicHealth.profitMargin.current / mockSystemicHealth.profitMargin.target) * 100, 100)}%`,
                        backgroundColor: mockSystemicHealth.profitMargin.current >= mockSystemicHealth.profitMargin.target 
                          ? 'var(--color-success)' 
                          : mockSystemicHealth.profitMargin.current >= mockSystemicHealth.profitMargin.target * 0.85
                          ? 'var(--color-warning)'
                          : 'var(--destructive)'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Gap Analysis */}
                <div className="p-4 bg-muted rounded-[var(--radius-button)] border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                      Gap to Target
                    </span>
                    <span className="text-destructive font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-lg)' }}>
                      -{(mockSystemicHealth.profitMargin.target - mockSystemicHealth.profitMargin.current).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Production Consistency */}
            <div className="bg-background rounded-[var(--radius-card)] border-2 border-border overflow-hidden">
              <div className={`px-4 py-3 border-b border-border ${
                mockSystemicHealth.productionConsistency.riskLevel === 'healthy' 
                  ? 'bg-color-success/10' 
                  : mockSystemicHealth.productionConsistency.riskLevel === 'warning'
                  ? 'bg-color-warning/10'
                  : 'bg-destructive/10'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity className={`w-5 h-5`} style={{ 
                      color: mockSystemicHealth.productionConsistency.riskLevel === 'healthy' 
                        ? 'var(--color-success)' 
                        : mockSystemicHealth.productionConsistency.riskLevel === 'warning'
                        ? 'var(--color-warning)'
                        : 'var(--destructive)'
                    }} />
                    <h4 className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                      Production Consistency
                    </h4>
                  </div>
                  <div className={`px-3 py-1 rounded-full`} style={{ 
                    backgroundColor: mockSystemicHealth.productionConsistency.riskLevel === 'healthy' 
                      ? 'var(--color-success)' 
                      : mockSystemicHealth.productionConsistency.riskLevel === 'warning'
                      ? 'var(--color-warning)'
                      : 'var(--destructive)'
                  }}>
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-white uppercase" style={{ fontSize: 'var(--text-xs)' }}>
                      {mockSystemicHealth.productionConsistency.riskLevel}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Consistency Score */}
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                      Consistency Score
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-4xl)' }}>
                        {mockSystemicHealth.productionConsistency.score}
                      </span>
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-lg)' }}>
                        / 100
                      </span>
                      <div className="flex items-center gap-1 ml-2">
                        {mockSystemicHealth.productionConsistency.trend === 'improving' ? (
                          <TrendingUp className="w-5 h-5 text-color-success" />
                        ) : mockSystemicHealth.productionConsistency.trend === 'declining' ? (
                          <TrendingDown className="w-5 h-5 text-destructive" />
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Circular Progress Indicator */}
                <div className="flex items-center justify-center mb-4">
                  <div className="relative w-32 h-32">
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
                        stroke="var(--color-success)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${mockSystemicHealth.productionConsistency.score * 2.51} 251.2`}
                        style={{ transition: 'stroke-dasharray 0.5s ease' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-color-success" />
                    </div>
                  </div>
                </div>

                {/* Variance Metric */}
                <div className="p-4 bg-muted rounded-[var(--radius-button)] border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                      Coefficient of Variation
                    </span>
                    <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-lg)' }}>
                      {(mockSystemicHealth.productionConsistency.variance * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                    Lower is better - measures day-to-day production variability
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Health Summary */}
          <div className="mt-6 p-4 bg-accent/30 rounded-[var(--radius-card)] border-2 border-primary/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                  Systemic Health Analysis
                </p>
                <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  Profit margin is {(mockSystemicHealth.profitMargin.target - mockSystemicHealth.profitMargin.current).toFixed(1)}% below target, but production consistency remains strong at {mockSystemicHealth.productionConsistency.score}/100. Focus on cost reduction to improve margins while maintaining operational consistency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historical Bid Variable Volatility Analysis */}
      <div className="bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
        <div className="px-6 py-4 bg-muted border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-foreground" />
              <h3 className="text-foreground">Variable Volatility - Last 3 Bids</h3>
              <div className="px-3 py-1 bg-destructive/10 rounded-full">
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                  Historical Analysis
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-base)' }}>
              Identifying which variable (Labor, Fuel, or Machine Wear) had the highest volatility helps refine future bid estimates and risk contingencies.
            </p>
          </div>

          <div className="space-y-4">
            {mockHistoricalVolatility.map((bid, index) => (
              <div
                key={index}
                className="bg-background rounded-[var(--radius-card)] border-2 border-border overflow-hidden"
              >
                <div className="px-4 py-3 bg-muted border-b border-border flex items-center justify-between">
                  <div>
                    <h4 className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-1" style={{ fontSize: 'var(--text-base)' }}>
                      {bid.bidName}
                    </h4>
                    <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                      Completed: {bid.bidDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="px-3 py-1 rounded-full mb-1" style={{ backgroundColor: getVariableColor(bid.mostVolatile.variable) }}>
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-white" style={{ fontSize: 'var(--text-sm)' }}>
                        Most Volatile
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Most Volatile Variable Highlight */}
                  <div className="mb-6 p-4 rounded-[var(--radius-card)] border-2 overflow-hidden" style={{ 
                    backgroundColor: `${getVariableColor(bid.mostVolatile.variable)}15`,
                    borderColor: getVariableColor(bid.mostVolatile.variable)
                  }}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-[var(--radius-button)]" style={{ backgroundColor: getVariableColor(bid.mostVolatile.variable) }}>
                          {getVariableIcon(bid.mostVolatile.variable)}
                          <span className="text-white ml-1"></span>
                        </div>
                        <div>
                          <h5 className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-1" style={{ fontSize: 'var(--text-lg)' }}>
                            {bid.mostVolatile.variable}
                          </h5>
                          <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                            Highest coefficient of variation
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-3 bg-background rounded-[var(--radius-button)] border border-border">
                        <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Volatility (CV)
                        </p>
                        <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xl)' }}>
                          {(bid.mostVolatile.volatilityCoefficient * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div className="p-3 bg-background rounded-[var(--radius-button)] border border-border">
                        <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Trend
                        </p>
                        <div className="flex items-center gap-1">
                          {bid.mostVolatile.trend === 'increasing' ? (
                            <TrendingUp className="w-4 h-4 text-destructive" />
                          ) : bid.mostVolatile.trend === 'decreasing' ? (
                            <TrendingDown className="w-4 h-4 text-color-success" />
                          ) : null}
                          <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] capitalize" style={{ fontSize: 'var(--text-sm)' }}>
                            {bid.mostVolatile.trend}
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-background rounded-[var(--radius-button)] border border-border">
                        <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Bid Impact
                        </p>
                        <p className="text-destructive font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xl)' }}>
                          +{bid.mostVolatile.impactOnBid.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* All Variables Comparison */}
                  <div>
                    <h5 className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-3" style={{ fontSize: 'var(--text-base)' }}>
                      All Variables Comparison
                    </h5>
                    <div className="space-y-3">
                      {/* Labor */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 min-w-[140px]">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                            Labor
                          </span>
                        </div>
                        <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden border border-border">
                          <div 
                            className="h-full flex items-center justify-end pr-2 transition-all duration-500" 
                            style={{ 
                              width: `${(bid.allVariables.labor / Math.max(bid.allVariables.labor, bid.allVariables.fuel, bid.allVariables.machineWear)) * 100}%`,
                              backgroundColor: 'var(--chart-1)'
                            }}
                          >
                            <span className="text-white font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xs)' }}>
                              {(bid.allVariables.labor * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Fuel */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 min-w-[140px]">
                          <Flame className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                            Fuel
                          </span>
                        </div>
                        <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden border border-border">
                          <div 
                            className="h-full flex items-center justify-end pr-2 transition-all duration-500" 
                            style={{ 
                              width: `${(bid.allVariables.fuel / Math.max(bid.allVariables.labor, bid.allVariables.fuel, bid.allVariables.machineWear)) * 100}%`,
                              backgroundColor: 'var(--chart-2)'
                            }}
                          >
                            <span className="text-white font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xs)' }}>
                              {(bid.allVariables.fuel * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Machine Wear */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 min-w-[140px]">
                          <Zap className="w-4 h-4 text-muted-foreground" />
                          <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                            Machine Wear
                          </span>
                        </div>
                        <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden border border-border">
                          <div 
                            className="h-full flex items-center justify-end pr-2 transition-all duration-500" 
                            style={{ 
                              width: `${(bid.allVariables.machineWear / Math.max(bid.allVariables.labor, bid.allVariables.fuel, bid.allVariables.machineWear)) * 100}%`,
                              backgroundColor: 'var(--chart-3)'
                            }}
                          >
                            <span className="text-white font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xs)' }}>
                              {(bid.allVariables.machineWear * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Volatility Insight */}
          <div className="mt-6 p-4 bg-accent/30 rounded-[var(--radius-card)] border-2 border-primary/20">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                  Pattern Identified
                </p>
                <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  Machine Wear has been the most volatile variable in 2 of the last 3 bids. Consider increasing contingency allowances for equipment maintenance and replacement in future estimates for similar project types.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Idle Time Cost-Code Attribution */}
      <div className="bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
        <div className="px-6 py-4 bg-muted border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-foreground" />
              <h3 className="text-foreground">Idle Time Cost-Code Attribution</h3>
              <div className="px-3 py-1 bg-color-warning/10 rounded-full">
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)', color: 'var(--color-warning)' }}>
                  Requires Review
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <p className="text-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-base)' }}>
              Attribute idle time costs to either <span className="font-[var(--font-weight-semibold)]">Project Overhead</span> or the <span className="font-[var(--font-weight-semibold)]">Specific Task</span> the machine was assigned to.
            </p>
            <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
              This ensures accurate cost attribution for future bidding and helps identify which tasks generate the most downtime.
            </p>
          </div>

          <div className="space-y-4">
            {mockIdleTimeData.map((asset) => (
              <div
                key={asset.assetId}
                className="bg-background rounded-[var(--radius-card)] border-2 border-border overflow-hidden"
              >
                <div className="p-4">
                  {/* Asset Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-1" style={{ fontSize: 'var(--text-base)' }}>
                        {asset.assetName}
                      </h4>
                      <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                        Asset ID: {asset.assetId}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                        Total Idle Cost
                      </p>
                      <p className="text-destructive font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-2xl)' }}>
                        ${asset.idleCost.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Idle Hours */}
                  <div className="mb-4 p-3 bg-muted rounded-[var(--radius-button)] border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                          Idle Hours
                        </span>
                      </div>
                      <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-lg)' }}>
                        {asset.idleHours.toFixed(1)} hrs
                      </span>
                    </div>
                  </div>

                  {/* Current Attribution */}
                  <div className="mb-4">
                    <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                      Current Attribution
                    </p>
                    <div className={`p-3 rounded-[var(--radius-button)] border-2 ${
                      asset.currentAttribution === 'project-overhead' 
                        ? 'bg-primary/10 border-primary' 
                        : 'bg-color-success/10 border-color-success'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full`} style={{ 
                          backgroundColor: asset.currentAttribution === 'project-overhead' 
                            ? 'var(--primary)' 
                            : 'var(--color-success)'
                        }}></div>
                        <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                          {asset.currentAttribution === 'project-overhead' ? 'Project Overhead' : 'Specific Task'}
                        </span>
                      </div>
                      {asset.currentAttribution === 'specific-task' && asset.assignedTaskCode && (
                        <div className="mt-2 pt-2 border-t border-border">
                          <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                            Assigned Task
                          </p>
                          <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                            {asset.assignedTaskCode} - {asset.assignedTaskName}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Attribution Options */}
                  {asset.canReassign && (
                    <div>
                      <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-3" style={{ fontSize: 'var(--text-sm)' }}>
                        Update Attribution
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            setSelectedIdleAsset(asset);
                            setShowAttributionModal(true);
                            handleAttributionChange(asset, 'project-overhead');
                          }}
                          className={`min-h-[60px] p-4 rounded-[var(--radius-button)] border-2 transition-all ${
                            asset.currentAttribution === 'project-overhead'
                              ? 'border-primary bg-primary/10'
                              : 'border-border bg-card hover:bg-accent'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Settings className="w-4 h-4 text-foreground" />
                            <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-sm)' }}>
                              Project Overhead
                            </span>
                          </div>
                          <p className="text-muted-foreground font-[family-name:var(--font-family)] text-left" style={{ fontSize: 'var(--text-xs)' }}>
                            General project delays
                          </p>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedIdleAsset(asset);
                            setShowAttributionModal(true);
                            handleAttributionChange(asset, 'specific-task');
                          }}
                          className={`min-h-[60px] p-4 rounded-[var(--radius-button)] border-2 transition-all ${
                            asset.currentAttribution === 'specific-task'
                              ? 'border-color-success bg-color-success/10'
                              : 'border-border bg-card hover:bg-accent'
                          }`}
                          disabled={!asset.assignedTaskCode}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="w-4 h-4 text-foreground" />
                            <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-sm)' }}>
                              Specific Task
                            </span>
                          </div>
                          <p className="text-muted-foreground font-[family-name:var(--font-family)] text-left" style={{ fontSize: 'var(--text-xs)' }}>
                            {asset.assignedTaskCode ? asset.assignedTaskCode : 'No task assigned'}
                          </p>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="p-4 bg-background rounded-[var(--radius-button)] border-2 border-border">
              <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                Total Idle Hours
              </p>
              <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-2xl)' }}>
                {mockIdleTimeData.reduce((sum, asset) => sum + asset.idleHours, 0).toFixed(1)}
              </p>
            </div>
            <div className="p-4 bg-background rounded-[var(--radius-button)] border-2 border-border">
              <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                Total Idle Cost
              </p>
              <p className="text-destructive font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-2xl)' }}>
                ${mockIdleTimeData.reduce((sum, asset) => sum + asset.idleCost, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-background rounded-[var(--radius-button)] border-2 border-border">
              <p className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                Assets Tracked
              </p>
              <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-2xl)' }}>
                {mockIdleTimeData.length}
              </p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mt-6 p-4 bg-accent/30 rounded-[var(--radius-card)] border-2 border-primary/20">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                  Cost Attribution Impact
                </p>
                <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  Properly attributing idle time helps identify which tasks generate the most downtime. Task-specific attribution provides better data for future bid estimates, while project overhead attribution captures general delays like weather, permitting, or coordination issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}