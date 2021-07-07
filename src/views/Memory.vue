<template>
    <v-app>
        <v-container class="sub-container d-flex flex-wrap">
            <div class="date-line">
                <div class="prev-day" @click="dateIndex = Math.max(dateIndex - 1, 0)">
                    <div class="year">{{ dateIndex &gt; 0 ? dateList[dateIndex - 1].substring(0, 4) : "0000" }}</div>
                    <div class="date">{{ dateIndex &gt; 0 ? dateList[dateIndex - 1].substr(5) : "00.00" }}</div>
                </div>
                <v-menu v-model="showCalendar" absolute offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-card class="curr-day" v-bind="attrs" v-on="on" flat>
                            <div class="year">{{ dateList[dateIndex].substring(0, 4) }}</div>
                            <div class="date">{{ dateList[dateIndex].substr(5) }}</div>
                        </v-card>
                    </template>
                    <v-date-picker v-model="currDate" :allowed-dates="allowedDates" @change="currDateChange" no-title></v-date-picker>
                </v-menu>
                <div class="next-day" @click="dateIndex = Math.min(dateIndex + 1, dateList.length - 1)">
                    <div class="year">{{ dateIndex &lt; dateList.length - 1 ? dateList[dateIndex + 1].substring(0, 4) : "9999" }}</div>
                    <div class="date">{{ dateIndex &lt; dateList.length - 1 ? dateList[dateIndex + 1].substr(5) : "99.99" }}</div>
                </div>
            </div>
            <memory-card v-for="memory in currDatas" :memory="memory" v-bind:key="memory.id"></memory-card>
        </v-container>
    </v-app>
</template>
<style scoped>
@import "../assets/css/memory.css";
@import url(https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css);
div.v-application {
    background-color: #FCFAF2; /* fallback for old browsers */
    background-image: url(../assets/texture.png);
    background-repeat: repeat;
    min-height: 100%;
}

.sub-container {
    background: transparent;
}
</style>
<script>
import axios from 'axios'
import MemoryCard from '../components/MemoryCard.vue'

export default {
  components: { MemoryCard },
    name: "Memory",
    data: ()=>({
        dateList: ['2019.10.28'],
        dayDatas: [],
        dateIndex: 0,
        dateData: {},
        currDate: '2019-10-28',
        currDatas: [],
        showCalendar: false
    }),
    mounted: function(){
        axios.get(process.env.VUE_APP_API_MEMORY_PREFIX + 'days').then(response => {
            this.dayDatas = response.data
            const dateList = new Array()
            for (let i = 0; i < response.data.length; i++) {
                dateList.push(response.data[i].day)
            }
            this.dateList = dateList
        })
    },
    watch: {
        dateIndex(newDateIndex) {
            this.currDate = this.dateList[newDateIndex].replaceAll('.', '-')
            if (!this.dateData[newDateIndex]) {
                axios.get(process.env.VUE_APP_API_MEMORY_PREFIX + 'day/' + this.dateList[newDateIndex] + '?v=' + this.dayDatas[newDateIndex].version).then(response => {
                    this.dateData[newDateIndex] = response.data
                    if (newDateIndex == this.dateIndex) {
                        this.currDatas = this.dateData[newDateIndex]
                    }
                })
            } else {
                this.currDatas = this.dateData[newDateIndex]
            }
        }
    },
    methods: {
        allowedDates: function(val){
            return this.dateList.indexOf(val.replaceAll("-", "."))>-1
        },
        currDateChange: function(val){
            const index = this.dateList.indexOf(val.replaceAll("-", "."))
            if (index > -1) {
                this.dateIndex = index
            } else {
                this.currDate = this.dateList[this.dateIndex].replaceAll('.', '-')
            }
        }
    }
}
</script>