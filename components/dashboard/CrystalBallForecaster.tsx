'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { getForecast } from '@/utils/api'
import { EMERGENCY_DRUGS, EMERGENCY_FORECAST } from '@/utils/emergencyData'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Info } from 'lucide-react'

export default function CrystalBallForecaster() {
  const { emergencyMode, selectedDrug, setSelectedDrug, uploadedData } = useAppStore()
  
  const drugList = emergencyMode ? EMERGENCY_DRUGS : (uploadedData?.triage || [])
  const defaultDrug = drugList.length > 0 ? drugList[0].drug : ''
  const currentDrug = selectedDrug || defaultDrug

  const [forecast, setForecast] = useState<any>({ p10: [], p50: [], p90: [] })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!currentDrug && !emergencyMode) {
      setForecast({ p10: [], p50: [], p90: [] })
      setLoading(false)
      return
    }

    const fetchForecast = async () => {
      try {
        setLoading(true)
        if (emergencyMode) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setForecast(EMERGENCY_FORECAST)
        } else {
          const result = await getForecast(currentDrug)
          setForecast(result)
        }
      } catch (error) {
        setForecast({ p10: [], p50: [], p90: [] })
      } finally {
        setLoading(false)
      }
    }

    fetchForecast()
  }, [currentDrug, emergencyMode])

  const chartData = (forecast.p50 || []).map((point: any, i: number) => ({
    date: point.date?.slice(5),  // Show MM-DD only
    p10: forecast.p10?.[i]?.value || 0,
    p50: point.value,
    p90: forecast.p90?.[i]?.value || 0,
  }))

  const hasData = chartData.length > 0

  return (
    <div className="space-y-6">
      {/* Drug Selector */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <label className="text-sm font-semibold text-muted block mb-3">Select Drug for Forecast</label>
        <select
          value={currentDrug}
          onChange={(e) => setSelectedDrug(e.target.value)}
          className="input-field"
          disabled={drugList.length === 0}
        >
          {drugList.length === 0 && <option value="">Awaiting Data...</option>}
          {drugList.map((drug: any) => (
            <option key={drug.drug} value={drug.drug}>
              {drug.drug}
            </option>
          ))}
        </select>
      </motion.div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6 border border-border">
        <div className="mb-4">
          <h3 className="text-lg font-bold">30-Day Probabilistic Demand Forecast</h3>
          <p className="text-sm text-muted mt-1">
            Statistical confidence bands for <span className="text-primary-500 font-semibold">{currentDrug || 'selected drug'}</span>
          </p>
        </div>

        {loading ? (
          <div className="h-80 flex items-center justify-center text-muted">Running forecast model...</div>
        ) : !hasData ? (
          <div className="h-80 flex flex-col items-center justify-center text-muted border border-border rounded-lg bg-primary-500/5">
            <p className="font-semibold">No Forecast Data</p>
            <p className="text-sm mt-1">Upload a CSV and select a drug to generate the forecast</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="colorP10" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00c2ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00c2ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorP50" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorP90" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3b5c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff3b5c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={11} tick={{ fill: 'rgba(255,255,255,0.4)' }} />
              <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tick={{ fill: 'rgba(255,255,255,0.4)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 14, 39, 0.95)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend />
              <Area type="monotone" dataKey="p10" name="P10 — Optimistic" stroke="#00c2ff" fill="url(#colorP10)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="p50" name="P50 — Most Likely" stroke="#a855f7" fill="url(#colorP50)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="p90" name="P90 — Worst Case" stroke="#ff3b5c" fill="url(#colorP90)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* P10 / P50 / P90 Explanation — always visible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 border border-accent-blue/20"
      >
        <h3 className="font-bold mb-4 flex items-center gap-2 text-sm">
          <Info className="w-4 h-4 text-accent-blue" />
          Understanding the Confidence Bands
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex gap-3 items-start">
            <div className="w-3 h-3 rounded-full bg-[#00c2ff] mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">P10 — Optimistic Scenario</p>
              <p className="text-xs text-muted mt-1">
                There is a <strong>10% probability</strong> that actual demand will be <em>below</em> this line. Represents the best-case, low-demand scenario. Used for minimum safety stock planning.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-3 h-3 rounded-full bg-[#a855f7] mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">P50 — Most Likely Forecast</p>
              <p className="text-xs text-muted mt-1">
                The <strong>median prediction</strong> — 50% chance demand is above or below this line. This is the model's central estimate and the primary procurement planning target.
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <div className="w-3 h-3 rounded-full bg-[#ff3b5c] mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">P90 — Worst Case Scenario</p>
              <p className="text-xs text-muted mt-1">
                There is a <strong>90% probability</strong> actual demand will be <em>below</em> this line. Represents peak demand risk. AI Purchase Orders are sized to the P90 to prevent stockouts.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
