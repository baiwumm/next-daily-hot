/**
 * @description: 请求状态（纯常量，无 JSX 依赖，供服务端 API routes 与客户端共用）
 */

const responseConfig = {
  SUCCESS: { value: 200, label: '请求成功' },
  ERROR: { value: 500, label: '请求失败' },
} as const

/** 请求状态码类型 */
export type ResponseValue = (typeof responseConfig)[keyof typeof responseConfig]['value']

export const RESPONSE = {
  SUCCESS: responseConfig.SUCCESS.value,
  ERROR: responseConfig.ERROR.value,
  /** 根据状态码获取文案 */
  label: (value: ResponseValue) =>
    value === responseConfig.SUCCESS.value ? responseConfig.SUCCESS.label : responseConfig.ERROR.label,
}
