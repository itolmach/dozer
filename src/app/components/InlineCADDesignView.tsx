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
  Maximize2
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
            <Satellite className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-foreground font-bold leading-tight text-lg">GNSS vs CAD Design Grade</h3>
            <p className="text-muted-foreground text-sm font-medium">Real-time elevation monitoring • {costCode}</p>
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
        {/* Left: 3D Visualization */}
        <div className="flex-1 relative bg-muted/10 border-r border-border">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="relative w-[80%] h-[60%] flex items-center justify-center">
                {/* Simplified 3D Surface representation */}
                <div 
                  className="w-full h-full bg-primary/5 border border-primary/20 rounded-xl"
                  style={{ transform: 'perspective(400px) rotateX(30deg)' }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary border-2 border-white shadow-lg animate-pulse" />
                        <div className="mt-4 px-3 py-1.5 rounded-lg bg-card/90 backdrop-blur-sm border border-border shadow-sm">
                            <span className="text-xs font-bold text-foreground">{gnssPosition.elevation.toFixed(2)}'</span>
                        </div>
                    </div>
                </div>
             </div>
          </div>
          
          <div className="absolute top-4 left-4 p-3 rounded-xl bg-card/80 backdrop-blur-md border border-border shadow-sm">
             <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Design Target</span>
             <span className="text-sm font-bold text-primary">{designPoint.elevation.toFixed(2)}' Grade</span>
          </div>
        </div>

        {/* Right: Real-time Variance & Metrics */}
        <div className="w-[300px] p-6 flex flex-col gap-6 overflow-y-auto bg-muted/5">
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
