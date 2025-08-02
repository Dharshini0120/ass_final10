import React, { useRef } from 'react';
import { TextField, Box, IconButton, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import DraftsIcon from '@mui/icons-material/Drafts';
import FolderIcon from '@mui/icons-material/Folder';

interface ToolbarProps {
    onAddQuestion: () => void;
    onAddSection: () => void;
    onSave: () => void;
    onSaveAsDraft: () => void;
    onExportJSON: () => void;
    onImportJSON: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClearAll: () => void;
    onPreviewConnections: () => void;
    hideIcons: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({
    onAddQuestion,
    onAddSection,
    onSave,
    onSaveAsDraft,
    onExportJSON,
    onImportJSON,
    onClearAll,
    onPreviewConnections,
    hideIcons
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target?.result as string);
                    onImportJSON(jsonData);
                } catch (error) {
                    alert('Invalid JSON file format');
                }
            };
            reader.readAsText(file);
        } else {
            alert('Please select a valid JSON file');
        }
        // Reset input value
        event.target.value = '';
    };

    return (
        <Box sx={{
            // height: '80px',
            // background: 'white',
            // borderBottom: '1px solid #e0e0e0',
            // display: 'flex',
            // alignItems: 'center',
            // padding: '0 20px',
            // gap: '12px',
            // boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            {/* <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                style={{ display: 'none' }}
            /> */}

            {/* <TextField
                placeholder="Search"
                variant="outlined"
                size="small"
                InputProps={{
                    startAdornment: <SearchIcon sx={{ color: '#666', mr: 1 }} />
                }}
                sx={{ width: '200px', mr: '20px' }}
            /> */}

            {/* <Box sx={{ flexGrow: 1 }} /> */}

            {!hideIcons && (
                <Box sx={{
                    position: 'fixed',
                    right: '20px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    zIndex: 1000
                }}>
                    <Tooltip title="Add Question" placement="left">
                        <IconButton
                            onClick={onAddQuestion}
                            sx={{
                                backgroundColor: '#4FC3F7',
                                color: 'white',
                                '&:hover': { backgroundColor: '#29B6F6' },
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%'
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Add Section" placement="left">
                        <IconButton
                            onClick={onAddSection}
                            sx={{
                                backgroundColor: '#9C27B0',
                                color: 'white',
                                '&:hover': { backgroundColor: '#7B1FA2' },
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%'
                            }}
                        >
                            <FolderIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Save" placement="left">
                        <IconButton
                            onClick={onSave}
                            sx={{
                                backgroundColor: '#66BB6A',
                                color: 'white',
                                '&:hover': { backgroundColor: '#4CAF50' },
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%'
                            }}
                        >
                            <SaveIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Save as Draft" placement="left">
                        <IconButton
                            onClick={onSaveAsDraft}
                            sx={{
                                backgroundColor: '#FF9800',
                                color: 'white',
                                '&:hover': { backgroundColor: '#F57C00' },
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%'
                            }}
                        >
                            <DraftsIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Import JSON" placement="left">
                        <IconButton
                            onClick={handleImportClick}
                            sx={{
                                backgroundColor: '#26C6DA',
                                color: 'white',
                                '&:hover': { backgroundColor: '#00BCD4' },
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%'
                            }}
                        >
                            <FileUploadIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Export JSON" placement="left">
                        <IconButton
                            onClick={onExportJSON}
                            sx={{
                                backgroundColor: '#26C6DA',
                                color: 'white',
                                '&:hover': { backgroundColor: '#00BCD4' },
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%'
                            }}
                        >
                            <FileDownloadIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Preview Connections" placement="left">
                        <IconButton
                            onClick={onPreviewConnections}
                            sx={{
                                backgroundColor: '#AB47BC',
                                color: 'white',
                                '&:hover': { backgroundColor: '#9C27B0' },
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%'
                            }}
                        >
                            <VisibilityIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Clear All" placement="left">
                        <IconButton
                            onClick={onClearAll}
                            sx={{
                                backgroundColor: '#EF5350',
                                color: 'white',
                                '&:hover': { backgroundColor: '#F44336' },
                                width: '48px',
                                height: '48px',
                                borderRadius: '50%'
                            }}
                        >
                            <ClearIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}

            {/* <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box sx={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#007bff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}>
                    R
                </Box>
                <span style={{ fontSize: '14px', color: '#333' }}>Ramesh</span>
            </Box> */}
        </Box>
    );
};

export default Toolbar;

