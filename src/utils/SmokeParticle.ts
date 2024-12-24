import * as THREE from 'three';

export class SmokeParticle {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  life: number;
  maxLife: number;

  constructor() {
    // Create rounded square geometry
    const roundedSquare = new THREE.Shape();
    const size = 0.5;
    const radius = 0.15;
    
    roundedSquare.moveTo(-size + radius, -size);
    roundedSquare.lineTo(size - radius, -size);
    roundedSquare.quadraticCurveTo(size, -size, size, -size + radius);
    roundedSquare.lineTo(size, size - radius);
    roundedSquare.quadraticCurveTo(size, size, size - radius, size);
    roundedSquare.lineTo(-size + radius, size);
    roundedSquare.quadraticCurveTo(-size, size, -size, size - radius);
    roundedSquare.lineTo(-size, -size + radius);
    roundedSquare.quadraticCurveTo(-size, -size, -size + radius, -size);

    const geometry = new THREE.ShapeGeometry(roundedSquare);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        opacity: { value: 0.2 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float opacity;
        varying vec2 vUv;
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = length(vUv - center);
          float alpha = smoothstep(0.5, 0.2, dist) * opacity;
          vec3 color = vec3(0.5, 0.5, 0.5);
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.03,
      (Math.random() - 0.5) * 0.03,
      -0.02
    );
    this.maxLife = 3 + Math.random() * 2;
    this.life = this.maxLife;
  }

  update() {
    this.mesh.position.add(this.velocity);
    this.life -= 0.016;

    if (this.mesh.material instanceof THREE.ShaderMaterial) {
      this.mesh.material.uniforms.time.value = performance.now() * 0.001;
      this.mesh.material.uniforms.opacity.value = (this.life / this.maxLife) * 0.2;
    }

    // Add swirling motion and scale
    this.mesh.rotation.z += 0.01;
    this.mesh.scale.multiplyScalar(1.004);
    
    // Add some turbulence
    this.velocity.x += (Math.random() - 0.5) * 0.001;
    this.velocity.y += (Math.random() - 0.5) * 0.001;
  }

  isDead(): boolean {
    return this.life <= 0;
  }
}