import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Box, Container, Toolbar } from '@mui/material';
import MainNav from '@components/MainNav';
import NotFound from '@/components/NotFound';

export const Route = createFileRoute('/_mainLayout')({
  component: MainLayout,
  notFoundComponent: NotFound,
})

function MainLayout() {

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
