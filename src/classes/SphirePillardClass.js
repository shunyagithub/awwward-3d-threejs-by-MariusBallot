import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import * as THREE from "three"

class SphirePillardClass {
  constructor() {
    this.bind()
    this.modelLoader = new GLTFLoader()
    this.textureLoader = new THREE.TextureLoader()
  }

  init(scene) {
    this.scene = scene

    const gTex = this.textureLoader.load("./assets/textures/1.png")
    const bTex = this.textureLoader.load("./assets/textures/2.png")

    this.gMatCap = new THREE.MeshMatcapMaterial({
      matcap: gTex,
    })
    this.bMatCap = new THREE.MeshMatcapMaterial({
      matcap: bTex,
    })

    this.modelLoader.load("./assets/models/pillard.glb", (glb) => {
      console.log(glb)
      glb.scene.traverse((child) => {
        if (child.name == "Base") child.material = this.bMatCap
        if (child.name == "Cylinder") child.material = this.gMatCap
      })
      this.scene.add(glb.scene)
    })
  }

  update() {}

  bind() {}
}

const _instance = new SphirePillardClass()
export default _instance
