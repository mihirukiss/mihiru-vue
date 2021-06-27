<template>
    <v-container fluid>
        <span class="top-span">好好地走下去</span>
        <span class="link-span"><a href="https://mihiru.com/onlooker/" title="管人食芥末">管人食芥末</a></span>
        <span class="link-span"><router-link to="/miarticles">怪弥书</router-link></span>
        <span class="link-span"><a href="https://mihiru.com/mikitube/" title="Mikitube">Mikitube</a></span>
        <span class="link-span"><a href="https://mahiru.cn" title="孟按钮">孟按钮</a></span>
        <span class="link-span"><a href="https://www.supermikimiki.com" title="弥按钮">弥按钮</a></span>
    </v-container>
</template>
<style scoped>
.container {
  height: 100%;
  background: linear-gradient(#b48ce6, #fb5458);
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.container a {
  text-decoration: none;
}
.container .link-span {
  margin-top: 1em;
  margin-bottom: 1em;
}
.container .top-span {
  color: #dddddd;
  margin-bottom: 1em;
  font-size: 2em;
}
</style>
<script>
export default {
    name: "Home",
    mounted: function() {
        document.documentElement.setAttribute("style","width:100%;height:100%")
        document.body.setAttribute("style","width:100%;height:100%")
    },
    beforeDestroy: function() {
        document.documentElement.removeAttribute("style")
        document.body.removeAttribute("style")
    }
}
</script>