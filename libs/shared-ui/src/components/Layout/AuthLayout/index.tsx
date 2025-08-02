import { ReactNode } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  useMediaQuery, 
  useTheme,
  Tabs,
  Tab
} from '@mui/material';
import Image from 'next/image';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  logoSrc?: string;
  backgroundImageSrc?: string;
  showTabs?: boolean;
  activeTab?: 'signup' | 'signin';
  onTabChange?: (tab: 'signup' | 'signin') => void;
}

export const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  logoSrc = '/logo.svg',
  backgroundImageSrc = '/images/doctor-background.jpg',
  showTabs = true,
  activeTab = 'signup',
  onTabChange
}: AuthLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'signup' | 'signin') => {
    if (onTabChange) {
      onTabChange(newValue);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      bgcolor: 'background.default',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={0} sx={{ 
          boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px',
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          height: isMobile ? 'auto' : '85vh'
        }}>
          {/* Left side - Form */}
          <Grid item xs={12} md={6} sx={{ 
            p: { xs: 3, sm: 4, md: 5 },
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ position: 'relative', width: 180, height: 60 }}>
                <Image 
                  src={logoSrc} 
                  alt="Company Logo" 
                  layout="fill"
                  objectFit="contain"
                />
              </Box>
            </Box>

            <Typography variant="h4" component="h1" sx={{ 
              fontWeight: 600, 
              textAlign: 'center',
              mb: 1
            }}>
              {title}
            </Typography>
            
            {subtitle && (
              <Typography variant="body1" color="text.secondary" sx={{ 
                textAlign: 'center',
                mb: 4
              }}>
                {subtitle}
              </Typography>
            )}

            {showTabs && (
              <Box sx={{ mb: 4 }}>
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange}
                  variant="fullWidth"
                  sx={{
                    '& .MuiTab-root': {
                      textTransform: 'none',
                      fontSize: '1rem',
                      fontWeight: 500,
                      py: 1.5
                    }
                  }}
                >
                  <Tab label="Sign Up" value="signup" />
                  <Tab label="Sign In" value="signin" />
                </Tabs>
              </Box>
            )}

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {children}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ 
              textAlign: 'center',
              mt: 4
            }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna
            </Typography>
          </Grid>

          {/* Right side - Image */}
          <Grid item xs={12} md={6} sx={{ 
            display: { xs: 'none', md: 'block' },
            position: 'relative',
            bgcolor: 'grey.100'
          }}>
            <Box sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${backgroundImageSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};