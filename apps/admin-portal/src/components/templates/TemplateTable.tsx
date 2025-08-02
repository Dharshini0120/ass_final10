"use client";

import { Box, Typography, IconButton } from "@mui/material";
import EditSquareIcon from '@mui/icons-material/EditSquare';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface TemplateRecord {
    id: string;
    templateName: string;
    templateDescription: string;
    status: "In Progress" | "Completed";
}

interface TemplateTableProps {
    templates: TemplateRecord[];
    onView?: (id: string) => void;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    showHeader?: boolean;
}

const TemplateTable: React.FC<TemplateTableProps> = ({
    templates,
    onView,
    onEdit,
    onDelete,
    showHeader = true
}) => {
    const getStatusBadgeStyles = (status: string) => {
        switch (status) {
            case "In Progress":
                return {
                    backgroundColor: '#fff6d8',
                    color: "#de9700",
                    fontWeight: 600
                };
            case "Completed":
                return {
                    backgroundColor: '#e7faf0',
                    color: "#22bb66",
                    fontWeight: 600
                };
            default:
                return {
                    backgroundColor: '#F3F4F6',
                    color: '#6B7280'
                };
        }
    };

    const TableContent = () => (
        <Box className="bg-white w-full rounded-2xl">
            {/* Table Header */}
            {showHeader && (
                <Box
                    className="grid grid-cols-4 px-6 py-4 border-b border-gray-200 mx-4"
                    sx={{
                        backgroundColor: '#f5f9ff',
                        borderRadius: '12px',
                        gap: { xs: 3, sm: 4, md: 6 },
                        minWidth: '600px'
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#374151',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Template Name
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#374151',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Template Description
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#374151',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Status
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '14px',
                            fontWeight: 600,
                            color: '#374151',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        Actions
                    </Typography>
                </Box>
            )}

            {/* Table Rows */}
            {templates.map((template, index) => (
                <Box
                    key={template.id}
                    className={`grid grid-cols-4 px-6 py-4 mx-4 ${index !== templates.length - 1 ? 'border-b-[2px] border-gray-200' : ''
                        }`}
                    sx={{
                        transition: 'background 0.2s',
                        gap: { xs: 3, sm: 4, md: 6 },
                        minWidth: '600px',
                        '&:hover': {
                            backgroundColor: '#f2f2f2',
                        },
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#111827',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {template.templateName}
                    </Typography>

                    <Typography
                        sx={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '14px',
                            fontWeight: 400,
                            color: '#111827',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '200px'
                        }}
                    >
                        {template.templateDescription}
                    </Typography>

                    <Box
                        sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '2px 8px',
                            borderRadius: '1px',
                            fontSize: '14px',
                            fontWeight: 500,
                            fontFamily: '"Inter", sans-serif',
                            width: 'fit-content',
                            height: '24px',
                            whiteSpace: 'nowrap',
                            ...getStatusBadgeStyles(template.status)
                        }}
                    >
                        {template.status}
                    </Box>

                    <Box className="flex gap-2 items-center" sx={{ whiteSpace: 'nowrap' }}>
                        {/* View Icon - Always present */}
                        <IconButton
                            size="small"
                            onClick={() => onView?.(template.id)}
                            sx={{
                                padding: '6px',
                                '&:hover': {
                                    backgroundColor: 'rgba(59, 130, 246, 0.1)'
                                }
                            }}
                        >
                            <VisibilityIcon sx={{ color: '#3b82f6', width: 25, height: 25 }} />
                        </IconButton>

                        {/* Delete Icon - Always present */}
                        <IconButton
                            size="small"
                            onClick={() => onDelete?.(template.id)}
                            sx={{
                                padding: '6px',
                                '&:hover': {
                                    backgroundColor: 'rgba(239, 68, 68, 0.1)'
                                }
                            }}
                        >
                            <DeleteOutlineIcon sx={{ color: '#ef4444', width: 25, height: 25 }} />
                        </IconButton>

                        {/* Edit Icon - Only for In Progress */}
                        {template.status === "In Progress" && (
                            <IconButton
                                size="small"
                                onClick={() => onEdit?.(template.id)}
                                sx={{
                                    padding: '6px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(34, 197, 94, 0.1)'
                                    }
                                }}
                            >
                                <EditSquareIcon sx={{ color: '#22bb66', width: 25, height: 25 }} />
                            </IconButton>
                        )}
                    </Box>
                </Box>
            ))}
        </Box>
    );

    return (
        <>
            {/* Desktop Layout - Direct Table */}
            <Box sx={{
                display: { xs: 'none', md: 'block' }
            }}>
                <TableContent />
            </Box>

            {/* Mobile Layout - Card with scrollable table */}
            <Box sx={{
                display: { xs: 'block', md: 'none' },
                mx: 3,
                mb: 3,
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                {/* Card Header */}
                <Box sx={{
                    borderBottom: '1px solid #e5e7eb',
                    px: 3,
                    py: 2
                }}>
                    <Typography
                        sx={{
                            fontSize: '16px',
                            fontWeight: 600,
                            color: '#111827'
                        }}
                    >
                        Templates
                    </Typography>
                </Box>

                {/* Scrollable Table Container */}
                <Box sx={{
                    maxHeight: '400px',
                    overflowY: 'auto',
                    overflowX: 'auto',
                    '&::-webkit-scrollbar': {
                        width: '6px',
                        height: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f1f1f1',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#c1c1c1',
                        borderRadius: '3px',
                    },
                }}>
                    <TableContent />
                </Box>

                {/* Empty State for Mobile */}
                {templates.length === 0 && (
                    <Box sx={{
                        py: 4,
                        textAlign: 'center',
                        borderTop: '1px solid #e5e7eb'
                    }}>
                        <Typography sx={{ color: '#6b7280' }}>
                            No templates found.
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* Desktop Empty State */}
            {templates.length === 0 && (
                <Box sx={{
                    display: { xs: 'none', md: 'block' },
                    py: 4,
                    textAlign: 'center'
                }}>
                    <Typography sx={{ color: '#6b7280' }}>
                        No templates found.
                    </Typography>
                </Box>
            )}
        </>
    );
};

export default TemplateTable;

