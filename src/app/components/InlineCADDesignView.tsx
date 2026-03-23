import React, { useState } from 'react';
import { 
  Satellite, 
  Box, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  FileText, 
  Target, 
  Layers, 
  Info,
  Maximize2,
  DraftingCompass
} from 'lucide-react';

interface InlineCADDesignViewProps {
  assetName: string;
  costCode?: string;
}

export function InlineCADDesignView({ assetName, costCode = 'CSI 31 22 00' }: InlineCADDesignViewProps) {
  const [showToleranceZone, setShowToleranceZone] = useState(true);
  const [showVolumeMetrics, setShowVolumeMetrics] = useState(true);

  // Mock data (sync with SplitScreenCADView)
  const gnssPosition = {
    elevation: 285.42,
    accuracy: 0.8,
  };

  const designPoint = {
    elevation: 287.00,
    tolerance: 0.10,
  };

  const elevationVariance = gnssPosition.elevation - designPoint.elevation;
  const isWithinTolerance = Math.abs(elevationVariance) <= designPoint.tolerance;
  const isOverExcavated = elevationVariance < -designPoint.tolerance;

  const metrics = {
    overExcavation: 12.3,
    volumeOverDug: 847,
    budgetImpact: 18940,
    reworkRequired: true,
  };

  const getStatusColor = () => {
    if (isWithinTolerance) return 'var(--color-success)';
    if (isOverExcavated) return 'var(--destructive)';
    return 'var(--color-warning)';
  };

  const getStatusText = () => {
    if (isWithinTolerance) return 'Within Tolerance';
    if (isOverExcavated) return 'Over-Excavated';
    return 'Under-Filled';
  };

  return (
    <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm flex flex-col min-h-[500px]">
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <DraftingCompass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-foreground font-bold leading-tight text-lg">Deviation mapping</h3>
            <p className="text-muted-foreground text-sm font-medium">CAD design analysis • {costCode}</p>
          </div>
        </div>
      </div>

      {/* Rework Alert Banner */}
      {metrics.reworkRequired && (
        <div className="bg-destructive/5 border-b border-destructive/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-xs font-bold text-destructive uppercase tracking-wider">Budget Bleed: Rework Required</span>
            </div>
            <span className="text-xs font-bold text-destructive">${metrics.budgetImpact.toLocaleString()} Impact</span>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Visualization Area: Now Split into Plan View and Cross-Section */}
        <div className="flex-1 flex flex-col bg-muted/5 border-r border-border overflow-hidden">
          {/* Top: Plan (Top-Down Perspective) View (matching screenshot) */}
          <div className="flex-[1.5] relative flex items-center justify-center p-8 border-b border-border/40 bg-muted/10">
             <div className="absolute top-3 left-3 px-2 py-1 flex items-center gap-1.5 rounded-lg bg-card/80 backdrop-blur-sm border border-border/60 z-10">
                <Box className="w-3 h-3 text-muted-foreground" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Plan View (Mapping)</span>
             </div>

             <div className="relative w-full max-w-xl aspect-[2/1] flex items-center justify-center">
                {/* Visualizing the trapezoidal plane from screenshot */}
                <div 
                  className="absolute inset-0 bg-[#E8E8E8] border border-[#D0D0D0] shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
                  style={{ 
                    clipPath: 'polygon(15% 0, 85% 0, 100% 100%, 0 100%)',
                  }}
                />
                
                {/* Asset Point indicator (matching grey dot in screenshot) */}
                <div className="absolute left-[50%] top-[40%] flex flex-col items-center -translate-x-1/2 -translate-y-1/2">
                    <div className="w-7 h-7 rounded-full bg-[#757575] border-2 border-white shadow-lg animate-pulse" />
                    <div className="mt-3 px-3 py-1.5 rounded-lg bg-white border border-[#D0D0D0] shadow-md">
                        <span className="text-sm font-bold text-foreground">285.42'</span>
                    </div>
                </div>

                {/* Design target info box (matching top-left in screenshot) */}
                <div className="absolute top-[-20px] left-[5%] px-4 py-3 rounded-xl bg-white border border-[#D0D0D0] shadow-sm">
                   <span className="text-[10px] font-extrabold text-[#757575] uppercase tracking-wider block mb-0.5">Design Target</span>
                   <span className="text-sm font-bold text-foreground">287.00' Grade</span>
                </div>
             </div>
          </div>

          {/* Bottom: Cross-Sectional Analysis View */}
          <div className="flex-1 relative bg-background/30 p-4">
             <div className="absolute top-3 left-3 px-2 py-1 flex items-center gap-1.5 rounded-lg bg-card/80 backdrop-blur-sm border border-border/60 z-10">
                <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Cross-Section (Profile)</span>
             </div>

             <div className="w-full h-full flex flex-col justify-center px-12 pt-8">
                {/* Design elevation baseline */}
                <div className="relative h-px w-full bg-primary/20 border-t border-dashed border-primary/40">
                   <div className="absolute -left-12 -top-2 flex items-center gap-2">
                       <Target className="w-3.5 h-3.5 text-primary" />
                       <span className="text-[10px] font-bold text-primary">TARGET</span>
                   </div>
                </div>

                {/* Actual terrain profile (curved path representing deviation) */}
                <div className="relative h-[80px] w-full mt-4">
                   <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none overflow-visible">
                      <path 
                        d="M0,0 Q25,80 50,75 T100,20" 
                        fill="none" 
                        stroke="var(--destructive)" 
                        strokeWidth="2" 
                        strokeDasharray="0"
                      />
                      {/* Asset focus point on profile */}
                      <circle cx="50" cy="75" r="3" fill="var(--destructive)" />
                   </svg>
                   {/* Measurement bracket */}
                   <div className="absolute left-[50%] h-full top-0 w-px bg-destructive/30 border-l border-dashed border-destructive/50 flex flex-col items-center justify-center">
                       <span className="bg-destructive text-white text-[9px] font-black px-1.5 py-0.5 rounded -rotate-90 origin-center whitespace-nowrap">
                          {Math.abs(elevationVariance).toFixed(2)}' VAR
                       </span>
                   </div>
                </div>
                <div className="w-full h-8 bg-muted/40 rounded-b-lg border-x border-b border-border/20 mt-0" />
             </div>
          </div>
        </div>

        {/* Right: Real-time Variance (Simplified Sidebar for Split View) */}
        <div className="w-[320px] p-6 flex flex-col gap-6 overflow-y-auto bg-muted/5 border-l border-border">
           {/* Variance Display */}
           <div className="text-center p-4 rounded-2xl bg-card border border-border shadow-inner">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">{getStatusText()}</span>
              <div className="flex items-center justify-center gap-2">
                {elevationVariance < 0 ? <TrendingDown className="w-5 h-5 text-destructive" /> : <TrendingUp className="w-5 h-5 text-color-warning" />}
                <span className={`text-3xl font-bold`} style={{ color: getStatusColor() }}>
                  {Math.abs(elevationVariance).toFixed(2)}'
                </span>
              </div>
              <span className="text-[11px] font-medium text-muted-foreground mt-1 block">
                {Math.abs(elevationVariance * 12).toFixed(1)}" {elevationVariance < 0 ? 'Below' : 'Above'} Grade
              </span>
           </div>

           {/* Accuracy */}
           <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Satellite className="w-3.5 h-3.5" />
                <span className="text-xs font-bold uppercase tracking-wider">GNSS Accuracy</span>
              </div>
              <span className="text-xs font-bold text-color-success">±{gnssPosition.accuracy}"</span>
           </div>

           {/* Mini Metrics */}
           <div className="space-y-3">
              <div className="p-3 rounded-xl bg-card border border-border">
                <div className="flex justify-between items-center mb-1">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Excess Vol.</span>
                   <span className="text-xs font-bold text-destructive">{metrics.volumeOverDug} yd³</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                   <div className="h-full bg-destructive" style={{ width: `${metrics.overExcavation}%` }} />
                </div>
              </div>
              
              <button className="w-full py-2.5 rounded-xl bg-primary/10 text-primary text-[10px] font-bold hover:bg-primary/20 transition-all flex items-center justify-center gap-1.5 uppercase tracking-wider">
                <Maximize2 className="w-3.5 h-3.5" />
                Full Design Intel
              </button>
           </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-3 border-t border-border bg-muted/20">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Info className="w-3.5 h-3.5" />
          <span className="text-[10px] font-medium italic">Comparison between real-time sensor array and design surface (Mod: Final_Grade_Rev12)</span>
        </div>
      </div>
    </div>
  );
}
