import { AlertTriangle, ChevronDown, ChevronUp, MoreVertical, TrendingUp } from 'lucide-react';
import { useState } from 'react';

interface SafetyEvent {
  id: string;
  eventNumber: string;
  timestamp: Date;
  type: 'proximity' | 'speed' | 'boundary';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  status: 'unresolved' | 'investigating' | 'resolved';
  acknowledged: boolean;
  details?: {
    location: string;
    asset: string;
    distance?: string;
    speed?: string;
  }[];
}

const mockEvents: SafetyEvent[] = [
  {
    id: '1',
    eventNumber: '52561',
    timestamp: new Date(Date.now() - 1000 * 60 * 12),
    type: 'proximity',
    severity: 'critical',
    title: 'Human Proximity Alert',
    status: 'unresolved',
    acknowledged: false,
    details: [
      { location: 'Zone A', asset: 'BD-001', distance: '15ft' },
      { location: 'Zone B', asset: 'EX-042', distance: '22ft' },
      { location: 'Zone C', asset: 'DT-128', distance: '8ft' },
    ],
  },
  {
    id: '2',
    eventNumber: '98645',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    type: 'speed',
    severity: 'warning',
    title: 'Speed Threshold Exceeded',
    status: 'investigating',
    acknowledged: false,
    details: [
      { location: 'Main Road', asset: 'HD-205', speed: '8.2 MPH' },
      { location: 'Access Road', asset: 'LD-101', speed: '9.1 MPH' },
    ],
  },
  {
    id: '3',
    eventNumber: '57215',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    type: 'proximity',
    severity: 'critical',
    title: 'Near-Miss Event',
    status: 'resolved',
    acknowledged: true,
  },
  {
    id: '4',
    eventNumber: '28941',
    timestamp: new Date(Date.now() - 1000 * 60 * 180),
    type: 'boundary',
    severity: 'warning',
    title: 'Geo-Fence Boundary',
    status: 'resolved',
    acknowledged: true,
  },
];

export function SafetyEventsFeed() {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unresolved' | 'investigating' | 'resolved'>('all');

  const toggleExpanded = (id: string) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unresolved': return 'var(--foreground)';
      case 'investigating': return 'var(--muted-foreground)';
      case 'resolved': return 'var(--border)';
      default: return 'var(--border)';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'unresolved': return 'Unresolved';
      case 'investigating': return 'Investigating';
      case 'resolved': return 'Resolved';
      default: return status;
    }
  };

  const filteredEvents = activeFilter === 'all' 
    ? mockEvents 
    : mockEvents.filter(e => e.status === activeFilter);

  return (
    <div className="bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)] flex flex-col h-full">
      {/* Filter tabs */}
      <div className="px-6 py-3 bg-muted border-b border-border flex items-center gap-1">
        <button
          onClick={() => setActiveFilter('all')}
          className={`
            px-4 py-2 rounded-[var(--radius-button)] min-h-[44px] transition-colors
            font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]
            ${activeFilter === 'all' 
              ? 'bg-card text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
          style={{ fontSize: 'var(--text-sm)' }}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter('unresolved')}
          className={`
            px-4 py-2 rounded-[var(--radius-button)] min-h-[44px] transition-colors
            font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] flex items-center gap-2
            ${activeFilter === 'unresolved' 
              ? 'bg-card text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
          style={{ fontSize: 'var(--text-sm)' }}
        >
          <div className="w-2 h-2 rounded-full bg-foreground"></div>
          Unresolved
        </button>
        <button
          onClick={() => setActiveFilter('investigating')}
          className={`
            px-4 py-2 rounded-[var(--radius-button)] min-h-[44px] transition-colors
            font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] flex items-center gap-2
            ${activeFilter === 'investigating' 
              ? 'bg-card text-foreground' 
              : 'text-muted-foreground hover:text-foreground'
            }
          `}
          style={{ fontSize: 'var(--text-sm)' }}
        >
          <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
          Investigating
        </button>
      </div>

      {/* Header */}
      <div className="px-6 py-4 bg-muted border-b border-border">
        <h3 className="text-foreground">Safety Events</h3>
      </div>

      {/* Event list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredEvents.map((event) => {
          const isExpanded = expandedIds.includes(event.id);
          
          return (
            <div 
              key={event.id}
              className="bg-muted/30 rounded-[var(--radius-card)] border-2 border-border overflow-hidden"
            >
              {/* Collapsed header */}
              <button
                onClick={() => event.details && toggleExpanded(event.id)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 bg-card border-2 border-border rounded-[var(--radius-button)] flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-foreground" />
                </div>
                
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-base)' }}>
                      {event.title} - N°{event.eventNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: getStatusColor(event.status) }}
                    ></div>
                    <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                      {getStatusLabel(event.status)}
                    </span>
                  </div>
                </div>

                {event.details && (
                  <div className="min-w-[44px] min-h-[44px] flex items-center justify-center">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                )}
              </button>

              {/* Expanded content */}
              {isExpanded && event.details && (
                <div className="px-4 pb-4 border-t border-border">
                  {/* Progress/severity indicator */}
                  <div className="mt-3 mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                        Severity Level
                      </span>
                      <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-sm)' }}>
                        {event.severity === 'critical' ? '92%' : '45%'}
                      </span>
                    </div>
                    <div className="h-2 bg-border rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-foreground rounded-full" 
                        style={{ width: event.severity === 'critical' ? '92%' : '45%' }}
                      ></div>
                    </div>
                  </div>

                  {/* Details table */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-[80px_1fr_100px_80px_60px] gap-3 px-2 pb-1">
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>Location</span>
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>Asset</span>
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>Distance</span>
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>Action</span>
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}></span>
                    </div>
                    
                    {event.details.map((detail, idx) => (
                      <div key={idx} className="grid grid-cols-[80px_1fr_100px_80px_60px] gap-3 items-center bg-card rounded-[var(--radius-button)] px-2 py-2 border border-border">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-foreground"></div>
                          <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                            {detail.location}
                          </span>
                        </div>
                        <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                          {detail.asset}
                        </span>
                        <span className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                          {detail.distance || detail.speed || '—'}
                        </span>
                        <span 
                          className={`
                            px-2 py-1 rounded-full text-center font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]
                            ${idx === 2 ? 'bg-foreground text-white' : 'bg-foreground/10 text-foreground'}
                          `}
                          style={{ fontSize: 'var(--text-xs)' }}
                        >
                          {idx === 2 ? 'Alert' : idx === 1 ? 'Review' : 'Clear'}
                        </span>
                        <button className="min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-muted rounded-[var(--radius-button)] transition-colors">
                          <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}