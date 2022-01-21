
import axios from 'axios';
// import { message } from 'antd';
// import Helper from '../config/helper';
// import { history } from '../utils/history';
// import Qs from 'qs'
// import cookieUtils from '../utils/cookie';
// import { message } from 'antd';

// axios 配置
axios.defaults.timeout = 9999999999; // 设置请求超时
axios.defaults.baseURL = '/api'; // 默认请求地址
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'; // 请求头的设置

// 请求成功的状态码数组
// const statusArr = [200, 201, 204]

// 请求
axios.interceptors.request.use(
  (config) => {
    // const TOKEN = localStorage.getItem('token') || '';
    // if (TOKEN) {
    //   config.headers.common.Token = TOKEN;
    //   config.headers.common.Authentication = TOKEN;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 返回
axios.interceptors.response.use(
  (res) => {
    // 拦截器配置
    // console.log(res, 'axiso')
    if (res.data) {
      return Promise.resolve(res.data);
    } else {
      // aws是没有返回值，自己加
      return Promise.resolve({
        code: 0
      });
    }
  },
  (error) => {
    // 验证是否登录信息过期

    // if (error.message === 'Network Error') {
    //   message.error('未连接到互联网')
    // }

    // if (error.response?.data?.code === 401003) {
    //   localStorage.removeItem('token')
    //   cookieUtils.setCookie('userInfo', 0, -1)
    //   history.push('/login')
    // }

    const code = error.response?.status

    if (code >= 400 && code <= 500) {
      return Promise.resolve({
        code: -1,
        message: error.response ? error.response.data?.message : error?.message
      });
    }

    // 请求失败
    // message.error(error.response?.data?.message || intl.get('request.request_error'), 3);
    return Promise.reject(error.response ? error.response.data : error);
  }
);

export default axios
