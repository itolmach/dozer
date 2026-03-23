import { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  DollarSign,
  Percent,
  Calendar,
  Building2,
  User,
  MapPin,
  Clock,
  Activity,
  Zap,
  Flame,
  Target,
  Settings,
  Upload,
  Image,
  Navigation,
  Map,
  Layers,
  Calculator,
  Info
} from 'lucide-react';
import { ComparativeAnalysis } from './ComparativeAnalysis';
import { PartialVerificationModule } from './PartialVerificationModule';
import { ProofOfWorkUpload } from './ProofOfWorkUpload';
import { CubicYardsReconciliation } from './CubicYardsReconciliation';
import { ProjectSystemicHealth } from './ProjectSystemicHealth';

interface ReportExportProps {
  onClose: () => void;
  assetName: string;
  assetModel: string;
  projectName: string;
  contractorName: string;
  ownerName: string;
}

interface CostCodeData {
  code: string;
  name: string;
  bidQuantity: number;
  bidUnit: string;
  bidUnitCost: number;
  bidTotalCost: number;
  actualQuantity: number;
  actualUnitCost: number;
  actualTotalCost: number;
  percentComplete: number;
  variance: number;
  variancePercent: number;
  gpsVerified: boolean;
}

export function ReportExport({ 
  onClose, 
  assetName, 
  assetModel,
  projectName,
  contractorName,
  ownerName
}: ReportExportProps) {
  const [reportType, setReportType] = useState<'progress' | 'postmortem'>('progress');
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'excel'>('pdf');
  
  // Comparative Analysis State
  const [environmentalDifficulty, setEnvironmentalDifficulty] = useState(50); // 0-100 scale
  const [successMetric, setSuccessMetric] = useState<'profit' | 'consistency'>('profit');

  // Mock cost code data
  const costCodeData: CostCodeData[] = [
    {
      code: 'CSI 31 22 00',
      name: 'Grading & Site Preparation',
      bidQuantity: 12500,
      bidUnit: 'CY',
      bidUnitCost: 8.50,
      bidTotalCost: 106250,
      actualQuantity: 11840,
      actualUnitCost: 8.22,
      actualTotalCost: 97325,
      percentComplete: 94.7,
      variance: -8925,
      variancePercent: -8.4,
      gpsVerified: true,
    },
    {
      code: 'CSI 31 23 16',
      name: 'Rock Blasting & Excavation',
      bidQuantity: 3200,
      bidUnit: 'CY',
      bidUnitCost: 42.00,
      bidTotalCost: 134400,
      actualQuantity: 3685,
      actualUnitCost: 48.35,
      actualTotalCost: 178209,
      percentComplete: 115.2,
      variance: 43809,
      variancePercent: 32.6,
      gpsVerified: true,
    },
    {
      code: 'CSI 31 23 23',
      name: 'Hard Clay Excavation',
      bidQuantity: 8900,
      bidUnit: 'CY',
      bidUnitCost: 12.75,
      bidTotalCost: 113475,
      actualQuantity: 10235,
      actualUnitCost: 14.68,
      actualTotalCost: 150250,
      percentComplete: 115.0,
      variance: 36775,
      variancePercent: 32.4,
      gpsVerified: true,
    },
    {
      code: 'CSI 31 25 00',
      name: 'Erosion & Sediment Control',
      bidQuantity: 1500,
      bidUnit: 'LF',
      bidUnitCost: 18.50,
      bidTotalCost: 27750,
      actualQuantity: 1425,
      actualUnitCost: 17.80,
      actualTotalCost: 25365,
      percentComplete: 95.0,
      variance: -2385,
      variancePercent: -8.6,
      gpsVerified: false,
    },
    {
      code: 'CSI 32 11 23',
      name: 'Aggregate Base Course',
      bidQuantity: 5600,
      bidUnit: 'SY',
      bidUnitCost: 15.20,
      bidTotalCost: 85120,
      actualQuantity: 4280,
      actualUnitCost: 15.05,
      actualTotalCost: 64414,
      percentComplete: 76.4,
      variance: -20706,
      variancePercent: -24.3,
      gpsVerified: true,
    },
  ];

  const totalBidCost = costCodeData.reduce((sum, item) => sum + item.bidTotalCost, 0);
  const totalActualCost = costCodeData.reduce((sum, item) => sum + item.actualTotalCost, 0);
  const totalVariance = totalActualCost - totalBidCost;
  const totalVariancePercent = (totalVariance / totalBidCost) * 100;
  const overallPercentComplete = (costCodeData.reduce((sum, item) => sum + item.percentComplete, 0) / costCodeData.length);

  // Identify patterns for post-mortem insights
  const hardClayVariance = costCodeData.find(c => c.code === 'CSI 31 23 23');
  const rockBlastingVariance = costCodeData.find(c => c.code === 'CSI 31 23 16');

  const handleExport = () => {
    console.log(`Exporting ${reportType} report as ${selectedFormat}`);
    // In real implementation, this would generate and download the report
    alert(`${reportType === 'progress' ? 'Progress Payment' : 'Post-Mortem'} report exported as ${selectedFormat.toUpperCase()}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="h-[80px] bg-card border-b-4 border-primary px-8 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-primary rounded-full"></div>
          <div>
            <h2 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xl)' }}>
              Report Export Center
            </h2>
            <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
              {assetName} • Financial Integrity & Epistemic Loop Documentation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Report Type Selector */}
          <div className="flex items-center gap-2 bg-muted rounded-full p-1">
            <button
              onClick={() => setReportType('progress')}
              className={`min-h-[44px] px-6 py-2 rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] transition-colors ${
                reportType === 'progress'
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-accent'
              }`}
              style={{ fontSize: 'var(--text-sm)' }}
            >
              Progress Payment
            </button>
            <button
              onClick={() => setReportType('postmortem')}
              className={`min-h-[44px] px-6 py-2 rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] transition-colors ${
                reportType === 'postmortem'
                  ? 'bg-primary text-white'
                  : 'text-foreground hover:bg-accent'
              }`}
              style={{ fontSize: 'var(--text-sm)' }}
            >
              Post-Mortem
            </button>
          </div>

          {/* Export Button */}
          <button 
            onClick={handleExport}
            className="min-w-[60px] min-h-[60px] px-6 py-3 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ fontSize: 'var(--text-sm)' }}>
              Export {selectedFormat.toUpperCase()}
            </span>
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="min-w-[60px] min-h-[60px] rounded-full bg-destructive/10 hover:bg-destructive/20 transition-colors flex items-center justify-center"
            title="Close Reports"
          >
            <X className="w-6 h-6 text-destructive" />
          </button>
        </div>
      </div>

      {/* Main Content - Report Preview */}
      <div className="flex-1 overflow-y-auto bg-background p-8">
        <div className="max-w-[1200px] mx-auto">
          {/* Report Document Container */}
          <div className="bg-card rounded-[var(--radius-card)] border-2 border-border shadow-[var(--elevation-lg)] overflow-hidden">
            {/* Report Header Section */}
            <div className="p-8 bg-muted/30 border-b-2 border-border">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-8 h-8 text-primary" />
                    <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
                      {reportType === 'progress' ? 'Digital As-Built Progress Report' : 'Post-Mortem Variance Analysis'}
                    </h3>
                  </div>
                  <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-base)' }}>
                    {reportType === 'progress' 
                      ? 'GPS-Verified Quantities-to-Date • Forensic Proof for Progress Payment'
                      : 'Estimated vs Actual Cost Analysis • Future Bid Refinement Intelligence'
                    }
                  </p>
                </div>

                {/* Format Selector */}
                <div className="flex items-center gap-2 bg-background rounded-full p-1 border-2 border-border">
                  <button
                    onClick={() => setSelectedFormat('pdf')}
                    className={`min-h-[44px] px-4 py-2 rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] transition-colors ${
                      selectedFormat === 'pdf'
                        ? 'bg-foreground text-white'
                        : 'text-foreground hover:bg-muted'
                    }`}
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    PDF
                  </button>
                  <button
                    onClick={() => setSelectedFormat('excel')}
                    className={`min-h-[44px] px-4 py-2 rounded-full font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] transition-colors ${
                      selectedFormat === 'excel'
                        ? 'bg-foreground text-white'
                        : 'text-foreground hover:bg-muted'
                    }`}
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    Excel
                  </button>
                </div>
              </div>

              {/* Project Information Grid */}
              <div className="grid grid-cols-3 gap-6 p-6 bg-background rounded-[var(--radius-card)] border-2 border-border">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                      Project
                    </span>
                  </div>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                    {projectName}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                      Contractor
                    </span>
                  </div>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                    {contractorName}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                      Owner
                    </span>
                  </div>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                    {ownerName}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                      Asset
                    </span>
                  </div>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                    {assetName}
                  </div>
                  <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                    {assetModel}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                      Report Date
                    </span>
                  </div>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                      Billing Period
                    </span>
                  </div>
                  <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                    March 2026
                  </div>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="p-8">
              {reportType === 'progress' && (
                <>
                  {/* Progress Payment Report */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                        Quantities-to-Date Summary
                      </h4>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-color-success/10 border-2 border-color-success">
                        <CheckCircle className="w-5 h-5 text-color-success" />
                        <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-color-success" style={{ fontSize: 'var(--text-base)' }}>
                          {overallPercentComplete.toFixed(1)}% Complete
                        </span>
                      </div>
                    </div>

                    {/* Overall Financial Summary */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="p-6 bg-muted rounded-[var(--radius-card)] border-2 border-border">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                          Total Bid Amount
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
                          ${totalBidCost.toLocaleString()}
                        </div>
                      </div>

                      <div className="p-6 bg-muted rounded-[var(--radius-card)] border-2 border-border">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                          Work Completed (GPS-Verified)
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
                          ${totalActualCost.toLocaleString()}
                        </div>
                      </div>

                      <div className="p-6 bg-muted rounded-[var(--radius-card)] border-2 border-border">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                          Progress Payment Due
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-primary" style={{ fontSize: 'var(--text-2xl)' }}>
                          ${(totalActualCost * 0.9).toLocaleString()}
                        </div>
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mt-1" style={{ fontSize: 'var(--text-xs)' }}>
                          (90% retention applied)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cost Code Breakdown Table */}
                  <div className="border-2 border-border rounded-[var(--radius-card)] overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b-2 border-border" style={{ fontSize: 'var(--text-sm)' }}>
                            Cost Code
                          </th>
                          <th className="text-left px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b-2 border-border" style={{ fontSize: 'var(--text-sm)' }}>
                            Description
                          </th>
                          <th className="text-right px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b-2 border-border" style={{ fontSize: 'var(--text-sm)' }}>
                            Bid Qty
                          </th>
                          <th className="text-right px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b-2 border-border" style={{ fontSize: 'var(--text-sm)' }}>
                            Actual Qty
                          </th>
                          <th className="text-right px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b-2 border-border" style={{ fontSize: 'var(--text-sm)' }}>
                            Bid Total
                          </th>
                          <th className="text-right px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b-2 border-border" style={{ fontSize: 'var(--text-sm)' }}>
                            Earned Value
                          </th>
                          <th className="text-center px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b-2 border-border" style={{ fontSize: 'var(--text-sm)' }}>
                            % Complete
                          </th>
                          <th className="text-center px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b-2 border-border" style={{ fontSize: 'var(--text-sm)' }}>
                            GPS Verified
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {costCodeData.map((item, idx) => (
                          <tr key={item.code} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                            <td className="px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b border-border" style={{ fontSize: 'var(--text-sm)' }}>
                              {item.code}
                            </td>
                            <td className="px-4 py-4 font-[family-name:var(--font-family)] text-foreground border-b border-border" style={{ fontSize: 'var(--text-sm)' }}>
                              {item.name}
                            </td>
                            <td className="px-4 py-4 font-[family-name:var(--font-family)] text-foreground text-right border-b border-border" style={{ fontSize: 'var(--text-sm)' }}>
                              {item.bidQuantity.toLocaleString()} {item.bidUnit}
                            </td>
                            <td className="px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground text-right border-b border-border" style={{ fontSize: 'var(--text-sm)' }}>
                              {item.actualQuantity.toLocaleString()} {item.bidUnit}
                            </td>
                            <td className="px-4 py-4 font-[family-name:var(--font-family)] text-foreground text-right border-b border-border" style={{ fontSize: 'var(--text-sm)' }}>
                              ${item.bidTotalCost.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground text-right border-b border-border" style={{ fontSize: 'var(--text-sm)' }}>
                              ${item.actualTotalCost.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-center border-b border-border">
                              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${
                                item.percentComplete >= 100 
                                  ? 'bg-color-success/10 border border-color-success'
                                  : item.percentComplete >= 75
                                  ? 'bg-primary/10 border border-primary'
                                  : 'bg-color-warning/10 border border-color-warning'
                              }`}>
                                <span className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                                  item.percentComplete >= 100 ? 'text-color-success' : item.percentComplete >= 75 ? 'text-primary' : 'text-color-warning'
                                }`} style={{ fontSize: 'var(--text-sm)' }}>
                                  {item.percentComplete.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center border-b border-border">
                              {item.gpsVerified ? (
                                <CheckCircle className="w-5 h-5 text-color-success mx-auto" />
                              ) : (
                                <AlertTriangle className="w-5 h-5 text-color-warning mx-auto" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-muted/50">
                        <tr>
                          <td colSpan={4} className="px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-t-2 border-border" style={{ fontSize: 'var(--text-base)' }}>
                            TOTAL
                          </td>
                          <td className="px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground text-right border-t-2 border-border" style={{ fontSize: 'var(--text-base)' }}>
                            ${totalBidCost.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground text-right border-t-2 border-border" style={{ fontSize: 'var(--text-base)' }}>
                            ${totalActualCost.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 text-center font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-t-2 border-border" style={{ fontSize: 'var(--text-base)' }}>
                            {overallPercentComplete.toFixed(1)}%
                          </td>
                          <td className="px-4 py-4 border-t-2 border-border"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* GPS Verification Note */}
                  <div className="mt-6 p-6 bg-primary/10 rounded-[var(--radius-card)] border-2 border-primary/30">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h5 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-2" style={{ fontSize: 'var(--text-base)' }}>
                          GPS-Verified Digital As-Built Documentation
                        </h5>
                        <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                          All quantities marked with GPS verification have been measured using real-time kinematic positioning data from {assetName}. 
                          This serves as forensic proof of work completed and can be used to trigger progress payment invoices with full traceability.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Partial Verification Module */}
                  <PartialVerificationModule 
                    totalActualCost={totalActualCost}
                    costCodeData={costCodeData}
                  />

                  {/* Cubic Yards Reconciliation Module */}
                  <CubicYardsReconciliation />

                  {/* Proof of Work Upload Module */}
                  <ProofOfWorkUpload />
                </>
              )}

              {reportType === 'postmortem' && (
                <>
                  {/* Post-Mortem Report */}
                  <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                      <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                        Variance Analysis - Epistemic Loop
                      </h4>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                        totalVariance > 0 
                          ? 'bg-destructive/10 border-2 border-destructive'
                          : 'bg-color-success/10 border-2 border-color-success'
                      }`}>
                        {totalVariance > 0 ? (
                          <>
                            <TrendingUp className="w-5 h-5 text-destructive" />
                            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-base)' }}>
                              +${Math.abs(totalVariance).toLocaleString()} Over Budget
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-5 h-5 text-color-success" />
                            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-color-success" style={{ fontSize: 'var(--text-base)' }}>
                              -${Math.abs(totalVariance).toLocaleString()} Under Budget
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Overall Variance Summary */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="p-6 bg-muted rounded-[var(--radius-card)] border-2 border-border">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                          Estimated Cost
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
                          ${totalBidCost.toLocaleString()}
                        </div>
                      </div>

                      <div className="p-6 bg-muted rounded-[var(--radius-card)] border-2 border-border">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                          Actual Cost
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-2xl)' }}>
                          ${totalActualCost.toLocaleString()}
                        </div>
                      </div>

                      <div className={`p-6 rounded-[var(--radius-card)] border-2 ${
                        totalVariance > 0 ? 'bg-destructive/10 border-destructive' : 'bg-color-success/10 border-color-success'
                      }`}>
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                          Variance ($)
                        </div>
                        <div className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                          totalVariance > 0 ? 'text-destructive' : 'text-color-success'
                        }`} style={{ fontSize: 'var(--text-2xl)' }}>
                          {totalVariance > 0 ? '+' : '-'}${Math.abs(totalVariance).toLocaleString()}
                        </div>
                      </div>

                      <div className={`p-6 rounded-[var(--radius-card)] border-2 ${
                        totalVariancePercent > 0 ? 'bg-destructive/10 border-destructive' : 'bg-color-success/10 border-color-success'
                      }`}>
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-sm)' }}>
                          Variance (%)
                        </div>
                        <div className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                          totalVariancePercent > 0 ? 'text-destructive' : 'text-color-success'
                        }`} style={{ fontSize: 'var(--text-2xl)' }}>
                          {totalVariancePercent > 0 ? '+' : ''}{totalVariancePercent.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Variance Analysis Table */}
                  <div className="border-2 border-border rounded-[var(--radius-card)] overflow-hidden mb-6">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b-2 border-border" style={{ fontSize: 'var(--text-sm)' }}>
                            Cost Code
                          </th>
                          <th className="text-left px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b-2 border-border" style={{ fontSize: 'var(--text-sm)' }}>
                            Description
                          </th>
                          <th className="text-right px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b-2 border-border" style={{ fontSize: 'var(--text-sm)' }}>
                            Est. Unit Cost
                          </th>
                          <th className="text-right px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b-2 border-border" style={{ fontSize: 'var(--text-sm)' }}>
                            Actual Unit Cost
                          </th>
                          <th className="text-right px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b-2 border-border" style={{ fontSize: 'var(--text-sm)' }}>
                            Est. Total
                          </th>
                          <th className="text-right px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b-2 border-border" style={{ fontSize: 'var(--text-sm)' }}>
                            Actual Total
                          </th>
                          <th className="text-right px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b-2 border-border" style={{ fontSize: 'var(--text-sm)' }}>
                            Variance ($)
                          </th>
                          <th className="text-right px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b-2 border-border" style={{ fontSize: 'var(--text-sm)' }}>
                            Variance (%)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {costCodeData.map((item, idx) => (
                          <tr key={item.code} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                            <td className="px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-b border-border" style={{ fontSize: 'var(--text-sm)' }}>
                              {item.code}
                            </td>
                            <td className="px-4 py-4 font-[family-name:var(--font-family)] text-foreground border-b border-border" style={{ fontSize: 'var(--text-sm)' }}>
                              {item.name}
                            </td>
                            <td className="px-4 py-4 font-[family-name:var(--font-family)] text-foreground text-right border-b border-border" style={{ fontSize: 'var(--text-sm)' }}>
                              ${item.bidUnitCost.toFixed(2)}/{item.bidUnit}
                            </td>
                            <td className="px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground text-right border-b border-border" style={{ fontSize: 'var(--text-sm)' }}>
                              ${item.actualUnitCost.toFixed(2)}/{item.bidUnit}
                            </td>
                            <td className="px-4 py-4 font-[family-name:var(--font-family)] text-foreground text-right border-b border-border" style={{ fontSize: 'var(--text-sm)' }}>
                              ${item.bidTotalCost.toLocaleString()}
                            </td>
                            <td className="px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground text-right border-b border-border" style={{ fontSize: 'var(--text-sm)' }}>
                              ${item.actualTotalCost.toLocaleString()}
                            </td>
                            <td className={`px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-right border-b border-border ${
                              item.variance > 0 ? 'text-destructive' : 'text-color-success'
                            }`} style={{ fontSize: 'var(--text-sm)' }}>
                              {item.variance > 0 ? '+' : ''}${item.variance.toLocaleString()}
                            </td>
                            <td className={`px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-right border-b border-border ${
                              item.variancePercent > 0 ? 'text-destructive' : 'text-color-success'
                            }`} style={{ fontSize: 'var(--text-sm)' }}>
                              {item.variancePercent > 0 ? '+' : ''}{item.variancePercent.toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-muted/50">
                        <tr>
                          <td colSpan={4} className="px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground border-t-2 border-border" style={{ fontSize: 'var(--text-base)' }}>
                            TOTAL
                          </td>
                          <td className="px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground text-right border-t-2 border-border" style={{ fontSize: 'var(--text-base)' }}>
                            ${totalBidCost.toLocaleString()}
                          </td>
                          <td className="px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground text-right border-t-2 border-border" style={{ fontSize: 'var(--text-base)' }}>
                            ${totalActualCost.toLocaleString()}
                          </td>
                          <td className={`px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-right border-t-2 border-border ${
                            totalVariance > 0 ? 'text-destructive' : 'text-color-success'
                          }`} style={{ fontSize: 'var(--text-base)' }}>
                            {totalVariance > 0 ? '+' : ''}${totalVariance.toLocaleString()}
                          </td>
                          <td className={`px-4 py-4 font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-right border-t-2 border-border ${
                            totalVariancePercent > 0 ? 'text-destructive' : 'text-color-success'
                          }`} style={{ fontSize: 'var(--text-base)' }}>
                            {totalVariancePercent > 0 ? '+' : ''}{totalVariancePercent.toFixed(1)}%
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Bidding Intelligence Insights */}
                  <div className="space-y-4">
                    <h5 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-4" style={{ fontSize: 'var(--text-lg)' }}>
                      Intellectual Maturity - Future Bid Adjustments
                    </h5>

                    {/* Hard Clay Pattern */}
                    {hardClayVariance && hardClayVariance.variancePercent > 15 && (
                      <div className="p-6 bg-destructive/10 rounded-[var(--radius-card)] border-2 border-destructive">
                        <div className="flex items-start gap-4">
                          <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <h6 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive mb-2" style={{ fontSize: 'var(--text-base)' }}>
                              {hardClayVariance.code} - {hardClayVariance.name}
                            </h6>
                            <p className="text-foreground font-[family-name:var(--font-family)] mb-3" style={{ fontSize: 'var(--text-sm)' }}>
                              This asset consistently ran <span className="font-[var(--font-weight-semibold)] text-destructive">+{hardClayVariance.variancePercent.toFixed(1)}%</span> over budget on Hard Clay excavation. 
                              Unit cost increased from ${hardClayVariance.bidUnitCost.toFixed(2)} to ${hardClayVariance.actualUnitCost.toFixed(2)} per {hardClayVariance.bidUnit}.
                            </p>
                            <div className="p-4 bg-destructive/20 rounded-[var(--radius-button)]">
                              <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="w-5 h-5 text-destructive" />
                                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                                  Recommended Risk Premium Adjustment
                                </span>
                              </div>
                              <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                                Add <span className="font-[var(--font-weight-semibold)]">+15% contingency</span> to all future bids involving Hard Clay excavation with this asset class. 
                                This ensures the firm remains sovereign and profitable on similar projects.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Rock Blasting Pattern */}
                    {rockBlastingVariance && rockBlastingVariance.variancePercent > 15 && (
                      <div className="p-6 bg-destructive/10 rounded-[var(--radius-card)] border-2 border-destructive">
                        <div className="flex items-start gap-4">
                          <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <h6 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive mb-2" style={{ fontSize: 'var(--text-base)' }}>
                              {rockBlastingVariance.code} - {rockBlastingVariance.name}
                            </h6>
                            <p className="text-foreground font-[family-name:var(--font-family)] mb-3" style={{ fontSize: 'var(--text-sm)' }}>
                              Rock blasting operations exceeded estimates by <span className="font-[var(--font-weight-semibold)] text-destructive">+{rockBlastingVariance.variancePercent.toFixed(1)}%</span>.
                              Quantity increased {((rockBlastingVariance.actualQuantity / rockBlastingVariance.bidQuantity - 1) * 100).toFixed(1)}% beyond initial survey, 
                              and unit costs rose from ${rockBlastingVariance.bidUnitCost.toFixed(2)} to ${rockBlastingVariance.actualUnitCost.toFixed(2)}.
                            </p>
                            <div className="p-4 bg-destructive/20 rounded-[var(--radius-button)]">
                              <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="w-5 h-5 text-destructive" />
                                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                                  Recommended Risk Premium Adjustment
                                </span>
                              </div>
                              <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                                For rock-heavy sites, add <span className="font-[var(--font-weight-semibold)]">+20% contingency</span> and require subsurface geotechnical investigation before bidding. 
                                Correlate this data with equipment downtime logs showing hydraulic failures during rock work.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Positive Performance */}
                    <div className="p-6 bg-color-success/10 rounded-[var(--radius-card)] border-2 border-color-success">
                      <div className="flex items-start gap-4">
                        <CheckCircle className="w-6 h-6 text-color-success flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h6 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-color-success mb-2" style={{ fontSize: 'var(--text-base)' }}>
                            CSI 31 22 00 - Grading & Site Preparation
                          </h6>
                          <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                            Performed <span className="font-[var(--font-weight-semibold)] text-color-success">-8.4% under budget</span>. 
                            This asset demonstrated excellent efficiency on standard grading operations. 
                            Current unit cost assumptions can be maintained or slightly reduced for competitive bidding advantage.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Epistemic Loop Summary */}
                  <div className="mt-6 p-6 bg-primary/10 rounded-[var(--radius-card)] border-2 border-primary/30">
                    <div className="flex items-start gap-3">
                      <BarChart3 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <h5 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-2" style={{ fontSize: 'var(--text-base)' }}>
                          Epistemic Loop - Continuous Intelligence Refinement
                        </h5>
                        <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                          This post-mortem analysis archives into the company's intelligence system. Future estimators will see that <span className="font-[var(--font-weight-semibold)]">{assetModel}</span> 
                          {' '}has documented performance patterns on specific soil types and geological conditions. By refining risk premiums based on actual data, 
                          the firm achieves <span className="font-[var(--font-weight-semibold)]">intellectual maturity</span> and maintains competitive sovereignty in the marketplace.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Comparative Analysis Module */}
                  <div className="mt-8 pt-8 border-t-4 border-border">
                    <ComparativeAnalysis
                      environmentalDifficulty={environmentalDifficulty}
                      successMetric={successMetric}
                      onDifficultyChange={setEnvironmentalDifficulty}
                      onMetricChange={setSuccessMetric}
                    />
                  </div>

                  {/* Project Systemic Health Module */}
                  <div className="mt-8 pt-8 border-t-4 border-border">
                    <ProjectSystemicHealth
                      assetName={assetName}
                      assetModel={assetModel}
                      projectName={projectName}
                      contractorName={contractorName}
                      ownerName={ownerName}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}