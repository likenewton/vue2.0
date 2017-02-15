<template>
  <div class="ratings" ref="ratings">
    <div class="ratings-content">
      <!-- 商品评价栏目详细 -->
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="score-title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="score-title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="delivery-title">送达时间</span>
            <span class="time">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <!-- 装饰用的分割组件 -->
      <split></split>
      <!-- 选择评论组件 -->
      <rating-select :ratings="ratings" :select-type="selectType"
                     :only-content="onlyContent" :desc="desc"
                     v-on:type="selectTypeChange" v-on:content="onlyContentChange">
      </rating-select>
      <!-- 评论列表 -->
      <div class="ratings-wrapper">
        <ul>
          <li class="rating-item border-1px" v-for="rating in ratings"
              v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery-time" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
                <p class="text">{{rating.text}}</p>
                <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                  <i class="iconfont icon-thumb_up"></i>
                  <span class="recommend" v-for="item in rating.recommend">{{item}}</span>
                </div>
                <span class="time">{{rating.rateTime | formatDate}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="es6">
  import BScroll from 'better-scroll';
  import star from '../star/star';
  import split from '../split/split';
  import ratingSelect from '../rating-select/rating-select';
  import formatDate from '../../common/js/formatDate';

  const ALL = 2;
  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        ratings: [],
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '满意',
          nagative: '不满意'
        }
      }
    },
    // 通常用来禁止用户在还未保存修改前突然离开
    beforeRouteLeave (to, from, next) {
      this.$root.eventHub.$off('select-type');
      this.$root.eventHub.$off('only-content');
      next();
    },
    created() {
      this.$http.get('/api/ratings').then((res) => {
        res = res.body;
        if (res.errno === ERR_OK) {
          this.ratings = res.data;
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.ratings, {
                click: true
              })
            }
          })
        }
      });
    },
    methods: {
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
    components: {
      star,
      split,
      ratingSelect,
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/css/mixin";

  .ratings {
    position: absolute;
    top: 174px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    .overview {
      display: flex;
      padding: 18px 0;
      .overview-left {
        flex: 0 0 137px;
        width: 137px;
        border-right: 1px solid rgba(7, 17, 27, 0.1);
        text-align: center;
        padding: 6px 0;
        @media only screen and (max-device-width: 320px) {
          flex: 0 0 120px;
          width: 120px;
        }
        .score {
          line-height: 28px;
          font-size: 24px;
          color: rgb(255, 153, 0);
          width: 100%;
          margin-bottom: 6px;
        }
        .title {
          display: block;
          margin: 0;
          width: 100%;
          color: rgb(7, 17, 27);
          font-size: 12px;
          line-height: 12px;
          margin-bottom: 8px;
        }
        .rank {
          font-size: 10px;
          line-height: 10px;
          color: rgb(147, 153, 159);
          width: 100%;
        }
      }
      .overview-right {
        flex: 1;
        padding: 6px 0 0 24px;
        @media only screen and (max-device-width: 320px) {
          padding: 6px 0 0 6px;
        }
        .score-wrapper {
          margin-bottom: 6px;
          font-size: 0;
          .score-title {
            display: inline-block;
            vertical-align: top;
            line-height: 18px;
            margin: 0;
            font-size: 12px;
            color: rgb(7, 17, 27);
          }
          .star {
            display: inline-block;
            margin-left: 12px;
          }
          .score {
            display: inline-block;
            line-height: 18px;
            vertical-align: top;
            font-size: 12px;
            margin-left: 12px;
            color: rgb(255, 153, 0);
          }
        }
        .delivery-wrapper {
          font-size: 0;
          .delivery-title {
            display: inline-block;
            vertical-align: top;
            line-height: 18px;
            margin: 0;
            font-size: 12px;
            color: rgb(7, 17, 27);
          }
          .time {
            line-height: 18px;
            font-size: 12px;
            margin-left: 12px;
            color: rgb(147, 153, 159);
          }
        }
      }
    }
    .ratings-wrapper {
      padding: 0 18px;
      .rating-item {
        display: flex;
        position: relative;
        padding: 18px 0;
        .border-1px(rgba(7, 17, 27, 0.1));
        .avatar {
          flex: 0 0 28px;
          width: 28px;
          img {
            border-radius: 50%;
          }
        }
        .content {
          flex: 1;
          margin-left: 12px;
          .name {
            font-size: 10px;
            line-height: 12px;
            color: rgb(7, 17, 27);
            margin-bottom: 4px;
          }
          .wrapper {
            .time {
              position: absolute;
              top: 18px;
              right: 0;
              font-size: 10px;
              line-height: 12px;
              font-weight: 200;
              color: rgb(147, 153, 159);
            }
            .star {
              margin-bottom: 6px;
            }
            .delivery-time {
              margin-left: 6px;
              font-size: 10px;
              line-height: 12px;
              font-weight: 200;
              color: rgb(147, 153, 159);
            }
            .text {
              font-size: 12px;
              line-height: 18px;
              color: rgb(7, 17, 27);
              margin-bottom: 8px;
            }
            .recommend {
              font-size: 0;
              .icon-thumb_up {
                vertical-align: top;
                font-size: 12px;
                line-height: 16px;
                color: rgb(0, 160, 220);
                margin-bottom: 4px;
              }
              .recommend {
                display: inline-block;
                vertical-align: top;
                height: 16px;
                margin-left: 8px;
                font-size: 9px;
                line-height: 16px;
                border-radius: 1px;
                padding: 0 6px;
                color: rgb(147, 153, 159);
                background-color: #fff;
                border: 1px solid rgba(7, 17, 27, 0.1);
                margin-bottom: 4px;
              }
            }
          }
        }
      }
    }
  }
</style>
