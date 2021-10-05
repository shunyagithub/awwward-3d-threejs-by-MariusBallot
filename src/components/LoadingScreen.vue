<template>
  <div class="loadingScreen" ref="loadingScreen">
    <div class="loadingBarBox">
      <div class="loadingBar" ref="loadingBar">
        <span class="loadingPer">{{ Math.floor(progress) }}%</span>
      </div>
      <div class="loadingText">Loading: {{ text }}</div>
    </div>
  </div>
</template>

<script>
import LoadingController from "../classes/LoadingController"

export default {
  name: "LoadingScreen",
  data() {
    return {
      progress: 0,
      text: "",
    }
  },
  mounted() {
    LoadingController.onProgress = this.onProgress
    LoadingController.onLoad = this.onLoad
  },
  methods: {
    onProgress(url, loaded, total) {
      this.progress = (loaded / total) * 100
      this.$refs.loadingBar.style.width = `${(loaded / total) * 100}%`
      this.text = url
    },
    onLoad() {
      setTimeout(() => {
        this.$refs.loadingScreen.classList.add("finished")
      }, 500)
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus">
.loadingScreen{
    width: 100vw;
    height: 100vh;
    background: #151515;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;

    transition: all 0.5s ease-in;
    display: flex;
    justify-content: center;
    align-items: center;

    .loadingBarBox{
      width: 300px;
      height: 20px;
      background #000;

      .loadingBar{
        position: relative;
        width: 10%;
        height: 100%;
        background: #ccc;
        border-radius: 2px;

        .loadingPer{
          position absolute;
          right: 2px;
          top: 2px;
          color: #000;
          font-size: 0.7em;
        }
      }

      .loadingText{
        color: #ccc;
        font-size: 0.5em;
      }
    }

    &.finished{
        opacity : 0;
        pointer-events : none;
    }
}
</style>
