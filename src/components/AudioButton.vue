<template>
  <div class="audioButton">
    <h1>THREE SPIKES - Sound Reactor</h1>
    <div class="song">
      MUSIC:
      <a
        href="http://youtu.be/YM6maFBts_s"
        target="_blank"
        rel="noopener noreferrer"
        >THYKIER - Shimmer</a
      >
    </div>
    <button v-if="!playFlag" @click="onPlay()">PLAY MUSIC</button>
    <button class="pauseButton" v-else @click="onPause()">PAUSE</button>
  </div>
</template>

<script>
import SoundReactor from "../classes/SoundReactor"
import MainThreeScene from "@/classes/MainThreeScene"

export default {
  name: "AudioButton",
  data() {
    return {
      initFlag: false,
      playFlag: false,
    }
  },
  methods: {
    onPlay() {
      if (!this.initFlag) {
        this.initFlag = true
        SoundReactor.init()
      }

      SoundReactor.play()
      this.playFlag = true
    },
    onPause() {
      SoundReactor.pause()
      this.playFlag = false
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.audioButton {
    position: absolute;
    top: 80%;
    left: 5%;

    padding: 20px;
    background: rgba(30, 30, 30, 30%);
    border-radius: 5px;

    h1{
      color: #fff;
    }

    .song{
      color: #fff;
      font-size: 0.6em;
      margin-bottom: 1em;
      a{
        color: inherit;
      }
    }

    button {
        cursor: pointer;
        border-radius: 5px;
        border 1px solid #fff;
        background: rgba(30, 30, 30, 5%);
        padding: 10px;
        width: 120px;
        color: #fff;
        transition: background .1s ease-in-out;

        &:hover{
          background: rgba(30, 30, 30, 30%);
        }

    }

      .pauseButton{
        color: #000;
        background #fff;

        &:hover{
          background: #f2f3f4;
        }
      }
}
</style>
