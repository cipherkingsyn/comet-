uniform float time;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
    // Base color (white)
    vec3 baseColor = vec3(1.0);
    
    // Fresnel effect for edge glow
    float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
    
    // Pulsing glow
    float pulse = sin(time * 2.0) * 0.5 + 0.5;
    
    // Combine effects
    vec3 glowColor = baseColor + vec3(0.5, 0.7, 1.0) * fresnel * pulse;
    
    // Add some variation based on position
    float positionGlow = sin(vWorldPosition.x * 2.0 + time) * 0.5 + 0.5;
    glowColor += vec3(0.2, 0.3, 0.4) * positionGlow;
    
    gl_FragColor = vec4(glowColor, 1.0);
}