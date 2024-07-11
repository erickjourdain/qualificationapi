import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/close')({
  component: () => <div>Hello /close!</div>
})