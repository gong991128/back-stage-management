import api from './index'
// axios
import request from '@/utils/request'

// 登录post方法
export function postlogin(params) {
  return request({
    url: api.postlogin,
    method: 'post',
    params
    
  })
}

// home左侧菜单get方法
export function getmenu(params) {
  return request({
    url: api.getmenu,
    method: 'get',
    params
    
  })
}

// 获取用户数据列表
export function getusers(params) {
  return request({
    url: api.getusers,
    method: 'get',
    params  
  })
}
// put方法获取用户状态
export function putuserstate(params) {
  return request({
    url: api.putuserstate,
    method: 'put',
    params  
  })
}

// post方法添加用户
export function postaddusers(add) {
  return request({
    url: api.postaddusers,
    method: 'post',
    params:{
      add
    }
    
  })
}



// // 用户信息 post 方法
// export function getUserInfo(data) {
//   return request({
//     url: api.UserInfo,
//     method: 'post',
//     data,
//     hideloading: true
//   })
// }

// // 用户名称 get 方法
// export function getUserName(params) {
//   return request({
//     url: api.UserName,
//     method: 'get',
//     params,
//     hideloading: true
//   })
// }
