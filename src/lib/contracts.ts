import { Address } from 'viem'

// Contract address (replace with your deployed address)
export const BASETIP_CONTRACT_ADDRESS: Address = '0x...' // Your deployed contract address

// Contract ABI (copy from contracts/out/BaseTip.sol/BaseTip.json)
export const BASETIP_ABI = [
  {
    "type": "constructor",
    "inputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "MINIMUM_TIP",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "contentExists",
    "inputs": [{"name": "contentId", "type": "string", "internalType": "string"}],
    "outputs": [{"name": "", "type": "bool", "internalType": "bool"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "contents",
    "inputs": [{"name": "", "type": "string", "internalType": "string"}],
    "outputs": [
      {"name": "creator", "type": "address", "internalType": "address"},
      {"name": "contentId", "type": "string", "internalType": "string"},
      {"name": "totalTips", "type": "uint256", "internalType": "uint256"},
      {"name": "tipCount", "type": "uint256", "internalType": "uint256"},
      {"name": "exists", "type": "bool", "internalType": "bool"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "creatorEarnings",
    "inputs": [{"name": "", "type": "address", "internalType": "address"}],
    "outputs": [{"name": "", "type": "uint256", "internalType": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getContent",
    "inputs": [{"name": "contentId", "type": "string", "internalType": "string"}],
    "outputs": [
      {"name": "creator", "type": "address", "internalType": "address"},
      {"name": "totalTips", "type": "uint256", "internalType": "uint256"},
      {"name": "tipCount", "type": "uint256", "internalType": "uint256"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getCreatorContent",
    "inputs": [{"name": "creator", "type": "address", "internalType": "address"}],
    "outputs": [{"name": "", "type": "string[]", "internalType": "string[]"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "registerContent",
    "inputs": [{"name": "contentId", "type": "string", "internalType": "string"}],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "tipContent",
    "inputs": [{"name": "contentId", "type": "string", "internalType": "string"}],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "type": "function",
    "name": "withdrawEarnings",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "ContentRegistered",
    "inputs": [
      {"name": "contentId", "type": "string", "indexed": true, "internalType": "string"},
      {"name": "creator", "type": "address", "indexed": true, "internalType": "address"}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "TipSent",
    "inputs": [
      {"name": "contentId", "type": "string", "indexed": true, "internalType": "string"},
      {"name": "tipper", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "creator", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256"},
      {"name": "platformFee", "type": "uint256", "indexed": false, "internalType": "uint256"}
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EarningsWithdrawn",
    "inputs": [
      {"name": "creator", "type": "address", "indexed": true, "internalType": "address"},
      {"name": "amount", "type": "uint256", "indexed": false, "internalType": "uint256"}
    ],
    "anonymous": false
  }
] as const

// Helper types
export type ContentInfo = {
  creator: Address
  totalTips: bigint
  tipCount: bigint
}

export const MINIMUM_TIP_AMOUNT = 1000000000000000n // 0.001 ETH in wei