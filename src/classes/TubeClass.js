import * as THREE from "three"
import { Curves } from "three/examples/jsm/curves/CurveExtras"

import simpleFrag from "../shaders/simple.frag"
import simpleVert from "../shaders/simple.vert"

import LoadingController from "./LoadingController"

class TubeClass {
  constructor() {
    this.bind()
    this.textureLoader = new THREE.TextureLoader(LoadingController)
    this.splines = {
      GrannyKnot: new Curves.GrannyKnot(),
      VivianiCurve: new Curves.VivianiCurve(100),
      KnotCurve: new Curves.KnotCurve(),
      TrefoilKnot: new Curves.TrefoilKnot(),
      TorusKnot: new Curves.TorusKnot(20),
      CinquefoilKnot: new Curves.CinquefoilKnot(20),
    }
    this.params = {
      splines: this.splines.KnotCurve,
      tubularSegments: 30,
      radius: 9,
      radiusSegments: 100,
    }
    this.clock = new THREE.Clock()
  }

  init(scene) {
    this.scene = scene
    const shaderTexture = this.textureLoader.load("./assets/textures/text.png")
    this.tubeGeometry = new THREE.TubeGeometry(
      this.params.splines,
      this.params.tubularSegments,
      this.params.radius,
      this.params.radiusSegments,
      true //closed
    )
    this.tubeMaterial = new THREE.ShaderMaterial({
      vertexShader: simpleVert,
      fragmentShader: simpleFrag,
      uniforms: {
        uTime: { value: 0 },
        uTexture: { value: shaderTexture },
      },
      transparent: false,
      side: THREE.DoubleSide,
    })
    // this.tubeMaterial = new THREE.MeshNormalMaterial({
    //   side: THREE.BackSide,
    //     wireframe: true,
    //     transparent: true,
    //     opacity: 0.3,
    // })
    this.tube = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial)
    this.scene.add(this.tube)
  }

  update() {
    this.tubeMaterial.uniforms.uTime.value = this.clock.getElapsedTime()
  }

  bind() {}
}

const _instance = new TubeClass()
export default _instance
