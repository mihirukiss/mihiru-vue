<template>
    <v-container class="main-container" fluid>
        <v-container class="sub-container d-flex flex-wrap">
            <div class="date-line">
                <span class="prev-day" v-if="dateIndex &gt; 0" @click="dateIndex = dateIndex - 1">{{ dateList[dateIndex - 1] }}</span>
                <span class="curr-day">{{ dateList[dateIndex] }}</span>
                <span class="prev-day" v-if="dateIndex &lt; dateList.length - 1" @click="dateIndex = dateIndex + 1">{{ dateList[dateIndex + 1] }}</span>
            </div>
            
        </v-container>
    </v-container>
</template>
<style scoped>
@import url(https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css);
.main-container {
    background-image: url('../assets/star.jpg');
    background-size: cover;
    min-height: 100%;
}

.sub-container {
    background: transparent;
}
</style>
<script>
import axios from 'axios'

export default {
    name: "Memory",
    data: ()=>({
        dateList: ['2019-10-28'],
        dateIndex: 0,
        dateData: [false]
    }),
    watch: {
        dateIndex(newDateIndex) {
            if (!this.dateData[newDateIndex]) {
                axios.get(process.env.VUE_APP_API_MEMORY_PREFIX + this.dateList[newDateIndex]).then(response => this.dateData[newDateIndex] = response.data)
            }
        }
    },
    mounted: function() {
        document.documentElement.setAttribute("style","width:100%;height:100%")
        document.body.setAttribute("style","width:100%;height:100%")
    },
    beforeDestroy: function() {
        document.documentElement.removeAttribute("style")
        document.body.removeAttribute("style")
    }
}
</script>