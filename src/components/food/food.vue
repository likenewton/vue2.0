<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref='foodContainer'>
      <div class="food-content">
        <!-- 大图片 -->
        <div class="img-header">
          <img :src="food.image">
          <div class="back">
            <i class="iconfont icon-arrow_lift" @click="hide"></i>
          </div>
        </div>
        <!-- 食物详细 -->
        <div class="content">
          <h2 class="name">{{food.name}}</h2>
          <p class="desc">{{food.description}}</p>
          <div class="extra">
            <span class="month-sell">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now-price">
              <span>￥</span>{{food.price}}
            </span>
            <span v-show="food.oldPrice" class="delete-price">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <div v-show="food.count>0" class="add-cart-wrapper">
              <add-car :food="food"></add-car>
            </div>
            <transition name="fade">
              <div v-show="food.count===0||!food.count" class="add-cart" @click.stop.prevent="addFirstFood">加入购物车</div>
            </transition>
          </div>
        </div>
        <split v-show="food.info"></split>
        <!-- 商品信息 -->
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <!-- 商品评价 -->
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <!-- 筛选评论的组件 -->
          <rating-select :ratings="food.ratings" :select-type="selectType"
                         :only-content="onlyContent" :desc="desc"
                         v-on:type="selectTypeChange" v-on:content="onlyContentChange">
          </rating-select>
          <!-- 具体的评论详细 -->
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings"
                  class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" :src="rating.avatar" width="12" height="12">
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <i class="iconfont" :class="[{'icon-thumb_up':rating.rateType===0},
                  {'icon-thumb_down':rating.rateType===1}]"></i>
                  <span>{{rating.text}}</span>
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="es6">
  import BScroll from 'better-scroll';
  import addCar from '../add-car/add-car';
  import Vue from 'vue';
  import split from '../split/split';
  import ratingSelect from '../rating-select/rating-select';
  import formatDate from '../../common/js/formatDate';

  // vue.js2.0之能
  Vue.filter('formatDate', function (time) {
    let date = new Date(time);
    return formatDate(date, 'yyyy-mm-dd hh:ff');
  });

  const ALL = 2;

  export default {
    props: {
      food: {
        type: Object
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          nagative: '吐槽'
        }
      }
    },
    methods: {
      show: function () {
        this.showFlag = true;
        // 在该组件内始终是显示所有评论
        this.selectType = ALL;
        this.onlyContent = false;
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foodContainer, {
              click: true
            })
          } else {
            this.scroll.refresh();
          }
        })
      },
      hide: function () {
        this.showFlag = false;
      },
      addFirstFood: function (event) {
        // 防止多次点击(pc端没有_constructed属性
        if (!event._constructed) {
          return;
        }
        // 发送一个事件，以达到能够实现抛物线小球动画
        this.$root.eventHub.$emit('add-count', event.target);
        Vue.set(this.food, 'count', 1);
      },
      needShow: function (type, text) {
        // 当要显示有文本的评论，把没有文本的过滤掉
        if (this.onlyContent && !text) {
          return false;
        }
        // 如果此时选中的是所有需要展示的评论,则显示所有
        if (this.selectType === ALL) {
          return true;
        } else {
          // 不然则选择类型相同的
          return this.selectType === type;
        }
      },
      selectTypeChange: function (type) {
        this.selectType = type;
        // 等dom渲染完成后再刷新
        this.$nextTick(() => {
          this.scroll.refresh();
        })
      },
      onlyContentChange: function (isShowHasContentRating) {
        this.onlyContent = isShowHasContentRating;
        this.$nextTick(() => {
          this.scroll.refresh();
        })
      }
    },
    beforeRouteLeave (to, from, next) {
      this.$root.eventHub.$off('select-type');
      this.$root.eventHub.$off('only-content');
      next();
    },
    components: {
      addCar,
      split,
      ratingSelect
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/css/mixin";

  .food {
    position: fixed;
    left: 0;
    top: 0;
    overflow: hidden;
    box-sizing: border-box;
    bottom: 48px;
    z-index: 30;
    width: 100%;
    background-color: #fff;
    transition: all 0.2s linear;
    &.move-enter-active, &.move-leave {
      transform: translate3d(0, 0, 0);
    }
    &.move-enter, &.move-leave-active {
      transform: translate3d(100%, 0, 0);
    }
    .img-header {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 100%;
      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .back {
        position: absolute;
        top: 10px;
        left: 0;
        .icon-arrow_lift {
          display: block;
          padding: 10px;
          color: #fff;
          font-size: 20px;

        }
      }
    }
    .content {
      position: relative;
      padding: 18px;
      flex: 1;
      .cartcontrol-wrapper {
        position: absolute;
        right: 12px;
        bottom: 18px;
        .add-cart-wrapper {
          position: relative;
          right: 18px;
          .addCar {
            bottom: 0;
          }
        }
        .add-cart {
          position: absolute;
          right: 18px;
          bottom: 0;
          z-index: 10;
          line-height: 26px;
          height: 24px;
          padding: 0 12px;
          box-sizing: border-box;
          font-size: 10px;
          border-radius: 12px;
          background-color: rgb(0, 160, 220);
          color: #fff;
          width: 74px;
          transition: opacity 0.3s;
          &.fade-enter-active, &.fade-leave {
            opacity: 1;
          }
          &.fade-enter, &.fade-leave-active {
            opacity: 0;
          }
        }
      }
      .name {
        font-size: 14px;
        margin: 2px 0 8px 0;
        height: 14px;
        line-height: 14px;
        color: rgb(7, 17, 27);
      }
      .desc {
        font-size: 10px;
        line-height: 12px;
        color: rgb(143, 153, 159);
      }
      .extra {
        margin: 8px 0 18px 0;
        font-size: 10px;
        line-height: 10px;
        color: rgb(143, 153, 159);
        .month-sell {
          margin-right: 12px;
        }
      }
      .price {
        line-height: 24px;
        font-size: 10px;
        color: rgb(143, 153, 159);
        .now-price {
          font-weight: 700;
          font-size: 14px;
          color: rgb(240, 20, 20);
          span {
            font-size: 10px;
            font-weight: normal;
          }
        }
        .delete-price {
          text-decoration: line-through;
          font-size: 10px;
        }
      }
    }
    .info {
      padding: 18px;
      .title {
        margin: 0;
        line-height: 14px;
        margin-bottom: 6px;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }
      .text {
        line-height: 24px;
        font-size: 12px;
        color: rgb(77, 85, 93);
      }
    }
    .rating {
      padding-top: 18px;
      .title {
        margin: 0 0 0 18px;
      }
      .rating-wrapper {
        padding: 0 18px;
        .rating-item {
          position: relative;
          padding: 16px 0;
          .border-1px(rgba(7, 17, 27, 0.1));
          .user {
            position: absolute;
            top: 16px;
            right: 0;
            font-size: 0;
            line-height: 12px;
            .name {
              display: inline-block;
              vertical-align: top;
              margin-right: 6px;
              color: rgb(147, 153, 159);
              font-size: 10px;
            }
            .avatar {
              border-radius: 50%;
            }
          }
          .time {
            margin-bottom: 6px;
            line-height: 12px;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
          .text {
            line-height: 16px;
            font-size: 12px;
            color: rgb(7, 17, 27);
            .icon-thumb_up {
              font-size: 12px;
              margin-right: 4px;
              color: rgb(0, 160, 220);
            }
            .icon-thumb_down {
              font-size: 12px;
              margin-right: 4px;
              color: rgb(147, 153, 159);
            }
          }
        }
        .no-rating {
          padding: 16px 0;
          font-size: 12px;
          color: rgb(147, 153, 159);
        }
      }
    }
  }
</style>
