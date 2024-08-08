import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_auth/opportunites/$uuid/$produitId/$formId",
)({
  component: Reponse,
});

function Reponse() {
  const { formId } = Route.useParams();

  return <div>{formId}</div>;
}
