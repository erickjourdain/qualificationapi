import { useAtom } from 'jotai';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { Box, Container, Toolbar, Typography } from '@mui/material';
import MainNav from '@components/MainNav';
import { userAtom } from '@/stores/mainStore';

export const Route = createFileRoute('/_mainLayout')({
  component: MainLayout,
})

function MainLayout() {

  // Chargement de l'état Atom de l'utilisateur courant
  const [{ isPending, isError }] = useAtom(userAtom);

  if (isError) return <Navigate to="/login" />

  if (isPending) return (
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
      <Typography variant="h5">Chargement en cours....</Typography>
    </Box>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <MainNav />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}
