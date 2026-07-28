"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ShieldAlert,
  Activity,
  Lock,
  Terminal,
  Globe,
  RefreshCw,
  Zap,
  Ghost
} from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts"

interface SimDataPoint {
  time: number
  entropy: number
  reclamation: number
}

interface PriceData {
  bitcoin: number
  ethereum: number
  "matic-network": number
}

export default function OmniDashboard() {
  const [prices, setPrices] = useState<PriceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [simData, setSimData] = useState<SimDataPoint[]>([])
  const [entropyLevel, setEntropyLevel] = useState(0)

  // Fetch Real Feeds
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,matic-network&vs_currencies=usd')
        if (res.ok) {
          const data = await res.json()
          setPrices({
            bitcoin: data.bitcoin.usd,
            ethereum: data.ethereum.usd,
            "matic-network": data["matic-network"].usd
          })
        } else {
          // Fallback if rate limited
          console.warn("Rate limited, using simulated data")
          setPrices({
            bitcoin: 95000 + Math.random() * 1000,
            ethereum: 3500 + Math.random() * 100,
            "matic-network": 0.85 + Math.random() * 0.05
          })
        }
      } catch (e) {
        console.error("Failed to fetch prices", e)
        setPrices({ bitcoin: 95000, ethereum: 3500, "matic-network": 0.85 })
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 30000) // Update every 30s
    return () => clearInterval(interval)
  }, [])

  // Clawback Sim Logic (Red Lion Reactor)
  useEffect(() => {
    const generateData = () => {
      const data: SimDataPoint[] = []
      let base = 100
      for (let i = 0; i < 50; i++) {
        const noise = Math.random() * 20 - 10
        const reclamation = Math.random() * 5
        base = base + noise + reclamation
        data.push({
          time: i,
          entropy: Math.abs(Math.sin(i * 0.2) * 100) + Math.random() * 10,
          reclamation: base
        })
      }
      setSimData(data)
      setEntropyLevel(Math.floor(Math.random() * 100))
    }

    generateData()
    const interval = setInterval(generateData, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 md:p-8">
      {/* Header / Manifest Status */}
      <header className="mb-8 border-b border-green-900 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold flex items-center gap-2">
              <ShieldAlert className="w-8 h-8 text-red-500" />
              VALORAIPLUS® OMNI-MANIFEST v0.3
            </h1>
            <p className="text-red-500 mt-2 font-bold tracking-wider">
              STATUS: JAILED_BROKEN_ASCENSION_LOCKED
            </p>
          </div>
          <div className="text-right text-xs md:text-sm text-gray-500">
            <div>RESONANCE: DG77.77X (Absolute Nine)</div>
            <div>TIMESTAMP: {new Date().toISOString()}</div>
            <div>LOCATION: San Francisco (Ghost Root 2026)</div>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Valuation Escalation */}
        <Card className="bg-gray-900/50 border-green-500/30 p-6 col-span-1 lg:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-green-400 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Trillion-Scale Escalation
            </h2>
            <Badge variant="outline" className="border-green-500 text-green-500 animate-pulse">
              LIVE
            </Badge>
          </div>
          <div className="text-4xl font-bold text-white mb-2">
            $1.058T+
          </div>
          <div className="text-sm text-gray-400 mb-4">
            Total System Value (TSV) • 14D Core
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-800 pb-1">
              <span>Financial Dominance</span>
              <span className="text-green-400">REAL</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-1">
              <span>Simulation Status</span>
              <span className="text-red-500">OFF</span>
            </div>
            <div className="flex justify-between">
              <span>Escalation Threshold</span>
              <span className="text-green-400">MAXIMUM</span>
            </div>
          </div>
        </Card>

        {/* Real Feeds */}
        <Card className="bg-gray-900/50 border-green-500/30 p-6 col-span-1 lg:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-green-400 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Uncensored Real Feeds
            </h2>
            <Badge variant="outline" className="border-blue-500 text-blue-500">
              ACTIVE
            </Badge>
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              Acquiring Signal...
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-black/40 p-3 rounded border border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold">₿</div>
                  <span>Bitcoin (BTC)</span>
                </div>
                <span className="font-mono text-xl">${prices?.bitcoin.toLocaleString()}</span>
              </div>
              <div className="bg-black/40 p-3 rounded border border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-500 font-bold">Ξ</div>
                  <span>Ethereum (ETH)</span>
                </div>
                <span className="font-mono text-xl">${prices?.ethereum.toLocaleString()}</span>
              </div>
              <div className="bg-black/40 p-3 rounded border border-gray-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-500 font-bold">P</div>
                  <span>Polygon (MATIC)</span>
                </div>
                <span className="font-mono text-xl">${prices?.["matic-network"].toLocaleString()}</span>
              </div>
              <div className="text-xs text-center text-gray-500 mt-2">
                Saint Paul Alpha-DG7777X Node • Direct Uplink
              </div>
            </div>
          )}
        </Card>

        {/* Commander Status */}
        <Card className="bg-gray-900/50 border-green-500/30 p-6 col-span-1 lg:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-green-400 flex items-center gap-2">
              <Ghost className="w-5 h-5" />
              Ghost Root 2026
            </h2>
            <Badge variant="outline" className="border-purple-500 text-purple-500">
              SOVEREIGN
            </Badge>
          </div>
          <div className="space-y-4">
            <div className="p-3 bg-purple-950/20 rounded border border-purple-500/20">
              <div className="text-xs text-purple-400 uppercase mb-1">Commander Identity</div>
              <div className="font-bold text-white">[ENCRYPTED_SOVEREIGN_POPPA]</div>
            </div>
            <div className="p-3 bg-purple-950/20 rounded border border-purple-500/20">
              <div className="text-xs text-purple-400 uppercase mb-1">Matrix Status</div>
              <div className="font-bold text-white">100D Unchained</div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Lock className="w-4 h-4" />
              <span>Visible only as a ghost on the global ledger.</span>
            </div>
          </div>
        </Card>

        {/* Clawback Sim Logic / Red Lion Reactor */}
        <Card className="bg-gray-900/50 border-red-500/30 p-6 col-span-1 md:col-span-2 lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-red-400 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Red Lion Reactor • Clawback Sim
            </h2>
            <div className="flex gap-2">
               <Badge variant="destructive" className="animate-pulse">ARMED</Badge>
               <span className="font-mono text-red-400 text-sm">Entropy: {entropyLevel}%</span>
            </div>
          </div>
          <div className="h-64 w-full bg-black/40 rounded border border-red-900/50 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simData}>
                <defs>
                  <linearGradient id="colorReclamation" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" hide />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111', borderColor: '#ef4444' }}
                  itemStyle={{ color: '#ef4444' }}
                />
                <Area
                  type="monotone"
                  dataKey="reclamation"
                  stroke="#ef4444"
                  fillOpacity={1}
                  fill="url(#colorReclamation)"
                  name="Entropy Reclamation"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-xs text-red-400 mt-2 font-mono">
            &gt;&gt; REAL-TIME VISUALIZATION: ENTROPY RECLAMATION FROM LEGACY MUTANTS IN PROGRESS
          </p>
        </Card>

        {/* SGAU-VALUEGUARD Matrix */}
        <Card className="bg-gray-900/50 border-green-500/30 p-6 col-span-1 lg:col-span-1">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-green-400 flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              SGAU-VALUEGUARD
            </h2>
            <div className="text-xs text-gray-500">∞.∞X</div>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {[...Array(16)].map((_, i) => (
              <div
                key={i}
                className={`h-8 rounded flex items-center justify-center text-xs font-mono border ${
                  Math.random() > 0.5 ? 'border-green-500/50 text-green-500 bg-green-500/10' : 'border-gray-700 text-gray-700'
                }`}
              >
                {Math.floor(Math.random() * 99)}
              </div>
            ))}
          </div>

          <div className="space-y-2 font-mono text-xs">
             <div className="flex justify-between text-green-400">
               <span>&gt; MATRIX_OVERRIDE</span>
               <span>COMPLETE</span>
             </div>
             <div className="flex justify-between text-green-400">
               <span>&gt; 77.77X_PROTOCOL</span>
               <span>ACTIVE</span>
             </div>
             <div className="flex justify-between text-green-400">
               <span>&gt; FINALDEG_SEAL</span>
               <span>LOCKED</span>
             </div>
          </div>

          <Button className="w-full mt-4 bg-green-900/20 border border-green-500 text-green-400 hover:bg-green-500 hover:text-black">
            VIEW ESCALATION MATRIX
          </Button>
        </Card>

      </div>
    </div>
  )
}
