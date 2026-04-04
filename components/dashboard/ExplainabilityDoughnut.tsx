'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { getExplainability } from '@/utils/api'
import { EMERGENCY_DRUGS, EMERGENCY_EXPLAINABILITY } from '@/utils/emergencyData'
import { motion } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Info } from 'lucide-react'

const COLORS = ['#00c2ff', '#ffb800', '#ff3b5c', '#00e5a0', '#a855f7']

export default function ExplainabilityDoughnut() {
  const { emergencyMode, selectedDrug, setSelectedDrug, uploadedData } = useAppStore()
  
  const drugList = emergencyMode ? EMERGENCY_DRUGS : (uploadedData?.triage || [])
  const defaultDrug = drugList.length > 0 ? drugList[0].drug : ''
  const currentDrug = selectedDrug || defaultDrug

  const [explainability, setExplainability] = useState<any>({ importances: {}, sentences: {} })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!currentDrug && !emergencyMode) {
      setExplainability({ importances: {}, sentences: {} })
      setLoading(false)
      return
    }

    const fetchExplainability = async () => {
      try {
        setLoading(true)
        if (emergencyMode) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setExplainability(EMERGENCY_EXPLAINABILITY)
        } else {
          const result = await getExplainability(currentDrug)
          setExplainability(result)
        }
      } catch (error) {
        setExplainability({ importances: {}, sentences: {} })
      } finally {
        setLoading(false)
      }
    }

    fetchExplainability()
  }, [currentDrug, emergencyMode])

  // Backend already returns percentages (e.g. 35.0 = 35%) — do NOT multiply by 100
  const chartData = explainability.importances
    ? Object.entries(explainability.importances).map(([label, value]) => ({
        name: label,
        value: value as number,
      }))
    : []

  const sentences: Record<string, string> = explainability.sentences || {}

  const CustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, name, value }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)
    return value > 10 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="bold">
        {value.toFixed(0)}%
      </text>
    ) : null
  }

  return (
    <div className="space-y-6">
      {/* Drug Selector */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <label className="text-sm font-semibold text-muted block mb-3">Select Drug for Analysis</label>
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
          <h3 className="text-lg font-bold">TFT Attention Weights</h3>
          <p className="text-sm text-muted mt-1">
            How much each signal influences the shortage prediction for <span className="text-primary-500 font-semibold">{currentDrug || 'selected drug'}</span>
          </p>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-muted">Analyzing features...</div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-muted border border-border rounded-lg bg-primary-500/5">
            <p className="font-semibold px-4 text-center">No Prediction Data</p>
            <p className="text-sm mt-1">Upload a CSV to see explainability analysis</p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={CustomLabel}
                  outerRadius={110}
                  innerRadius={50}
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>

            {/* Legend with colour dots */}
            <div className="flex flex-col gap-2 min-w-[160px]">
              {chartData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-sm font-medium">{entry.name}</span>
                  <span className="text-sm text-muted ml-auto">{entry.value.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Dynamic Sentence Explanations */}
      {chartData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 border border-primary-500/20"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Info className="w-4 h-4 text-primary-500" />
            Shortage Driver Analysis
          </h3>
          <div className="space-y-4">
            {chartData.map((entry, i) => (
              <div key={entry.name} className="flex gap-3 items-start">
                <div
                  className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {entry.name} <span className="text-muted font-normal">({entry.value.toFixed(1)}%)</span>
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {sentences[entry.name] || 'This feature contributes to the model\'s prediction.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
