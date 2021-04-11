<template>
    <v-dialog v-model="dialogOpen" fullscreen hide-overlay>
        <template v-slot:activator="{ on, attrs }">
            <v-card v-bind="attrs" v-on="on" class="ma-2" max-width="300">
                <v-card-title v-text="article.title"></v-card-title>
                <v-card-subtitle>{{article.author}}</v-card-subtitle>
                <v-card-text v-text="article.summary"></v-card-text>
                <v-card-text class="px-4 py-0">
                    <v-chip-group>
                        <v-chip v-for="tag in article.tags.split(',')" :key="tag">{{ tag }}</v-chip>
                    </v-chip-group>
                </v-card-text>
            </v-card>
        </template>
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="dialogOpen = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-title>{{ article.title }}</v-card-title>
            <v-card-subtitle>{{ article.author }}</v-card-subtitle>
            <v-card-text v-html="articleContent"></v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'

export default {
    name: "ArticleCard",
    data: ()=>({
        dialogOpen: false,
        articleContent: null
    }),
    props: {
        article: Object
    },
    watch: {
        dialogOpen(newValue) {
            if (newValue && this.articleContent === null) {
                axios.get('http://localhost:8080/mi-articles/' + this.article.id + '?v=' + this.article.version).then(response => this.articleContent = response.data.content)
            }
        }
    }
}
</script>