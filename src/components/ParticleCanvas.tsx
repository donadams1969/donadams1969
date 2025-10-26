"use client";
// valoraiplus//e :: Particle Canvas Module v.OMEGA_VALORCHAIN

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use WebGL2 context if available
    const context = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!context) {
        console.error("WebGL2/WebGL not supported");
        return;
    }

    const renderer = new THREE.WebGLRenderer({ canvas, context, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    const scene = new THREE.Scene();
    // Orthographic camera for 2D effect
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 2); // Store vx, vy
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * window.innerWidth / (window.innerHeight / 2); // Adjust aspect ratio
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2;
      positions[i * 3 + 2] = 0;
      velocities[i * 2] = (Math.random() - 0.5) * 0.0003; // vx (slower)
      velocities[i * 2 + 1] = (Math.random() - 0.5) * 0.0003; // vy (slower)
      sizes[i] = Math.random() * 2.5 + 1.0; // Slightly larger
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 2)); // Add velocity attribute
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const clock = new THREE.Clock(); // Use THREE Clock

    // GLSL 300 es Shaders (WebGL2)
    const vertexShader = `#version 300 es
      uniform float uTime;
      uniform float uAspect; // Aspect ratio uniform

      in vec3 position;
      in vec2 velocity; // Receive velocity
      in float size;

      out float vOpacity; // Pass opacity to fragment shader

      void main() {
        vec3 pos = position;
        // Simple physics simulation in vertex shader
        pos.xy += velocity * uTime * 20.0; // Apply velocity over time
        // Wrap around screen edges
        pos.x = mod(pos.x + uAspect, uAspect * 2.0) - uAspect;
        pos.y = mod(pos.y + 1.0, 2.0) - 1.0;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = size * (20.0 / -mvPosition.z); // Adjust size based on distance (ortho)
        vOpacity = 0.3 + sin(uTime * 0.5 + position.x * 5.0) * 0.1; // Vary opacity slightly
      }
    `;
    const fragmentShader = `#version 300 es
      precision highp float;
      in float vOpacity;
      out vec4 fragColor;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        fragColor = vec4(0.0, 1.0, 1.0, vOpacity * (1.0 - dist * 2.0)); // Use vOpacity
      }
    `;

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0.0 },
            uAspect: { value: window.innerWidth / window.innerHeight } // Pass aspect ratio
        },
        vertexShader,
        fragmentShader,
        transparent: true,
        blending: THREE.AdditiveBlending, // Additive blending for glow
        depthWrite: false // Disable depth write for particles
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    renderer.setAnimationLoop(() => {
        const elapsedTime = clock.getElapsedTime();
        material.uniforms.uTime.value = elapsedTime;

        renderer.render(scene, camera);
    });

    const resize = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);

        // Update orthographic camera bounds
        const aspect = width / height;
        camera.left = -aspect;
        camera.right = aspect;
        camera.top = 1;
        camera.bottom = -1;
        camera.updateProjectionMatrix();
        material.uniforms.uAspect.value = aspect; // Update aspect ratio uniform
    };
    resize();
    window.addEventListener('resize', resize);

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener('resize', resize);
      renderer.dispose(); // Clean up renderer resources
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} valoraiplus_module_id="PARTICLE_CANVAS_001" />; // Changed zIndex to -1
}