import { createFileRoute } from '@tanstack/react-router'
import Utilisateurs from '@components/admin/Utilisateurs'

export const Route = createFileRoute('/_mainLayout/_auth/_adminLayout/admin/utilisateurs/')({
  component: Utilisateurs,
});