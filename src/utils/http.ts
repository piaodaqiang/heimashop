import { useMemberStore } from '@/stores'

const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

// 添加拦截器
const httpInterceptor = {
  // 拦截前触发
  invoke(options: UniApp.RequestOptions) {
    // 1.非 http 开头需要拼接地址
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // 2.请求超时
    options.timeout = 10000 // 10秒

    // 3.添加小程序端请求头标识
    options.header = {
      ...options.header, // 先保留已经有的请求头
      'source-client': 'miniapp',
    }

    // 4.添加 token 请求头标识
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
  },
}
// 拦截请求
uni.addInterceptor('request', httpInterceptor)
// 拦截文件上传
uni.addInterceptor('uploadFile', httpInterceptor)

// 请求函数
/*
 * @param UniApp.RequestOptions 请求配置对象
 * @returns Promise
 */

// 添加类型，支持泛型
interface Data<T> {
  code: string
  msg: string
  result: T
}
export const http = <T>(options: UniApp.RequestOptions) => {
  // 1. 返回 Promise 对象
  return new Promise<Data<T>>((resolve, reject) => {
    // 2. 调用 uni.request 请求
    uni.request({
      ...options,
      // 3. 请求成功
      success(res) {
        if (res.statusCode === 200 && res.statusCode < 300) {
          // 成功状态码： 200-299
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          // 401: 表示登录失效或token过期，需要重新登录
          // 穷处本地信息
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          // 跳转回登录页
          uni.navigateTo({ url: 'pages/login/login' }) // 注意要写{}，因为navigateTo的参数是跳转配置对象
          reject(res.data) // 抛出错误信息
        } else {
          // 其他错误
          uni.showToast({
            title: '请求失败',
            icon: 'none',
          })
          reject(res.data) // 抛出错误信息
        }
      },
      // 请求失败
      fail(err) {
        uni.showToast({
          icon: 'error',
          title: '网络错误',
        })
      },
    })
  })
}
