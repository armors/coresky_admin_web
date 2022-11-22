import Mock from 'mockjs'

// 配置Ajax请求延时，可用来测试网络延迟大时项目中一些效果
Mock.setup({
  timeout: 300
})
let BaseURL = process.env.VUE_APP_BASE_API
BaseURL = ""
export default Mock
