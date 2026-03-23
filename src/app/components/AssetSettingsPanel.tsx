import { useState } from 'react';
import { 
  X, 
  Settings, 
  Hash, 
  FileText, 
  MapPin, 
  Save, 
  AlertCircle, 
  CheckCircle, 
  Upload, 
  Edit2, 
  Split,
  DollarSign,
  AlertTriangle,
  Database,
  Radio,
  TrendingUp,
  Info,
  RefreshCw
} from 'lucide-react';
import { SplitShiftCostCoding } from './SplitShiftCostCoding';
import { EquipmentRateReconciliation } from './EquipmentRateReconciliation';

interface CostCode {
  id: string;
  code: string;
  division: string;
  description: string;
  mapArea: string;
}

interface AssetConfig {
  vin: string;
  assetTag: string;
  manufacturer: string;
  model: string;
  year: string;
  primaryCostCode: string;
  allowedMapAreas: string[];
  equipmentRateSource: 'erp' | 'telematics' | 'manual';
  hourlyRate: number;
}

const mockCostCodes: CostCode[] = [
  { id: '1', code: 'CSI 31 23 16.13', division: 'Earthwork', description: 'Trenching', mapArea: 'Zone A-1, Zone B-2' },
  { id: '2', code: 'CSI 31 23 19.13', division: 'Earthwork', description: 'Dewatering', mapArea: 'Zone C-1' },
  { id: '3', code: 'CSI 31 23 23.13', division: 'Earthwork', description: 'Fill and Backfill', mapArea: 'Zone A-1, Zone A-2, Zone B-1' },
  { id: '4', code: 'CSI 31 25 00', division: 'Earthwork', description: 'Erosion and Sediment Controls', mapArea: 'All Zones' },
  { id: '5', code: 'CSI 31 22 00', division: 'Earthwork', description: 'Grading', mapArea: 'Zone B-1, Zone B-2, Zone C-1' },
];

const mockMapAreas = [
  'Zone A-1', 'Zone A-2', 'Zone B-1', 'Zone B-2', 'Zone C-1', 'Zone C-2', 'All Zones'
];

interface AssetSettingsPanelProps {
  onClose: () => void;
  existingConfig?: Partial<AssetConfig>;
}

export function AssetSettingsPanel({ onClose, existingConfig }: AssetSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'config' | 'rates'>('config');
  const [currentStep, setCurrentStep] = useState<'asset-id' | 'cost-code' | 'map-area' | 'review'>('asset-id');
  const [assetConfig, setAssetConfig] = useState<AssetConfig>({
    vin: existingConfig?.vin || '',
    assetTag: existingConfig?.assetTag || '',
    manufacturer: existingConfig?.manufacturer || 'John Deere',
    model: existingConfig?.model || '650K XLT',
    year: existingConfig?.year || '2024',
    primaryCostCode: existingConfig?.primaryCostCode || '',
    allowedMapAreas: existingConfig?.allowedMapAreas || [],
    equipmentRateSource: existingConfig?.equipmentRateSource || 'erp',
    hourlyRate: existingConfig?.hourlyRate || 285
  });

  const [isEditing, setIsEditing] = useState(!existingConfig?.vin);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showSplitShift, setShowSplitShift] = useState(false);

  const selectedCostCode = mockCostCodes.find(cc => cc.code === assetConfig.primaryCostCode);

  const handleSave = () => {
    const errors: string[] = [];
    
    if (!assetConfig.vin.trim()) errors.push('VIN is required');
    if (!assetConfig.assetTag.trim()) errors.push('Asset Tag is required');
    if (!assetConfig.primaryCostCode) errors.push('Primary Cost Code is required');
    if (assetConfig.allowedMapAreas.length === 0) errors.push('At least one map area must be selected');

    setValidationErrors(errors);

    if (errors.length === 0) {
      console.log('Asset configuration saved:', assetConfig);
      onClose();
    }
  };

  const toggleMapArea = (area: string) => {
    if (assetConfig.allowedMapAreas.includes(area)) {
      setAssetConfig({
        ...assetConfig,
        allowedMapAreas: assetConfig.allowedMapAreas.filter(a => a !== area)
      });
    } else {
      setAssetConfig({
        ...assetConfig,
        allowedMapAreas: [...assetConfig.allowedMapAreas, area]
      });
    }
  };

  const getStepStatus = (step: typeof currentStep) => {
    switch(step) {
      case 'asset-id':
        return assetConfig.vin && assetConfig.assetTag ? 'complete' : 'incomplete';
      case 'cost-code':
        return assetConfig.primaryCostCode ? 'complete' : 'incomplete';
      case 'map-area':
        return assetConfig.allowedMapAreas.length > 0 ? 'complete' : 'incomplete';
      case 'review':
        return 'pending';
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center">
        <div className="bg-card rounded-[var(--radius-card)] border-4 border-border shadow-[var(--elevation-xl)] max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col m-8">
          {/* Header */}
          <div className="bg-primary px-8 py-6 border-b-4 border-primary/30 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="min-w-[70px] min-h-[70px] rounded-full bg-white/20 flex items-center justify-center">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-white mb-2" style={{ fontSize: 'var(--text-2xl)' }}>
                    Asset Settings & Configuration
                  </h2>
                  <p className="font-[family-name:var(--font-family)] text-white/90" style={{ fontSize: 'var(--text-base)' }}>
                    {assetConfig.manufacturer} {assetConfig.model} • VIN: {assetConfig.vin || 'Not Set'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="min-w-[60px] min-h-[60px] rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-muted border-b-2 border-border px-8 py-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('config')}
                className={`min-h-[60px] px-6 rounded-[var(--radius-button)] font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] transition-all ${
                  activeTab === 'config'
                    ? 'bg-primary text-white'
                    : 'bg-background text-foreground hover:bg-accent border-2 border-border'
                }`}
                style={{ fontSize: 'var(--text-base)' }}
              >
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  <span>Asset & Cost Codes</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('rates')}
                className={`min-h-[60px] px-6 rounded-[var(--radius-button)] font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] transition-all ${
                  activeTab === 'rates'
                    ? 'bg-primary text-white'
                    : 'bg-background text-foreground hover:bg-accent border-2 border-border'
                }`}
                style={{ fontSize: 'var(--text-base)' }}
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  <span>Equipment Rates</span>
                </div>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'config' && (
              <div className="p-8">
                {/* Step Progress */}
                <div className="mb-8 flex items-center justify-between">
                  {[
                    { id: 'asset-id', label: 'Asset ID', icon: Hash },
                    { id: 'cost-code', label: 'Cost Code', icon: FileText },
                    { id: 'map-area', label: 'Map Areas', icon: MapPin },
                    { id: 'review', label: 'Review', icon: CheckCircle }
                  ].map((step, idx) => (
                    <div key={step.id} className="flex items-center flex-1">
                      <button
                        onClick={() => setCurrentStep(step.id as typeof currentStep)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-button)] transition-all ${
                          currentStep === step.id
                            ? 'bg-primary text-white'
                            : getStepStatus(step.id as typeof currentStep) === 'complete'
                            ? 'bg-color-success/10 text-color-success border-2 border-color-success'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <step.icon className="w-5 h-5" />
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-sm)' }}>
                          {step.label}
                        </span>
                        {getStepStatus(step.id as typeof currentStep) === 'complete' && currentStep !== step.id && (
                          <CheckCircle className="w-5 h-5" />
                        )}
                      </button>
                      {idx < 3 && (
                        <div className={`h-0.5 flex-1 mx-2 ${
                          getStepStatus(step.id as typeof currentStep) === 'complete'
                            ? 'bg-color-success'
                            : 'bg-border'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                {/* Step Content */}
                {currentStep === 'asset-id' && (
                  <div className="max-w-3xl mx-auto">
                    <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-6" style={{ fontSize: 'var(--text-xl)' }}>
                      Asset Identification
                    </h3>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-3" style={{ fontSize: 'var(--text-base)' }}>
                            VIN Number *
                          </label>
                          <input
                            type="text"
                            value={assetConfig.vin}
                            onChange={(e) => setAssetConfig({ ...assetConfig, vin: e.target.value })}
                            className="w-full min-h-[70px] px-6 bg-background rounded-[var(--radius-button)] border-4 border-border focus:border-primary focus:outline-none font-[family-name:var(--font-family)] text-foreground"
                            style={{ fontSize: 'var(--text-lg)' }}
                            placeholder="1T0650KXGKF270001"
                          />
                        </div>

                        <div>
                          <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-3" style={{ fontSize: 'var(--text-base)' }}>
                            Asset Tag *
                          </label>
                          <input
                            type="text"
                            value={assetConfig.assetTag}
                            onChange={(e) => setAssetConfig({ ...assetConfig, assetTag: e.target.value })}
                            className="w-full min-h-[70px] px-6 bg-background rounded-[var(--radius-button)] border-4 border-border focus:border-primary focus:outline-none font-[family-name:var(--font-family)] text-foreground"
                            style={{ fontSize: 'var(--text-lg)' }}
                            placeholder="DZ-09"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-3" style={{ fontSize: 'var(--text-base)' }}>
                            Manufacturer
                          </label>
                          <input
                            type="text"
                            value={assetConfig.manufacturer}
                            onChange={(e) => setAssetConfig({ ...assetConfig, manufacturer: e.target.value })}
                            className="w-full min-h-[70px] px-6 bg-background rounded-[var(--radius-button)] border-4 border-border focus:border-primary focus:outline-none font-[family-name:var(--font-family)] text-foreground"
                            style={{ fontSize: 'var(--text-lg)' }}
                          />
                        </div>

                        <div>
                          <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-3" style={{ fontSize: 'var(--text-base)' }}>
                            Model
                          </label>
                          <input
                            type="text"
                            value={assetConfig.model}
                            onChange={(e) => setAssetConfig({ ...assetConfig, model: e.target.value })}
                            className="w-full min-h-[70px] px-6 bg-background rounded-[var(--radius-button)] border-4 border-border focus:border-primary focus:outline-none font-[family-name:var(--font-family)] text-foreground"
                            style={{ fontSize: 'var(--text-lg)' }}
                          />
                        </div>

                        <div>
                          <label className="block text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] mb-3" style={{ fontSize: 'var(--text-base)' }}>
                            Year
                          </label>
                          <input
                            type="text"
                            value={assetConfig.year}
                            onChange={(e) => setAssetConfig({ ...assetConfig, year: e.target.value })}
                            className="w-full min-h-[70px] px-6 bg-background rounded-[var(--radius-button)] border-4 border-border focus:border-primary focus:outline-none font-[family-name:var(--font-family)] text-foreground"
                            style={{ fontSize: 'var(--text-lg)' }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => setCurrentStep('cost-code')}
                        className="w-full min-h-[70px] px-8 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                          Continue to Cost Code
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 'cost-code' && (
                  <div className="max-w-3xl mx-auto">
                    <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-6" style={{ fontSize: 'var(--text-xl)' }}>
                      Primary Cost Code Assignment
                    </h3>

                    <div className="space-y-4 mb-6">
                      {mockCostCodes.map(code => (
                        <button
                          key={code.id}
                          onClick={() => setAssetConfig({ ...assetConfig, primaryCostCode: code.code })}
                          className={`w-full min-h-[80px] p-6 rounded-[var(--radius-card)] border-4 transition-all text-left ${
                            assetConfig.primaryCostCode === code.code
                              ? 'bg-primary/10 border-primary'
                              : 'bg-background border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground mb-1" style={{ fontSize: 'var(--text-lg)' }}>
                                {code.code}
                              </div>
                              <div className="font-[family-name:var(--font-family)] text-foreground mb-1" style={{ fontSize: 'var(--text-base)' }}>
                                {code.description}
                              </div>
                              <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                                {code.division} • {code.mapArea}
                              </div>
                            </div>
                            {assetConfig.primaryCostCode === code.code && (
                              <CheckCircle className="w-6 h-6 text-primary" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setCurrentStep('asset-id')}
                        className="flex-1 min-h-[70px] px-8 rounded-[var(--radius-button)] bg-muted text-foreground hover:opacity-90 transition-opacity"
                      >
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                          Back
                        </span>
                      </button>
                      <button
                        onClick={() => setCurrentStep('map-area')}
                        className="flex-1 min-h-[70px] px-8 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity"
                      >
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                          Continue to Map Areas
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 'map-area' && (
                  <div className="max-w-3xl mx-auto">
                    <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-6" style={{ fontSize: 'var(--text-xl)' }}>
                      Allowed Map Areas
                    </h3>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {mockMapAreas.map(area => (
                        <button
                          key={area}
                          onClick={() => toggleMapArea(area)}
                          className={`min-h-[80px] p-6 rounded-[var(--radius-card)] border-4 transition-all ${
                            assetConfig.allowedMapAreas.includes(area)
                              ? 'bg-primary/10 border-primary'
                              : 'bg-background border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                              {area}
                            </span>
                            {assetConfig.allowedMapAreas.includes(area) && (
                              <CheckCircle className="w-6 h-6 text-primary" />
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setCurrentStep('cost-code')}
                        className="flex-1 min-h-[70px] px-8 rounded-[var(--radius-button)] bg-muted text-foreground hover:opacity-90 transition-opacity"
                      >
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                          Back
                        </span>
                      </button>
                      <button
                        onClick={() => setCurrentStep('review')}
                        className="flex-1 min-h-[70px] px-8 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity"
                      >
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                          Review Configuration
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {currentStep === 'review' && (
                  <div className="max-w-3xl mx-auto">
                    <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-6" style={{ fontSize: 'var(--text-xl)' }}>
                      Review Configuration
                    </h3>

                    {validationErrors.length > 0 && (
                      <div className="mb-6 p-6 bg-destructive/10 rounded-[var(--radius-card)] border-2 border-destructive">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-6 h-6 text-destructive flex-shrink-0" />
                          <div>
                            <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive mb-2" style={{ fontSize: 'var(--text-base)' }}>
                              Validation Errors
                            </h4>
                            <ul className="list-disc list-inside space-y-1">
                              {validationErrors.map((error, idx) => (
                                <li key={idx} className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                                  {error}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-6">
                      <div className="p-6 bg-muted rounded-[var(--radius-card)] border-2 border-border">
                        <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-4" style={{ fontSize: 'var(--text-lg)' }}>
                          Asset Information
                        </h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>VIN</div>
                            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                              {assetConfig.vin || 'Not set'}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>Asset Tag</div>
                            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                              {assetConfig.assetTag || 'Not set'}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>Make & Model</div>
                            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                              {assetConfig.manufacturer} {assetConfig.model}
                            </div>
                          </div>
                          <div>
                            <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-sm)' }}>Year</div>
                            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                              {assetConfig.year}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-muted rounded-[var(--radius-card)] border-2 border-border">
                        <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-4" style={{ fontSize: 'var(--text-lg)' }}>
                          Cost Code Assignment
                        </h4>
                        {selectedCostCode ? (
                          <div>
                            <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-bold)] text-foreground mb-1" style={{ fontSize: 'var(--text-lg)' }}>
                              {selectedCostCode.code}
                            </div>
                            <div className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-base)' }}>
                              {selectedCostCode.description}
                            </div>
                          </div>
                        ) : (
                          <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-base)' }}>
                            No cost code assigned
                          </div>
                        )}
                      </div>

                      <div className="p-6 bg-muted rounded-[var(--radius-card)] border-2 border-border">
                        <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-4" style={{ fontSize: 'var(--text-lg)' }}>
                          Allowed Map Areas ({assetConfig.allowedMapAreas.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {assetConfig.allowedMapAreas.map(area => (
                            <div key={area} className="px-4 py-2 bg-primary/10 rounded-full border-2 border-primary">
                              <span className="text-primary font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-sm)' }}>
                                {area}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setCurrentStep('map-area')}
                        className="flex-1 min-h-[70px] px-8 rounded-[var(--radius-button)] bg-muted text-foreground hover:opacity-90 transition-opacity"
                      >
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                          Back
                        </span>
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex-1 min-h-[70px] px-8 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <Save className="w-5 h-5" />
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-base)' }}>
                          Save Configuration
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'rates' && (
              <div className="p-8">
                <EquipmentRateReconciliation
                  assetName={`${assetConfig.manufacturer} ${assetConfig.model}`}
                  currentSource={assetConfig.equipmentRateSource}
                  currentRate={assetConfig.hourlyRate}
                  onSourceChange={(source) => setAssetConfig({ ...assetConfig, equipmentRateSource: source })}
                  onRateChange={(rate) => setAssetConfig({ ...assetConfig, hourlyRate: rate })}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Split Shift Modal */}
      {showSplitShift && (
        <SplitShiftCostCoding
          onClose={() => setShowSplitShift(false)}
          assetName={`${assetConfig.manufacturer} ${assetConfig.model}`}
        />
      )}
    </>
  );
}
