import { Hono } from 'hono'
import {  secureHeaders } from 'hono/secure-headers'
import {compress} from 'hono/compress'
import {cors} from 'hono/cors'
import {logger} from 'hono/logger'
import api from './api/index.ts'
import { customLogger } from './logger.ts'
import middlewares from './middleware.ts'

const app = new Hono().basePath('/')

app.use('*', compress())
app.use('*', cors())

if (Deno.env.get('ENV') !== 'test') {
    app.use('*', logger(customLogger))
}

app.use('*', secureHeaders())

app.get('/', (c) =>
    c.json({
        message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
    }))

app.route('/api', api)

app.notFound(middlewares.notFound)

export default app
