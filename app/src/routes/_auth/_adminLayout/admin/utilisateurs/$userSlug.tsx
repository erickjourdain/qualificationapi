import { createFileRoute, redirect } from "@tanstack/react-router";
import Utilisateur from "@components/admin/Utilisateur";

export const Route = createFileRoute(
  "/_auth/_adminLayout/admin/utilisateurs/$userSlug",
)({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAdmin) throw redirect({ to: "/forbidden" });
  },
  component: Utilisateur,
});
