<template>
  <v-app>
      <v-container fluid>
        <v-container v-if="showCaptcha" class="slot-sontainer d-flex flex-column align-center">
          <div>不用担心, 我们并没有认为你是机器人, 或者女鬼恶魔鲨鱼水母企鹅外星人, 这只是一个随机出现的页面.</div>
          <div class="captcha-container" @click="captchaContainerClick">
            <div class="captcha-checkbox-container">
              <div v-if="captchaStatus == 0 || captchaStatus == 2" class="captcha-checkbox"></div>
              <div v-if="captchaStatus == 1" class="captcha-checkbox-pulse">
                <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 44 44" xml:space="preserve"><g> <circle class="st0" cx="22" cy="22" r="1"> <animate accumulate="none" additive="replace" attributeName="r" begin="0s" calcMode="spline" dur="1.8s" fill="remove" keySplines="0.165, 0.84, 0.44, 1" keyTimes="0; 1" repeatCount="indefinite" restart="always" values="1; 20"> </animate> <animate accumulate="none" additive="replace" attributeName="stroke-opacity" begin="0s" calcMode="spline" dur="1.8s" fill="remove" keySplines="0.3, 0.61, 0.355, 1" keyTimes="0; 1" repeatCount="indefinite" restart="always" values="1; 0"> </animate> </circle> <circle class="st0" cx="22" cy="22" r="1"> <animate accumulate="none" additive="replace" attributeName="r" begin="-0.9s" calcMode="spline" dur="1.8s" fill="remove" keySplines="0.165, 0.84, 0.44, 1" keyTimes="0; 1" repeatCount="indefinite" restart="always" values="1; 20"> </animate> <animate accumulate="none" additive="replace" attributeName="stroke-opacity" begin="-0.9s" calcMode="spline" dur="1.8s" fill="remove" keySplines="0.3, 0.61, 0.355, 1" keyTimes="0; 1" repeatCount="indefinite" restart="always" values="1; 0"> </animate> </circle></g></svg>
              </div>
              <div v-if="captchaStatus == 3" class="captcha-checkbox-check">
                <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAABmJLR0QA/wD/AP+gvaeTAAAC00lEQVR4nO2aTU8TQRyHn39bIdXEm3jwLQhefPkAJorYLYslIF64ohwM8eQH0A/gzYSLIRooxBORKJr4Ultq4smz8YgQb3ow4YAmUHY8IEpgd7vQ3e0smee4+5/uPL+daXdmCwaDwWAwGAwGg8FgMBgM+wBr0u7JFe17QWrTUXcmbqxJuwdhTpDejsHO7Ne5hbJf/b4KYFMeJAuAcKleCPsmgB3ymwiX2m901BZfLHx0a5eKpXcR4ykPgPqdEvnk1Vai7Fgc1JMXkevlm+88p0CiA2hUHhIcQBjykNAAwpKHBAYQpjwkLICw5SFBAUQhDwkJICp5SEAAUcqD5gFELQ8aBxCHPGgaQFzyoGEAccpDwNXgxZmhLCr6sPJTvXk/eRSDYcpDgAAGxgcOZleW31hF+1GUIViTdo9S6qXfna+MlN6HfV3fAApjhdZfrauzInIFkdGoQoh72G/FM4ChmaGW1cPOM+Dav4MRhNBMefAJ4OfK8hjQv+OEyKhV7H0YRgjNmPPb8QxgndQDYMn1pHC30ZHQrDm/Hc8APoy8XVK1dDew6FrQwHTIFe0uRJ43a9hvpW7nc0/6TklmvQq0uxYoNV65VbqDoIJcMFe0uwR5DRxy+bBY5SHgg1B+On9SOZkqqNOuBQFD0E0edvEkuBFCeh7ocC2oE4KO8rCL9wLl4fK3tKOuAguuBT7fCbrKwx7WAvaEfcJJybyCTteCbSNBZ3nY42Ko+2nheKbmVOuFkJuyL+ssDw2sBnNT/cdErVWBMx4ls6D6/B5y4vidr0dDT3PWY+soBzLzwNngrfS485s09HK0crvynbVaDvgSrIVe8hDShsjfkVABznlX6ScPIe4I2dN2W82RisD5nWf1lIeQt8Tsabtt3aEMcuH/UX3lIeQ/SJSGSz9anLQF6vPGEb3lIaJN0cJE4ciaOK9IcV9n+WiJYRPVYDAYDAaDoRH+ALzfixyrasnFAAAAAElFTkSuQmCC" />
              </div>
            </div>
            <div class="captcha-label-container" ref="captchalabel">
              <div class="captcha-label">我很闲</div>
            </div>
            <div class="captcha-logo-container">
              <img alt="Logo" :src="require('../assets/logo.png')" />
            </div>
          </div>
          <div v-if="captchaStatus == 2" class="captcha-dialog" v-bind:style="captchaDialogStyle">
            <div class="captcha-dialog-content">
              <div class="captcha-dialog-content-header">
                <div class="captcha-dialog-content-header-text">
                  <div>请选出{{ captchaUserName }}在动态中使用过的表情</div>
                  <div class="captcha-dialog-content-header-tip">如果没有, 请直接提交</div>
                </div>
                <div class="captcha-dialog-content-header-img">
                  <img :src="captchaUserImg" />
                </div>
              </div>
              <div class="captcha-dialog-content-body">
                <div class="captcha-dialog-content-img" v-for="image in currentCaptchaImages" :key="image.imageNo" @click="image.selected = !image.selected">
                  <img :src="image.url" />
                  <div class="captcha-dialog-content-img-border" v-if="image.selected"></div>
                </div>
              </div>
              <div class="captcha-dialog-footer">
                <v-btn class="success" @click="checkCaptcha">提交</v-btn>
              </div>
            </div>
            <div class="captcha-dialog-arrow">
              <div class="captcha-dialog-arrow-border"></div>
              <div class="captcha-dialog-arrow-shadow"></div>
            </div>
          </div>
          <div v-if="captchaStatus == 2" class="captcha-dialog-modal" @click="hideCaptchaDialog"></div>
          <v-btn class="mt-2" @click="finishCaptcha">不了, 我忙得很</v-btn>
        </v-container>
        <v-container v-if="!showCaptcha" class="slot-sontainer d-flex flex-column align-center">
          <canvas class="canvas" ref="canvas" :width="reelAreaLeft * 2 + reelAreaWidth" :height="reelAreaTop * 2 + reelAreaHeight"></canvas>
          <v-btn-toggle mandatory v-model="lineNumIndex">
            <v-btn :disabled="state != 0">{{ lineNums[0] }}</v-btn>
            <v-btn :disabled="state != 0">{{ lineNums[1] }}</v-btn>
            <v-btn :disabled="state != 0">{{ lineNums[2] }}</v-btn>
          </v-btn-toggle>
          <v-btn class="mt-3" :color="state < 1 ? 'success' : 'error'" :disabled="state != 0 && state !=2" dark fab @click="startOrStopGame">{{ state &lt; 1 ? 'GO!' : 'STOP!'}}</v-btn>
          <v-alert class="mt-3" type="error" :value="showResetAlert">
            <v-row align="center">
              <v-col class="grow">你的爱不够了, 是否要重置?</v-col>
              <v-col class="shrink">
                <v-btn @click="doResetPoint">是</v-btn>
              </v-col>
              <v-col class="shrink">
                <v-btn @click="showResetAlert = false">否</v-btn>
              </v-col>
            </v-row>
          </v-alert>
          <v-dialog v-model="helpDialog" max-width="600">
            <template v-slot:activator="{ on, attrs }">
              <v-btn class="mt-3" color="info" dark fab x-small v-bind="attrs" v-on="on">?</v-btn>
            </template>
            <v-card>
              <v-card-title>帮助</v-card-title>
              <v-card-text>
                <p>感谢<a href="https://space.bilibili.com/59275" target="_blank">梦魇老师</a>同意使用图像素材</p>
                <p>数字按钮可以切换判定线条数, 每次开始时会扣减判定线条数X{{ lineCost }}的点数.</p>
                <p>点击[GO!]按钮即可开始转动, 当剩余点数不足扣除开始所需的点数时, 可以选择重置点数.</p>
                <p>点击[STOP!]可以快速停止转动但并不影响转动结果<br/>
                <p>转动停止后, 每条判定线上的三个图像如果满足以下情形, 将获得对应分数<br/>
                  <ul>
                    <li>三个连衣裙弥: {{ rewards[1] }}</li>
                    <li>三个高叉孟: {{ rewards[2] }}</li>
                    <li>三个女仆仓鼠: {{ rewards[3] }}</li>
                    <li>三个校服大哥: {{ rewards[7] }}</li>
                    <li>三个校服弥: {{ rewards[0] }}</li>
                    <li>三个千幽: {{ rewards[6] }}</li>
                    <li>三个魔魔: {{ rewards[5] }}</li>
                    <li>三个魔法少女大哥: {{ rewards[10] }}</li>
                    <li>三个奶茶星弥: {{ rewards[4] }}</li>
                    <li>三个泳装孟: {{ rewards[9] }}</li>
                    <li>三个泳装弥: {{ rewards[8] }}</li>
                    <li>mihiru: {{ specialRewards.mihiru }}</li>
                    <li>西米露: {{ specialRewards.saiMailou }}</li>
                    <li>一家三口: {{ specialRewards.family }}</li>
                    <li>MMM一期生: {{ specialRewards.mmm }}</li>
                    <li>三个不同弥: {{ specialRewards.mimimi }}</li>
                    <li>泳装mihiru: 进入Fever Time, 免费连抽{{ feverTimeAddNum }}次</li>
                  </ul>
                </p>
                <p>分数有什么用? 没有!</p>
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn color="primary" @click="helpDialog = false">关闭</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
        <v-container v-if="!showCaptcha" class="d-flex flex-column align-center">
          <span class="link-span"><router-link to="/memory">历久弥真</router-link></span>
          <span class="link-span"><router-link to="/miarticles">怪弥书</router-link></span>
          <span class="link-span"><a href="https://www.supermikimiki.com" title="弥按钮">弥按钮</a></span>
          <span class="link-span"><a href="https://mahiru.cn" title="孟按钮">孟按钮</a></span>
          <span class="link-span"><a href="https://mihiru.com/onlooker/" title="管人食芥末">管人食芥末</a></span>
          <span class="link-span"><a href="https://mihiru.com/mikitube/" title="Mikitube">Mikitube</a></span>
        </v-container>
      </v-container>
  </v-app>
</template>
<style scoped>
div.v-application {
  background: linear-gradient(#b48ce6, #fb5458);
  min-height: 100%;
}
.container a {
  text-decoration: none;
}
.container .link-span {
  margin-top: 1em;
  margin-bottom: 1em;
}
.captcha-container {
  user-select: none;
  width: 300px;
  height: 70px;
  background-color: #FAFAFA;
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  cursor: pointer;
}
.captcha-container:hover {
  background-color: #F5F5F5;
}
.captcha-checkbox-container {
  display: inline-block;
  height: 100%;
  vertical-align: middle;
  padding: 0 15px;
  position: relative;
  width: 60px;
}
.captcha-checkbox {
  width: 28px;
  height: 28px;
  background-color: #FAFAFA;
  border: 1px solid #919191;
  border-radius: 4px;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
}
.captcha-checkbox:hover {
  border-color: #333333;
}
.captcha-checkbox-pulse {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
}
.captcha-checkbox-pulse svg {
  width: 30px;
  height: 30px;
  display: block;
}
.captcha-checkbox-pulse svg .st0 {
  fill: none;
  stroke: #FF7B00;
  stroke-width: 2;
}
.captcha-checkbox-check {
  width: 30px;
  height: 30px;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  animation: 0s ease 0s 1 normal none running auto;
}
.captcha-checkbox-check img {
  width: 30px;
  height: 30px;
  display: block;
}
.captcha-label-container {
  width: 190px;
  display: inline-block;
  height: 100%;
  vertical-align: middle;
  position: relative;
}
.captcha-label {
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
}
.captcha-logo-container {
  display: inline-block;
  height: 100%;
  vertical-align: middle;
  position: relative;
}
.captcha-logo-container img {
  width: 32px;
  height: 32px;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
}
.captcha-dialog {
  background-color: white;
  border: 1px solid #D7D7D7;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 4px;
  box-sizing: border-box;
  border-radius: 4px;
  left: 0px;
  top: 0px;
  z-index: 1000;
  position: absolute;
  transition: opacity 0.15s ease-out 0s;
  opacity: 1;
}
.captcha-dialog-arrow {
  border-width: 11px;
  position: absolute;
  pointer-events: none;
  margin-top: -11px;
  z-index: 1;
  right: 100%;
  top: 45px;
}
.captcha-dialog-arrow-border {
  border-width: 10px;
  border-style: solid;
  border-color: transparent white transparent transparent;
  position: relative;
  top: 10px;
  z-index: 1;
  display: block;
}
.captcha-dialog-arrow-shadow {
  border-width: 11px;
  border-style: solid;
  border-color: transparent #D7D7D7 transparent transparent;
  position: relative;
  top: -11px;
  z-index: 0;
  display: block;
}
.captcha-dialog-content-header {
  width: 380px;
  height: 110px;
  margin: 10px;
  border-radius: 2px;
  border-width: 1px;
  border-color: #B28FCE;
  background-color: #B28FCE;
  display: flex;
}
.captcha-dialog-content-header-text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 110px;
  padding: 10px;
  flex-grow: 1;
}
.captcha-dialog-content-header-tip {
  font-size: 10px;
}
.captcha-dialog-content-header-img {
  width: 100px;
  margin: 5px;
}
.captcha-dialog-content-header-img img {
  width: 100px;
  height: 100px;
}
.captcha-dialog-content-body {
  width: 380px;
  height: 380px;
  margin: 10px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.captcha-dialog-content-img {
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 2px;
  cursor: pointer;
  background-color: #F5F5F5;
  position: relative;
}
.captcha-dialog-content-img img{
  width: 120px;
  height: 120px;
}
.captcha-dialog-content-img-border {
  opacity: 1;
  width: 120px;
  height: 120px;
  background-color: transparent;
  position: absolute;
  border-width: 6px;
  border-style: solid;
  border-color: rgb(0, 131, 143);
  z-index: 10;
  left: 0px;
  top: 0px;
}
.captcha-dialog-footer {
  width: 380px;
  margin: 10px;
  text-align: right;
}
.captcha-dialog-modal {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 999;
  background-color: white;
  opacity: 0.05;
  cursor: default;
}
@media (max-width: 620px) {
  .captcha-dialog-arrow {
    display: none;
  }
  .captcha-dialog-content-header {
    width: 320px;
  }
  .captcha-dialog-content-body {
    width: 320px;
    height: 320px;
  }
  .captcha-dialog-content-img {
    width: 100px;
    height: 100px;
  }
  .captcha-dialog-content-img img{
    width: 100px;
    height: 100px;
  }
  .captcha-dialog-content-img-border {
    width: 100px;
    height: 100px;
  }
  .captcha-dialog-footer {
    width: 320px;
  }
}
</style>
<script>
export default {
    name: "Home",
    data: ()=>({
      reel: [0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,5,5,5,5,6,6,6,7,7,7,7,8,9,10,10],
      maxSpeed: 70,
      acceleration: 4,
      relCol: 3,
      relRow: 3,
      realItemSize: 80,
      reelAreaTop: 40,
      reelAreaLeft: 40,
      reelAreaHeight: 240,
      reelAreaWidth: 240,
      lineOutX: 10,
      lineCut: 4,
      lineRowIndex: [
        [1, 1, 1],
        [0, 0, 0],
        [2, 2, 2],
        [0, 1, 2],
        [2, 1, 0]
      ],
      rewards: [
        25, // 校服弥 0
        5, // 女鬼弥 1
        10, // 高叉孟 2
        15, // 女仆星弥 3
        70, // 奶茶星弥 4
        35, // 魔魔 5
        30, // 女儿 6
        20, // 大哥 7
        120, // 泳装弥 8
        100, // 泳装孟 9
        50 // 魔法大哥 10
      ],
      specialRewards: {
        mihiru: 20,
        saiMailou: 50,
        family: 80,
        mmm: 100,
        mimimi: 120
      },
      reelIndex: [0, 0, 0],
      reelOffset: [0, 0, 0],
      reelSpeed: [0, 0, 0],
      reelChangeOffset: [-1, -1, -1],
      state: -1,
      lineNums: [1, 3, 5],
      lineNumIndex: 2,
      lineCost: 5,
      points: 100,
      feverTimes: 0,
      feverTimeAddNum: 5,
      inFever: false,
      rewardPoints: 0,
      rewardSpeed: 0,
      rewardLines: [0, 0, 0, 0, 0],
      slotCtx: null,
      reelImage: new Image(),
      reelImageLoaded: false,
      backgroundImage: new Image(),
      backgroundImageLoaded: false,
      showResetAlert: false,
      helpDialog: false,
      requestAnimationFrameId: null,
      showCaptcha: Math.floor(Math.random() * 10) < 1,
      captchaStatus: 0,
      mikiCaptcha: [3769402140, 3396665688],
      mahiruCaptcha: [2534504579, 2978099335],
      gifCaptcha: [2701660172, 3394310210],
      captchaImageNums: 62,
      currentCaptchaImages: [],
      captchaCheckStatus: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      captchaDialogStyle: {
        left: "0px",
        top: "0px"
      },
      captchaArrowStyle: {
        top: "0px"
      },
      captchaUser: 0,
      resizeListener: false
    }),
    computed: {
      captchaImageNoArray: function(){
        const imageNoArray = new Array()
        for (let i = 0; i < this.captchaImageNums; i++) {
          imageNoArray.push(1 + i) 
        }
        return imageNoArray
      },
      captchaUserName: function() {
        return ["弥希Miki", "真绯瑠Mahiru"][this.captchaUser]
      },
      captchaUserImg: function() {
        return process.env.VUE_APP_CAPTCHA_IMG_PREFIX + 'u' + this.captchaUser + '.jpg'
      },
      stopSize: function() {
        return Math.round(Math.pow(this.maxSpeed, 2) / (this.acceleration * 2))
      },
      linePositions: function() {
        const leftLineNumX = this.reelAreaLeft - this.lineOutX
        const rightLineNumX = this.reelAreaLeft + this.reelAreaWidth + this.lineOutX
        return [{
          x1: leftLineNumX,
          y1: this.reelAreaHeight/2 + this.reelAreaTop,
          x2: rightLineNumX,
          y2: this.reelAreaHeight/2 + this.reelAreaTop
        }, {
          x1: leftLineNumX,
          y1: this.reelAreaTop + this.reelAreaHeight / 6,
          x2: rightLineNumX,
          y2: this.reelAreaTop + this.reelAreaHeight / 6
        }, {
          x1: leftLineNumX,
          y1: this.reelAreaTop + this.reelAreaHeight / 6 * 5,
          x2: rightLineNumX,
          y2: this.reelAreaTop + this.reelAreaHeight / 6 * 5
        }, {
          x1: leftLineNumX,
          y1: this.reelAreaTop - this.reelAreaLeft + leftLineNumX,
          x2: rightLineNumX,
          y2: this.reelAreaTop - this.reelAreaLeft + rightLineNumX
        }, {
          x1: leftLineNumX,
          y1: this.reelAreaTop + this.reelAreaHeight + this.reelAreaLeft - leftLineNumX,
          x2: rightLineNumX,
          y2: this.reelAreaTop + this.reelAreaHeight + this.reelAreaLeft - rightLineNumX
        }]
      },
      reels: function(){
        const reel1 = this.fisherYates([...this.reel])
        const reel2 = this.fisherYates([...reel1])
        const reel3 = this.fisherYates([...reel2])
        return [reel1, reel2, reel3]
      },
      lineNum: function() {
        return this.lineNums[this.lineNumIndex]
      }
    },
    watch: {
      lineNumIndex: function() {
        this.rewardLines = [0, 0, 0, 0, 0]
        this.renderCanvas()
      }
    },
    methods: {
      captchaContainerClick: function() {
        if (this.captchaStatus == 0) {
          this.captchaStatus = 1
          this.initCaptchaData()
          setTimeout(this.showCaptchaDialog, 1000)
        }
      },
      initCaptchaData: function() {
        const imageNoArray = this.fisherYates([...this.captchaImageNoArray]).slice(0, 9)
        this.currentCaptchaImages.splice(0)
        for (let i = 0; i < imageNoArray.length; i++) {
          this.currentCaptchaImages.push({
            imageNo: imageNoArray[i],
            url: process.env.VUE_APP_CAPTCHA_IMG_PREFIX + (1000 + imageNoArray[i]) + (((this.gifCaptcha[Math.floor((imageNoArray[i]-1)/31)] >> (30 - (imageNoArray[i]-1)%31)) & 1) ? '.gif' : '.jpg'),
            selected: false
          })
        }
        this.captchaCheckStatus = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        this.captchaUser = new Date().getTime() % 2
      },
      showCaptchaDialog: function(){
        this.captchaStatus = 2
        this.refreshCaptchaDialogPosition()
      },
      hideCaptchaDialog: function(){
        this.captchaStatus = 0
      },
      finishCaptcha: function(){
        this.showCaptcha = false
        this.$nextTick(this.initCanvas)
      },
      refreshCaptchaDialogPosition: function(){
        if (this.$refs.captchalabel) {
          if (window.matchMedia('(max-width: 620px)').matches) {
            if (document.documentElement.clientWidth <= 342) {
              this.captchaDialogStyle.left = '0'
            } else {
              this.captchaDialogStyle.left = Math.ceil((document.documentElement.clientWidth - 342)/2) + 'px'
            }
          } else {
            this.captchaDialogStyle.left = (this.$refs.captchalabel.offsetLeft - 8) + 'px'
          }
          this.captchaDialogStyle.top = (this.$refs.captchalabel.offsetTop - 20) + 'px'
        }
      },
      checkCaptcha: function() {
        const userCaptcha = this.captchaUser == 1 ? this.mahiruCaptcha : this.mikiCaptcha
        for (let i = 0; i < this.currentCaptchaImages.length; i++) {
          const image = this.currentCaptchaImages[i];
          if ((userCaptcha[Math.floor((image.imageNo-1)/31)] >> (30 - (image.imageNo-1)%31)) & 1 != (image.selected ? 1 : 0)) {
            this.initCaptchaData()
            return
          }
        }
        this.captchaStatus = 3
        setTimeout(this.finishCaptcha, 1000)
      },
      fisherYates: function(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i+1))
          if (j != i) {
            array [i] = array[i] + array[j]
            array [j] = array[i] - array[j]
            array [i] = array[i] - array[j]
          }
        }
        for (let i = 0; i < array.length; i++) {
          for (let j = 1; j < this.relRow; j++) {
            const nextItemIndex = (i + j) % array.length
            if (array[i] == array[nextItemIndex]) {
              let checkIndex = (nextItemIndex + 1) % array.length
              while (array[i] == array[checkIndex] || array[i] == array[(checkIndex + 1) % array.length] || array[i] == array[(checkIndex + 2) % array.length]) {
                checkIndex = (checkIndex + 1) % array.length
              }
              array [nextItemIndex] = array[nextItemIndex] + array[checkIndex]
              array [checkIndex] = array[nextItemIndex] - array[checkIndex]
              array [nextItemIndex] = array[nextItemIndex] - array[checkIndex]
            }
          }
        }
        return array
      },
      initCanvas: function() {
        this.slotCtx = this.$refs.canvas.getContext('2d')
        const $this = this
        this.reelImage.onload = function(){
          $this.reelImageLoaded = true
          if ($this.reelImageLoaded && $this.backgroundImageLoaded) {
            $this.state = 0
            $this.renderCanvas()
          }
        }
        this.reelImage.src = require('../assets/reels.png')
        this.backgroundImage.onload = function(){
          $this.backgroundImageLoaded = true
          if ($this.reelImageLoaded && $this.backgroundImageLoaded) {
            $this.state = 0
            $this.renderCanvas()
          }
        }
        this.backgroundImage.src = require('../assets/reels_bg.png')
      },
      renderCanvas: function() {
        this.slotCtx.save()
        this.slotCtx.clearRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
        this.slotCtx.beginPath()
        this.renderLine(1)
        if (this.lineNum > 1) {
          this.renderLine(2)
          this.renderLine(3)
          if (this.lineNum > 3) {
            this.renderLine(4)
            this.renderLine(5)
          }
        }
        this.slotCtx.clearRect(this.reelAreaLeft - this.lineCut, this.reelAreaTop - this.lineCut, this.reelAreaWidth + this.lineCut * 2, this.reelAreaHeight + this.lineCut * 2)
        this.slotCtx.font = "20px sans-serif"
        this.slotCtx.fillStyle = "#c73e3a"
        this.slotCtx.textAlign = "center"
        this.slotCtx.textBaseline = "middle"
        this.slotCtx.fillText('♥ ' + this.points, this.reelAreaLeft + this.reelAreaWidth / 2, 20)
        if (this.inFever) {
          const feverTimeText = "FEVER TIME !!!"
          const textWidth = this.slotCtx.measureText(feverTimeText).width
          const linearGradient = this.slotCtx.createLinearGradient(this.reelAreaLeft + Math.floor((this.reelAreaWidth - textWidth) / 2), this.reelAreaTop + this.reelAreaHeight + 5, this.reelAreaLeft + Math.ceil((this.reelAreaWidth + textWidth) / 2), this.reelAreaTop + this.reelAreaHeight + 25)
          linearGradient.addColorStop(0, 'red')
          linearGradient.addColorStop(1, 'yellow')
          this.slotCtx.fillStyle = linearGradient
          this.slotCtx.fillText(feverTimeText, this.reelAreaLeft + this.reelAreaWidth / 2, this.reelAreaTop + this.reelAreaHeight + 15)
        }
        this.slotCtx.beginPath()
        this.slotCtx.drawImage(this.backgroundImage, this.reelAreaLeft, this.reelAreaTop)
        this.slotCtx.rect(this.reelAreaLeft, this.reelAreaTop, this.reelAreaWidth, this.reelAreaHeight)
        this.slotCtx.clip()

        for (let i=0; i<this.relCol; i++) {
          for (let j=0; j<this.relRow + 1; j++) {
            let rowRelIndex = this.reelIndex[i] + j
            if (rowRelIndex >= this.reel.length) {
              rowRelIndex -= this.reel.length
            }

            const reelItemIndex = this.reels[i][rowRelIndex]

            const x = i * this.realItemSize;
            const y = j * this.realItemSize - this.reelOffset[i]

            this.renderItem(reelItemIndex, x, y)
          }
        }
        this.slotCtx.restore()
      },
      renderLine: function(lineNum) {
        this.slotCtx.font = "16px sans-serif"
        if (this.rewardLines[lineNum - 1] > 0) {
          this.slotCtx.fillStyle = "#c73e3a"
          this.slotCtx.strokeStyle = "#c73e3a"
        } else {
          this.slotCtx.fillStyle = "#f9bf45"
          this.slotCtx.strokeStyle = "#f9bf45"
        }
        const linePosition = this.linePositions[lineNum - 1]
        this.slotCtx.beginPath()
        if (lineNum > 4) {
          this.slotCtx.textBaseline = "top"
        } else if (lineNum > 3) {
          this.slotCtx.textBaseline = "bottom"
        } else {
          this.slotCtx.textBaseline = "middle"
        }
        this.slotCtx.fillText(lineNum, linePosition.x1 - 10 - this.slotCtx.measureText(lineNum).width, linePosition.y1)
        if (lineNum > 4) {
          this.slotCtx.textBaseline = "bottom"
        } else if (lineNum > 3) {
          this.slotCtx.textBaseline = "top"
        } else {
          this.slotCtx.textBaseline = "middle"
        }
        this.slotCtx.fillText(lineNum, linePosition.x2 + 10, linePosition.y2)
        this.slotCtx.moveTo(linePosition.x1, linePosition.y1)
        this.slotCtx.lineTo(linePosition.x2, linePosition.y2)
        this.slotCtx.stroke()
      },
      renderItem: function(reelItemIndex, x, y) {
        const reelItemOffset = reelItemIndex * this.realItemSize
        this.slotCtx.drawImage(this.reelImage, 0, reelItemOffset, this.realItemSize, this.realItemSize, x + this.reelAreaLeft, y + this.reelAreaTop, this.realItemSize, this.realItemSize);
      },
      startOrStopGame: function() {
        if (this.state === 1 || this.state === 3 || this.state < 0) {
          return
        }
        if (this.state > 0) {
          this.fastStop()
          return
        }
        if (this.feverTimes > 0) {
          this.feverTimes --
          this.inFever = true
        } else {
          const cost = this.lineNum * this.lineCost
          if (this.points < cost) {
            this.showResetAlert = true
            return
          }
          this.rewardPoints -= cost
        }
        this.showResetAlert = false
        this.state = 1
        this.reelSpeed = [0, 0, 0]
        this.rewardLines = [0, 0, 0, 0, 0]
        this.reelChangeOffset[0] = (Math.floor(Math.random() * this.reel.length * 5) + this.reel.length * 5) * this.realItemSize
        this.reelChangeOffset[1] = this.reelChangeOffset[0] + (Math.floor(Math.random() * this.reel.length * 3) + this.reel.length) * this.realItemSize
        this.reelChangeOffset[2] = this.reelChangeOffset[1] + (Math.floor(Math.random() * this.reel.length * 3) + this.reel.length) * this.realItemSize
        this.requestAnimationFrameId = window.requestAnimationFrame(this.drawFrame)
      },
      fastStop: function() {
        if (this.requestAnimationFrameId != null) {
          window.cancelAnimationFrame(this.requestAnimationFrameId)
        }
        this.fastStopReel(0)
        this.fastStopReel(1)
        this.fastStopReel(2)
        this.requestAnimationFrameId = window.requestAnimationFrame(this.drawFrame)
      },
      fastStopReel: function(i) {
        this.reelOffset[i] += this.reelChangeOffset[i]
        this.reelChangeOffset[i] = 0
        if (this.reelOffset[i] >= this.realItemSize) {
          this.reelIndex[i] += Math.floor(this.reelOffset[i] / this.realItemSize)
          if (this.reelIndex[i] >= this.reel.length) {
            this.reelIndex[i] = this.reelIndex[i] % this.reel.length
          }
          this.reelOffset[i] = this.reelOffset[i] % this.realItemSize
        }
      },
      drawFrame: function() {
        if (this.state === 1 || this.state === 2) {
          this.scollRell(0)
          if (this.reelSpeed[1] > 0 || this.reelSpeed[0] >= this.maxSpeed || this.reelChangeOffset[0] <= this.stopSize || Math.floor(Math.random() * this.maxSpeed) < this.reelSpeed[0]) {
            this.scollRell(1)
          }
          if (this.reelSpeed[2] > 0 || this.reelSpeed[1] >= this.maxSpeed || this.reelChangeOffset[1] <= this.stopSize || Math.floor(Math.random() * this.maxSpeed) < this.reelSpeed[1]) {
            this.scollRell(2)
          }
          if (this.rewardPoints < 0) {
            this.points--
            this.rewardPoints++
          } else if (this.reelChangeOffset[2] <= 0) {
            this.state = 3
            this.calReward()
            this.rewardSpeed = Math.max(1, Math.floor(this.rewardPoints / 60))
          } else {
            this.state = 2
          }
        } else if (this.state === 3) {
          if (this.rewardPoints <= this.rewardSpeed) {
            this.points += this.rewardPoints
            this.rewardPoints = 0
            this.state = 0
            if (this.feverTimes > 0) {
              this.renderCanvas()
              this.startOrStopGame()
              return
            } else {
              this.inFever = false
            }
          } else {
            this.rewardPoints -= this.rewardSpeed
            this.points += this.rewardSpeed
          }
        }
        this.renderCanvas()
        if (this.state > 0) {
          this.requestAnimationFrameId = window.requestAnimationFrame(this.drawFrame)
        }
      },
      scollRell: function(i) {
        if (this.reelChangeOffset[i] > 0) {
          if (this.reelChangeOffset[i] < this.stopSize) {
            this.reelSpeed[i] -= this.acceleration
            if (this.reelSpeed[i] < 1) {
              this.reelSpeed[i] = 1
            } else if (this.reelSpeed[i] > this.reelChangeOffset[i]) {
              this.reelSpeed[i] = this.reelChangeOffset[i]
            }
          } else if(this.reelSpeed[i] < this.maxSpeed){
            this.reelSpeed[i] += this.acceleration
            if (this.reelSpeed[i] > this.maxSpeed) {
              this.reelSpeed[i] = this.maxSpeed
            }
          }
          this.reelChangeOffset[i] -= this.reelSpeed[i]
          this.reelOffset[i] += this.reelSpeed[i]
          if (this.reelOffset[i] >= this.realItemSize) {
            this.reelIndex[i] += Math.floor(this.reelOffset[i] / this.realItemSize)
            if (this.reelIndex[i] >= this.reel.length) {
              this.reelIndex[i] = this.reelIndex[i] % this.reel.length
            }
            this.reelOffset[i] = this.reelOffset[i] % this.realItemSize
          }
        }
      },
      calReward: function() {
        this.calLine(0)
        if (this.lineNum > 1) {
          this.calLine(1)
          this.calLine(2)
          if (this.lineNum > 3) {
            this.calLine(3)
            this.calLine(4)
          }
        }
      },
      calLine: function(lineIndex) {
        const item1 = this.reels[0][(this.reelIndex[0] + this.lineRowIndex[lineIndex][0]) % this.reel.length]
        const item2 = this.reels[1][(this.reelIndex[1] + this.lineRowIndex[lineIndex][1]) % this.reel.length]
        const item3 = this.reels[2][(this.reelIndex[2] + this.lineRowIndex[lineIndex][2]) % this.reel.length]
        // 三同图
        if (item1 === item2 && item2 === item3) {
          this.addReward(lineIndex, this.rewards[item1]);
          return
        }

        // 三连弥
        if (this.checkRewardArray(item1, item2, item3, [[0], [1], [8]])) {
          this.addReward(lineIndex, this.specialRewards.mimimi);
          return
        }

        // 泳装弥孟
        if (this.checkRewardArray(item1, item2, item3, [[8], [9]])) {
          this.rewardLines[lineIndex] = 1
          this.feverTimes += this.feverTimeAddNum
          return
        }

        // 弥孟
        if (this.checkRewardArray(item1, item2, item3, [[0, 1, 8], [2, 9]])) {
          this.addReward(lineIndex, this.specialRewards.mihiru);
          return
        }

        // 一家三口
        if (this.checkRewardArray(item1, item2, item3, [[6], [0, 1, 8], [2, 9]])) {
          this.addReward(lineIndex, this.specialRewards.family);
          return
        }

        // MMM
        if (this.checkRewardArray(item1, item2, item3, [[5], [0, 1, 8], [2, 9]])) {
          this.addReward(lineIndex, this.specialRewards.mmm);
          return
        }

        // 西米露
        if (this.checkRewardArray(item1, item2, item3, [[3, 4], [0, 1, 8], [2, 9]])) {
          this.addReward(lineIndex, this.specialRewards.saiMailou);
          return
        }
      },
      addReward: function(lineIndex, addPoints){
        this.rewardLines[lineIndex] = addPoints
        this.rewardPoints += this.rewardLines[lineIndex]
      },
      checkRewardArray: function(item1, item2, item3, rewardArrays) {
        let matchItemCount = 0
        for (let i = 0; i < rewardArrays.length; i++) {
          const rewardArray = rewardArrays[i];
          let match = false
          for (let j = 0; j < rewardArray.length; j++) {
            if (item1 == rewardArray[j]) {
              match = true
              matchItemCount++
            }
            if (item2 == rewardArray[j]) {
              match = true
              matchItemCount++
            }
            if (item3 == rewardArray[j]) {
              match = true
              matchItemCount++
            }
          }
          if (!match) {
            return false
          }
        }
        return matchItemCount == this.relCol
      },
      doResetPoint: function() {
        this.showResetAlert = false
        this.points = 100
        this.renderCanvas()
      }
    },
    mounted: function() {
      if (!this.showCaptcha) {
        this.initCanvas()
      } else {
        const that = this
        this.resizeListener = function() {
          that.refreshCaptchaDialogPosition()
        }
        window.addEventListener("resize", this.resizeListener)
      }
    },
    beforeDestroy: function() {
      if (this.resizeListener) {
        window.removeEventListener("resize", this.resizeListener)
      }
    }
}
</script>