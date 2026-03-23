import { Radio, StopCircle, MessageSquare, AlertCircle, Wrench, MapPin } from 'lucide-react';

export function QuickActions() {
  const actions = [
    {
      id: 'communicate',
      label: 'Communicate with Operator',
      icon: Radio,
      variant: 'primary' as const,
      description: 'Send voice or text message',
    },
    {
      id: 'halt',
      label: 'Halt Asset',
      icon: StopCircle,
      variant: 'primary' as const,
      description: 'Emergency stop',
    },
    {
      id: 'dispatch',
      label: 'Request Support',
      icon: MessageSquare,
      variant: 'secondary' as const,
      description: 'Dispatch field technician',
    },
    {
      id: 'maintenance',
      label: 'Log Maintenance',
      icon: Wrench,
      variant: 'secondary' as const,
      description: 'Record service issue',
    },
    {
      id: 'relocate',
      label: 'Reassign Location',
      icon: MapPin,
      variant: 'secondary' as const,
      description: 'Move to new zone',
    },
    {
      id: 'incident',
      label: 'Report Incident',
      icon: AlertCircle,
      variant: 'secondary' as const,
      description: 'File safety report',
    },
  ];

  const getButtonStyles = (variant: 'primary' | 'secondary') => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-primary-foreground hover:opacity-90 border-2 border-primary';
      case 'secondary':
        return 'bg-card text-foreground hover:bg-accent border-2 border-border';
    }
  };

  return (
    <div className="bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)]">
      {/* Header */}
      <div className="px-6 py-4 bg-muted border-b border-border">
        <h3 className="text-foreground">Quick Actions</h3>
        <p className="text-muted-foreground mt-1">One-tap workflows for operations management</p>
      </div>

      {/* Actions Grid */}
      <div className="p-6 grid grid-cols-2 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              className={`
                min-h-[100px] p-6 rounded-[var(--radius-card)] 
                transition-all duration-200
                flex flex-col items-start gap-3 text-left
                ${getButtonStyles(action.variant)}
                shadow-[0_2px_8px_rgba(0,0,0,0.08)]
                hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)]
                active:scale-[0.98]
              `}
            >
              <div className="w-12 h-12 rounded-[var(--radius-button)] bg-current/10 flex items-center justify-center">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-1" style={{ fontSize: 'var(--text-base)' }}>
                  {action.label}
                </div>
                <div className="font-[family-name:var(--font-family)] opacity-80" style={{ fontSize: 'var(--text-sm)' }}>
                  {action.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}