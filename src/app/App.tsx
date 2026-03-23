import { useState, useRef, useEffect } from 'react';
import { AssetHeader } from './components/AssetHeader';
import { ViewToggle } from './components/ViewToggle';
import { PredictiveAlerts } from './components/PredictiveAlerts';
import { AlertsDrawer } from './components/AlertsDrawer';
import { HistoricalAnalysis } from './components/HistoricalAnalysis';
import { ProductionVelocity } from './components/ProductionVelocity';
import { GeoIntelligence } from './components/GeoIntelligence';
import { JobSiteMap3D } from './components/JobSiteMap3D';
import { AssetSettingsPanel } from './components/AssetSettingsPanel';
import { GeospatialDeviationMonitor } from './components/GeospatialDeviationMonitor';
import { SplitScreenCADView } from './components/SplitScreenCADView';
import { UnifiedMapView } from './components/UnifiedMapView';
import { ExpandedMonitoring } from './components/ExpandedMonitoring';
import { AssetDiagnostics } from './components/AssetDiagnostics';
import { ReportExport } from './components/ReportExport';
import { DailyPrepFlow } from './components/DailyPrepFlow';
import { SafetyEscalationModal } from './components/SafetyEscalationModal';
import { ProductionMetricsToday } from './components/ProductionMetricsToday';
import { InlineMonitoring } from './components/InlineMonitoring';
import { GlobalActionsToolbar } from './components/GlobalActionsToolbar';
import { FloatingMonitor } from './components/FloatingMonitor';
import { Sidebar } from './components/Sidebar';
import { InlineMapView } from './components/InlineMapView';
import { InlineCADDesignView } from './components/InlineCADDesignView';
import { Radio, StopCircle, MessageSquare, AlertCircle, Wrench, MapPin as MapPinIcon, Pencil, X, LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  History,
  TrendingDown,
  DraftingCompass,
  Map,
  Video,
  BarChart3
} from 'lucide-react';
import { TrendsComparison } from './components/TrendsComparison';

export default function App() {
  const [activeView, setActiveView] = useState<'live' | 'historical' | 'jobsite' | 'trends'>('live');
  const [isMonitoringExpanded, setIsMonitoringExpanded] = useState(false);
  const [showActivityInput, setShowActivityInput] = useState(false);
  const [activityText, setActivityText] = useState('');
  const [showAssetSettings, setShowAssetSettings] = useState(false);
  const [showSplitScreenCAD, setShowSplitScreenCAD] = useState(false);
  const [showMapView, setShowMapView] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [showDailyPrep, setShowDailyPrep] = useState(false);
  const [showSafetyEscalation, setShowSafetyEscalation] = useState(false);

  const monitorRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const planRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };


  // Mock Red Zone Event Data
  const mockRedZoneEvent = {
    id: 'EVT-2026-03-20-001',
    timestamp: new Date().toISOString(),
    assetId: 'JD-650-001',
    assetName: 'John Deere 650 Bulldozer',
    location: {
      zone: 'Zone B-2 (Excavation Area)',
      coordinates: '34.0522°N, 118.2437°W'
    },
    wearableId: 'WEAR-4782',
    personName: 'Michael Chen',
    severity: 'CRITICAL' as const,
    proximityDistance: 4.2,
    assetSpeed: 6.8,
    eventType: 'RED_ZONE_INCURSION' as const
  };

  // Mock alerts data for Workflow 5
  const [alerts, setAlerts] = useState([
    {
      id: '1',
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      title: 'Human Proximity Alert',
      description: 'Worker detected within 15ft safety zone',
      riskLevel: 'critical' as const,
      videoSnippet: 'video-1',
      acknowledged: false,
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      title: 'Speed Threshold Exceeded',
      description: 'Operating speed: 8.2 MPH (Max: 7.5 MPH)',
      riskLevel: 'warning' as const,
      videoSnippet: 'video-2',
      acknowledged: false,
    },
  ]);

  // Mock bookmarks for Workflow 4
  const [bookmarks, setBookmarks] = useState<Array<{ id: string; timestamp: Date; note?: string }>>([]);

  // Mock asset data
  const assetData = {
    name: 'John Deere 650 Bulldozer',
    model: 'Model 650K XLT | Serial: 1T0650KXGKF270001',
    status: 'Active' as const,
    location: {
      lat: 34.0522,
      lng: -118.2437,
      siteName: 'Interstate 405 Expansion - Section 7B',
    },
    currentActivity: 'Grading & Leveling',
  };

  const [isMonitorInView, setIsMonitorInView] = useState(true);

  useEffect(() => {
    if (activeView === 'historical') {
      setIsMonitorInView(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMonitorInView(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    // Small delay to ensure Ref is attached after view swap
    const timer = setTimeout(() => {
      if (monitorRef.current) {
        observer.observe(monitorRef.current);
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [activeView]);

  const handleAcknowledge = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, acknowledged: true } : alert
    ));
  };

  const handleAddNote = (id: string, note: string) => {
    console.log(`Note added to alert ${id}:`, note);
    // In real app, this would save to backend
  };

  const handleRadioOperator = (id: string) => {
    console.log(`Radioing operator about alert ${id}`);
    // In real app, this would trigger field communication
  };

  const handleBookmark = () => {
    const newBookmark = {
      id: `bookmark-${Date.now()}`,
      timestamp: new Date(),
    };
    setBookmarks([...bookmarks, newBookmark]);
    console.log('Moment bookmarked for later review:', newBookmark);
    // In real app, this would save video snippet to backend
  };

  const handleExpandVideo = () => {
    setIsMonitoringExpanded(true);
  };

  const handleRecordActivity = () => {
    if (activityText.trim()) {
      // Log activity with timestamp for historical tracking
      console.log('Activity recorded:', {
        timestamp: new Date(),
        activity: activityText,
        asset: assetData.name,
      });
      setActivityText('');
      setShowActivityInput(false);
    }
  };

  const unacknowledgedCount = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="h-screen flex bg-background overflow-hidden font-[family-name:var(--font-family)]">
      {/* Stripe-style Navigation Sidebar */}
      <Sidebar 
        activeView={activeView} 
        onViewChange={(view) => {
          if (view === 'live' || view === 'historical' || view === 'jobsite' || view === 'trends') {
            setActiveView(view);
          }
        }} 
      />

      <main className="flex-1 flex overflow-hidden">
        {/* Left Column (3/4ths) - Monitoring & Dashboard */}
        <div className="w-[75%] flex flex-col h-full border-r-2 border-border overflow-hidden relative">
        {/* Header - Workflow 1 (Asset Specific) */}
        {(activeView === 'live' || activeView === 'historical' || activeView === 'trends') && (
          <AssetHeader
            assetName={assetData.name}
            assetModel={assetData.model}
            status={assetData.status}
            location={assetData.location}
            currentActivity={assetData.currentActivity}
            todayWarnings={unacknowledgedCount}
            onExpandVideo={handleExpandVideo}
            onOpenSettings={() => setShowAssetSettings(true)}
            onOpenDiagnostics={() => setShowDiagnostics(true)}
            onOpenReports={() => setShowReports(true)}
            onOpenDailyPrep={() => setShowDailyPrep(true)}
            rentalRate={{
              activeRate: 285.00,
              activeRateSource: 'ERP',
              hourlyRate: 287.50,
              fuel: 45.00,
              maintenance: 62.50,
              depreciation: 180.00,
            }}
            utilization={{
              rate: 68.5,
              plannedMaintenance: 0.5,
              unplannedDowntime: 2.87,
              idleCost: 4422,
            }}
          />
        )}

        {/* View Toggle (Asset Specific) */}
        {(activeView === 'live' || activeView === 'historical' || activeView === 'trends') && (
          <div className="flex-shrink-0">
            <ViewToggle 
              activeView={activeView} 
              onViewChange={setActiveView}
            />
          </div>
        )}

        {/* Main Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Main Content - Live View (Workflow 1) */}
          {activeView === 'live' && (
            <div className="p-8">
              <div className="max-w-[1400px] mx-auto">


                {/* Section Header */}
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h2 className="text-foreground mb-2">How are we doing today?</h2>
                    <p className="text-muted-foreground">Predictive risk modeling and real-time safety monitoring</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => scrollToSection(planRef)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 text-foreground hover:bg-muted/80 transition-all duration-300 shadow-sm"
                      title="Scroll to Cut/Fill Analysis"
                    >
                      <DraftingCompass className="w-5 h-5 stroke-[1.5]" />
                    </button>
                    <button 
                      onClick={() => scrollToSection(mapRef)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 text-foreground hover:bg-muted/80 transition-all duration-300 shadow-sm"
                      title="Scroll to Site Map"
                    >
                      <Map className="w-5 h-5 stroke-[1.5]" />
                    </button>
                    <button 
                      onClick={() => scrollToSection(monitorRef)}
                      className="w-10 h-10 flex items-center justify-center rounded-xl bg-muted/50 text-foreground hover:bg-muted/80 transition-all duration-300 shadow-sm"
                      title="Scroll to Video Monitoring"
                    >
                      <Video className="w-5 h-5 stroke-[1.5]" />
                    </button>
                  </div>
                </div>

                {/* Inline Monitoring View (Workflow 4) */}
                <div className="mb-6" ref={monitorRef}>
                  <InlineMonitoring 
                    location={assetData.location}
                    assetName={assetData.name}
                    alerts={alerts}
                    onRadioOperator={handleRadioOperator}
                    onVerifyPlan={() => setShowSplitScreenCAD(true)}
                    onShowMap={() => setShowMapView(true)}
                    onShowVideo={() => setIsMonitoringExpanded(true)}
                    onAlert={() => setShowSafetyEscalation(true)}
                  />
                </div>

                {/* Production Velocity Module */}
                <div className="mb-6">
                  <ProductionVelocity />
                </div>

                {/* Production Metrics - Today */}
                <div className="mb-6">
                  <ProductionMetricsToday />
                </div>

                {/* GNSS vs CAD Design Grade Module */}
                <div className="mb-6" ref={planRef}>
                  <InlineCADDesignView 
                    assetName={assetData.name}
                  />
                </div>

                {/* Predictive Alerts - Workflow 3 */}
                <div className="mb-6">
                  <PredictiveAlerts />
                </div>

                {/* Safety Strategy Map Module */}
                <div className="mb-6" ref={mapRef}>
                  <InlineMapView 
                    assetName={assetData.name}
                    location={assetData.location}
                  />
                </div>
              </div>
            </div>
          )}
          {activeView === 'historical' && (
            <div className="p-8">
              <div className="max-w-[1400px] mx-auto space-y-8">
                <HistoricalAnalysis 
                  onScrollToPlan={() => scrollToSection(planRef)}
                  onScrollToMap={() => scrollToSection(mapRef)}
                  onScrollToVideo={() => scrollToSection(videoRef)}
                  videoRef={videoRef}
                  assetName={assetData.name}
                  assetLocation={assetData.location}
                />
              </div>
            </div>
          )}

          {activeView === 'jobsite' && (
            <div className="p-8">
              <div className="max-w-[1400px] mx-auto">
                <div className="mb-8">
                  <h2 className="text-foreground">Jobsite Digital Twin</h2>
                  <p className="text-muted-foreground">3D visualization of site progress and terrain telemetry</p>
                </div>
                <div ref={mapRef} className="mb-12">
                  <JobSiteMap3D />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-4">Site Intelligence Recap</h3>
                  <GeoIntelligence />
                </div>
              </div>
            </div>
          )}

          {activeView === 'trends' && (
            <div className="p-8">
              <div className="max-w-[1400px] mx-auto">
                <TrendsComparison assetName={assetData.name} />
              </div>
            </div>
          )}

        </div>

        {/* Global Floating Actions Toolbar - Hand-off when monitor is out of view */}
        {!isMonitorInView && (
          <GlobalActionsToolbar 
            variant="global"
            onVerifyPlan={() => setShowSplitScreenCAD(true)}
            onShowMap={() => setShowMapView(true)}
            onShowVideo={() => setIsMonitoringExpanded(true)}
            onAlert={() => setShowSafetyEscalation(true)}
          />
        )}

        {/* Picture-in-Picture Floating Monitor - Constrained to Left Column */}
        {!isMonitorInView && !isMonitoringExpanded && (
          <FloatingMonitor 
            onExpand={() => scrollToSection(monitorRef)}
            assetName={assetData.name}
          />
        )}
      </div>

      {/* Right Column (1/4th) - Active Alerts Sidebar */}
      <div className="w-[25%] h-full flex flex-col bg-muted/20">
        <AlertsDrawer
          alerts={alerts}
          onAcknowledge={handleAcknowledge}
          onAddNote={handleAddNote}
          onRadioOperator={handleRadioOperator}
        />
      </div>
    </main>

    {/* Modals and Overlays */}
    {isMonitoringExpanded && (
        <ExpandedMonitoring
          onClose={() => setIsMonitoringExpanded(false)}
          onBookmark={handleBookmark}
          location={assetData.location}
          assetName={assetData.name}
          alerts={alerts}
          onAcknowledge={handleAcknowledge}
          onAddNote={handleAddNote}
          onRadioOperator={handleRadioOperator}
          onMapClick={() => setShowMapView(true)}
        />
      )}

      {/* Asset Settings Panel (with Equipment Rate Reconciliation) */}
      {showAssetSettings && (
        <AssetSettingsPanel
          onClose={() => setShowAssetSettings(false)}
          existingConfig={{
            vin: '1T0650KXGKF270001',
            assetTag: 'JD-650-001',
            manufacturer: 'John Deere',
            model: '650K XLT',
            year: '2024',
            primaryCostCode: 'CSI 31 22 00',
            allowedMapAreas: ['Zone B-1', 'Zone B-2', 'Zone C-1'],
            equipmentRateSource: 'erp',
            hourlyRate: 285
          }}
        />
      )}

      {/* Split Screen CAD View */}
      {showSplitScreenCAD && (
        <SplitScreenCADView
          onClose={() => setShowSplitScreenCAD(false)}
          assetName={assetData.name}
          costCode="CSI 31 22 00"
        />
      )}

      {/* Unified Map View */}
      {showMapView && (
        <UnifiedMapView
          onClose={() => setShowMapView(false)}
          assetName={assetData.name}
          location={assetData.location}
        />
      )}

      {/* Asset Diagnostics Modal */}
      {showDiagnostics && (
        <AssetDiagnostics
          onClose={() => setShowDiagnostics(false)}
          assetName={assetData.name}
          assetValue={1200000}
        />
      )}

      {/* Report Export Modal */}
      {showReports && (
        <ReportExport
          onClose={() => setShowReports(false)}
          assetName={assetData.name}
          assetModel={assetData.model}
          projectName="Interstate 405 Expansion - Section 7B"
          contractorName="Granite Construction Company"
          ownerName="California Department of Transportation (Caltrans)"
        />
      )}

      {/* Daily Prep Flow Modal */}
      {showDailyPrep && (
        <DailyPrepFlow
          onClose={() => setShowDailyPrep(false)}
          assetName={assetData.name}
          assetId="JD-650-001"
        />
      )}

      {/* Safety Escalation Modal */}
      {showSafetyEscalation && (
        <SafetyEscalationModal
          event={mockRedZoneEvent}
          onSignOff={(supervisorName, notes) => {
            console.log('Safety escalation signed off by:', supervisorName);
            console.log('Incident notes:', notes);
            // In real app, this would save to audit trail and unlock UI
            setShowSafetyEscalation(false);
          }}
        />
      )}
    </div>
  );
}
