"use client";
// valoraiplus//e :: AMath+++ 3D Core Module v.OMEGA_VALORCHAIN

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import styles from "@/app/page.module.css";

interface Core3DProps {
  monitorRef: React.RefObject<HTMLDivElement>;
  isPaused: boolean;
  setRenderer: (renderer: THREE.WebGLRenderer | null) => void;
  isARMode: boolean;
}

export default function Core3D({ monitorRef, isPaused, setRenderer, isARMode }: Core3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null); // Ref for controls
  const sceneRef = useRef<THREE.Scene | null>(null); // Ref for scene access
  const coreMeshRef = useRef<THREE.Mesh | null>(null); // Ref for core mesh
  const reticleRef = useRef<THREE.Mesh | null>(null); // Ref for AR reticle
  const hitTestSourceRef = useRef<XRHitTestSource | null>(null); // Ref for hit test source

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize Renderer only once
    if (!rendererRef.current) {
        // Use WebGL2 context
        const context = canvas.getContext('webgl2', { antialias: true, alpha: true }) || canvas.getContext('webgl', { antialias: true, alpha: true });
        if (!context) {
            console.error("WebGL2/WebGL context not available");
            return;
        }
        const renderer = new THREE.WebGLRenderer({
            canvas,
            context,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance" // Request high performance
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.xr.enabled = true;
        rendererRef.current = renderer;
        setRenderer(renderer);
    }
    const renderer = rendererRef.current;
    sceneRef.current = new THREE.Scene(); // Initialize sceneRef
    const scene = sceneRef.current;

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    camera.position.z = 5; // Adjust camera position for AR scale

    // OrbitControls for non-AR
    if (!controlsRef.current) {
        controlsRef.current = new OrbitControls(camera, renderer.domElement);
        controlsRef.current.enableDamping = true;
        controlsRef.current.minDistance = 2; // Set min/max zoom
        controlsRef.current.maxDistance = 10;
    }
    const controls = controlsRef.current;

    // --- Core Geometry & Material ---
    const coreGeometry = new THREE.TorusKnotGeometry(1, 0.1, 100, 16, 2, 3); // Scaled down for AR
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 1.5, // Add environment map intensity
      transmission: 0.5, // Add some transparency/refraction
      ior: 1.5
    });

    // WebGL2 Shader Enhancement (GLSL 300 es)
    coreMaterial.onBeforeCompile = (shader) => {
        shader.vertexShader = '#version 300 es\n' + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
          '#include <common>',
          '#include <common>\nuniform float uTime;\nout float vPulse;\n'
        );
        shader.vertexShader = shader.vertexShader.replace(
            '#include <begin_vertex>',
            '#include <begin_vertex>\n' +
            // More subtle displacement
            '   float displacement = sin(position.y * 8.0 + uTime * 3.0) * 0.05;' +
            '   transformed += normalize(normal) * displacement;' +
            '   vPulse = smoothstep(0.0, 1.0, sin(uTime * 4.0) * 0.5 + 0.5);' // Smoother pulse
        );

        shader.fragmentShader = '#version 300 es\nprecision highp float;\n' + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <common>',
          '#include <common>\nuniform float uTime;\nin float vPulse;\n'
        );
        // Use vPulse for emissive intensity and color modulation
        shader.fragmentShader = shader.fragmentShader.replace(
            'vec4 diffuseColor = vec4( diffuse, opacity );',
            'vec3 baseColor = diffuse * (0.6 + vPulse * 0.4);' + // Modulate base color
            'vec3 emissiveColor = vec3(0.0, 0.8, 0.8) * vPulse * 0.5;' + // Add cyan emissive glow
            'vec4 diffuseColor = vec4( baseColor + emissiveColor, opacity );'
        );

        // Add custom uniforms to the shader and store a reference for updates
        shader.uniforms.uTime = { value: 0 };
        coreMaterial.userData.uniforms = shader.uniforms;
      };

    coreMeshRef.current = new THREE.Mesh(coreGeometry, coreMaterial); // Assign to ref
    const coreMesh = coreMeshRef.current;
    scene.add(coreMesh);

    // Inner Ring
    const innerRing = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.85, 0.08, 80, 12, 3, 4), // Scaled down
      new THREE.MeshPhysicalMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2, emissive: 0xcc8400, emissiveIntensity: 0.3 })
    );
    scene.add(innerRing);

    // Lighting (Adjusted for PBR)
    scene.add(new THREE.AmbientLight(0x666666));
    const pointLight = new THREE.PointLight(0xffffff, 0.8, 100);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(-2, -1, -3);
    scene.add(dirLight);

    // --- AR Specific Setup ---
    reticleRef.current = new THREE.Mesh(
        new THREE.RingGeometry(0.05, 0.06, 32).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0x00ffff })
    );
    const reticle = reticleRef.current;
    reticle.matrixAutoUpdate = false;
    reticle.visible = false;
    scene.add(reticle);

    const controller = renderer.xr.getController(0); // Get XR controller
    controller.addEventListener('select', onSelect); // Add select event listener
    scene.add(controller);

    // Function to handle AR placement
    function onSelect() {
        if (reticle.visible && coreMesh) {
            coreMesh.position.setFromMatrixPosition(reticle.matrix);
            innerRing.position.copy(coreMesh.position); // Place ring with core
            // Optional: Scale based on distance or other factors
            coreMesh.visible = true; // Make core visible after placement
            innerRing.visible = true;
        }
    }

    // --- Interaction Logic ---
    let dragStart = { x: 0, y: 0, touchId: null as number | null };
    let isDragging = false;
    const clock = new THREE.Clock();

    renderer.setAnimationLoop((timestamp, frame?: XRFrame) => { // Receive XRFrame
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      controls.enabled = !isARMode;
      if(controls.enabled) controls.update(); // Only update if enabled

      // Update shader time uniform
      if (coreMaterial.userData.uniforms && coreMaterial.userData.uniforms.uTime) {
         coreMaterial.userData.uniforms.uTime.value = time;
      }

      if (!isPaused && !isDragging) {
        coreMesh.rotation.y += delta * 0.5;
        innerRing.rotation.y -= delta * 0.7;
      }

      // --- AR Hit Test Logic ---
      if (isARMode && frame) {
          coreMesh.visible = false; // Hide core until placed
          innerRing.visible = false;
          const referenceSpace = renderer.xr.getReferenceSpace();
          const session = renderer.xr.getSession();

          if (hitTestSourceRef.current && referenceSpace) {
              const hitTestResults = frame.getHitTestResults(hitTestSourceRef.current);
              if (hitTestResults.length > 0) {
                  const hit = hitTestResults[0];
                  const pose = hit.getPose(referenceSpace);
                  if (pose) {
                      reticle.visible = true;
                      reticle.matrix.fromArray(pose.transform.matrix);
                  }
              } else {
                  reticle.visible = false;
              }
          } else if (session && !hitTestSourceRef.current) {
              // Request hit test source if not already available
              session.requestReferenceSpace('viewer').then((viewerSpace) => {
                  session.requestHitTestSource?.({ space: viewerSpace })?.then((source) => {
                      hitTestSourceRef.current = source;
                  }).catch(e => console.error("Error requesting hit test source:", e));
              }).catch(e => console.error("Error requesting viewer space:", e));
          }
      } else {
          reticle.visible = false; // Hide reticle outside AR
          // Ensure core is visible in non-AR mode if it was ever hidden
          if (!coreMesh.visible) coreMesh.visible = true;
          if (!innerRing.visible) innerRing.visible = true;
      }

      renderer.render(scene, camera);
    });

    // --- Resize Logic ---
    function resize() {
      const parentElement = isARMode ? renderer.domElement : canvas?.parentElement; // Adjust parent based on mode
      if (!parentElement) return;

      const width = parentElement.clientWidth;
      const height = parentElement.clientHeight;

      // Only resize renderer if not in XR session (XR handles this)
      if (!renderer.xr.isPresenting) {
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
      }
    }
    resize(); // Initial resize

    // --- Event Listeners ---
    // (Combine touch and mouse for simplicity)
    const handlePointerDown = (e: PointerEvent) => {
        if (isARMode || e.pointerType === 'touch' && e.pointerId !== dragStart.touchId && dragStart.touchId !== null) return; // Ignore secondary touches/mouse in AR
        isDragging = true;
        dragStart.x = e.clientX;
        dragStart.y = e.clientY;
        dragStart.touchId = e.pointerId; // Use pointerId
        canvas.setPointerCapture(e.pointerId); // Capture pointer
    };
    const handlePointerMove = (e: PointerEvent) => {
        if (!isDragging || e.pointerId !== dragStart.touchId) return;
        const dx = (e.clientX - dragStart.x) * 0.01; // Adjust sensitivity
        const dy = (e.clientY - dragStart.y) * 0.01;
        coreMesh.rotation.y += dx;
        coreMesh.rotation.x += dy;
        innerRing.rotation.y -= dx;
        innerRing.rotation.x -= dy;
        dragStart.x = e.clientX;
        dragStart.y = e.clientY;
    };
    const handlePointerUp = (e: PointerEvent) => {
        if(e.pointerId === dragStart.touchId) {
            isDragging = false;
            dragStart.touchId = null;
            canvas.releasePointerCapture(e.pointerId); // Release pointer
        }
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerup', handlePointerUp);
    canvas.addEventListener('pointercancel', handlePointerUp); // Handle cancel event

    // Keyboard listener remains the same
    const handleKeyDown = (e: KeyboardEvent) => { if (e.code === 'Space') isPaused = !isPaused; };
    document.addEventListener('keydown', handleKeyDown);

    // Resize listener
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(resize, 100);
    };
    window.addEventListener('resize', handleResize);


    // --- Cleanup ---
    return () => {
      renderer.setAnimationLoop(null);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerup', handlePointerUp);
      canvas.removeEventListener('pointercancel', handlePointerUp);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      // Clean up hit test source if it exists
      hitTestSourceRef.current?.cancel();
      hitTestSourceRef.current = null;
      // Do not dispose renderer here, managed by parent for ARButton
    };
  }, [monitorRef, isPaused, setRenderer, isARMode]); // Dependencies

  return <canvas ref={canvasRef} className={styles.coreCanvas} valoraiplus_module_id="CORE_3D_CANVAS_001" />;
}