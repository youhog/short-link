import { readFile } from 'node:fs/promises';

import Fastify from 'fastify';

import * as linkService from '../service/link.js';

const app = Fastify({
  logger: true,
})

app.get('/', async (req, reply) => {
  const html = await readFile(process.cwd() + '/view/index.html', { encoding: 'utf-8' })
  return reply.status(200).type('text/html').send(html)
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
    url: `https://short.pangcy.cn/u/${result.data.short}`
  })
})

app.get('/u/:hash', async (req, reply) => {
  return reply.status(301).redirect('https://blog.pangcy.cn')
})

export default async function handler(req, reply) {
  await app.ready()
  app.server.emit('request', req, reply)
}