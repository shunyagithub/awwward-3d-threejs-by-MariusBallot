import * as THREE from "three"
import { Curves } from "three/examples/jsm/curves/CurveExtras"

class TubeClass {
  constructor() {
    this.bind()
    this.splines = {
      GrannyKnot: new Curves.GrannyKnot(),
      VivianiCurve: new Curves.VivianiCurve(100),
      KnotCurve: new Curves.KnotCurve(),
      TrefoilKnot: new Curves.TrefoilKnot(),
      TorusKnot: new Curves.TorusKnot(20),
      CinquefoilKnot: new Curves.CinquefoilKnot(20),
    }
    this.params = {
      splines: this.splines.GrannyKnot,
      tubularSegments: 50,
      radius: 4,
      radiusSegments: 6,
    }
  }

  init(scene) {
    this.scene = scene

    this.tubeGeometry = new THREE.TubeGeometry(
      this.params.splines,
      this.params.tubularSegments,
      this.params.radius,
      this.params.radiusSegments,
      true //closed
    )
    this.tubeMaterial = new THREE.MeshNormalMaterial({
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    })
    this.tube = new THREE.Mesh(this.tubeGeometry, this.tubeMaterial)
    this.scene.add(this.tube)
  }

  update() {}

  bind() {}
}

const _instance = new TubeClass()
export default _instance
