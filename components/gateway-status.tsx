"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type GatewayState = "connecting" | "authenticating" | "synchronizing" | "online"

export function GatewayStatus() {
  const [state, setState] = useState<GatewayState>("connecting")
  const [nodeStatus, setNodeStatus] = useState("SAINT PAUL (MN) [Syncing...]")
  const [v0Status, setV0Status] = useState("sfo1::7562b... [Authenticating...]")
  const [assetStatus, setAssetStatus] = useState("[Verifying...]")
  const [assetsVerified, setAssetsVerified] = useState(false)

  useEffect(() => {
    // Simulate authentication
    const timer1 = setTimeout(() => {
      setState("authenticating")
      setV0Status("sfo1::7562b... [Handshake OK]")
    }, 1500)

    // Simulate synchronization
    const timer2 = setTimeout(() => {
      setState("synchronizing")
      setNodeStatus("SAINT PAUL (MN) [Sync OK]")
    }, 2500)

    // Simulate asset verification
    const timer3 = setTimeout(() => {
      setAssetStatus("VERIFIED")
      setAssetsVerified(true)
    }, 3500)

    // Final state: online + dispatch runtime-ready event
    const timer4 = setTimeout(() => {
      setState("online")

      // Emit custom event so other modules can react
      if (typeof window !== "undefined") {
        const detail = {
          timestamp: new Date().toISOString(),
          node: "SAINT_PAUL_GENESIS",
          status: "ONLINE",
          assets: ["DG77.77X", "JAXX"],
          version: "v5152-Ω",
        }
        window.dispatchEvent(new CustomEvent("valorloop:runtime-ready", { detail }))
        console.log("[VALORLOOP] runtime-ready event dispatched", detail)
      }
    }, 4000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
    }
  }, [])

  const getStatusText = () => {
    switch (state) {
      case "connecting":
        return "CONNECTING..."
      case "authenticating":
        return "AUTHENTICATING..."
      case "synchronizing":
        return "SYNCHRONIZING..."
      case "online":
        return "GATEWAY ONLINE"
    }
  }

  const getStatusColor = () => {
    switch (state) {
      case "connecting":
        return "text-amber-400"
      case "authenticating":
      case "synchronizing":
        return "text-blue-400"
      case "online":
        return "text-green-400"
    }
  }

  return (
    <Card className="bg-black border-gray-700 shadow-2xl shadow-blue-500/20">
      <CardHeader className="border-b border-gray-700">
        <CardTitle className="text-3xl font-bold text-white">VALORAIPLUS 14D Core</CardTitle>
        <p className="text-lg text-blue-400">V0 Public Gateway</p>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        {/* Gateway Status */}
        <div className="flex justify-between items-center">
          <span className="text-xl font-medium text-gray-300">Gateway Status:</span>
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                state === "online"
                  ? "bg-green-500 shadow-[0_0_10px_#22c55e,0_0_20px_#22c55e]"
                  : "bg-amber-500 shadow-[0_0_10px_#f59e0b,0_0_20px_#f59e0b] animate-pulse"
              }`}
            />
            <span className={`text-xl font-medium font-mono ${getStatusColor()}`}>{getStatusText()}</span>
          </div>
        </div>

        <hr className="border-gray-700" />

        {/* 14D Node */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">14D Core Node:</span>
          <span
            className={`font-mono ${
              state === "synchronizing" || state === "online" ? "text-gray-200" : "text-gray-500"
            }`}
          >
            {nodeStatus}
          </span>
        </div>

        {/* 3D Interface */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">3D Interface Node (V0):</span>
          <span
            className={`font-mono ${
              state === "authenticating" || state === "synchronizing" || state === "online"
                ? "text-gray-200"
                : "text-gray-500"
            }`}
          >
            {v0Status}
          </span>
        </div>

        <hr className="border-gray-700" />

        {/* Asset Encapsulation */}
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Asset Encapsulation:</span>
          <span className={`font-mono ${assetsVerified ? "text-green-400" : "text-gray-500"}`}>{assetStatus}</span>
        </div>

        {/* Asset Alpha */}
        <div className="flex justify-between items-center pl-6">
          <span className="text-gray-500">Asset Alpha:</span>
          <span className={`font-mono ${assetsVerified ? "text-green-400" : "text-gray-500"}`}>DG77.77X [LOCKED]</span>
        </div>

        {/* Asset Beta */}
        <div className="flex justify-between items-center pl-6">
          <span className="text-gray-500">Asset Beta:</span>
          <span className={`font-mono ${assetsVerified ? "text-green-400" : "text-gray-500"}`}>JAXX [LOCKED]</span>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 pt-4 mt-8 text-center">
          <p className="text-xs text-gray-500">All intellectual property protected globally. VALORAIPLUS ©™.</p>
        </div>
      </CardContent>
    </Card>
  )
}
