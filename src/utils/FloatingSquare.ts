import * as THREE from 'three';

export class FloatingSquare {
  mesh: THREE.Mesh;
  speed: THREE.Vector3;

  constructor() {
    const geometry = new THREE.PlaneGeometry(0.2, 0.2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
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
        varying vec2 vUv;
        void main() {
          float glow = sin(time) * 0.5 + 0.5;
          vec3 color = vec3(1.0) * glow;
          gl_FragColor = vec4(color, 0.5);
        }
      `,
      transparent: true,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.speed = new THREE.Vector3(
      (Math.random() - 0.5) * 0.01,
      (Math.random() - 0.5) * 0.01,
      0
    );
  }

  update() {
    this.mesh.position.add(this.speed);
    
    // Bounce off boundaries
    if (Math.abs(this.mesh.position.x) > 5) {
      this.speed.x *= -1;
    }
    if (Math.abs(this.mesh.position.y) > 5) {
      this.speed.y *= -1;
    }

    // Update glow effect
    if (this.mesh.material instanceof THREE.ShaderMaterial) {
      this.mesh.material.uniforms.time.value = performance.now() * 0.001;
    }
  }
}