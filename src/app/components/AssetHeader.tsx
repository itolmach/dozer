import { MapPin, Circle, AlertTriangle, Activity, Maximize2, Settings, DollarSign, Fuel, Wrench, TrendingDown, Gauge, Clock, Zap, FileText, CalendarClock, Database, Truck } from 'lucide-react';

interface AssetHeaderProps {
  assetName: string;
  assetModel: string;
  status: 'Active' | 'Idle' | 'Offline';
  location: {
    lat: number;
    lng: number;
    siteName: string;
  };
  currentActivity?: string;
  todayWarnings?: number;
  onViewAlerts?: () => void;
  onExpandVideo?: () => void;
  onOpenSettings?: () => void;
  onOpenDiagnostics?: () => void;
  onOpenReports?: () => void;
  onOpenDailyPrep?: () => void;
  rentalRate?: {
    activeRate?: number;
    activeRateSource?: string;
    hourlyRate: number;
    fuel: number;
    maintenance: number;
    depreciation: number;
  };
  utilization?: {
    rate: number; // percentage
    plannedMaintenance: number; // hours today
    unplannedDowntime: number; // hours today
    idleCost: number; // dollars lost today
  };
}

export function AssetHeader({ 
  assetName, 
  assetModel, 
  status, 
  location, 
  currentActivity = 'Grading & Leveling',
  todayWarnings = 2,
  onViewAlerts,
  onExpandVideo,
  onOpenSettings,
  onOpenDiagnostics,
  onOpenReports,
  onOpenDailyPrep,
  rentalRate,
  utilization
}: AssetHeaderProps) {
  const statusColors = {
    Active: 'bg-foreground',
    Idle: 'bg-muted-foreground',
    Offline: 'bg-border',
  };

  return (
    <div className="bg-card border-b-2 border-border">
      <div className="max-w-[1400px] mx-auto px-8 py-6">
        <div className="flex items-start justify-between gap-8">
          {/* Asset Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <h1 className="font-[family-name:var(--font-family)] font-bold text-foreground" style={{ fontSize: 'var(--text-xl)' }}>
                  {assetName}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenDailyPrep}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 text-foreground hover:bg-muted/80 transition-all duration-300 shadow-sm"
                  title="Daily Shift Preparation & Allocation"
                >
                  <CalendarClock className="w-5 h-5 stroke-[1.5]" />
                </button>
                
                <button
                  onClick={onOpenReports}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 text-foreground hover:bg-muted/80 transition-all duration-300 shadow-sm"
                  title="Export Progress & Post-Mortem Reports"
                >
                  <FileText className="w-5 h-5 stroke-[1.5]" />
                </button>
                
                <button
                  onClick={onOpenSettings}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 text-foreground hover:bg-muted/80 transition-all duration-300 shadow-sm"
                  title="Asset Initialization Settings"
                >
                  <Settings className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6 mb-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="w-4 h-4 flex-shrink-0" />
                <span className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  {status} &ndash; {currentActivity}
                </span>
              </div>

              {todayWarnings > 0 && (
                <div className="flex items-center gap-2 text-foreground">
                  <AlertTriangle className="w-4 h-4" />
                  <button
                    onClick={onViewAlerts}
                    className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] border-b border-dotted border-foreground hover:opacity-80 transition-opacity"
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    {todayWarnings} Warning{todayWarnings !== 1 ? 's' : ''} Today
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 text-muted-foreground">
                <Truck className="w-4 h-4" />
                <span className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  {assetModel}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  {location.siteName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}