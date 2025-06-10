/**
 * 消息提示工具
 * 封装autolog.js的消息提示功能
 */

/**
 * 显示消息提示
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success, error, info, warn)
 * @param {number} duration - 显示时长(毫秒)
 */
export function showMessage(message, type = '', duration = 3000) {
  // 使用autolog.js显示消息
  if (window.autolog) {
    window.autolog.log(message, type, duration)
  } else {
    console.log(message)
    alert(message)
  }
}

/**
 * 成功消息
 * @param {string} message - 消息内容
 * @param {number} duration - 显示时长(毫秒)
 */
export function showSuccess(message, duration = 3000) {
  showMessage(message, 'success', duration)
}

/**
 * 错误消息
 * @param {string} message - 消息内容
 * @param {number} duration - 显示时长(毫秒)
 */
export function showError(message, duration = 3000) {
  showMessage(message, 'error', duration)
}

/**
 * 信息消息
 * @param {string} message - 消息内容
 * @param {number} duration - 显示时长(毫秒)
 */
export function showInfo(message, duration = 3000) {
  showMessage(message, 'info', duration)
}

/**
 * 警告消息
 * @param {string} message - 消息内容
 * @param {number} duration - 显示时长(毫秒)
 */
export function showWarning(message, duration = 3000) {
  showMessage(message, 'warn', duration)
}

export default {
  showMessage,
  showSuccess,
  showError,
  showInfo,
  showWarning
}