'use client'
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
    addEdge,
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    Connection,
    Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Toolbar from './Toolbar';
import StartDialog from './StartDialog';
import ConnectionsPreviewModal from './ConnectionsPreviewModal';
import SectionNode from './SectionNode';
import QuestionnaireNode from '../../components/templates/QuestionnaireNode';
import TemplateEditQuestionNode from '../../components/templates/TemplateEditQuestionNode';

const QuestionnaireBuilder: React.FC<any> = ({
    isEditMode = false,
    questionnaireId
}) => {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [nodeId, setNodeId] = useState(1);
    const [showStartDialog, setShowStartDialog] = useState(true);
    const [showConnectionsPreview, setShowConnectionsPreview] = useState(false);
    // Initialize based on URL parameters
    const getInitialShowCreateAssessment = () => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const mode = urlParams.get('mode');
            return mode !== 'edit';
        }
        return true;
    };

    const [showCreateAssessment, setShowCreateAssessment] = useState(getInitialShowCreateAssessment);

    const nodeTypes = useMemo(() => ({
        questionNode: QuestionnaireNode,
        sectionNode: SectionNode,
        editQuestionNode: TemplateEditQuestionNode
    }), []);

    const onConnect = useCallback(
        (params: Connection | Edge) => {
            const sourceNode = nodes.find(n => n.id === params.source);
            const targetNode = nodes.find(n => n.id === params.target);

            if (sourceNode && targetNode) {
                // Get the option text based on the source handle
                let optionText = 'Default';

                if (params.sourceHandle && params.sourceHandle.startsWith('option-')) {
                    const optionIndex = parseInt(params.sourceHandle.split('-')[1]);
                    optionText = sourceNode.data.options?.[optionIndex] || 'Default';
                } else if (params.sourceHandle === 'multi-all') {
                    optionText = 'All Selected';
                } else if (params.sourceHandle === 'yes') {
                    optionText = 'Yes';
                } else if (params.sourceHandle === 'no') {
                    optionText = 'No';
                } else if (params.sourceHandle === 'text-output') {
                    optionText = 'Any Text';
                }

                const newEdge: any = {
                    ...params,
                    id: `${params.source}-${params.target}-${params.sourceHandle || 'default'}-${Date.now()}`,
                    type: 'smoothstep',
                    animated: true,
                    style: {
                        stroke: '#2196f3',
                        strokeWidth: 2,
                        strokeDasharray: '5,5'
                    },
                    data: {
                        optionText,
                        sourceHandle: params.sourceHandle,
                        condition: sourceNode.data.questionType
                    },
                    label: optionText,
                    labelStyle: {
                        fill: '#2196f3',
                        fontWeight: 600,
                        fontSize: '12px'
                    },
                    labelBgStyle: {
                        fill: 'white',
                        fillOpacity: 0.9,
                        rx: 4,
                        stroke: '#2196f3',
                        strokeWidth: 1
                    },
                    labelBgPadding: [4, 8],
                    labelShowBg: true
                };

                setEdges((eds) => addEdge(newEdge, eds));
            }
        },
        [nodes, setEdges]
    );

    const handleAddQuestion = () => {
        setShowStartDialog(false);

        // Position the edit node in the center-right area of the canvas
        const tempNode = {
            id: 'temp-edit-node',
            type: 'editQuestionNode',
            position: {
                x: 400, // Center-right position
                y: 250
            },
            data: {
                question: '',
                questionType: 'text-input',
                options: ['Option 1', 'Option 2'],
                isRequired: false,
                isNewQuestion: true,
                onSave: handleSaveNewQuestion,
                onCancel: handleCancelNewQuestion
            }
        };

        setNodes(nds => [...nds, tempNode]);
    };

    const handleDeleteNode = useCallback((nodeId: string) => {
        setNodes(nds => nds.filter(node => node.id !== nodeId));
        setEdges(eds => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
    }, [setNodes, setEdges]);

    const handleUpdateNode = useCallback((nodeId: string, newData: any) => {
        setNodes(nds => nds.map(node =>
            node.id === nodeId
                ? { ...node, data: { ...node.data, ...newData } }
                : node
        ));

        // Update connected edge labels when options change
        if (newData.options) {
            setEdges(eds => eds.map(edge => {
                if (edge.source === nodeId && edge.sourceHandle?.startsWith('option-')) {
                    const optionIndex = parseInt(edge.sourceHandle.split('-')[1]);
                    const newOptionText = newData.options[optionIndex];

                    if (newOptionText) {
                        return {
                            ...edge,
                            label: newOptionText,
                            data: {
                                ...edge.data,
                                optionText: newOptionText
                            }
                        };
                    }
                }
                return edge;
            }));
        }
    }, [setNodes, setEdges]);

    const handleUpdateEdgeLabels = useCallback((nodeId: string, newOptions: string[]) => {
        setEdges(eds => eds.map(edge => {
            if (edge.source === nodeId && edge.sourceHandle?.startsWith('option-')) {
                const optionIndex = parseInt(edge.sourceHandle.split('-')[1]);
                const newOptionText = newOptions[optionIndex];

                if (newOptionText) {
                    return {
                        ...edge,
                        label: newOptionText,
                        data: {
                            ...edge.data,
                            optionText: newOptionText
                        }
                    };
                }
            }
            return edge;
        }));
    }, [setEdges]);

    const addQuestionNode = useCallback((questionData) => {
        const headerHeight = 93;
        const newNode = {
            id: `${nodeId}`,
            type: 'questionNode',
            position: {
                x: Math.random() * 400 + 100,
                y: Math.random() * 300 + (headerHeight + 50)
            },
            data: {
                ...questionData,
                onUpdate: handleUpdateNode,
                onDelete: handleDeleteNode,
                onUpdateEdgeLabels: handleUpdateEdgeLabels
            }
        };
        setNodes(nds => [...nds, newNode]);
        setNodeId(prev => prev + 1);
    }, [nodeId, setNodes, setEdges, handleUpdateNode, handleDeleteNode, handleUpdateEdgeLabels]);

    const addSectionNode = useCallback(() => {
        const headerHeight = 93;
        const newNode = {
            id: `section-${nodeId}`,
            type: 'sectionNode',
            position: {
                x: Math.random() * 400 + 100,
                y: Math.random() * 300 + (headerHeight + 50)
            },
            data: {
                sectionName: '',
                weight: 1, // Default weight
                onUpdate: handleUpdateNode,
                onDelete: handleDeleteNode
            }
        };
        setNodes(nds => [...nds, newNode]);
        setNodeId(prev => prev + 1);
    }, [nodeId, setNodes, handleUpdateNode, handleDeleteNode]);

    const handleSaveQuestionnaire = async () => {
        if (nodes.length === 0) {
            alert('Please add at least one question before saving.');
            return;
        }

        // Check if we're editing an existing template
        const urlParams = new URLSearchParams(window.location.search);
        const templateId = urlParams.get('templateId');

        let name, description, finalId;

        if (templateId) {
            // If editing existing template, use existing data
            const existingDrafts = JSON.parse(localStorage.getItem('templateDrafts') || '[]');
            const existingTemplate = existingDrafts.find(d => d.id === templateId);

            if (existingTemplate) {
                name = existingTemplate.name;
                description = existingTemplate.description;
                finalId = templateId;
            } else {
                name = prompt('Enter questionnaire name:');
                description = prompt('Enter questionnaire description (optional):') || '';
                finalId = Date.now().toString();
            }
        } else {
            // If new template, prompt for name
            name = prompt('Enter questionnaire name:');
            description = prompt('Enter questionnaire description (optional):') || '';
            finalId = Date.now().toString();
        }

        if (!name || !name.trim()) {
            alert('Questionnaire name is required!');
            return;
        }

        try {
            const questionnaire = {
                id: finalId,
                name: name.trim(),
                description: description.trim(),
                nodes,
                edges,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'Completed'
            };

            // Update the template in templateDrafts to mark as completed
            const existingDrafts = JSON.parse(localStorage.getItem('templateDrafts') || '[]');
            const draftIndex = existingDrafts.findIndex(d => d.id === finalId);

            if (draftIndex >= 0) {
                // Update existing draft
                existingDrafts[draftIndex] = {
                    ...existingDrafts[draftIndex],
                    ...questionnaire,
                    createdAt: existingDrafts[draftIndex].createdAt // Preserve original creation date
                };
            } else {
                // Add new completed template
                existingDrafts.push(questionnaire);
            }

            localStorage.setItem('templateDrafts', JSON.stringify(existingDrafts));

            // Also save to SavedTemplates
            const existingSavedTemplates = JSON.parse(localStorage.getItem('SavedTemplates') || '[]');
            existingSavedTemplates.push(questionnaire);
            localStorage.setItem('SavedTemplates', JSON.stringify(existingSavedTemplates));

            console.log('✅ Questionnaire saved to localStorage:', questionnaire);
            alert(`🎉 Questionnaire "${name}" saved successfully!`);
        } catch (error) {
            console.error('❌ Error saving questionnaire:', error);
            alert('Failed to save questionnaire: ' + error.message);
        }
    };

    const handleExportJSON = () => {
        const questionnaire = { nodes, edges };
        const blob = new Blob([JSON.stringify(questionnaire, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'questionnaire.json';
        a.click();
    };

    const handleClearAll = () => {
        setNodes([]);
        setEdges([]);
        setNodeId(1);
    };


    const handleSaveNewQuestion = (newQuestionData) => {
        console.log('handleSaveNewQuestion called with:', newQuestionData);

        // Remove temp edit node
        setNodes(nds => nds.filter(node => node.id !== 'temp-edit-node'));

        // Add actual question node
        addQuestionNode(newQuestionData);
    };

    const handleCancelNewQuestion = () => {
        console.log('handleCancelNewQuestion called');

        // Remove temp edit node
        setNodes(nds => nds.filter(node => node.id !== 'temp-edit-node'));
    };

    const handlePreviewConnections = () => {
        setShowConnectionsPreview(true);
    };

    const handleImportJSON = (jsonData: any) => {
        try {
            if (jsonData.nodes && jsonData.edges) {
                // Clear existing nodes and edges
                setNodes([]);
                setEdges([]);

                // Import nodes with proper data structure
                const importedNodes = jsonData.nodes.map((node: any) => ({
                    ...node,
                    data: {
                        ...node.data,
                        onUpdate: handleUpdateNode,
                        onDelete: handleDeleteNode,
                        onUpdateEdgeLabels: handleUpdateEdgeLabels
                    }
                }));

                // Set imported data
                setNodes(importedNodes);
                setEdges(jsonData.edges);

                // Update node ID counter
                const maxId = Math.max(...jsonData.nodes.map((n: any) => parseInt(n.id) || 0), 0);
                setNodeId(maxId + 1);

                console.log('✅ JSON imported successfully');
            } else {
                alert('Invalid JSON format. Expected nodes and edges properties.');
            }
        } catch (error) {
            console.error('❌ Error importing JSON:', error);
            alert('Failed to import JSON file');
        }
    };

    const handleSaveAsDraft = async () => {
        if (nodes.length === 0) {
            alert('Please add at least one question before saving as draft.');
            return;
        }

        // Check if we're editing an existing template
        const urlParams = new URLSearchParams(window.location.search);
        const templateId = urlParams.get('templateId');

        let name, description;

        if (templateId) {
            // If editing, get existing template data
            const existingDrafts = JSON.parse(localStorage.getItem('templateDrafts') || '[]');
            const existingTemplate = existingDrafts.find(d => d.id === templateId);

            if (existingTemplate) {
                name = existingTemplate.name;
                description = existingTemplate.description;
            } else {
                name = prompt('Enter template name:');
                description = prompt('Enter template description (optional):') || '';
            }
        } else {
            // If new template, prompt for name
            name = prompt('Enter template name:');
            description = prompt('Enter template description (optional):') || '';
        }

        if (!name || !name.trim()) {
            alert('Template name is required!');
            return;
        }

        try {
            const draft = {
                id: templateId || Date.now().toString(),
                name: name.trim(),
                description: description.trim(),
                nodes,
                edges,
                status: 'In Progress',
                createdAt: templateId ? undefined : new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                isDraft: true
            };

            // Save draft to localStorage
            const existingDrafts = JSON.parse(localStorage.getItem('templateDrafts') || '[]');
            const existingIndex = existingDrafts.findIndex(d => d.id === draft.id);

            if (existingIndex >= 0) {
                // Update existing draft, preserve createdAt
                existingDrafts[existingIndex] = {
                    ...existingDrafts[existingIndex],
                    ...draft,
                    createdAt: existingDrafts[existingIndex].createdAt
                };
            } else {
                // Add new draft
                draft.createdAt = new Date().toISOString();
                existingDrafts.push(draft);
            }

            localStorage.setItem('templateDrafts', JSON.stringify(existingDrafts));

            console.log('✅ Draft saved to localStorage:', draft);
            alert(`📄 Template "${name}" saved as draft successfully!`);
        } catch (error) {
            console.error('❌ Error saving draft:', error);
            alert('Failed to save draft: ' + error.message);
        }
    };

    // Add connection manager component
    const ConnectionManager = () => {
        const getConnectionsByNode = () => {
            const connections = {};

            edges.forEach(edge => {
                const sourceNode = nodes.find(n => n.id === edge.source);
                if (sourceNode) {
                    if (!connections[edge.source]) {
                        connections[edge.source] = {
                            question: sourceNode.data.question,
                            options: {}
                        };
                    }

                    const optionText = edge.data?.optionText || 'Default';
                    if (!connections[edge.source].options[optionText]) {
                        connections[edge.source].options[optionText] = [];
                    }

                    const targetNode = nodes.find(n => n.id === edge.target);
                    connections[edge.source].options[optionText].push({
                        id: edge.target,
                        question: targetNode?.data?.question || 'Unknown'
                    });
                }
            });

            return connections;
        };

        const connections = getConnectionsByNode();

        return (
            <div style={{
                position: 'absolute',
                top: '90px',
                right: '20px',
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '15px',
                maxWidth: '250px', // Increased width
                minWidth: '200px', // Added minimum width
                maxHeight: 'calc(100vh - 130px)',
                overflow: 'auto',
                zIndex: 1000,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <h4 style={{
                    margin: '0 0 15px 0',
                    fontSize: '16px', // Increased font size
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    Question Connections
                </h4>

                {Object.keys(connections).length === 0 ? (
                    <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                        No connections yet. Connect question options to create flow.
                    </p>
                ) : (
                    Object.entries(connections).map(([nodeId, data]: any) => (
                        <div key={nodeId} style={{
                            marginBottom: '16px',
                            padding: '12px',
                            background: '#f8f9fa',
                            borderRadius: '6px',
                            fontSize: '16px', // Increased font size
                            border: '1px solid #e9ecef'
                        }}>
                            <div style={{
                                fontWeight: '600',
                                marginBottom: '8px',
                                color: '#1976d2',
                                fontSize: '16px' // Increased font size
                            }}>
                                {data.question.length > 30 ? data.question.substring(0, 30) + '...' : data.question}
                            </div>
                            {Object.entries(data.options).map(([option, targets]: any) => (
                                <div key={option} style={{
                                    marginBottom: '6px',
                                    paddingLeft: '8px',
                                    borderLeft: '2px solid #e3f2fd'
                                }}>
                                    <div style={{
                                        color: '#2196f3',
                                        fontWeight: '500',
                                        fontSize: '15px', // Increased font size
                                        marginBottom: '2px',
                                        whiteSpace: 'nowrap' // Keep on same line
                                    }}>
                                        "{option}" → {targets.map((target, idx) => (
                                            <span key={target.id} style={{
                                                color: '#666',
                                                fontSize: '17px'
                                            }}>
                                                {target.question.length > 25 ? target.question.substring(0, 25) + '...' : target.question}
                                                {idx < targets.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        );
    };

    // Update node data with handlers
    useEffect(() => {
        setNodes(nds => nds.map(node => ({
            ...node,
            data: {
                ...node.data,
                onUpdate: handleUpdateNode,
                onDelete: handleDeleteNode,
                onUpdateEdgeLabels: handleUpdateEdgeLabels
            }
        })));
    }, [handleUpdateNode, handleDeleteNode, handleUpdateEdgeLabels]);

    // Add this useEffect to load draft data when editing
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const templateId = urlParams.get('templateId');

        if (mode === 'edit' && templateId) {
            // Skip the popup for edit mode
            setShowCreateAssessment(false);

            const drafts = JSON.parse(localStorage.getItem('templateDrafts') || '[]');
            const template = drafts.find(d => d.id === templateId);

            if (template) {
                // Load nodes with proper function references
                const loadedNodes = template.nodes.map(node => ({
                    ...node,
                    data: {
                        ...node.data,
                        onUpdate: handleUpdateNode,
                        onDelete: handleDeleteNode,
                        onUpdateEdgeLabels: handleUpdateEdgeLabels
                    }
                }));

                setNodes(loadedNodes);
                setEdges(template.edges || []);

                // Update nodeId to continue from the highest existing ID
                const maxId = Math.max(
                    ...template.nodes.map(node => parseInt(node.id) || 0),
                    0
                );
                setNodeId(maxId + 1);

                console.log('📄 Loaded draft for editing:', template);
                console.log('🔢 Next node ID will be:', maxId + 1);
            }
        } else {
            // Show popup only for new questionnaires
            setShowCreateAssessment(true);
        }
    }, [handleUpdateNode, handleDeleteNode, handleUpdateEdgeLabels]);

    // Check if we're in edit mode based on URL parameters
    const checkIsEditMode = () => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const mode = urlParams.get('mode');
            const templateId = urlParams.get('templateId');
            return mode === 'edit' && templateId;
        }
        return false;
    };

    return (
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
            <Toolbar
                onAddQuestion={handleAddQuestion}
                onAddSection={addSectionNode}
                onSave={handleSaveQuestionnaire}
                onSaveAsDraft={handleSaveAsDraft}
                onExportJSON={handleExportJSON}
                onImportJSON={handleImportJSON}
                onClearAll={handleClearAll}
                onPreviewConnections={handlePreviewConnections}
                hideIcons={showStartDialog}
            />

            <div style={{ height: 'calc(100vh - 80px)', position: 'relative' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    fitView
                    fitViewOptions={{
                        padding: 0.1,
                        minZoom: 0.1,
                        maxZoom: 2
                    }}
                    defaultEdgeOptions={{
                        type: 'smoothstep',
                        animated: true,
                        style: {
                            stroke: '#2196f3',
                            strokeWidth: 2,
                            strokeDasharray: '5,5'
                        }
                    }}
                    connectionLineStyle={{
                        stroke: '#2196f3',
                        strokeWidth: 2,
                        strokeDasharray: '5,5'
                    }}
                >
                    <Controls />
                    <MiniMap />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </div>

            {showStartDialog && (
                <StartDialog
                    onAddQuestion={handleAddQuestion}
                    onCancel={() => setShowStartDialog(false)}
                    isHidden={checkIsEditMode()}
                />
            )}

            {showConnectionsPreview && (
                <ConnectionsPreviewModal
                    nodes={nodes}
                    edges={edges}
                    onClose={() => setShowConnectionsPreview(false)}
                />
            )}
        </div>
    );
};

export default QuestionnaireBuilder;






