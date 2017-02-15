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
      </div>
      <split></split>
      <div class="bulletin border-1px">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper">
          <p class="content">{{seller.bulletin}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="es6">
  import BScroll from 'better-scroll';
  import star from '../star/star';
  import split from '../split/split';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      star,
      split
    },
    created() {
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true
          })
        } else {
          this.scroll.refresh();
        }
      })
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/css/mixin";

  .seller {
    position: absolute;
    top: 174px;
    left: 0;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    .overview {
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
  }
</style>
