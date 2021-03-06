import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import('../views/Home.vue')
const MiArticles = () => import('../views/MiArticles.vue')
const Memory = () => import('../views/Memory.vue')
const SlotGame = () => import('../views/SlotGame.vue')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: "Mihiru"
    }
  },
  {
    path: '/miarticles',
    name: 'MiArticles',
    component: MiArticles,
    props: route => ({articleId: route.query.id}),
    meta: {
      title: "怪弥书"
    }
  },
  {
    path: '/memory',
    name: 'Memory',
    component: Memory,
    meta: {
      title: "历久弥真"
    }
  },
  {
    path: '/slot',
    name: 'SlotGame',
    component: SlotGame,
    meta: {
      title: "摇摇乐"
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
