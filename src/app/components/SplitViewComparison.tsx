import { useState } from 'react';
import { 
  Activity, 
  Zap, 
  Flame, 
  Target, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Columns2,
  X,
  ChevronDown,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface ProjectBid {
  id: string;
  name: string;
  location: string;
  completedDate: string;
  estimatedProfit: number;
  actualProfit: number;
  planAdherence: number;
  laborVariability: number;
  fuelVariability: number;
  machineWearVariability: number;
  environmentalDifficulty: number;
}

interface SplitViewComparisonProps {
  projects: ProjectBid[];
  onClose: () => void;
}

export function SplitViewComparison({ projects, onClose }: SplitViewComparisonProps) {
  const [selectedLeftId, setSelectedLeftId] = useState(projects[0]?.id || '');
  const [selectedRightId, setSelectedRightId] = useState(projects[1]?.id || '');

  const leftProject = projects.find(p => p.id === selectedLeftId);
  const rightProject = projects.find(p => p.id === selectedRightId);

  if (!leftProject || !rightProject) return null;

  const getEnvironmentLabel = (difficulty: number): string => {
    if (difficulty < 30) return 'Mild';
    if (difficulty < 60) return 'Moderate';
    if (difficulty < 80) return 'Challenging';
    return 'Extreme';
  };

  const renderComparisonRow = (
    label: string,
    leftValue: number,
    rightValue: number,
    unit: string = '',
    higherIsBetter: boolean = true,
    icon?: React.ReactNode
  ) => {
    const leftBetter = higherIsBetter ? leftValue > rightValue : leftValue < rightValue;
    const rightBetter = higherIsBetter ? rightValue > leftValue : rightValue < leftValue;
    const isDraw = Math.abs(leftValue - rightValue) < 0.1;

    return (
      <div className="grid grid-cols-[1fr_auto_1fr] gap-4 py-4 border-b border-border">
        {/* Left Value */}
        <div className={`text-right p-4 rounded-[var(--radius-button)] ${
          !isDraw && leftBetter ? 'bg-color-success/10 border-2 border-color-success' : 'bg-muted'
        }`}>
          <div className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
            !isDraw && leftBetter ? 'text-color-success' : 'text-foreground'
          }`} style={{ fontSize: 'var(--text-2xl)' }}>
            {leftValue.toFixed(1)}{unit}
          </div>
          {!isDraw && leftBetter && (
            <div className="flex items-center justify-end gap-1 mt-1">
              <CheckCircle className="w-4 h-4 text-color-success" />
              <span className="text-color-success font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-xs)' }}>
                Better by {Math.abs(leftValue - rightValue).toFixed(1)}{unit}
              </span>
            </div>
          )}
        </div>

        {/* Center Label */}
        <div className="flex flex-col items-center justify-center min-w-[200px]">
          {icon && <div className="mb-2">{icon}</div>}
          <div className="text-center font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
            {label}
          </div>
          {isDraw && (
            <div className="mt-1 px-2 py-0.5 bg-muted rounded-full">
              <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                Tied
              </span>
            </div>
          )}
        </div>

        {/* Right Value */}
        <div className={`text-left p-4 rounded-[var(--radius-button)] ${
          !isDraw && rightBetter ? 'bg-color-success/10 border-2 border-color-success' : 'bg-muted'
        }`}>
          <div className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
            !isDraw && rightBetter ? 'text-color-success' : 'text-foreground'
          }`} style={{ fontSize: 'var(--text-2xl)' }}>
            {rightValue.toFixed(1)}{unit}
          </div>
          {!isDraw && rightBetter && (
            <div className="flex items-center gap-1 mt-1">
              <CheckCircle className="w-4 h-4 text-color-success" />
              <span className="text-color-success font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-xs)' }}>
                Better by {Math.abs(rightValue - leftValue).toFixed(1)}{unit}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="h-[80px] bg-card border-b-4 border-primary px-8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="min-w-[60px] min-h-[60px] rounded-full bg-primary flex items-center justify-center">
            <Columns2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xl)' }}>
              Split View - Head-to-Head Project Comparison
            </h2>
            <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
              Side-by-side variance analysis across all performance metrics
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="min-w-[60px] min-h-[60px] rounded-full bg-destructive/10 hover:bg-destructive/20 transition-colors flex items-center justify-center"
          title="Close Split View"
        >
          <X className="w-6 h-6 text-destructive" />
        </button>
      </div>

      {/* Project Selectors */}
      <div className="bg-muted/50 border-b-2 border-border px-8 py-6">
        <div className="grid grid-cols-2 gap-8 max-w-[1400px] mx-auto">
          {/* Left Project Selector */}
          <div>
            <label className="block mb-3 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
              Project A
            </label>
            <div className="relative">
              <select
                value={selectedLeftId}
                onChange={(e) => setSelectedLeftId(e.target.value)}
                className="w-full min-h-[60px] px-6 py-3 bg-background border-2 border-border rounded-[var(--radius-button)] font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground appearance-none cursor-pointer hover:border-primary transition-colors"
                style={{ fontSize: 'var(--text-base)' }}
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
            {leftProject && (
              <div className="mt-3 p-3 bg-background rounded-[var(--radius-button)] border border-border">
                <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                  {leftProject.location} • {leftProject.completedDate}
                </p>
              </div>
            )}
          </div>

          {/* Right Project Selector */}
          <div>
            <label className="block mb-3 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
              Project B
            </label>
            <div className="relative">
              <select
                value={selectedRightId}
                onChange={(e) => setSelectedRightId(e.target.value)}
                className="w-full min-h-[60px] px-6 py-3 bg-background border-2 border-border rounded-[var(--radius-button)] font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground appearance-none cursor-pointer hover:border-primary transition-colors"
                style={{ fontSize: 'var(--text-base)' }}
              >
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            </div>
            {rightProject && (
              <div className="mt-3 p-3 bg-background rounded-[var(--radius-button)] border border-border">
                <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                  {rightProject.location} • {rightProject.completedDate}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-[1400px] mx-auto space-y-8">
          {/* Project Headers */}
          <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
            {/* Left Project Header */}
            <div className="bg-card rounded-[var(--radius-card)] border-2 border-primary p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                  {leftProject.name}
                </h3>
              </div>
              <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                {leftProject.location}
              </p>
              <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                Completed: {leftProject.completedDate}
              </p>
            </div>

            <div className="flex items-center justify-center px-6">
              <div className="w-px h-full bg-border"></div>
            </div>

            {/* Right Project Header */}
            <div className="bg-card rounded-[var(--radius-card)] border-2 border-primary p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                  {rightProject.name}
                </h3>
              </div>
              <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                {rightProject.location}
              </p>
              <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                Completed: {rightProject.completedDate}
              </p>
            </div>
          </div>

          {/* Financial Performance Section */}
          <div className="bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden">
            <div className="bg-muted px-6 py-4 border-b-2 border-border">
              <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                Financial Performance
              </h4>
            </div>
            <div className="p-6">
              {renderComparisonRow(
                'Actual Profit Margin',
                leftProject.actualProfit,
                rightProject.actualProfit,
                '%',
                true,
                <DollarSign className="w-5 h-5 text-color-success" />
              )}
              {renderComparisonRow(
                'Profit vs Target',
                leftProject.actualProfit - leftProject.estimatedProfit,
                rightProject.actualProfit - rightProject.estimatedProfit,
                '%',
                true,
                <Target className="w-5 h-5 text-primary" />
              )}
            </div>
          </div>

          {/* Execution Performance Section */}
          <div className="bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden">
            <div className="bg-muted px-6 py-4 border-b-2 border-border">
              <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                Execution & Plan Adherence
              </h4>
            </div>
            <div className="p-6">
              {renderComparisonRow(
                'Plan Adherence',
                leftProject.planAdherence,
                rightProject.planAdherence,
                '%',
                true,
                <CheckCircle className="w-5 h-5 text-color-success" />
              )}
            </div>
          </div>

          {/* Cost Volatility Section */}
          <div className="bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden">
            <div className="bg-muted px-6 py-4 border-b-2 border-border">
              <div className="flex items-center justify-between">
                <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                  Cost Volatility Analysis
                </h4>
                <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                  Lower is better (Coefficient of Variation)
                </span>
              </div>
            </div>
            <div className="p-6">
              {renderComparisonRow(
                'Labor Cost Variability',
                leftProject.laborVariability * 100,
                rightProject.laborVariability * 100,
                '% CV',
                false,
                <Activity className="w-5 h-5 text-foreground" />
              )}
              {renderComparisonRow(
                'Fuel Price Variability',
                leftProject.fuelVariability * 100,
                rightProject.fuelVariability * 100,
                '% CV',
                false,
                <Zap className="w-5 h-5 text-foreground" />
              )}
              {renderComparisonRow(
                'Machine Wear Variability',
                leftProject.machineWearVariability * 100,
                rightProject.machineWearVariability * 100,
                '% CV',
                false,
                <Flame className="w-5 h-5 text-destructive" />
              )}
            </div>
          </div>

          {/* Environmental Conditions Section */}
          <div className="bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden">
            <div className="bg-muted px-6 py-4 border-b-2 border-border">
              <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                Environmental Conditions
              </h4>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-[1fr_auto_1fr] gap-4">
                {/* Left Environment */}
                <div className="p-6 bg-muted rounded-[var(--radius-button)]">
                  <div className="text-center mb-3">
                    <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-3xl)' }}>
                      {leftProject.environmentalDifficulty}%
                    </div>
                    <div className="text-muted-foreground font-[family-name:var(--font-family)] mt-1" style={{ fontSize: 'var(--text-xs)' }}>
                      Difficulty Rating
                    </div>
                  </div>
                  <div className="text-center px-3 py-2 bg-background rounded-full">
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                      {getEnvironmentLabel(leftProject.environmentalDifficulty)}
                    </span>
                  </div>
                </div>

                {/* Center Label */}
                <div className="flex items-center justify-center min-w-[200px]">
                  <div className="text-center font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                    Site Difficulty
                  </div>
                </div>

                {/* Right Environment */}
                <div className="p-6 bg-muted rounded-[var(--radius-button)]">
                  <div className="text-center mb-3">
                    <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-3xl)' }}>
                      {rightProject.environmentalDifficulty}%
                    </div>
                    <div className="text-muted-foreground font-[family-name:var(--font-family)] mt-1" style={{ fontSize: 'var(--text-xs)' }}>
                      Difficulty Rating
                    </div>
                  </div>
                  <div className="text-center px-3 py-2 bg-background rounded-full">
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                      {getEnvironmentLabel(rightProject.environmentalDifficulty)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Environmental Context */}
              {Math.abs(leftProject.environmentalDifficulty - rightProject.environmentalDifficulty) > 20 && (
                <div className="mt-6 p-4 bg-primary/10 rounded-[var(--radius-button)] border border-primary">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                      <span className="font-[var(--font-weight-semibold)]">Environmental Difference Alert:</span> These projects faced significantly different site conditions 
                      ({Math.abs(leftProject.environmentalDifficulty - rightProject.environmentalDifficulty)}% variance). 
                      Consider normalizing metrics when comparing execution quality.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Winner Summary */}
          <div className="bg-gradient-to-r from-color-success/10 to-color-success/5 rounded-[var(--radius-card)] border-2 border-color-success p-6">
            <div className="flex items-start gap-4">
              <Target className="w-8 h-8 text-color-success flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-3" style={{ fontSize: 'var(--text-lg)' }}>
                  Comparative Summary
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                      {leftProject.name}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {leftProject.actualProfit > rightProject.actualProfit && (
                        <span className="px-3 py-1.5 bg-color-success/20 text-color-success rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-xs)' }}>
                          Higher Profit
                        </span>
                      )}
                      {leftProject.planAdherence > rightProject.planAdherence && (
                        <span className="px-3 py-1.5 bg-color-success/20 text-color-success rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-xs)' }}>
                          Better Adherence
                        </span>
                      )}
                      {leftProject.laborVariability < rightProject.laborVariability && (
                        <span className="px-3 py-1.5 bg-color-success/20 text-color-success rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-xs)' }}>
                          Lower Labor Volatility
                        </span>
                      )}
                      {leftProject.machineWearVariability < rightProject.machineWearVariability && (
                        <span className="px-3 py-1.5 bg-color-success/20 text-color-success rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-xs)' }}>
                          Lower Wear Volatility
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                      {rightProject.name}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {rightProject.actualProfit > leftProject.actualProfit && (
                        <span className="px-3 py-1.5 bg-color-success/20 text-color-success rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-xs)' }}>
                          Higher Profit
                        </span>
                      )}
                      {rightProject.planAdherence > leftProject.planAdherence && (
                        <span className="px-3 py-1.5 bg-color-success/20 text-color-success rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-xs)' }}>
                          Better Adherence
                        </span>
                      )}
                      {rightProject.laborVariability < leftProject.laborVariability && (
                        <span className="px-3 py-1.5 bg-color-success/20 text-color-success rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-xs)' }}>
                          Lower Labor Volatility
                        </span>
                      )}
                      {rightProject.machineWearVariability < leftProject.machineWearVariability && (
                        <span className="px-3 py-1.5 bg-color-success/20 text-color-success rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-xs)' }}>
                          Lower Wear Volatility
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
