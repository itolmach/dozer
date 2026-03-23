import { useState } from 'react';
import { InlineCADDesignView } from './InlineCADDesignView';
import { GeospatialDeviationMonitor } from './GeospatialDeviationMonitor';
import { BarChart3, TrendingUp, DraftingCompass, Layers, Calendar, CalendarDays, CalendarRange } from 'lucide-react';

interface TrendsComparisonProps {
  assetName: string;
}

type TimeRange = 'daily' | 'weekly' | 'monthly';

export function TrendsComparison({ assetName }: TrendsComparisonProps) {
  const [activeRange, setActiveRange] = useState<TimeRange>('daily');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-foreground mb-2">Trends & Comparison</h2>
          <p className="text-muted-foreground">Engineering grade verification and geospatial terrain analysis</p>
        </div>
        
        <div className="flex items-center gap-6">
          {/* Time Range Selector */}
          <div className="flex gap-2 bg-muted/30 rounded-2xl p-1.5 border border-border/40 shadow-inner">
            <button
              onClick={() => setActiveRange('daily')}
              className={`
                w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300
                ${activeRange === 'daily' 
                  ? 'bg-card text-foreground shadow-sm scale-[1.05] border border-border/60' 
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }
              `}
              title="Daily Analysis"
            >
              <Calendar className="w-5.5 h-5.5 stroke-[1.5]" />
            </button>
            <button
              onClick={() => setActiveRange('weekly')}
              className={`
                w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300
                ${activeRange === 'weekly' 
                  ? 'bg-card text-foreground shadow-sm scale-[1.05] border border-border/60' 
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }
              `}
              title="Weekly Summary"
            >
              <CalendarDays className="w-5.5 h-5.5 stroke-[1.5]" />
            </button>
            <button
              onClick={() => setActiveRange('monthly')}
              className={`
                w-12 h-12 flex items-center justify-center rounded-xl transition-all duration-300
                ${activeRange === 'monthly' 
                  ? 'bg-card text-foreground shadow-sm scale-[1.05] border border-border/60' 
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }
              `}
              title="Monthly Trends"
            >
              <CalendarRange className="w-5.5 h-5.5 stroke-[1.5]" />
            </button>
          </div>

          <div className="w-px h-10 bg-border/60" />

          <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-xl border border-border/40 h-12">
            <BarChart3 className="w-5 h-5 text-foreground/70" />
            <span className="text-foreground/90 font-medium">Technical Analysis Mode</span>
          </div>
        </div>
      </div>

      {/* Grid for Technical Modules */}
      <div className="grid grid-cols-1 gap-8">
        {/* 1. GNSS vs CAD Comparison Module */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DraftingCompass className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Engineering Grade Verification</h3>
              <p className="text-sm text-muted-foreground font-[family-name:var(--font-family)]">Real-time GNSS telemetry vs. 3D CAD design models</p>
            </div>
          </div>
          <InlineCADDesignView assetName={assetName} />
        </div>

        {/* 2. Geospatial Telemetry vs 3D Design Module */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Geospatial Terrain Analysis</h3>
              <p className="text-sm text-muted-foreground font-[family-name:var(--font-family)]">Automated deviation detection and vertical progress mapping</p>
            </div>
          </div>
          <GeospatialDeviationMonitor />
        </div>
      </div>
    </div>
  );
}
