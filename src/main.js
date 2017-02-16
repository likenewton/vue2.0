// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import Goods from './components/goods/goods';
import Ratings from './components/ratings/ratings';
import Seller from './components/seller/seller';

import './common/css/index.less';

// 注册全局变量
Vue.use(VueRouter);
Vue.use(VueResource);   // ajax请求
// 定义路由
const routes = [
  { path: '/goods', component: Goods },
  { path: '/ratings', component: Ratings },
  { path: '/seller', component: Seller },
  { path: '/', redirect: '/goods' },
  { path: '*', redirect: '/goods' },
];
// 创建一个路由实例
const router = new VueRouter({
  // html5的history模式
  mode: 'history',
  routes,
  linkActiveClass: 'active',
});
// 挂载根属性
const app = new Vue({
  data: {
    eventHub: new Vue(),  // 初始化一个vm实例，用于后面接受子组件传递过来的数据
  },
  router,
  template: '<App/>',
  components: { App },
});

app.$mount('#app');

