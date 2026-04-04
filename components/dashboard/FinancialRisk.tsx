'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { getDrugs } from '@/utils/api'
import { EMERGENCY_FINANCIAL_RISK, EMERGENCY_DRUGS } from '@/utils/emergencyData'
import { formatCurrency } from '@/utils/format'
import { motion } from 'framer-motion'
import { TrendingDown, AlertTriangle } from 'lucide-react'

interface FinancialData {
  revenue_at_risk: number
  units_in_deficit: number
  days_to_critical: number
}

export default function FinancialRisk() {
  const { emergencyMode, uploadedData } = useAppStore()
  const emptyData: FinancialData = { revenue_at_risk: 0, units_in_deficit: 0, days_to_critical: 0 }
  const [data, setData] = useState<FinancialData>(emptyData)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!uploadedData && !emergencyMode) {
      setData(emptyData)
      setLoading(false)
      return
    }

    const fetchData = async () => {
      try {
        setLoading(true)
        if (emergencyMode) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setData(EMERGENCY_FINANCIAL_RISK)
        } else {
          // Native map off the uploaded state explicitly
          const triage = uploadedData?.triage || []
          const totalCost = triage.reduce((sum: number, drug: any) => sum + (drug.cost_volume || 0), 0)
          const totalDeficit = triage.filter((d: any) => d.risk_status === 'High' || d.risk_status === 'Moderate')
              .reduce((sum: number, d: any) => sum + (d.latest_demand || 0), 0) * 50

          setData({
              revenue_at_risk: totalCost,
              units_in_deficit: totalDeficit,
              days_to_critical: totalDeficit > 0 ? 5 : 0,
          })
        }
      } catch (error) {
        setData(emptyData)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [emergencyMode, uploadedData])

  const displayData = data
  const redDrugCount = emergencyMode ? EMERGENCY_DRUGS.filter((d: any) => d.risk_status === 'High').length : 
       (uploadedData?.triage || []).filter((d: any) => d.risk_status === 'High').length

  return (
    <div className="space-y-6">
      {!uploadedData && !emergencyMode && (
        <div className="text-center py-6 text-muted border border-border glass rounded-xl">
           Awaiting CSV Injection for Financial Modeling...
        </div>
      )}

      {/* Main KPI */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-xl p-4 sm:p-8 bg-gradient-to-br from-status-red/10 to-status-amber/10 border border-status-red/20"
      >
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:mb-6 mb-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm text-muted mb-2">Projected Rupees at Risk</p>
            <motion.h2
              className="text-3xl sm:text-5xl md:text-6xl font-bold gradient-text break-words"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {loading ? '...' : formatCurrency(displayData.revenue_at_risk)}
            </motion.h2>
          </div>
          <div className="p-3 sm:p-4 rounded-lg bg-status-red/20 border border-status-red/30 flex-shrink-0">
            <TrendingDown className="w-6 sm:w-8 h-6 sm:h-8 text-status-red" />
          </div>
        </div>

        <p className="text-muted text-sm">
          {redDrugCount} critical drugs with high shortage risk
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Units in Deficit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-xl p-6 border border-border"
        >
          <p className="text-sm text-muted mb-3">Units in Deficit</p>
          <h3 className="text-4xl font-bold mb-2">
            {loading ? '...' : displayData.units_in_deficit.toLocaleString()}
          </h3>
          <p className="text-xs text-muted">Immediate shortage impact</p>
        </motion.div>

        {/* Days to Critical */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-xl p-6 border border-status-amber/20 bg-status-amber/5"
        >
          <p className="text-sm text-muted mb-3">Days Until Critical</p>
          <h3 className="text-4xl font-bold text-status-amber mb-2">
            {loading ? '...' : displayData.days_to_critical}
          </h3>
          <p className="text-xs text-muted">Time to intervention</p>
        </motion.div>
      </div>

      {/* Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-xl p-6 border-l-4 border-l-status-red bg-status-red/5"
      >
        <div className="flex gap-4">
          <AlertTriangle className="w-6 h-6 text-status-red flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-status-red mb-1">Immediate Action Required</h4>
            <p className="text-sm text-muted">
              {redDrugCount} medications have reached critical shortage levels. Initiate emergency procurement procedures immediately.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
