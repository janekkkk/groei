import { createLazyFileRoute } from '@tanstack/react-router'
import { AddSeeds } from '@/features/Seeds/AddSeeds'

export const Route = createLazyFileRoute('/seeds/add')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div>
      <AddSeeds />
    </div>
  )
}
