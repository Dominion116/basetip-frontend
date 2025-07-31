'use client'

import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { config } from '@/lib/wagmi'
import { useState, useEffect } from 'react'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [queryClient] = useState(() => new QueryClient())

  // Suppress Coinbase Wallet telemetry errors
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' && 
        (args[0].includes('Failed to load telemetry script') || 
         args[0].includes('Coinbase Wallet SDK'))
      ) {
        return; // Suppress these specific errors
      }
      originalError.apply(console, args);
    };
    
    return () => {
      console.error = originalError;
    };
  }, [])

  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
              <RainbowKitProvider>
              <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                      <div className="flex items-center">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-sm">B</span>
                          </div>
                          <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-violet-600 bg-clip-text text-transparent">BaseTip</h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </nav>
                <main>{children}</main>
              </div>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}