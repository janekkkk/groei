import { Hono } from 'hono'
import seeds from './seeds.ts'

const router = new Hono()

router.get('/', ({ json }) =>
    json({
        message: 'API - 👋🌎🌍🌏',
    }))

router.route('/seeds', seeds)

export default router
