<template>
    <v-card class="memory-card" width="100%">
        <v-card-text class="user-profile">
            <img class="avatar" :src="dataUrlPrefix +'img/' + memory.user_profile.face + '@48w_48h' + (memory.user_profile.face.endsWith('.gif')?'.gif':'.jpg')" />
            <div class="user-info">
                <div class="user-name">{{ memory.user_profile.uname }}</div>
            </div>
        </v-card-text>
        <v-card-text v-if="memory.content">
            <span>{{ memory.content }}</span>
        </v-card-text>
        <v-card-text v-if="memory.cuts">

        </v-card-text>
    </v-card>
</template>
<script>
export default {
    name: "MemoryCard",
    data: ()=>({
        dataUrlPrefix: process.env.VUE_APP_API_MEMORY_DATA_PREFIX
    }),
    props: {
        memory: Object
    }
}
</script>