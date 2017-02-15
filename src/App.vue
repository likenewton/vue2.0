<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item"><router-link to="/goods">商品</router-link></div>
      <div class="tab-item"><router-link to="/ratings">评论</router-link></div>
      <div class="tab-item"><router-link to="/seller">商家</router-link></div>
    </div>
    <router-view :goods="goods" :seller="seller"></router-view>
  </div>
</template>

<script type="es6">
  const ERR_OK = 0;
  import header from './components/header/header.vue'
  export default {
    data() {
      return {
        seller: {},
        goods: [],
        ratings: [],
      }
    },
    created() {
      this.$http.get('/api/seller').then((responce) => {
        responce = responce.body;
        if(responce.errno == ERR_OK) {
          this.seller = responce.data;
        }
      });
    },
    components: {
      vHeader: header
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "./common/css/mixin.less";

  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    .border-1px(rgba(7,17,27,0.1));
    .tab-item {
      flex: 1;
      text-align: center;
      a {
        display: block;
        font-size: 14px;
        color: rgb(77,85,93);
      }
      a.active {
        color: rgb(240,20,20);
      }
    }
  }

</style>
