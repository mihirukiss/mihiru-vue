<template>
    <v-dialog v-model="dialogOpen" fullscreen hide-overlay>
        <v-card>
            <v-toolbar color="info">
                <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on" @click="closeDialog">
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
            <v-card-text v-html="article.content" class="article-content"></v-card-text>
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
    name: "ArticleDialog",
    data: ()=>({
        dialogOpen: true,
        article: {},
        successNotice: false,
        errorNotice: false
    }),
    props: {
        articleId: String
    },
    mounted: function(){
        document.getElementsByTagName('html')[0].className = 'overflow-y-hidden'
        axios.get(process.env.VUE_APP_API_PREFIX + '/mi-articles/' + this.articleId).then(response => this.article = response.data)
    },
    methods: {
        closeDialog(){
            document.getElementsByTagName('html')[0].className = ''
            this.dialogOpen = false
        },
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