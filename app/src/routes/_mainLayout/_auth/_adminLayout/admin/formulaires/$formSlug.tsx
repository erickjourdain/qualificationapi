import { createFileRoute } from '@tanstack/react-router';
import Formulaire from '@components/admin/Formulaire';

export const Route = createFileRoute('/_mainLayout/_auth/_adminLayout/admin/formulaires/$formSlug')({
  component: Formulaire,
})