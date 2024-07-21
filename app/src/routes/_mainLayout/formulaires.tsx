import { createFileRoute } from '@tanstack/react-router'
import Formulaires from '../../components/admin/Formulaires'

export const Route = createFileRoute('/_mainLayout/formulaires')({
  component: () => <Formulaires admin={false} />,
})