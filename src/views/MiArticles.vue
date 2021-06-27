<template>
  <v-app>
    <v-app-bar
      app
      color="info"
    >
      <router-link to="/"><v-img alt="Logo" class="mr-2 flex-grow-0 flex-shrink-0" :src="require('../assets/logo.png')" transition="scale-transition" /></router-link>
      <v-text-field label="搜索" append-icon="mdi-magnify" class="mx-2 flex-grow-1 flex-shrink-1" v-model="keyword" @click:append="searchBtnClick" @keydown="searchFieldKeydown" clearable solo hide-details dense></v-text-field>
      <v-icon class="flex-grow-0 flex-shrink-0 mr-2" @click.stop="showHelpDialog = !showHelpDialog">mdi-help-circle-outline</v-icon>
      <v-icon class="flex-grow-0 flex-shrink-0" @click.stop="showConfigDrawer = !showConfigDrawer">mdi-cog</v-icon>
    </v-app-bar>
    <v-navigation-drawer v-model="showConfigDrawer" fixed temporary right>
      <v-card flat>
        <v-card-text>
          <v-switch v-model="darkMode" label="夜间模式"></v-switch>
        </v-card-text>
        <v-subheader>是否显示NSFW文章</v-subheader>
        <v-card-text>
          <v-slider v-model="maxRatting" :tick-labels="rattingLabels" :max="2" tick-size="3" ticks="always"></v-slider>
        </v-card-text>
        <v-subheader>仅显示包含以下标签的文章</v-subheader>
        <v-card-text>
          <v-autocomplete v-model="allowTags" :items="tags" solo chips clearable multiple></v-autocomplete>
        </v-card-text>
        <v-subheader>不显示包含以下标签的文章</v-subheader>
        <v-card-text>
          <v-autocomplete v-model="denyTags" :items="tags" solo chips clearable multiple></v-autocomplete>
        </v-card-text>
        <v-card-text>修改配置将在下次搜索时生效</v-card-text>
      </v-card>
    </v-navigation-drawer>

    <v-main>
      <article-list :articles="articles" />
      <article-dialog v-if="articleId" :articleId="articleId"></article-dialog>
      <v-overlay :value="loading">
        <v-progress-circular indeterminate size="64"></v-progress-circular>
      </v-overlay>
      <v-dialog v-model="showHelpDialog">
        <v-card>
            <v-toolbar color="primary">
                <v-btn icon @click="showHelpDialog = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-toolbar>
            <v-card-title>注意</v-card-title>
            <v-card-text>
              <p>本站点仅为个人兴趣建立, 与任何运营或Liver无关, 文章内容均为虚构, 如有雷同, 纯属巧合. 怪文书难免有冲塔、乱组CP及黑屁等要素, 观看前请自行做好心理准备.</p>
            </v-card-text>
            <v-card-title>使用帮助</v-card-title>
            <v-card-text>
              <p>点击右上方齿轮图标可配置标签黑白名单, 修改后的配置将在下次搜索或刷新页面后生效.</p>
              <p>顶部的搜索框可输入关键字搜索标题、作者或正文中包含该关键字的文章.</p>
            </v-card-text>
            <v-card-title>其他说明</v-card-title>
            <v-card-text>
              <p>目前站内文章主要来自S1 V区, 另有部分来自NGA V区和网友投稿等. 因为是人力收集, 难免有遗漏, 如果你发现有值得收录的文章, 欢迎来信告知. 因为难以一一请求转载许可, 如果你不想自己撰写的文章被收录, 可以联系我删除. 之前也考虑过收录B站上的文章, 但因为B站文章基本标注禁止转载所以放弃了, 如果你有在B站上写的文章同意收录的话请来信告知. 当然也欢迎直接通过邮件投稿. 一切联络事项请发送邮件至kiss#mihiru.com (请自行替换#为@)</p>
            </v-card-text>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>
<style scoped>
@import "../assets/css/miarticles.css";
@import url(https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css);
</style>
<script>
import axios from 'axios'
import ArticleList from '../components/ArticleList.vue';
import ArticleDialog from '../components/ArticleDialog.vue';

export default {
  name: 'MiArticles',

  components: {
    ArticleList,
    ArticleDialog
  },

  data: () => ({
    articles: null,
    loading: false,
    maxRatting: 0,
    keyword: '',
    rattingLabels: ['不显示', '部分显示', '全显示'],
    showConfigDrawer: false,
    tags: [],
    allowTags: [],
    denyTags: [],
    showHelpDialog: false,
    darkMode: false,
    theme: '',
    lastSearchOptions: {
      loadingRequestId: null,
      hasNextPage: false,
      pageSize: 10,
      pageIndex: 0,
      maxRatting: 0,
      keyword: '',
      allowTags: [],
      denyTags: []
    }
  }),

  props: {
    articleId: String
  },

  mounted: function(){
    if (localStorage.darkMode) {
      this.darkMode = localStorage.darkMode=='true'
      this.$vuetify.theme.dark = this.darkMode
    }
    if (localStorage.maxRatting) {
      this.maxRatting = localStorage.maxRatting
    }
    if (localStorage.allowTags) {
      this.allowTags = localStorage.allowTags.split(',')
    }
    if (localStorage.denyTags) {
      this.denyTags = localStorage.denyTags.split(',')
    }
    if (!localStorage.alreadyShowHelpDialog) {
      localStorage.alreadyShowHelpDialog = true
      this.showHelpDialog = true
    }
    axios.get(process.env.VUE_APP_API_PREFIX + '/mi-articles/tags').then(response => this.tags = response.data)
    this.doSearch(false)
    addEventListener('scroll', this.handleScroll)
  },

  watch: {
    maxRatting(newMaxRatting) {
      localStorage.maxRatting = newMaxRatting
    },
    allowTags(newAllowTags) {
      localStorage.allowTags = newAllowTags.join(',')
    },
    denyTags(newDenyTags) {
      localStorage.denyTags = newDenyTags.join(',')
    },
    darkMode(newDarkMode) {
      localStorage.darkMode = newDarkMode
      this.$vuetify.theme.dark = newDarkMode
    }
  },

  methods: {
    searchBtnClick() {
      this.doSearch(false)
    },
    searchFieldKeydown(event) {
      if (!event.isComposing && event.key === 'Enter') {
        this.searchBtnClick()
      }
    },
    handleScroll(){
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
      if((scrollTop + windowHeight >= scrollHeight - 100) && !this.loading){
        this.doSearch(true)
      }
    },
    doSearch(nextPage) {
      if (nextPage && !this.lastSearchOptions.hasNextPage) {
        return
      }
      this.loading = true
      const newLoadingRequestId = new Date().getTime()
      this.lastSearchOptions.loadingRequestId = newLoadingRequestId
      if (nextPage){
        this.lastSearchOptions.pageIndex++
      } else {
        this.lastSearchOptions.pageIndex = 0
        this.lastSearchOptions.maxRatting = this.maxRatting
        this.lastSearchOptions.keyword = this.keyword
        this.lastSearchOptions.allowTags = [...this.allowTags]
        this.lastSearchOptions.denyTags = [...this.denyTags]
        this.lastSearchOptions.pageSize = Math.max(10, Math.max(1, Math.ceil(document.body.clientWidth/320)) * (Math.max(1, Math.ceil(document.body.clientHeight/300)) + 1))
      }
      axios.post(process.env.VUE_APP_API_PREFIX + '/mi-articles/search', {
        pageIndex: this.lastSearchOptions.pageIndex,
        pageSize: this.lastSearchOptions.pageSize,
        maxRatting: this.lastSearchOptions.maxRatting,
        keyword: this.lastSearchOptions.keyword,
        allowTags: this.lastSearchOptions.allowTags,
        denyTags: this.lastSearchOptions.denyTags
      }).then(response => {
        if (!this.lastSearchOptions.loadingRequestId === newLoadingRequestId) {
          return
        }
        if (nextPage) {
          this.articles = this.articles.concat(response.data.data)
        } else {
          this.articles = response.data.data
        }
        this.lastSearchOptions.hasNextPage = response.data.pageCount > (this.lastSearchOptions.pageIndex + 1)
        this.loading = false
      })
    }
  }
};
</script>
