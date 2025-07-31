'use client'

import { useState, useEffect } from 'react'
import { formatEther } from 'viem'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { BASETIP_CONTRACT_ADDRESS, BASETIP_ABI } from '@/lib/contracts'

export default function CreatorDashboard() {
  const { address } = useAccount()

  const { writeContract, data: hash, error } = useWriteContract()
  
  const { isLoading: isWithdrawing, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Get creator earnings
  const { data: earnings, refetch: refetchEarnings } = useReadContract({
    address: BASETIP_CONTRACT_ADDRESS,
    abi: BASETIP_ABI,
    functionName: 'creatorEarnings',
    args: address ? [address] : undefined,
  })

  // Get creator's registered content
  const { data: contentList, refetch: refetchContent } = useReadContract({
    address: BASETIP_CONTRACT_ADDRESS,
    abi: BASETIP_ABI,
    functionName: 'getCreatorContent',
    args: address ? [address] : undefined,
  })

  // Get details for each content
  const [contentDetails, setContentDetails] = useState<any[]>([])

  useEffect(() => {
    const fetchContentDetails = async () => {
      if (!contentList || contentList.length === 0) {
        setContentDetails([])
        return
      }

      try {
        // In a real app, you'd batch these calls or use a multicall contract
        const details = await Promise.all(
          contentList.map(async (contentId) => {
            // This is a simplified approach - in production you'd want to use a proper data fetching pattern
            return {
              id: contentId,
              totalTips: '0',
              tipCount: '0',
              // You'd fetch actual data here using useReadContract for each content
            }
          })
        )
        setContentDetails(details)
      } catch (error) {
        console.error('Error fetching content details:', error)
      }
    }

    fetchContentDetails()
  }, [contentList])

  const handleWithdraw = async () => {
    if (!earnings || earnings === 0n) return
    
    try {
      await writeContract({
        address: BASETIP_CONTRACT_ADDRESS,
        abi: BASETIP_ABI,
        functionName: 'withdrawEarnings',
      })
    } catch (err) {
      console.error('Withdrawal failed:', err)
    }
  }

  // Refetch data after successful withdrawal
  useEffect(() => {
    if (isSuccess) {
      refetchEarnings()
      refetchContent()
    }
  }, [isSuccess, refetchEarnings, refetchContent])

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Creator Dashboard</h2>
        <p className="text-slate-600 mb-6">
          Manage your registered content and track your earnings.
        </p>
      </div>

      {/* Earnings Summary */}
      <div className="bg-gradient-to-br from-pink-500 via-purple-600 to-violet-700 text-white p-8 rounded-3xl shadow-2xl shadow-pink-500/25">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 opacity-90">Your Earnings</h3>
            <div className="text-4xl font-bold mb-1">
              {earnings ? formatEther(earnings) : '0'} ETH
            </div>
            <div className="text-pink-200 text-sm">
              ${earnings ? (parseFloat(formatEther(earnings)) * 2500).toFixed(2) : '0.00'} USD
            </div>
          </div>
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
        </div>
        <button
          onClick={handleWithdraw}
          disabled={!earnings || earnings === 0n || isWithdrawing}
          className="w-full bg-white/20 backdrop-blur-sm hover:bg-white/30 disabled:bg-white/10 text-white px-6 py-3 rounded-2xl font-semibold disabled:text-white/50 disabled:cursor-not-allowed transition-all duration-200 border border-white/20"
        >
          {isWithdrawing ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing withdrawal...</span>
            </div>
          ) : (
            'Withdraw Earnings'
          )}
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
            <span className="text-white text-xl">📝</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {contentList?.length || 0}
          </div>
          <div className="text-sm text-slate-600">Content Pieces</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
            <span className="text-white text-xl">💎</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            {earnings ? formatEther(earnings) : '0'}
          </div>
          <div className="text-sm text-slate-600">Total Earned (ETH)</div>
        </div>
        <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
            <span className="text-white text-xl">⚡</span>
          </div>
          <div className="text-3xl font-bold text-slate-900 mb-1">
            0
          </div>
          <div className="text-sm text-slate-600">Total Tips Received</div>
        </div>
      </div>

      {/* Registered Content */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
          <span className="w-8 h-8 bg-gradient-to-br from-pink-500 to-violet-600 rounded-xl flex items-center justify-center mr-3">
            <span className="text-white text-sm">📚</span>
          </span>
          Your Registered Content
        </h3>
        
        {contentList && contentList.length > 0 ? (
          <div className="space-y-4">
            {contentList.map((contentId, index) => (
              <div key={contentId} className="bg-gradient-to-r from-slate-50/80 to-blue-50/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 break-all mb-2">
                      {contentId}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm text-slate-600">
                      <span className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span>Registered</span>
                      </span>
                      <span>#{index + 1}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/30">
                    <div className="text-2xl font-bold text-slate-900 mb-1">
                      {contentDetails[index]?.totalTips || '0'}
                    </div>
                    <div className="text-xs text-slate-600">Total Tips (ETH)</div>
                  </div>
                  <div className="text-center bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/30">
                    <div className="text-2xl font-bold text-slate-900 mb-1">
                      {contentDetails[index]?.tipCount || '0'}
                    </div>
                    <div className="text-xs text-slate-600">Tips Count</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => navigator.clipboard.writeText(contentId)}
                    className="text-xs bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-200 font-medium"
                  >
                    📋 Copy ID
                  </button>
                  {contentId.startsWith('http') && (
                    <a
                      href={contentId}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-gradient-to-r from-violet-500 to-purple-600 text-white px-4 py-2 rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all duration-200 font-medium"
                    >
                      🔗 Visit
                    </a>
                  )}
                  <button className="text-xs bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 font-medium">
                    📊 Analytics
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl flex items-center justify-center">
              <span className="text-3xl text-slate-500">📝</span>
            </div>
            <h4 className="text-xl font-semibold text-slate-900 mb-3">
              No content registered yet
            </h4>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Register your first piece of content to start receiving tips from your audience.
            </p>
            <button className="bg-gradient-to-r from-pink-500 to-violet-600 text-white px-6 py-3 rounded-2xl font-semibold hover:from-pink-600 hover:to-violet-700 transition-all duration-200 transform hover:scale-105">
              Register Your First Content →
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-2xl">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <p className="text-red-700 text-sm font-medium">
              {error.message}
            </p>
          </div>
        </div>
      )}

      {isSuccess && (
        <div className="p-4 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <p className="text-emerald-700 text-sm font-medium">
              Withdrawal successful! Check your wallet.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}