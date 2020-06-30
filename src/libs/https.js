// eslint-disable-next-line
/* eslint-disable */

// 引入axios
import axios from 'axios';
import Cookies from 'js-cookie';
import { router } from '../router';
import config from '@/config/url'
import store from '@/store'
import {TOKEN_KEY} from "./util";

// import VueJsonp from 'vue-jsonp';

// Vue.use(VueJsonp);


const base = {
  baseUrl:'',
  timeout: 30000,
}

let cancel, promiseArr = {}
const CancelToken = axios.CancelToken;

export const expires = new Date(new Date() * 1 + 7200 * 1000)
//请求拦截器
axios.interceptors.request.use(config => {
  //发起请求时，取消掉当前正在进行的相同请求
  if (promiseArr[config.url]) {
    promiseArr[config.url]('操作取消')
    promiseArr[config.url] = cancel
  } else {
    promiseArr[config.url] = cancel
  }
  return config
}, error => {
  return Promise.reject(error)
})

//响应拦截器即异常处理
axios.interceptors.response.use(response => {
  return response
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '错误请求'
        if(null != err.response.data.retmsg){
          err.message = err.response.data.retmsg
        }

        break;
      case 401:
        err.message = '未授权，请重新登录'
        break;
      case 403:
        err.message = '拒绝访问'
        break;
      case 404:
        err.message = '请求错误,未找到该资源'
        break;
      case 405:
        err.message = '请求方法未允许'
        break;
      case 408:
        err.message = '请求超时'
        break;
      case 500:
        err.message = '服务器端出错'
        break;
      case 501:
        err.message = '网络未实现'
        break;
      case 502:
        err.message = '网络错误'
        break;
      case 503:
        err.message = '服务不可用'
        break;
      case 504:
        err.message = '网络超时'
        break;
      case 505:
        err.message = 'http版本不支持该请求'
        break;
      default:
        err.message = `连接错误${err.response.status}`
    }
  } else {
    err.message = "连接服务器失败"
  }
  // message.err(err.message)
  return Promise.resolve(err)
})


axios.defaults.timeout = base.timeout
/**
 * 封装get方法
 * @param url
 * @param param
 * @returns {Promise}
 */

export function ajax(url, m, param) {
  axios.defaults.headers = {
    "Content-Type": "application/json;charset=UTF-8"
  }
  if(!Cookies.get(TOKEN_KEY)){
    store.commit('logout')
    // store.commit('clearPage')
    router.push({
        name: 'login'
    })
    // return;
  } else {
    axios.defaults.headers.Authorization = Cookies.get(TOKEN_KEY)
  }
  if(m === 'get'){
    return new Promise((resolve, reject) => {
      url = base.baseUrl + url
      axios({
        method: m,
        url,
        params: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resSolve(res, resolve)
      }).catch(error => {
        reject(error);
      })
    })
  }else if(m === 'post'){
    return new Promise((resolve, reject) => {
      url = base.baseUrl + url
      axios({
        method: m,
        url,
        data: param,
        cancelToken: new CancelToken(c => {
          cancel = c
        })
      }).then(res => {
        resSolve(res, resolve)
      }).catch(err => {
        reject(err);
      })
    })
  }
}

function resSolve(res, resolve) {
  if(res) {
    // if(res.headers && res.headers.authorization) {
    //   Cookies.set(TOKEN_KEY, res.headers.authorization, { expires: expires })
    // }
    if(res.data && res.data.code){
      if(res.data.code === '000000') {
        resolve(res)
        return
      } else
      // if(res.data.retcode === '3') {
      //   res.data.retmsg = "您的账号长时间未登录，请重新登录"
      //   resfinish();
      // } else
      if(res.data.code === '000003'){
        res.data.msg = "登录超时，请重新登录"
        router.push({
          name: 'login'
        })
      }
      resolve(res)
    } else {
      res.message = res.message || "系统维护中，请稍后"
      app.$Modal.error({
        title: "失败",
        content: res.message
      })
    }
  } else {
    app.$Modal.error({
      title: "失败",
      content: "系统维护中，请稍后"
    })
  }
}

function resfinish(){
  // Cookies.remove(TOKEN_KEY)
  store.commit('logout')
  // store.commit('clearPage')
  router.push({
    name: 'login'
  })
}
