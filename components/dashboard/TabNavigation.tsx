'use client'

import { useAppStore } from '@/store/appStore'
import { TAB_FEATURES } from '@/utils/constants'
import { motion } from 'framer-motion'
import * as Icons from 'lucide-react'

export default function TabNavigation() {
  const { activeTab, setActiveTab } = useAppStore()

  return (
    <div className="border-b border-border overflow-x-auto">
      <div className="max-w-7xl mx-auto px-6 flex gap-2">
        {TAB_FEATURES.map((feature) => {
          const Icon = Icons[feature.icon as keyof typeof Icons] as any
          const isActive = activeTab === feature.id

          return (
            <motion.button
              key={feature.id}
              onClick={() => setActiveTab(feature.id)}
              className={`relative px-4 py-4 text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                isActive ? 'text-primary-500' : 'text-muted hover:text-foreground'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{feature.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-blue to-accent-purple"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
