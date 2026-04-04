'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { getDrugs } from '@/utils/api'
import { EMERGENCY_DRUGS } from '@/utils/emergencyData'
import { formatCurrency, formatNumber } from '@/utils/format'
import CSVUploadZone from './CSVUploadZone'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, AlertCircle, Zap } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

interface Drug {
  drug: string
  category: string
  risk_status: 'GREEN' | 'AMBER' | 'RED' | 'Low' | 'Moderate' | 'High'
  latest_demand: number
  cost_volume: number
  cdsco_alerts: number
  trend: number[]
}

export default function CommandCenter() {
  const { emergencyMode, uploadedData } = useAppStore()
  const [drugs, setDrugs] = useState<Drug[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchDrugs = async () => {
      try {
        setLoading(true)
        if (emergencyMode) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setDrugs(EMERGENCY_DRUGS as Drug[])
        } else {
          // Sync natively across the active uploaded payload instead of a disjointed GET loop
          setDrugs(uploadedData?.triage || [])
        }
      } catch (error) {
        setDrugs([])
      } finally {
        setLoading(false)
      }
    }

    fetchDrugs()
  }, [emergencyMode, uploadedData])

  const displayDrugs = drugs
  const dataSourceLabel = emergencyMode ? 'Demo Mode' : uploadedData ? `Uploaded (${uploadedData.filename})` : 'Awaiting Data'

  const getRiskColor = (status: string) => {
    switch (status) {
      case 'GREEN':
      case 'Low':
        return 'status-badge-green'
      case 'AMBER':
      case 'Moderate':
        return 'status-badge-amber'
      case 'RED':
      case 'High':
        return 'status-badge-red'
      default:
        return 'status-badge-green'
    }
  }

  const getTrendChart = (trend: number[]) => {
    const data = (trend || []).map((v, i) => ({ index: i, value: v }))
    return (
      <ResponsiveContainer width={60} height={30}>
        <LineChart data={data}>
          <XAxis dataKey="index" hide={true} />
          <YAxis hide={true} domain={['dataMin', 'dataMax']} />
          <Tooltip cursor={false} contentStyle={{ display: 'none' }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={
              Math.min(...trend) === trend[trend.length - 1]
                ? '#ff3b5c'
                : '#00e5a0'
            }
            dot={false}
            strokeWidth={2}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="rounded-xl overflow-hidden relative border border-border shadow-lg bg-background"
      >
        {/* Immersive Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/ai-prediction.jpg" 
            alt="AI Framework" 
            className="w-full h-full object-cover opacity-20 dark:opacity-30 mix-blend-luminosity brightness-150"
          />
          {/* Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30"></div>
          
          {/* Vertical Scanning Engine Effect */}
          <motion.div
            animate={{
              y: ["-10%", "110%"],
              opacity: [0, 0.4, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-transparent to-primary-500/20 blur-md pointer-events-none"
          />
        </div>

        <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="w-full md:w-auto">
            <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-blue inline-flex items-center gap-3">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500" />
              CSV Intelligence Engine
            </h2>
            <p className="text-foreground mt-2 font-medium max-w-md opacity-80">
              Upload your raw procurement data to power the AI. The Temporal Fusion Transformer will generate instant shortage predictions and supply chain risk intelligence.
            </p>
          </div>
          <div className="relative z-20 hover:scale-[1.02] transition-transform">
            <CSVUploadZone />
          </div>
        </div>
      </motion.div>

      {/* Structural Spacer */}

      {/* Drug Triage Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl overflow-hidden border border-border"
      >
        <div className="p-6 border-b border-border">
          <h3 className="text-lg font-bold">Drug Triage Table</h3>
          <p className="text-sm text-muted mt-1">Data Source: {dataSourceLabel}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead className="bg-primary-500/5 border-b border-border">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-foreground">Drug</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-foreground">Risk</th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold text-foreground">Days of Supply</th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-sm font-semibold text-foreground">CDSCO Alerts</th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold text-foreground">Daily Demand</th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-foreground">Cost Volume</th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-sm font-semibold text-foreground">7d Trend</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted">
                    Loading data...
                  </td>
                </tr>
              ) : displayDrugs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted">
                    <p className="text-lg font-semibold">No Data Available</p>
                    <p className="text-sm mt-2">Please upload a CSV file above to populate the Command Center, or activate Demo Mode.</p>
                  </td>
                </tr>
              ) : (
                displayDrugs.map((drug: Drug, i: number) => (
                  <motion.tr
                    key={drug.drug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/50 hover:bg-primary-500/5 transition-colors"
                  >
                    <td className="px-3 sm:px-6 py-4">
                      <span className="font-semibold text-foreground text-xs sm:text-sm">{drug.drug}</span>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <span className={`status-badge text-xs sm:text-sm ${getRiskColor(drug.risk_status)}`}>
                        {drug.risk_status}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      {(drug as any).days_of_supply !== undefined ? (
                        <span className={`text-sm font-bold ${
                          (drug as any).days_of_supply < 7 ? 'text-status-red' :
                          (drug as any).days_of_supply < 14 ? 'text-status-amber' : 'text-status-green'
                        }`}>
                          {(drug as any).days_of_supply === 999 ? '∞' : `${(drug as any).days_of_supply}d`}
                        </span>
                      ) : <span className="text-xs text-muted">N/A</span>}
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="flex items-center gap-2">
                        {drug.cdsco_alerts > 0 ? <AlertCircle className="w-4 h-4 text-status-amber" /> : null}
                        <span className="text-sm font-semibold">{drug.cdsco_alerts}</span>
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4 text-sm font-semibold">{formatNumber(drug.latest_demand)}</td>
                    <td className="px-3 sm:px-6 py-4 text-xs sm:text-sm font-semibold">{formatCurrency(drug.cost_volume)}</td>
                    <td className="hidden lg:table-cell px-6 py-4">
                      {drug.trend && drug.trend.length > 0 ? (
                        getTrendChart(drug.trend)
                      ) : (
                        <span className="text-xs text-muted">N/A</span>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
