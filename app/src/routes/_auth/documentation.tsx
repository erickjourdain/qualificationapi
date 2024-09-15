import { Paper } from '@mui/material';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/documentation')({
  component: Documentation,
});

function Documentation() {
  return (
    <Paper sx={{ height: "800px" }}>
      <embed
        src="/public/assets/documentation.pdf"
        type="application/pdf"
        width="100%"
        height="100%"
        title="documnetation"
      />
    </Paper>
  )
}