import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import * as THREE from "three"
import MyGUI from "../utils/MyGUI"

import specFrag from "../shaders/spec.frag"
import specVert from "../shaders/spec.vert"

class SpecClass {
  constructor() {
    this.bind()
    this.modelLoader = new GLTFLoader()
    this.textureLoader = new THREE.TextureLoader()
  }

  init(scene) {
    this.scene = scene

    this.uniforms = {
      uMatCap: {
        value: this.textureLoader.load("assets/textures/1.png"),
      },
      uSpecSize: {
        value: 0.6,
      },
      uWaveBorder: {
        value: 0.4,
      },
      uWaveSpeed: {
        value: 0.1,
      },
      uBorderColor: {
        value: new THREE.Color("hsl(250, 80%, 80%)"),
      },
      uTime: {
        value: 0,
      },
    }

    const shaderFolder = MyGUI.addFolder("Spec Folder")
    shaderFolder.open()
    shaderFolder.add(this.uniforms.uSpecSize, "value", -1, 1).name("uSpecSize")
    shaderFolder
      .add(this.uniforms.uWaveBorder, "value", 0, 1)
      .name("uWaveBorder")
    shaderFolder.add(this.uniforms.uWaveSpeed, "value", 0, 1).name("uWaveSpeed")
    // shaderFolder
    //   .add(this.uniforms.uBorderColor, "value", 0, 1)
    //   .name("uBorderColor")

    this.shaderMat = new THREE.ShaderMaterial({
      fragmentShader: specFrag,
      vertexShader: specVert,
      uniforms: this.uniforms,
      transparent: true,
    })

    this.modelLoader.load("./assets/models/spec.glb", (glb) => {
      glb.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) child.material = this.shaderMat
        child.scale.multiplyScalar(1.7)
        child.position.y = -1
      })
      this.scene.add(glb.scene)
    })
  }

  update() {
    this.uniforms.uTime.value += 1
  }

  bind() {}
}

const _instance = new SpecClass()
export default _instance
