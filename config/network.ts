export const NETWORK_CONFIG = {
  // Primary Price Feed (Bypasses Binance 451 Errors)
  priceProvider: {
    name: 'Coinbase',
    baseUrl: 'https://api.coinbase.com/v2/prices',
    endpoints: {
      eth: '/ETH-USD/spot',
      btc: '/BTC-USD/spot'
    }
  },
  // Resilient RPC (Bypasses LlamaRPC 403 Errors)
  rpcProvider: {
    base: 'https://mainnet.base.org',
    fallback: 'https://base-rpc.publicnode.com'
  },
  timeouts: {
    request: 6000,
    retryDelay: 2000
  }
} as const;