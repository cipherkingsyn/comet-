import * as THREE from 'three';

export class BallAnimation {
  private ball: THREE.Mesh;
  private time: number = 0;
  private basePosition: THREE.Vector3;

  constructor(ball: THREE.Mesh) {
    this.ball = ball;
    this.basePosition = ball.position.clone();
  }

  update() {
    this.time += 0.016;
    
    // Floating motion
    this.ball.position.y = this.basePosition.y + Math.sin(this.time) * 0.2;
    
    // Gentle rotation
    this.ball.rotation.x += 0.001;
    this.ball.rotation.y += 0.002;
    
    // Subtle wobble
    this.ball.scale.x = 1 + Math.sin(this.time * 2) * 0.02;
    this.ball.scale.y = 1 + Math.sin(this.time * 2 + Math.PI) * 0.02;
  }
}