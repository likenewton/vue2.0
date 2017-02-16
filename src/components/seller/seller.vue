<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}<span>元</span></span>
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}<span>元</span></span>
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}<span>分钟</span></span>
            </div>
          </li>
        </ul>
        <div class="favorite">
          <i class="iconfont icon-favorite" :class="{active: favorite}" @click="collect"></i>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin border-1px">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper">
          <p class="content">{{seller.bulletin}}</p>
        </div>
      </div>
      <ul class="supports">
        <li class="support border-1px" v-for="support in seller.supports">
          <span class="icon" :class="classMap[support.type]"></span>
          <span class="text">{{support.description}}</span>
        </li>
      </ul>
      <split></split>
      <div class="pics">
        <h1 class="title">商品实景</h1>
        <div class="pics-wrapper" ref="pics-wrapper">
          <ul class="pic-list" ref="pic-list">
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item border-1px" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
    <shopcart :selected-foods="selectedFoods" :delivery-price="seller.deliveryPrice"
              :min-price="seller.minPrice" ref="shop-cart">
    </shopcart>

  </div>
</template>

<script type="es6">
  import BScroll from 'better-scroll';
  import star from '../star/star';
  import split from '../split/split';
  import shopcart from '../shopcart/shopcart';
  import {setToStorage, loadFromStorage} from '../../common/js/localStorage';

  export default {
    props: {
      seller: {
        type: Object
      },
      selectedFoods: {
        type: Array
      }
    },
    data() {
      return {
        favorite: (() => {
          // 读取localStorage中favorite中的数据
          return loadFromStorage(this.seller.id, 'favorite', false);
        })()
      }
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    methods: {
      collect() {
        if(!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        setToStorage(this.seller.id, 'favorite', this.favorite);
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          })
        } else {
          this.scroll.refresh();
        }
      });
      this.$nextTick(() => {
        if (this.seller.pics) {
          let picWidth = 120;
          let margin = 6;
          let ulWidth = (picWidth + margin) * this.seller.pics.length;
          this.$refs['pic-list'].style.width = ulWidth + 'px';
          this.picScroll = new BScroll(this.$refs['pics-wrapper'], {
            scrollX: true,
            eventPassthrough: 'vertical'
          })
        }
      });
    },
    components: {
      star,
      split,
      shopcart
    },
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/css/mixin";

  .seller {
    position: absolute;
    top: 174px;
    left: 0;
    bottom: 48px;
    width: 100%;
    overflow: hidden;
    .overview {
      position: relative;
      padding: 18px 0 0 0;
      .title {
        margin: 0 0 8px 18px;
        font-size: 14px;
        line-height: 14px;
        color: rgb(7, 17, 27);
      }
      .desc {
        padding-bottom: 18px;
        margin: 0 18px;
        font-size: 0;
        .border-1px(rgba(7, 17, 27, 0.1));
        .star {
          display: inline-block;
          vertical-align: top;
        }
        .text {
          vertical-align: top;
          margin-left: 12px;
          font-size: 10px;
          line-height: 18px;
          color: rgb(77, 85, 93);
          &:first-of-type {
            margin-left: 8px;
          }
        }
      }
      .remark {
        display: flex;
        padding: 18px;
        text-align: center;
        .block {
          flex: 1;
          border-left: 1px solid rgba(7, 17, 27, 0.1);
          &:first-of-type {
            border: none;
          }
          h2 {
            font-size: 10px;
            line-height: 10px;
            color: rgb(147, 153, 159);
            margin-bottom: 4px;
          }
          .content {
            .stress {
              font-weight: 200;
              font-size: 24px;
              line-height: 24px;
              color: rgb(7, 17, 27);
            }
            span {
              font-weight: 200;
              font-size: 10px;
            }
          }
        }
      }
      .favorite {
        position: absolute;
        width: 50px;
        top: 18px;
        right: 11px;
        .icon-favorite {
          display: block;
          text-align: center;
          font-size: 24px;
          line-height: 24px;
          margin-bottom: 4px;
          color: rgb(77, 85, 93);
          &.active {
            color: rgb(240, 20, 20);
          }
        }
        .text {
          display: block;
          text-align: center;
          color: rgb(77, 85, 93);
          font-size: 10px;
          line-height: 10px;
        }
      }
    }
    .bulletin {
      padding: 18px 0 16px 0;
      .border-1px(rgba(7, 17, 27, 0.1));
      margin: 0 18px;
      .title {
        margin: 0 0 8px 0;
        font-size: 14px;
        line-height: 14px;
        color: rgb(7, 17, 27);
      }
      .content-wrapper {
        padding: 0 12px;
        .content {
          font-size: 12px;
          line-height: 24px;
          color: rgb(240, 20, 20);
          font-weight: 200;
        }
      }
    }
    .supports {
      padding: 0 18px;
      .support {
        padding: 18px 12px;
        font-size: 0;
        .border-1px(rgba(7, 17, 27, 0.1));
        &:last-of-type {
          border: none;
        }
        .icon {
          display: inline-block;
          width: 16px;
          height: 16px;
          margin-right: 6px;
          vertical-align: top;
          background-size: 16px 16px;
          background-repeat: no-repeat;
        }
        .text {
          vertical-align: top;
          font-weight: 200;
          color: rgb(7, 17, 27);
          line-height: 16px;
          font-size: 12px;
        }
        .decrease {
          .bg-image('../../components/seller/decrease_4');
        }
        .discount {
          .bg-image('../../components/seller/discount_4');
        }
        .guarantee {
          .bg-image('../../components/seller/guarantee_4');
        }
        .invoice {
          .bg-image('../../components/seller/invoice_4');
        }
        .special {
          .bg-image('../../components/seller/special_4');
        }
      }
    }
    .pics {
      padding: 18px 0 18px 18px;
      .title {
        margin: 0 0 12px 0;
        font-size: 14px;
        line-height: 14px;
        color: rgb(7, 17, 27);
      }
      .pics-wrapper {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        .pic-list {
          font-size: 0;
          .pic-item {
            display: inline-block;
            margin-right: 6px;
            width: 120px;
            height: 90px;
            &:last-of-type {
              margin: 0;
            }
          }
        }
      }
    }
    .info {
      padding: 18px 18px 0 18px;
      .title {
        margin: 0;
        width: 100%;
        padding-bottom: 12px;
        font-size: 14px;
        line-height: 14px;
        color: rgb(7, 17, 27);
        .border-1px(rgba(7, 17, 27, 0.1));
      }
      .info-item {
        padding: 16px 12px;
        color: rgb(7, 17, 27);
        font-size: 12px;
        line-height: 16px;
        .border-1px(rgba(7, 17, 27, 0.1));
        &:last-child {
          border: none;
        }
      }
    }
  }
</style>
