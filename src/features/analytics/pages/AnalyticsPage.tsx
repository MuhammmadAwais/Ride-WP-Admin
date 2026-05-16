import React, { useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from '@/Constants';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// Components
import { MetricCardsRow } from '../components/MetricCards';
import { TimeSeriesChart } from '../components/TimeSeriesChart';
import { DistributionChart } from '../components/DistributionChart';
import { PeakDemandHeatmap } from '../components/PeakDemandHeatmap';
import { FinancialLedgerChart } from '../components/FinancialLedgerChart';

export default function AnalyticsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP Stagger Animation for all cards
  useGSAP(() => {
    if (!containerRef.current) return;
    
    // Select all elements with the .analytics-card class inside the container
    const cards = containerRef.current.querySelectorAll('.analytics-card');
    
    gsap.fromTo(cards, 
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        stagger: 0.1, 
        ease: 'power3.out',
        delay: 0.1,
      }
    );
  }, []);

  return (
    <div className="w-full h-full pb-10" ref={containerRef}>
      <Helmet>
        <title>Analytics Dashboard — {APP_NAME} Admin</title>
      </Helmet>

      {/* Global Glassmorphic Frame */}
      <div className="backdrop-blur-3xl bg-white/5 dark:bg-black/10 border border-white/10 dark:border-white/5 rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-poppins font-bold text-3xl text-text-main tracking-tight">Platform Analytics</h1>
          <p className="font-roboto text-text-muted mt-2">Comprehensive data overview and system performance metrics.</p>
        </div>

        {/* High-Fidelity Metric Cards */}
        <div className="mb-8">
          <MetricCardsRow />
        </div>

        {/* Asymmetric Layout Grid for Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* Main Time-Series Engine (Spans 2 columns on XL) */}
          <div className="xl:col-span-2 flex">
            <TimeSeriesChart />
          </div>

          {/* Distribution Breakdown (Spans 1 column) */}
          <div className="flex">
            <DistributionChart />
          </div>

          {/* Peak Demand Heatmap (Spans 2 columns on XL) */}
          <div className="xl:col-span-2 flex">
            <PeakDemandHeatmap />
          </div>

          {/* Financial Ledger Overview (Spans 1 column) */}
          <div className="flex">
            <FinancialLedgerChart />
          </div>
          
        </div>
      </div>
    </div>
  );
}
