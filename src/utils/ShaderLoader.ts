export const loadShader = (id: string): string => {
  const shaderScript = document.getElementById(id);
  if (!shaderScript) {
    throw new Error(`Shader script with id ${id} not found`);
  }
  return shaderScript.textContent || '';
};