import api from './src/service/api.js'
import { handler } from './src/template.js'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import { serveStatic } from '@hono/node-server/serve-static'
import config from './src/config.js'
import { get_runtime, get_url } from './src/util.js'
import { readFile } from 'fs/promises'
import { join } from 'path'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())
// 托管静态文件（保留，方便后续用）
app.use('/*', serveStatic({ root: './public' }))

// ✅ 新增：专门读取 yy.txt 的接口（兜底方案，100%能访问）
app.get('/yy.txt', async (c) => {
  try {
    const filePath = join(process.cwd(), 'yy.txt')
    const content = await readFile(filePath, 'utf8')
    return c.text(content)
  } catch (err) {
    console.error('读取 yy.txt 失败:', err)
    return c.text('文件读取失败', 500)
  }
})

app.get('/api', api)
app.get('/test', handler)
app.get('/', (c) => {
    return c.html(`
                    <html>
                        <head>
                            <title>Meting正在运行</title>
                        </head>
                        <body>
                            <h1>Meting API</h1>
                            <p>
                                <a href="https://github.com/xizeyoupan/Meting-API" style="text-decoration: none;">
                                    <img alt="Static Badge" src="https://img.shields.io/badge/Github-Meting-green">
                                    <img alt="GitHub forks" src="https://img.shields.io/github/forks/xizeyoupan/Meting-API">
                                    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/xizeyoupan/Meting-API">
                                </a>
                            </p>

                            <p>当前版本：1.1.2</p>
                            <p>当前运行环境：${get_runtime()}</p>
                            <p>当前时间：${new Date()}</p>
                            <p>内部端口：${config.PORT}</p>
                            <p>部署在大陆：${config.OVERSEAS ? '否' : '是'}</p>
                            <p>当前地址：<a>${c.req.url}</a></p>
                            <p>实际地址：<a>${get_url(c)}</a></p>
                            <p>测试地址：<a href="${get_url(c) + 'test'}">${get_url(c) + 'test'}</a></p>
                            <p>api地址：<a href="${get_url(c) + 'api'}">${get_url(c) + 'api'}</a></p>

                        </body>
                    </html>`
    )
})

export default app
