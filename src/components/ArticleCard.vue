<template>
    <v-dialog v-model="dialogOpen" fullscreen hide-overlay>
        <template v-slot:activator="{ on, attrs }">
            <v-card v-bind="attrs" v-on="on" :class="'d-flex flex-column ma-2' + rattingColor[article.ratting]" max-width="300">
                <v-card-title v-text="article.title"></v-card-title>
                <v-card-subtitle>{{article.author}}</v-card-subtitle>
                <v-card-text class="flex-grow-1" v-text="article.summary"></v-card-text>
                <v-card-text class="px-4 py-0">
                    <v-chip-group>
                        <v-chip v-for="tag in article.tags.split(',')" :key="tag" :class="rattingTagColor[article.ratting]">{{ tag }}</v-chip>
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
            <v-card-text v-html="articleContent" class="article-content"></v-card-text>
            <v-card-actions>
                <v-btn text class="grey lighten-2" @click="dialogOpen = false">关闭</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'

export default {
    name: "ArticleCard",
    data: ()=>({
        dialogOpen: false,
        articleContent: null,
        rattingColor: ['', ' orange accent-2', ' red darken-2'],
        rattingTagColor: ['', 'orange lighten-3', 'red lighten-3']
    }),
    props: {
        article: Object
    },
    watch: {
        dialogOpen(newValue) {
            if (newValue && this.articleContent === null) {
                axios.get('https://cdn.mihiru.com/api/mi-articles/' + this.article.id + '?v=' + this.article.version).then(response => this.articleContent = response.data.content)
            }
        }
    }
}
</script>

<style>
.article-content img {
    max-width: 100%;
}
</style>