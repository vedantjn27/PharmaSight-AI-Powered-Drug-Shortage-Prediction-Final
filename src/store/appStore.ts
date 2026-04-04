'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SimulationState {
  cdscoAlerts: number
  supplyDelayDays: number
  demandMultiplier: number
}

interface AppStore {
  // Theme
  isDarkMode: boolean
  setDarkMode: (isDark: boolean) => void
  toggleDarkMode: () => void

  // Emergency Mode
  emergencyMode: boolean
  setEmergencyMode: (isEmergency: boolean) => void

  // Selected Drug
  selectedDrug: string | null
  setSelectedDrug: (drug: string | null) => void

  // Active Tab
  activeTab: string
  setActiveTab: (tab: string) => void

  // Simulation State
  simulation: SimulationState
  setSimulation: (state: Partial<SimulationState>) => void
  resetSimulation: () => void

  // Uploaded Data
  uploadedData: any | null
  setUploadedData: (data: any | null) => void

  // Backend Health
  backendHealthy: boolean
  setBackendHealthy: (healthy: boolean) => void
}

const defaultSimulation: SimulationState = {
  cdscoAlerts: 0,
  supplyDelayDays: 0,
  demandMultiplier: 1,
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      isDarkMode: true,
      setDarkMode: (isDark) => set({ isDarkMode: isDark }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      emergencyMode: false,
      setEmergencyMode: (isEmergency) => set({ emergencyMode: isEmergency }),

      selectedDrug: null,
      setSelectedDrug: (drug) => set({ selectedDrug: drug }),

      activeTab: 'command-center',
      setActiveTab: (tab) => set({ activeTab: tab }),

      simulation: defaultSimulation,
      setSimulation: (state) =>
        set((prevState) => ({
          simulation: { ...prevState.simulation, ...state },
        })),
      resetSimulation: () => set({ simulation: defaultSimulation }),

      uploadedData: null,
      setUploadedData: (data) => set({ uploadedData: data }),

      backendHealthy: true,
      setBackendHealthy: (healthy) => set({ backendHealthy: healthy }),
    }),
    {
      name: 'pharmasight-store',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
      }),
    }
  )
)
