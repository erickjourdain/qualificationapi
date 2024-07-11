import { createFileRoute } from '@tanstack/react-router';
import FormulaireAjouter from '../../../../../components/admin/FormulaireAjouter';

export const Route = createFileRoute('/_mainLayout/_adminLayout/admin/formulaires/ajouter')({
  component: FormulaireAjouter,
})