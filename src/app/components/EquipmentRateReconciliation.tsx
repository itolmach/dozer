import { useState } from 'react';
import { 
  DollarSign, 
  AlertTriangle, 
  Database, 
  Radio, 
  CheckCircle,
  Info,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  LucideIcon
} from 'lucide-react';

interface RateSource {
  name: 'erp' | 'telematics' | 'manual';
  label: string;
  rate: number;
  lastUpdated: string;
  confidence: 'high' | 'medium' | 'low';
  icon: LucideIcon;
}

interface EquipmentRateReconciliationProps {
  assetName: string;
  currentSource: 'erp' | 'telematics' | 'manual';
  currentRate: number;
  onSourceChange: (source: 'erp' | 'telematics' | 'manual') => void;
  onRateChange: (rate: number) => void;
}

export function EquipmentRateReconciliation({
  assetName,
  currentSource,
  currentRate,
  onSourceChange,
  onRateChange
}: EquipmentRateReconciliationProps) {
  const [autoResolveEnabled, setAutoResolveEnabled] = useState(true);
  const [prioritySource, setPrioritySource] = useState<'erp' | 'telematics' | 'manual'>('erp');
  const [manualRate, setManualRate] = useState(currentRate);
  const [showDiscrepancyDetails, setShowDiscrepancyDetails] = useState(true);

  // Mock rate data from different sources
  const rateSources: RateSource[] = [
    {
      name: 'erp',
      label: 'ERP System (P6/SAP)',
      rate: 285.00,
      lastUpdated: '2 hours ago',
      confidence: 'high',
      icon: Database
    },
    {
      name: 'telematics',
      label: 'JDLink Telematics',
      rate: 310.00,
      lastUpdated: '15 minutes ago',
      confidence: 'high',
      icon: Radio
    },
    {
      name: 'manual',
      label: 'Manual Override',
      rate: manualRate,
      lastUpdated: 'Just now',
      confidence: 'medium',
      icon: Settings
    }
  ];

  const erpRate = rateSources.find(s => s.name === 'erp')!;
  const telematicsRate = rateSources.find(s => s.name === 'telematics')!;
  
  const discrepancy = Math.abs(erpRate.rate - telematicsRate.rate);
  const discrepancyPercent = (discrepancy / erpRate.rate) * 100;
  const hasDiscrepancy = discrepancyPercent > 5; // 5% threshold

  const selectedSource = rateSources.find(s => s.name === currentSource)!;

  const handleApplySource = (source: 'erp' | 'telematics' | 'manual') => {
    const sourceData = rateSources.find(s => s.name === source)!;
    onSourceChange(source);
    onRateChange(sourceData.rate);
  };

  const handleSyncRates = () => {
    // In real app, this would fetch latest rates from both systems
    console.log('Syncing rates from all sources...');
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-2" style={{ fontSize: 'var(--text-2xl)' }}>
          Equipment Rate Management
        </h3>
        <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-base)' }}>
          Reconcile hourly rates between ERP and telematics systems for {assetName}
        </p>
      </div>

      {/* Discrepancy Alert */}
      {hasDiscrepancy && (
        <div className="mb-8 p-6 bg-color-warning/10 rounded-[var(--radius-card)] border-4 border-color-warning">
          <div className="flex items-start gap-4">
            <div className="min-w-[60px] min-h-[60px] rounded-full bg-color-warning/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-8 h-8 text-color-warning" />
            </div>
            <div className="flex-1">
              <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-color-warning mb-3" style={{ fontSize: 'var(--text-xl)' }}>
                Rate Discrepancy Detected
              </h4>
              <p className="text-foreground font-[family-name:var(--font-family)] mb-4" style={{ fontSize: 'var(--text-base)' }}>
                Equipment rate differs by <span className="font-[var(--font-weight-semibold)]">${discrepancy.toFixed(2)}/hr ({discrepancyPercent.toFixed(1)}%)</span> between 
                ERP System and JDLink Telematics. This affects cost tracking accuracy and invoice generation.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowDiscrepancyDetails(!showDiscrepancyDetails)}
                  className="min-h-[60px] px-6 rounded-[var(--radius-button)] bg-color-warning text-white hover:opacity-90 transition-opacity"
                >
                  <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                    {showDiscrepancyDetails ? 'Hide' : 'Show'} Details
                  </span>
                </button>
                <button
                  onClick={handleSyncRates}
                  className="min-h-[60px] px-6 rounded-[var(--radius-button)] bg-background text-foreground border-2 border-border hover:border-color-warning transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                    Sync All Rates
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Auto-Resolve Settings */}
      <div className="mb-8 p-6 bg-muted/50 rounded-[var(--radius-card)] border-2 border-border">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-2" style={{ fontSize: 'var(--text-lg)' }}>
              Automatic Discrepancy Resolution
            </h4>
            <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
              When enabled, system will automatically use the priority source when discrepancies are detected
            </p>
          </div>
          <button
            onClick={() => setAutoResolveEnabled(!autoResolveEnabled)}
            className={`min-w-[100px] min-h-[60px] px-6 rounded-full transition-all flex items-center justify-between gap-3 ${
              autoResolveEnabled
                ? 'bg-color-success text-white'
                : 'bg-muted text-muted-foreground border-2 border-border'
            }`}
          >
            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
              {autoResolveEnabled ? 'ON' : 'OFF'}
            </span>
            <div className={`w-8 h-8 rounded-full transition-all ${
              autoResolveEnabled ? 'bg-white' : 'bg-border'
            }`} />
          </button>
        </div>

        {autoResolveEnabled && (
          <div className="pt-4 border-t-2 border-border">
            <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-3" style={{ fontSize: 'var(--text-base)' }}>
              Priority Source (Always Use)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['erp', 'telematics', 'manual'].map((source) => {
                const sourceData = rateSources.find(s => s.name === source)!;
                return (
                  <button
                    key={source}
                    onClick={() => setPrioritySource(source as typeof prioritySource)}
                    className={`min-h-[80px] p-4 rounded-[var(--radius-button)] border-4 transition-all ${
                      prioritySource === source
                        ? 'bg-primary/10 border-primary'
                        : 'bg-background border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <sourceData.icon className={`w-5 h-5 ${prioritySource === source ? 'text-primary' : 'text-muted-foreground'}`} />
                      {prioritySource === source && <CheckCircle className="w-5 h-5 text-primary ml-auto" />}
                    </div>
                    <div className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                      prioritySource === source ? 'text-primary' : 'text-foreground'
                    }`} style={{ fontSize: 'var(--text-sm)' }}>
                      {sourceData.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Rate Source Comparison */}
      {showDiscrepancyDetails && (
        <div className="mb-8">
          <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-4" style={{ fontSize: 'var(--text-lg)' }}>
            Rate Source Comparison
          </h4>

          <div className="grid grid-cols-3 gap-6">
            {rateSources.map(source => {
              const isActive = currentSource === source.name;
              const isPriority = prioritySource === source.name && autoResolveEnabled;
              const rateVariance = source.rate - erpRate.rate;
              const rateVariancePercent = (rateVariance / erpRate.rate) * 100;

              return (
                <div
                  key={source.name}
                  className={`p-6 rounded-[var(--radius-card)] border-4 transition-all ${
                    isActive
                      ? 'bg-primary/10 border-primary'
                      : 'bg-background border-border'
                  }`}
                >
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`min-w-[50px] min-h-[50px] rounded-full flex items-center justify-center ${
                      isActive ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <source.icon className={`w-6 h-6 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                        {source.label}
                      </div>
                    </div>
                  </div>

                  {/* Rate Display */}
                  <div className="mb-4">
                    <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                      Hourly Rate
                    </div>
                    {source.name === 'manual' ? (
                      <input
                        type="number"
                        value={manualRate}
                        onChange={(e) => setManualRate(Number(e.target.value))}
                        className="w-full min-h-[60px] px-4 bg-background rounded-[var(--radius-button)] border-2 border-border focus:border-primary focus:outline-none font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground"
                        style={{ fontSize: 'var(--text-xl)' }}
                        step="0.01"
                      />
                    ) : (
                      <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
                        ${source.rate.toFixed(2)}
                      </div>
                    )}
                  </div>

                  {/* Variance */}
                  {source.name !== 'erp' && (
                    <div className="mb-4 p-3 bg-muted rounded-[var(--radius-button)]">
                      <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                        vs ERP System
                      </div>
                      <div className={`flex items-center gap-2 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                        rateVariance > 0 ? 'text-destructive' : rateVariance < 0 ? 'text-color-success' : 'text-foreground'
                      }`} style={{ fontSize: 'var(--text-base)' }}>
                        {rateVariance > 0 ? (
                          <>
                            <TrendingUp className="w-4 h-4" />
                            <span>+${Math.abs(rateVariance).toFixed(2)} ({rateVariancePercent.toFixed(1)}%)</span>
                          </>
                        ) : rateVariance < 0 ? (
                          <>
                            <TrendingDown className="w-4 h-4" />
                            <span>-${Math.abs(rateVariance).toFixed(2)} ({Math.abs(rateVariancePercent).toFixed(1)}%)</span>
                          </>
                        ) : (
                          <span>No variance</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Metadata */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                        Last Updated
                      </span>
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xs)' }}>
                        {source.lastUpdated}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                        Confidence
                      </span>
                      <div className={`px-2 py-1 rounded-full ${
                        source.confidence === 'high'
                          ? 'bg-color-success/20 text-color-success'
                          : source.confidence === 'medium'
                          ? 'bg-color-warning/20 text-color-warning'
                          : 'bg-destructive/20 text-destructive'
                      }`}>
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] uppercase" style={{ fontSize: 'var(--text-xs)' }}>
                          {source.confidence}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {isActive && (
                      <div className="px-3 py-1 bg-primary rounded-full">
                        <span className="text-white font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xs)' }}>
                          ACTIVE
                        </span>
                      </div>
                    )}
                    {isPriority && (
                      <div className="px-3 py-1 bg-color-success rounded-full">
                        <span className="text-white font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xs)' }}>
                          PRIORITY
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleApplySource(source.name)}
                    disabled={isActive}
                    className={`w-full min-h-[60px] px-6 rounded-[var(--radius-button)] font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] transition-opacity ${
                      isActive
                        ? 'bg-muted text-muted-foreground cursor-not-allowed'
                        : 'bg-primary text-white hover:opacity-90'
                    }`}
                    style={{ fontSize: 'var(--text-base)' }}
                  >
                    {isActive ? 'Currently Active' : 'Use This Rate'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Impact Analysis */}
      <div className="p-6 bg-primary/10 rounded-[var(--radius-card)] border-2 border-primary/30">
        <div className="flex items-start gap-3">
          <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
          <div>
            <h5 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-2" style={{ fontSize: 'var(--text-base)' }}>
              Why Rate Discrepancies Matter
            </h5>
            <p className="text-foreground font-[family-name:var(--font-family)] mb-3" style={{ fontSize: 'var(--text-sm)' }}>
              Equipment rates affect multiple business-critical functions:
            </p>
            <ul className="space-y-2 text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><span className="font-[var(--font-weight-semibold)]">Cost Tracking:</span> Downtime and idle time costs are calculated using hourly rates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><span className="font-[var(--font-weight-semibold)]">Invoice Generation:</span> Progress payment claims multiply hours by rate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><span className="font-[var(--font-weight-semibold)]">Future Bidding:</span> Post-mortem analysis uses rates to refine future estimates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                <span><span className="font-[var(--font-weight-semibold)]">Financial Reporting:</span> Asset utilization metrics require accurate rate data</span>
              </li>
            </ul>
            <p className="text-foreground font-[family-name:var(--font-family)] mt-3" style={{ fontSize: 'var(--text-sm)' }}>
              A ${discrepancy.toFixed(2)}/hr discrepancy on an asset running 2,000 hours annually equals 
              <span className="font-[var(--font-weight-semibold)]"> ${(discrepancy * 2000).toLocaleString()}</span> in cost tracking variance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}