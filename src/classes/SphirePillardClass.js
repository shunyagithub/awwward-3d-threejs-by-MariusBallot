import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import * as THREE from "three"
import MyGUI from "../utils/MyGUI"

import LoadingController from "./LoadingController"

class SphirePillardClass {
  constructor() {
    this.bind()
    this.modelLoader = new GLTFLoader(LoadingController)
    this.textureLoader = new THREE.TextureLoader(LoadingController)
    this.params = {
      waveSpeed: 1,
      subDiv: 3,
      pillardSize: 0.2,
    }
  }

  init(scene) {
    this.scene = scene
    this.upVec = new THREE.Vector3(0, 1, 0)
    this.pillards = new THREE.Group()
    this.pillard

    const gTex = this.textureLoader.load("./assets/textures/1.png")
    const bTex = this.textureLoader.load("./assets/textures/2.png")

    this.gMatCap = new THREE.MeshMatcapMaterial({
      matcap: gTex,
    })
    this.bMatCap = new THREE.MeshMatcapMaterial({
      matcap: bTex,
    })

    this.modelLoader.load("./assets/models/pillard.glb", (glb) => {
      glb.scene.traverse((child) => {
        if (child.name == "Base") {
          this.pillard = child
          child.material = this.bMatCap
        }
        if (child.name == "Cylinder") child.material = this.gMatCap
      })
      this.computePositions()
    })

    const sphereFolder = MyGUI.addFolder("Sphere Pillards")
    sphereFolder.open()
    sphereFolder.add(this.params, "waveSpeed", 0.001, 3).name("Wave Speed")
    sphereFolder
      .add(this.params, "subDiv", 1, 5)
      .step(1)
      .name("Ico Subdivition")
      .onChange(this.computePositions)
    sphereFolder
      .add(this.params, "pillardSize", 0.01, 1)
      .name("pillard Size")
      .onChange(this.computePositions)
  }

  computePositions() {
    // this.scene.add(this.pillard)
    let ico
    this.scene.traverse((child) => {
      if (child.name == "ico") {
        ico = child
      }
    })

    if (ico) this.scene.remove(ico)

    const sphereGeom = new THREE.IcosahedronGeometry(2, this.params.subDiv)
    const sphereMat = this.gMatCap
    const sphere = new THREE.Mesh(
      sphereGeom,
      sphereMat
      // new THREE.MeshNormalMaterial({
      //   // wireframe: true,
      // })
    )
    sphere.name = "ico"
    this.scene.add(sphere)

    this.pillards.clear()

    let vertexArray = []
    for (let i = 0; i < sphereGeom.attributes.position.array.length; i += 3) {
      const x = sphereGeom.attributes.position.array[i]
      const y = sphereGeom.attributes.position.array[i + 1]
      const z = sphereGeom.attributes.position.array[i + 2]
      vertexArray.push({
        x: x,
        y: y,
        z: z,
      })
    }

    let pillPosition = []
    for (let i = 0; i < vertexArray.length; i++) {
      let existsFlag = false
      for (let j = 0; j < pillPosition.length; j++) {
        if (
          pillPosition[j].x == vertexArray[i].x &&
          pillPosition[j].y == vertexArray[i].y &&
          pillPosition[j].z == vertexArray[i].z
        )
          existsFlag = true
      }
      if (!existsFlag) {
        pillPosition.push({
          x: vertexArray[i].x,
          y: vertexArray[i].y,
          z: vertexArray[i].z,
        })
        const c = this.pillard.clone()

        const posVec = new THREE.Vector3(
          vertexArray[i].x,
          vertexArray[i].y,
          vertexArray[i].z
        )
        c.position.copy(posVec)

        c.scale.multiplyScalar(this.params.pillardSize)
        c.quaternion.setFromUnitVectors(this.upVec, posVec.normalize())
        this.pillards.add(c)
      }
    }
    this.scene.add(this.pillards)
  }

  update() {
    let i = 0
    while (i < this.pillards.children.length) {
      this.pillards.children[i].children[0].position.y =
        Math.sin(
          Date.now() * 0.01 * this.params.waveSpeed +
            this.pillards.children[i].position.x * 1.5
        ) + 1
      i++
    }
    this.pillards.rotation.x = Date.now() * 0.0001
    this.pillards.rotation.y = Date.now() * 0.0001
    this.pillards.rotation.z = Date.now() * 0.0001
  }
  bind() {
    this.computePositions = this.computePositions.bind(this)
  }
}

const _instance = new SphirePillardClass()
export default _instance
