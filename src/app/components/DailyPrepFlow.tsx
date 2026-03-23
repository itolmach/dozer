import { useState } from 'react';
import { 
  X, 
  Save,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
  Calendar,
  Copy,
  Database,
  Radio,
  GitBranch,
  ChevronRight,
  Info
} from 'lucide-react';

interface DailyPrepFlowProps {
  onClose?: () => void;
  inline?: boolean;
  assetName: string;
  assetId: string;
}

interface ShiftBlock {
  id: string;
  startTime: string;
  endTime: string;
  costCode: string;
  costCodeName: string;
  subCode?: string;
  notes?: string;
}

interface Discrepancy {
  id: string;
  field: string;
  erpValue: string;
  telematicsValue: string;
  resolved: boolean;
  selectedSource?: 'erp' | 'telematics';
}

interface SubCode {
  id: string;
  code: string;
  name: string;
  parentCode: string;
  parentCodeName: string;
}

export function DailyPrepFlow({ onClose, inline, assetName, assetId }: DailyPrepFlowProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [shiftBlocks, setShiftBlocks] = useState<ShiftBlock[]>([
    {
      id: '1',
      startTime: '06:00',
      endTime: '10:00',
      costCode: 'CSI 31 22 00',
      costCodeName: 'Grading & Site Preparation',
    },
  ]);

  const [showSubCodeCreator, setShowSubCodeCreator] = useState(false);
  const [newSubCode, setNewSubCode] = useState({ code: '', name: '', parentCode: '' });
  
  const [repeatEnabled, setRepeatEnabled] = useState(false);
  const [repeatDays, setRepeatDays] = useState<Date[]>([]);
  
  // Mock discrepancies between ERP and Telematics
  const [discrepancies, setDiscrepancies] = useState<Discrepancy[]>([
    {
      id: 'disc-1',
      field: 'Primary Cost Code',
      erpValue: 'CSI 31 22 00 - Grading',
      telematicsValue: 'CSI 31 23 16 - Rock Blasting',
      resolved: false,
    },
    {
      id: 'disc-2',
      field: 'Scheduled Hours',
      erpValue: '10 hours',
      telematicsValue: '8 hours',
      resolved: false,
    },
  ]);

  // Mock available cost codes
  const availableCostCodes = [
    { code: 'CSI 31 22 00', name: 'Grading & Site Preparation' },
    { code: 'CSI 31 23 16', name: 'Rock Blasting & Excavation' },
    { code: 'CSI 31 23 23', name: 'Hard Clay Excavation' },
    { code: 'CSI 31 25 00', name: 'Erosion & Sediment Control' },
    { code: 'CSI 32 11 23', name: 'Aggregate Base Course' },
  ];

  // Mock existing sub-codes
  const [subCodes, setSubCodes] = useState<SubCode[]>([
    {
      id: 'sub-1',
      code: 'CSI 31 22 00.A',
      name: 'Rough Grading - North Quadrant',
      parentCode: 'CSI 31 22 00',
      parentCodeName: 'Grading & Site Preparation',
    },
    {
      id: 'sub-2',
      code: 'CSI 31 22 00.B',
      name: 'Fine Grading - Parking Area',
      parentCode: 'CSI 31 22 00',
      parentCodeName: 'Grading & Site Preparation',
    },
  ]);

  const addShiftBlock = () => {
    const lastBlock = shiftBlocks[shiftBlocks.length - 1];
    const newStartTime = lastBlock ? lastBlock.endTime : '06:00';
    
    setShiftBlocks([
      ...shiftBlocks,
      {
        id: Date.now().toString(),
        startTime: newStartTime,
        endTime: addHours(newStartTime, 4),
        costCode: 'CSI 31 22 00',
        costCodeName: 'Grading & Site Preparation',
      },
    ]);
  };

  const removeShiftBlock = (id: string) => {
    setShiftBlocks(shiftBlocks.filter(block => block.id !== id));
  };

  const updateShiftBlock = (id: string, updates: Partial<ShiftBlock>) => {
    setShiftBlocks(shiftBlocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const addHours = (time: string, hours: number): string => {
    const [h, m] = time.split(':').map(Number);
    const newHour = (h + hours) % 24;
    return `${String(newHour).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  const resolveDiscrepancy = (id: string, source: 'erp' | 'telematics') => {
    setDiscrepancies(discrepancies.map(disc =>
      disc.id === id ? { ...disc, resolved: true, selectedSource: source } : disc
    ));
  };

  const createSubCode = () => {
    if (newSubCode.code && newSubCode.name && newSubCode.parentCode) {
      const parentInfo = availableCostCodes.find(c => c.code === newSubCode.parentCode);
      if (parentInfo) {
        setSubCodes([
          ...subCodes,
          {
            id: Date.now().toString(),
            code: newSubCode.code,
            name: newSubCode.name,
            parentCode: newSubCode.parentCode,
            parentCodeName: parentInfo.name,
          },
        ]);
        setNewSubCode({ code: '', name: '', parentCode: '' });
        setShowSubCodeCreator(false);
      }
    }
  };

  const toggleRepeatDay = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const exists = repeatDays.some(d => d.toISOString().split('T')[0] === dateStr);
    
    if (exists) {
      setRepeatDays(repeatDays.filter(d => d.toISOString().split('T')[0] !== dateStr));
    } else {
      setRepeatDays([...repeatDays, date]);
    }
  };

  // Generate calendar days for next 14 days
  const calendarDays: Date[] = [];
  for (let i = 1; i <= 14; i++) {
    const day = new Date(selectedDate);
    day.setDate(selectedDate.getDate() + i);
    calendarDays.push(day);
  }

  const unresolvedCount = discrepancies.filter(d => !d.resolved).length;
  const totalShiftHours = shiftBlocks.reduce((sum, block) => {
    const [startH, startM] = block.startTime.split(':').map(Number);
    const [endH, endM] = block.endTime.split(':').map(Number);
    const hours = endH - startH + (endM - startM) / 60;
    return sum + hours;
  }, 0);
  const outerClass = inline 
    ? "bg-card rounded-[var(--radius-card)] border-2 border-border flex flex-col" 
    : "fixed inset-0 z-50 bg-background flex flex-col";

  return (
    <div className={outerClass}>
      {/* Header */}
      <div className="h-[80px] bg-card border-b-4 border-primary px-8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div>
            <h2 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xl)' }}>
              Daily Shift Preparation
            </h2>
            <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
              {assetName} • Manufacturing shifts with split-allocation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Discrepancy Alert */}
          {unresolvedCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive/10 border-2 border-destructive">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                {unresolvedCount} Discrepanc{unresolvedCount > 1 ? 'ies' : 'y'}
              </span>
            </div>
          )}

          {/* Save Button */}
          <button 
            onClick={() => {
              console.log('Saving shift allocation:', { shiftBlocks, repeatDays });
              if (onClose) onClose();
            }}
            className="min-w-[60px] min-h-[60px] px-6 py-3 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity flex items-center gap-2"
            disabled={unresolvedCount > 0}
          >
            <Save className="w-5 h-5" />
            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-sm)' }}>
              Save Schedule
            </span>
          </button>

          {/* Close (modal only) */}
          {!inline && onClose && (
            <button
              onClick={onClose}
              className="min-w-[60px] min-h-[60px] rounded-full bg-destructive/10 hover:bg-destructive/20 transition-colors flex items-center justify-center"
              title="Close Daily Prep"
            >
              <X className="w-6 h-6 text-destructive" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={inline ? "p-6" : "flex-1 overflow-y-auto bg-background p-8"}>
        <div className="max-w-[1400px] mx-auto grid grid-cols-3 gap-6">
          {/* Left Column - Shift Allocation */}
          <div className="col-span-2 space-y-6">
            {/* Date Selector */}
            <div className="bg-card rounded-[var(--radius-card)] border-2 border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                  Select Date
                </h3>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                  <Calendar className="w-4 h-4 text-foreground" />
                  <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>

              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] border-2 border-border bg-background font-[family-name:var(--font-family)] text-foreground focus:border-primary focus:outline-none"
                style={{ fontSize: 'var(--text-base)' }}
              />
            </div>

            {/* Shift Blocks */}
            <div className="bg-card rounded-[var(--radius-card)] border-2 border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontSize: 'var(--text-lg)' }}>
                    Split-Shift Allocation
                  </h3>
                  <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                    Assign this asset to multiple cost codes within the same shift
                  </p>
                </div>
                
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border-2 border-primary/20">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-primary" style={{ fontSize: 'var(--text-base)' }}>
                    {totalShiftHours.toFixed(1)} hours total
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {shiftBlocks.map((block, index) => (
                  <div 
                    key={block.id} 
                    className="p-5 rounded-[var(--radius-card)] border-2 border-border bg-background"
                  >
                    <div className="flex items-start gap-4">
                      {/* Block Number */}
                      <div className="min-w-[60px] min-h-[60px] rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-white" style={{ fontSize: 'var(--text-xl)' }}>
                          {index + 1}
                        </span>
                      </div>

                      <div className="flex-1 space-y-4">
                        {/* Time Range */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                              Start Time
                            </label>
                            <input
                              type="time"
                              value={block.startTime}
                              onChange={(e) => updateShiftBlock(block.id, { startTime: e.target.value })}
                              className="w-full min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] border-2 border-border bg-card font-[family-name:var(--font-family)] text-foreground focus:border-primary focus:outline-none"
                              style={{ fontSize: 'var(--text-base)' }}
                            />
                          </div>
                          <div>
                            <label className="block text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                              End Time
                            </label>
                            <input
                              type="time"
                              value={block.endTime}
                              onChange={(e) => updateShiftBlock(block.id, { endTime: e.target.value })}
                              className="w-full min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] border-2 border-border bg-card font-[family-name:var(--font-family)] text-foreground focus:border-primary focus:outline-none"
                              style={{ fontSize: 'var(--text-base)' }}
                            />
                          </div>
                        </div>

                        {/* Cost Code Selection */}
                        <div>
                          <label className="block text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                            Cost Code
                          </label>
                          <select
                            value={block.costCode}
                            onChange={(e) => {
                              const selected = availableCostCodes.find(c => c.code === e.target.value);
                              updateShiftBlock(block.id, { 
                                costCode: e.target.value,
                                costCodeName: selected?.name || '',
                              });
                            }}
                            className="w-full min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] border-2 border-border bg-card font-[family-name:var(--font-family)] text-foreground focus:border-primary focus:outline-none"
                            style={{ fontSize: 'var(--text-base)' }}
                          >
                            {availableCostCodes.map(code => (
                              <option key={code.code} value={code.code}>
                                {code.code} - {code.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Sub-Code Selection (Optional) */}
                        <div>
                          <label className="block text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                            Sub-Code (Optional)
                          </label>
                          <select
                            value={block.subCode || ''}
                            onChange={(e) => updateShiftBlock(block.id, { subCode: e.target.value })}
                            className="w-full min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] border-2 border-border bg-card font-[family-name:var(--font-family)] text-foreground focus:border-primary focus:outline-none"
                            style={{ fontSize: 'var(--text-base)' }}
                          >
                            <option value="">No Sub-Code</option>
                            {subCodes
                              .filter(sc => sc.parentCode === block.costCode)
                              .map(subCode => (
                                <option key={subCode.id} value={subCode.code}>
                                  {subCode.code} - {subCode.name}
                                </option>
                              ))}
                          </select>
                        </div>

                        {/* Notes */}
                        <div>
                          <label className="block text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                            Notes
                          </label>
                          <input
                            type="text"
                            value={block.notes || ''}
                            onChange={(e) => updateShiftBlock(block.id, { notes: e.target.value })}
                            placeholder="Add notes about this shift block..."
                            className="w-full min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] border-2 border-border bg-card font-[family-name:var(--font-family)] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                            style={{ fontSize: 'var(--text-base)' }}
                          />
                        </div>
                      </div>

                      {/* Remove Button */}
                      {shiftBlocks.length > 1 && (
                        <button
                          onClick={() => removeShiftBlock(block.id)}
                          className="min-w-[60px] min-h-[60px] rounded-full bg-destructive/10 hover:bg-destructive/20 transition-colors flex items-center justify-center flex-shrink-0"
                          title="Remove shift block"
                        >
                          <Trash2 className="w-5 h-5 text-destructive" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Add Shift Block Button */}
                <button
                  onClick={addShiftBlock}
                  className="w-full min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5 text-foreground" />
                  <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                    Add Split-Shift Block
                  </span>
                </button>
              </div>
            </div>

            {/* Repeat Schedule */}
            <div className="bg-card rounded-[var(--radius-card)] border-2 border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontSize: 'var(--text-lg)' }}>
                    Repeat Schedule
                  </h3>
                  <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                    Apply this shift allocation to multiple days
                  </p>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={repeatEnabled}
                    onChange={(e) => setRepeatEnabled(e.target.checked)}
                    className="min-w-[24px] min-h-[24px] rounded border-2 border-border checked:bg-primary checked:border-primary cursor-pointer"
                  />
                  <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                    Enable Repeat
                  </span>
                </label>
              </div>

              {repeatEnabled && (
                <div>
                  <div className="mb-4">
                    <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                      Select days to repeat this shift allocation:
                    </p>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-2">
                    {calendarDays.map((day, idx) => {
                      const isSelected = repeatDays.some(d => 
                        d.toISOString().split('T')[0] === day.toISOString().split('T')[0]
                      );

                      return (
                        <button
                          key={idx}
                          onClick={() => toggleRepeatDay(day)}
                          className={`min-w-[60px] min-h-[60px] rounded-[var(--radius-button)] border-2 transition-all ${
                            isSelected
                              ? 'bg-primary border-primary text-white'
                              : 'border-border bg-background text-foreground hover:border-primary hover:bg-primary/5'
                          }`}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <div className="font-[family-name:var(--font-family)]" style={{ fontSize: '10px' }}>
                              {day.toLocaleDateString('en-US', { weekday: 'short' })}
                            </div>
                            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                              {day.getDate()}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {repeatDays.length > 0 && (
                    <div className="mt-4 p-4 bg-primary/10 rounded-[var(--radius-button)] border-2 border-primary/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Copy className="w-4 h-4 text-primary" />
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-primary" style={{ fontSize: 'var(--text-sm)' }}>
                          Will repeat on {repeatDays.length} day{repeatDays.length > 1 ? 's' : ''}
                        </span>
                      </div>
                      <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                        {repeatDays.map(d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Discrepancies & Sub-Codes */}
          <div className="space-y-6">
            {/* Discrepancy Resolution Widget */}
            {discrepancies.length > 0 && (
              <div className="bg-card rounded-[var(--radius-card)] border-2 border-destructive p-6">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                  <div>
                    <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                      Resolve Discrepancies
                    </h3>
                    <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                      Select source of truth
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {discrepancies.map((disc) => (
                    <div 
                      key={disc.id}
                      className={`p-4 rounded-[var(--radius-card)] border-2 ${
                        disc.resolved
                          ? 'border-color-success bg-color-success/5'
                          : 'border-destructive/30 bg-destructive/5'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        {disc.resolved ? (
                          <CheckCircle className="w-5 h-5 text-color-success" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        )}
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                          {disc.field}
                        </span>
                      </div>

                      {!disc.resolved ? (
                        <div className="space-y-2">
                          {/* ERP Option */}
                          <button
                            onClick={() => resolveDiscrepancy(disc.id, 'erp')}
                            className="w-full min-h-[60px] p-4 rounded-[var(--radius-button)] border-2 border-border bg-background hover:border-primary hover:bg-primary/5 transition-all text-left"
                          >
                            <div className="flex items-start gap-3">
                              <Database className="w-5 h-5 text-foreground flex-shrink-0 mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                                    ERP System
                                  </span>
                                  <span className="px-2 py-0.5 bg-muted rounded text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: '10px' }}>
                                    MASTER
                                  </span>
                                </div>
                                <div className="font-[family-name:var(--font-family)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                                  {disc.erpValue}
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </div>
                          </button>

                          {/* Telematics Option */}
                          <button
                            onClick={() => resolveDiscrepancy(disc.id, 'telematics')}
                            className="w-full min-h-[60px] p-4 rounded-[var(--radius-button)] border-2 border-border bg-background hover:border-primary hover:bg-primary/5 transition-all text-left"
                          >
                            <div className="flex items-start gap-3">
                              <Radio className="w-5 h-5 text-foreground flex-shrink-0 mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                                    Telematics
                                  </span>
                                  <span className="px-2 py-0.5 bg-muted rounded text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: '10px' }}>
                                    FIELD DATA
                                  </span>
                                </div>
                                <div className="font-[family-name:var(--font-family)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                                  {disc.telematicsValue}
                                </div>
                              </div>
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </div>
                          </button>
                        </div>
                      ) : (
                        <div className="p-3 bg-color-success/10 rounded border border-color-success">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-color-success" />
                            <span className="font-[family-name:var(--font-family)] text-color-success" style={{ fontSize: 'var(--text-sm)' }}>
                              Resolved using {disc.selectedSource === 'erp' ? 'ERP' : 'Telematics'} value
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Code Management */}
            <div className="bg-card rounded-[var(--radius-card)] border-2 border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <GitBranch className="w-6 h-6 text-foreground" />
                <div>
                  <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                    Sub-Code Library
                  </h3>
                  <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                    Field-level custom codes
                  </p>
                </div>
              </div>

              {/* Existing Sub-Codes */}
              <div className="space-y-2 mb-4">
                {subCodes.map((subCode) => (
                  <div 
                    key={subCode.id}
                    className="p-4 rounded-[var(--radius-card)] border border-border bg-muted"
                  >
                    <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontSize: 'var(--text-base)' }}>
                      {subCode.code}
                    </div>
                    <div className="text-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                      {subCode.name}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ChevronRight className="w-4 h-4" />
                      <span className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                        Maps to: {subCode.parentCode}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Create New Sub-Code */}
              {!showSubCodeCreator ? (
                <button
                  onClick={() => setShowSubCodeCreator(true)}
                  className="w-full min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5 text-foreground" />
                  <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                    Create Sub-Code
                  </span>
                </button>
              ) : (
                <div className="p-4 rounded-[var(--radius-card)] border-2 border-primary bg-primary/5">
                  <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-4" style={{ fontSize: 'var(--text-base)' }}>
                    New Sub-Code
                  </h4>

                  <div className="space-y-3">
                    {/* Parent Code Selection */}
                    <div>
                      <label className="block text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                        Master Code
                      </label>
                      <select
                        value={newSubCode.parentCode}
                        onChange={(e) => setNewSubCode({ ...newSubCode, parentCode: e.target.value })}
                        className="w-full min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] border-2 border-border bg-card font-[family-name:var(--font-family)] text-foreground focus:border-primary focus:outline-none"
                        style={{ fontSize: 'var(--text-base)' }}
                      >
                        <option value="">Select Master Code</option>
                        {availableCostCodes.map(code => (
                          <option key={code.code} value={code.code}>
                            {code.code} - {code.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Sub-Code Number */}
                    <div>
                      <label className="block text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                        Sub-Code
                      </label>
                      <input
                        type="text"
                        value={newSubCode.code}
                        onChange={(e) => setNewSubCode({ ...newSubCode, code: e.target.value })}
                        placeholder="e.g., CSI 31 22 00.C"
                        className="w-full min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] border-2 border-border bg-card font-[family-name:var(--font-family)] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        style={{ fontSize: 'var(--text-base)' }}
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                        Description
                      </label>
                      <input
                        type="text"
                        value={newSubCode.name}
                        onChange={(e) => setNewSubCode({ ...newSubCode, name: e.target.value })}
                        placeholder="Describe this sub-code..."
                        className="w-full min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] border-2 border-border bg-card font-[family-name:var(--font-family)] text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        style={{ fontSize: 'var(--text-base)' }}
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={createSubCode}
                        disabled={!newSubCode.code || !newSubCode.name || !newSubCode.parentCode}
                        className="flex-1 min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]"
                        style={{ fontSize: 'var(--text-base)' }}
                      >
                        Create
                      </button>
                      <button
                        onClick={() => {
                          setShowSubCodeCreator(false);
                          setNewSubCode({ code: '', name: '', parentCode: '' });
                        }}
                        className="min-w-[60px] min-h-[60px] rounded-full bg-muted hover:bg-accent transition-colors flex items-center justify-center"
                      >
                        <X className="w-5 h-5 text-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Note */}
              <div className="mt-4 p-3 bg-muted/50 rounded border border-border flex gap-3">
                <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                  Sub-codes automatically map back to their parent Master Code for financial reporting while allowing field-level granularity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
