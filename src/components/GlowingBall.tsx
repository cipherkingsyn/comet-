import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FloatingSquare } from '../utils/FloatingSquare';
import { TextEffect } from '../utils/TextEffect';
import { SmokeParticle } from '../utils/SmokeParticle';
import { BallAnimation } from '../utils/BallAnimation';
import { BallGlow } from '../utils/BallGlow';

interface GlowingBallProps {
  text: string;
}

export function GlowingBall({ text }: GlowingBallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);
  const ballGlowRef = useRef<BallGlow | null>(null);
  const squaresRef = useRef<FloatingSquare[]>([]);
  const smokeParticlesRef = useRef<SmokeParticle[]>([]);
  const ballAnimationRef = useRef<BallAnimation | null>(null);
  const lastParticleTimeRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer setup with HDR
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Glowing ball setup with larger size
    const ballGeometry = new THREE.SphereGeometry(1.5, 64, 64);
    const ballMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        void main() {
          vec3 baseColor = vec3(1.0);
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          float pulse = sin(time * 2.0) * 0.5 + 0.5;
          vec3 glowColor = baseColor + vec3(0.5, 0.7, 1.0) * fresnel * pulse;
          float positionGlow = sin(vWorldPosition.x * 2.0 + time) * 0.5 + 0.5;
          glowColor += vec3(0.2, 0.3, 0.4) * positionGlow;
          gl_FragColor = vec4(glowColor, 1.0);
        }
      `,
      transparent: true,
    });

    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ball);
    ballRef.current = ball;

    // Add ball glow effect
    const ballGlow = new BallGlow(1.5);
    scene.add(ballGlow.mesh);
    ballGlowRef.current = ballGlow;
    
    // Initialize ball animation
    ballAnimationRef.current = new BallAnimation(ball);

    // Create floating squares
    for (let i = 0; i < 20; i++) {
      const square = new FloatingSquare();
      square.mesh.position.set(
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 2 - 3
      );
      scene.add(square.mesh);
      squaresRef.current.push(square);
    }

    // Text effect
    const textEffect = new TextEffect(text, scene);
    textEffect.init();

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const time = performance.now() * 0.001;
      
      // Update ball glow
      if (ballMaterial.uniforms) {
        ballMaterial.uniforms.time.value = time;
      }

      // Update ball animation
      ballAnimationRef.current?.update();

      // Update ball glow
      ballGlowRef.current?.update(time);
      if (ballGlowRef.current) {
        ballGlowRef.current.mesh.position.copy(ball.position);
      }

      // Update smoke particles with increased generation rate
      const currentTime = performance.now();
      if (currentTime - lastParticleTimeRef.current > 50) { // Generate particles every 50ms
        const particle = new SmokeParticle();
        particle.mesh.position.copy(ball.position);
        particle.mesh.position.z -= 0.5;
        scene.add(particle.mesh);
        smokeParticlesRef.current.push(particle);
        lastParticleTimeRef.current = currentTime;
      }

      // Update existing particles
      smokeParticlesRef.current = smokeParticlesRef.current.filter(particle => {
        particle.update();
        if (particle.isDead()) {
          scene.remove(particle.mesh);
          return false;
        }
        return true;
      });

      // Update floating squares
      squaresRef.current.forEach(square => square.update());

      // Update text effect
      textEffect.update(ball.position);

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [text]);

  return <div ref={containerRef} className="fixed inset-0" />;
}