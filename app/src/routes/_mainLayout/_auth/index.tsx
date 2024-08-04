import { createFileRoute, redirect } from '@tanstack/react-router';


export const Route = createFileRoute('/_mainLayout/_auth/')({
  beforeLoad: () => { throw redirect({ to: "/opportunites"}) }
})