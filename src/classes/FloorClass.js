import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import * as THREE from "three"

class FloorClass {
  constructor() {
    this.bind()
    this.modelLoader = new GLTFLoader()
  }

  init(scene) {
    this.scene = scene

    this.modelLoader.load("./assets/models/floor.glb", (glb) => {
      console.log(glb)
      this.scene.add(glb.scene)
    })
  }

  update() {}

  bind() {}
}

const _instance = new FloorClass()
export default _instance
