/**
 * production 环境
 */
export const proHost = 'http://flmall.sovell.com'

/**
 * qa 环境
 */
export const qaHost = 'http://fygo.chinaeast2.cloudapp.chinacloudapi.cn'

/**
 * 线上 环境
 */
export const onlineHost = proHost

/**
 * 本地 环境 - 与 webpack server 同源
 */
export const localHost = 'http://localhost:8080'

/**
 * mock 环境
 */
export const moackHost = 'http://localhost:8080'

/**
 * debugger 模式
 */
export const ISDEBUG = process.env.NODE_ENV !== 'production'

/**
 * image 拼接域名
 */
// export const reqDomain = ISDEBUG ? qaHost + '/' : onlineHost + '/'
export const reqDomain = onlineHost + '/'

/**
 * request host
 */
export const host = ISDEBUG ? localHost : onlineHost
