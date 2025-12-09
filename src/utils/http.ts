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
      source: 'miniapp',
    }

    // 4.添加 token 请求头标识
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    if (token) {
      options.header.Authorization = token
    }
    console.log(options)
  },
}
// 拦截请求
uni.addInterceptor('request', httpInterceptor)
// 拦截文件上传
uni.addInterceptor('uploadFile', httpInterceptor)
