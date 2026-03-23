import { X, AlertTriangle, MessageSquare, Radio, CheckCircle2, Clock, Video, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { MaintenanceAlerts } from './MaintenanceAlerts';

export interface Alert {
  id: string;
  timestamp: Date;
  title: string;
  description: string;
  riskLevel: 'critical' | 'warning' | 'info';
  videoSnippet?: string;
  acknowledged: boolean;
  isSignOff?: boolean;
}

interface AlertsDrawerProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
  onAddNote: (id: string, note: string) => void;
  onRadioOperator: (id: string) => void;
  onOpenSafetyEscalation?: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function AlertsDrawer({ 
  alerts, 
  onAcknowledge, 
  onAddNote, 
  onRadioOperator,
  onOpenSafetyEscalation,
  isCollapsed,
  onToggle
}: AlertsDrawerProps) {
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});
  const [expandedAlertId, setExpandedAlertId] = useState<string | null>(null);

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'critical': return 'var(--foreground)';
      case 'warning': return 'var(--muted-foreground)';
      case 'info': return 'var(--border)';
      default: return 'var(--border)';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="relative flex flex-col h-full overflow-hidden">
      {/* Collapse Toggle Button */}
      <button
        onClick={onToggle}
        className={`
          absolute -left-3 top-6 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center
          text-muted-foreground hover:text-foreground shadow-sm z-50 transition-all duration-300
          ${isCollapsed ? 'rotate-180' : 'rotate-0'}
        `}
        title={isCollapsed ? "Expand Alerts" : "Collapse Alerts"}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Header */}
      <div className={`
        px-6 py-4 bg-muted border-b-2 border-border flex items-center flex-shrink-0 transition-all duration-300
        ${isCollapsed ? 'justify-center px-0' : 'justify-between'}
      `}>
        <div className="flex items-center gap-3">
          <AlertTriangle className={`w-5 h-5 text-foreground shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
          {!isCollapsed && <h3 className="text-foreground whitespace-nowrap">Active Alerts</h3>}
          {(unacknowledgedCount > 0 && !isCollapsed) && (
            <div className="px-3 py-1 bg-foreground text-white rounded-full">
              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-sm)' }}>
                {unacknowledgedCount}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Collapsed Indicator (Active Count) */}
      {isCollapsed && unacknowledgedCount > 0 && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 mt-2">
          <div className="w-8 h-8 bg-foreground text-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <span className="font-bold text-xs">{unacknowledgedCount}</span>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className={`
        flex-1 overflow-y-auto p-6 space-y-4 transition-all duration-300
        ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}
      `}>
        {!isCollapsed && (
          <div className="mb-6 pb-6 border-b-2 border-border/50">
            <MaintenanceAlerts />
          </div>
        )}

        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <CheckCircle2 className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-base)' }}>
              No active alerts
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`
                bg-muted/30 rounded-[var(--radius-card)] border-2 overflow-hidden
                ${!alert.acknowledged ? 'border-foreground' : 'border-border'}
              `}
            >
              {/* Alert Header */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: getRiskLevelColor(alert.riskLevel) }}
                  >
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-foreground mb-1">{alert.title}</h4>
                    <p className="text-muted-foreground mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                      {alert.description}
                    </p>
                    <div className="flex items-center gap-4 text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span className="font-[family-name:var(--font-family)]">
                          {formatTimeAgo(alert.timestamp)}
                        </span>
                      </div>
                      <div className="px-3 py-1 rounded-full" style={{ backgroundColor: getRiskLevelColor(alert.riskLevel) }}>
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-white" style={{ fontSize: 'var(--text-xs)' }}>
                          {alert.riskLevel.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Snippet */}
                {alert.videoSnippet && (
                  <div className="mb-3 rounded-[var(--radius-card)] overflow-hidden border-2 border-border bg-[#1a1a1a]">
                    <div className="aspect-video relative flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]"></div>
                      <Video className="w-12 h-12 text-white/50 z-10" />
                      <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 rounded" style={{ fontSize: 'var(--text-xs)' }}>
                        <span className="font-[family-name:var(--font-family)] text-white">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                {!alert.acknowledged && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onAcknowledge(alert.id)}
                        className="
                          min-w-[60px] min-h-[60px] flex items-center justify-center gap-2
                          px-4 py-3 rounded-[var(--radius-button)]
                          bg-foreground text-white hover:opacity-90 transition-opacity
                          font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]
                        "
                        style={{ fontSize: 'var(--text-base)' }}
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Acknowledge
                      </button>
                      {alert.isSignOff ? (
                        <button
                          onClick={onOpenSafetyEscalation}
                          className="
                            min-w-[60px] min-h-[60px] flex flex-col items-center justify-center gap-1
                            px-4 py-3 rounded-[var(--radius-button)]
                            bg-destructive text-white hover:opacity-90 transition-opacity
                            font-[family-name:var(--font-family)] font-bold
                            border-2 border-destructive shadow-lg animate-pulse-subtle
                          "
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-sm uppercase tracking-tighter">Digital Sign Off</span>
                          </div>
                          <span className="text-[10px] opacity-80 uppercase font-black">PENDING</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onRadioOperator(alert.id)}
                          className="
                            min-w-[60px] min-h-[60px] flex items-center justify-center gap-2
                            px-4 py-3 rounded-[var(--radius-button)]
                            border-2 border-border hover:bg-accent transition-colors
                            font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]
                          "
                          style={{ fontSize: 'var(--text-base)' }}
                        >
                          <Radio className="w-5 h-5" />
                          Radio
                        </button>
                      )}
                    </div>

                    {/* Add Note Section */}
                    <div>
                      <button
                        onClick={() => setExpandedAlertId(expandedAlertId === alert.id ? null : alert.id)}
                        className="
                          w-full min-h-[60px] flex items-center justify-center gap-2
                          px-4 py-3 rounded-[var(--radius-button)]
                          border-2 border-border hover:bg-accent transition-colors
                          font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]
                        "
                        style={{ fontSize: 'var(--text-base)' }}
                      >
                        <MessageSquare className="w-5 h-5" />
                        {expandedAlertId === alert.id ? 'Hide Note' : 'Add Note'}
                      </button>

                      {expandedAlertId === alert.id && (
                        <div className="mt-2 space-y-2">
                          <textarea
                            value={noteInputs[alert.id] || ''}
                            onChange={(e) => setNoteInputs({ ...noteInputs, [alert.id]: e.target.value })}
                            placeholder="Add contextual notes about this event..."
                            className="
                              w-full min-h-[120px] px-4 py-3 rounded-[var(--radius-button)]
                              bg-card border-2 border-border
                              font-[family-name:var(--font-family)] text-foreground
                              focus:outline-none focus:border-foreground
                              resize-none
                            "
                            style={{ fontSize: 'var(--text-base)' }}
                          />
                          <button
                            onClick={() => {
                              if (noteInputs[alert.id]?.trim()) {
                                onAddNote(alert.id, noteInputs[alert.id]);
                                setNoteInputs({ ...noteInputs, [alert.id]: '' });
                                setExpandedAlertId(null);
                              }
                            }}
                            className="
                              w-full min-h-[60px] px-4 py-3 rounded-[var(--radius-button)]
                              bg-foreground text-white hover:opacity-90 transition-opacity
                              font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]
                            "
                            style={{ fontSize: 'var(--text-base)' }}
                          >
                            Save Note
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {alert.acknowledged && (
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted rounded-[var(--radius-button)]">
                    <CheckCircle2 className="w-5 h-5 text-foreground" />
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                      Acknowledged
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}