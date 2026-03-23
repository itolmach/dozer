import { Columns2, DraftingCompass, Map as MapIcon, Video } from 'lucide-react';

interface ViewToggleProps {
  activeView: 'live' | 'historical' | 'jobsite' | 'trends';
  onViewChange: (view: 'live' | 'historical' | 'jobsite' | 'trends') => void;
  onOpenCAD?: () => void;
  onOpenMap?: () => void;
  onOpenVideo?: () => void;
}

export function ViewToggle({ activeView, onViewChange, onOpenCAD, onOpenMap, onOpenVideo }: ViewToggleProps) {
  return (
    <div className="bg-card border-b border-border px-8 py-3">
      <div className="flex justify-between items-center">
        {/* View Toggle Tabs — left-aligned with header content */}
        <div className="flex justify-start">
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
              <span className="font-bold text-sm tracking-tight text-foreground/90">Here &amp; Now</span>
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
              <span className="font-bold text-sm tracking-tight text-foreground/90">Analytics</span>
              <span className="text-xs text-muted-foreground/70 font-medium">Performance Trends</span>
            </button>
          </div>
        </div>

        {/* Quick Access Icons — right side */}
        <div className="flex items-center gap-1.5 bg-muted/30 rounded-2xl p-1.5 border border-border/40 shadow-inner">
          <button
            onClick={onOpenCAD}
            className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:shadow-sm"
            title="GNSS vs CAD Design Grade"
          >
            <DraftingCompass className="w-4.5 h-4.5 stroke-[1.5]" />
          </button>
          <button
            onClick={onOpenMap}
            className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:shadow-sm"
            title="Site Map View"
          >
            <MapIcon className="w-4.5 h-4.5 stroke-[1.5]" />
          </button>
          <button
            onClick={onOpenVideo}
            className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:shadow-sm"
            title="Live Video Feed"
          >
            <Video className="w-4.5 h-4.5 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}