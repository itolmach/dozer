import { useState } from 'react';
import { Percent, Calculator, Info, CheckCircle } from 'lucide-react';

interface PartialVerificationModuleProps {
  totalActualCost: number;
  costCodeData: Array<{
    code: string;
    name: string;
    actualQuantity: number;
    bidUnit: string;
    actualUnitCost: number;
    actualTotalCost: number;
  }>;
}

export function PartialVerificationModule({ totalActualCost, costCodeData }: PartialVerificationModuleProps) {
  const [verificationPercentage, setVerificationPercentage] = useState(90);
  const [selectedCostCode, setSelectedCostCode] = useState(costCodeData[0]?.code || '');

  const selectedCode = costCodeData.find(c => c.code === selectedCostCode);
  const partialValue = selectedCode ? (selectedCode.actualTotalCost * verificationPercentage) / 100 : 0;
  const unverifiedValue = selectedCode ? selectedCode.actualTotalCost - partialValue : 0;

  return (
    <div className="mt-8 p-8 bg-muted/30 rounded-[var(--radius-card)] border-4 border-primary">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="min-w-[70px] min-h-[70px] rounded-full bg-primary/20 flex items-center justify-center">
          <Percent className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontSize: 'var(--text-xl)' }}>
            Partial Verification Input
          </h4>
          <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
            Claim partial yardage when survey confirmation is pending
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-primary/10 rounded-[var(--radius-card)] border-2 border-primary/30">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
            <span className="font-[var(--font-weight-semibold)]">Quantity Surveyor Note:</span> Use partial verification when GPS data shows yardage moved but final survey confirmation is still in progress. Typical practice is to claim 85-95% until full verification is complete.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Input Controls */}
        <div className="space-y-6">
          {/* Cost Code Selection */}
          <div>
            <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-3" style={{ fontSize: 'var(--text-base)' }}>
              Select Cost Code
            </label>
            <select
              value={selectedCostCode}
              onChange={(e) => setSelectedCostCode(e.target.value)}
              className="w-full min-h-[70px] px-6 bg-background rounded-[var(--radius-button)] border-4 border-border focus:border-primary focus:outline-none font-[family-name:var(--font-family)] text-foreground"
              style={{ fontSize: 'var(--text-lg)' }}
            >
              {costCodeData.map(code => (
                <option key={code.code} value={code.code}>
                  {code.code} - {code.name}
                </option>
              ))}
            </select>
          </div>

          {/* Percentage Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                Verification Percentage
              </label>
              <div className="px-4 py-2 bg-primary rounded-full">
                <span className="text-white font-[family-name:var(--font-family)] font-[var(--font-weight-bold)]" style={{ fontSize: 'var(--text-xl)' }}>
                  {verificationPercentage}%
                </span>
              </div>
            </div>
            
            <input
              type="range"
              min="50"
              max="100"
              value={verificationPercentage}
              onChange={(e) => setVerificationPercentage(Number(e.target.value))}
              className="w-full h-4 bg-muted rounded-full appearance-none cursor-pointer"
              style={{
                accentColor: 'var(--primary)'
              }}
            />
            
            <div className="flex items-center justify-between mt-2">
              <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                50% (Conservative)
              </span>
              <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                100% (Full)
              </span>
            </div>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-3" style={{ fontSize: 'var(--text-base)' }}>
              Quick Presets
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[85, 90, 95].map(preset => (
                <button
                  key={preset}
                  onClick={() => setVerificationPercentage(preset)}
                  className={`min-h-[60px] px-4 rounded-[var(--radius-button)] border-2 transition-all ${
                    verificationPercentage === preset
                      ? 'bg-primary border-primary text-white'
                      : 'bg-background border-border text-foreground hover:border-primary'
                  }`}
                >
                  <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-lg)' }}>
                    {preset}%
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Calculated Results */}
        <div className="space-y-4">
          <div className="p-6 bg-background rounded-[var(--radius-card)] border-2 border-border">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-muted-foreground" />
              <span className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                Fully Measured Quantity
              </span>
            </div>
            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
              {selectedCode?.actualQuantity.toLocaleString()} {selectedCode?.bidUnit}
            </div>
            <div className="text-muted-foreground font-[family-name:var(--font-family)] mt-1" style={{ fontSize: 'var(--text-xs)' }}>
              GPS-tracked movement
            </div>
          </div>

          <div className="p-6 bg-primary/10 rounded-[var(--radius-card)] border-2 border-primary">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                Claimable Value ({verificationPercentage}%)
              </span>
            </div>
            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-primary" style={{ fontSize: 'var(--text-3xl)' }}>
              ${partialValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-muted-foreground font-[family-name:var(--font-family)] mt-1" style={{ fontSize: 'var(--text-xs)' }}>
              {((selectedCode?.actualQuantity || 0) * verificationPercentage / 100).toLocaleString()} {selectedCode?.bidUnit} @ ${selectedCode?.actualUnitCost.toFixed(2)}/{selectedCode?.bidUnit}
            </div>
          </div>

          <div className="p-6 bg-muted rounded-[var(--radius-card)] border-2 border-border">
            <div className="text-muted-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] mb-3" style={{ fontSize: 'var(--text-sm)' }}>
              Held for Future Verification
            </div>
            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xl)' }}>
              ${unverifiedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-muted-foreground font-[family-name:var(--font-family)] mt-1" style={{ fontSize: 'var(--text-xs)' }}>
              {(100 - verificationPercentage)}% pending survey confirmation
            </div>
          </div>

          {/* Summary Breakdown */}
          <div className="p-4 bg-color-success/10 rounded-[var(--radius-card)] border-2 border-color-success">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  Full Value:
                </span>
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  ${selectedCode?.actualTotalCost.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-color-success font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-sm)' }}>
                  Claim Now ({verificationPercentage}%):
                </span>
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-color-success" style={{ fontSize: 'var(--text-sm)' }}>
                  ${partialValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                  Claim Later ({100 - verificationPercentage}%):
                </span>
                <span className="font-[family-name:var(--font-family)] text-muted-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                  ${unverifiedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
