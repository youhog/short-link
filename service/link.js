// service/link.js
/*
 * @Author: zi.yang
 * @Date: 2024-12-11 19:47:42
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-07-18 15:00:00
 * @Description:
 * @FilePath: /short-link/service/link.js
 */
import crypto from 'node:crypto';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

function generatorHash(url) {
  var md5 = crypto.createHash('md5');
  const hex = md5.update(url).digest('hex')
  return hex.slice(8, 24)
}

// 根據 short hash 尋找連結
export function getUrl(short) {
  return supabase.from('links').select('*').eq('short', short).single();
}

// 檢查連結是否已存在
export function checkUrlExists(short) {
    return supabase.from('links').select('short').eq('short', short).single();
}


// 新增 URL，支援自訂連結
export async function addUrl(link, customShort) {
    // 如果提供了自訂連結，先檢查是否已存在
    if (customShort) {
        const isExists = await checkUrlExists(customShort);
        if (isExists.data) {
            throw new Error('這個自訂連結已經被使用了');
        }
    }

    const short = customShort || generatorHash(link);

    // 檢查（自動產生的）連結是否已存在
    const isExists = await getUrl(short);
    if (isExists.data) return { data: isExists.data };

    // 插入新連結
    return supabase.from('links').insert([{ link, short, clicks: 0 }]).select().single();
}


// 增加點擊次數
export async function incrementClick(short) {
    const { data, error } = await supabase.rpc('increment_clicks', { short_hash: short });
    if (error) {
        console.error('Error incrementing clicks:', error);
    }
    return { data, error };
}

// 獲取點擊次數統計
export async function getStats(short) {
    const result = await supabase.from('links').select('clicks').eq('short', short).single();
    if (!result.data) {
        throw new Error('找不到指定的短連結');
    }
    return result;
}