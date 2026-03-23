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
            
            {/* Current Activity & Warnings */}
            <div className="flex items-center gap-6">
              {/* Internal Rental Rate */}
              {rentalRate && (
                <div className="px-5 py-3 rounded-xl bg-muted/40 border border-border/50 shadow-sm">
                  <div className="flex items-center gap-6">
                    {utilization && (
                      <>
                        <button 
                          onClick={onOpenDiagnostics}
                          className="flex flex-col hover:opacity-80 transition-opacity"
                          title={utilization.rate < 70 ? 'Systemic friction detected - Click for CAN-bus diagnostics' : 'Click for CAN-bus diagnostics'}
                        >
                          <div className="flex items-center gap-2">
                            <Gauge className={`w-5 h-5 ${utilization.rate < 70 ? 'text-destructive' : utilization.rate < 85 ? 'text-color-warning' : 'text-color-success'}`} />
                            <div className={`font-bold ${
                              utilization.rate < 70 ? 'text-destructive' : utilization.rate < 85 ? 'text-color-warning' : 'text-color-success'
                            }`} style={{ fontSize: 'var(--text-lg)' }}>
                              {utilization.rate}%
                            </div>
                          </div>
                          <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight mt-0.5">
                            Utilization AVG
                          </div>
                        </button>
                        <div className="w-px h-10 bg-border/60"></div>
                      </>
                    )}
                    {rentalRate.activeRate !== undefined && (
                      <>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <Database className="w-5 h-5 text-primary" />
                            <div className="font-bold text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                              ${rentalRate.activeRate.toFixed(2)}/hr
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight">Active Rate</span>
                            <span className="px-1.5 py-0.5 bg-primary/20 text-primary rounded-sm text-[9px] font-black uppercase leading-none">{rentalRate.activeRateSource || 'ERP'}</span>
                          </div>
                        </div>
                        <div className="w-px h-10 bg-border/60"></div>
                      </>
                    )}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-foreground/70" />
                        <div className="font-bold text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                          ${rentalRate.hourlyRate.toFixed(2)}/hr
                        </div>
                      </div>
                      <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight mt-0.5">
                        Internal Rate
                      </div>
                    </div>
                    <div className="w-px h-10 bg-border/60"></div>
                    <div className="flex flex-col gap-1 text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1" title="Fuel Cost">
                          <Fuel className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold text-foreground/80">${rentalRate.fuel.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1" title="Maintenance Cost">
                          <Wrench className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold text-foreground/80">${rentalRate.maintenance.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-1" title="Depreciation Cost">
                          <TrendingDown className="w-3.5 h-3.5" />
                          <span className="text-xs font-bold text-foreground/80">${rentalRate.depreciation.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="text-[9px] uppercase tracking-widest font-black opacity-30">Cost Components</div>
                    </div>
                  </div>
                </div>
              )}
              



            </div>
          </div>

        </div>
      </div>
    </div>
  );
}