/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect } from 'react';
import { Box, Button, Typography, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Grid, InputLabel, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { AddOutlined, Edit, RemoveRedEyeOutlined } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { currentAssessment, setAssessments } from '../../store/assessmentSlice';

const statusStyles: any = {
    'In Progress': {
        backgroundColor: '#fff3cd',
        color: '#d8a714ff',
        fontWeight: 600,
        borderRadius: '4px',
        padding: '4px 8px',
        width: '120px',
        textAlign: 'center',
    },
    Completed: {
        backgroundColor: '#d4edda',
        fontWeight: 600,
        borderRadius: '4px',
        padding: '4px 8px',
        width: '120px',
        textAlign: 'center',
        color: '#18cf43ff',
    },
};

const Assessments = () => {
    const [status, setStatus] = React.useState('');
    const [allTime, setAllTime] = React.useState('');
    const [sortOrder, setSortOrder] = React.useState('');
    const router = useRouter();
    const assessmentList = useSelector((state: RootState) => state.assessment.assessmentList);
    const dispatch = useDispatch();

    console.log('Assessment List:', assessmentList);

    useEffect(() => {
        dispatch(currentAssessment({
            id: "ASS006",
            title: '',
            category: '',
            description: '',
            createdBy: '',
            createdDate: '',
            status: '',
            priority: '',
            completedBy: '',
            lastModified: '',
            sections: [],
            date: ''
        }));
    }, [])

    const handleEditAssessment = (data: any) => {
        dispatch(currentAssessment(data));
        router.push(`/assessment/form`);
    }


    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h5" fontWeight={600} fontFamily={'var(--font-inter), sans-serif'}>Assessment Records</Typography>
                    <Typography variant="subtitle1" color="#6c757d" fontFamily={'var(--font-inter), sans-serif'}>
                        View and manage all assessments for City General Hospital
                    </Typography>
                </Box>
                <Button
                    onClick={() => router.push('/assessment/form')}
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
                    <AddOutlined /> &nbsp; New Assessment
                </Button>
            </Box>

            <Box sx={{ border: '1px solid #e4e5e7', borderRadius: '10px', padding: 3, backgroundColor: '#fff' }}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid  >
                        <FormControl sx={{ minWidth: 230 }}>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={status}
                                label="Status"
                                style={{ borderRadius: '12px', height: '50px' }}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <MenuItem value="In Progress">In Progress</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </Select>
                        </FormControl>

                    </Grid>
                    <Grid  >
                        <FormControl sx={{ minWidth: 230 }}>
                            <InputLabel>All Time</InputLabel>
                            <Select
                                value={allTime}
                                label="All Time"
                                style={{ borderRadius: '12px', height: '50px' }}
                                onChange={(e) => setAllTime(e.target.value)}
                            >
                                <MenuItem value="All Time">All Time</MenuItem>
                                <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
                            </Select>
                        </FormControl>

                    </Grid>
                    <Grid  >
                        <FormControl sx={{ minWidth: 230 }}>
                            <InputLabel>Most Recent</InputLabel>
                            <Select
                                value={sortOrder}
                                label="Most Recent"
                                style={{ borderRadius: '12px', height: '50px' }}
                                onChange={(e) => setSortOrder(e.target.value)}
                            >
                                <MenuItem value="Most Recent">Most Recent</MenuItem>
                                <MenuItem value="Oldest">Oldest</MenuItem>
                            </Select>
                        </FormControl>

                    </Grid>
                </Grid>

                <TableContainer style={{ borderRadius: '12px', overflow: 'hidden' }} >
                    <Table >
                        <TableHead sx={{ backgroundColor: '#f5f9ff' }}>
                            <TableRow>
                                <TableCell><strong>Assessment Date</strong></TableCell>
                                <TableCell><strong>Status</strong></TableCell>
                                <TableCell><strong>Completed By</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {assessmentList.map((row: any) => (
                                <TableRow key={row.id}>
                                    <TableCell>{new Date(row.createdDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</TableCell>
                                    <TableCell>
                                        <Box sx={statusStyles[row.status]}>{row.status}</Box>
                                    </TableCell>
                                    <TableCell>{row.completedBy || 'Admin'}</TableCell>
                                    <TableCell>
                                        {row.status === 'In Progress' && <IconButton onClick={() => handleEditAssessment(row)}><Edit style={{ fontSize: '25px', color: '#408bff' }} /></IconButton>}
                                        {row.status === 'Completed' && <IconButton><RemoveRedEyeOutlined style={{ fontSize: '25px', color: '#408bff' }} /></IconButton>}
                                        {row.status === 'Completed' && <IconButton><PictureAsPdfIcon style={{ fontSize: '25px', color: '#18cf43ff' }} /></IconButton>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export default Assessments;