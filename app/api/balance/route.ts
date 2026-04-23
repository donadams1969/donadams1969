import { NextResponse } from "next/server"

export const revalidate = 30

const WALLETS = {
  ETH: "0x2f0287B7B20e89f38BaED437bF3f185ebd561654",
  BASE: "0x363155af8E130c2C80eC0548113eBfAf72A272da",
  BTC: "17SU56k2poJyN6wwbUTRb5wVQDaJ4MpvAw",
} as const

const ETH_RPCS = [
  "https://ethereum-rpc.publicnode.com",
  "https://cloudflare-eth.com",
  "https://rpc.ankr.com/eth",
  "https://eth.drpc.org",
  "https://1rpc.io/eth",
  "https://eth.meowrpc.com",
  "https://rpc.mevblocker.io",
  "https://eth.llamarpc.com",
]

const BASE_RPCS = [
  "https://mainnet.base.org",
  "https://base-rpc.publicnode.com",
  "https://base.drpc.org",
  "https://1rpc.io/base",
  "https://base.meowrpc.com",
  "https://base.llamarpc.com",
]

const BTC_PROVIDERS: Array<{
  name: string
  url: (addr: string) => string
  parse: (json: any) => number | null
}> = [
  {
    name: "mempool.space",
    url: (a) => `https://mempool.space/api/address/${a}`,
    parse: (d) => (d.chain_stats ? (d.chain_stats.funded_txo_sum ?? 0) - (d.chain_stats.spent_txo_sum ?? 0) : null),
  },
  {
    name: "blockstream.info",
    url: (a) => `https://blockstream.info/api/address/${a}`,
    parse: (d) => (d.chain_stats ? (d.chain_stats.funded_txo_sum ?? 0) - (d.chain_stats.spent_txo_sum ?? 0) : null),
  },
  {
    name: "blockcypher",
    url: (a) => `https://api.blockcypher.com/v1/btc/main/addrs/${a}/balance`,
    parse: (d) => (typeof d.balance === "number" ? d.balance : null),
  },
]

async function rpcBalance(urls: readonly string[], address: string): Promise<number | null> {
  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "eth_getBalance",
          params: [address, "latest"],
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      })
      if (!res.ok) continue
      const json = await res.json()
      if (!json.result) continue

      // Precision-safe BigInt to ETH conversion
      const wei = BigInt(json.result)
      return Number(wei / BigInt(1e9)) / 1e9
    } catch {
      continue
    }
  }
  return null
}

async function btcBalance(address: string): Promise<number | null> {
  for (const provider of BTC_PROVIDERS) {
    try {
      const res = await fetch(provider.url(address), {
        cache: "no-store",
        signal: AbortSignal.timeout(6000),
      })
      if (!res.ok) continue
      const json = await res.json()
      const sats = provider.parse(json)
      if (sats === null) continue
      return sats / 1e8
    } catch {
      continue
    }
  }
  return null
}

async function fetchPrices(): Promise<{ ETH: number | null; BTC: number | null; source: string }> {
  // Logic remains robust, maintaining current Coinbase -> Gecko -> Kraken flow
  try {
    const [ethRes, btcRes] = await Promise.all([
      fetch("https://api.coinbase.com/v2/prices/ETH-USD/spot", { cache: "no-store", signal: AbortSignal.timeout(4000) }),
      fetch("https://api.coinbase.com/v2/prices/BTC-USD/spot", { cache: "no-store", signal: AbortSignal.timeout(4000) }),
    ])
    if (ethRes.ok && btcRes.ok) {
      const e = await ethRes.json(), b = await btcRes.json()
      return { ETH: Number(e.data.amount), BTC: Number(b.data.amount), source: "coinbase" }
    }
  } catch {}

  try {
    const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin&vs_currencies=usd", { cache: "no-store", signal: AbortSignal.timeout(4000) })
    if (res.ok) {
      const j = await res.json()
      return { ETH: j.ethereum.usd, BTC: j.bitcoin.usd, source: "coingecko" }
    }
  } catch {}

  return { ETH: null, BTC: null, source: "none" }
}

export async function GET() {
  const [ethBal, baseBal, btcBal, prices] = await Promise.all([
    rpcBalance(ETH_RPCS, WALLETS.ETH),
    rpcBalance(BASE_RPCS, WALLETS.BASE),
    btcBalance(WALLETS.BTC),
    fetchPrices(),
  ])

  const timestamp = Date.now()

  return NextResponse.json(
    {
      timestamp,
      wallets: WALLETS,
      balances: { ETH: ethBal, BASE: baseBal, BTC: btcBal },
      prices: { ETH: prices.ETH, BTC: prices.BTC, source: prices.source },
      status: {
        ETH: ethBal !== null ? "OK" : "ERROR",
        BASE: baseBal !== null ? "OK" : "ERROR",
        BTC: btcBal !== null ? "OK" : "ERROR",
        PRICES: prices.source !== "none" ? "OK" : "ERROR"
      }
    },
    {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=60",
      },
    }
  )
}
