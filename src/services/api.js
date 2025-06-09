/*
 * @Author: zi.yang
 * @Date: 2025-06-09 19:50:44
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-06-09 21:02:29
 * @Description: 
 * @FilePath: /short-link/src/services/api.js
 */
/**
 * API 服务模块
 * 用于处理与后端的所有 API 交互
 */

/**
 * 通用 API 请求函数
 * @param {string} url - API 端点
 * @param {Object} options - 请求选项
 * @returns {Promise} - 返回请求结果的 Promise
 */
export async function fetchApi(url, { method = 'GET', body, params } = {}) {
  try {
    document.cookie = '';
    const response = await fetch(url, {
      method,
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      params,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();

    if (data.code === 200) {
      return data;
    } else {
      throw new Error(data.msg || '请求失败');
    }
  } catch (error) {
    throw error;
  }
}

/**
 * 添加 URL 生成短链接
 * @param {string} url - 要缩短的 URL
 * @returns {Promise} - 返回包含短链接的 Promise
 */
export async function addUrl(url) {
  return fetchApi('/api/addUrl', {
    method: 'POST',
    body: { url }
  });
}

/**
 * 获取 URL 信息
 * @param {string} shortCode - 短链接代码
 * @returns {Promise} - 返回包含原始 URL 的 Promise
 */
export async function getUrl(shortCode) {
  return fetchApi(`/api/getUrl/${shortCode}`);
}

