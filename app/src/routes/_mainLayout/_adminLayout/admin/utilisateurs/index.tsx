import { createFileRoute, redirect } from '@tanstack/react-router'
import Utilisateurs from '../../../../../components/admin/Utilisateurs'

export const Route = createFileRoute('/_mainLayout/_adminLayout/admin/utilisateurs/')({
  component: Utilisateurs,
  beforeLoad: ({ context }) => {
    if (!context.auth.isAdmin) {
      throw redirect({to: "/"});
    }
  }
});