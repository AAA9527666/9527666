import api from './src/service/api.js'
import { handler } from './src/template.js'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'
import config from './src/config.js'
import { get_runtime, get_url } from './src/util.js'
import { readFile } from 'fs/promises'
import { join } from 'path'

const app = new Hono()

app.use('*', cors())
app.use('*', logger())

// 稳定读取 yy.txt
app.get('/yy.txt', async (c) => {
  try {
    const content = await readFile(join(process.cwd(), 'yy.txt'), 'utf8')
    return c.text(content)
  } catch (err) {
    return c.text('加载失败', 500)
  }
})

app.get('/api', api)
app.get('/test', handler)

// 首页：自动展示 yy.txt，无内部滚动，只保留浏览器滚动
app.get('/', (c) => {
    return c.html(`
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Meting API</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 900px;
            margin: 2rem auto;
            padding: 0 1rem;
            background: #f8f9fa;
        }
        .container {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
        }
        h1 {
            color: #2c3e50;
        }
        .status {
            padding: 0.5rem 1rem;
            border-radius: 6px;
            margin-bottom: 1rem;
        }
        .success {
            background: #d4edda;
            color: #155724;
        }
        .error {
            background: #f8d7da;
            color: #721c24;
        }
        .content {
            background: #f1f1f1;
            padding: 1.5rem;
            border-radius: 8px;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow: visible;
            max-height: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Meting API</h1>
        <p>✅ yy.txt 已正常加载</p>
        <p>访问地址：<a href="/yy.txt">https://9527666.vercel.app/yy.txt</a></p>
        <br>
        <div id="status" class="status">正在加载文件内容...</div>
        <div id="content" class="content"></div>
    </div>

    <script>
        async function loadFile() {
            const s = document.getElementById('status');
            const c = document.getElementById('content');
            try {
                let res = await fetch('/yy.txt');
                if (!res.ok) throw new Error('加载失败');
                let text = await res.text();
                s.className = 'status success';
                s.textContent = '✅ 加载成功';
                c.textContent = text;
            } catch (err) {
                s.className = 'status error';
                s.textContent = '❌ 加载失败';
            }
        }
        window.addEventListener('DOMContentLoaded', loadFile);
    </script>
</body>
</html>`
    )
})

export default app
