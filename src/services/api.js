/*
 * @Author: zi.yang
 * @Date: 2025-06-09 19:50:44
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-07-18 16:10:00
 * @Description:
 * @FilePath: /short-link/src/services/api.js
 */
/**
 * API 服務模組
 * 用於處理與後端的所有 API 互動
 */

/**
 * 通用 API 請求函式
 * @param {string} url - API 端點
 * @param {Object} options - 請求選項
 * @returns {Promise} - 返回請求結果的 Promise
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
      throw new Error(data.msg || '請求失敗');
    }
  } catch (error) {
    throw error;
  }
}

/**
 * 新增 URL 產生短連結
 * @param {string} url - 要縮短的 URL
 * @param {string} customShort - (選填) 自訂短連結
 * @returns {Promise} - 返回包含短連結的 Promise
 */
export async function addUrl(url, customShort) {
  return fetchApi('/api/addUrl', {
    method: 'POST',
    body: { url, customShort }
  });
}


/**
 * 獲取 URL 資訊
 * @param {string} shortCode - 短連結代碼
 * @returns {Promise} - 返回包含原始 URL 的 Promise
 */
export async function getUrl(shortCode) {
  return fetchApi(`/api/getUrl/${shortCode}`);
}

/**
 * 獲取點擊統計
 * @param {string} shortCode - 短連結代碼
 * @returns {Promise} - 返回包含點擊次數的 Promise
 */
export async function getStats(shortCode) {
    return fetchApi(`/api/stats/${shortCode}`);
}