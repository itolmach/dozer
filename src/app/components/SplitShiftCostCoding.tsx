import { useState } from 'react';
import { 
  Split, 
  Clock, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  X,
  ArrowRight,
  DollarSign,
  Activity
} from 'lucide-react';

interface CostCode {
  id: string;
  code: string;
  division: string;
  description: string;
}

interface SplitShiftEntry {
  id: string;
  costCode: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  reason: string;
}

interface SplitShiftCostCodingProps {
  assetName: string;
  currentCostCode: string;
  currentTaskStartTime: string;
  onClose: () => void;
  onSave: (splits: SplitShiftEntry[]) => void;
}

const mockCostCodes: CostCode[] = [
  { id: '1', code: 'CSI 31 23 00', division: 'Earthwork', description: 'Mass Earthwork - Excavation' },
  { id: '2', code: 'CSI 31 25 14', division: 'Earthwork', description: 'Stockpiling & Material Handling' },
  { id: '3', code: 'CSI 31 22 00', division: 'Earthwork', description: 'Grading & Site Preparation' },
  { id: '4', code: 'CSI 31 23 19.13', division: 'Earthwork', description: 'Dewatering Operations' },
  { id: '5', code: 'CSI 32 11 23', division: 'Site Improvements', description: 'Roadway Base Course' },
];

const splitReasons = [
  'Site Bottleneck - Waiting on Blasting',
  'Site Bottleneck - Stockpile Full',
  'Site Bottleneck - Access Road Blocked',
  'Priority Change - Emergency Work',
  'Priority Change - Schedule Acceleration',
  'Material Availability Issue',
  'Weather Delay Redeployment',
  'Equipment Coordination',
  'Other (See Notes)'
];

export function SplitShiftCostCoding({ 
  assetName, 
  currentCostCode, 
  currentTaskStartTime,
  onClose,
  onSave 
}: SplitShiftCostCodingProps) {
  const [splits, setSplits] = useState<SplitShiftEntry[]>([
    {
      id: '1',
      costCode: currentCostCode,
      startTime: currentTaskStartTime,
      endTime: new Date().toTimeString().slice(0, 5),
      duration: 0,
      reason: ''
    }
  ]);

  const [newSplitCostCode, setNewSplitCostCode] = useState('');
  const [newSplitReason, setNewSplitReason] = useState('');
  const [validationError, setValidationError] = useState('');

  // Calculate duration in minutes between two times
  const calculateDuration = (start: string, end: string): number => {
    const [startHour, startMin] = start.split(':').map(Number);
    const [endHour, endMin] = end.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    return Math.max(0, endMinutes - startMinutes);
  };

  // Update the current split's end time
  const updateCurrentSplitEndTime = (endTime: string) => {
    const updatedSplits = [...splits];
    const lastIndex = updatedSplits.length - 1;
    const duration = calculateDuration(updatedSplits[lastIndex].startTime, endTime);
    
    updatedSplits[lastIndex] = {
      ...updatedSplits[lastIndex],
      endTime,
      duration
    };
    
    setSplits(updatedSplits);
  };

  const addNewSplit = () => {
    setValidationError('');

    if (!newSplitCostCode) {
      setValidationError('Please select a new cost code');
      return;
    }

    if (!newSplitReason) {
      setValidationError('Please select a reason for the cost code change');
      return;
    }

    // Get the last split's end time as the new split's start time
    const lastSplit = splits[splits.length - 1];
    
    if (!lastSplit.endTime) {
      setValidationError('Please set the end time for the current task');
      return;
    }

    if (lastSplit.duration < 1) {
      setValidationError('Current task duration must be at least 1 minute');
      return;
    }

    // Create new split
    const newSplit: SplitShiftEntry = {
      id: `${splits.length + 1}`,
      costCode: newSplitCostCode,
      startTime: lastSplit.endTime,
      endTime: new Date().toTimeString().slice(0, 5),
      duration: 0,
      reason: newSplitReason
    };

    setSplits([...splits, newSplit]);
    setNewSplitCostCode('');
    setNewSplitReason('');
  };

  const removeSplit = (index: number) => {
    if (splits.length === 1) {
      setValidationError('Cannot remove the original task entry');
      return;
    }

    const updatedSplits = splits.filter((_, i) => i !== index);
    
    // Recalculate IDs and adjust times
    const recalculated = updatedSplits.map((split, idx) => ({
      ...split,
      id: `${idx + 1}`,
      startTime: idx === 0 ? currentTaskStartTime : updatedSplits[idx - 1].endTime
    }));

    setSplits(recalculated);
    setValidationError('');
  };

  const handleSave = () => {
    setValidationError('');

    // Validate all splits have proper data
    for (let i = 0; i < splits.length; i++) {
      const split = splits[i];
      
      if (!split.endTime) {
        setValidationError(`Split ${i + 1}: End time is required`);
        return;
      }

      if (split.duration < 1) {
        setValidationError(`Split ${i + 1}: Duration must be at least 1 minute`);
        return;
      }

      if (i > 0 && !split.reason) {
        setValidationError(`Split ${i + 1}: Reason is required for cost code changes`);
        return;
      }
    }

    onSave(splits);
  };

  const totalDuration = splits.reduce((sum, split) => sum + split.duration, 0);
  const currentCostCodeInfo = mockCostCodes.find(cc => cc.code === currentCostCode);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-8">
      <div className="bg-card rounded-[var(--radius-card)] border-4 border-primary shadow-[var(--elevation-lg)] max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-primary text-white px-6 py-4 border-b-4 border-primary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="min-w-[60px] min-h-[60px] rounded-full bg-white/20 flex items-center justify-center">
                <Split className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-xl)' }}>
                  Split-Shift Cost Code Assignment
                </h2>
                <p className="font-[family-name:var(--font-family)] opacity-90" style={{ fontSize: 'var(--text-sm)' }}>
                  {assetName} • Mid-Task Reallocation
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
              title="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-muted/50 border-b-2 border-border px-6 py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-1" style={{ fontSize: 'var(--text-base)' }}>
                Mid-Task Reallocation Workflow
              </p>
              <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                Split the current shift into multiple cost code segments. Each segment will be tracked separately for accurate downtime attribution and bid refinement. 
                All hours and costs will be proportionally allocated based on time spent per cost code.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Original Task Info */}
            <div className="bg-background rounded-[var(--radius-card)] border-2 border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-foreground" />
                <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                  Original Task Assignment
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                    Cost Code
                  </div>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-primary" style={{ fontSize: 'var(--text-base)' }}>
                    {currentCostCode}
                  </div>
                  {currentCostCodeInfo && (
                    <div className="text-foreground font-[family-name:var(--font-family)] mt-1" style={{ fontSize: 'var(--text-sm)' }}>
                      {currentCostCodeInfo.description}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                    Task Start Time
                  </div>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                    {currentTaskStartTime}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                    Current Time
                  </div>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                    {new Date().toTimeString().slice(0, 5)}
                  </div>
                </div>
              </div>
            </div>

            {/* Validation Error */}
            {validationError && (
              <div className="p-4 bg-destructive/10 rounded-[var(--radius-card)] border-2 border-destructive">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
                  <p className="text-destructive font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
                    {validationError}
                  </p>
                </div>
              </div>
            )}

            {/* Current Split Entries */}
            <div className="space-y-4">
              <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                Time & Cost Code Splits
              </h3>

              {splits.map((split, index) => {
                const costCodeInfo = mockCostCodes.find(cc => cc.code === split.costCode);
                const isLast = index === splits.length - 1;

                return (
                  <div 
                    key={split.id}
                    className="bg-card rounded-[var(--radius-card)] border-2 border-border p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="min-w-[50px] min-h-[50px] rounded-full bg-primary text-white flex items-center justify-center">
                          <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-lg)' }}>
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-primary" style={{ fontSize: 'var(--text-base)' }}>
                            {split.costCode}
                          </div>
                          {costCodeInfo && (
                            <div className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                              {costCodeInfo.description}
                            </div>
                          )}
                        </div>
                      </div>

                      {index > 0 && (
                        <button
                          onClick={() => removeSplit(index)}
                          className="min-w-[60px] min-h-[60px] flex items-center justify-center rounded-full bg-destructive/10 hover:bg-destructive/20 transition-colors"
                          title="Remove Split"
                        >
                          <X className="w-5 h-5 text-destructive" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      {/* Start Time */}
                      <div>
                        <label className="block text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                          Start Time
                        </label>
                        <div className="min-h-[60px] px-4 py-3 bg-muted rounded-[var(--radius-button)] border-2 border-border flex items-center">
                          <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                            {split.startTime}
                          </span>
                        </div>
                      </div>

                      {/* End Time */}
                      <div>
                        <label className="block text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                          End Time
                        </label>
                        {isLast ? (
                          <input
                            type="time"
                            value={split.endTime}
                            onChange={(e) => updateCurrentSplitEndTime(e.target.value)}
                            className="w-full min-h-[60px] px-4 py-3 bg-background rounded-[var(--radius-button)] border-2 border-primary focus:border-primary focus:outline-none font-[family-name:var(--font-family)] text-foreground"
                            style={{ fontSize: 'var(--text-base)' }}
                          />
                        ) : (
                          <div className="min-h-[60px] px-4 py-3 bg-muted rounded-[var(--radius-button)] border-2 border-border flex items-center">
                            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                              {split.endTime}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Duration */}
                      <div>
                        <label className="block text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                          Duration
                        </label>
                        <div className="min-h-[60px] px-4 py-3 bg-muted rounded-[var(--radius-button)] border-2 border-border flex items-center">
                          <Clock className="w-5 h-5 text-foreground mr-2" />
                          <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                            {split.duration} min
                          </span>
                        </div>
                      </div>

                      {/* Cost Impact */}
                      <div>
                        <label className="block text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                          % of Shift
                        </label>
                        <div className="min-h-[60px] px-4 py-3 bg-muted rounded-[var(--radius-button)] border-2 border-border flex items-center">
                          <Activity className="w-5 h-5 text-foreground mr-2" />
                          <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                            {totalDuration > 0 ? Math.round((split.duration / totalDuration) * 100) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Reason (for non-original splits) */}
                    {index > 0 && (
                      <div>
                        <label className="block text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                          Reason for Cost Code Change
                        </label>
                        <div className="min-h-[60px] px-4 py-3 bg-background rounded-[var(--radius-button)] border-2 border-border flex items-center">
                          <span className="font-[family-name:var(--font-family)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                            {split.reason}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add New Split Section */}
            <div className="bg-muted/30 rounded-[var(--radius-card)] border-2 border-dashed border-border p-6">
              <div className="flex items-center gap-2 mb-4">
                <ArrowRight className="w-5 h-5 text-foreground" />
                <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                  Add New Cost Code Split
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* New Cost Code Selection */}
                <div>
                  <label className="block text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                    Reassign to Cost Code
                  </label>
                  <select
                    value={newSplitCostCode}
                    onChange={(e) => setNewSplitCostCode(e.target.value)}
                    className="w-full min-h-[60px] px-4 py-3 bg-background rounded-[var(--radius-button)] border-2 border-border focus:border-primary focus:outline-none font-[family-name:var(--font-family)] text-foreground"
                    style={{ fontSize: 'var(--text-base)' }}
                  >
                    <option value="">Select new cost code...</option>
                    {mockCostCodes
                      .filter(cc => cc.code !== currentCostCode)
                      .map(cc => (
                        <option key={cc.id} value={cc.code}>
                          {cc.code} - {cc.description}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Reason Selection */}
                <div>
                  <label className="block text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                    Reason for Change
                  </label>
                  <select
                    value={newSplitReason}
                    onChange={(e) => setNewSplitReason(e.target.value)}
                    className="w-full min-h-[60px] px-4 py-3 bg-background rounded-[var(--radius-button)] border-2 border-border focus:border-primary focus:outline-none font-[family-name:var(--font-family)] text-foreground"
                    style={{ fontSize: 'var(--text-base)' }}
                  >
                    <option value="">Select reason...</option>
                    {splitReasons.map(reason => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={addNewSplit}
                className="min-h-[60px] px-6 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2 w-full"
              >
                <Split className="w-5 h-5" />
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                  Add Split at Current Time
                </span>
              </button>
            </div>

            {/* Summary */}
            <div className="bg-primary/10 rounded-[var(--radius-card)] border-2 border-primary/30 p-6">
              <div className="flex items-start gap-3">
                <DollarSign className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-3" style={{ fontSize: 'var(--text-base)' }}>
                    Cost Attribution Summary
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                        Total Splits
                      </div>
                      <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
                        {splits.length}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                        Total Duration
                      </div>
                      <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
                        {totalDuration} min
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>
                        Cost Codes Affected
                      </div>
                      <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
                        {new Set(splits.map(s => s.costCode)).size}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-muted border-t-2 border-border px-6 py-4">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            <button
              onClick={onClose}
              className="min-h-[60px] px-6 rounded-[var(--radius-button)] bg-card border-2 border-border text-foreground hover:bg-accent transition-colors"
            >
              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-base)' }}>
                Cancel
              </span>
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right mr-4">
                <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                  All fuel, labor, and machine hours will be proportionally allocated
                </div>
              </div>
              <button
                onClick={handleSave}
                className="min-h-[60px] px-8 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                  Save Split-Shift Assignment
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
