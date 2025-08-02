import React from 'react';
import { Box, Typography, Container, Link, Divider } from '@mui/material';
import { MapPin, Phone, Mail } from 'lucide-react';

const AppFooter: React.FC = () => {
    return (
        <Box sx={{ backgroundColor: '#ffffff', color: '#0f172a', pt: 8, pb: 4, fontFamily: 'Inter, sans-serif' }}>
            <Container maxWidth="lg">
                {/* Top Grid */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' },
                        gap: 6,
                        pb: 6,
                    }}
                >
                    {/* Logo & Description */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <MapPin size={26} color="#1d4ed8" />
                            <Typography
                                sx={{
                                    fontSize: '1.25rem', // 20px
                                    fontWeight: 700,
                                    color: '#1e3a8a',
                                    fontFamily: 'Inter, sans-serif',
                                    lineHeight: 1.6,
                                    textTransform: 'uppercase',
                                }}
                            >
                                COMPANY LOGO
                            </Typography>
                        </Box>
                        <Typography
                            sx={{
                                fontSize: '1rem', // 16px
                                lineHeight: 1.6,
                                fontWeight: 400,
                                color: '#1f2937',
                                maxWidth: 420,
                                fontFamily: 'Inter, sans-serif',
                            }}
                        >
                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.
                        </Typography>
                    </Box>

                    {/* Quick Links */}
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontFamily: 'Inter, sans-serif',
                                fontWeight: 700,
                                fontSize: '1.25rem', // 20px
                                mb: 2,
                                lineHeight: 1.6,
                                textTransform: 'uppercase',
                            }}
                        >
                            Quick Links
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {['Features', 'About', 'Contact', 'Sign In'].map((item) => (
                                <Link
                                    key={item}
                                    href="#"
                                    sx={{
                                        fontSize: '1rem', // 16px
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                        color: '#1f2937',
                                        fontFamily: 'Inter, sans-serif',
                                        lineHeight: 1.6,
                                        '&:hover': { color: '#3b82f6' },
                                    }}
                                >
                                    {item}
                                </Link>
                            ))}
                        </Box>
                    </Box>

                    {/* Contact Info */}
                    <Box>
                        <Typography
                            sx={{
                                fontWeight: 700,
                                fontSize: '1.25rem', // 20px
                                marginBottom: '16px',
                                fontFamily: 'Inter, sans-serif',
                                lineHeight: 1.6,
                                textTransform: 'uppercase',
                            }}
                        >
                            Contact Us
                        </Typography>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <MapPin size={20} color="#3b82f6" />
                            <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: '#1f2937', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
                                123 Medical Drive, Health City, HC 12345
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                            <Mail size={20} color="#3b82f6" />
                            <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: '#1f2937', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
                                info@gmail.com
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Phone size={20} color="#3b82f6" />
                            <Typography sx={{ fontSize: '1rem', fontWeight: 500, color: '#1f2937', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
                                +1 (987) 654 - 3210
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Divider */}
                <Divider sx={{ borderColor: '#e5e7eb', mb: 3 }} />

                {/* Bottom Bar */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 400, color: '#4b5563', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
                        Copyright ©2025 – All rights reserved
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 3,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            color: '#4b5563',
                            fontFamily: 'Inter, sans-serif',
                            lineHeight: 1.6,
                        }}
                    >
                        <Link href="#" underline="none" sx={{ color: '#4b5563', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.6, '&:hover': { color: '#1d4ed8' } }}>
                            Terms & Conditions
                        </Link>
                        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.6 }}>|</Typography>
                        <Link href="#" underline="none" sx={{ color: '#4b5563', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.6, '&:hover': { color: '#1d4ed8' } }}>
                            Privacy Policy
                        </Link>
                        <Typography sx={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.6 }}>|</Typography>
                        <Link href="#" underline="none" sx={{ color: '#4b5563', fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.875rem', lineHeight: 1.6, '&:hover': { color: '#1d4ed8' } }}>
                            Help
                        </Link>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default AppFooter;
