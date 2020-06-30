// eslint-disable-next-line
/* eslint-disable */

// 根据pageIndex、pageSize、totalCount来计算序号值
export function dealPageIndex (totalCount, pageSize, pageIndex) {
  if (pageIndex < 1) {
    pageIndex = 1
    return pageIndex
  }
  var totalPage
  if (totalCount / pageSize > parseInt(totalCount / pageSize)) {
    totalPage = parseInt(totalCount / pageSize) + 1
  } else {
    totalPage = parseInt(totalCount / pageSize)
  }
  if (pageIndex > totalPage) {
    pageIndex = totalPage
  }
  return pageIndex
}

// 日期转换格式  2018-11-22 --> 2018年11月22日
export function formatDateByYear (stringValue){
  if(stringValue){
    if(JSON.stringify(stringValue).indexOf("-") == -1){
      return stringValue
    }
    let date = new Date(stringValue)
    var dateString = ''
    dateString += date.getFullYear() +'年'+(date.getMonth()+1)+'月'+date.getDate()+'日'
    return dateString.trim()
  }else{
    return '-'
  }
}

// 日期转换格式  20181122135922000  --> 2018-11-22 13:59:22
export function formatString (stringValue) {
  if (stringValue) {
    var dateString = ''
    dateString += stringValue.slice(0, 4) + '-' + stringValue.slice(4, 6) + '-' + stringValue.slice(6, 8) + ' ' + stringValue.slice(8, 10) + ':' + stringValue.slice(10, 12) + ':' + stringValue.slice(12,14)
    return dateString
  } else {
    return '-'
  }
}


//日期转换格式  20181122  --> 2018-11-22
export function formatDataByDay(stringValue){
  if (stringValue) {
    var dateString = ''
    dateString += stringValue.slice(0, 4) + '-' + stringValue.slice(4, 6) + '-' + stringValue.slice(6, 8)
    return dateString
  } else {
    return '-'
  }
}

export function timeFormat(time) {
  var d = new Date(time);

  var year = d.getFullYear();       //年
  var month = d.getMonth() + 1;     //月
  var day = d.getDate();            //日

  var hh = d.getHours();            //时
  var mm = d.getMinutes();          //分
  var ss = d.getSeconds();           //秒

  var clock = year + "-";

  if (month < 10)
    clock += "0";

  clock += month + "-";

  if (day < 10)
    clock += "0";

  clock += day + " ";


  return (clock);
}

export function timeFormatMonth(time) {
  var d = new Date(time);

  var year = d.getFullYear();       //年
  var month = d.getMonth() + 1;     //月

  var clock = year + "-";

  if (month < 10)
    clock += "0";

  clock += month;


  return (clock);
}

export function formatDate(stringValue){
  if(stringValue){
    return JSON.stringify(stringValue).substring(1,11).trim()
  }else{
    return '-'
  }
}
// 数字格式转换  123456789.1  --> 123,456,789.10
export function formatNumber (value) {
  if (!value || value === 0 || value === '0') {
    return '0.00'
  }
  let intPart = Number(value) | 0 // 获取整数部分
  let intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断

  let floatPart = '.00' // 预定义小数部分
  let val = String(value)
  var value2Array = val.split('.')
  //= 2表示数据有小数位
  if (value2Array.length === 2) {
    floatPart = value2Array[1].toString() // 拿到小数部分

    if (floatPart.length === 1) { // 补0,实际上用不着
      return intPartFormat + '.' + floatPart + '0'
    } else {
      return intPartFormat + '.' + floatPart
    }
  } else {
    return intPartFormat + floatPart
  }
}

// 根据parentId创建级联结构数组
export function transCascaderData (jsonData, idStr, pidStr, labelStr) {
  jsonData = toCascaderJson(jsonData, idStr, labelStr)
  var treeArray = [], hash = {}, id = idStr, pid = pidStr, children = 'children', i = 0, j = 0,
    len = jsonData.length
  for (; i < len; i++) {
    hash[jsonData[i][id]] = jsonData[i]
  }
  for (; j < len; j++) {
    var aVal = jsonData[j], hashVP = hash[aVal[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(aVal)
    } else {
      treeArray.push(aVal)
    }
  }
  return treeArray
}
function toCascaderJson (jsonData, idStr, labelStr) {
  if (!jsonData.length) return null
  var len = jsonData.length
  for (var i = 0; i < len; i++) {
    jsonData[i]['value'] = jsonData[i][idStr]
    jsonData[i]['label'] = jsonData[i][labelStr]
  }
  return jsonData
}

// 判断该对象是否为空
export function isEmpty (object) {
  if (object == null || object == '' ||
    typeof (object) === 'undefined' ||
    object == undefined || object == 'null') {
    return true
  }
  return false
}

export function timeFormate(timeStamp) {
  let datime = new Date(timeStamp);
  let year = datime.getFullYear();
  let month = datime.getMonth() + 1 < 10 ? "0" + (datime.getMonth() + 1) : datime.getMonth() + 1;
  let date = datime.getDate() < 10 ? "0" + datime.getDate() : datime.getDate();
  let nowTime = year.toString() + month.toString() + date.toString();
  return nowTime;
}
// 根据parentId创建树形结构数组
export function transTreeData (jsonData, idStr, pidStr, labelStr) {
  jsonData = toTreeJson(jsonData, idStr, labelStr)
  var treeArray = [], hash = {}, id = idStr, pid = pidStr, children = 'children', i = 0, j = 0,
    len = jsonData.length
  for (; i < len; i++) {
    hash[jsonData[i][id]] = jsonData[i]
  }
  for (; j < len; j++) {
    var aVal = jsonData[j], hashVP = hash[aVal[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(aVal)
    } else {
      treeArray.push(aVal)
    }
  }
  return treeArray
}

function toTreeJson (jsonData, idStr, labelStr) {
  if (!jsonData.length) return null
  var len = jsonData.length
  // jsonData[0]['expand'] = true
  for (var i = 0; i < len; i++) {
    jsonData[i]['value'] = jsonData[i][idStr]
    jsonData[i]['title'] = jsonData[i][labelStr]

  }
  return jsonData
}

export function validata(project){
  if ( validataTypeZero(project) || validataTypeOne(project) ) {
    return 1;
  } if ( isEmpty(project.formTemplate) ) {
    return 2;
  }
  return 0;
}

function validataTypeZero( project ) {
  return (isEmpty(project.projectName) || isEmpty(project.picUrl) || isEmpty(project.details) || isEmpty(project.introduction)) && project.projectType == 0;
}

function validataTypeOne( project ) {
  return ( isEmpty(project.projectName ) || isEmpty(project.details) ) && project.projectType == 1;
}

export function dateFormate(timeStamp) {
  let datime = new Date(timeStamp);
  let year = datime.getFullYear();
  let month = datime.getMonth() + 1 < 10 ? "0" + (datime.getMonth() + 1) : datime.getMonth() + 1;
  let date = datime.getDate() < 10 ? "0" + datime.getDate() : datime.getDate();
  let nowTime = year + "-" + month + "-" + date;
  return nowTime;
}

/* 日期转换成 yyyy-MM-dd hh:mm:ss */
export function dateFormat(date) {
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return Y + M + D + h + m + s;
}

/** 查询所有父/子id */
export function transParentChild (jsonData, key, str) {
  var treeArray = []
  getforResult(jsonData, key, str, treeArray)
  return treeArray
}

export function getforResult (jsonData, key, str, treeArray) {
  for (var i = 0; i < jsonData.length; i++) {
    if(str == 'child') {
      if (jsonData[i].parentUnitId == key) {
        treeArray.push(jsonData[i].unitId)
        getforResult(jsonData, jsonData[i].unitId, str, treeArray)
        break
      }
    } else if(str == 'parent') {
      if (jsonData[i].unitId == key) {
        treeArray.push(key)
        getforResult(jsonData, jsonData[i].parentUnitId, str, treeArray)
        break
      }
    }
  }
}

//Date格式化   date:日期类型 fmt:字符串 如'yyyy-MM-dd HH:mm'
export function DateFormat(date, fmt){
  var o = {
    "M+": date.getMonth()+1,
    "d+": date.getDate(),
    "H+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "S+": date.getMilliseconds()
  };
  //因为date.getFullYear()出来的结果是number类型的,所以为了让结果变成字符串型，下面有两种方法：
  if(/(y+)/.test(fmt)){
    //第一种：利用字符串连接符“+”给date.getFullYear()+""，加一个空字符串便可以将number类型转换成字符串。
    fmt=fmt.replace(RegExp.$1,(date.getFullYear()+"").substr(4-RegExp.$1.length));
  }
  for(var k in o){
    if (new RegExp("(" + k +")").test(fmt)){
      //第二种：使用String()类型进行强制数据类型转换String(date.getFullYear())，这种更容易理解。
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(String(o[k]).length)));
    }
  }
  return fmt;
};

/**
 * 获取 blob
 * @param  {String} url 目标文件地址
 * @return {cb}
 */
export function getBlob(url,cb) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'blob';
  xhr.onload = function() {
    if (xhr.status === 200) {
      cb(xhr.response);
    }
  };
  xhr.send();
};

/**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
export function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement('a');
    var body = document.querySelector('body');

    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    // fix Firefox
    link.style.display = 'none';
    body.appendChild(link);

    link.click();
    body.removeChild(link);

    window.URL.revokeObjectURL(link.href);
  };
};

