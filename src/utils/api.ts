import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
})

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await api.get('/health', { timeout: 5000 })
    return response.status === 200
  } catch {
    return false
  }
}

export const getDrugs = async () => {
  try {
    const response = await api.get('/api/v1/drugs')
    return response.data
  } catch (error: any) {
    console.error('Error fetching drugs')
    throw new Error('Failed to fetch drug data. Please try again.')
  }
}

export const uploadCSV = async (file: File) => {
  try {
    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size exceeds 10MB limit')
    }

    // Validate file type
    if (!file.name.endsWith('.csv')) {
      throw new Error('Only CSV files are allowed')
    }

    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/api/v1/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error: any) {
    console.error('Upload error')
    if (error.message.includes('10MB') || error.message.includes('CSV')) {
      throw error
    }
    throw new Error('Failed to upload file. Please try again.')
  }
}

export const getForecast = async (drugName: string) => {
  try {
    if (!drugName || drugName.trim().length === 0) {
      throw new Error('Invalid drug name')
    }
    const response = await api.get(`/api/v1/forecast/${encodeURIComponent(drugName)}`)
    return response.data
  } catch (error: any) {
    console.error('Forecast error')
    throw new Error('Failed to fetch forecast data. Please try again.')
  }
}

export const simulateForecast = async (drugName: string, alerts: number, delayDays: number, demandMultiplier: number) => {
  try {
    // Validate inputs
    const validAlerts = Math.min(Math.max(Number(alerts) || 0, 0), 10)
    const validDelay = Math.min(Math.max(Number(delayDays) || 0, 0), 30)
    const validDemand = Math.min(Math.max(Number(demandMultiplier) || 1, 0.5), 2)

    const response = await api.post('/api/v1/forecast/simulate', {
      drug_name: drugName,
      simulated_cdsco_alerts: validAlerts,
      supply_delay_days: validDelay,
      demand_surge_multiplier: validDemand,
    })
    return response.data
  } catch (error: any) {
    console.error('Simulation error')
    throw new Error('Failed to run simulation. Please try again.')
  }
}

export const getExplainability = async (drugName: string) => {
  try {
    if (!drugName || drugName.trim().length === 0) {
      throw new Error('Invalid drug name')
    }
    const response = await api.get(`/api/v1/explain/${encodeURIComponent(drugName)}`)
    return response.data
  } catch (error: any) {
    console.error('Explainability error')
    throw new Error('Failed to fetch explainability data. Please try again.')
  }
}

export const getNetwork = async () => {
  try {
    const response = await api.get('/api/v1/network')
    return response.data
  } catch (error: any) {
    console.error('Network fetch error')
    throw new Error('Failed to fetch network data. Please try again.')
  }
}

export const simulateDisruption = async (supplierId: string) => {
  try {
    if (!supplierId || supplierId.trim().length === 0) {
      throw new Error('Invalid supplier ID')
    }
    const response = await api.post('/api/v1/network/simulate_disruption', {
      offline_nodes: [supplierId],
    })
    return response.data
  } catch (error: any) {
    console.error('Disruption simulation error')
    throw new Error('Failed to simulate disruption. Please try again.')
  }
}

export const getPurchaseOrders = async () => {
  try {
    const response = await api.get('/api/v1/purchase_orders')
    return response.data
  } catch (error: any) {
    console.error('Purchase orders error')
    throw new Error('Failed to fetch purchase orders. Please try again.')
  }
}
