import { TrendingUp, AlertTriangle, Brain, ChevronRight } from 'lucide-react';

interface PredictiveAlert {
  id: string;
  type: 'behavioral' | 'environmental' | 'maintenance';
  title: string;
  description: string;
  riskScore: number;
  likelihood: 'low' | 'medium' | 'high';
  recommendation: string;
}

const mockPredictiveAlerts: PredictiveAlert[] = [
  {
    id: '1',
    type: 'behavioral',
    title: 'Increased Speed Variance Detected',
    description: 'Asset showing 23% more speed fluctuation vs. baseline - may indicate operator fatigue or terrain difficulty',
    riskScore: 72,
    likelihood: 'medium',
    recommendation: 'Consider operator rotation within next 2 hours',
  },
  {
    id: '2',
    type: 'environmental',
    title: 'Proximity Event Pattern',
    description: 'Zone C showing 3x normal foot traffic during afternoon hours - elevated near-miss probability',
    riskScore: 85,
    likelihood: 'high',
    recommendation: 'Deploy traffic marshal or adjust work schedule',
  },
];

export function PredictiveAlerts() {
  const getLikelihoodColor = (likelihood: string) => {
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
      <div className="px-6 py-4 bg-muted border-b border-border">
        <div className="flex items-center gap-3">
          <Brain className="w-5 h-5 text-foreground" />
          <h3 className="text-foreground">Predictive Risk Modeling</h3>
          <div className="px-3 py-1 bg-foreground/10 rounded-full">
            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
              AI-Powered
            </span>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="p-6 space-y-4">
        {mockPredictiveAlerts.length === 0 ? (
          <div className="text-center py-8">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-base)' }}>
              No predictive alerts at this time
            </p>
          </div>
        ) : (
          mockPredictiveAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-muted/30 rounded-[var(--radius-card)] border-2 border-border overflow-hidden"
            >
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: getLikelihoodColor(alert.likelihood) }}
                  >
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-foreground">{alert.title}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                          Risk Score
                        </span>
                        <div className="px-3 py-1 bg-foreground/10 rounded-full">
                          <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                            {alert.riskScore}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-3" style={{ fontSize: 'var(--text-sm)' }}>
                      {alert.description}
                    </p>

                    {/* Likelihood bar */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                          Likelihood
                        </span>
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-xs)' }}>
                          {alert.likelihood.toUpperCase()}
                        </span>
                      </div>
                      <div className="h-2 bg-border rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${alert.riskScore}%`,
                            backgroundColor: getLikelihoodColor(alert.likelihood)
                          }}
                        ></div>
                      </div>
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

                {/* Action Button */}
                <button className="
                  w-full min-h-[60px] mt-3 px-4 py-3 rounded-[var(--radius-button)]
                  bg-foreground text-white hover:opacity-90 transition-opacity
                  font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]
                  flex items-center justify-center gap-2
                " style={{ fontSize: 'var(--text-base)' }}>
                  Take Action
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Footer */}
      <div className="px-6 py-3 bg-muted border-t border-border">
        <p className="text-muted-foreground font-[family-name:var(--font-family)] text-center" style={{ fontSize: 'var(--text-xs)' }}>
          Predictions based on historical patterns, real-time data, and site-wide trends
        </p>
      </div>
    </div>
  );
}
