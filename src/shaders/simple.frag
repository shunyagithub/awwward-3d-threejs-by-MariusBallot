varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vMatCapUV;
uniform float uTime;
uniform sampler2D uTexture;

void main() {
  float time = uTime;

  vec2 uv = vUv;
  vec2 repeat = vec2(6.0, 12.0);
  uv = fract(uv * repeat + vec2(0., time * 0.5));
  
  vec4 color = texture2D(uTexture,  uv);
  color = 1. - color;
  
  gl_FragColor = color;
}