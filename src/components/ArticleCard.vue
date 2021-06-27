<template>
    <v-dialog v-model="dialogOpen" fullscreen hide-overlay>
        <template v-slot:activator="{ on, attrs }">
            <v-card v-bind="attrs" v-on="on" class="d-flex flex-column ma-2" :color="rattingColor[article.ratting]" max-width="300">
                <v-card-title v-text="article.title"></v-card-title>
                <v-card-subtitle>{{article.author}}</v-card-subtitle>
                <v-card-text class="flex-grow-1" v-text="article.summary"></v-card-text>
                <v-card-text class="px-4 py-0">
                    <v-chip-group>
                        <v-chip v-for="tag in article.tags" :key="tag">{{ tag }}</v-chip>
                    </v-chip-group>
                </v-card-text>
            </v-card>
        </template>
        <v-card>
            <v-toolbar color="info">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on" @click="dialogOpen = false">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </template>
                    <span>关闭</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on" :data-clipboard-text="'https://mihiru.com/miarticles?id=' + article.id" class="copy-link" @click="copyLink">
                            <v-icon>mdi-content-copy</v-icon>
                        </v-btn>
                    </template>
                    <span>复制文章地址</span>
                </v-tooltip>
            </v-toolbar>
            <v-snackbar v-model="successNotice" centered color="success" :timeout="2000">链接已复制</v-snackbar>
            <v-snackbar v-model="errorNotice" centered multi-line color="error">
                链接复制失败, <a :href="'https://mihiru.com/miarticles?id=' + article.id">请右键(电脑)或长按(手机)此处手动复制链接.</a>
                <template v-slot:action="{ attrs }">
                    <v-btn color="red" text v-bind="attrs" @click="errorNotice = false">关闭</v-btn>
                </template>
            </v-snackbar>
            <v-card-title>{{ article.title }}</v-card-title>
            <v-card-subtitle>{{ article.author }}</v-card-subtitle>
            <v-card-text v-html="articleContent" class="article-content"></v-card-text>
            <v-card-actions>
                <v-btn outlined @click="dialogOpen = false">关闭</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'
import ClipboardJS from 'clipboard'

export default {
    name: "ArticleCard",
    data: ()=>({
        dialogOpen: false,
        articleContent: null,
        rattingColor: ['', 'warning', 'error'],
        successNotice: false,
        errorNotice: false
    }),
    props: {
        article: Object
    },
    watch: {
        dialogOpen(newValue) {
            if (newValue && this.articleContent === null) {
                axios.get(process.env.VUE_APP_API_PREFIX + '/mi-articles/' + this.article.id + '?v=' + this.article.version).then(response => this.articleContent = response.data.content)
            }
        }
    },
    methods: {
        copyLink(){
            const clipboard = new ClipboardJS('.copy-link', {
                container: document.querySelector('.v-dialog')
            });
            const card = this;
            clipboard.on('success', function() {
                card.successNotice = true
                clipboard.destroy()
            })
            clipboard.on('error', function() {
                card.errorNotice = true
                clipboard.destroy()
            })
        }
    }
}
</script>