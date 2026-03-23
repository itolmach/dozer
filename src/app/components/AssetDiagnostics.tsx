import { useState } from 'react';
import { 
  X, 
  Gauge, 
  Activity, 
  Droplet, 
  Thermometer, 
  Battery, 
  Zap,
  AlertTriangle,
  Clock,
  Wrench,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  Filter,
  Download,
  BarChart3,
  Cpu,
  Settings
} from 'lucide-react';

interface AssetDiagnosticsProps {
  onClose: () => void;
  assetName: string;
  assetValue: number;
}

interface CANBusData {
  engineRPM: number;
  engineTemp: number;
  hydraulicPressure: number;
  fuelLevel: number;
  batteryVoltage: number;
  operatingHours: number;
  diagnosticCodes: string[];
  status: 'healthy' | 'warning' | 'critical';
}

interface DowntimeEvent {
  id: string;
  timestamp: Date;
  duration: number; // minutes
  type: 'planned' | 'unplanned';
  reason: string;
  costCode: string;
  costCodeName: string;
  laborCost: number;
  equipmentCost: number;
  delayCost: number;
  totalCost: number;
  notes?: string;
  resolvedBy?: string;
  contextActivity?: string;
}

export function AssetDiagnostics({ onClose, assetName, assetValue }: AssetDiagnosticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'planned' | 'unplanned'>('all');

  // Mock CAN-bus telemetry data
  const canBusData: CANBusData = {
    engineRPM: 1850,
    engineTemp: 195, // Fahrenheit
    hydraulicPressure: 3200, // PSI
    fuelLevel: 67, // percentage
    batteryVoltage: 13.8,
    operatingHours: 3247.5,
    diagnosticCodes: ['P0128', 'C1201'],
    status: 'warning',
  };

  // Mock downtime events with cost code attribution
  const downtimeEvents: DowntimeEvent[] = [
    {
      id: 'dt-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 127),
      duration: 45,
      type: 'unplanned',
      reason: 'Hydraulic Hose Failure',
      costCode: 'CSI 31 23 16',
      costCodeName: 'Rock Blasting & Excavation',
      laborCost: 675.00,
      equipmentCost: 215.63,
      delayCost: 1893.75,
      totalCost: 2784.38,
      notes: 'High-pressure line burst during boulder removal. Replacement hose installed.',
      resolvedBy: 'Field Mechanic - J. Martinez',
      contextActivity: 'Rock Blasting Phase - High pressure operation',
    },
    {
      id: 'dt-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 285),
      duration: 30,
      type: 'planned',
      reason: 'Scheduled Filter Change',
      costCode: 'CSI 31 22 00',
      costCodeName: 'Grading & Site Prep',
      laborCost: 150.00,
      equipmentCost: 85.00,
      delayCost: 0,
      totalCost: 235.00,
      notes: 'Routine 250-hour maintenance. All filters replaced per schedule.',
      resolvedBy: 'Maintenance Team',
    },
    {
      id: 'dt-3',
      timestamp: new Date(Date.now() - 1000 * 60 * 420),
      duration: 75,
      type: 'unplanned',
      reason: 'Operator Break - Heat Advisory',
      costCode: 'CSI 31 22 00',
      costCodeName: 'Grading & Site Prep',
      laborCost: 0,
      equipmentCost: 0,
      delayCost: 1265.63,
      totalCost: 1265.63,
      notes: 'OSHA heat advisory. Mandatory operator rest period.',
      contextActivity: 'Grading operations in direct sunlight',
    },
    {
      id: 'dt-4',
      timestamp: new Date(Date.now() - 1000 * 60 * 615),
      duration: 22,
      type: 'unplanned',
      reason: 'Engine Overheat Warning',
      costCode: 'CSI 31 23 16',
      costCodeName: 'Rock Blasting & Excavation',
      laborCost: 0,
      equipmentCost: 0,
      delayCost: 371.67,
      totalCost: 371.67,
      notes: 'CAN-bus code P0128 - Coolant temp threshold. Allowed to cool before resuming.',
      resolvedBy: 'Auto-resolved after cooldown',
      contextActivity: 'Continuous high-load rock excavation',
    },
  ];

  const filteredEvents = downtimeEvents.filter(event => {
    if (filterType === 'all') return true;
    return event.type === filterType;
  });

  // Calculate utilization metrics
  const totalMinutesToday = 600; // 10 hours
  const activeMinutes = totalMinutesToday - downtimeEvents.reduce((sum, e) => sum + e.duration, 0);
  const utilizationRate = (activeMinutes / totalMinutesToday) * 100;
  
  const plannedDowntime = downtimeEvents
    .filter(e => e.type === 'planned')
    .reduce((sum, e) => sum + e.duration, 0);
  
  const unplannedDowntime = downtimeEvents
    .filter(e => e.type === 'unplanned')
    .reduce((sum, e) => sum + e.duration, 0);

  const totalIdleCost = downtimeEvents
    .filter(e => e.type === 'unplanned')
    .reduce((sum, e) => sum + e.totalCost, 0);

  // Group costs by cost code
  const costsByCode = downtimeEvents.reduce((acc, event) => {
    if (!acc[event.costCode]) {
      acc[event.costCode] = {
        name: event.costCodeName,
        total: 0,
        events: 0,
      };
    }
    acc[event.costCode].total += event.totalCost;
    acc[event.costCode].events += 1;
    return acc;
  }, {} as Record<string, { name: string; total: number; events: number }>);

  const selectedEventData = selectedEvent 
    ? downtimeEvents.find(e => e.id === selectedEvent)
    : null;

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="h-[80px] bg-card border-b-4 border-primary px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div>
            <h2 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xl)' }}>
              Asset Diagnostics & Cost Attribution
            </h2>
            <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
              {assetName} • ${(assetValue / 1000000).toFixed(1)}M Asset • Live CAN-bus telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Period Selector */}
          <div className="flex items-center gap-2 bg-muted rounded-full p-1">
            {(['today', 'week', 'month'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`min-h-[44px] px-4 py-2 rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] transition-colors ${
                  selectedPeriod === period
                    ? 'bg-primary text-white'
                    : 'text-foreground hover:bg-accent'
                }`}
                style={{ fontSize: 'var(--text-sm)' }}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button className="min-w-[60px] min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] bg-card border-2 border-border hover:bg-accent transition-colors flex items-center gap-2">
            <Download className="w-5 h-5 text-foreground" />
            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
              Export
            </span>
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="min-w-[60px] min-h-[60px] rounded-full bg-destructive/10 hover:bg-destructive/20 transition-colors flex items-center justify-center"
            title="Close Diagnostics"
          >
            <X className="w-6 h-6 text-destructive" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - CAN-bus & Utilization */}
        <div className="w-[480px] bg-card border-r-2 border-border overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Utilization Summary */}
            <div>
              <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-4" style={{ fontSize: 'var(--text-lg)' }}>
                Asset Utilization
              </h3>

              {/* Utilization Rate Circle */}
              <div className="flex items-center gap-6 mb-6">
                <div className="min-w-[120px] min-h-[120px] rounded-full flex items-center justify-center relative"
                  style={{
                    background: `conic-gradient(
                      ${utilizationRate < 70 ? 'var(--destructive)' : utilizationRate < 85 ? 'var(--color-warning)' : 'var(--color-success)'} ${utilizationRate * 3.6}deg,
                      var(--muted) ${utilizationRate * 3.6}deg
                    )`
                  }}
                >
                  <div className="w-[104px] h-[104px] rounded-full bg-card flex flex-col items-center justify-center">
                    <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]"
                      style={{
                        fontSize: 'var(--text-3xl)',
                        color: utilizationRate < 70 ? 'var(--destructive)' : utilizationRate < 85 ? 'var(--color-warning)' : 'var(--color-success)'
                      }}
                    >
                      {utilizationRate.toFixed(1)}%
                    </div>
                    <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                      UTILIZATION
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                        Active Time
                      </span>
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                        {Math.floor(activeMinutes / 60)}h {activeMinutes % 60}m
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                        Planned Maint.
                      </span>
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-color-warning" style={{ fontSize: 'var(--text-sm)' }}>
                        {Math.floor(plannedDowntime / 60)}h {plannedDowntime % 60}m
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                        Unplanned Down
                      </span>
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                        {Math.floor(unplannedDowntime / 60)}h {unplannedDowntime % 60}m
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Idle Cost Alert */}
              {totalIdleCost > 0 && (
                <div className="p-4 rounded-[var(--radius-card)] bg-destructive/10 border-2 border-destructive">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-destructive" />
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-base)' }}>
                      Systemic Friction - Contingency Drain
                    </span>
                  </div>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive mb-1" style={{ fontSize: 'var(--text-3xl)' }}>
                    ${totalIdleCost.toLocaleString()}
                  </div>
                  <p className="text-destructive/80 font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                    Lost to unplanned downtime • ${(totalIdleCost / (unplannedDowntime / 60)).toFixed(2)}/hour drain rate
                  </p>
                </div>
              )}
            </div>

            {/* CAN-bus Telemetry */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                  CAN-bus Telemetry
                </h3>
                <div className={`px-3 py-1 rounded-full flex items-center gap-2 ${
                  canBusData.status === 'healthy' 
                    ? 'bg-color-success/10 border border-color-success' 
                    : canBusData.status === 'warning'
                    ? 'bg-color-warning/10 border border-color-warning'
                    : 'bg-destructive/10 border border-destructive'
                }`}>
                  <Activity className={`w-4 h-4 ${
                    canBusData.status === 'healthy' ? 'text-color-success' : canBusData.status === 'warning' ? 'text-color-warning' : 'text-destructive'
                  }`} />
                  <span className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                    canBusData.status === 'healthy' ? 'text-color-success' : canBusData.status === 'warning' ? 'text-color-warning' : 'text-destructive'
                  }`} style={{ fontSize: 'var(--text-xs)' }}>
                    {canBusData.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {/* Engine RPM */}
                <div className="p-4 bg-muted rounded-[var(--radius-card)] border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Gauge className="w-5 h-5 text-foreground" />
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                        Engine RPM
                      </span>
                    </div>
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                      {canBusData.engineRPM}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(canBusData.engineRPM / 2400) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Engine Temperature */}
                <div className="p-4 bg-muted rounded-[var(--radius-card)] border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-5 h-5 text-foreground" />
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                        Engine Temp
                      </span>
                    </div>
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                      {canBusData.engineTemp}°F
                    </span>
                  </div>
                  <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all"
                      style={{ 
                        width: `${(canBusData.engineTemp / 220) * 100}%`,
                        backgroundColor: canBusData.engineTemp > 210 ? 'var(--destructive)' : canBusData.engineTemp > 200 ? 'var(--color-warning)' : 'var(--color-success)'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Hydraulic Pressure */}
                <div className="p-4 bg-muted rounded-[var(--radius-card)] border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Droplet className="w-5 h-5 text-foreground" />
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                        Hydraulic Pressure
                      </span>
                    </div>
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                      {canBusData.hydraulicPressure} PSI
                    </span>
                  </div>
                  <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-color-success transition-all"
                      style={{ width: `${(canBusData.hydraulicPressure / 4000) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Fuel Level */}
                <div className="p-4 bg-muted rounded-[var(--radius-card)] border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-foreground" />
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                        Fuel Level
                      </span>
                    </div>
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                      {canBusData.fuelLevel}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all"
                      style={{ 
                        width: `${canBusData.fuelLevel}%`,
                        backgroundColor: canBusData.fuelLevel < 20 ? 'var(--destructive)' : canBusData.fuelLevel < 40 ? 'var(--color-warning)' : 'var(--color-success)'
                      }}
                    ></div>
                  </div>
                </div>

                {/* Battery Voltage */}
                <div className="p-4 bg-muted rounded-[var(--radius-card)] border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Battery className="w-5 h-5 text-foreground" />
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                        Battery Voltage
                      </span>
                    </div>
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                      {canBusData.batteryVoltage}V
                    </span>
                  </div>
                  <div className="w-full h-2 bg-background rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-color-success transition-all"
                      style={{ width: `${(canBusData.batteryVoltage / 14.4) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Diagnostic Codes */}
              {canBusData.diagnosticCodes.length > 0 && (
                <div className="mt-4 p-4 bg-color-warning/10 rounded-[var(--radius-card)] border-2 border-color-warning">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-color-warning" />
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-color-warning" style={{ fontSize: 'var(--text-sm)' }}>
                      Active Diagnostic Codes
                    </span>
                  </div>
                  <div className="space-y-2">
                    {canBusData.diagnosticCodes.map((code, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                          {code}
                        </span>
                        <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                          {code === 'P0128' ? 'Coolant Temp Below Threshold' : 'ABS Module Fault'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Operating Hours */}
              <div className="mt-4 p-3 bg-background rounded-[var(--radius-card)] border border-border flex justify-between items-center">
                <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  Total Operating Hours
                </span>
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                  {canBusData.operatingHours.toLocaleString()} hrs
                </span>
              </div>
            </div>

            {/* Cost Code Attribution Summary */}
            <div>
              <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-4" style={{ fontSize: 'var(--text-lg)' }}>
                Cost Code Attribution
              </h3>
              <div className="space-y-2">
                {Object.entries(costsByCode).map(([code, data]) => (
                  <div key={code} className="p-3 bg-muted rounded-[var(--radius-card)] border border-border">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                        {code}
                      </span>
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-base)' }}>
                        ${data.total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                        {data.name}
                      </span>
                      <span className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                        {data.events} event{data.events > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Center - Downtime Event Timeline */}
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                Downtime Event Timeline
              </h3>

              {/* Event Filter */}
              <div className="flex items-center gap-2 bg-muted rounded-full p-1">
                {(['all', 'planned', 'unplanned'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`min-h-[44px] px-4 py-2 rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] transition-colors ${
                      filterType === type
                        ? 'bg-primary text-white'
                        : 'text-foreground hover:bg-accent'
                    }`}
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Event List */}
            <div className="space-y-4">
              {filteredEvents.map((event) => {
                const isSelected = selectedEvent === event.id;
                const hoursAgo = Math.round((Date.now() - event.timestamp.getTime()) / (1000 * 60 * 60));

                return (
                  <button
                    key={event.id}
                    onClick={() => setSelectedEvent(isSelected ? null : event.id)}
                    className={`w-full p-5 rounded-[var(--radius-card)] border-2 transition-all text-left ${
                      isSelected
                        ? 'border-primary bg-accent shadow-[var(--elevation-md)]'
                        : event.type === 'unplanned'
                        ? 'border-destructive/30 bg-card hover:border-destructive/50'
                        : 'border-border bg-card hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        {event.type === 'planned' ? (
                          <Calendar className="w-5 h-5 text-color-warning flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                        )}
                        <div>
                          <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontSize: 'var(--text-base)' }}>
                            {event.reason}
                          </div>
                          <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                            {hoursAgo} hours ago • {event.duration} minutes
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive mb-1" style={{ fontSize: 'var(--text-lg)' }}>
                          ${event.totalCost.toLocaleString()}
                        </div>
                        <div className={`px-3 py-1 rounded-full inline-block ${
                          event.type === 'planned' 
                            ? 'bg-color-warning/20 text-color-warning' 
                            : 'bg-destructive/20 text-destructive'
                        }`}>
                          <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xs)' }}>
                            {event.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-muted-foreground mb-3">
                      <div className="flex items-center gap-1.5">
                        <FileText className="w-4 h-4" />
                        <span className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                          {event.costCode}
                        </span>
                      </div>
                      <span className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                        {event.costCodeName}
                      </span>
                    </div>

                    {event.contextActivity && (
                      <div className="p-3 bg-muted/50 rounded border border-border mb-3">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Context During Failure:
                        </div>
                        <div className="font-[family-name:var(--font-family)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                          {event.contextActivity}
                        </div>
                      </div>
                    )}

                    {/* Cost Breakdown */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-2 bg-background rounded">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Labor
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                          ${event.laborCost.toFixed(2)}
                        </div>
                      </div>
                      <div className="p-2 bg-background rounded">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Parts
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                          ${event.equipmentCost.toFixed(2)}
                        </div>
                      </div>
                      <div className="p-2 bg-background rounded">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Delay Cost
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                          ${event.delayCost.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {isSelected && event.notes && (
                      <div className="mt-4 p-4 bg-accent rounded-[var(--radius-card)] border border-border">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-xs)' }}>
                          Notes:
                        </div>
                        <p className="font-[family-name:var(--font-family)] text-foreground mb-3" style={{ fontSize: 'var(--text-sm)' }}>
                          {event.notes}
                        </p>
                        {event.resolvedBy && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="w-4 h-4" />
                            <span className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                              Resolved by: {event.resolvedBy}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-color-success mx-auto mb-4" />
                <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-base)' }}>
                  No {filterType !== 'all' ? filterType : ''} downtime events to display
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Insights */}
        <div className="w-[360px] bg-card border-l-2 border-border overflow-y-auto">
          <div className="p-6 space-y-6">
            <div>
              <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-4" style={{ fontSize: 'var(--text-lg)' }}>
                Bid Refinement Insights
              </h3>

              <div className="space-y-4">
                {/* Rock Blasting Insight */}
                <div className="p-4 bg-destructive/10 rounded-[var(--radius-card)] border-2 border-destructive">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                      Rock-Heavy Site Pattern
                    </span>
                  </div>
                  <p className="text-foreground font-[family-name:var(--font-family)] mb-3" style={{ fontSize: 'var(--text-sm)' }}>
                    CSI 31 23 16 (Rock Blasting) shows 2 failures totaling $3,156. High-pressure operations correlate with equipment stress.
                  </p>
                  <div className="p-2 bg-destructive/20 rounded">
                    <p className="text-destructive font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xs)' }}>
                      ⚠ Recommend +15% contingency on future rock excavation bids
                    </p>
                  </div>
                </div>

                {/* Heat Advisory Pattern */}
                <div className="p-4 bg-color-warning/10 rounded-[var(--radius-card)] border-2 border-color-warning">
                  <div className="flex items-center gap-2 mb-3">
                    <Thermometer className="w-5 h-5 text-color-warning" />
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-color-warning" style={{ fontSize: 'var(--text-sm)' }}>
                      Environmental Factor
                    </span>
                  </div>
                  <p className="text-foreground font-[family-name:var(--font-family)] mb-3" style={{ fontSize: 'var(--text-sm)' }}>
                    75-minute heat advisory shutdown cost $1,265. Summer projects require operator relief planning.
                  </p>
                  <div className="p-2 bg-color-warning/20 rounded">
                    <p className="text-color-warning font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xs)' }}>
                      💡 Factor heat breaks into summer schedule estimates
                    </p>
                  </div>
                </div>

                {/* Maintenance Efficiency */}
                <div className="p-4 bg-color-success/10 rounded-[var(--radius-card)] border-2 border-color-success">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-color-success" />
                    <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-color-success" style={{ fontSize: 'var(--text-sm)' }}>
                      Planned Maintenance On Track
                    </span>
                  </div>
                  <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                    30-minute scheduled filter change stayed within budget. Preventive maintenance preventing larger failures.
                  </p>
                </div>

                {/* Summary Stats */}
                <div className="p-4 bg-muted rounded-[var(--radius-card)] border border-border">
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-3" style={{ fontSize: 'var(--text-sm)' }}>
                    Key Metrics
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                        Avg Unplanned Event Cost
                      </span>
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                        ${(totalIdleCost / downtimeEvents.filter(e => e.type === 'unplanned').length).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                        Total Events Today
                      </span>
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                        {downtimeEvents.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                        Asset Value at Risk
                      </span>
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-primary" style={{ fontSize: 'var(--text-sm)' }}>
                        ${(assetValue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
