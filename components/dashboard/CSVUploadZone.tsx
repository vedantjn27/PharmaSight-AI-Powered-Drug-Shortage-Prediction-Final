'use client'

import { useState, useRef } from 'react'
import { useAppStore } from '@/store/appStore'
import { uploadCSV } from '@/utils/api'
import { EMERGENCY_DRUGS } from '@/utils/emergencyData'
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

interface UploadStatus {
  status: 'idle' | 'uploading' | 'success' | 'error'
  message: string
  data?: any
}

export default function CSVUploadZone() {
  const { emergencyMode, setUploadedData } = useAppStore()
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ status: 'idle', message: '' })
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setUploadStatus({
        status: 'error',
        message: 'Please upload a CSV file',
      })
      return
    }

    try {
      setUploadStatus({ status: 'uploading', message: 'Processing your CSV through TFT pipeline...' })

      let result

      if (emergencyMode) {
        // Demo mode: return mock data
        await new Promise((resolve) => setTimeout(resolve, 2000))
        result = {
          source: 'upload',
          filename: file.name,
          rows_processed: 450,
          drugs_detected: 8,
          date_range: '2025-01-01 to 2025-01-31',
          triage: EMERGENCY_DRUGS,
          summary: {
            red_count: 2,
            amber_count: 2,
            green_count: 4,
            avg_risk: 0.45,
          },
        }
      } else {
        // Real backend call
        result = await uploadCSV(file)
      }

      setUploadStatus({
        status: 'success',
        message: `Successfully processed ${result.drugs_detected} drugs from ${result.rows_processed} rows`,
        data: result,
      })

      setUploadedData(result)
      } catch (error: any) {
        setUploadStatus({
          status: 'error',
          message: error.message || 'Failed to upload CSV. Please try again.',
        })
      }
  }

  const handleDrop = (e: React.DragEvent) => {
    handleDrag(e)
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      processFile(files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files && files[0]) {
      processFile(files[0])
    }
  }

  return (
    <div className="w-full">
      {/* Upload Zone */}
      <motion.div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative glass rounded-xl border-2 border-dashed transition-all p-8 text-center cursor-pointer ${
          isDragging
            ? 'border-primary-500 bg-primary-500/10'
            : 'border-border hover:border-primary-500/50'
        }`}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="hidden"
        />

        {uploadStatus.status === 'uploading' ? (
          <div className="space-y-4">
            <div className="inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full"
              />
            </div>
            <div>
              <p className="font-semibold text-foreground">{uploadStatus.message}</p>
            </div>
          </div>
        ) : uploadStatus.status === 'success' ? (
          <div className="space-y-4">
            <div className="inline-block p-3 rounded-lg bg-status-green/10">
              <CheckCircle className="w-8 h-8 text-status-green" />
            </div>
            <div>
              <p className="font-semibold text-foreground mb-2">Upload Successful</p>
              <p className="text-sm text-muted">{uploadStatus.message}</p>
            </div>
          </div>
        ) : uploadStatus.status === 'error' ? (
          <div className="space-y-4">
            <div className="inline-block p-3 rounded-lg bg-status-red/10">
              <AlertCircle className="w-8 h-8 text-status-red" />
            </div>
            <div>
              <p className="font-semibold text-status-red mb-2">Upload Failed</p>
              <p className="text-sm text-muted">{uploadStatus.message}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-block p-3 rounded-lg bg-primary-500/10">
              <Upload className="w-8 h-8 text-primary-500" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Drag your CSV here</p>
              <p className="text-sm text-muted mt-1">or click to select a file</p>
              <p className="text-xs text-muted/60 mt-3">Upload raw procurement data for instant TFT inference pipeline analysis</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Summary Stats */}
      {uploadStatus.data && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 glass rounded-lg p-6"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted mb-1">File</p>
              <p className="font-semibold text-foreground truncate">{uploadStatus.data.filename}</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-1">Rows Processed</p>
              <p className="font-semibold text-foreground">{uploadStatus.data.rows_processed}</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-1">Drugs Detected</p>
              <p className="font-semibold text-foreground">{uploadStatus.data.drugs_detected}</p>
            </div>
            <div>
              <p className="text-sm text-muted mb-1">Date Range</p>
              <p className="font-semibold text-foreground text-xs">
                 {typeof uploadStatus.data.date_range === 'object' 
                   ? `${uploadStatus.data.date_range.start} to ${uploadStatus.data.date_range.end}` 
                   : uploadStatus.data.date_range}
              </p>
            </div>
          </div>

          {/* Risk Summary */}
          <div className="mt-6 pt-6 border-t border-border flex gap-4">
            <div className="flex-1">
              <p className="text-sm text-muted mb-2">Risk Distribution</p>
              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-status-green" />
                  <span className="text-sm text-foreground">
                    {uploadStatus.data.summary?.green_count || 0} Green
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-status-amber" />
                  <span className="text-sm text-foreground">
                    {uploadStatus.data.summary?.amber_count || 0} Amber
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-status-red" />
                  <span className="text-sm text-foreground">
                    {uploadStatus.data.summary?.red_count || 0} Red
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
