'use client'

import { useState } from 'react'
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { BASETIP_CONTRACT_ADDRESS, BASETIP_ABI } from '@/lib/contracts'

export default function RegisterContent() {
  const [contentId, setContentId] = useState('')
  const [loading, setLoading] = useState(false)

  const { writeContract, data: hash, error } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Check if content already exists
  const { data: contentExists } = useReadContract({
    address: BASETIP_CONTRACT_ADDRESS,
    abi: BASETIP_ABI,
    functionName: 'contentExists',
    args: contentId ? [contentId] : undefined,
  })

  const handleRegister = async () => {
    if (!contentId || contentExists) return
    
    try {
      setLoading(true)
      await writeContract({
        address: BASETIP_CONTRACT_ADDRESS,
        abi: BASETIP_ABI,
        functionName: 'registerContent',
        args: [contentId],
      })
    } catch (err) {
      console.error('Registration failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Register Your Content</h2>
        <p className="text-slate-600 mb-6">
          Register your articles, blog posts, or any content to receive tips from readers.
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50/80 to-cyan-50/80 backdrop-blur-sm border border-blue-200/50 p-6 rounded-2xl">
        <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
            <span className="text-white text-sm">ℹ️</span>
          </span>
          How it works
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <p className="text-sm text-blue-700">Register your content with a unique URL or identifier</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <p className="text-sm text-blue-700">Share the URL with your audience</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <p className="text-sm text-blue-700">Readers can tip your content directly</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <p className="text-sm text-blue-700">Withdraw your earnings anytime from the Creator Dashboard</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-6">
        <label className="block text-sm font-semibold text-slate-900 mb-3">
          Content URL or Unique ID
        </label>
        <input
          type="text"
          value={contentId}
          onChange={(e) => setContentId(e.target.value)}
          placeholder="https://myblog.com/my-article or unique-content-id"
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 bg-white/80 backdrop-blur-sm transition-all"
        />
        {contentId && (
          <div className="mt-3 flex items-center space-x-2">
            {contentExists ? (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-red-600 text-sm font-medium">Content already registered</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-emerald-600 text-sm font-medium">Available for registration</span>
              </>
            )}
          </div>
        )}
        <p className="mt-3 text-xs text-slate-500">
          Use your article URL or create a unique identifier. This cannot be changed later.
        </p>
      </div>

      <div className="bg-gradient-to-br from-violet-50/80 to-purple-50/80 backdrop-blur-sm border border-violet-200/50 p-6 rounded-2xl">
        <h4 className="font-semibold text-violet-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-violet-500 rounded-xl flex items-center justify-center mr-3">
            <span className="text-white text-sm">💡</span>
          </span>
          Best Practices
        </h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
            <p className="text-sm text-violet-700">Use your actual content URL for easy sharing</p>
          </div>
          <div className="space-y-2">
            <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
            <p className="text-sm text-violet-700">Keep IDs short and memorable if using custom identifiers</p>
          </div>
          <div className="space-y-2">
            <div className="w-2 h-2 bg-violet-500 rounded-full"></div>
            <p className="text-sm text-violet-700">Consider using a URL shortener for long URLs</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleRegister}
        disabled={!contentId || contentExists || loading || isConfirming}
        className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 text-white py-4 px-6 rounded-2xl font-semibold hover:from-emerald-600 hover:to-cyan-700 disabled:from-slate-300 disabled:to-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/25"
      >
        {loading || isConfirming ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Registering...</span>
          </div>
        ) : (
          'Register Content'
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
              Content registered successfully! You can now receive tips.
            </p>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-amber-50/80 to-orange-50/80 backdrop-blur-sm border border-amber-200/50 p-6 rounded-2xl">
        <h4 className="font-semibold text-amber-900 mb-4 flex items-center">
          <span className="w-8 h-8 bg-amber-500 rounded-xl flex items-center justify-center mr-3">
            <span className="text-white text-sm">🚀</span>
          </span>
          Next Steps
        </h4>
        <div className="text-sm text-amber-700 space-y-3">
          <p className="font-medium">After registering, you can:</p>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Share your content ID with readers</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Embed a tip button on your website (coming soon)</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Monitor your earnings in the Creator Dashboard</span>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <span>Withdraw earnings anytime</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}