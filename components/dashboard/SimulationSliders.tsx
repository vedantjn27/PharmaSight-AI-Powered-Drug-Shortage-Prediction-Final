'use client'

import { useAppStore } from '@/store/appStore'
import { simulateForecast } from '@/utils/api'
import { EMERGENCY_DRUGS } from '@/utils/emergencyData'
import { motion } from 'framer-motion'
import { RotateCcw, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function SimulationSliders() {
  const { simulation, setSimulation, resetSimulation, selectedDrug, emergencyMode, uploadedData } = useAppStore()
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (simulation.cdscoAlerts === 0 && simulation.supplyDelayDays === 0 && simulation.demandMultiplier === 1) {
      setResult(null)
      return
    }

    const runSimulation = async () => {
      try {
        setLoading(true)
        const drugList = emergencyMode ? EMERGENCY_DRUGS : (uploadedData?.triage || [])
        const defaultDrug = drugList.length > 0 ? drugList[0].drug : ''
        const drug = selectedDrug || defaultDrug

        if (!drug && !emergencyMode) {
          setResult(null)
          return
        }

        if (emergencyMode) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
          setResult({
            drug,
            baseline_p50: 1200,
            simulated_p50: 1200 * (simulation.demandMultiplier || 1) - (simulation.supplyDelayDays || 0) * 50,
            impact: 'Significant demand surge detected',
          })
        } else {
          const res = await simulateForecast(
            drug,
            simulation.cdscoAlerts,
            simulation.supplyDelayDays,
            simulation.demandMultiplier
          )
          setResult(res)
        }
      } catch (error) {
        console.error('Simulation error:', error)
      } finally {
        setLoading(false)
      }
    }

    runSimulation()
  }, [simulation, selectedDrug, emergencyMode, uploadedData])

  return (
    <div className="space-y-6">
      {/* Sliders */}
      <div className="glass rounded-xl p-6 space-y-6 border border-border">
        {/* CDSCO Alerts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold text-foreground">CDSCO Alerts: {simulation.cdscoAlerts}</label>
          </div>
          <input
            type="range"
            min={0}
            max={10}
            value={simulation.cdscoAlerts}
            onChange={(e) => setSimulation({ cdscoAlerts: Number(e.target.value) })}
            className="w-full h-2 bg-primary-500/20 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
          <p className="text-xs text-muted mt-2">Regulatory pressure 0-10</p>
        </motion.div>

        {/* Supply Delay */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold text-foreground">Supply Delay: {simulation.supplyDelayDays} days</label>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            value={simulation.supplyDelayDays}
            onChange={(e) => setSimulation({ supplyDelayDays: Number(e.target.value) })}
            className="w-full h-2 bg-primary-500/20 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
          <p className="text-xs text-muted mt-2">Delivery lag 0-30 days</p>
        </motion.div>

        {/* Demand Multiplier */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-semibold text-foreground">Demand Multiplier: {simulation.demandMultiplier.toFixed(1)}x</label>
          </div>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.1}
            value={simulation.demandMultiplier}
            onChange={(e) => setSimulation({ demandMultiplier: Number(e.target.value) })}
            className="w-full h-2 bg-primary-500/20 rounded-lg appearance-none cursor-pointer accent-primary-500"
          />
          <p className="text-xs text-muted mt-2">Demand surge 0.5x - 2.0x</p>
        </motion.div>

        {/* Reset Button */}
        <motion.button
          onClick={resetSimulation}
          className="w-full button-secondary flex items-center justify-center gap-2"
          whileTap={{ scale: 0.98 }}
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Baseline
        </motion.button>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-6 border border-status-amber/20 bg-status-amber/5"
        >
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-status-amber" />
            AI Scenario Analysis
          </h3>
          <div className="space-y-3 border-l-4 border-status-amber pl-4">
            <p className="text-sm md:text-base leading-relaxed text-foreground">
              For <span className="font-semibold text-accent-blue">{result.drug}</span>, our normal forecast expects you to have around <span className="font-semibold">{result.baseline_p50?.toLocaleString() || 'N/A'} units</span> in your backup stock.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-foreground">
              However, if <span className="font-semibold text-status-amber">{simulation.demandMultiplier.toFixed(1)}x more patients</span> suddenly need this medicine while your <span className="font-semibold text-status-amber">delivery is {simulation.supplyDelayDays} days late</span>, your stock levels will drop dangerously low to just <span className="font-semibold text-status-red">{result.simulated_p50?.toLocaleString() || 'N/A'} units</span>.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-muted italic pt-2">
              {result.impact || "This combination of problems makes it very likely you will run out of medicine. We recommend ordering extra stock right now to stay safe."}
            </p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
