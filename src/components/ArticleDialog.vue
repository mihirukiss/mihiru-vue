<template>
    <v-dialog v-model="dialogOpen" fullscreen hide-overlay>
        <v-card>
            <v-toolbar dark color="primary">
                <v-btn icon dark @click="closeDialog">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-title>{{ article.title }}</v-card-title>
            <v-card-subtitle>{{ article.author }}</v-card-subtitle>
            <v-card-text v-html="article.content"></v-card-text>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'

export default {
    name: "ArticleDialog",
    data: ()=>({
        dialogOpen: true,
        article: {}
    }),
    props: {
        articleId: String
    },
    mounted: function(){
        document.getElementsByTagName('html')[0].className = 'overflow-y-hidden'
        axios.get('https://cdn.mihiru.com/api/mi-articles/' + this.articleId).then(response => this.article = response.data)
    },
    methods: {
        closeDialog(){
            document.getElementsByTagName('html')[0].className = ''
            this.dialogOpen = false
        }
    }
}
</script>