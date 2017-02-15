<template>
  <div class="shopcart">
    <!-- 页脚购物车主体 -->
    <div class="content" @click="toggleList">
      <div class="content-left">
        <div class="logo-wrapper">
          <div class="logo" :class="{highlight: totalCount>0}">
            <span class="iconfont icon-shopping_cart"></span>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{highlight: totalCount>0}">￥{{totalPrice}}</div>
        <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="{'to-pay': totalPrice>=minPrice}" @click.stop.prevent="pay">
          {{payDesc}}
        </div>
      </div>
    </div>
    <!-- 曲线小球 -->
    <div class="ball-container">
      <!-- 对仅仅使用js操作的动画使用v-bind:false -->
      <transition-group name="drop" :css="false"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter">
        <div class="ball" v-for="(ball,index) in balls" v-show="ball.show" :key="index">
          <div class="inner inner-hook"></div>
        </div>
      </transition-group>
    </div>
    <!-- 购物车详情列表 -->
    <transition name='fold'>
      <div class="shopcart-list" v-show="listShow">
        <div class="list-header">
          <h1 class="title">购物车</h1>
          <span class="empty" @click="empty">清空</span>
        </div>
        <div class="list-content" ref="listContent">
          <ul>
            <li class="selecte-food border-1px" v-for="food in selectedFoods">
              <span class="name">{{food.name}}</span>
              <div class="price">
                <span>￥{{food.price*food.count}}</span>
              </div>
              <div class="carContral-wrapper">
                <add-car :food="food"></add-car>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </transition>
    <!-- 购物车遮罩层 -->
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="toggleList"></div>
    </transition>
  </div>

</template>

<script type="es6">
  import addCar from '../add-car/add-car';
  // 滑动插件
  import  BScroll from 'better-scroll';

  export default {
    props: {
      selectedFoods: {
        type: Array,
        default: function () {
          return [];
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        balls: [{show: false}, {show: false}, {show: false}, {show: false}, {show: false}],
        dropBall: [],   // 用于存储正在运动的小球
        fold: true
      }
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectedFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() {
        let totalCount = 0;
        this.selectedFoods.forEach((food) => {
          totalCount += food.count;
        });
        return totalCount;
      },
      payDesc() {
        let price = this.totalPrice;
        if (price === 0) {
          return `￥${this.minPrice}起送`;
        } else if (price >= this.minPrice) {
          return "去结算";
        } else {
          let leftPrice = this.minPrice - price
          return `还差￥${leftPrice}起送`;
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return;
        }
        let show = !this.fold;
        // 如果将展示购买清单
        if (show) {
          this.$nextTick(() => {
            // 不过存在scroll实利就不在需要创建了
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              });
            } else {
              // refresh表示重新计算视口和它内容的高度
              this.scroll.refresh();
            }
          })
        }
        return show;
      }
    },
    methods: {
      drop: function (el) {
        for (var i = this.dropBall.length; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.show = true;   // 触发动画,开始执行钩子函数
            ball.el = el;
            this.dropBall.push(ball);
            return;
          }
        }
      },
      toggleList: function () {
        if (!this.totalCount) return;
        this.fold = !this.fold;
      },
      empty: function () {
        this.selectedFoods.forEach((food) => {
          food.count = 0;
        })
      },
      pay: function () {
        if (this.totalPrice < this.minPrice) return;
        alert(`支付${this.totalPrice}元，(这个功能未完成)`);
      },
      // 以下为钩子函数
      beforeEnter: function (el) {
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count];
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect();
            let x = rect.left - 50;
            let y = -(window.innerHeight - rect.top - 50);
            el.style.transform = `translate3d(0, ${y}px, 0)`;
            el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.transform = `translate3d(${x}px, 0, 0)`;
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
          }
        }
      },
      enter: function (el, done) {
        // 触发浏览器重绘
        /* eslint-disable noused-vars */
        let rf = el.offsetHeight;
        // 等待浏览器重绘之后执行
        this.$nextTick(() => {
          el.style.transform = 'translate3d(0, 0, 0)';
          el.style.webkitTransform = 'translate3d(0, 0, 0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.transform = 'translate3d(0, 0, 0)';
          inner.style.webkitTransform = 'translate3d(0, 0, 0)';
        });
        done();
      },
      afterEnter: function (el) {
        let ball = this.dropBall.shift();
        if (ball) {
          setTimeout(function () {
            ball.show = false;
          },500)
        }
      }
    },
    components: {
      addCar,
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/css/mixin.less";

  .shopcart {
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 50;
    height: 48px;
    .content {
      display: flex;
      background: #141d27;
      height: 100%;
      font-size: 0;
      color: rgba(255, 255, 255, 0.4);
      .content-left {
        flex: 1;
        .logo-wrapper {
          display: inline-block;
          position: relative;
          top: -10px;
          padding: 6px;
          margin: 0 12px;
          box-sizing: border-box;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          text-align: center;
          background: #141d27;
          .logo {
            height: 100%;
            width: 100%;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            &.highlight {
              background: rgb(0, 160, 220);
              .icon-shopping_cart {
                color: #fff;
              }
            }
            .icon-shopping_cart {
              font-size: 24px;
              line-height: 44px;
            }
          }
          .num {
            position: absolute;
            top: 0;
            right: 0;
            width: 24px;
            height: 16px;
            line-height: 16px;
            text-align: center;
            border-radius: 8px;
            font-weight: 700;
            font-size: 9px;
            color: #fff;
            background-color: rgb(240, 0, 0);
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
          }
        }
        .price {
          display: inline-block;
          line-height: 24px;
          font-size: 16px;
          font-weight: 700;
          vertical-align: top;
          padding-right: 12px;
          margin-top: 12px;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          &.highlight {
            color: #fff;
          }
        }
        .desc {
          display: inline-block;
          vertical-align: top;
          margin: 12px 0 0 12px;
          line-height: 24px;
          font-size: 10px;
        }
      }
      .content-right {
        flex: 0 0 105px;
        text-align: center;
        line-height: 48px;
        font-weight: 700;
        background-color: rgba(255, 255, 255, 0.2);
        .pay {
          font-size: 12px;
          &.to-pay {
            color: #fff;
            font-weight: 700;
            background-color: #00b43c;
          }
        }
      }
    }
    .ball-container {
      .ball {
        position: fixed;
        left: 32px;
        bottom: 22px;
        z-index: 200;
        transition: all 0.5s cubic-bezier(.39, -0.39, 0.75, 0.48);
        .inner {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: rgb(0, 160, 220);
          transition: all 0.5s linear;
        }
      }
    }
    .shopcart-list {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      background: #fff;
      transition: all 0.3s;
      transform: translate3d(0, -100%, 0);
      &.fold-enter-active, &.fold-leave {
        transform: translate3d(0, -100%, 0);
      }
      &.fold-enter, &.fold-leave-active {
        transform: translate3d(0, 0, 0);
      }
      .list-header {
        height: 40px;
        line-height: 40px;
        padding: 0 18px;
        background-color: #f3f5f7;
        border-bottom: 1px solid rgba(7, 17, 27, 0.1);
        .title {
          margin: 0;
          float: left;
          font-size: 14px;
          color: rgb(7, 17, 27)
        }
        .empty {
          float: right;
          font-size: 12px;
          color: rgb(0, 160, 220);
        }
      }
      .list-content {
        padding: 0 18px;
        max-height: 217px;
        overflow: hidden;
        .selecte-food {
          padding: 12px 0;
          box-sizing: border-box;
          .border-1px(rgba(7, 17, 27, 0.1));
          .name {
            font-size: 14px;
            line-height: 24px;
            color: rgb(7, 17, 27);
          }
          .price {
            position: absolute;
            right: 90px;
            bottom: 12px;
            line-height: 24px;
            font-size: 14px;
            font-weight: 700;
            color: rgb(240, 20, 20);
          }
          .carContral-wrapper {
            position: absolute;
            right: 0;
            bottom: -6px;
          }
        }
      }
    }
  }

  .list-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: -2;
    transition: all 0.3s linear;
    // 在iphone可以看到模糊效果
    backdrop-filter: blur(10px);
    background: rgba(7, 17, 27, 0.6);
    &.fade-enter-active, &.fade-leave {
      opacity: 1;
      background: rgba(7, 17, 27, 0.6);
    }
    &.fade-enter, &.fade-leave-active {
      opacity: 0;
      background: rgba(7, 17, 27, 0);
    }
  }
</style>
