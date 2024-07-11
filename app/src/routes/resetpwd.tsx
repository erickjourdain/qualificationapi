import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/resetpwd')({
  component: () => <div>Hello /resetpwd!</div>
})