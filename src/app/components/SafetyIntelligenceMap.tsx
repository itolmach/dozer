import React, { useState } from 'react';
import { Map, Zap, Target, History, Video, AlertTriangle, Check, Copy } from 'lucide-react';
import { UnifiedMapView } from './UnifiedMapView';
import { TimelineSeeker } from './TimelineSeeker';
import { SafetyEventsFeed } from './SafetyEventsFeed';

interface SafetyIntelligenceMapProps {
  assetName: string;
  assetLocation: {
    lat: number;
    lng: number;
    siteName: string;
  };
  videoRef?: React.RefObject<HTMLDivElement | null>;
}

export function SafetyIntelligenceMap({ assetName, assetLocation, videoRef }: SafetyIntelligenceMapProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(3600);
  const [duration] = useState(7200);
  const [summaryCopied, setSummaryCopied] = useState(false);

  const keySafetyEvents = [
    { time: '08:42', label: 'Personnel Incursion: Zone B-2 (Moderate)', type: 'warning', seconds: 522 },
    { time: '10:15', label: 'Production Velocity Warning: Section A', type: 'info', seconds: 1530 },
    { time: '14:30', label: 'Geofence Boundary Calibration Completed', type: 'success', seconds: 3600 },
    { time: '16:05', label: 'Proximity Sensor Auto-Test: Passed', type: 'success', seconds: 5400 },
  ];

  const timelineBookmarks = keySafetyEvents.map(event => ({
    id: event.time,
    time: event.seconds,
    label: event.label,
    tags: [event.type]
  }));

  const handleCopySummary = async () => {
    const summaryText = `Safety Intelligence Summary - ${assetName}\n\nOperation across Zone B-2 shows moderate production pressure correlation. One near-miss event detected involving a personnel proximity incursion. Asset remained within designated safety zones for 94% of the shift. Recommended safety briefing for the next crew regarding Zone B-2 speed limits.`;
    await navigator.clipboard.writeText(summaryText);
    setSummaryCopied(true);
    setTimeout(() => setSummaryCopied(false), 2000);
  };

  const videoReports = [
    { id: '1', title: 'Daily Safety Recap - March 16, 2026', duration: '4:32', events: 12 },
    { id: '2', title: 'Weekly Performance Summary', duration: '12:45', events: 47 },
    { id: '3', title: 'Monthly Trends Analysis', duration: '18:20', events: 186 },
  ];

  return (
    <div className="space-y-0">
      <UnifiedMapView 
        isInline={true}
        assetName={assetName}
        location={assetLocation}
      />
      
      {/* Map Playback Seeker */}
      <div className="px-8 py-4 bg-muted/30 border-t-2 border-border">
        <TimelineSeeker
          duration={duration}
          currentTime={currentTime}
          onSeek={setCurrentTime}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          isPlaying={isPlaying}
          bookmarks={timelineBookmarks}
          onAddBookmark={() => {}}
          onUpdateBookmark={() => {}}
        />
      </div>
      
      {/* AI Safety Intelligence Summary */}
      <div className="p-8 border-t-2 border-border bg-card/50 px-12">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h4 className="text-foreground font-semibold mb-2" style={{ fontSize: 'var(--text-xl)' }}>Safety Intelligence AI Summary</h4>
            <p className="text-muted-foreground" style={{ fontSize: 'var(--text-base)' }}>
              Generated from real-time spatial telemetry and proximity correlation data
            </p>
          </div>
          <button
            onClick={handleCopySummary}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-border hover:bg-muted transition-all text-sm font-medium text-foreground shadow-sm"
          >
            {summaryCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {summaryCopied ? 'Report Copied' : 'Copy Summary'}
          </button>
        </div>

        <div className="flex gap-12">
          <div className="flex-1">
            <p className="text-foreground leading-relaxed mb-8" style={{ fontSize: 'var(--text-lg)' }}>
              Analysis of the current shift shows that the asset has been operating within moderate safety thresholds. 
              A single personnel proximity near-miss was detected in Zone B-2 at 08:42, which was immediately mitigated. 
              Production pressure slightly exceeded the safety correlation threshold during the mid-shift peak, though no further incidents occurred. 
              Recommended action: Brief the incoming crew on the new geofence boundaries in the expansion area.
            </p>

            <div className="mt-12 pt-8 border-t border-border/60">
              <div className="flex items-center justify-between mb-6">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" />
                  Detailed Safety Events Feed
                </h5>
              </div>
              <div className="bg-muted/10 rounded-2xl border border-border/40 overflow-hidden">
                 <SafetyEventsFeed />
              </div>
            </div>
          </div>

          <div className="w-[450px] border-l-2 border-border pl-12 flex flex-col gap-10">
            <div>
              <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                <Target className="w-3 h-3" />
                Safety Events
              </h5>
              <div className="space-y-4">
                {[
                  { time: '08:42', label: 'Personnel Incursion: Zone B-2', type: 'warning' },
                  { time: '10:15', label: 'Speed Threshold Exceeded: Section A', type: 'info' },
                  { time: '14:30', label: 'Geofence Boundary Calibration', type: 'success' },
                  { time: '16:05', label: 'Proximity Sensor Auto-Test', type: 'success' },
                ].map((event, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-1 group cursor-pointer hover:scale-[1.02] transition-transform">
                    <span className="text-muted-foreground tabular-nums w-12 font-medium" style={{ fontSize: 'var(--text-sm)' }}>{event.time}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      event.type === 'warning' ? 'bg-destructive' : 
                      event.type === 'info' ? 'bg-primary' : 'bg-green-500'
                    }`}></div>
                    <span className="text-foreground group-hover:underline font-medium" style={{ fontSize: 'var(--text-base)' }}>{event.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6 flex items-center gap-2">
                <History className="w-3 h-3" />
                Key Events
              </h5>
              <div className="space-y-4">
                {[
                  { time: '10:00', label: 'Asset arrival at Zone B' },
                  { time: '20:00', label: 'Equipment startup & calibration' },
                  { time: '30:00', label: 'Initial grading pass - Section A' },
                  { time: '40:00', label: 'Safety check: Proximity sensors active' },
                ].map((event, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-1 group cursor-pointer hover:scale-[1.02] transition-transform">
                    <span className="text-muted-foreground tabular-nums w-12 font-medium" style={{ fontSize: 'var(--text-sm)' }}>{event.time}</span>
                    <div className="w-2 h-2 rounded-full bg-border group-hover:bg-foreground transition-colors"></div>
                    <span className="text-foreground group-hover:underline font-medium" style={{ fontSize: 'var(--text-base)' }}>{event.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div ref={videoRef} className="pt-8 border-t border-border/60">
              <div className="flex items-center justify-between mb-6">
                <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Video className="w-3 h-3" />
                  Automated Video Recaps
                </h5>
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter opacity-50">{videoReports.length} AVAILABLE</span>
              </div>
              <div className="space-y-3">
                {videoReports.map((report) => (
                  <button
                    key={report.id}
                    className="w-full bg-muted/20 hover:bg-muted/40 rounded-xl border border-border/60 overflow-hidden transition-all group p-3 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-10 bg-[#1a1a1a] rounded flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                         <Video className="w-4 h-4 text-white/30" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h6 className="text-[13px] font-bold text-foreground leading-tight truncate">{report.title}</h6>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                           <span className="font-medium">{report.duration}</span>
                           <span className="opacity-30">•</span>
                           <span className="font-medium">{report.events} events</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-foreground/5 group-hover:bg-foreground flex items-center justify-center transition-colors">
                         <div className="w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-foreground group-hover:border-l-background border-b-[4px] border-b-transparent ml-0.5"></div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
