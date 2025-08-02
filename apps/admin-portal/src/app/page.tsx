import { Suspense } from 'react';
import { Box } from '@mui/material';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Suspense fallback={<p>Loading...</p>}>
          {children}
        </Suspense>
      </Box>
    </Box>
  );
}