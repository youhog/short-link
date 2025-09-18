// api/index.js
/*
 * @Author: zi.yang
 * @Date: 2024-12-13 17:38:41
 * @LastEditors: zi.yang
 * @LastEditTime: 2025-07-18 15:05:00
 * @Description:
 * @FilePath: /short-link/api/index.js
 */
import Fastify from 'fastify';

import * as linkService from '../service/link.js';

const app = Fastify({
  logger: true,
})

// 新增短連結
app.post('/api/addUrl', async (req, reply) => {
  const { url, customShort } = req.body;
  if (!url) {
    return reply.status(200).type('application/json').send({
      code: 401,
      msg: 'URL 是必填參數'
    });
  }

  // 驗證 URL 格式
  const urlPattern = /^(https?:\/\/|#小程序:\/\/).+/;
  if (!urlPattern.test(url)) {
    return reply.status(200).type('application/json').send({
      code: 401,
      msg: 'URL 格式不正確，必須以 http://、https:// 或 #小程序:// 開頭'
    });
  }

  try {
    const result = await linkService.addUrl(url, customShort);
    if (result.error) throw new Error(result.error.message);
    return reply.status(200).type('application/json').send({
      code: 200,
      msg: '成功',
      url: `/u/${result.data.short}`
    });
  } catch (error) {
    return reply.status(200).type('application/json').send({
      code: 401,
      msg: error.message || '發生未知錯誤'
    });
  }
});

// 重定向短連結
app.get('/u/:hash', async (req, reply) => {
  const hash = req.params?.hash;
  if (hash) {
    const result = await linkService.getUrl(hash);
    if (!result || !result.data || result.error) {
      return reply.status(200).type('application/json').send({
        code: 401,
        msg: '短連結不存在'
      });
    }
    // 在重定向前，非同步更新點擊次數，不阻礙使用者體驗
    linkService.incrementClick(hash);
    return reply.status(302).redirect(result.data.link);
  }
  return reply.status(200).type('application/json').send({
    code: 401,
    msg: '短連結不存在'
  });
});

// 獲取統計數據
app.get('/api/stats/:hash', async (req, reply) => {
    const hash = req.params?.hash;
    if (!hash) {
        return reply.status(200).send({ code: 401, msg: '缺少短連結參數' });
    }
    try {
        const result = await linkService.getStats(hash);
        return reply.status(200).send({
            code: 200,
            msg: '成功',
            data: { clicks: result.data.clicks }
        });
    } catch (error) {
        return reply.status(200).send({ code: 404, msg: error.message });
    }
});


export default async function handler(req, reply) {
  await app.ready()
  app.server.emit('request', req, reply)
}

// 本地開發啟動
if (process.env.NODE_ENV !== 'production') {
  const start = async () => {
    try {
      await app.listen({ port: 3000, host: '0.0.0.0' })
      console.log(`Server listening on ${app.server.address().port}`)
    } catch (err) {
      app.log.error(err)
      process.exit(1)
    }
  }
  start()
}