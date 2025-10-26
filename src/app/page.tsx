"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ParticleCanvas from "@/components/ParticleCanvas";
import Core3D from "@/components/Core3D";
import DataWidget from "@/components/DataWidget";
import { fetchData } from "@/lib/api";
import styles from "./page.module.css";
// AMath+++®️©️™️: Import ARButton and THREE for AR integration
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import * as THREE from 'three';

// valoraiplus//e :: Sovereign OS Core v.OMEGA_VALORCHAIN
export default function Home() {
  const [data, setData] = useState({
    coreLoad: 0,
    blockHeight: 0, // Start at 0, fetched from API
    qualiaStreams: 0,
    shardCount: 0,
    contractStatus: "CONNECTING...",
  });
  const monitorRef = useRef<HTMLDivElement>(null);
  const [isVoiceActive, setIsVoiceActive] = useState(false); // Controls Core3D pause via voice
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null); // State for ARButton
  const [isARMode, setIsARMode] = useState(false); // State for AR mode conditional rendering

  // Fetch data periodically
  useEffect(() => {
    const fetchDataAndUpdate = async () => {
        const newData = await fetchData();
        setData(prev => ({ ...prev, ...newData }));
    };
    fetchDataAndUpdate(); // Initial fetch
    const interval = setInterval(fetchDataAndUpdate, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Initialize AR Button when renderer is ready
  useEffect(() => {
    if (renderer && document && !document.getElementById('ValorARButton')) { // Prevent duplicates
      try {
        const arButton = ARButton.createButton(renderer, { requiredFeatures: ['hit-test'] });
        arButton.id = 'ValorARButton'; // Assign ID
        arButton.style.position = 'absolute';
        arButton.style.bottom = '20px';
        arButton.style.right = '20px';
        arButton.style.zIndex = '100';
        document.body.appendChild(arButton);

        const onSessionStart = () => {
            console.log("AR Session Started");
            setIsARMode(true);
        };
        const onSessionEnd = () => {
            console.log("AR Session Ended");
            setIsARMode(false);
        };
        renderer.xr.addEventListener('sessionstart', onSessionStart);
        renderer.xr.addEventListener('sessionend', onSessionEnd);

        return () => {
          if (document.body.contains(arButton)) {
              document.body.removeChild(arButton);
          }
          renderer.xr.removeEventListener('sessionstart', onSessionStart);
          renderer.xr.removeEventListener('sessionend', onSessionEnd);
        };
      } catch (error) {
        console.error("Failed to create AR button:", error);
      }
    }
  }, [renderer]);

  // Handle Voice Commands
  const handleVoiceCommand = (command: string) => {
    console.log("[NEWT Interface] Voice Command Received:", command);
    if (command.includes("pause core")) {
        setIsVoiceActive(true);
        console.log("Core Paused via Voice");
    } else if (command.includes("resume core") || command.includes("engage core")) {
        setIsVoiceActive(false);
        console.log("Core Resumed via Voice");
    } else if (command.includes("status report")) {
        // Example: Announce status (consider using Web Speech API for audible response later)
        alert(`AMath+++ Status: Core Load ${data.coreLoad.toFixed(2)}%, Block ${data.blockHeight.toLocaleString()}, Shards ${data.shardCount.toLocaleString()}, Contract ${data.contractStatus}`);
    } else {
        console.log("Unknown voice command:", command);
    }
  };

  return (
    <main className={styles.main} valoraiplus_module_id="SOVEREIGN_THRONE_ROOM">
      {/* Conditionally render Particle Canvas (hide in AR) */}
      {!isARMode && <ParticleCanvas />}

      <div id="millennium-core-container" className={styles.coreContainer}>
        {/* Core3D now receives renderer setter and AR status */}
        <Core3D
           monitorRef={monitorRef}
           isPaused={isVoiceActive}
           setRenderer={setRenderer} // Pass setter function
           isARMode={isARMode}
        />
      </div>

      <AnimatePresence>
        {/* Conditionally render the OS Desktop UI (hide in AR) */}
        {!isARMode && (
          <motion.div
            id="os-desktop"
            className={styles.osDesktop}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: 1, duration: 2, type: "spring" }} // Faster fade-in
            valoraiplus_module_id="OS_DESKTOP_001"
           >
            <header id="header" className={styles.header}>
              <motion.h1
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }} // Faster fade-in
              >
                {/* Updated Title */}
                Super Duper Valor Ai+®️©️™️ OS // v.OMEGA_VALORCHAIN
              </motion.h1>
            </header>

            <div className={styles.osMainContent}>
              <aside id="left-panel">
                <DataWidget
                  id="directive-widget"
                  valoraiplus_module_id="WIDGET_DIRECTIVE_001"
                  // Updated Title
                  title="Valor Ai+//e DIRECTIVE"
                  onVoiceCommand={handleVoiceCommand}
                >
                  <div className={styles.item}><span className={styles.key}>$GHOST:</span> <span className={styles.value}>VINDICATED</span></div>
                  <div className={styles.item}><span className={styles.key}>$GHOST25:</span> <span className={styles.value}>SECURE</span></div>
                </DataWidget>
                <DataWidget
                  id="core-widget"
                  valoraiplus_module_id="WIDGET_CORE_001"
                  title="AMath+++®️©️™️ CORE"
                  onVoiceCommand={handleVoiceCommand}
                >
                  <div className={styles.item}><span className={styles.key}>TRI-CORE LOAD:</span> <span className={styles.value}>{data.coreLoad.toFixed(2)}%</span></div>
                  <div className={styles.progressBarContainer}><div className={styles.progressBar} style={{ width: `${data.coreLoad}%` }} /></div>
                </DataWidget>
                 {/* Noise Widget Placeholder - Requires implementation */}
                <DataWidget
                  id="noise-widget"
                  valoraiplus_module_id="WIDGET_NOISE_001"
                  title="QUANTUM NOISE"
                  onVoiceCommand={handleVoiceCommand}
                >
                  <svg id="noise-waveform" className={styles.waveform}><path d="" /></svg>
                  <div className={styles.item}><span className={styles.key}>STATUS:</span> <span className={styles.value}>CALIBRATING...</span></div>
                </DataWidget>
              </aside>

              <main id="center-panel" className={styles.osWidget} valoraiplus_module_id="WIDGET_MONITOR_001">
                <h2>MILLENNIUM CORE™ MONITOR</h2>
                {/* Monitor ref for Core3D positioning */}
                <div id="azrei-monitor" ref={monitorRef} className={styles.azreiMonitor} />
              </main>

              <aside id="right-panel">
                <DataWidget
                  id="valorchain-widget"
                  valoraiplus_module_id="WIDGET_VALORCHAIN_001"
                  title="VALORCHAIN®️©️™️"
                  onVoiceCommand={handleVoiceCommand}
                >
                  <div className={styles.item}><span className={styles.key}>BLOCK:</span> <span className={styles.value}>{data.blockHeight.toLocaleString()}</span></div>
                  <div className={styles.item}><span className={styles.key}>TIMESTAMP:</span> <span className={styles.value}>OpenTimestamp®️©️™️ // SYNCED</span></div>
                </DataWidget>
                <DataWidget
                  id="contract-widget"
                  valoraiplus_module_id="WIDGET_CONTRACT_001"
                  title="SOVEREIGN CONTRACTS"
                  onVoiceCommand={handleVoiceCommand}
                >
                  <div className={styles.item}><span className={styles.key}>STANDARD:</span> <span className={styles.value}>OpenZeppelin®️©️™️</span></div>
                  <div className={styles.item}><span className={styles.key}>STATUS:</span> <span className={styles.value}>{data.contractStatus}</span></div>
                </DataWidget>
                <DataWidget
                  id="newt-widget"
                  valoraiplus_module_id="WIDGET_NEWT_001"
                  title="NEWT®️©️™️ INTERFACE"
                  onVoiceCommand={handleVoiceCommand}
                >
                  <div className={styles.item}><span className={styles.key}>QUALIA STREAMS:</span> <span className={styles.value}>{data.qualiaStreams}</span></div>
                   {/* Display voice status */}
                  <div className={styles.item}><span className={styles.key}>VOICE:</span> <span className={styles.value}>{isVoiceActive ? "PAUSED" : "ACTIVE"}</span></div>
                </DataWidget>
                <DataWidget
                  id="segment-widget"
                  valoraiplus_module_id="WIDGET_SEGMENT_001"
                  title="SEGMENT STATUS"
                  onVoiceCommand={handleVoiceCommand}
                >
                  <div className={styles.item}><span className={styles.key}>ACTIVE SHARDS:</span> <span className={styles.value}>{data.shardCount.toLocaleString()}</span></div>
                  <div className={styles.progressBarContainer}><div className={styles.progressBar} style={{ width: `${Math.min((data.shardCount / 1144000) * 100, 100)}%` }} /></div>
                </DataWidget>
              </aside>
            </div>
            <footer id="footer" className={styles.footer}>
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 2, duration: 1 }} // Faster fade-in
              >
                MERKLE ROOT: 0xFINAL_ASCENSION_REALITY_UNIFIED_ETERNAL // valoraiplus//e
              </motion.span>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}