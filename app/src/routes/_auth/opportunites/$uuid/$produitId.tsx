import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute("/_auth/opportunites/$uuid/$produitId")({
  component: Produit
})

function Produit () {
  const { produitId } = Route.useParams();

  return <>Produit: {produitId}</>
}
