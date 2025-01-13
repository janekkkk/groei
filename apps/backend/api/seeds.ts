import { Hono } from 'hono'
import { Seed } from "@bladwijzer/types/src/models/seed.model.ts"

const router = new Hono()

router.get('/', ({ json }) => json(['😀', '😳', '🙄'] as Seed))

export default router
