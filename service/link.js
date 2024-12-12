/*
 * @Author: zi.yang
 * @Date: 2024-12-11 19:47:42
 * @LastEditors: zi.yang
 * @LastEditTime: 2024-12-12 09:16:19
 * @Description: 
 * @FilePath: /short-link/service/link.js
 */
import crypto from 'node:crypto';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)

function generatorHash(url) {
  var md5 = crypto.createHash('shake256', { outputLength: 16 });
  const hex = md5.update(url).digest('hex')
  return hex.slice(8, 24)
}

export function getUrl(short) {
  return supabase.from('links').select('*').eq('short', short)
}

export async function addUrl(req) {
  const link = req.body.url
  const short = generatorHash(link)
  const isExists = await getUrl(short)
  if (isExists.data.length) return { data: isExists.data[0] }
  return supabase.from('links').insert([{ link, short }]).select().single()
}