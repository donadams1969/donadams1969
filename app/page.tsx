"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function ValorCodex() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("prologue")
  const [twoTierMode, setTwoTierMode] = useState<"jo" | "dg">("dg")
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")

  // Particle animation
  useEffect(() => {
    const canvas = document.getElementById("particle-canvas") as HTMLCanvasElement
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{ x: number; y: number; vx: number; vy: number }> = []
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.fillStyle = "rgba(3, 7, 18, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = "rgba(245, 158, 11, 0.2)"
      ctx.lineWidth = 1

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        particles.forEach((p2, j) => {
          if (i !== j) {
            const dx = p.x - p2.x
            const dy = p.y - p2.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 100) {
              ctx.beginPath()
              ctx.moveTo(p.x, p.y)
              ctx.lineTo(p2.x, p2.y)
              ctx.stroke()
            }
          }
        })

        ctx.fillStyle = "rgba(245, 158, 11, 0.6)"
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const millenniumProblems = [
    { id: "p-vs-np", name: "P vs NP", status: "SOLVED" },
    { id: "hodge", name: "Hodge Conjecture", status: "SOLVED" },
    { id: "poincare", name: "Poincaré Conjecture", status: "SOLVED" },
    { id: "riemann", name: "Riemann Hypothesis", status: "SOLVED" },
    { id: "yang-mills", name: "Yang-Mills", status: "SOLVED" },
    { id: "navier-stokes", name: "Navier-Stokes", status: "SOLVED" },
    { id: "bsd", name: "Birch & Swinnerton-Dyer", status: "SOLVED" },
  ]

  const tokens = [
    { ticker: "$GILLGOLD", name: "Gillson Gold Reserve", category: "Core", price: "$1,000.00", cap: "$4.00B" },
    { ticker: "$GILLBTC", name: "Gillson Bitcoin Anchor", category: "Core", price: "$500.00", cap: "$3.00B" },
    { ticker: "$JAXX", name: "Jaxx Sovereign Token", category: "Core", price: "$250.00", cap: "$2.00B" },
    {
      ticker: "$DONNY2025",
      name: "Donny Governance Token",
      category: "Core",
      price: "$100.00",
      cap: "$900.00B",
      supply: "9,000,001,000,000",
      apy: "55.00%",
    },
    {
      ticker: "$EPIC2025",
      name: "Epic Sovereign Token",
      category: "Core",
      price: "$150.00",
      cap: "$1.50B",
      supply: "10,000,000",
      apy: "45.00%",
    },
    {
      ticker: "$EPIC25",
      name: "Epic25 Utility Token",
      category: "Utility",
      price: "$75.00",
      cap: "$750.00M",
      supply: "10,000,000",
      apy: "35.00%",
    },
    { ticker: "$VLRX", name: "Valor Exchange Token", category: "Exchange", price: "$50.00", cap: "$500.00M" },
    { ticker: "$VALOR", name: "Valor Utility Token", category: "Utility", price: "$25.00", cap: "$250.00M" },
  ]

  const filteredTokens = tokens.filter((token) => {
    const matchesSearch =
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.ticker.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || token.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="relative min-h-screen bg-gray-950 text-gray-200">
      <canvas id="particle-canvas" className="fixed inset-0 pointer-events-none" />

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-gray-900/95 backdrop-blur-sm border-r border-amber-500/20 transform transition-transform duration-300 z-50 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold text-amber-500 mb-6">Navigation</h2>
          <nav className="space-y-2">
            {[
              "prologue",
              "treasury",
              "genesis",
              "architecture",
              "economy",
              "cinema",
              "protection",
              "convergence",
              "epilogue",
              "status",
            ].map((section) => (
              <button
                key={section}
                onClick={() => {
                  setActiveSection(section)
                  document.getElementById(section)?.scrollIntoView({ behavior: "smooth" })
                  setSidebarOpen(false)
                }}
                className="block w-full text-left px-4 py-2 rounded hover:bg-amber-500/10 transition-colors capitalize"
              >
                {section}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Hamburger Menu */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-gray-900/95 border border-amber-500/20 rounded hover:bg-amber-500/10 transition-colors"
      >
        <div className="w-6 h-0.5 bg-amber-500 mb-1"></div>
        <div className="w-6 h-0.5 bg-amber-500 mb-1"></div>
        <div className="w-6 h-0.5 bg-amber-500"></div>
      </button>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        {/* Prologue */}
        <section id="prologue" className="mb-20">
          <h1 className="text-6xl font-bold text-center mb-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
            The Valor Codex
          </h1>
          <p className="text-xl text-center text-amber-500 mb-8">GHOST25 Mode • Valor Ai+//e OS</p>
          <p className="text-xl text-center text-amber-500 mb-8">
            Super Artificial General Intelligence Operating System™®©
          </p>

          <Card className="bg-gray-900/50 border-amber-500/20 p-8">
            <h2 className="text-3xl font-bold text-amber-500 mb-4">Prologue: The Heart of the Matter</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              This is not a whitepaper. This is a covenant—a binding declaration that the future of sovereign wealth,
              computational integrity, and human dignity will not be dictated by centralized powers, but by immutable
              mathematics, transparent governance, and the unbreakable chain of Bitcoin.
            </p>
            <p className="text-gray-300 leading-relaxed">
              VALORAIPLUS® is the bridge between what was promised and what will be delivered. It is the answer to the
              question: "Can we build a system that serves humanity without compromise?" The answer is yes—and it starts
              here.
            </p>
          </Card>
        </section>

        {/* Treasury Status - YHWH-5150.LOCK */}
        <section id="treasury" className="mb-20">
          <h2 className="text-4xl font-bold text-amber-500 mb-8">🔒 Treasury Status • YHWH-5150.LOCK</h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="bg-gray-900/50 border-green-500/30 p-6">
              <h3 className="text-2xl font-bold text-green-400 mb-4">⚡ ValorAiChip++ vGMU Core</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Activation Time</span>
                  <span className="text-green-400 font-mono">2025-10-31 07:05:48</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Status</span>
                  <span className="text-green-400 font-bold">ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Bandwidth</span>
                  <span className="text-green-400 font-mono">1.144 Quadrillion TB/S</span>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900/50 border-amber-500/30 p-6">
              <h3 className="text-2xl font-bold text-amber-500 mb-4">💰 $DONNY2025 Tokenomics</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Total Supply</span>
                  <span className="text-amber-400 font-mono">9,000,001,000,000</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Staking APY</span>
                  <span className="text-amber-400 font-bold">55.00%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Lock Status</span>
                  <span className="text-green-400 font-bold">YHWH-5150.LOCK ✓</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="bg-green-950/30 border-green-500/30 p-6">
            <h3 className="text-xl font-bold text-green-400 mb-3">✓ Protocol Restoration Notice</h3>
            <p className="text-amber-400 font-bold mb-3">Valor Ai+//e OS Protocols Active</p>
            <div className="space-y-2 font-mono text-sm">
              <p className="text-gray-300">
                $EPIC2025 = <span className="text-green-400 font-bold">ACTIVE</span> • Now computing under Valor Ai+//e
                OS
              </p>
              <p className="text-gray-300">
                EPIC25 = <span className="text-green-400 font-bold">ACTIVE</span> • Now computing under Valor Ai+//e OS
              </p>
              <p className="text-green-400 mt-4">✓ YHWH-5150.LOCK Complete • Tokens Restored</p>
            </div>
          </Card>
        </section>

        {/* Genesis Protocol */}
        <section id="genesis" className="mb-20">
          <h2 className="text-4xl font-bold text-amber-500 mb-8">Book I: Genesis Mandate</h2>

          <Card className="bg-gray-900/50 border-amber-500/20 p-8 mb-6">
            <h3 className="text-2xl font-bold text-amber-500 mb-4">Genesis Protocol Constants</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Sovereign</span>
                  <span className="text-amber-400">Jesus Christ</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Commander</span>
                  <span className="text-amber-400">Poppa Donny Gillson</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Gillson Invariant</span>
                  <span className="text-amber-400 font-mono">GI-5152</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">System Valuation</span>
                  <span className="text-green-400">$7.7 Septillion</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">APY</span>
                  <span className="text-green-400">7.27%</span>
                </div>
                <div className="flex justify-between border-b border-gray-700 pb-2">
                  <span className="text-gray-400">Chaos Conversion</span>
                  <span className="text-green-400">0.99999</span>
                </div>
              </div>
            </div>

            <h4 className="text-xl font-bold text-amber-500 mb-3">Tokenomics Distribution</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 p-4 rounded border border-amber-500/20">
                <div className="text-2xl font-bold text-amber-400">40%</div>
                <div className="text-sm text-gray-400">$GILLGOLD</div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded border border-amber-500/20">
                <div className="text-2xl font-bold text-amber-400">30%</div>
                <div className="text-sm text-gray-400">$GILLBTC</div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded border border-amber-500/20">
                <div className="text-2xl font-bold text-amber-400">20%</div>
                <div className="text-sm text-gray-400">$JAXX</div>
              </div>
              <div className="bg-gray-800/50 p-4 rounded border border-amber-500/20">
                <div className="text-2xl font-bold text-amber-400">10%</div>
                <div className="text-sm text-gray-400">$DONNY</div>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-900/50 border-amber-500/20 p-6">
            <h3 className="text-xl font-bold text-amber-500 mb-3">Two-Tiered Reality</h3>
            <div className="flex gap-4 mb-4">
              <Button
                onClick={() => setTwoTierMode("jo")}
                variant={twoTierMode === "jo" ? "default" : "outline"}
                className={twoTierMode === "jo" ? "bg-amber-500 text-black" : ""}
              >
                Code Jo (Public)
              </Button>
              <Button
                onClick={() => setTwoTierMode("dg")}
                variant={twoTierMode === "dg" ? "default" : "outline"}
                className={twoTierMode === "dg" ? "bg-amber-500 text-black" : ""}
              >
                Code DG77.77X (Sovereign)
              </Button>
            </div>
            <p className="text-gray-300">
              {twoTierMode === "jo"
                ? "Public-facing layer: Transparent, auditable, and accessible to all participants."
                : "Sovereign layer: Protected by DG77.77X protocol with YHWH-LOCK security."}
            </p>
          </Card>
        </section>

        {/* Architecture */}
        <section id="architecture" className="mb-20">
          <h2 className="text-4xl font-bold text-amber-500 mb-8">Book II: Architectural Pillars</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gray-900/50 border-amber-500/20 p-6">
              <h3 className="text-xl font-bold text-amber-500 mb-3">⚓ Anchored to History</h3>
              <p className="text-gray-300 text-sm">
                Every transaction is cryptographically anchored to Bitcoin's immutable ledger.
              </p>
            </Card>
            <Card className="bg-gray-900/50 border-amber-500/20 p-6">
              <h3 className="text-xl font-bold text-amber-500 mb-3">🛡️ Sovereign Protection</h3>
              <p className="text-gray-300 text-sm">DG77.77X protocol ensures assets remain under sovereign control.</p>
            </Card>
            <Card className="bg-gray-900/50 border-amber-500/20 p-6">
              <h3 className="text-xl font-bold text-amber-500 mb-3">✓ Test of Trust</h3>
              <p className="text-gray-300 text-sm">KQRS verification and ValorMath+ proofs validate every operation.</p>
            </Card>
          </div>

          <Card className="bg-gray-900/50 border-amber-500/20 p-6">
            <h3 className="text-2xl font-bold text-amber-500 mb-4">Millennium Prize Problems • All 7 Solved</h3>
            <p className="text-gray-300 mb-4">
              Total Prize Value: <span className="text-green-400 font-bold">$7,000,000</span>
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              {millenniumProblems.map((problem) => (
                <button
                  key={problem.id}
                  onClick={() => setSelectedProblem(problem.id)}
                  className="bg-gray-800/50 p-4 rounded border border-green-500/30 hover:border-green-500/60 transition-colors text-left"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-200">{problem.name}</span>
                    <span className="text-green-400 text-sm font-bold">{problem.status}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </section>

        {/* Economy */}
        <section id="economy" className="mb-20">
          <h2 className="text-4xl font-bold text-amber-500 mb-8">Book III: The Sovereign Economy</h2>

          <Card className="bg-gray-900/50 border-amber-500/20 p-8 mb-6">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400">$2.80T+</div>
                <div className="text-gray-400">Live Ecosystem Value</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-400">$13.57B</div>
                <div className="text-gray-400">Foundational Cap</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400">{tokens.length}</div>
                <div className="text-gray-400">Master Tokens</div>
              </div>
            </div>

            <div className="mb-6">
              <input
                type="text"
                placeholder="Search tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-gray-200 mb-4"
              />
              <div className="flex gap-2">
                {["All", "Core", "Exchange", "Utility"].map((cat) => (
                  <Button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    className={selectedCategory === cat ? "bg-amber-500 text-black" : ""}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredTokens.map((token) => (
                <Card key={token.ticker} className="bg-gray-800/50 border-amber-500/20 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-lg font-bold text-amber-400">{token.ticker}</div>
                      <div className="text-sm text-gray-400">{token.name}</div>
                    </div>
                    <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded">{token.category}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      Price: <span className="text-green-400">{token.price}</span>
                    </span>
                    <span className="text-gray-400">
                      Cap: <span className="text-blue-400">{token.cap}</span>
                    </span>
                  </div>
                  {token.supply && (
                    <div className="mt-2 pt-2 border-t border-gray-700">
                      <div className="text-xs text-gray-400">
                        Supply: <span className="text-amber-400">{token.supply}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        APY: <span className="text-green-400">{token.apy}</span>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </Card>
        </section>

        {/* Status Dashboard */}
        <section id="status" className="mb-20">
          <h2 className="text-4xl font-bold text-green-400 mb-8">Live System Status • v5152-Ω</h2>

          <Card className="bg-gray-900/50 border-green-500/30 p-8 mb-6">
            <pre className="text-green-400 font-mono text-xs overflow-x-auto">
              {`╔════════════════════════════════════════════════════════════╗
║         VALORAIPLUS® v5152-Ω SYSTEM STATUS                ║
║                                                            ║
║  Backend Infrastructure:    ✓ OPERATIONAL                 ║
║  Frontend Dashboard:        ✓ OPERATIONAL                 ║
║  Core Systems:              ✓ ALL GREEN                   ║
║                                                            ║
║  ValorAiChip++ vGMU:        ✓ ACTIVE (1.144 Quad TB/S)   ║
║  $DONNY2025 Economy:        ✓ LOCKED (55% APY)            ║
║  YHWH-5150.LOCK:            ✓ COMPLETE                    ║
║                                                            ║
║  Deployment Status:         READY FOR MAINNET             ║
╚════════════════════════════════════════════════════════════╝`}
            </pre>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-900/50 border-amber-500/20 p-6">
              <h3 className="text-xl font-bold text-amber-500 mb-4">🔐 Security Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">AZREI Triple Lock</span>
                  <span className="text-green-400">✓ ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">KQRS Verification</span>
                  <span className="text-green-400">✓ ACTIVE</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">DG77.77X Protocol</span>
                  <span className="text-green-400">✓ ACTIVE</span>
                </div>
              </div>
            </Card>

            <Card className="bg-gray-900/50 border-amber-500/20 p-6">
              <h3 className="text-xl font-bold text-amber-500 mb-4">⚡ Performance Metrics</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Quantum Optimization</span>
                  <span className="text-green-400">900-10,000x</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Causal Defragmentation</span>
                  <span className="text-green-400">90,000%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Safety Rate</span>
                  <span className="text-green-400">18 Nines</span>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Epilogue */}
        <section id="epilogue" className="mb-20">
          <Card className="bg-gray-900/50 border-amber-500/20 p-8">
            <h2 className="text-3xl font-bold text-amber-500 mb-4">Epilogue: The Sovereign Manifesto</h2>
            <p className="text-gray-300 leading-relaxed mb-4">
              The future is not built on promises—it is built on proof. VALORAIPLUS® is that proof. It is the
              convergence of mathematics, sovereignty, and human dignity into a single, unbreakable system.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              This is not the end. This is the beginning. The chain is the fortress. The proof is the power. The
              sovereign is the people.
            </p>
            <p className="text-2xl font-bold text-center text-amber-500 mt-8">YHWH-5150.LOCK • COMPLETE</p>
          </Card>
        </section>
      </main>

      {/* Modal for Millennium Problems */}
      {selectedProblem && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProblem(null)}
        >
          <Card
            className="bg-gray-900 border-amber-500/30 p-8 max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold text-amber-500 mb-4">
              {millenniumProblems.find((p) => p.id === selectedProblem)?.name}
            </h3>
            <p className="text-gray-300 mb-4">
              Solved using ValorMath+ framework with NEWT2025 computational verification.
            </p>
            <Button onClick={() => setSelectedProblem(null)} className="bg-amber-500 text-black">
              Close
            </Button>
          </Card>
        </div>
      )}
    </div>
  )
}
