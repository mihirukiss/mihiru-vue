<template>
  <v-app>
      <v-container fluid>
        <v-container class="slot-sontainer d-flex flex-column align-center">
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
        <v-container class="d-flex flex-column align-center">
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
      requestAnimationFrameId: null
    }),
    computed: {
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
        this.initCanvas()
    }
}
</script>