import Fastify from 'fastify';

import * as linkService from '../service/link.js';

const app = Fastify({
  logger: true,
})

app.post('/api/addUrl', async (req, reply) => {
  const url = req.body?.url
  if (!url) {
    return reply.status(200).type('application/json').send({
      code: 401,
      msg: 'URL 是必填参数'
    })
  }
  const result = await linkService.addUrl(req)
  if (result.error) {
    return reply.status(200).type('application/json').send({
      code: 401,
      msg: result.error.message || '未知错误'
    })
  }
  return reply.status(200).type('application/json').send({
    code: 200,
    msg: 'success',
    url: `/u/${result.data.short}`
  })
})

app.get('/u/:hash', async (req, reply) => {
  if (req.params?.hash) {
    const result = await linkService.getUrl(req.params.hash)
    if (!result || !result.data?.length || result.error) {
      return reply.status(200).type('application/json').send({
        code: 401,
        msg: result.error.message || '短链接不存在'
      })
    }
    return reply.status(302).redirect(result.data[0].link)
  }
  return reply.status(200).type('application/json').send({
    code: 401,
    msg: '短链接不存在'
  })
})

export default async function handler(req, reply) {
  await app.ready()
  app.server.emit('request', req, reply)
}