import React, { useState } from 'react';
import { 
  X, 
  Map, 
  Layers, 
  MapPin, 
  Navigation, 
  Activity, 
  Grid3x3,
  AlertTriangle,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Clock,
  DollarSign,
  TrendingUp,
  Filter,
  Maximize2,
  Play,
  Pause,
  Signal,
  Gauge,
  Shield,
  Users,
  Ban,
  Target,
  Zap
} from 'lucide-react';

interface UnifiedMapViewProps {
  onClose?: () => void;
  assetName?: string;
  isInline?: boolean;
  location?: {
    lat: number;
    lng: number;
    siteName: string;
  };
}

interface MapLayer {
  id: string;
  name: string;
  enabled: boolean;
  icon: React.ReactNode;
  color: string;
}

interface GeoPoint {
  lat: number;
  lng: number;
  timestamp: Date;
}

interface ProductionCycle {
  id: string;
  name: string;
  geoPath: GeoPoint[];
  workZone: string;
  status: 'active' | 'completed' | 'predicted';
  volumeMoved: number;
  unitCost: number;
  bidPrice: number;
  variance: number;
  nearMissCount: number;
}

interface VolumeZone {
  zone: string;
  volumeMoved: number;
  finishGrade: number;
  percentComplete: number;
  coordinates: { x: number; y: number };
}

interface RiskHeatmapData {
  zone: string;
  incidents: number;
  severity: 'low' | 'medium' | 'high';
  coordinates: { x: number; y: number };
}

interface SafetyZone {
  id: string;
  type: 'personnel' | 'restricted' | 'geofence';
  name: string;
  coordinates: { x: number; y: number };
  radius?: number;
  bounds?: { x: number; y: number; width: number; height: number };
  incursionCount: number;
  lastIncursion?: Date;
}

interface AssetPosition {
  id: string;
  name: string;
  coordinates: { x: number; y: number };
  heading: number; // degrees
  swingRadius: number;
  nearMissCount: number;
  productionVelocity: number; // yd³/hr
}

interface SafetyIncursion {
  id: string;
  timestamp: Date;
  zoneId: string;
  zoneName: string;
  assetId: string;
  severity: 'warning' | 'critical';
  distance: number; // feet
  duration: number; // seconds
  productionVelocity: number;
}

export function UnifiedMapView({ onClose, assetName, location, isInline = false }: UnifiedMapViewProps) {
  const [mapLayers, setMapLayers] = useState<MapLayer[]>([
    { id: 'cycles', name: 'Production Cycles', enabled: true, icon: <Activity className="w-4 h-4" />, color: 'var(--primary)' },
    { id: 'heatmap', name: 'Progress Heatmap', enabled: true, icon: <Layers className="w-4 h-4" />, color: 'var(--color-warning)' },
    { id: 'risk', name: 'Risk Zones', enabled: true, icon: <AlertTriangle className="w-4 h-4" />, color: 'var(--destructive)' },
    { id: 'zones', name: 'Volume Zones', enabled: true, icon: <Grid3x3 className="w-4 h-4" />, color: 'var(--color-success)' },
    { id: 'asset', name: 'Asset Position', enabled: true, icon: <MapPin className="w-4 h-4" />, color: 'var(--primary)' },
    { id: 'personnel', name: 'Personnel Areas', enabled: true, icon: <Users className="w-4 h-4" />, color: 'var(--destructive)' },
    { id: 'restricted', name: 'Restricted Zones', enabled: true, icon: <Ban className="w-4 h-4" />, color: 'var(--destructive)' },
    { id: 'swing', name: 'Swing Radius', enabled: true, icon: <Target className="w-4 h-4" />, color: 'var(--color-warning)' },
    { id: 'incursions', name: 'Safety Incursions', enabled: true, icon: <Shield className="w-4 h-4" />, color: 'var(--destructive)' },
  ]);

  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCycle, setSelectedCycle] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);

  // Mock data for production cycles with near-miss tracking
  const productionCycles: ProductionCycle[] = [
    {
      id: 'cycle-1',
      name: 'Excavate & Load - Dump Truck #3',
      geoPath: [
        { lat: 34.0522, lng: -118.2437, timestamp: new Date(Date.now() - 1000 * 60 * 8) },
        { lat: 34.0523, lng: -118.2438, timestamp: new Date(Date.now() - 1000 * 60 * 7) },
        { lat: 34.0524, lng: -118.2439, timestamp: new Date(Date.now() - 1000 * 60 * 6) },
        { lat: 34.0525, lng: -118.2440, timestamp: new Date(Date.now() - 1000 * 60 * 5) },
        { lat: 34.0526, lng: -118.2441, timestamp: new Date(Date.now() - 1000 * 60 * 4) },
      ],
      workZone: 'Zone A',
      status: 'completed',
      volumeMoved: 12.5,
      unitCost: 15.00,
      bidPrice: 12.50,
      variance: 20.0,
      nearMissCount: 1,
    },
    {
      id: 'cycle-2',
      name: 'Load & Transfer - Haul Truck #7',
      geoPath: [
        { lat: 34.0530, lng: -118.2445, timestamp: new Date(Date.now() - 1000 * 60 * 3) },
        { lat: 34.0531, lng: -118.2446, timestamp: new Date(Date.now() - 1000 * 60 * 2) },
        { lat: 34.0532, lng: -118.2447, timestamp: new Date(Date.now() - 1000 * 60 * 1) },
        { lat: 34.0533, lng: -118.2448, timestamp: new Date() },
      ],
      workZone: 'Zone B',
      status: 'active',
      volumeMoved: 8.3,
      unitCost: 11.54,
      bidPrice: 12.50,
      variance: -7.7,
      nearMissCount: 3,
    },
  ];

  // Mock data for volume zones
  const volumeZones: VolumeZone[] = [
    { zone: 'Zone A-1', volumeMoved: 2340, finishGrade: 2500, percentComplete: 93.6, coordinates: { x: 25, y: 30 } },
    { zone: 'Zone A-2', volumeMoved: 1820, finishGrade: 2500, percentComplete: 72.8, coordinates: { x: 45, y: 35 } },
    { zone: 'Zone B-1', volumeMoved: 2450, finishGrade: 2500, percentComplete: 98.0, coordinates: { x: 65, y: 40 } },
    { zone: 'Zone B-2', volumeMoved: 1560, finishGrade: 2500, percentComplete: 62.4, coordinates: { x: 35, y: 60 } },
    { zone: 'Zone C-1', volumeMoved: 2100, finishGrade: 2500, percentComplete: 84.0, coordinates: { x: 55, y: 65 } },
  ];

  // Mock data for risk heatmap
  const riskZones: RiskHeatmapData[] = [
    { zone: 'Zone A', incidents: 12, severity: 'medium', coordinates: { x: 30, y: 35 } },
    { zone: 'Zone B', incidents: 23, severity: 'high', coordinates: { x: 50, y: 50 } },
    { zone: 'Zone C', incidents: 7, severity: 'low', coordinates: { x: 60, y: 60 } },
  ];

  // Mock data for safety zones
  const safetyZones: SafetyZone[] = [
    {
      id: 'personnel-1',
      type: 'personnel',
      name: 'Ground Crew Area Alpha',
      coordinates: { x: 75, y: 25 },
      radius: 8,
      incursionCount: 5,
      lastIncursion: new Date(Date.now() - 1000 * 60 * 45),
    },
    {
      id: 'personnel-2',
      type: 'personnel',
      name: 'Equipment Staging Beta',
      coordinates: { x: 20, y: 70 },
      radius: 10,
      incursionCount: 2,
      lastIncursion: new Date(Date.now() - 1000 * 60 * 120),
    },
    {
      id: 'restricted-1',
      type: 'restricted',
      name: 'Utility Line Corridor',
      coordinates: { x: 15, y: 15 },
      bounds: { x: 10, y: 10, width: 30, height: 20 },
      incursionCount: 3,
      lastIncursion: new Date(Date.now() - 1000 * 60 * 30),
    },
    {
      id: 'geofence-1',
      type: 'geofence',
      name: 'Site Boundary North',
      coordinates: { x: 85, y: 15 },
      bounds: { x: 75, y: 10, width: 20, height: 15 },
      incursionCount: 0,
    },
  ];

  // Current asset position
  const currentAsset: AssetPosition = {
    id: 'asset-ex001',
    name: 'EX-001',
    coordinates: { x: 50, y: 50 },
    heading: 45,
    swingRadius: 18,
    nearMissCount: 3,
    productionVelocity: 127.5,
  };

  // Safety incursions data
  const safetyIncursions: SafetyIncursion[] = [
    {
      id: 'inc-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      zoneId: 'personnel-1',
      zoneName: 'Ground Crew Area Alpha',
      assetId: 'asset-ex001',
      severity: 'critical',
      distance: 8.5,
      duration: 12,
      productionVelocity: 135.2,
    },
    {
      id: 'inc-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      zoneId: 'restricted-1',
      zoneName: 'Utility Line Corridor',
      assetId: 'asset-ex001',
      severity: 'warning',
      distance: 12.3,
      duration: 8,
      productionVelocity: 128.7,
    },
    {
      id: 'inc-3',
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      zoneId: 'personnel-2',
      zoneName: 'Equipment Staging Beta',
      assetId: 'asset-ex001',
      severity: 'warning',
      distance: 15.8,
      duration: 5,
      productionVelocity: 95.3,
    },
  ];

  const toggleLayer = (layerId: string) => {
    setMapLayers(layers =>
      layers.map(layer =>
        layer.id === layerId ? { ...layer, enabled: !layer.enabled } : layer
      )
    );
  };

  const getProgressColor = (percent: number) => {
    if (percent >= 95) return 'var(--color-success)';
    if (percent >= 75) return 'var(--color-warning)';
    return 'var(--destructive)';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'var(--destructive)';
      case 'medium': return 'var(--color-warning)';
      case 'low': return 'var(--color-success)';
      default: return 'var(--border)';
    }
  };

  const isLayerEnabled = (layerId: string) => {
    return mapLayers.find(layer => layer.id === layerId)?.enabled || false;
  };

  // Calculate near-miss frequency rate
  const nearMissFrequency = (safetyIncursions.length / 8) * 100; // per 100 hours
  const avgProductionVelocity = safetyIncursions.reduce((sum, inc) => sum + inc.productionVelocity, 0) / safetyIncursions.length;
  const correlationRisk = nearMissFrequency > 30 && avgProductionVelocity > 120 ? 'high' : nearMissFrequency > 15 ? 'medium' : 'low';

  return (
    <div className={isInline ? "w-full bg-card rounded-[var(--radius-card)] overflow-hidden h-[700px] border-2 border-border" : "fixed inset-0 z-50 bg-background flex flex-col"}>
      {/* Header */}
      <div className={`h-[80px] bg-card border-b-4 border-primary px-8 flex items-center justify-between ${isInline ? 'border-b-2' : ''}`}>
        <div className="flex items-center gap-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div>
            <h2 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: isInline ? 'var(--text-lg)' : 'var(--text-xl)' }}>
              Unified Map View - Safety Intelligence
            </h2>
            {!isInline && (
              <p className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                Real-time proximity monitoring • Near-miss tracking • Production pressure correlation
              </p>
            )}
          </div>
        </div>

        {/* Top Controls */}
        <div className="flex items-center gap-3">
          {/* Near-Miss Alert Badge */}
          <div className={`px-4 py-2 rounded-[var(--radius-button)] border-2 flex items-center gap-2 ${
            correlationRisk === 'high' 
              ? 'bg-destructive/10 border-destructive' 
              : correlationRisk === 'medium' 
              ? 'bg-color-warning/10 border-color-warning'
              : 'bg-color-success/10 border-color-success'
          }`}>
            <Shield className={`w-5 h-5 ${
              correlationRisk === 'high' 
                ? 'text-destructive' 
                : correlationRisk === 'medium' 
                ? 'text-color-warning'
                : 'text-color-success'
            }`} />
            <div>
              <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]" style={{ 
                fontSize: 'var(--text-sm)',
                color: correlationRisk === 'high' 
                  ? 'var(--destructive)' 
                  : correlationRisk === 'medium' 
                  ? 'var(--color-warning)'
                  : 'var(--color-success)'
              }}>
                {nearMissFrequency.toFixed(1)} Near-Misses/100hrs
              </div>
              <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                {correlationRisk === 'high' && 'High velocity pressure'}
                {correlationRisk === 'medium' && 'Moderate risk'}
                {correlationRisk === 'low' && 'Within safety norms'}
              </div>
            </div>
          </div>

          {/* Search */}
          <button className="min-w-[60px] min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] bg-card border-2 border-border hover:bg-accent transition-colors flex items-center gap-2">
            <Search className="w-5 h-5 text-foreground" />
            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
              Search
            </span>
          </button>

          {/* Playback Control */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="min-w-[60px] min-h-[60px] px-4 py-3 rounded-[var(--radius-button)] bg-primary text-white hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
              {isPlaying ? 'Pause' : 'Play'}
            </span>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="min-w-[60px] min-h-[60px] rounded-full bg-destructive/10 hover:bg-destructive/20 transition-colors flex items-center justify-center"
            title="Close Map View"
          >
            <X className="w-6 h-6 text-destructive" />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - Layer Controls */}
        <div className="w-[320px] bg-card border-r-2 border-border overflow-y-auto">
          <div className="p-4">
            <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-4" style={{ fontSize: 'var(--text-base)' }}>
              Map Layers
            </h3>

            <div className="space-y-2">
              {mapLayers.map(layer => (
                <button
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={`w-full min-h-[60px] px-4 py-3 rounded-[var(--radius-card)] border-2 transition-all flex items-center gap-3 ${
                    layer.enabled
                      ? 'bg-accent border-primary'
                      : 'bg-card border-border hover:bg-accent'
                  }`}
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      layer.enabled ? 'bg-primary/20' : 'bg-muted'
                    }`}
                    style={{ color: layer.enabled ? layer.color : 'var(--muted-foreground)' }}
                  >
                    {layer.icon}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-sm)' }}>
                      {layer.name}
                    </div>
                    <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                      {layer.enabled ? 'Visible' : 'Hidden'}
                    </div>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${layer.enabled ? 'bg-primary' : 'bg-border'}`}></div>
                </button>
              ))}
            </div>

            {/* Safety Zones List */}
            <div className="mt-6">
              <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-3" style={{ fontSize: 'var(--text-base)' }}>
                Safety Zones
              </h3>
              <div className="space-y-2">
                {safetyZones.map(zone => (
                  <button
                    key={zone.id}
                    onClick={() => setSelectedZone(zone.id === selectedZone ? null : zone.id)}
                    className={`w-full p-3 rounded-[var(--radius-button)] border-2 transition-all ${
                      selectedZone === zone.id
                        ? 'bg-destructive/10 border-destructive'
                        : 'bg-card border-border hover:bg-accent'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {zone.type === 'personnel' ? (
                        <Users className="w-4 h-4 text-destructive" />
                      ) : zone.type === 'restricted' ? (
                        <Ban className="w-4 h-4 text-destructive" />
                      ) : (
                        <Shield className="w-4 h-4 text-color-warning" />
                      )}
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground text-left flex-1" style={{ fontSize: 'var(--text-xs)' }}>
                        {zone.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-muted-foreground mt-1">
                      <span className="font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                        {zone.incursionCount} incursions
                      </span>
                      {zone.lastIncursion && (
                        <span className="font-[family-name:var(--font-family)] text-destructive" style={{ fontSize: 'var(--text-xs)' }}>
                          {Math.round((Date.now() - zone.lastIncursion.getTime()) / 60000)}m ago
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Safety Stats Summary */}
            <div className="mt-6 p-4 bg-muted rounded-[var(--radius-card)] border-2 border-border">
              <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-3" style={{ fontSize: 'var(--text-sm)' }}>
                Safety Intelligence
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                    Near-Miss Frequency
                  </span>
                  <span className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]`} style={{ 
                    fontSize: 'var(--text-xs)',
                    color: correlationRisk === 'high' ? 'var(--destructive)' : 'var(--foreground)'
                  }}>
                    {nearMissFrequency.toFixed(1)}/100h
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                    Avg Velocity @ Incident
                  </span>
                  <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-xs)' }}>
                    {avgProductionVelocity.toFixed(1)} yd³/h
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                    Total Incursions
                  </span>
                  <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-xs)' }}>
                    {safetyIncursions.length}
                  </span>
                </div>
                {correlationRisk === 'high' && (
                  <div className="mt-3 p-2 bg-destructive/10 rounded border border-destructive">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-3 h-3 text-destructive" />
                      <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-xs)' }}>
                        Training Recommended
                      </span>
                    </div>
                    <p className="text-destructive font-[family-name:var(--font-family)]" style={{ fontSize: '10px' }}>
                      High production velocity correlates with increased safety incidents
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center - Map Canvas */}
        <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-muted via-accent/10 to-muted">
          {/* Map Controls Overlay */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
            <button
              onClick={() => setZoom(Math.min(zoom + 10, 200))}
              className="min-w-[60px] min-h-[60px] rounded-[var(--radius-button)] bg-card/95 backdrop-blur-sm border-2 border-border hover:bg-accent transition-colors flex items-center justify-center shadow-[var(--elevation-md)]"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => setZoom(Math.max(zoom - 10, 50))}
              className="min-w-[60px] min-h-[60px] rounded-[var(--radius-button)] bg-card/95 backdrop-blur-sm border-2 border-border hover:bg-accent transition-colors flex items-center justify-center shadow-[var(--elevation-md)]"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => setRotation((rotation + 90) % 360)}
              className="min-w-[60px] min-h-[60px] rounded-[var(--radius-button)] bg-card/95 backdrop-blur-sm border-2 border-border hover:bg-accent transition-colors flex items-center justify-center shadow-[var(--elevation-md)]"
              title="Rotate View"
            >
              <RotateCw className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Zoom Level Indicator */}
          <div className="absolute top-4 left-4 px-4 py-2 bg-card/95 backdrop-blur-sm rounded-[var(--radius-button)] border-2 border-border z-10">
            <span className="text-foreground font-[family-name:var(--font-family)] font-[var(--font-weight-medium)]" style={{ fontSize: 'var(--text-sm)' }}>
              Zoom: {zoom}% | Rotation: {rotation}°
            </span>
          </div>

          {/* Grid Background */}
          <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
            <defs>
              <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-foreground"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#map-grid)" />
          </svg>

          {/* Main Map SVG */}
          <svg 
            className="absolute inset-0 w-full h-full" 
            viewBox="0 0 100 100" 
            preserveAspectRatio="xMidYMid meet"
            style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)`, transition: 'transform 0.3s ease' }}
          >
            {/* Restricted Geofenced Zones Layer */}
            {isLayerEnabled('restricted') && safetyZones.filter(z => z.type === 'restricted' || z.type === 'geofence').map((zone, idx) => (
              <g 
                key={`restricted-${idx}`} 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedZone(zone.id === selectedZone ? null : zone.id);
                }}
                className="cursor-pointer"
              >
                {zone.bounds && (
                  <rect
                    x={zone.bounds.x}
                    y={zone.bounds.y}
                    width={zone.bounds.width}
                    height={zone.bounds.height}
                    fill="var(--destructive)"
                    opacity={selectedZone === zone.id ? 0.25 : 0.15}
                    stroke="var(--destructive)"
                    strokeWidth={selectedZone === zone.id ? 1.5 : 1}
                    strokeDasharray="3 2"
                  />
                )}
              </g>
            ))}

            {/* Personnel Areas (Red Zones) Layer */}
            {isLayerEnabled('personnel') && safetyZones.filter(z => z.type === 'personnel').map((zone, idx) => (
              <g 
                key={`personnel-${idx}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedZone(zone.id === selectedZone ? null : zone.id);
                }}
                className="cursor-pointer"
              >
                {zone.radius && (
                  <>
                    <circle
                      cx={zone.coordinates.x}
                      cy={zone.coordinates.y}
                      r={zone.radius}
                      fill="var(--destructive)"
                      opacity={selectedZone === zone.id ? 0.3 : 0.2}
                      stroke="var(--destructive)"
                      strokeWidth={selectedZone === zone.id ? 2 : 1.5}
                    />
                    <circle
                      cx={zone.coordinates.x}
                      cy={zone.coordinates.y}
                      r={zone.radius * 0.7}
                      fill="none"
                      stroke="var(--destructive)"
                      strokeWidth={0.8}
                      strokeDasharray="2 2"
                      opacity={0.5}
                    />
                  </>
                )}
              </g>
            ))}

            {/* Progress Heatmap Layer */}
            {isLayerEnabled('heatmap') && volumeZones.map((zone, idx) => (
              <g key={`heatmap-${idx}`}>
                <circle
                  cx={zone.coordinates.x}
                  cy={zone.coordinates.y}
                  r={8}
                  fill={getProgressColor(zone.percentComplete)}
                  opacity={zone.percentComplete / 200}
                  className="transition-all"
                />
                <circle
                  cx={zone.coordinates.x}
                  cy={zone.coordinates.y}
                  r={5}
                  fill={getProgressColor(zone.percentComplete)}
                  opacity={0.8}
                />
              </g>
            ))}

            {/* Risk Zones Layer */}
            {isLayerEnabled('risk') && riskZones.map((zone, idx) => (
              <g key={`risk-${idx}`}>
                <circle
                  cx={zone.coordinates.x}
                  cy={zone.coordinates.y}
                  r={zone.incidents / 2}
                  fill={getSeverityColor(zone.severity)}
                  opacity={0.2}
                  strokeWidth={0.5}
                  stroke={getSeverityColor(zone.severity)}
                />
                <circle
                  cx={zone.coordinates.x}
                  cy={zone.coordinates.y}
                  r={2}
                  fill={getSeverityColor(zone.severity)}
                />
              </g>
            ))}

            {/* Volume Zones Layer */}
            {isLayerEnabled('zones') && volumeZones.map((zone, idx) => (
              <g key={`zone-${idx}`}>
                <rect
                  x={zone.coordinates.x - 5}
                  y={zone.coordinates.y - 5}
                  width={10}
                  height={10}
                  fill="none"
                  stroke="var(--color-success)"
                  strokeWidth={0.5}
                  strokeDasharray="1 1"
                  opacity={0.6}
                />
                <text
                  x={zone.coordinates.x}
                  y={zone.coordinates.y + 8}
                  fontSize="2"
                  fill="var(--foreground)"
                  textAnchor="middle"
                  fontFamily="var(--font-family)"
                  fontWeight="600"
                  opacity={0.8}
                >
                  {zone.zone}
                </text>
              </g>
            ))}

            {/* Production Cycles Layer */}
            {isLayerEnabled('cycles') && productionCycles.map((cycle, cycleIdx) => {
              const isSelected = selectedCycle === cycle.id;
              const isOverBudget = cycle.variance > 0;
              const pathColor = isOverBudget ? 'var(--destructive)' : 'var(--primary)';

              return (
                <g key={`cycle-${cycleIdx}`}>
                  {/* Cycle Path */}
                  <polyline
                    points={cycle.geoPath.map((point, idx) => {
                      const x = 15 + cycleIdx * 25 + (idx / (cycle.geoPath.length - 1)) * 20;
                      const y = 20 + cycleIdx * 20 + Math.sin(idx * 0.5) * 10;
                      return `${x},${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke={pathColor}
                    strokeWidth={isSelected ? 3 : 2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={cycle.status === 'predicted' ? 0.5 : isSelected ? 1 : 0.7}
                    strokeDasharray={cycle.status === 'predicted' ? '2 1' : '0'}
                    className="transition-all cursor-pointer"
                    onClick={() => setSelectedCycle(cycle.id === selectedCycle ? null : cycle.id)}
                  />

                  {/* Waypoint Markers */}
                  {cycle.geoPath.map((point, idx) => {
                    const x = 15 + cycleIdx * 25 + (idx / (cycle.geoPath.length - 1)) * 20;
                    const y = 20 + cycleIdx * 20 + Math.sin(idx * 0.5) * 10;
                    const isStart = idx === 0;
                    const isEnd = idx === cycle.geoPath.length - 1;
                    const isCurrent = cycle.status === 'active' && isEnd;

                    return (
                      <g key={idx}>
                        <circle
                          cx={x}
                          cy={y}
                          r={isStart || isEnd ? 2 : 1}
                          fill={isStart ? 'var(--color-success)' : pathColor}
                          stroke="white"
                          strokeWidth={0.5}
                        />
                        {isCurrent && (
                          <circle
                            cx={x}
                            cy={y}
                            r={4}
                            fill="none"
                            stroke={pathColor}
                            strokeWidth={0.5}
                            opacity={0.6}
                          >
                            <animate
                              attributeName="r"
                              from="2"
                              to="6"
                              dur="1.5s"
                              repeatCount="indefinite"
                            />
                            <animate
                              attributeName="opacity"
                              from="0.8"
                              to="0"
                              dur="1.5s"
                              repeatCount="indefinite"
                            />
                          </circle>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Current Asset Position with Swing Radius */}
            {isLayerEnabled('asset') && (
              <g 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedAsset(currentAsset.id === selectedAsset ? null : currentAsset.id);
                }}
                className="cursor-pointer"
              >
                {/* Swing Radius */}
                {isLayerEnabled('swing') && (
                  <>
                    <circle
                      cx={currentAsset.coordinates.x}
                      cy={currentAsset.coordinates.y}
                      r={currentAsset.swingRadius}
                      fill="var(--color-warning)"
                      opacity={0.08}
                    />
                    <circle
                      cx={currentAsset.coordinates.x}
                      cy={currentAsset.coordinates.y}
                      r={currentAsset.swingRadius}
                      fill="none"
                      stroke="var(--color-warning)"
                      strokeWidth={1}
                      strokeDasharray="4 3"
                      opacity={0.6}
                    />
                  </>
                )}

                {/* Asset Marker */}
                <circle
                  cx={currentAsset.coordinates.x}
                  cy={currentAsset.coordinates.y}
                  r={3}
                  fill="var(--primary)"
                  stroke="white"
                  strokeWidth={1}
                />
                <circle
                  cx={currentAsset.coordinates.x}
                  cy={currentAsset.coordinates.y}
                  r={6}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth={0.5}
                  opacity={0.6}
                >
                  <animate
                    attributeName="r"
                    from="3"
                    to="8"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.8"
                    to="0"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Heading Indicator */}
                <path
                  d={`M ${currentAsset.coordinates.x},${currentAsset.coordinates.y - 3} L ${currentAsset.coordinates.x + 2},${currentAsset.coordinates.y - 7} L ${currentAsset.coordinates.x},${currentAsset.coordinates.y - 6} L ${currentAsset.coordinates.x - 2},${currentAsset.coordinates.y - 7} Z`}
                  fill="var(--primary)"
                  opacity="0.8"
                  transform={`rotate(${currentAsset.heading}, ${currentAsset.coordinates.x}, ${currentAsset.coordinates.y})`}
                />

                {/* Asset Label */}
                <text
                  x={currentAsset.coordinates.x}
                  y={currentAsset.coordinates.y - 10}
                  fontSize="3"
                  fill="var(--primary)"
                  textAnchor="middle"
                  fontFamily="var(--font-family)"
                  fontWeight="700"
                >
                  {currentAsset.name}
                </text>
              </g>
            )}

            {/* Safety Incursions Layer */}
            {isLayerEnabled('incursions') && safetyIncursions.map((incursion, idx) => {
              const zone = safetyZones.find(z => z.id === incursion.zoneId);
              if (!zone) return null;

              return (
                <g key={`incursion-${idx}`}>
                  {/* Incursion Warning Marker */}
                  <circle
                    cx={zone.coordinates.x + (idx * 3)}
                    cy={zone.coordinates.y - (idx * 2)}
                    r={2}
                    fill={incursion.severity === 'critical' ? 'var(--destructive)' : 'var(--color-warning)'}
                  />
                  <circle
                    cx={zone.coordinates.x + (idx * 3)}
                    cy={zone.coordinates.y - (idx * 2)}
                    r={4}
                    fill="none"
                    stroke={incursion.severity === 'critical' ? 'var(--destructive)' : 'var(--color-warning)'}
                    strokeWidth={0.8}
                    opacity={0.6}
                  >
                    <animate
                      attributeName="r"
                      from="2"
                      to="6"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      from="0.8"
                      to="0"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-[var(--radius-card)] border-2 border-border p-4 shadow-[var(--elevation-md)] max-w-[320px]">
            <h4 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-3" style={{ fontSize: 'var(--text-sm)' }}>
              Safety Map Legend
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-3 bg-destructive/20 border border-destructive rounded"></div>
                <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                  Personnel Area (Red Zone)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-3 bg-destructive/15 border border-destructive border-dashed rounded"></div>
                <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                  Restricted Geofenced Zone
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-3 rounded-full border-2 border-color-warning border-dashed"></div>
                <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                  Equipment Swing Radius
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive animate-pulse"></div>
                <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                  Safety Incursion Point
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded"></div>
                <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                  Production Cycle (On Budget)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-destructive rounded"></div>
                <span className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                  Production Cycle (Over Budget)
                </span>
              </div>
            </div>
          </div>

          {/* Live Status Indicator */}
          <div className="absolute bottom-4 right-4 px-4 py-2 bg-card/95 backdrop-blur-sm rounded-full border-2 border-primary flex items-center gap-2">
            <Signal className="w-4 h-4 text-primary" />
            <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-primary" style={{ fontSize: 'var(--text-sm)' }}>
              LIVE
            </span>
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Right Sidebar - Details Panel */}
        {(selectedCycle || selectedZone || selectedAsset) && (
          <div className="w-[360px] bg-card border-l-2 border-border overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-base)' }}>
                  {selectedZone ? 'Safety Zone Details' : selectedAsset ? 'Asset Details' : 'Cycle Details'}
                </h3>
                <button
                  onClick={() => {
                    setSelectedCycle(null);
                    setSelectedZone(null);
                    setSelectedAsset(null);
                  }}
                  className="w-8 h-8 rounded-full hover:bg-accent transition-colors flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Safety Zone Details */}
              {selectedZone && (() => {
                const zone = safetyZones.find(z => z.id === selectedZone);
                if (!zone) return null;

                const zoneIncursions = safetyIncursions.filter(inc => inc.zoneId === zone.id);
                const criticalIncursions = zoneIncursions.filter(inc => inc.severity === 'critical').length;

                return (
                  <div className="space-y-4">
                    <div>
                      <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontSize: 'var(--text-base)' }}>
                        {zone.name}
                      </div>
                      <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                        {zone.type === 'personnel' && 'Personnel Safety Area'}
                        {zone.type === 'restricted' && 'Restricted Access Zone'}
                        {zone.type === 'geofence' && 'Geofenced Boundary'}
                      </div>
                    </div>

                    {/* Incursion Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-background rounded-[var(--radius-button)] border border-border">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Total Incursions
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-lg)' }}>
                          {zone.incursionCount}
                        </div>
                      </div>

                      <div className="p-3 bg-background rounded-[var(--radius-button)] border border-border">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Critical Events
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-lg)' }}>
                          {criticalIncursions}
                        </div>
                      </div>
                    </div>

                    {/* Last Incursion */}
                    {zone.lastIncursion && (
                      <div className="p-3 bg-destructive/10 rounded-[var(--radius-button)] border border-destructive">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-destructive" />
                          <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                            Last Incursion
                          </span>
                        </div>
                        <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                          {Math.round((Date.now() - zone.lastIncursion.getTime()) / 60000)} minutes ago
                        </p>
                      </div>
                    )}

                    {/* Recent Incursions List */}
                    {zoneIncursions.length > 0 && (
                      <div>
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-xs)' }}>
                          Recent Incursions
                        </div>
                        <div className="space-y-2">
                          {zoneIncursions.map(inc => (
                            <div key={inc.id} className="p-2 bg-muted rounded border border-border">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-medium)] text-foreground" style={{ fontSize: 'var(--text-xs)' }}>
                                  {Math.round((Date.now() - inc.timestamp.getTime()) / 60000)}m ago
                                </span>
                                <span className={`px-2 py-0.5 rounded text-white font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)]`} 
                                  style={{ 
                                    fontSize: '10px',
                                    backgroundColor: inc.severity === 'critical' ? 'var(--destructive)' : 'var(--color-warning)'
                                  }}>
                                  {inc.severity.toUpperCase()}
                                </span>
                              </div>
                              <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: '10px' }}>
                                Distance: {inc.distance.toFixed(1)}ft • Duration: {inc.duration}s
                              </div>
                              <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: '10px' }}>
                                Production: {inc.productionVelocity.toFixed(1)} yd³/h
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Asset Details */}
              {selectedAsset && (() => {
                const assetIncursions = safetyIncursions.filter(inc => inc.assetId === currentAsset.id);
                
                return (
                  <div className="space-y-4">
                    <div>
                      <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontSize: 'var(--text-base)' }}>
                        {currentAsset.name}
                      </div>
                      <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                        Excavator - Active Operation
                      </div>
                    </div>

                    {/* Safety Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-background rounded-[var(--radius-button)] border border-border">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Near-Misses
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-lg)' }}>
                          {currentAsset.nearMissCount}
                        </div>
                      </div>

                      <div className="p-3 bg-background rounded-[var(--radius-button)] border border-border">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Swing Radius
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                          {currentAsset.swingRadius}
                          <span className="text-muted-foreground ml-1" style={{ fontSize: 'var(--text-sm)' }}>ft</span>
                        </div>
                      </div>
                    </div>

                    {/* Production Correlation */}
                    <div className="p-3 bg-muted rounded-[var(--radius-button)] border border-border">
                      <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-2" style={{ fontSize: 'var(--text-xs)' }}>
                        Current Production Velocity
                      </div>
                      <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-primary" style={{ fontSize: 'var(--text-lg)' }}>
                        {currentAsset.productionVelocity.toFixed(1)} yd³/h
                      </div>
                      <div className="mt-2 text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: '10px' }}>
                        Above average incident velocity ({avgProductionVelocity.toFixed(1)} yd³/h)
                      </div>
                    </div>

                    {/* Safety Recommendation */}
                    {currentAsset.productionVelocity > avgProductionVelocity && (
                      <div className="p-3 bg-color-warning/10 rounded-[var(--radius-button)] border-2 border-color-warning">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-4 h-4 text-color-warning" />
                          <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-color-warning" style={{ fontSize: 'var(--text-sm)' }}>
                            Safety Advisory
                          </span>
                        </div>
                        <p className="text-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                          Operating above incident correlation threshold. Consider reducing velocity or additional safety briefing.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Cycle Details (existing) */}
              {selectedCycle && (() => {
                const cycle = productionCycles.find(c => c.id === selectedCycle);
                if (!cycle) return null;

                const isOverBudget = cycle.variance > 0;

                return (
                  <div className="space-y-4">
                    <div>
                      <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground mb-1" style={{ fontSize: 'var(--text-base)' }}>
                        {cycle.name}
                      </div>
                      <div className="text-muted-foreground font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-sm)' }}>
                        {cycle.workZone}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className={`px-3 py-2 rounded-[var(--radius-button)] ${
                      cycle.status === 'active' ? 'bg-primary/10' : 'bg-muted'
                    }`}>
                      <span className={`font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] ${
                        cycle.status === 'active' ? 'text-primary' : 'text-foreground'
                      }`} style={{ fontSize: 'var(--text-sm)' }}>
                        {cycle.status === 'active' ? 'ACTIVE CYCLE' : 'COMPLETED'}
                      </span>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-background rounded-[var(--radius-button)] border border-border">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Volume Moved
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-foreground" style={{ fontSize: 'var(--text-lg)' }}>
                          {cycle.volumeMoved}
                          <span className="text-muted-foreground ml-1" style={{ fontSize: 'var(--text-sm)' }}>yd³</span>
                        </div>
                      </div>

                      <div className="p-3 bg-background rounded-[var(--radius-button)] border border-border">
                        <div className="text-muted-foreground font-[family-name:var(--font-family)] mb-1" style={{ fontSize: 'var(--text-xs)' }}>
                          Near-Misses
                        </div>
                        <div className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-lg)' }}>
                          {cycle.nearMissCount}
                        </div>
                      </div>
                    </div>

                    {/* Production/Safety Correlation */}
                    {cycle.nearMissCount > 0 && isOverBudget && (
                      <div className="p-3 bg-destructive/10 rounded-[var(--radius-button)] border-2 border-destructive">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                          <span className="font-[family-name:var(--font-family)] font-[var(--font-weight-semibold)] text-destructive" style={{ fontSize: 'var(--text-sm)' }}>
                            Production Pressure Alert
                          </span>
                        </div>
                        <p className="text-destructive font-[family-name:var(--font-family)]" style={{ fontSize: 'var(--text-xs)' }}>
                          {cycle.variance.toFixed(1)}% over budget with {cycle.nearMissCount} near-miss event{cycle.nearMissCount > 1 ? 's' : ''}. Safety training recommended.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
