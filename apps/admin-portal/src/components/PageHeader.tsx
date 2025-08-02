import { Box, Button, Typography, Grid } from '@mui/material';
import { ArrowBack, BackupOutlined, SaveAltOutlined, SaveOutlined } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
    showActionButton?: boolean;
    actionButtonText?: string;
    onActionClick?: () => void;
}

export const PageHeader = ({
    title,
    subtitle,
    actionButtonText = 'Save Assessment',
    onActionClick
}: PageHeaderProps) => {
    const router = useRouter();

    return (
        <Box sx={{ mb: 3, background: '#fff', borderRadius: '10px', border: '1px solid #eff0f1ff' }}>
            <Grid container alignItems="center" style={{ padding: '16px 24px' }}>
                <Grid size={1}  >
                    <Button
                        onClick={() => router.back()}
                        startIcon={<ArrowBack />}
                        sx={{
                            color: '#3a7de6',
                            textTransform: 'none',
                            fontWeight: 500,
                            fontFamily: 'var(--font-inter), sans-serif',
                            minWidth: 'auto',
                            '&:hover': {
                                backgroundColor: 'transparent',
                            },
                            padding: '5px 14px',
                        }}

                        variant='text'
                    >  Back
                    </Button>
                </Grid>

                <Grid size={9} style={{ paddingLeft: '30px' }}  >
                    <Typography
                        variant="h6"
                        fontWeight={800}
                        fontFamily={'var(--font-inter), sans-serif'}
                    >
                        {title}
                    </Typography>

                    <Typography
                        variant="subtitle2"
                        color="#6c757d"
                        fontFamily={'var(--font-inter), sans-serif'}
                    >
                        {subtitle}
                    </Typography>

                </Grid>
                <Grid size={2} textAlign={'right'}>
                    <Button
                        onClick={onActionClick}
                        variant="contained"
                        size='large'
                        sx={{
                            background: 'linear-gradient(90deg, #408bff 0%, #3a7de6 100%)',
                            textTransform: 'none',
                            letterSpacing: '0.5px',
                            fontWeight: 500,
                            fontFamily: 'var(--font-inter), sans-serif',
                            borderRadius: '4px',
                            padding: '8px 24px',
                            boxShadow: '0 2px 8px rgba(64, 139, 255, 0.25)',
                            border: 'none',
                            '&:hover': {
                                background: 'linear-gradient(90deg, #3a7de6 0%, #3670cc 100%)',
                                boxShadow: '0 4px 12px rgba(64, 139, 255, 0.3)',
                            }
                        }}
                    >
                        <SaveOutlined /> &nbsp; {actionButtonText}
                    </Button>

                </Grid>
            </Grid>


        </Box>
    );
};