<template>
    <v-app>
        <v-container class="sub-container d-flex flex-wrap">
            <div class="date-line">
                <div :class="'prev-day' + (dateIndex > 0 ? ' cursor-pointer' : '')" @click="dateIndex = Math.max(dateIndex - 1, 0)">
                    <div class="year">{{ dateIndex &gt; 0 ? dateList[dateIndex - 1].substring(0, 4) : "0000" }}</div>
                    <div class="date">{{ dateIndex &gt; 0 ? dateList[dateIndex - 1].substr(5) : "00.00" }}</div>
                </div>
                <v-menu v-model="showCalendar" :close-on-content-click="false" absolute offset-y>
                    <template v-slot:activator="{ on, attrs }">
                        <v-card class="curr-day" v-bind="attrs" v-on="on" flat>
                            <div class="year">{{ dateList[dateIndex].substring(0, 4) }}</div>
                            <div class="date">{{ dateList[dateIndex].substr(5) }}</div>
                        </v-card>
                    </template>
                    <v-date-picker v-model="currDate" locale="zh-cn" :allowed-dates="allowedDates" @change="currDateChange" @input="showCalendar = false" no-title></v-date-picker>
                </v-menu>
                <div :class="'next-day' + (dateIndex < dateList.length - 1 ? ' cursor-pointer' : '')" @click="dateIndex = Math.min(dateIndex + 1, dateList.length - 1)">
                    <div class="year">{{ dateIndex &lt; dateList.length - 1 ? dateList[dateIndex + 1].substring(0, 4) : "9999" }}</div>
                    <div class="date">{{ dateIndex &lt; dateList.length - 1 ? dateList[dateIndex + 1].substr(5) : "99.99" }}</div>
                </div>
            </div>
            <memory-card v-for="memory in currDatas" :memory="memory" v-bind:key="memory.id"></memory-card>
            <div class="text-center full-width"><router-link class="no-decoration" to="/">返回首页</router-link></div>
        </v-container>
    </v-app>
</template>
<style scoped>
@import "../assets/css/memory.css";
@import "../assets/css/materialdesignicons.css";
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
        showCalendar: false,
        loadingDatas: [{"id":"loading","type":-1}]
    }),
    mounted: function(){
        axios.get(process.env.VUE_APP_API_MEMORY_PREFIX + 'days').then(response => {
            this.dayDatas = response.data
            const dateList = new Array()
            for (let i = 0; i < response.data.length; i++) {
                dateList.push(response.data[i].day)
            }
            this.dateList = dateList
            this.loadDayData(0)
        })
    },
    watch: {
        dateIndex(newDateIndex) {
            this.currDate = this.dateList[newDateIndex].replaceAll('.', '-')
            if (!this.dateData[newDateIndex]) {
                this.loadDayData(newDateIndex)
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
        },
        loadDayData: function(index) {
            this.currDatas = this.loadingDatas
            axios.get(process.env.VUE_APP_API_MEMORY_PREFIX + 'day/' + this.dateList[index] + '?v=' + this.dayDatas[index].version).then(response => {
                this.dateData[index] = response.data
                if (index == this.dateIndex) {
                    this.currDatas = this.dateData[index]
                }
            })
        }
    }
}
</script>