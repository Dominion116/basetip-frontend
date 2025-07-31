'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import RegisterContent from '@/components/RegisterContent'
import TipContent from '@/components/TipContent'
import CreatorDashboard from '@/components/CreatorDashboard'

export default function Home() {
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'tip' | 'register' | 'dashboard'>('tip')

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-violet-600 rounded-2xl mb-6">
          <span className="text-white font-bold text-xl">B</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent mb-4">
          BaseTip
        </h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
          Micro-donations for content creators on Base. Support your favorite writers with instant, low-cost tips.
        </p>
        <div className="flex justify-center">
          <ConnectButton />
        </div>
      </div>

      {isConnected && (
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 p-8 shadow-xl">
          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-slate-100/80 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('tip')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'tip'
                  ? 'bg-white text-pink-600 shadow-lg shadow-pink-500/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              💰 Send Tips
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'register'
                  ? 'bg-white text-pink-600 shadow-lg shadow-pink-500/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              📝 Register Content
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'dashboard'
                  ? 'bg-white text-pink-600 shadow-lg shadow-pink-500/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              📊 Creator Dashboard
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'tip' && <TipContent />}
          {activeTab === 'register' && <RegisterContent />}
          {activeTab === 'dashboard' && <CreatorDashboard />}
        </div>
      )}

      {!isConnected && (
        <div className="text-center bg-white/60 backdrop-blur-xl rounded-3xl border border-slate-200/50 p-12 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Get Started with BaseTip
          </h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            Connect your wallet to start tipping content creators or register your own content for tips.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-3">For Readers</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Support your favorite content creators with micro-tips starting from $1
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">✍️</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-3">For Creators</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Register your content and receive instant payments from readers
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-400 to-rose-500 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-3">Instant & Low-Cost</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Built on Base for fast transactions and minimal fees
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}