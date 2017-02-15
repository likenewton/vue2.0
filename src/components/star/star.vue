<template>
  <div class="star" :class="starType">
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script type="es6">
  // 定义常量方便以后维护
  const LENGTH = 5;
  const CLS_ON = "on";
  const CLS_HALF = "half";
  const CLS_OFF = "off";

  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType() {
        return 'star-' + this.size;
      },
      itemClasses() {
        let result = [];
        let score = Math.floor(this.score * 2) / 2;
        // 判断有多少个全星
        let integer = Math.floor(score);
        // 判断是否有半星
        let hasDecimal = score % 1 !== 0;
        for (var j = 0; j < integer; j++) {
          result.push(CLS_ON);
        }
        if(hasDecimal) result.push(CLS_HALF);
        // 需补齐5颗星
        while(result.length < 5) {
          result.push(CLS_OFF);
        }
        return result;
      }
    }
  }
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/css/mixin.less";

  .star {
    font-size: 0;
    .star-item {
      display: inline-block;
      background-repeat: no-repeat;
    }
    &.star-48 {
      .star-item {
        width: 20px;
        height: 20px;
        background-size: 20px 20px;
        margin-right: 22px;
        &:last-child {
          margin-right: 0;
        }
        &.on {
          .bg-image('../../components/star/star48_on');
        }
        &.half {
          .bg-image('../../components/star/star48_half');
        }
        &.off {
          .bg-image('../../components/star/star48_off');
        }
      }
    }
    &.star-36 {
      .star-item {
        width: 15px;
        height: 15px;
        background-size: 15px 15px;
        margin-right: 6px;
        &:last-child {
           margin-right: 0;
         }
        &.on {
         .bg-image('../../components/star/star36_on');
         }
        &.half {
         .bg-image('../../components/star/star36_half');
         }
        &.off {
         .bg-image('../../components/star/star36_off');
        }
      }
    }
    &.star-24 {
      .star-item {
        width: 10px;
        height: 10px;
        background-size: 10px 10px;
        margin-right: 3px;
        &:last-child {
           margin-right: 0;
        }
        &.on {
         .bg-image('../../components/star/star24_on');
        }
        &.half {
         .bg-image('../../components/star/star24_half');
        }
        &.off {
         .bg-image('../../components/star/star24_off');
        }
      }
    }
  }
</style>
