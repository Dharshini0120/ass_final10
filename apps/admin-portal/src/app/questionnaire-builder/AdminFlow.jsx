import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  updateEdge
} from 'reactflow';
import 'reactflow/dist/style.css';
import QuestionNode from './QuestionNode';

const nodeTypes = {
  questionNode: QuestionNode,
};

const AdminFlow = ({ onSave, initialQuestionnaire, isEditMode, questionnaireId }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeId, setNodeId] = useState(1);
  const [currentQuestionnaireName, setCurrentQuestionnaireName] = useState('');
  const [currentQuestionnaireDescription, setCurrentQuestionnaireDescription] = useState('');

  useEffect(() => {
    if (isEditMode && initialQuestionnaire) {
      console.log('🔄 Loading questionnaire for editing:', initialQuestionnaire);

      // Set questionnaire metadata
      setCurrentQuestionnaireName(initialQuestionnaire.name);
      setCurrentQuestionnaireDescription(initialQuestionnaire.description || '');

      // Load nodes with proper data structure
      if (initialQuestionnaire.nodes && initialQuestionnaire.nodes.length > 0) {
        const loadedNodes = initialQuestionnaire.nodes.map(node => ({
          ...node,
          data: {
            ...node.data,
            onUpdate: (id, newData) => {
              setNodes(nds => nds.map(n =>
                n.id === id ? { ...n, data: { ...n.data, ...newData } } : n
              ));
            },
            onDelete: (id) => {
              setNodes(nds => nds.filter(n => n.id !== id));
              setEdges(eds => eds.filter(edge => edge.source !== id && edge.target !== id));
            }
          }
        }));

        setNodes(loadedNodes);
        console.log('✅ Loaded nodes:', loadedNodes.length);
      }

      // Load edges
      if (initialQuestionnaire.edges && initialQuestionnaire.edges.length > 0) {
        setEdges(initialQuestionnaire.edges);
        console.log('✅ Loaded edges:', initialQuestionnaire.edges.length);
      }

      // Set nodeId to continue from the highest existing ID
      const maxId = Math.max(
        ...initialQuestionnaire.nodes.map(node => parseInt(node.id) || 0),
        0
      );
      setNodeId(maxId + 1);

      console.log('✅ Edit mode setup complete');
    } else if (!isEditMode) {
      // Clear everything for new questionnaire
      setNodes([]);
      setEdges([]);
      setNodeId(1);
      setCurrentQuestionnaireName('');
      setCurrentQuestionnaireDescription('');
      console.log('🆕 New questionnaire mode');
    }
  }, [isEditMode, initialQuestionnaire, setNodes, setEdges]);

  const addQuestionNode = useCallback(() => {
    const newNode = {
      id: `${nodeId}`,
      type: 'questionNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        question: '',
        questionType: 'multiple-choice',
        options: ['Option 1', 'Option 2'],
        isRequired: false,
        onUpdate: (id, newData) => {
          setNodes(nds => nds.map(node =>
            node.id === id ? { ...node, data: { ...node.data, ...newData } } : node
          ));
        },
        onDelete: (id) => {
          setNodes(nds => nds.filter(node => node.id !== id));
          setEdges(eds => eds.filter(edge => edge.source !== id && edge.target !== id));
        }
      }
    };
    setNodes(nds => [...nds, newNode]);
    setNodeId(prev => prev + 1);
  }, [nodeId, setNodes, setEdges]);

  const onConnect = useCallback((params) => {
    const sourceNode = nodes.find(node => node.id === params.source);
    const targetNode = nodes.find(node => node.id === params.target);

    if (sourceNode && targetNode) {
      // Get the option text based on the source handle
      let optionText = 'Default';

      if (params.sourceHandle && params.sourceHandle.startsWith('option-')) {
        const optionIndex = parseInt(params.sourceHandle.split('-')[1]);
        optionText = sourceNode.data.options?.[optionIndex] || 'Default';
      } else if (params.sourceHandle === 'multi-2plus') {
        optionText = 'Any 2+ Selected';
      } else if (params.sourceHandle === 'multi-all') {
        optionText = 'All Selected';
      } else if (sourceNode.data.questionType === 'text-input') {
        optionText = 'Any Text';
      }

      // Calculate label position to avoid overlapping
      const existingEdgesFromSource = edges.filter(edge => edge.source === params.source);
      const edgeIndex = existingEdgesFromSource.length;

      // Alternate positions: 0.5, 0.4, 0.6, 0.3, 0.7, etc.
      let labelPosition = 0.5;
      if (edgeIndex > 0) {
        const isEven = edgeIndex % 2 === 0;
        const offset = Math.ceil(edgeIndex / 2) * 0.1;
        labelPosition = isEven ? 0.5 - offset : 0.5 + offset;
        // Keep within bounds
        labelPosition = Math.max(0.2, Math.min(0.8, labelPosition));
      }

      const newEdge = {
        ...params,
        id: `${params.source}-${params.target}-${params.sourceHandle || 'default'}-${Date.now()}`,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#2196f3', strokeWidth: 2 },
        data: {
          optionText,
          sourceHandle: params.sourceHandle,
          condition: sourceNode.data.questionType
        },
        label: optionText,
        labelStyle: {
          fill: '#2196f3',
          fontWeight: 600,
          fontSize: '14px'
        },
        labelBgStyle: {
          fill: 'white',
          fillOpacity: 0.9,
          rx: 6,
          stroke: '#e0e0e0',
          strokeWidth: 1
        },
        labelBgPadding: [6, 10],
        labelShowBg: true,
        labelPosition: labelPosition // Distribute labels to avoid overlap
      };

      setEdges(eds => addEdge(newEdge, eds));

      console.log('🔗 Connection created:', {
        from: sourceNode.data.question,
        to: targetNode.data.question,
        option: optionText,
        handle: params.sourceHandle
      });
    }
  }, [nodes, setEdges]);

  // Handle edge updates (when user drags edge to different node)
  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    const sourceNode = nodes.find(node => node.id === newConnection.source);

    if (sourceNode) {
      // Get the option text based on the source handle
      let optionText = 'Default';

      if (newConnection.sourceHandle && newConnection.sourceHandle.startsWith('option-')) {
        const optionIndex = parseInt(newConnection.sourceHandle.split('-')[1]);
        optionText = sourceNode.data.options?.[optionIndex] || 'Default';
      } else if (newConnection.sourceHandle === 'multi-2plus') {
        optionText = 'Any 2+ Selected';
      } else if (newConnection.sourceHandle === 'multi-all') {
        optionText = 'All Selected';
      } else if (sourceNode.data.questionType === 'text-input') {
        optionText = 'Any Text';
      }

      // Calculate label position to avoid overlapping
      const existingEdgesFromSource = edges.filter(edge =>
        edge.source === newConnection.source && edge.id !== oldEdge.id
      );
      const edgeIndex = existingEdgesFromSource.length;

      // Alternate positions: 0.5, 0.4, 0.6, 0.3, 0.7, etc.
      let labelPosition = 0.5;
      if (edgeIndex > 0) {
        const isEven = edgeIndex % 2 === 0;
        const offset = Math.ceil(edgeIndex / 2) * 0.1;
        labelPosition = isEven ? 0.5 - offset : 0.5 + offset;
        // Keep within bounds
        labelPosition = Math.max(0.2, Math.min(0.8, labelPosition));
      }

      const updatedEdge = {
        ...oldEdge,
        ...newConnection,
        data: {
          optionText,
          sourceHandle: newConnection.sourceHandle,
          condition: sourceNode.data.questionType
        },
        label: optionText,
        labelPosition: labelPosition
      };

      setEdges(eds => updateEdge(oldEdge, updatedEdge, eds));

      console.log('🔄 Edge updated:', {
        from: sourceNode.data.question,
        to: nodes.find(n => n.id === newConnection.target)?.data?.question,
        option: optionText,
        handle: newConnection.sourceHandle
      });
    }
  }, [nodes, edges, setEdges]);

  const saveQuestionnaire = async () => {
    if (nodes.length === 0) {
      alert('Please add at least one question before saving.');
      return;
    }

    const name = prompt('Enter questionnaire name:');
    if (!name || !name.trim()) {
      alert('Questionnaire name is required!');
      return;
    }

    const description = prompt('Enter questionnaire description (optional):') || '';

    try {
      const questionnaire = {
        name: name.trim(),
        description: description.trim(),
        nodes,
        edges
      };

      console.log('💾 Saving questionnaire:', questionnaire);

      const response = await fetch('http://localhost:5000/api/questionnaires', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionnaire)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save questionnaire');
      }

      const savedQuestionnaire = await response.json();
      console.log('✅ Questionnaire saved:', savedQuestionnaire);

      onSave(savedQuestionnaire);
      alert(`🎉 Questionnaire "${name}" saved successfully!`);
    } catch (error) {
      console.error('❌ Error saving questionnaire:', error);
      alert('Failed to save questionnaire: ' + error.message);
    }
  };

  const updateQuestionnaire = async () => {
    if (!questionnaireId) {
      alert('No questionnaire selected for update');
      return;
    }

    if (nodes.length === 0) {
      alert('Please add at least one question before updating.');
      return;
    }

    try {
      const questionnaire = {
        name: currentQuestionnaireName,
        description: currentQuestionnaireDescription || '',
        nodes,
        edges
      };

      console.log('✏️ Updating questionnaire:', questionnaire);

      const response = await fetch(`http://localhost:5000/api/questionnaires/${questionnaireId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionnaire)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update questionnaire');
      }

      const updatedQuestionnaire = await response.json();
      console.log('✅ Questionnaire updated:', updatedQuestionnaire);

      onSave(updatedQuestionnaire);
      alert(`🎉 Questionnaire "${currentQuestionnaireName}" updated successfully!`);
    } catch (error) {
      console.error('❌ Error updating questionnaire:', error);
      alert('Failed to update questionnaire: ' + error.message);
    }
  };

  const clearAll = () => {
    if (confirm('Are you sure you want to clear all nodes and connections?')) {
      setNodes([]);
      setEdges([]);
      setNodeId(1);
    }
  };

  const exportQuestionnaire = () => {
    const questionnaire = { nodes, edges };
    const dataStr = JSON.stringify(questionnaire, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'questionnaire.json';
    link.click();
  };

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
        top: '10px',
        right: '10px',
        background: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '15px',
        maxWidth: '300px',
        maxHeight: '400px',
        overflow: 'auto',
        zIndex: 1000,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#333' }}>
          🔗 Question Connections
        </h4>

        {Object.keys(connections).length === 0 ? (
          <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>
            No connections yet. Connect question options to create flow.
          </p>
        ) : (
          Object.entries(connections).map(([nodeId, data]) => (
            <div key={nodeId} style={{
              marginBottom: '12px',
              padding: '8px',
              background: '#f8f9fa',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              <div style={{ fontWeight: '600', marginBottom: '5px', color: '#495057' }}>
                {data.question.substring(0, 30)}...
              </div>
              {Object.entries(data.options).map(([option, targets]) => (
                <div key={option} style={{ marginLeft: '10px', marginBottom: '3px' }}>
                  <span style={{ color: '#2196f3', fontWeight: '500' }}>"{option}"</span>
                  <span style={{ color: '#666' }}> → </span>
                  {targets.map((target, idx) => (
                    <span key={target.id} style={{ color: '#28a745' }}>
                      {target.question.substring(0, 20)}
                      {idx < targets.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    );
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#f8f9fa' }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: '600' }}>
          🎯 Questionnaire Builder
          {isEditMode && (
            <span style={{
              fontSize: '16px',
              marginLeft: '10px',
              background: 'rgba(255,255,255,0.2)',
              padding: '4px 8px',
              borderRadius: '4px'
            }}>
              ✏️ Editing: {currentQuestionnaireName}
            </span>
          )}
        </h2>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>
          {isEditMode
            ? `Editing questionnaire: ${currentQuestionnaireName}`
            : 'Create dynamic questionnaires with conditional logic and multiple question types'
          }
        </p>
      </div>

      {/* Toolbar */}
      <div style={{
        padding: '15px 20px',
        background: 'white',
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        borderBottom: '1px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <button
          onClick={addQuestionNode}
          style={{
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <span style={{ fontSize: '16px' }}>➕</span>
          Add Question
        </button>

        {isEditMode ? (
          <button
            onClick={updateQuestionnaire}
            disabled={nodes.length === 0}
            style={{
              background: nodes.length > 0
                ? 'linear-gradient(135deg, #FF9800, #F57C00)'
                : '#e0e0e0',
              color: nodes.length > 0 ? 'white' : '#9e9e9e',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: nodes.length > 0 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: nodes.length > 0 ? '0 2px 4px rgba(255, 152, 0, 0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '16px' }}>✏️</span>
            Update Questionnaire
          </button>
        ) : (
          <button
            onClick={saveQuestionnaire}
            disabled={nodes.length === 0}
            style={{
              background: nodes.length > 0
                ? 'linear-gradient(135deg, #2196F3, #1976D2)'
                : '#e0e0e0',
              color: nodes.length > 0 ? 'white' : '#9e9e9e',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: nodes.length > 0 ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: nodes.length > 0 ? '0 2px 4px rgba(33, 150, 243, 0.3)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{ fontSize: '16px' }}>💾</span>
            Save Questionnaire
          </button>
        )}

        <button
          onClick={exportQuestionnaire}
          disabled={nodes.length === 0}
          style={{
            background: nodes.length > 0
              ? 'linear-gradient(135deg, #FF9800, #F57C00)'
              : '#e0e0e0',
            color: nodes.length > 0 ? 'white' : '#9e9e9e',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: nodes.length > 0 ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: nodes.length > 0 ? '0 2px 4px rgba(255, 152, 0, 0.3)' : 'none',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => nodes.length > 0 && (e.target.style.transform = 'translateY(-1px)')}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <span style={{ fontSize: '16px' }}>📥</span>
          Export JSON
        </button>

        <button
          onClick={clearAll}
          style={{
            background: 'linear-gradient(135deg, #f44336, #d32f2f)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(244, 67, 54, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <span style={{ fontSize: '16px' }}>🗑️</span>
          Clear All
        </button>

        {/* Stats */}
        <div style={{
          marginLeft: 'auto',
          display: 'flex',
          gap: '20px',
          alignItems: 'center'
        }}>
          <div style={{
            background: '#e3f2fd',
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid #2196f3',
            fontSize: '13px',
            fontWeight: '500',
            color: '#1976d2'
          }}>
            📊 Questions: {nodes.length}
          </div>
          <div style={{
            background: '#f3e5f5',
            padding: '8px 16px',
            borderRadius: '20px',
            border: '1px solid #9c27b0',
            fontSize: '13px',
            fontWeight: '500',
            color: '#7b1fa2'
          }}>
            🔗 Connections: {edges.length}
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div style={{
        padding: '15px 20px',
        background: 'linear-gradient(135deg, #e8f5e8, #f1f8e9)',
        borderBottom: '1px solid #c8e6c9',
        fontSize: '14px',
        color: '#2e7d32'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>💡</span>
          <div>
            <strong>Pro Tips:</strong>
            <span style={{ marginLeft: '8px' }}>
              Create different question types (Multiple Choice, Text Input, Checkbox, Yes/No, Radio) •
              Connect nodes to create conditional flows •
              Drag nodes to organize your questionnaire layout
            </span>
          </div>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <div style={{ width: '100%', height: '600px', position: 'relative' }}>
          <ConnectionManager />
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onEdgeUpdate={onEdgeUpdate}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            style={{ background: '#fafafa' }}
            connectionLineStyle={{ stroke: '#2196f3', strokeWidth: 2 }}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#2196f3', strokeWidth: 2 }
            }}
            edgesUpdatable={true}
            edgesFocusable={true}
          >
            <Background
              color="#e0e0e0"
              gap={20}
              size={1}
              style={{ opacity: 0.5 }}
            />
            <Controls
              style={{
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <MiniMap
              style={{
                background: 'white',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              nodeColor={(node) => {
                // All question types now use the same blue color
                return '#2196f3';
              }}
            />
          </ReactFlow>
        </div>

        {/* Empty State */}
        {nodes.length === 0 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            color: '#666',
            background: 'white',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            border: '2px dashed #ddd'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>Start Building Your Questionnaire</h3>
            <p style={{ margin: '0 0 20px 0', color: '#666' }}>
              Click "Add Question" to create your first question node
            </p>
            <button
              onClick={addQuestionNode}
              style={{
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)'
              }}
            >
              ➕ Add Your First Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFlow;
















