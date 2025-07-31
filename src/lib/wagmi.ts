import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { baseSepolia } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'BaseTip',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'your-project-id',
  chains: [baseSepolia],
  ssr: true,
  // Disable problematic connectors in development
  wallets: undefined, // This will use default wallets but may help with the error
})

export { baseSepolia }