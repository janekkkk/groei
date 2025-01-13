import { createLazyFileRoute } from '@tanstack/react-router'
import { SeedOverview } from '@/features/Seeds/SeedOverview'

export const Route = createLazyFileRoute('/seeds/')({
  component: RouteComponent
})

function RouteComponent() {
  return (
    <div>
      <SeedOverview />
    </div>
  )
}
