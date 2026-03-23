import { TrendingUp, Brain, ChevronRight, Wrench, Target, Clock, DollarSign, AlertTriangle } from 'lucide-react';

interface PlanningAlert {
  id: string;
  type: 'plan' | 'maintenance' | 'cost' | 'schedule';
  title: string;
  description: string;
  confidenceScore: number;
  likelihood: 'low' | 'medium' | 'high';
  recommendation: string;
  timeframe: string;
}

const icons = {
  plan: Target,
  maintenance: Wrench,
  cost: DollarSign,
  schedule: Clock,
};

const mockPlanningAlerts: PlanningAlert[] = [
  {
    id: '1',
    type: 'schedule',
    title: 'Daily Volume Target at Risk',
    description: 'Current production velocity of 127.5 yd³/hr projects to reach only 1,020 yd³ by shift end — 15% below the 1,200 yd³ daily target.',
    confidenceScore: 81,
    likelihood: 'high',
    recommendation: 'Extend operating hours by 1.5 hrs or reassign to a higher-density cut zone to close the gap.',
    timeframe: 'Next 4 hours',
  },
  {
    id: '2',
    type: 'maintenance',
    title: 'Hydraulic Filter Replacement Due',
    description: 'Based on operating hours (824 hrs) and fluid pressure telemetry trends, hydraulic filter replacement is projected to be needed within 2 shifts.',
    confidenceScore: 77,
    likelihood: 'high',
    recommendation: 'Schedule filter replacement during the next planned idle window to prevent unplanned downtime.',
    timeframe: '2–3 shifts',
  },
  {
    id: '3',
    type: 'cost',
    title: 'Fuel Efficiency Below Benchmark',
    description: 'Fuel consumption is 9.2% above the rolling 7-day average. Idle time during material wait accounts for an estimated $340 in excess daily fuel cost.',
    confidenceScore: 68,
    likelihood: 'medium',
    recommendation: 'Coordinate loader dispatch timing to reduce idle gaps. Consider engine auto-idle tuning.',
    timeframe: 'Ongoing',
  },
  {
    id: '4',
    type: 'plan',
    title: 'Grade Conformance Trend Degrading',
    description: 'GNSS telemetry shows a 4.7% average grade deviation in Section B over the last 3 passes — indicating blade wear or GPS drift requiring calibration.',
    confidenceScore: 73,
    likelihood: 'medium',
    recommendation: 'Run a CAD alignment check and inspect cutting edge. Calibration event should be logged in maintenance record.',
    timeframe: 'Before next shift',
  },
];

export function PredictivePlanningAlerts() {
  const getTypeColor = (likelihood: string) => {
    switch (likelihood) {
      case 'high': return 'var(--foreground)';
      case 'medium': return 'var(--muted-foreground)';
      case 'low': return 'var(--border)';
      default: return 'var(--border)';
    }
  };

  return (
    <div className="bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
      {/* Header */}
      <div className="px-6 py-4 bg-muted border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-foreground" />
          <h3 className="text-foreground">Predictive Risk Modeling</h3>
          <div className="px-3 py-1 bg-foreground/10 rounded-full">
            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
              AI-Powered
            </span>
          </div>
        </div>
        <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
          {mockPlanningAlerts.length} active predictions
        </span>
      </div>

      {/* Alerts List */}
      <div className="p-6 space-y-4">
        {mockPlanningAlerts.map((alert) => {
          const Icon = icons[alert.type];
          return (
            <div
              key={alert.id}
              className="bg-muted/30 rounded-[var(--radius-card)] border-2 border-border overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: getTypeColor(alert.likelihood) }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-foreground">{alert.title}</h4>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                          Confidence
                        </span>
                        <div className="px-3 py-1 bg-foreground/10 rounded-full">
                          <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                            {alert.confidenceScore}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4" style={{ fontSize: 'var(--text-sm)' }}>
                      {alert.description}
                    </p>

                    {/* Timeframe + Likelihood */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                          {alert.timeframe}
                        </span>
                      </div>
                      <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${alert.confidenceScore}%`,
                            backgroundColor: getTypeColor(alert.likelihood),
                          }}
                        />
                      </div>
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground uppercase" style={{ fontSize: 'var(--text-xs)' }}>
                        {alert.likelihood}
                      </span>
                    </div>

                    {/* Recommendation */}
                    <div className="p-3 bg-card rounded-[var(--radius-button)] border border-border">
                      <div className="flex items-start gap-2">
                        <Brain className="w-4 h-4 text-foreground flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-muted-foreground mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                            Recommended Action
                          </p>
                          <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                            {alert.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="
                  w-full min-h-[52px] mt-2 px-4 py-3 rounded-[var(--radius-button)]
                  bg-foreground text-white hover:opacity-90 transition-opacity
                  font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]
                  flex items-center justify-center gap-2
                " style={{ fontSize: 'var(--text-base)' }}>
                  Review & Assign
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-muted border-t border-border">
        <p className="text-muted-foreground font-[family-name:var(--font-family)] text-center" style={{ fontSize: 'var(--text-xs)' }}>
          Predictions derived from equipment telemetry, schedule tracking, and historical maintenance patterns
        </p>
      </div>
    </div>
  );
}
