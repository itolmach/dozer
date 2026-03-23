import { Radio, StopCircle, Pencil, AlertCircle, MessageSquare, Wrench, MapPin, Info, DraftingCompass, Map, Video } from 'lucide-react';

interface GlobalActionsToolbarProps {
  onVerifyPlan?: () => void;
  onShowMap?: () => void;
  onShowVideo?: () => void;
  onAlert?: () => void;
  variant?: 'video' | 'global';
}

export function GlobalActionsToolbar({ 
  onVerifyPlan, 
  onShowMap, 
  onShowVideo,
  onAlert,
  variant = 'global'
}: GlobalActionsToolbarProps) {

  const positionClasses = variant === 'video' 
    ? "absolute bottom-6 left-1/2 -translate-x-1/2 z-50"
    : "absolute bottom-8 left-1/2 -translate-x-1/2 z-50";

  return (
    <div className={positionClasses}>
      <div className="bg-white/90 backdrop-blur-md rounded-full border border-border/50 shadow-[0_12px_40px_rgb(0,0,0,0.15)] px-4 py-3 flex items-center gap-2 min-w-[700px]">
        {/* Primary Action Pills */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2.5 px-5 py-2.5 bg-black text-white rounded-full hover:bg-black/90 transition-all active:scale-95 shadow-lg group">
            <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
              <Radio className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold tracking-tight">Radio</span>
          </button>
          
          <button className="flex items-center gap-2.5 px-5 py-2.5 bg-black text-white rounded-full hover:bg-black/90 transition-all active:scale-95 shadow-lg group">
            <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
              <StopCircle className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold tracking-tight">Halt</span>
          </button>
          
          <button className="flex items-center gap-2.5 px-5 py-2.5 bg-black text-white rounded-full hover:bg-black/90 transition-all active:scale-95 shadow-lg group">
            <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
              <Pencil className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold tracking-tight">Record</span>
          </button>
          
          <button 
            onClick={onAlert}
            className="flex items-center gap-2.5 px-5 py-2.5 bg-[#6b7280] text-white rounded-full hover:bg-[#4b5563] transition-all active:scale-95 shadow-lg group"
          >
            <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
              <AlertCircle className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold tracking-tight">ALERT</span>
          </button>
        </div>

        {/* Quick Access Tools Section */}
        <div className="flex items-center gap-2 px-3 border-l-2 border-border/20 ml-2">
          <button 
            onClick={onVerifyPlan}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-accent text-foreground hover:bg-accent/80 transition-all active:scale-95 shadow-sm"
            title="Plan Verification"
          >
            <DraftingCompass className="w-5 h-5 stroke-[2.5px]" />
          </button>
          <button 
            onClick={onShowMap}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-accent text-foreground hover:bg-accent/80 transition-all active:scale-95 shadow-sm"
            title="Unified Map View"
          >
            <Map className="w-5 h-5 stroke-[2.5px]" />
          </button>
          <button 
            onClick={onShowVideo}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-accent text-foreground hover:bg-accent/80 transition-all active:scale-95 shadow-sm"
            title="Idle Monitoring Mode"
          >
            <Video className="w-5 h-5 stroke-[2.5px]" />
          </button>
        </div>

        {/* Decorative Spacer/Divider */}
        <div className="flex-1 px-4 flex justify-center">
          <div className="w-[2px] h-10 bg-border/40 rounded-full" />
        </div>

        {/* Utility Icons Section */}
        <div className="flex items-center gap-3 pr-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-foreground/70 hover:bg-accent hover:text-foreground transition-all active:scale-90" title="Messages">
            <MessageSquare className="w-5 h-5 stroke-[2.5px]" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-foreground/70 hover:bg-accent hover:text-foreground transition-all active:scale-90" title="Maintenance">
            <Wrench className="w-5 h-5 stroke-[2.5px]" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-foreground/70 hover:bg-accent hover:text-foreground transition-all active:scale-90" title="Geospatial">
            <MapPin className="w-5 h-5 stroke-[2.5px]" />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-foreground/70 hover:bg-accent hover:text-foreground transition-all active:scale-90" title="System Info">
            <Info className="w-5 h-5 stroke-[2.5px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
