import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import * as THREE from "three"
import MyGUI from "../utils/MyGUI"

import specFrag from "../shaders/spec.frag"
import specVert from "../shaders/spec.vert"

import SoundReactor from "./SoundReactor"

import LoadingController from "./LoadingController"

class SpecClass {
  constructor() {
    this.bind()
    this.modelLoader = new GLTFLoader(LoadingController)
    this.textureLoader = new THREE.TextureLoader(LoadingController)
    this.waveColor = {
      color: "#454545",
    }
  }

  init(scene) {
    this.scene = scene

    this.uniforms = {
      uMatCap: {
        value: this.textureLoader.load("assets/textures/2.png"),
      },
      uSpecSize: {
        value: 0.25,
      },
      uWaveBorder: {
        value: 0.5,
      },
      uWaveStep: {
        value: 5,
      },
      uWaveSpeed: {
        value: 0.25,
      },
      uWaveNoise: {
        value: 0.7,
      },
      uBorderColor: {
        value: new THREE.Color(this.waveColor.color),
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
    shaderFolder.add(this.uniforms.uWaveNoise, "value", 0, 1).name("uWaveNoise")
    shaderFolder.add(this.uniforms.uWaveStep, "value", 0, 10).name("uWaveStep")
    shaderFolder.add(this.uniforms.uWaveSpeed, "value", 0, 1).name("uWaveSpeed")
    shaderFolder
      .addColor(this.waveColor, "color")
      .name("uWaveColor")
      .onChange(() =>
        this.uniforms.uBorderColor.value.set(this.waveColor.color)
      )

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
    if (SoundReactor.playFlag) {
      //change spectrum color by soundreactor
      const range = 20
      const fData = SoundReactor.fdata[range] / 255
      this.waveColor.color = new THREE.Color(0.5, 0.8, fData)

      this.uniforms.uBorderColor.value.set(this.waveColor.color)
      this.uniforms.uTime.value += 1
    } else {
      this.uniforms.uTime.value += 1
    }
  }

  bind() {}
}

const _instance = new SpecClass()
export default _instance
