<template>
  <div class="goods-container">
    <div class="meun-lists" ref="meun-lists">
      <ul>
        <li v-for="(list,index) in goods" @click="choiceMeun(index,$event)" class="list"
            :class="{'active':index===currentIndex}">
        <span class="text border-1px">
          <i v-show="list.type>0" class="icon" :class="classMap[list.type]"></i>{{list.name}}
        </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foods-wrapper">
      <ul>
        <li v-for="item in goods" class="foot-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
              <div class="icon">
                <img :src="food.icon" width="57" height="57">
              </div>
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
                  <span v-show="food.oldPrice" class="delete-price">
                    <span>￥</span>{{food.oldPrice}}
                  </span>
                </div>
              </div>
              <!-- 添加于减少的购物按钮 -->
              <add-car :food="food"></add-car>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart :selected-foods="selectedFoods" :delivery-price="seller.deliveryPrice"
              :min-price="seller.minPrice" ref="shop-cart"></shopcart>
    <food :food="selectedFood" ref="food" class=""></food>
  </div>
</template>

<script type="es6">
  import food from '../food/food';
  import addCar from '../add-car/add-car';
  // 滑动插件
  import  BScroll from 'better-scroll';
  import shopcart from '../shopcart/shopcart';

  const ERR_OK = 0;
  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],
        selectedFood: {},
        listHeight: [],
        scrollY: 0
      };
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectedFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          })
        })
        return foods;
      },
    },
    created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
      this.$http.get('/api/goods').then((responce) => {
        responce = responce.body;
        if (responce.errno == ERR_OK) {
          this.goods = responce.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          })
        }
        // 接收add-car组件传递过来的dom元素
        this.$root.eventHub.$on('add-count', (target) => {
          // 优化体验
          this.$nextTick(() => {
            this._drop(target);
          })
        });
      });
    },
    methods: {
      // 滑动及监听scrollY的值变化
      _initScroll: function () {
        this.menuScroll = new BScroll(this.$refs['meun-lists'], {
          click: true
        });
        this.foodsScroll = new BScroll(this.$refs['foods-wrapper'], {
          // probeType:3 表示可以追踪scrollY的值
          probeType: 3,
          click: true
        });
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y));
        });
      },
      // 获取每一个食物列表项目的高度
      _calculateHeight: function () {
        // 获取到所有的.food-list-hook标签
        let lis = this.$refs['foods-wrapper'].getElementsByClassName('food-list-hook');
        let height = 0;
        // 将食物列表的高度存入数组中
        this.listHeight.push(height);
        for (var i = 0; i < lis.length; i++) {
          height += lis[i].clientHeight;
          this.listHeight.push(height);
        }
      },
      // 点击弹出具体食物清单
      selectFood: function (food, event) {
        if (!event._constructed) {
            return;
        }
        this.selectedFood = food;
        // this.$refs.food  可以获取子组件vm实例
        this.$refs.food.show();
      },
      // 点击左边菜单栏调到对应食物列表
      choiceMeun: function (index) {
        if (!event._constructed) return;
        // 获取应当处于当前适口的li标签
        let choiceLi = this.$refs['foods-wrapper'].getElementsByClassName('food-list-hook')[index];
        this.foodsScroll.scrollToElement(choiceLi, 300);
      },
      // 从父组件中调用自组件shopcart的方法drop，以便将目标元素传入该组件
      _drop(target) {
        this.$refs['shop-cart'].drop(target);
      }
    },
    components: {
      food,
      addCar,
      shopcart,
    }
  };
</script>

<style lang="less" rel="stylesheet/less">
  @import "../../common/css/mixin.less";

  .goods-container {
    display: flex;
    vertical-align: middle;
    overflow: hidden;
    position: absolute;
    top: 174px;
    width: 100%;
    bottom: 48px;
    .meun-lists {
      flex: 0 0 80px;
      width: 80px;
      background-color: #f3f5f7;
      .list {
        display: table;
        width: 100%;
        height: 54px;
        width: 56px;
        color: rgb(24, 20, 20);
        font-weight: 200;
        line-height: 14px;
        padding: 0 12px;
        &.active {
          position: relative;
          z-index: 10;
          margin-top: -1px;
          background-color: #fff;
          .text {
            font-weight: 700;
            .border-none();
          }
        }
        .text {
          display: table-cell;
          width: 56px;
          vertical-align: middle;
          font-size: 12px;
          .border-1px(rgba(7, 17, 27, 0.1));
          .icon {
            display: inline-block;
            width: 12px;
            height: 12px;
            vertical-align: top;
            margin-right: 2px;
            background-repeat: no-repeat;
            background-size: 12px 12px;
            &.decrease {
              .bg-image('../../components/goods/decrease_3');
            }
            &.discount {
              .bg-image('../../components/goods/discount_3');
            }
            &.guarantee {
              .bg-image('../../components/goods/guarantee_3');
            }
            &.invoice {
              .bg-image('../../components/goods/invoice_3');
            }
            &.special {
              .bg-image('../../components/goods/special_3');
            }
          }
        }
      }
    }
    .foods-wrapper {
      flex: 1;
      .title {
        margin: 0;
        box-sizing: border-box;
        width: 100%;
        padding-left: 14px;
        line-height: 26px;
        height: 26px;
        font-size: 12px;
        color: rgb(147, 153, 159);
        background-color: #f3f5f7;
        border-left: 2px solid #d9dde1;
      }
      .food-item {
        display: flex;
        position: relative;
        margin: 18px 18px 0 18px;
        padding-bottom: 18px;
        .border-1px(rgba(7, 17, 27, 0.1));
        .icon {
          flex: 0 0 57px;
          margin-right: 10px;
        }
        .content {
          flex: 1;
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
            margin-top: 8px;
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
            }
          }
        }
        &:last-child {
          .border-none();
        }
      }
    }
  }
</style>
