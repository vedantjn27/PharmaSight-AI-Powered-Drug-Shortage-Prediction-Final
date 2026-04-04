'use client'

import { useEffect } from 'react'
import Navbar from '@/components/dashboard/Navbar'
import TabNavigation from '@/components/dashboard/TabNavigation'
import CommandCenter from '@/components/dashboard/CommandCenter'
import FinancialRisk from '@/components/dashboard/FinancialRisk'
import CrystalBallForecaster from '@/components/dashboard/CrystalBallForecaster'
import SimulationSliders from '@/components/dashboard/SimulationSliders'
import ExplainabilityDoughnut from '@/components/dashboard/ExplainabilityDoughnut'
import SupplierGeoMap from '@/components/dashboard/SupplierGeoMap'
import PurchaseOrderLedger from '@/components/dashboard/PurchaseOrderLedger'
import { useAppStore } from '@/store/appStore'
import { checkBackendHealth } from '@/utils/api'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const { activeTab, setBackendHealthy, setEmergencyMode, backendHealthy } = useAppStore()

  useEffect(() => {
    const checkHealth = async () => {
      const healthy = await checkBackendHealth()
      setBackendHealthy(healthy)
      if (!healthy) {
        setEmergencyMode(true)
      }
    }

    checkHealth()
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [setBackendHealthy, setEmergencyMode])

  const renderContent = () => {
    switch (activeTab) {
      case 'command-center':
        return <CommandCenter />
      case 'financial-risk':
        return <FinancialRisk />
      case 'forecaster':
        return <CrystalBallForecaster />
      case 'simulator':
        return <SimulationSliders />
      case 'explainability':
        return <ExplainabilityDoughnut />
      case 'network':
        return <SupplierGeoMap />
      case 'purchase-orders':
        return <PurchaseOrderLedger />
      default:
        return <CommandCenter />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Background Animation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-1/3 w-80 h-80 bg-accent-purple/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-accent-green/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Tab Navigation — naturally flowing, does not stick when scrolling */}
      <div className="relative pt-[64px] z-40 bg-background border-b border-border shadow-sm">
        <TabNavigation />
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-12 border-t border-border text-center text-xs sm:text-sm text-muted">
        <p className="text-xs sm:text-sm">PharmaSight - AI-Powered Drug Shortage Prediction & Supply Chain Intelligence</p>
        <p className="mt-2 text-xs">
          {backendHealthy ? '✓ Backend Connected' : '⚠️ Backend Offline - Using Demo Mode'}
        </p>
      </footer>
    </div>
  )
}
