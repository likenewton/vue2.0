/**
 * Created by Newton on 2017/2/15.
 */

export function urlParse() {
  let queryStr = location.search;
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = queryStr.match(reg);
  let queryArr = [];
  arr.forEach(function (v) {
    let templateArr = v.slice(1).split('=');
    let key = decodeURIComponent(templateArr[0]);
    let value = decodeURIComponent(templateArr[1]);
    queryArr[key] = value;
  })
  return queryArr;
}
