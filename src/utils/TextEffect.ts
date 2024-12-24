import * as THREE from 'three';

export class TextEffect {
  scene: THREE.Scene;
  text: string;
  textMesh: THREE.Mesh | null = null;
  private textCanvas: HTMLCanvasElement;
  private textContext: CanvasRenderingContext2D | null;

  constructor(text: string, scene: THREE.Scene) {
    this.text = text;
    this.scene = scene;
    this.textCanvas = document.createElement('canvas');
    this.textContext = this.textCanvas.getContext('2d');
  }

  init() {
    if (!this.textContext) return;

    // Set canvas size
    this.textCanvas.width = 1024;
    this.textCanvas.height = 128;

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(this.textCanvas);
    texture.needsUpdate = true;

    // Create material with the texture
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });

    // Create plane geometry for the text
    const geometry = new THREE.PlaneGeometry(4, 0.5);
    this.textMesh = new THREE.Mesh(geometry, material);
    this.textMesh.position.z = 1;
    this.scene.add(this.textMesh);

    // Initial render of text
    this.renderText('white');
  }

  private renderText(color: string) {
    if (!this.textContext) return;

    // Clear canvas
    this.textContext.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);

    // Configure text style
    this.textContext.fillStyle = color;
    this.textContext.font = 'bold 80px Arial';
    this.textContext.textAlign = 'center';
    this.textContext.textBaseline = 'middle';
    
    // Draw text
    this.textContext.fillText(this.text, this.textCanvas.width / 2, this.textCanvas.height / 2);

    // Update texture
    if (this.textMesh?.material instanceof THREE.MeshBasicMaterial && this.textMesh.material.map) {
      this.textMesh.material.map.needsUpdate = true;
    }
  }

  update(ballPosition: THREE.Vector3) {
    if (!this.textMesh) return;

    // Calculate distance between text and ball
    const distance = this.textMesh.position.distanceTo(ballPosition);
    
    // Update text color based on distance
    if (distance < 1.5) {
      this.renderText('black');
    } else {
      this.renderText('white');
    }
  }
}