<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-img alt="Logo" class="mr-2 flex-grow-0 flex-shrink-0" :src="require('./assets/logo.png')" transition="scale-transition" />
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
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
import ArticleList from './components/ArticleList.vue';

export default {
  name: 'App',

  components: {
    ArticleList
  },

  data: () => ({
    articles: null,
    pageIndex: 0,
    pageSize: 10,
    maxRatting: 0,
    keyword: '',
    rattingLabels: ['不显示', '部分显示', '全显示'],
    showConfigDrawer: false,
    tags: [],
    allowTags: [],
    denyTags: [],
    hasNextPage: false,
    lastSearchOptions: {
      maxRatting: 0,
      keyword: '',
      allowTags: [],
      denyTags: []
    }
  }),

  mounted: function(){
    if (localStorage.maxRatting) {
      this.maxRatting = localStorage.maxRatting
    }
    if (localStorage.allowTags) {
      this.allowTags = localStorage.allowTags
    }
    if (localStorage.denyTags) {
      this.denyTags = localStorage.denyTags
    }
    axios.get('http://localhost:8080/mi-articles/tags').then(response => this.tags = response.data)
    this.doSearch(false)
  },

  watch: {
    maxRatting(newMaxRatting) {
      localStorage.maxRatting = newMaxRatting
    },
    allowTags(newAllowTags) {
      localStorage.allowTags = newAllowTags
    },
    denyTags(newDenyTags) {
      localStorage.denyTags = newDenyTags
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
    doSearch(nextPage) {
      if (nextPage && !this.hasNextPage) {
        return
      } else if (nextPage){
        this.pageIndex++
      } else {
        this.pageIndex = 0
        this.lastSearchOptions.maxRatting = this.maxRatting
        this.lastSearchOptions.keyword = this.keyword
        this.lastSearchOptions.allowTags = [...this.allowTags]
        this.lastSearchOptions.denyTags = [...this.denyTags]
      }
      axios.post('http://localhost:8080/mi-articles/search', {
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        maxRatting: this.lastSearchOptions.maxRatting,
        keyword: this.lastSearchOptions.keyword,
        allowTags: this.lastSearchOptions.allowTags,
        denyTags: this.lastSearchOptions.denyTags
      }).then(response => {
        if (nextPage) {
          this.articles = this.articles.concat(response.data.data)
        } else {
          this.articles = response.data.data
        }
        this.hasNextPage = response.data.pageCount > this.pageIndex
      })
    }
  }
};
</script>
