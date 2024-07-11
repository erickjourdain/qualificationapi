import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { Box, Container, Toolbar, Typography } from '@mui/material';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import ApplicationMainNav from '../components/ApplicationMainNav';
import { getCurrentUser } from '../utils/apiCall';
import { loggedUser } from '../atomState';

export const Route = createFileRoute('/_mainLayout')({
  component: MainLayout,
})

function MainLayout() {

  // Chargement de l'état Atom de l'utilisateur courant
  const setUser = useSetAtom(loggedUser);

  // Chargement de l'utilisateur connecté
  const {
    isLoading,
    data: userData,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["getCurrentUser"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  // Enregistrement des données dans l'état Atom
  useEffect(() => {
    if (isSuccess) setUser(userData.data);
  }, [userData]);

  if (isError) return <Navigate to="/login" />

  if (isLoading) return (
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
      <Typography variant="h5">Chargement en cours....</Typography>
    </Box>
  )

  return (
    <Box sx={{ display: "flex" }}>
      <ApplicationMainNav />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}
