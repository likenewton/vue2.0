
<template>
  <div class="header">
    <div class="content-wrapper">
      <div class="avatar">
        <img :src="seller.avatar" alt="avatar" width="64" height="64"/>
      </div>
      <div class="content">
        <div class="title">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="description">
          {{seller.description}}/{{seller.deliveryTime}}分钟送达
        </div>
        <div class="support" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="text">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="support-count" @click="showDetail" v-if="seller.supports">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="iconfont icon-keyboard_arrow_right"></i>
      </div>
    </div>

    <!-- 头部公告-->
    <div class="bulletin-wrapper" @click="showDetail">
      <span class="bulletin-title"></span>
      <span class="bulletin-text">{{seller.bulletin}}</span>
      <i class="iconfont icon-keyboard_arrow_right"></i>
    </div>

    <!-- 头部大背景-->
    <div class="header-background">
      <img :src="seller.avatar" alt="" width="100%" height="100%"/>
    </div>

    <!-- sticky footer 布局-->
    <transition name="fade">
      <div class="detail" v-show="detailShow">
        <div class="detail-wrapper clearfix">
          <div class="detail-main">
            <h1 class="detail-name">{{seller.name}}</h1>
            <div class="star-wrapper">
              <star :size="48" :score="seller.score"></star>
            </div>
            <title-line :contentInfo="discountInfo"></title-line>
            <ul v-if="seller.supports" class="supports">
              <li v-for="item in seller.supports" class="support-item">
                <span class="icon" :class="classMap[item.type]"></span>
                <span class="text">{{item.description}}</span>
              </li>
            </ul>
            <title-line :contentInfo="productInfo"></title-line>
            <div class="bulletin">
              <p class="content">{{seller.bulletin}}</p>
            </div>
          </div>
        </div>
        <div class="detail-close">
          <i class="icon iconfont icon-close" @click="hideDetail"></i>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="es6">
  import star from '../star/star';
  import titleLine from '../title-line/title-line';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        detailShow: false,
        discountInfo: "优惠信息",
        productInfo: "商家公告",
      }
    },
    methods: {
      showDetail: function () {
        this.detailShow = true;
      },
      hideDetail: function () {
        this.detailShow = false;
      }
    },
    created() {
      this.classMap = ['decrease','discount','special','invoice','guarantee'];
    },
    components: {
      star,
      titleLine,
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
    @import "../../common/css/mixin.less";

    .header {
      color: #fff;
      position: relative;
      background-color: rgba(7,17,27,0.4);
      .content-wrapper {
        position: relative;
        padding: 24px 12px 18px 24px;
        font-size: 0;
        .avatar {
          display: inline-block;
          vertical-align: top;
          img {
            border-radius: 2px;
          }
        }
        .content {
          display: inline-block;
          font-size: 14px;
          margin-left: 16px;
          .title {
            width: 100%;
            margin: 2px 0 8px 0;
            font-size: 0; /*font-siz:0 消除inline-block的间隙*/
            .brand {
              display: inline-block;
              width: 30px;
              height: 18px;
              .bg-image("../../components/header/brand");
              background-repeat: no-repeat;
              background-size: 30px 18px;
              vertical-align: top;
            }
            .name {
              font-size: 16px;
              line-height: 18px;
              font-weight: bold;
              margin-left: 6px;
            }
          }
          .description {
            font-size: 12px;
            line-height: 12px;
            margin-bottom: 10px;
          }
          .support {
            font-size: 0;
            .icon {
              display: inline-block;
              width: 12px;
              height: 12px;
              margin-right: 4px;
              vertical-align: top;
              background-size: 12px 12px;
              background-repeat: no-repeat;
            }
            .text {
              line-height: 14px;
              font-size: 10px;
              vertical-align: top;
            }
            .decrease {
              .bg-image('../../components/header/decrease_1');
            }
            .discount {
              .bg-image('../../components/header/discount_1');
            }
            .guarantee {
              .bg-image('../../components/header/guarantee_1');
            }
            .invoice {
              .bg-image('../../components/header/invoice_1');
            }
            .special {
              .bg-image('../../components/header/special_1');
            }
          }
        }
        .support-count {
          position: absolute;
          right: 12px;
          bottom: 18px;
          padding: 0 8px;
          height: 24px;
          line-height: 24px;
          border-radius: 14px;
          background-color: rgba(0,0,0,0.2);
          text-align: center;
          .count {
            font-size: 10px;
          }
          .icon-keyboard_arrow_right {
            font-size: 10px;
            line-height: 24px;
            margin-left: 2px;
          }
        }
      }
      .bulletin-wrapper {
        position: relative;
        height: 28px;
        line-height: 28px;
        padding: 0 22px 0 12px;
        background-color: rgba(7,17,27,0.2);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        .bulletin-title {
          display: inline-block;
          width: 22px;
          height: 12px;
          vertical-align: top;
          margin-top: 8px;
          .bg-image('../../components/header/bulletin');
          background-size: 22px 12px;
          background-repeat: no-repeat;
        }
        .bulletin-text {
          font-size: 10px;
        }
        .icon-keyboard_arrow_right {
          position: absolute;
          font-size: 10px;
          right: 12px;
        }
      }
      .header-background {
        position: absolute;
        overflow: hidden;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        filter: blur(8px);
      }
      .detail {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 99;
        background-color: rgba(7,17,27,0.8);
        width: 100%;
        height: 100%;
        overflow: auto;
        transition: all .5s;
        &.fade-enter-active, &.fade-leave {
          opacity: 1;
        }
        &.fade-enter, &.fade-leave-active {
          opacity: 0;
          background-color: rgba(7,17,27,0);
        }
        .detail-wrapper {
          width: 100%;
          min-height: 100%;
          .detail-main {
            margin-top: 64px;
            padding-bottom: 64px;
            .detail-name {
              line-height: 16px;
              text-align: center;
              font-size: 16px;
              font-weight: 700;
            }
            .star-wrapper {
              padding: 2px 0;
              margin-top: 18px;
              text-align: center;
            }
            .supports {
              width: 80%;
              margin: 0 auto;
              .support-item {
                padding: 0 12px;
                margin-bottom: 12px;
                font-size: 0;
                &:last-child {
                  margin-bottom: 0;
                }
                .icon {
                  display: inline-block;
                  width: 16px;
                  height: 16px;
                  margin-right: 6px;
                  vertical-align: top;
                  background-size: 16px 16px;
                  background-repeat: no-repeat;
                  &.decrease {
                    .bg-image('../../components/header/decrease_2');
                  }
                  &.discount {
                    .bg-image('../../components/header/discount_2');
                  }
                  &.guarantee {
                    .bg-image('../../components/header/guarantee_2');
                  }
                  &.invoice {
                    .bg-image('../../components/header/invoice_2');
                  }
                  &.special {
                    .bg-image('../../components/header/special_2');
                  }
                }
                .text {
                  line-height: 16px;
                  font-size: 12px;
                }
              }
            }
            .bulletin {
              width: 80%;
              margin: 0 auto;
              .content {
                padding: 0 12px;
                line-height: 24px;
                font-size: 12px;
              }
            }
          }
        }
        .detail-close {
          position: relative;
          width: 32px;
          height: 32px;
          margin: -64px auto 0 auto;
          clear: both;
          .icon-close {
            font-size: 32px;
          }
        }
      }
    }

</style>
