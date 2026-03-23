import { useState } from 'react';
import { Calculator, TrendingUp, TrendingDown, Info, Layers } from 'lucide-react';

export function CubicYardsReconciliation() {
  const [bankCY, setBankCY] = useState(10235);
  const [looseCY, setLooseCY] = useState(14830);
  const [soilType, setSoilType] = useState<'clay' | 'sand' | 'rock'>('clay');

  // Swell factors (typical civil engineering values)
  const swellFactors = {
    clay: 1.40,      // Clay swells 40% when excavated
    sand: 1.12,      // Sand swells 12%
    rock: 1.65       // Rock swells 65%
  };

  const currentSwellFactor = swellFactors[soilType];
  const calculatedLooseCY = Math.round(bankCY * currentSwellFactor);
  const actualSwellFactor = looseCY / bankCY;
  const swellVariance = ((actualSwellFactor - currentSwellFactor) / currentSwellFactor) * 100;
  const volumeDiscrepancy = looseCY - calculatedLooseCY;
  const billableAmount = bankCY * 14.68; // Using actual unit cost from Hard Clay

  return (
    <div className="mt-8 p-8 bg-muted/30 rounded-[var(--radius-card)] border-4 border-border">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="min-w-[70px] min-h-[70px] rounded-full bg-foreground/10 flex items-center justify-center">
          <Calculator className="w-8 h-8 text-foreground" />
        </div>
        <div>
          <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontSize: 'var(--text-xl)' }}>
            Cubic Yards Reconciliation Calculator
          </h4>
          <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
            Compare Bank CY (in-place) vs Loose CY (excavated) to account for soil settlement
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-primary/10 rounded-[var(--radius-card)] border-2 border-primary/30">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
            <span className="font-[var(--font-weight-semibold)]">Billing Note:</span> Contractors bill on <span className="font-[var(--font-weight-semibold)]">Bank Cubic Yards</span> (in-place volume), not Loose CY. Excavated material swells due to air voids. This calculator reconciles GPS-measured loose volume back to billable bank volume.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Soil Type Selection */}
          <div>
            <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-3" style={{ fontSize: 'var(--text-base)' }}>
              Soil/Material Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'clay' as const, label: 'Hard Clay', factor: '40%' },
                { value: 'sand' as const, label: 'Sand/Gravel', factor: '12%' },
                { value: 'rock' as const, label: 'Rock', factor: '65%' }
              ].map(soil => (
                <button
                  key={soil.value}
                  onClick={() => setSoilType(soil.value)}
                  className={`min-h-[80px] p-3 rounded-[var(--radius-button)] border-2 transition-all ${
                    soilType === soil.value
                      ? 'bg-primary border-primary text-white'
                      : 'bg-background border-border text-foreground hover:border-primary'
                  }`}
                >
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-1" style={{ fontSize: 'var(--text-base)' }}>
                    {soil.label}
                  </div>
                  <div className={`font-[family-name:var(--font-family)] ${
                    soilType === soil.value ? 'text-white/80' : 'text-muted-foreground'
                  }`} style={{ fontSize: 'var(--text-xs)' }}>
                    {soil.factor} swell
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bank CY Input */}
          <div>
            <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-3" style={{ fontSize: 'var(--text-base)' }}>
              Bank Cubic Yards (In-Place)
            </label>
            <div className="relative">
              <input
                type="number"
                value={bankCY}
                onChange={(e) => setBankCY(Number(e.target.value))}
                className="w-full min-h-[70px] px-6 bg-background rounded-[var(--radius-button)] border-4 border-border focus:border-primary focus:outline-none font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground"
                style={{ fontSize: 'var(--text-2xl)' }}
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-lg)' }}>
                CY
              </div>
            </div>
            <p className="text-muted-foreground font-[family-name:var(--font-family)] mt-2" style={{ fontSize: 'var(--text-xs)' }}>
              Undisturbed volume before excavation (billable quantity)
            </p>
          </div>

          {/* Loose CY Input */}
          <div>
            <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-3" style={{ fontSize: 'var(--text-base)' }}>
              Loose Cubic Yards (Excavated)
            </label>
            <div className="relative">
              <input
                type="number"
                value={looseCY}
                onChange={(e) => setLooseCY(Number(e.target.value))}
                className="w-full min-h-[70px] px-6 bg-background rounded-[var(--radius-button)] border-4 border-border focus:border-primary focus:outline-none font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground"
                style={{ fontSize: 'var(--text-2xl)' }}
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-lg)' }}>
                LCY
              </div>
            </div>
            <p className="text-muted-foreground font-[family-name:var(--font-family)] mt-2" style={{ fontSize: 'var(--text-xs)' }}>
              GPS-measured volume in truck beds (swelled state)
            </p>
          </div>
        </div>

        {/* Right Column - Calculations */}
        <div className="space-y-4">
          {/* Swell Factor Indicator */}
          <div className="p-6 bg-background rounded-[var(--radius-card)] border-2 border-border">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                Standard Swell Factor ({soilType === 'clay' ? 'Hard Clay' : soilType === 'sand' ? 'Sand/Gravel' : 'Rock'})
              </span>
            </div>
            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground" style={{ fontSize: 'var(--text-3xl)' }}>
              {currentSwellFactor.toFixed(2)}x
            </div>
            <div className="text-muted-foreground font-[family-name:var(--font-family)] mt-1" style={{ fontSize: 'var(--text-xs)' }}>
              Industry standard for {soilType === 'clay' ? 'clay' : soilType === 'sand' ? 'sand/gravel' : 'rock'} materials
            </div>
          </div>

          {/* Expected vs Actual Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-[var(--radius-card)] border-2 border-border">
              <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-xs)' }}>
                Expected Loose CY
              </div>
              <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xl)' }}>
                {calculatedLooseCY.toLocaleString()}
              </div>
            </div>

            <div className="p-4 bg-muted rounded-[var(--radius-card)] border-2 border-border">
              <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-xs)' }}>
                Actual Loose CY
              </div>
              <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xl)' }}>
                {looseCY.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Actual Swell Factor */}
          <div className={`p-6 rounded-[var(--radius-card)] border-2 ${
            Math.abs(swellVariance) > 10
              ? 'bg-color-warning/10 border-color-warning'
              : 'bg-color-success/10 border-color-success'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                Actual Swell Factor
              </span>
              {Math.abs(swellVariance) > 10 ? (
                <TrendingUp className="w-5 h-5 text-color-warning" />
              ) : (
                <TrendingDown className="w-5 h-5 text-color-success" />
              )}
            </div>
            <div className={`font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] ${
              Math.abs(swellVariance) > 10 ? 'text-color-warning' : 'text-color-success'
            }`} style={{ fontSize: 'var(--text-3xl)' }}>
              {actualSwellFactor.toFixed(2)}x
            </div>
            <div className="text-foreground font-[family-name:var(--font-family)] mt-1" style={{ fontSize: 'var(--text-sm)' }}>
              {swellVariance > 0 ? '+' : ''}{swellVariance.toFixed(1)}% variance from standard
            </div>
          </div>

          {/* Volume Discrepancy */}
          <div className="p-6 bg-background rounded-[var(--radius-card)] border-2 border-border">
            <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-3" style={{ fontSize: 'var(--text-sm)' }}>
              Volume Discrepancy
            </div>
            <div className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
              volumeDiscrepancy > 0 ? 'text-destructive' : 'text-color-success'
            }`} style={{ fontSize: 'var(--text-2xl)' }}>
              {volumeDiscrepancy > 0 ? '+' : ''}{volumeDiscrepancy.toLocaleString()} LCY
            </div>
            <p className="text-muted-foreground font-[family-name:var(--font-family)] mt-2" style={{ fontSize: 'var(--text-xs)' }}>
              {volumeDiscrepancy > 0 
                ? 'More volume measured than expected - may indicate looser material or measurement variance'
                : 'Less volume measured than expected - material may be more compacted'}
            </p>
          </div>

          {/* Billable Amount */}
          <div className="p-6 bg-primary/10 rounded-[var(--radius-card)] border-4 border-primary">
            <div className="flex items-center justify-between mb-3">
              <span className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                Billable Amount
              </span>
              <div className="px-3 py-1 bg-primary rounded-full">
                <span className="text-white font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xs)' }}>
                  BANK CY
                </span>
              </div>
            </div>
            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-primary" style={{ fontSize: 'var(--text-3xl)' }}>
              ${billableAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-foreground font-[family-name:var(--font-family)] mt-2" style={{ fontSize: 'var(--text-sm)' }}>
              {bankCY.toLocaleString()} Bank CY × $14.68/CY
            </div>
          </div>

          {/* Reconciliation Summary */}
          <div className="p-4 bg-muted rounded-[var(--radius-card)] border-2 border-border">
            <h6 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-3" style={{ fontSize: 'var(--text-sm)' }}>
              Reconciliation Summary
            </h6>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                  Bank Volume (Billable):
                </span>
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xs)' }}>
                  {bankCY.toLocaleString()} CY
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                  Loose Volume (Measured):
                </span>
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xs)' }}>
                  {looseCY.toLocaleString()} LCY
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                  Swell Factor:
                </span>
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xs)' }}>
                  {actualSwellFactor.toFixed(2)}x
                </span>
              </div>
              <div className="h-px bg-border my-2"></div>
              <div className="flex items-center justify-between">
                <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xs)' }}>
                  Invoice Total:
                </span>
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-primary" style={{ fontSize: 'var(--text-sm)' }}>
                  ${billableAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Note */}
      <div className="mt-6 p-4 bg-primary/10 rounded-[var(--radius-card)] border-2 border-primary/30">
        <div className="flex items-start gap-3">
          <Calculator className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h6 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontSize: 'var(--text-sm)' }}>
              Why This Matters
            </h6>
            <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
              GPS telemetry measures <span className="font-[var(--font-weight-semibold)]">Loose Cubic Yards</span> (excavated material in trucks/stockpiles), which includes air voids. 
              Contract pay items are based on <span className="font-[var(--font-weight-semibold)]">Bank Cubic Yards</span> (in-place volume). This calculator converts GPS measurements to billable quantities using 
              industry-standard swell factors, ensuring invoices accurately reflect the undisturbed volume excavated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
