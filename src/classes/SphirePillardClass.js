import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import * as THREE from "three"
import MyGUI from "../utils/MyGUI"

import SoundReactor from "./SoundReactor"

import LoadingController from "./LoadingController"
import { Vector3 } from "three"

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
    sphereFolder.add(this.params, "waveSpeed", 0.001, 3).name("Pillards Speed")
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
    this.sphere
    let ico

    this.scene.traverse((child) => {
      if (child.name == "ico") {
        ico = child
      }
    })

    if (ico) this.scene.remove(ico)

    const sphereGeom = new THREE.IcosahedronGeometry(2, this.params.subDiv)
    const sphereMat = this.gMatCap
    this.sphere = new THREE.Mesh(
      sphereGeom,
      sphereMat
      // new THREE.MeshNormalMaterial({
      //   // wireframe: true,
      // })
    )
    this.sphere.name = "ico"
    this.scene.add(this.sphere)

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
    if (SoundReactor.playFlag) {
      let i = 0
      while (i < this.pillards.children.length) {
        this.pillards.children[i].children[0].position.y =
          Math.sin((SoundReactor.fdata[i] / 255) * 10) * 2 + 2

        i++
      }
      const range = 50
      const fData = SoundReactor.fdata[range] / 255
      const fDataP = SoundReactor.fdata[range + 10] / 255 + 0.5
      this.sphere.scale.set(fData, fData, fData)
      this.pillards.scale.set(fDataP, fDataP, fDataP)
    } else {
      let i = 0
      while (i < this.pillards.children.length) {
        this.pillards.children[i].children[0].position.y =
          Math.sin(
            Date.now() * 0.01 * this.params.waveSpeed +
              this.pillards.children[i].position.x * 1.5
          ) + 1
        i++
      }
      if (this.sphere && this.pillards) {
        this.sphere.scale.set(1, 1, 1)
        this.pillards.scale.set(1, 1, 1)
      }
    }

    const rotationSp = Date.now() * 0.0005
    this.pillards.rotation.set(rotationSp, rotationSp, rotationSp)
  }
  bind() {
    this.computePositions = this.computePositions.bind(this)
  }
}

const _instance = new SphirePillardClass()
export default _instance
