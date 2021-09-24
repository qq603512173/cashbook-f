/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 *
 */
let baseUrl = ''
let routerMode = 'history'
let baseImgPath = 'http://images.cangdu.org/'

if (process.env.NODE_ENV === 'development') {
  baseUrl = 'http://localhost:5000'
  //baseUrl = 'http://192.168.173.1:3000'
} else {
  baseUrl = 'https://ouzilin.herokuapp.com'
  //baseUrl = 'http://192.168.173.1:3000'
}
export {
  baseUrl,
  routerMode,
  baseImgPath
}
