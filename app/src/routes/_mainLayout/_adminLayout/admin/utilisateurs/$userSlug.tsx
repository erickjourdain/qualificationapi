import { createFileRoute } from '@tanstack/react-router'
import Utilisateur from '../../../../../components/admin/Utilisateur'

export const Route = createFileRoute('/_mainLayout/_adminLayout/admin/utilisateurs/$userSlug')({
  component: Utilisateur,
})