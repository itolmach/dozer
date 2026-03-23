import { useState } from 'react';
import { 
  Info, 
  AlertOctagon, 
  Droplet, 
  Wrench, 
  Activity, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  DollarSign
} from 'lucide-react';

export interface MaintenanceAlert {
  id: string;
  type: 'INFORMATION' | 'STOP_WORK';
  category: 'PREDICTED_MAINTENANCE' | 'REACTIVE_FAILURE';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  icon: 'oil' | 'hydraulic' | 'tire' | 'engine' | 'generic';
  details: {
    metric?: string;
    threshold?: string;
    currentValue?: string;
    dueDate?: string;
    estimatedCost?: string;
    failureMode?: string;
    immediateAction?: string;
  };
  expandable: boolean;
  dismissible: boolean;
}

const mockAlerts: MaintenanceAlert[] = [
  {
    id: 'ALERT-001',
    type: 'STOP_WORK',
    category: 'REACTIVE_FAILURE',
    title: 'HYDRAULIC SYSTEM FAILURE',
    description: 'Critical pressure loss detected in main hydraulic circuit',
    severity: 'critical',
    icon: 'hydraulic',
    details: {
      currentValue: '850 PSI (Normal: 3000 PSI)',
      failureMode: 'Probable seal rupture or line breach',
      immediateAction: 'Asset immobilized. Dispatch field technician immediately.',
      estimatedCost: '$2,400 repair + $8,500 downtime'
    },
    expandable: false,
    dismissible: false
  },
  {
    id: 'ALERT-002',
    type: 'INFORMATION',
    category: 'PREDICTED_MAINTENANCE',
    title: 'Oil Change Due Soon',
    description: 'Engine oil degradation predicted based on burn-rate analysis',
    severity: 'warning',
    icon: 'oil',
    details: {
      metric: 'Oil Life Remaining',
      threshold: '10%',
      currentValue: '12%',
      dueDate: 'March 22, 2026 (2 days)',
      estimatedCost: '$450'
    },
    expandable: true,
    dismissible: true
  },
  {
    id: 'ALERT-003',
    type: 'INFORMATION',
    category: 'PREDICTED_MAINTENANCE',
    title: 'Tire Pressure Trending Low',
    description: 'Front-left tire showing gradual pressure decline',
    severity: 'info',
    icon: 'tire',
    details: {
      metric: 'Tire Pressure',
      threshold: '95 PSI',
      currentValue: '98 PSI',
      dueDate: 'Inspect within 48 hours',
      estimatedCost: '$120 (if repair needed)'
    },
    expandable: true,
    dismissible: true
  }
];

export function MaintenanceAlerts() {
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());

  const toggleAlert = (alertId: string) => {
    setExpandedAlerts(prev => {
      const next = new Set(prev);
      if (next.has(alertId)) {
        next.delete(alertId);
      } else {
        next.add(alertId);
      }
      return next;
    });
  };

  const getAlertIcon = (icon: string) => {
    switch (icon) {
      case 'oil':
        return <Droplet className="w-6 h-6" />;
      case 'hydraulic':
        return <AlertOctagon className="w-6 h-6" />;
      case 'tire':
        return <Activity className="w-6 h-6" />;
      case 'engine':
        return <Wrench className="w-6 h-6" />;
      default:
        return <Info className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Info className="w-5 h-5 text-foreground" />
        <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
          Maintenance & Alerts
        </h4>
      </div>

      {mockAlerts.map(alert => (
        <div key={alert.id}>
          {/* STOP-WORK Alert (Non-dismissible, High-priority) */}
          {alert.type === 'STOP_WORK' && (
            <div className="bg-destructive/10 rounded-[var(--radius-card)] border-4 border-destructive p-6 shadow-[var(--elevation-md)]">
              <div className="flex items-start gap-4">
                <div className="min-w-[60px] min-h-[60px] rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                  <div className="text-destructive">
                    {getAlertIcon(alert.icon)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h5 className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-destructive" style={{ fontSize: 'var(--text-xl)' }}>
                          {alert.title}
                        </h5>
                        <div className="px-3 py-1 bg-destructive rounded-full">
                          <span className="text-white font-[family-name:var(--font-family)] font-[var(--font-weight-bold)]" style={{ fontSize: 'var(--text-xs)' }}>
                            STOP WORK
                          </span>
                        </div>
                      </div>
                      <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                        {alert.description}
                      </p>
                    </div>
                  </div>

                  {/* Critical Details - Always Visible */}
                  <div className="space-y-3 mt-4 p-4 bg-background rounded-[var(--radius-card)] border-2 border-destructive">
                    {alert.details.currentValue && (
                      <div>
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                          Current Status
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-lg)' }}>
                          {alert.details.currentValue}
                        </div>
                      </div>
                    )}
                    {alert.details.failureMode && (
                      <div>
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                          Failure Mode
                        </div>
                        <div className="font-[family-name:var(--font-family)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                          {alert.details.failureMode}
                        </div>
                      </div>
                    )}
                    {alert.details.immediateAction && (
                      <div className="p-3 bg-destructive/10 rounded-[var(--radius-button)] border-2 border-destructive">
                        <div className="text-destructive font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                          IMMEDIATE ACTION REQUIRED
                        </div>
                        <div className="font-[family-name:var(--font-family)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                          {alert.details.immediateAction}
                        </div>
                      </div>
                    )}
                    {alert.details.estimatedCost && (
                      <div>
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                          Estimated Impact
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                          {alert.details.estimatedCost}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* INFORMATION Alert (Expandable, Dismissible) */}
          {alert.type === 'INFORMATION' && (
            <div className={`rounded-[var(--radius-card)] border-2 transition-all ${
              alert.severity === 'warning'
                ? 'bg-color-warning/10 border-color-warning'
                : 'bg-muted/50 border-border'
            }`}>
              {/* Collapsed View */}
              <button
                onClick={() => alert.expandable && toggleAlert(alert.id)}
                className="w-full p-4 flex items-center justify-between hover:opacity-80 transition-opacity"
              >
                <div className="flex items-center gap-4">
                  <div className={`min-w-[50px] min-h-[50px] rounded-full flex items-center justify-center ${
                    alert.severity === 'warning'
                      ? 'bg-color-warning/20 text-color-warning'
                      : 'bg-muted text-foreground'
                  }`}>
                    {getAlertIcon(alert.icon)}
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                        alert.severity === 'warning' ? 'text-color-warning' : 'text-foreground'
                      }`} style={{ fontSize: 'var(--text-base)' }}>
                        {alert.title}
                      </h5>
                      {alert.severity === 'warning' && (
                        <div className="px-2 py-1 bg-color-warning/20 rounded-full">
                          <span className="text-color-warning font-[family-name:var(--font-family)] font-[var(--font-weight-bold)]" style={{ fontSize: 'var(--text-xs)' }}>
                            ATTENTION
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                      {alert.description}
                    </p>
                  </div>
                </div>
                {alert.expandable && (
                  <div className="flex items-center gap-3">
                    {alert.details.dueDate && !expandedAlerts.has(alert.id) && (
                      <div className="text-right mr-4">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                          Due
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                          {alert.details.dueDate}
                        </div>
                      </div>
                    )}
                    <div className="min-w-[50px] min-h-[50px] rounded-full bg-muted flex items-center justify-center">
                      {expandedAlerts.has(alert.id) ? (
                        <ChevronUp className="w-5 h-5 text-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-foreground" />
                      )}
                    </div>
                  </div>
                )}
              </button>

              {/* Expanded View */}
              {expandedAlerts.has(alert.id) && (
                <div className="px-4 pb-4 border-t-2 border-border pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    {alert.details.metric && (
                      <div className="p-4 bg-background rounded-[var(--radius-card)] border-2 border-border">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                          {alert.details.metric}
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xl)' }}>
                          {alert.details.currentValue}
                        </div>
                        {alert.details.threshold && (
                          <div className="text-muted-foreground font-[family-name:var(--font-family)] mt-1" style={{ fontSize: 'var(--text-xs)' }}>
                            Threshold: {alert.details.threshold}
                          </div>
                        )}
                      </div>
                    )}
                    {alert.details.dueDate && (
                      <div className="p-4 bg-background rounded-[var(--radius-card)] border-2 border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                            Due Date
                          </div>
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                          {alert.details.dueDate}
                        </div>
                      </div>
                    )}
                    {alert.details.estimatedCost && (
                      <div className="p-4 bg-background rounded-[var(--radius-card)] border-2 border-border col-span-2">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <div className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                            Estimated Cost
                          </div>
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xl)' }}>
                          {alert.details.estimatedCost}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <button className="flex-1 min-h-[60px] px-6 rounded-[var(--radius-button)] bg-foreground text-background hover:opacity-90 transition-opacity">
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                        Schedule Maintenance
                      </span>
                    </button>
                    {alert.dismissible && (
                      <button className="min-h-[60px] px-6 rounded-[var(--radius-button)] bg-muted text-foreground hover:opacity-90 transition-opacity">
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                          Dismiss
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
