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
    this.audio = new Audio(this.url)
    this.gainNode = this.ctx.createGain()
    this.gainNode.gain.value = 0.5 //音量
    this.audioSource = this.ctx.createMediaElementSource(this.audio)
    this.analyser = this.ctx.createAnalyser()
    this.analyser.smoothingTimeConstant = 0.8

    this.audioSource.connect(this.analyser)
    this.audioSource.connect(this.ctx.destination)
    this.fdata = new Uint8Array(this.analyser.frequencyBinCount)
    // this.audio.currentTime = 20 //音楽の始まる位置
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
  "assets/More Plastic x hayve - Feel Alive [NCS Release].mp3"
)
export default _instance
