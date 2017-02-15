<template>
  <div class="rating-select">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" class="block positive" :class="{active: selectTP===2}">
        {{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block positive" :class="{active: selectTP===0}">
        {{desc.positive}}<span class="count">{{positives.length}}</span></span>
      <span @click="select(1,$event)" class="block nagative" :class="{active: selectTP===1}">
        {{desc.nagative}}<span class="count">{{negatves.length}}</span></span>
    </div>
    <div class="switch" @click="toggleContent" :class="{on: onlyCt}">
      <span class="iconfont icon-check_circle"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="es6">
  const POSITIVE = 0;
  const NAGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      ratings: {
        type: Array,
        default: function () {
          return [];
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default: function () {
          return {
            all: '全部',
            positive: '满意',
            nagative: '不满意'
          }
        }
      }
    },
    data() {
      return {
        selectTP: this.selectType,
        onlyCt: this.onlyContent
      }
    },
    methods: {
      select: function (type, event) {
        if (!event._constructed) {
          return;
        }
        // 不建议直接操作props中的属性值，可将props中的某一个值复制给data属性中的某个值，再来操纵那个值
        this.selectTP = type;
        // 需使用$emit将改变后的type传递给父组件
        this.$emit('type', type);
      },
      toggleContent: function () {
        if (!event._constructed) {
          return;
        }
        this.onlyCt = !this.onlyContent;
        this.$emit('content', this.onlyCt);
      }
    },
    computed: {
      // 推荐评论的数量
      positives() {
        return this.ratings.filter((filter) => {
          return filter.rateType === POSITIVE;
        })
      },
      // 吐槽评论的数量
      negatves() {
        return this.ratings.filter((filter) => {
          return filter.rateType === NAGATIVE;
        })
      }
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/css/mixin";

  .rating-select {

    .rating-type {
      padding: 18px 0;
      margin: 0 18px;
      .border-1px(rgba(7, 17, 27, 0.1));
      font-size: 0;
      .block {
        display: inline-block;
        padding: 8px 12px;
        line-height: 16px;
        font-size: 12px;
        border-radius: 1px;
        margin-right: 8px;
        color: rgb(77, 85, 93);
        &.active {
          color: #fff;
        }
        .count {
          font-size: 8px;
          margin-left: 2px;
        }
        &.positive {
          background-color: rgba(0, 160, 220, 0.2);
          &.active {
            background-color: rgb(0, 160, 220);
          }
        }
        &.nagative {
          background-color: rgba(77, 85, 93, 0.2);
          &.active {
            background-color: rgb(77, 85, 93);
          }
        }
      }
    }
    .switch {
      padding: 12px 18px;
      line-height: 24px;
      font-size: 12px;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      color: rgb(147, 153, 159);
      font-size: 0;
      &.on {
        .icon-check_circle {
          color: #00c850;
        }
      }
      .icon-check_circle {
        display: inline-block;
        vertical-align: top;
        margin-right: 4px;
        font-size: 24px;
      }
      .text {
        display: inline-block;
        vertical-align: top;
        font-size: 12px;
      }
    }
  }
</style>
