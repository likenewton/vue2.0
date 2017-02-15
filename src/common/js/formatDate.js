function padLeftZero(str) {
  const padLeft = '00';
  return (padLeft + str).substr(str.length);
}

function formatDate(date, fmt) {
  let timeString = fmt;
  const getFullYear = String(date.getFullYear());
  // 如果存在至少一个y
  if (/(y+)/.test(timeString)) {
    // RegExp.$1 为匹配第一个大括号的内容
    timeString = timeString.replace(RegExp.$1, getFullYear.substr(4 - RegExp.$1.length));
  }
  const o = {
    'm+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'f+': date.getMinutes(),
    's+': date.getSeconds(),
  };
  for (const k in o) {
    if (new RegExp(`(${k})`).test(timeString)) {
      const str = String(o[k]);
      timeString = timeString.replace(RegExp.$1, RegExp.$1.length === 1 ? padLeftZero(str) : str);
    }
  }
  return timeString;
}

export default formatDate;
