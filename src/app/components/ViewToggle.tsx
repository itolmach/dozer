import { Columns2 } from 'lucide-react';

interface ViewToggleProps {
  activeView: 'live' | 'historical' | 'jobsite' | 'trends';
  onViewChange: (view: 'live' | 'historical' | 'jobsite' | 'trends') => void;
}

export function ViewToggle({ activeView, onViewChange }: ViewToggleProps) {
  return (
    <div className="bg-card border-b border-border px-8 py-3">
      <div className="flex justify-center items-center">
        {/* View Toggle Tabs */}
        <div className="inline-flex rounded-full bg-muted/50 p-1 gap-1" role="tablist">
          <button
            role="tab"
            aria-selected={activeView === 'live'}
            onClick={() => onViewChange('live')}
            className={`
              px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2
              font-[family-name:var(--font-family)]
              ${activeView === 'live' 
                ? 'bg-card text-foreground shadow-sm ring-1 ring-black/5' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
          >
            <span className="font-bold text-sm tracking-tight text-foreground/90">Here & Now</span>
            <span className="text-xs text-muted-foreground/70 font-medium">Live Ops</span>
          </button>
          <button
            role="tab"
            aria-selected={activeView === 'historical'}
            onClick={() => onViewChange('historical')}
            className={`
              px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2
              font-[family-name:var(--font-family)]
              ${activeView === 'historical' 
                ? 'bg-card text-foreground shadow-sm ring-1 ring-black/5' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
          >
            <span className="font-bold text-sm tracking-tight text-foreground/90">Shift Review</span>
            <span className="text-xs text-muted-foreground/70 font-medium">Game Tape</span>
          </button>
          <button
            role="tab"
            aria-selected={activeView === 'trends'}
            onClick={() => onViewChange('trends')}
            className={`
              px-6 py-2 rounded-full transition-all duration-300 flex items-center gap-2
              font-[family-name:var(--font-family)]
              ${activeView === 'trends' 
                ? 'bg-card text-foreground shadow-sm ring-1 ring-black/5' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }
            `}
          >
            <span className="font-bold text-sm tracking-tight text-foreground/90">Trends & Comparison</span>
            <span className="text-xs text-muted-foreground/70 font-medium">Analytics</span>
          </button>
        </div>
      </div>
    </div>
  );
}