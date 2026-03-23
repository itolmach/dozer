import { Activity, TrendingUp, Clock } from 'lucide-react';

interface CostCode {
  code: string;
  name: string;
  activeTime: number; // minutes
  idleTime: number; // minutes
  intensity: number; // 0-100 for grayscale intensity
}

const mockCostCodes: CostCode[] = [
  {
    code: 'CC-2401',
    name: 'Excavation - North Zone',
    activeTime: 285,
    idleTime: 35,
    intensity: 90,
  },
  {
    code: 'CC-2402',
    name: 'Grading - Foundation Prep',
    activeTime: 145,
    idleTime: 15,
    intensity: 70,
  },
  {
    code: 'CC-2403',
    name: 'Material Transport',
    activeTime: 95,
    idleTime: 25,
    intensity: 50,
  },
];

export function ProductionMetrics() {
  const totalActive = mockCostCodes.reduce((sum, cc) => sum + cc.activeTime, 0);
  const totalIdle = mockCostCodes.reduce((sum, cc) => sum + cc.idleTime, 0);
  const totalTime = totalActive + totalIdle;
  const efficiency = Math.round((totalActive / totalTime) * 100);

  const formatMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
      {/* Header */}
      <div className="px-6 py-4 bg-muted border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-foreground" />
          <h3 className="text-foreground">Production Metrics - Today</h3>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-foreground/10 rounded-full">
          <TrendingUp className="w-4 h-4 text-foreground" />
          <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
            {efficiency}%
          </span>
          <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
            Efficiency
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="p-6 grid grid-cols-3 gap-4 border-b border-border bg-muted/30">
        <div className="bg-card p-4 rounded-[var(--radius-card)] border border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-foreground"></div>
            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
              Active Time
            </span>
          </div>
          <p className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
            {formatMinutes(totalActive)}
          </p>
        </div>

        <div className="bg-card p-4 rounded-[var(--radius-card)] border border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
              Idle Time
            </span>
          </div>
          <p className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
            {formatMinutes(totalIdle)}
          </p>
        </div>

        <div className="bg-card p-4 rounded-[var(--radius-card)] border border-border">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
              Total Time
            </span>
          </div>
          <p className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
            {formatMinutes(totalTime)}
          </p>
        </div>
      </div>

      {/* Cost Code Breakdown */}
      <div className="p-6 space-y-6">
        {mockCostCodes.map((costCode, index) => {
          const total = costCode.activeTime + costCode.idleTime;
          const activePercent = (costCode.activeTime / total) * 100;
          const idlePercent = (costCode.idleTime / total) * 100;
          const barColor = `rgba(2, 6, 23, ${costCode.intensity / 100})`;

          return (
            <div key={costCode.code} className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                      {costCode.code}
                    </span>
                    <span className="px-3 py-1 bg-muted rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                      {formatMinutes(total)}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-1">{costCode.name}</p>
                </div>
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                  {Math.round(activePercent)}%
                </span>
              </div>

              {/* Progress bars */}
              <div className="space-y-2">
                {/* Active time bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                      Active Digging Time
                    </span>
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                      {formatMinutes(costCode.activeTime)}
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
                    <div 
                      className="h-full transition-all duration-500 rounded-full"
                      style={{ 
                        width: `${activePercent}%`,
                        backgroundColor: barColor,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Idle time bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                      Idle Time
                    </span>
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                      {formatMinutes(costCode.idleTime)}
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden border border-border">
                    <div 
                      className="h-full bg-muted-foreground transition-all duration-500 rounded-full"
                      style={{ width: `${idlePercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}