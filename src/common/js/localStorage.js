/**
 * Created by Newton on 2017/2/16.
 */

export function setToStorage(id, key, value) {
  let seller = window.localStorage.__seller__;
  // 先判断是否存在__seller__这个属性
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    // 如果存在这样的seller就将其解析成对象
    seller = JSON.parse(seller);
    if (!seller.id) {
      seller[id] = {};
    }
  }
  seller[id][key] = value;
  window.localStorage.__seller__ = JSON.stringify(seller);
}

export function loadFromStorage(id, key, def) {
  let seller = window.localStorage.__seller__;
  if(!seller) {
    return def;
  }else {
    let idObj = JSON.parse(seller)[id];
    if(!idObj) {
      return def;
    }else {
      return idObj[key] || def;
    }
  }

}
