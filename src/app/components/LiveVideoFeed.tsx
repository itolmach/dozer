import { Camera, Maximize2, Volume2, Bookmark, MapPin, Navigation, AlertTriangle } from 'lucide-react';

interface LiveVideoFeedProps {
  onBookmark?: () => void;
  isExpanded?: boolean;
  onMapClick?: () => void;
}

export function LiveVideoFeed({ onBookmark, isExpanded = false, onMapClick }: LiveVideoFeedProps) {
  return (
    <div className={`bg-card rounded-[var(--radius-card)] border-2 border-border overflow-hidden shadow-[var(--elevation-sm)] ${isExpanded ? 'h-full flex flex-col' : ''}`}>
      {/* Header */}
      <div className="px-6 py-4 bg-muted border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Camera className="w-5 h-5 text-foreground" />
          <h3 className="text-foreground">AI Dash-Cam Feed</h3>
          <div className="flex items-center gap-2 px-3 py-1 bg-foreground/10 rounded-full">
            <div className="w-2 h-2 bg-foreground rounded-full animate-pulse"></div>
            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
              LIVE
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onBookmark}
            className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-[var(--radius-button)] hover:bg-accent transition-colors"
            aria-label="Bookmark moment"
            title="Bookmark this moment for later review"
          >
            <Bookmark className="w-5 h-5" />
          </button>
          <button 
            className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-[var(--radius-button)] hover:bg-accent transition-colors"
            aria-label="Volume control"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <button 
            className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-[var(--radius-button)] hover:bg-accent transition-colors"
            aria-label="Fullscreen"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Video Container */}
      <div className="relative aspect-video bg-[#1a1a1a]">
        {/* Simulated video feed with construction scene */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] via-[#3a3a3a] to-[#1a1a1a]">
            {/* Dirt/ground texture simulation */}
            <div className="absolute inset-0 opacity-30" style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(80, 80, 80, 0.4) 0%, transparent 50%),
                               radial-gradient(circle at 80% 30%, rgba(100, 100, 100, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 40% 80%, rgba(60, 60, 60, 0.4) 0%, transparent 50%)`
            }}></div>
          </div>
          
          {/* Bucket/blade representation */}
          <div className="absolute bottom-1/4 left-1/3 w-32 h-24 bg-[#707070] border-4 border-[#505050] rounded-lg shadow-2xl transform rotate-[-12deg]">
            <div className="absolute inset-2 border-2 border-[#505050]/50"></div>
          </div>

          {/* Safety overlay - object detection boxes */}
          <div className="absolute top-20 right-32 w-24 h-32 border-2 border-muted-foreground rounded">
            <div className="absolute -top-6 left-0 px-2 py-1 bg-muted-foreground text-white rounded" style={{ fontSize: '12px' }}>
              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]">Equipment</span>
            </div>
          </div>

          {/* Timestamp overlay */}
          <div className="absolute top-4 left-4 px-3 py-2 bg-black/70 rounded" style={{ fontSize: 'var(--text-sm)' }}>
            <span className="font-[family-name:var(--font-family)] text-white">
              {new Date().toLocaleTimeString()} | {new Date().toLocaleDateString()}
            </span>
          </div>

          {/* AI Status indicator */}
          <div className="absolute bottom-4 left-4 px-4 py-2 bg-muted-foreground/90 rounded-[var(--radius-button)] flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-white" style={{ fontSize: 'var(--text-sm)' }}>
              AI Detection Active
            </span>
          </div>

          {/* Floating Mini Map - Top Right */}
          {onMapClick && (
            <button
              onClick={onMapClick}
              className="absolute top-6 right-6 w-[200px] h-[140px] rounded-[var(--radius-card)] overflow-hidden border-4 border-primary shadow-[var(--elevation-lg)] bg-accent cursor-pointer transition-all hover:scale-105 hover:border-primary hover:shadow-[var(--elevation-xl)] group"
              title="Click to open Unified Map View"
            >
              {/* Map Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-muted via-accent/30 to-muted">
                {/* Grid Pattern */}
                <svg className="w-full h-full opacity-20">
                  <defs>
                    <pattern id="mini-map-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#mini-map-grid)" />
                </svg>
              </div>

              {/* Safety Zones SVG Overlay */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                {/* Restricted Geofenced Zone (Background) */}
                <rect
                  x="10"
                  y="10"
                  width="30"
                  height="25"
                  fill="var(--destructive)"
                  opacity="0.15"
                  stroke="var(--destructive)"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />

                {/* Personnel Area (Red Zone) */}
                <circle
                  cx="75"
                  cy="70"
                  r="12"
                  fill="var(--destructive)"
                  opacity="0.2"
                  stroke="var(--destructive)"
                  strokeWidth="1.5"
                />
                <circle
                  cx="75"
                  cy="70"
                  r="8"
                  fill="none"
                  stroke="var(--destructive)"
                  strokeWidth="0.8"
                  strokeDasharray="1 1"
                  opacity="0.5"
                />

                {/* Asset Position (Center) */}
                <g transform="translate(50, 50)">
                  {/* Swing Radius */}
                  <circle
                    cx="0"
                    cy="0"
                    r="18"
                    fill="var(--color-warning)"
                    opacity="0.08"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="18"
                    fill="none"
                    stroke="var(--color-warning)"
                    strokeWidth="1"
                    strokeDasharray="3 2"
                    opacity="0.6"
                  />
                  
                  {/* Pulsing Outline */}
                  <circle
                    cx="0"
                    cy="0"
                    r="8"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="0.5"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="r"
                      from="4"
                      to="10"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.8"
                      to="0"
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>

                  {/* Asset Circle Outer Outline */}
                  <circle
                    cx="0"
                    cy="0"
                    r="4.5"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="0.5"
                  />

                  {/* Asset Circle */}
                  <circle
                    cx="0"
                    cy="0"
                    r="4"
                    fill="var(--primary)"
                    stroke="white"
                    strokeWidth="1"
                  />
                  
                  {/* Directional Indicator Outline */}
                  <path
                    d="M 0,-4.5 L 2.5,-9 L 0,-7.5 L -2.5,-9 Z"
                    fill="var(--primary)"
                    opacity="1"
                  />
                  
                  {/* Directional Indicator */}
                  <path
                    d="M 0,-4 L 2,-8 L 0,-7 L -2,-8 Z"
                    fill="var(--primary)"
                    stroke="white"
                    strokeWidth="0.5"
                    opacity="1"
                  />
                </g>

                {/* Asset Path Trace */}
                <polyline
                  points="20,80 30,65 40,55 50,50"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity="0.4"
                />

                {/* Incursion Warning Indicator */}
                <g transform="translate(35, 20)">
                  <circle
                    cx="0"
                    cy="0"
                    r="3"
                    fill="var(--destructive)"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="5"
                    fill="none"
                    stroke="var(--destructive)"
                    strokeWidth="0.8"
                  >
                    <animate
                      attributeName="r"
                      from="3"
                      to="7"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.8"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              </svg>

              {/* Near-Miss Counter Badge */}
              <div className="absolute top-2 left-2 bg-destructive/90 backdrop-blur-sm px-2 py-1 rounded border border-destructive flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-white" />
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-white" style={{ fontSize: '10px' }}>
                  3
                </span>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-card/95 backdrop-blur-sm px-3 py-2 rounded-[var(--radius-button)] border-2 border-primary">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-primary" />
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-primary" style={{ fontSize: 'var(--text-sm)' }}>
                      Open Map View
                    </span>
                  </div>
                </div>
              </div>

              {/* Location Label */}
              <div className="absolute bottom-2 left-2 right-2 bg-card/95 backdrop-blur-sm rounded border border-border px-2 py-1">
                <div className="flex items-center justify-between">
                  <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-xs)' }}>
                    Live Position
                  </span>
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="px-6 py-3 bg-muted border-t border-border flex items-center justify-between">
        <span className="font-[family-name:var(--font-family)] text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
          Camera: Front Dash-Cam | 1080p
        </span>
        <span className="font-[family-name:var(--font-family)] text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
          Objects Detected: 3
        </span>
      </div>
    </div>
  );
}