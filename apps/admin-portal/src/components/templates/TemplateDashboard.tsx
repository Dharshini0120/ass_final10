import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Plus } from "lucide-react";
import TemplateTable from "./TemplateTable";
import TemplatePreviewModal from './TemplatePreviewModal';

interface TemplateRecord {
    id: string;
    templateName: string;
    templateDescription: string;
    status: "In Progress" | "Completed";
}

interface TemplateDashboardProps {
    title?: string;
    subtitle?: string;
    onNewTemplate?: () => void;
}

const TemplateDashboard: React.FC<TemplateDashboardProps> = ({
    title = "Templates",
    subtitle = "View and manage all templates for City General Hospital",
    onNewTemplate
}) => {
    const [statusFilter, setStatusFilter] = useState("All Statuses");
    const [sortFilter, setSortFilter] = useState("Most Recent");
    const [templates, setTemplates] = useState<TemplateRecord[]>([]);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const router = useRouter();

    // Load templates from localStorage
    const loadTemplates = () => {
        const drafts = JSON.parse(localStorage.getItem('templateDrafts') || '[]');
        const completed = JSON.parse(localStorage.getItem('completedTemplates') || '[]');

        const allTemplates = [...drafts, ...completed].map(template => ({
            id: template.id,
            templateName: template.name,
            templateDescription: template.description,
            status: template.status || (template.isDraft ? 'In Progress' : 'Completed')
        }));

        setTemplates(allTemplates);
    };

    // Load templates on component mount
    useEffect(() => {
        loadTemplates();
    }, []);

    // Reload templates when window gains focus (to catch updates from other tabs)
    useEffect(() => {
        const handleFocus = () => loadTemplates();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const handleEdit = (id: string) => {
        router.push(`/questionnaire-builder?mode=edit&templateId=${id}`);
    };

    const handleNewTemplate = () => {
        router.push('/questionnaire-builder?mode=new');
    };

    const handleDelete = (id: string) => {
        const template = templates.find(t => t.id === id);
        if (!template) return;

        if (!confirm(`Are you sure you want to delete "${template.templateName}"?`)) {
            return;
        }

        try {
            // Get existing drafts from localStorage
            const existingDrafts = JSON.parse(localStorage.getItem('templateDrafts') || '[]');

            // Filter out the template with the matching ID
            const updatedDrafts = existingDrafts.filter(draft => draft.id !== id);

            // Save back to localStorage
            localStorage.setItem('templateDrafts', JSON.stringify(updatedDrafts));

            // Reload templates to update the UI
            loadTemplates();

            alert(`Template "${template.templateName}" deleted successfully!`);
        } catch (error) {
            console.error('❌ Error deleting template:', error);
            alert('Failed to delete template: ' + error.message);
        }
    };

    const handleView = (id: string) => {
        try {
            // Get drafts from localStorage
            const drafts = JSON.parse(localStorage.getItem('templateDrafts') || '[]');
            const template = drafts.find(d => d.id === id);

            if (template) {
                console.log('📄 Loading template for preview:', template);
                console.log('📊 Template nodes:', template.nodes);
                console.log('🔗 Template edges:', template.edges);
                setPreviewTemplate(template);
            } else {
                console.error('❌ Template not found with ID:', id);
                alert('Template not found!');
            }
        } catch (error) {
            console.error('❌ Error loading template:', error);
            alert('Failed to load template for preview');
        }
    };

    // Filter templates based on filters
    const filteredTemplates = templates.filter(template => {
        const matchesStatus = statusFilter === "All Statuses" || template.status === statusFilter;
        return matchesStatus;
    });

    return (
        <Box className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'column', lg: 'row' },
                justifyContent: 'space-between',
                alignItems: { xs: 'flex-start', md: 'flex-start', lg: 'center' },
                mb: 3,
                pt: 3,
                px: { xs: 2, sm: 3 },
                gap: { xs: 2, md: 2, lg: 0 }
            }}>
                <Box>
                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: { xs: '24px', sm: '28px' },
                            fontWeight: 600,
                            color: '#111827',
                            mb: 0.5,
                            lineHeight: 1.2,
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {title}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '14px',
                            color: '#6b7280',
                            fontWeight: 400,
                            whiteSpace: { xs: 'normal', sm: 'nowrap' }
                        }}
                    >
                        {subtitle}
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    startIcon={<Plus size={16} />}
                    onClick={handleNewTemplate}
                    sx={{
                        backgroundColor: '#3b82f6',
                        textTransform: 'none',
                        fontSize: '14px',
                        fontWeight: 500,
                        px: 2,
                        py: 1,
                        borderRadius: '6px',
                        boxShadow: 'none',
                        whiteSpace: 'nowrap',
                        minWidth: 'fit-content',
                        alignSelf: { xs: 'center', md: 'flex-start', lg: 'center' },
                        '&:hover': {
                            backgroundColor: '#2563eb',
                            boxShadow: 'none'
                        }
                    }}
                >
                    New Template
                </Button>
            </Box>

            {/* Filters */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
                gap: { xs: 2, lg: 3 },
                alignItems: 'flex-end',
                mb: 4,
                px: { xs: 2, sm: 3 }
            }}>
                <FormControl sx={{ minWidth: { xs: '100%', lg: 260 } }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        label="Status"
                        onChange={(e) => setStatusFilter(e.target.value)}
                        sx={{ backgroundColor: 'white' }}
                    >
                        <MenuItem value="All Statuses">All Statuses</MenuItem>
                        <MenuItem value="In Progress">In Progress</MenuItem>
                        <MenuItem value="Completed">Completed</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: { xs: '100%', lg: 260 } }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortFilter}
                        label="Sort By"
                        onChange={(e) => setSortFilter(e.target.value)}
                        sx={{ backgroundColor: 'white' }}
                    >
                        <MenuItem value="Most Recent">Most Recent</MenuItem>
                        <MenuItem value="Oldest">Oldest</MenuItem>
                        <MenuItem value="Name A-Z">Name A-Z</MenuItem>
                        <MenuItem value="Name Z-A">Name Z-A</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {/* Templates Table */}
            <Box sx={{ px: { xs: 0, sm: 3 } }}>
                <TemplateTable
                    templates={filteredTemplates}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showHeader={true}
                />
            </Box>

            {/* Preview Modal */}
            {previewTemplate && (
                <TemplatePreviewModal
                    template={previewTemplate}
                    onClose={() => setPreviewTemplate(null)}
                />
            )}
        </Box>
    );
};

export default TemplateDashboard;

