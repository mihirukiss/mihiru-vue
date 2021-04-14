<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-img alt="Logo" class="mr-2 flex-grow-0 flex-shrink-0" :src="require('../assets/logo.png')" transition="scale-transition" />
      <v-text-field label="搜索" append-icon="mdi-magnify" class="mx-2 flex-grow-1 flex-shrink-1" v-model="keyword" @click:append="searchBtnClick" @keydown="searchFieldKeydown" clearable solo hide-details dense></v-text-field>
      <v-icon class="flex-grow-0 flex-shrink-0" @click.stop="showConfigDrawer = !showConfigDrawer">mdi-cog</v-icon>
    </v-app-bar>
    <v-navigation-drawer v-model="showConfigDrawer" fixed temporary right>
      <v-card flat>
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
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import ArticleList from '../components/ArticleList.vue';
import ArticleDialog from '../components/ArticleDialog.vue';

export default {
  name: 'Home',

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
    if (localStorage.maxRatting) {
      this.maxRatting = localStorage.maxRatting
    }
    if (localStorage.allowTags) {
      this.allowTags = localStorage.allowTags.split(',')
    }
    if (localStorage.denyTags) {
      this.denyTags = localStorage.denyTags.split(',')
    }
    axios.get('https://cdn.mihiru.com/api/mi-articles/tags').then(response => this.tags = response.data)
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
      axios.post('https://cdn.mihiru.com/api/mi-articles/search', {
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
