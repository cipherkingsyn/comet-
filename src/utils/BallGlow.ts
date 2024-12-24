import * as THREE from 'three';

export class BallGlow {
  mesh: THREE.Mesh;

  constructor(radius: number) {
    const geometry = new THREE.SphereGeometry(radius * 1.2, 64, 64);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          vec3 glow = vec3(1.0, 1.0, 1.0) * intensity * (0.8 + 0.2 * sin(time * 2.0));
          gl_FragColor = vec4(glow, intensity * 0.5);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    this.mesh = new THREE.Mesh(geometry, material);
  }

  update(time: number) {
    if (this.mesh.material instanceof THREE.ShaderMaterial) {
      this.mesh.material.uniforms.time.value = time;
    }
  }
}