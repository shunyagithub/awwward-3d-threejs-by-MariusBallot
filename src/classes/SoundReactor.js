import RAF from "../utils/RAF"

class SoundReactor {
  constructor(audioUrl) {
    this.ctx
    this.audio
    this.audioSource
    this.analyser
    this.fdata
    this.url = audioUrl
    this.playFlag = false
    this.bind()
  }

  init() {
    this.ctx = new AudioContext()
    this.source = this.ctx.createBufferSource()
    this.audio = new Audio(this.url)
    this.audioSource = this.ctx.createMediaElementSource(this.audio)
    this.analyser = this.ctx.createAnalyser()
    this.analyser.smoothingTimeConstant = 0.8

    this.gainNode = this.ctx.createGain()
    this.source.connect(this.gainNode)
    this.gainNode.connect(this.ctx.destination)
    this.gainNode.gain.value = 0.01

    this.audioSource.connect(this.analyser)
    this.audioSource.connect(this.ctx.destination)
    this.fdata = new Uint8Array(this.analyser.frequencyBinCount)
    this.audio.currentTime = 1 //音楽の始まる位置
  }

  play() {
    this.audio.play()
    this.playFlag = true
    RAF.subscribe("audioReactorupdate", this.update)
  }

  pause() {
    this.audio.pause()
    this.playFlag = false
    RAF.unsubscribe("audioReactorupdate", this.update)
  }

  update() {
    this.analyser.getByteFrequencyData(this.fdata)
  }

  bind() {
    this.update = this.update.bind(this)
    this.init = this.init.bind(this)
  }
}

const _instance = new SoundReactor(
  "/assets/THYKIER - Shimmer [NCS Release].mp3"
)
export default _instance
