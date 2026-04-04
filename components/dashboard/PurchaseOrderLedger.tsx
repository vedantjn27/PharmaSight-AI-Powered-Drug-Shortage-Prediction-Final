'use client'

import { useEffect, useState } from 'react'
import { useAppStore } from '@/store/appStore'
import { getPurchaseOrders } from '@/utils/api'
import { EMERGENCY_PURCHASE_ORDERS } from '@/utils/emergencyData'
import { motion } from 'framer-motion'
import { Download, CheckCircle } from 'lucide-react'
import { formatCurrency } from '@/utils/format'

export default function PurchaseOrderLedger() {
  const { emergencyMode, uploadedData } = useAppStore()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedOrders, setSelectedOrders] = useState<Set<number>>(new Set())

  useEffect(() => {
    if (!uploadedData && !emergencyMode) {
      setOrders([])
      setLoading(false)
      return
    }

    const fetchOrders = async () => {
      try {
        setLoading(true)
        if (emergencyMode) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setOrders(EMERGENCY_PURCHASE_ORDERS)
        } else {
          const result = await getPurchaseOrders()
          setOrders(result.orders || [])
        }
      } catch (error) {
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [emergencyMode, uploadedData])

  const toggleOrderSelection = (index: number) => {
    const newSelected = new Set(selectedOrders)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedOrders(newSelected)
  }

  const totalCost = Array.from(selectedOrders).reduce(
    (sum, idx) => sum + (orders[idx]?.estimated_cost || 0),
    0
  )

  const handleExport = () => {
    // Generate dates dynamically for the export CSV
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const csv = [
      ['Date', 'Drug Name', 'Supplier', 'Units', 'Est. Cost', 'Priority'],
      ...Array.from(selectedOrders)
        .map((idx) => orders[idx])
        .map((order) => [
          formattedDate,
          order.drug_name,
          order.supplier,
          order.recommended_units,
          order.estimated_cost, // Raw numerical for spreadsheet computation
          order.priority,
        ]),
    ]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'purchase-orders.csv'
    a.click()
  }

  const getPriorityColor = (priority: string) => {
    switch (priority?.toUpperCase()) {
      case 'RED':
      case 'HIGH':
        return 'status-badge-red'
      case 'AMBER':
      case 'MEDIUM':
        return 'status-badge-amber'
      case 'GREEN':
      case 'LOW':
        return 'status-badge-green'
      default:
        return 'status-badge-green'
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-6 border border-border"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted mb-1">Selected Orders</p>
            <h3 className="text-2xl font-bold">{selectedOrders.size} / {orders.length}</h3>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted mb-1">Total Cost</p>
            <h3 className="text-2xl font-bold text-accent-green">{formatCurrency(totalCost)}</h3>
          </div>
        </div>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl overflow-hidden border border-border"
      >
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold">AI-Recommended Purchase Orders</h3>
          {selectedOrders.size > 0 && (
            <motion.button
              onClick={handleExport}
              className="button-primary flex items-center gap-2 text-sm"
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-4 h-4" />
              Export ({selectedOrders.size})
            </motion.button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-500/5 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input type="checkbox" className="cursor-pointer" onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedOrders(new Set(orders.map((_, i) => i)))
                    } else {
                      setSelectedOrders(new Set())
                    }
                  }} />
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Drug Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Supplier</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Units</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Est. Cost</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Priority</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                   <td colSpan={6} className="px-6 py-8 text-center text-muted">Running Forecasting AI...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                   <td colSpan={6} className="px-6 py-12 text-center text-muted border border-border glass bg-primary-500/5">
                      <p className="font-semibold">Awaiting Procurement Data</p>
                      <p className="text-sm mt-1">Upload CSV data on the Command Center to generate Purchase Order targets.</p>
                   </td>
                </tr>
              ) : (
                orders.map((order, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/50 hover:bg-primary-500/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.has(i)}
                        onChange={() => toggleOrderSelection(i)}
                        className="cursor-pointer"
                      />
                    </td>
                    <td className="px-6 py-4 font-semibold">{order.drug_name}</td>
                    <td className="px-6 py-4 text-sm text-muted">{order.supplier}</td>
                    <td className="px-6 py-4 font-semibold">{(order.recommended_units || order.units || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 font-semibold">{formatCurrency(order.estimated_cost)}</td>
                    <td className="px-6 py-4">
                      <span className={`status-badge ${getPriorityColor(order.priority)}`}>
                        {order.priority}
                      </span>
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
