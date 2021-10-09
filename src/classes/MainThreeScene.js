import * as THREE from "three"

// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

import RAF from "../utils/RAF"
import config from "../utils/config"
import MyGUI from "../utils/MyGUI"

import SphirePillard from "./SphirePillardClass"
// import Floor from "./FloorClass"
import Spec from "./SpecClass"
import Particle from "./ParticleClass"
// import CamParallax from "./CamParallaxClass"
import Tube from "./TubeClass"

// import simpleFrag from "../shaders/simple.frag"
// import simpleVert from "../shaders/simple.vert"

class MainThreeScene {
  constructor() {
    this.bind()
    this.camera
    this.scene
    this.renderer
    this.controls

    this.time = 0
  }

  init(container) {
    //RENDERER SETUP
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.debug.checkShaderErrors = true
    this.renderer.outputEncoding = THREE.sRGBEncoding
    container.appendChild(this.renderer.domElement)

    //MAIN SCENE INSTANCE
    const color = new THREE.Color(0x151515)
    const fog = new THREE.Fog(color, 15, 30)
    this.scene = new THREE.Scene()
    this.scene.fog = fog
    this.scene.background = color

    this.parent = new THREE.Object3D()
    this.scene.add(this.parent)

    //CAMERA AND ORBIT CONTROLLER
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    this.camera.position.set(0, 0, 8)
    this.parent.add(this.camera)
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // // this.controls.enabled = config.controls
    // this.controls.enabled = false
    // this.controls.maxDistance = 40
    // this.controls.minDistance = 3
    // this.controls.minPolarAngle = 0
    // this.controls.maxPolarAngle = Math.PI / 2 + 0.3
    // CamParallax.init(this.camera)

    //DUMMY CUBE + SIMPLE GLSL SHADER LINKAGE
    // const shaderMat = new THREE.ShaderMaterial({
    //   vertexShader: simpleVert,
    //   fragmentShader: simpleFrag,
    // })
    // const cube = new THREE.Mesh(new THREE.BoxGeometry(), shaderMat)
    // this.scene.add(cube)

    SphirePillard.init(this.parent)
    // Floor.init(this.scene)
    Spec.init(this.parent)
    Particle.init(this.scene)
    Tube.init(this.scene)

    MyGUI.hide()
    if (config.myGui) MyGUI.show()
    MyGUI.closed = true

    // const camFolder = MyGUI.addFolder("Camera Folder")
    // camFolder.open()
    // camFolder
    //   .add(this.controls, "enabled")
    //   .onChange(() => {
    //     if (this.controls.enabled) {
    //       CamParallax.active = false
    //     }
    //   })
    //   .listen()
    //   .name("Orbit Control")
    // camFolder
    //   .add(CamParallax, "active")
    //   .onChange(() => {
    //     if (CamParallax.active) {
    //       this.controls.enabled = false
    //     }
    //   })
    //   .listen()
    //   .name("CamParallax")

    // camFolder.add(CamParallax.params, "intensity", 0.001, 0.01)
    // camFolder.add(CamParallax.params, "ease", 0.01, 0.1)
    //RENDER LOOP AND WINDOW SIZE UPDATER SETUP
    window.addEventListener("resize", this.resizeCanvas)
    RAF.subscribe("threeSceneUpdate", this.update)
    this.setCameraPosition(0)
  }

  setCameraPosition(amount) {
    // https://codepen.io/Lighty/pen/GRqxvZV
    const pos = Tube.tube.geometry.parameters.path.getPointAt(amount)
    const pos2 = Tube.tube.geometry.parameters.path.getPointAt(amount - 0.001)
    this.parent.position.copy(pos)
    this.parent.lookAt(pos2)
  }

  update() {
    this.renderer.render(this.scene, this.camera)
    // this.scene.rotateY(0.002)
    SphirePillard.update()
    Spec.update()
    Particle.update()
    Tube.update()
    // CamParallax.update()

    this.time += 0.0005

    if (this.time > 1) this.time = 0.001

    this.setCameraPosition(this.time)
  }

  resizeCanvas() {
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix()
  }

  bind() {
    this.resizeCanvas = this.resizeCanvas.bind(this)
    this.update = this.update.bind(this)
    this.init = this.init.bind(this)
  }
}

const _instance = new MainThreeScene()
export default _instance
