<template>
    <v-container class="d-inline-flex flex-wrap justify-center" fluid>
        <article-card v-for="article in articles" :article="article" v-bind:key="article.id"></article-card>
    </v-container>
</template>

<script>
import ArticleCard from './ArticleCard.vue'
export default {
    name: "ArticleList",
    components: { ArticleCard },
    props: {
        articles: Array
    }
}
</script>