'use client'

import { useState } from 'react'
import { formatEther, parseEther } from 'viem'
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { BASETIP_CONTRACT_ADDRESS, BASETIP_ABI, MINIMUM_TIP_AMOUNT } from '@/lib/contracts'

export default function TipContent() {
  const [contentId, setContentId] = useState('')
  const [tipAmount, setTipAmount] = useState('0.001')
  const [loading, setLoading] = useState(false)

  const { writeContract, data: hash, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Check if content exists
  const { data: contentExists } = useReadContract({
    address: BASETIP_CONTRACT_ADDRESS,
    abi: BASETIP_ABI,
    functionName: 'contentExists',
    args: contentId ? [contentId] : undefined,
  })

  // Get content info if it exists
  const { data: contentInfo } = useReadContract({
    address: BASETIP_CONTRACT_ADDRESS,
    abi: BASETIP_ABI,
    functionName: 'getContent',
    args: contentId && contentExists ? [contentId] : undefined,
  })

  const handleTip = async () => {
    if (!contentId || !tipAmount) return
    
    try {
      setLoading(true)
      const result = await writeContract({
        address: BASETIP_CONTRACT_ADDRESS,
        abi: BASETIP_ABI,
        functionName: 'tipContent',
        args: [contentId],
        value: parseEther(tipAmount),
      })
      // Handle success if needed
      console.log('Tip transaction submitted:', result)
    } catch (err) {
      console.error('Tip failed:', err)
      // Error is already handled by wagmi error state
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Send a Tip</h2>
        <p className="text-slate-600 mb-6">
          Support content creators by sending tips to their registered content.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6">
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Content URL or ID
          </label>
          <input
            type="text"
            value={contentId}
            onChange={(e) => setContentId(e.target.value)}
            placeholder="https://example.com/article or unique-content-id"
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white/80 backdrop-blur-sm transition-all"
          />
          {contentId && (
            <div className="mt-3 flex items-center space-x-2">
              {contentExists ? (
                <>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-emerald-600 text-sm font-medium">Content found</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-red-600 text-sm font-medium">Content not registered</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6">
          <label className="block text-sm font-semibold text-slate-900 mb-3">
            Tip Amount (ETH)
          </label>
          <div className="flex space-x-3 mb-4">
            <input
              type="number"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              min={formatEther(MINIMUM_TIP_AMOUNT)}
              step="0.001"
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white/80 backdrop-blur-sm transition-all"
            />
          </div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {['0.001', '0.005', '0.01', '0.05'].map((amount) => (
              <button
                key={amount}
                onClick={() => setTipAmount(amount)}
                className="px-4 py-2 text-sm font-medium bg-slate-100/80 hover:bg-pink-100 hover:text-pink-700 rounded-xl transition-all duration-200 backdrop-blur-sm border border-slate-200/50"
              >
                {amount}
              </button>
            ))}
          </div>
          <p className="text-sm text-slate-500">
            Minimum: {formatEther(MINIMUM_TIP_AMOUNT)} ETH
          </p>
        </div>

        {contentInfo && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/50 p-6 rounded-2xl backdrop-blur-sm">
            <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Content Stats
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-900">{contentInfo[1] ? formatEther(contentInfo[1]) : '0'}</div>
                <div className="text-xs text-blue-700">Total Tips (ETH)</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-900">{contentInfo[2]?.toString() || '0'}</div>
                <div className="text-xs text-blue-700">Tip Count</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-900">
                  {contentInfo[0] ? `${contentInfo[0].slice(0, 6)}...${contentInfo[0].slice(-4)}` : ''}
                </div>
                <div className="text-xs text-blue-700">Creator</div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleTip}
          disabled={!contentExists || loading || isConfirming || !tipAmount}
          className="w-full bg-gradient-to-r from-pink-500 to-violet-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-pink-600 hover:to-violet-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-pink-500/25"
        >
          {loading || isConfirming ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Processing...</span>
            </div>
          ) : (
            `Tip ${tipAmount} ETH`
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-red-700 text-sm font-medium">
                {error.message}
              </p>
            </div>
          </div>
        )}

        {isSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <p className="text-emerald-700 text-sm font-medium">
                Tip sent successfully!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}