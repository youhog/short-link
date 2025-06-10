/**
 * 验证工具
 * 提供各种验证函数
 */

/**
 * 验证URL格式是否正确
 * @param {string} url - 要验证的URL
 * @returns {boolean} - 验证结果
 */
export function validateUrl(url) {
  const urlPattern = /^(https?:\/\/|#小程序:\/\/).+/
  return urlPattern.test(url)
}

export default {
  validateUrl
}