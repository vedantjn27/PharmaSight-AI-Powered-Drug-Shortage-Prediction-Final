'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Zap, TrendingDown, BarChart3, Sliders, Brain, Network, ShoppingCart, CheckCircle, Moon, Sun } from 'lucide-react'
import { useAppStore } from '@/store/appStore'
import { checkBackendHealth } from '@/utils/api'

const features = [
  {
    icon: Zap,
    title: 'Command Center',
    description: 'Real-time drug shortage triage with AI-powered risk scoring and instant alerts for critical medications.',
    color: 'from-accent-blue to-accent-purple',
  },
  {
    icon: TrendingDown,
    title: 'Financial Risk Analytics',
    description: 'Quantify projected revenue impact and identify cost-saving opportunities in your supply chain.',
    color: 'from-accent-amber to-accent-red',
  },
  {
    icon: BarChart3,
    title: 'Crystal Ball Forecaster',
    description: '30-day probabilistic forecasts with confidence intervals powered by Temporal Fusion Transformers.',
    color: 'from-accent-green to-accent-blue',
  },
  {
    icon: Sliders,
    title: 'What-If Simulator',
    description: 'Test regulatory scenarios, supply delays, and demand surges before they impact your operations.',
    color: 'from-accent-purple to-accent-red',
  },
  {
    icon: Brain,
    title: 'Deep Learning Explainability',
    description: 'Understand why the model makes predictions with neural network attention weight visualization.',
    color: 'from-accent-blue to-accent-green',
  },
  {
    icon: Network,
    title: 'Supplier Network Simulator',
    description: 'Map your supply chain and simulate disruptions to understand cascading impacts.',
    color: 'from-accent-amber to-accent-purple',
  },
  {
    icon: ShoppingCart,
    title: 'Smart Purchase Orders',
    description: 'AI-recommended purchase orders optimized for your risk profile and inventory levels.',
    color: 'from-accent-red to-accent-green',
  },
  {
    icon: Zap,
    title: 'CSV Intelligence Engine',
    description: 'Upload your raw procurement data and get instant AI predictions through our TFT inference pipeline.',
    color: 'from-accent-green to-accent-blue',
  },
]

const stats = [
  { label: 'Prediction Accuracy', value: '94%' },
  { label: 'Response Time', value: '<2s' },
  { label: 'Supply Chain Coverage', value: '500+' },
  { label: 'Drugs Monitored', value: '10K+' },
]

export default function LandingPage() {
  const { setBackendHealthy, isDarkMode, toggleDarkMode } = useAppStore()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const htmlElement = document.documentElement
    if (isDarkMode) {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }, [isDarkMode])

  useEffect(() => {
    const checkHealth = async () => {
      const healthy = await checkBackendHealth()
      setBackendHealthy(healthy)
    }
    checkHealth()

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [setBackendHealthy])

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass border-b border-border' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/pharmasight-logo.jpg" alt="PharmaSight Logo" className="w-10 h-10 rounded-lg object-cover shadow-lg border border-primary-500/30" />
            <span className="text-xl font-bold gradient-text">PharmaSight</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-primary-500/10 border border-primary-500/20 hover:bg-primary-500/20 transition-all flex-shrink-0"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-accent-amber" />
              ) : (
                <Moon className="w-5 h-5 text-accent-purple" />
              )}
            </button>
            <Link href="/dashboard">
              <button className="button-primary">
                Enter Dashboard
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Animated Background Images */}
        <div className="absolute inset-0 overflow-hidden bg-background">
          <img 
            src="/hero-pharma.jpg" 
            alt="Pharma Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-luminosity animate-pulse" 
            style={{ animationDuration: '6s' }} 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background"></div>
          
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent-blue/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-purple/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent-green/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <div className="inline-block px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-500 text-sm font-semibold mb-6">
              ✨ Powered by Temporal Fusion Transformers
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
          >
            <span className="gradient-text">Predict Drug Shortages</span>
            {' '}Before They Happen
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-muted max-w-3xl mx-auto mb-8"
          >
            PharmaSight uses advanced AI to forecast drug shortages, analyze supply chain risks, and help you make smarter inventory decisions in real-time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/dashboard">
              <button className="button-primary flex items-center gap-2 text-lg px-8 py-3">
                Launch Dashboard <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <button className="button-secondary text-lg px-8 py-3">
              View Demo
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16"
          >
            {stats.map((stat, i) => (
              <div key={i} className="glass p-4 rounded-lg">
                <div className="text-2xl md:text-3xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative py-24 overflow-hidden">
        {/* Secondary Background Image */}
        <div className="absolute inset-0 overflow-hidden z-0">
          <img 
            src="/supply-chain.jpg" 
            alt="Supply Chain Background" 
            className="w-full h-full object-cover opacity-10 mix-blend-luminosity" 
          />
          <div className="absolute inset-0 bg-background/80 blur-sm"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background"></div>
        </div>
        
        <div className="relative z-10 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">The Challenge</h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            Drug shortages cost hospitals millions and impact patient care. Current methods rely on reactive reporting, not predictive intelligence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Late Detection',
              description: 'Shortages discovered after they impact patient care',
              icon: '⚠️',
            },
            {
              title: 'No Visibility',
              description: 'Unclear supply chain dependencies and ripple effects',
              icon: '👁️',
            },
            {
              title: 'Manual Planning',
              description: 'Purchase decisions based on historical patterns, not AI forecasts',
              icon: '📋',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="glass p-8 rounded-xl"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-muted">{item.description}</p>
            </motion.div>
          ))}
        </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative py-24 px-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">The Solution</h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            PharmaSight empowers your supply chain with AI-powered predictions, risk analytics, and intelligent automation.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Predictive Forecaster',
              description: 'Forecast shortages 30 days ahead with 94% accuracy',
              img: 'feature-forecast.jpg',
            },
            {
              title: 'Explainable Insights',
              description: 'Understand exactly why each prediction is made',
              img: 'feature-insights.jpg',
            },
            {
              title: 'Topology Networks',
              description: 'AI-optimized mapping of downstream cascading failures',
              img: 'feature-network.jpg',
            },
            {
              title: 'Scenario Simulation',
              description: 'Test regulatory scenarios and delays before they impact operations',
              img: 'feature-simulation.jpg'
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-xl overflow-hidden group border border-border flex flex-col"
            >
              <div className="relative h-40 overflow-hidden">
                <img src={`/${item.img}`} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 mix-blend-luminosity group-hover:mix-blend-normal" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
              </div>
              <div className="p-6 relative z-10 -mt-16 flex-1 flex flex-col justify-end">
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-muted text-sm">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Showcase */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features</h2>
          <p className="text-lg text-muted max-w-3xl mx-auto">
            Comprehensive tools for modern pharmaceutical supply chain management
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.1 }}
                className="glass p-6 rounded-xl hover:border-primary-500/50 transition-all group cursor-pointer"
              >
                <div className={`inline-block p-3 rounded-lg bg-gradient-to-br ${feature.color} text-white mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-4xl mx-auto glass rounded-2xl p-12 text-center border border-primary-500/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Supply Chain?</h2>
            <p className="text-lg text-muted mb-8">
              Join pharmaceutical leaders who are using PharmaSight to predict shortages and optimize inventory.
            </p>
            <Link href="/dashboard">
              <button className="button-primary flex items-center gap-2 text-lg px-8 py-3 mx-auto">
                Enter Dashboard Now <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold gradient-text">PharmaSight</span>
          </div>
          <p className="text-sm text-muted">© 2025 PharmaSight. AI-Powered Drug Shortage Prediction.</p>
        </div>
      </footer>
    </div>
  )
}
