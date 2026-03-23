import React, { useRef, useEffect, useState, RefObject } from 'react';
import { Video, BarChart3, Zap, Map } from 'lucide-react';
import { InlineMonitoring } from './InlineMonitoring';
import { ProductionMetricsToday } from './ProductionMetricsToday';
import { PredictiveAlerts } from './PredictiveAlerts';

interface Alert {
  id: string;
  timestamp: Date;
  title: string;
  description: string;
  riskLevel: 'critical' | 'warning' | 'info';
  videoSnippet: string;
  acknowledged: boolean;
}

interface HereAndNowProps {
  assetName: string;
  assetLocation: any;
  alerts: Alert[];
  onRadioOperator: (id: string) => void;
  onVerifyPlan: () => void;
  onShowMap: () => void;
  onShowVideo: () => void;
  onAlert: () => void;
  monitorRef?: RefObject<HTMLDivElement | null>;
}

const sections = [
  { id: 'monitoring', label: 'Video Monitoring', icon: Video     },
  { id: 'production', label: 'Production',       icon: BarChart3 },
  { id: 'alerts',     label: 'Predictive Alerts', icon: Zap      },
];

export function HereAndNow({
  assetName, assetLocation, alerts, onRadioOperator, onVerifyPlan, onShowMap, onShowVideo, onAlert, monitorRef
}: HereAndNowProps) {
  const [activeSection, setActiveSection] = useState('monitoring');

  const monitoringRef = useRef<HTMLDivElement>(null);
  const productionRef = useRef<HTMLDivElement>(null);
  const alertsRef     = useRef<HTMLDivElement>(null);

  const sectionRefs: Record<string, React.RefObject<HTMLDivElement | null>> = {
    monitoring: monitoringRef,
    production: productionRef,
    alerts: alertsRef,
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    Object.entries(sectionRefs).forEach(([id, ref]) => {
      if (!ref.current) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.25 }
      );
      obs.observe(ref.current);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    sectionRefs[id]?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  };

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-foreground mb-2">How are we doing today?</h2>
        <p className="text-muted-foreground">Predictive risk modeling and real-time safety monitoring</p>
      </div>

      {/* Sticky Sub-Navigation */}
      <div className="sticky top-0 z-20 -mx-8 px-8 py-2 bg-background/90 backdrop-blur-md border-b border-border/60 mb-8">
        <div className="flex items-center gap-1">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`
                flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                font-[family-name:var(--font-family)]
                ${activeSection === id
                  ? 'bg-foreground text-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-6">

        {/* 1. Video Monitoring */}
        <div ref={monitorRef || monitoringRef} className="scroll-mt-16">
          <InlineMonitoring
            location={assetLocation}
            assetName={assetName}
            alerts={alerts}
            onRadioOperator={onRadioOperator}
            onVerifyPlan={onVerifyPlan}
            onShowMap={onShowMap}
            onShowVideo={onShowVideo}
            onAlert={onAlert}
          />
        </div>

        {/* 2. Production Metrics — Today */}
        <div ref={productionRef} className="scroll-mt-16">
          <ProductionMetricsToday />
        </div>

        {/* 3. Predictive Alerts */}
        <div ref={alertsRef} className="scroll-mt-16">
          <PredictiveAlerts />
        </div>

      </div>
    </div>
  );
}
