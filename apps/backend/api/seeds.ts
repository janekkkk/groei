import { Hono } from 'hono'
import {Seed} from "@bladwijzer/common/src/models/Seed.ts";

const router = new Hono()
router.get('/', ({ json }) => json(['😀', '😳', '🙄'] as unknown as Seed))

export default router
