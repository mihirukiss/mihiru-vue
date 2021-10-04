<template>
  <v-app>
      <v-container fluid>
        <div class="text-center">
          <picture>
            <source type="image/webp" :srcset="require('../assets/moon_lite.webp')" />
            <img :src="require('../assets/moon_lite.jpg')" />
          </picture>
        </div>
        <v-container v-if="showCaptcha" class="d-flex flex-column align-center">
          <div class="captcha-notice">不用担心, 我们并没有认为你是机器人, 或者女鬼恶魔鲨鱼水母企鹅外星人, 这只是一个随机出现的页面.</div>
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
        <v-container class="link-container" v-if="!showCaptcha">
          <span class="link-span" style="top: 0px; left: 100px;"><router-link to="/memory">历久弥真</router-link></span>
          <span class="link-span" style="top: 36px; left: 28px;"><router-link to="/miarticles">怪弥书</router-link></span>
          <span class="link-span" style="top: 100px; left: 172px;"><router-link to="/slot">摇摇乐</router-link></span>
          <span class="link-span" style="top: 140px; left: 120px;"><a href="https://www.supermikimiki.com" title="弥按钮">弥按钮</a></span>
          <span class="link-span" style="top: 222px; left: 138px;"><a href="https://mahiru.cn" title="孟按钮">孟按钮</a></span>
          <span class="link-span" style="top: 286px; left: 140px;"><a href="https://mihiru.com/onlooker/" title="管人食芥末">管人食芥末</a></span>
          <span class="link-span" style="top: 359px; left: 200px;"><a href="https://mihiru.com/mikitube/" title="Mikitube">Mikitube</a></span>
        </v-container>
      </v-container>
  </v-app>
</template>
<style scoped>
div.v-application {
  background-color: #111111;
  min-height: 100%;
}
.link-container {
  width: 300px;
  position: relative;
}
.container .link-span {
  position: absolute;
}
.container .link-span a {
  text-decoration: none;
  color: #F5F5F5;
  text-shadow: 0 0 10px white;
}
.container .link-span a::before {
  content: '・';
}
.container .link-span:nth-child(1) a::before {
	animation: glitter 4.5s linear 0s infinite normal;
}
.container .link-span:nth-child(2) a::before {
	animation: glitter 4s linear 0s infinite normal;
}
.container .link-span:nth-child(3) a::before {
	animation: glitter 7s linear 0s infinite normal;
}
.container .link-span:nth-child(4) a::before {
	animation: glitter 9s linear 0s infinite normal;
}
.container .link-span:nth-child(5) a::before {
	animation: glitter 6.5s linear 0s infinite normal;
}
.container .link-span:nth-child(6) a::before {
	animation: glitter 5s linear 0s infinite normal;
}
.container .link-span:nth-child(7) a::before {
	animation: glitter 4s linear 0s infinite normal;
}
@keyframes glitter {
	0%   { transform: scale(1.0); opacity: 1; }
	25%  { transform: scale(0.5); opacity: 0; }
	50%  { transform: scale(1.0); opacity: 1; }
	75%  { transform: scale(0.5); opacity: 0; }
	100% { transform: scale(1.0); opacity: 1; }
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
.captcha-notice {
  padding: 10px;
  color: #dddddd;
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
      }
    },
    mounted: function() {
      if (this.showCaptcha) {
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