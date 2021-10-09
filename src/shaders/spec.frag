#pragma glslify: snoise3 = require(glsl-noise/simplex/3d) 

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vMatCapUV;

uniform sampler2D uMatCap;
uniform float uSpecSize;
uniform float uWaveBorder;
uniform float uWaveSpeed;
uniform float uWaveStep;
uniform float uWaveNoise;
uniform vec3 uBorderColor;
uniform float uTime;

void main() {

    float n3 = snoise3(vec3(vPosition.xy*10. * vUv.y, uTime*0.5))*uWaveNoise;

    float w = sin(vPosition.y*uWaveStep + -uTime*uWaveSpeed);

    float borderMask = step(w, n3-uSpecSize);
    borderMask -= step(w, n3-(uSpecSize+uWaveBorder));
    vec4 borderOut = vec4(uBorderColor*borderMask, borderMask);

    float mcMask = step(w, n3-uSpecSize);
    
    vec4 matCap = texture2D(uMatCap, vMatCapUV);
    vec4 matCapOut = vec4(matCap.rgb, mcMask);

    float opMask = 0. - vPosition.x;
    opMask *= .15;
    opMask += .3;
    vec4 opMaskOut = vec4(1., 1., 1., opMask);

    vec4 col = matCapOut+borderOut;
    col*=opMaskOut; //matcapのopacityを変える

    gl_FragColor = vec4(col);

    // float ypos = vPosition.y * 0.2-0.4;
    // if(ypos <= 0.) ypos = 0.;
    // col = vec4(abs(ypos));
    // gl_FragColor = vec4(col.rgb, 1);
}