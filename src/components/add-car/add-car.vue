<template>
  <div class="addCar clearfix">
    <transition name="moveLeft">
      <div class="reduce" v-show="food.count>0">
        <span class="iconfont icon-remove_circle_outline" @click.stop.prevent="reduceCount"></span>
      </div>
    </transition>
    <transition name="show">
      <i class="count" v-show="food.count>0">{{food.count}}</i>
    </transition>
    <div class="add">
      <span class="iconfont icon-add_circle" @click.stop.prevent="addCount($event)"></span>
    </div>
  </div>
</template>

<script type="es6">
  import Vue from 'vue';

  export default {
    props: {
      food: {
        type: Object,
        default: function () {
          return {};
        }
      }
    },
    methods: {
      addCount: function (event) {
        // 点击改按钮将向父元素派发一个事件cart.add，并将该dom对象传递给父元素
        this.$root.eventHub.$emit('add-count',event.target);
        // pc端没有_constructed属性
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          // vue.js不支持给对象添加属性，因为vue.js不会对其进行监测,如需添加属性
          // 需手动set(对象，添加的属性名，属性值）
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
      },
      reduceCount: function () {
        if (!event._constructed) {
          return;
        }
        if (this.food.count > 0) this.food.count--;
      }
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  .addCar {
    position: absolute;
    bottom: 18px;
    right: 0;
    width: 72px;
    height: 24px;
    .add, .reduce {
      border-radius: 50%;
      width: 24px;
      height: 24px;
    }
    .add {
      float: right;
    }
    .reduce {
      float: left;
      &.moveLeft-enter-active {
        animation: moveIn 0.3s linear;
      }
      &.moveLeft-leave-active {
        animation: moveOut 0.3s linear;
      }
      @keyframes moveIn {
        0% {
          opacity: 0;
          transform: translate3d(24px, 0, 0) rotate(180deg);
        }
        100% {
          opacity: 1;
          transform: translate3d(0, 0, 0) rotate(0);
        }
      }
      @keyframes moveOut {
        0% {
          opacity: 1;
          transform: translate3d(0, 0, 0) rotate(0);
        }
        100% {
          opacity: 0;
          transform: translate3d(24px, 0, 0) rotate(180deg);
        }
      }
    }
    .icon-add_circle, .icon-remove_circle_outline {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      line-height: 24px;
      font-size: 24px;
      color: rgb(0, 160, 220);
      padding: 6px;
      left: -6px;
    }
    .count {
      position: absolute;
      text-align: center;
      font-size: 10px;
      color: rgb(147, 153, 159);
      line-height: 24px;
      width: 24px;
      height: 24px;
      left: 24px;
      top: 0;
      transition: opacity 0.3s linear;
      &.show-enter-active, &.show-leave {
        opacity: 1;
      }
      &.show-enter, &.show-leave-active {
        opacity: 0;
      }
    }
  }
</style>
