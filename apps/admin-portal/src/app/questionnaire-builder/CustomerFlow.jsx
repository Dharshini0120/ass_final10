import React, { useState, useEffect } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import AnswerNode from './AnswerNode';

const nodeTypes = {
  answerNode: AnswerNode,
};

const CustomerFlow = ({ questionnaire }) => {
  const [answers, setAnswers] = useState({});
  const [currentPath, setCurrentPath] = useState([]);
  const [visibleNodes, setVisibleNodes] = useState(new Set());
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isUserSet, setIsUserSet] = useState(false);
  const [isDraftMode, setIsDraftMode] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Load existing draft on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem(`draft_${questionnaire.id}`);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setUserName(draft.userName || '');
        setUserEmail(draft.userEmail || '');
        setAnswers(draft.answers || {});
        setCurrentPath(draft.currentPath || []);
        setIsUserSet(!!draft.userName);
        setIsDraftMode(true);
        setLastSavedAt(new Date(draft.savedAt));
        console.log('📄 Loaded draft:', draft);
      } catch (error) {
        console.error('❌ Error loading draft:', error);
      }
    }
  }, [questionnaire.id]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!isUserSet || isSubmitted) return;

    const autoSaveInterval = setInterval(() => {
      saveDraft();
    }, 30000); // 30 seconds

    return () => clearInterval(autoSaveInterval);
  }, [answers, currentPath, userName, userEmail, isUserSet, isSubmitted]);

  // Update visible nodes based on answers and flow
  useEffect(() => {
    if (!questionnaire?.nodes || !questionnaire?.edges) return;

    const newVisibleNodes = new Set(['1']); // Always show first node

    const processNode = (nodeId) => {
      const answer = answers[nodeId];
      if (!answer) return;

      const node = questionnaire.nodes.find(n => n.id === nodeId);
      if (!node) return;

      // Find all edges from this node
      const outgoingEdges = questionnaire.edges.filter(edge => edge.source === nodeId);

      outgoingEdges.forEach(edge => {
        let shouldShowNext = false;

        if (node?.data?.questionType === 'text-input') {
          shouldShowNext = answer && answer.trim() !== '';
        } else if (node?.data?.questionType === 'checkbox') {
          if (Array.isArray(answer)) {
            shouldShowNext = answer.includes(edge.data?.optionText);
          }
        } else if (['multiple-choice', 'radio', 'yes-no'].includes(node?.data?.questionType)) {
          shouldShowNext = edge.data?.optionText === answer;
        }

        if (shouldShowNext) {
          console.log(`✅ Showing next node: ${edge.target} (from option: ${edge.data?.optionText})`);
          newVisibleNodes.add(edge.target);
          processNode(edge.target);
        }
      });
    };

    Object.keys(answers).forEach(nodeId => {
      processNode(nodeId);
    });

    console.log('👁️ Visible nodes:', Array.from(newVisibleNodes));
    setVisibleNodes(newVisibleNodes);
  }, [answers, questionnaire]);

  const saveDraft = () => {
    if (!userName.trim()) return;

    const draft = {
      questionnaireId: questionnaire.id,
      questionnaireName: questionnaire.name,
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      answers,
      currentPath,
      savedAt: new Date().toISOString(),
      isComplete: false
    };

    localStorage.setItem(`draft_${questionnaire.id}`, JSON.stringify(draft));
    setLastSavedAt(new Date());
    console.log('💾 Draft saved:', draft);
  };

  const submitAnswers = async () => {
    const requiredNodes = questionnaire.nodes.filter(node =>
      visibleNodes.has(node.id) && node.data.isRequired
    );

    const unansweredRequired = requiredNodes.filter(node => {
      const answer = answers[node.id];
      if (node.data.questionType === 'text-input') {
        return !answer || answer.trim() === '';
      }
      if (node.data.questionType === 'checkbox') {
        return !Array.isArray(answer) || answer.length === 0;
      }
      return !answer;
    });

    if (unansweredRequired.length > 0) {
      alert(`Please answer all required questions. ${unansweredRequired.length} required questions remaining.`);
      return;
    }

    const submission = {
      questionnaireId: questionnaire.id,
      questionnaireName: questionnaire.name,
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      answers,
      path: currentPath,
      totalQuestionsAnswered: Object.keys(answers).length,
      submittedAt: new Date().toISOString(),
      flowPath: currentPath.map(item => {
        const node = questionnaire.nodes.find(n => n.id === item.nodeId);
        return {
          question: node?.data?.question,
          questionType: node?.data?.questionType,
          answer: item.answer
        };
      }),
      isComplete: true
    };

    try {
      const response = await fetch('http://localhost:5000/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission)
      });

      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }

      const result = await response.json();
      console.log('✅ Submission successful:', result);

      // Clear draft after successful submission
      localStorage.removeItem(`draft_${questionnaire.id}`);
      setIsSubmitted(true);

      alert('🎉 Answers submitted successfully! Thank you for completing the questionnaire.');
    } catch (error) {
      console.error('❌ Error submitting answers:', error);
      alert('Failed to submit answers. Your progress has been saved as a draft.');
      saveDraft();
    }
  };

  const resetAnswers = () => {
    if (confirm('Are you sure you want to reset all answers? This action cannot be undone.')) {
      setAnswers({});
      setCurrentPath([]);
      localStorage.removeItem(`draft_${questionnaire.id}`);
      setIsDraftMode(false);
      setLastSavedAt(null);
    }
  };

  const handleUserSetup = () => {
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }
    setIsUserSet(true);
    saveDraft();
  };

  // Convert admin nodes to customer answer nodes
  const customerNodes = questionnaire.nodes
    .filter(node => visibleNodes.has(node.id))
    .map((node, index) => ({
      ...node,
      type: 'answerNode',
      position: {
        x: node.position?.x || (index % 3) * 400,
        y: node.position?.y || Math.floor(index / 3) * 300
      },
      data: {
        ...node.data,
        isAnswered: !!answers[node.id] && (
          node.data.questionType === 'text-input' ?
            answers[node.id]?.trim() !== '' :
            node.data.questionType === 'checkbox' ?
              Array.isArray(answers[node.id]) && answers[node.id].length > 0 :
              answers[node.id] !== undefined && answers[node.id] !== null
        ),
        selectedAnswer: answers[node.id],
        isVisible: visibleNodes.has(node.id),
        onAnswer: (nodeId, answer) => {
          console.log('📥 Answer received:', { nodeId, answer });

          setAnswers(prev => {
            const newAnswers = { ...prev, [nodeId]: answer };
            console.log('📊 Updated answers:', newAnswers);
            return newAnswers;
          });

          setCurrentPath(prev => {
            const newPath = [...prev];
            const existingIndex = newPath.findIndex(item => item.nodeId === nodeId);

            if (existingIndex >= 0) {
              newPath[existingIndex] = { nodeId, answer };
              return newPath.slice(0, existingIndex + 1);
            } else {
              return [...newPath, { nodeId, answer }];
            }
          });

          // Auto-save after answer
          setTimeout(() => saveDraft(), 1000);
        }
      }
    }));

  const visibleEdges = questionnaire.edges
    .filter(edge => visibleNodes.has(edge.source) && visibleNodes.has(edge.target))
    .map(edge => {
      // If this is a yes-no edge, set label to 'Yes' or 'No' based on sourceHandle
      if (edge.data?.optionText && ['Yes', 'No'].includes(edge.data.optionText)) {
        return {
          ...edge,
          label: edge.data.optionText
        };
      }
      // If sourceHandle is set (for yes-no), use it for label
      if (edge.sourceHandle === 'yes') {
        return { ...edge, label: 'Yes' };
      }
      if (edge.sourceHandle === 'no') {
        return { ...edge, label: 'No' };
      }
      return edge;
    });

  if (!isUserSet) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          maxWidth: '500px',
          width: '90%'
        }}>
          <h2 style={{
            margin: '0 0 10px 0',
            color: '#333',
            textAlign: 'center',
            fontSize: '28px'
          }}>
            📋 {questionnaire.name}
          </h2>

          {questionnaire.description && (
            <p style={{
              color: '#666',
              textAlign: 'center',
              marginBottom: '30px',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              {questionnaire.description}
            </p>
          )}

          {isDraftMode && (
            <div style={{
              background: '#fff3cd',
              border: '1px solid #ffeaa7',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              <strong>📄 Draft Found!</strong><br />
              Last saved: {lastSavedAt?.toLocaleString()}<br />
              Continue where you left off.
            </div>
          )}

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Your Name *
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your full name"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#333'
            }}>
              Email (Optional)
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            onClick={handleUserSetup}
            disabled={!userName.trim()}
            style={{
              width: '100%',
              background: userName.trim()
                ? 'linear-gradient(135deg, #2196F3, #1976D2)'
                : '#e0e0e0',
              color: userName.trim() ? 'white' : '#9e9e9e',
              border: 'none',
              borderRadius: '8px',
              padding: '15px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: userName.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease'
            }}
          >
            🚀 Start Questionnaire
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          maxWidth: '500px',
          width: '90%',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ margin: '0 0 15px 0', color: '#333' }}>
            Thank You, {userName}!
          </h2>
          <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.5' }}>
            Your responses have been submitted successfully. We appreciate your time and feedback.
          </p>
          <div style={{
            background: '#f8f9fa',
            borderRadius: '8px',
            padding: '15px',
            marginTop: '20px'
          }}>
            <strong>Summary:</strong><br />
            Questions Answered: {Object.keys(answers).length}<br />
            Submitted: {new Date().toLocaleString()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '15px 30px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>
            📋 {questionnaire.name}
          </h2>
          <div style={{ fontSize: '14px', opacity: 0.9 }}>
            👤 {userName} {userEmail && `(${userEmail})`}
            {lastSavedAt && (
              <span style={{ marginLeft: '15px' }}>
                💾 Last saved: {lastSavedAt.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={saveDraft}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            💾 Save Draft
          </button>

          <button
            onClick={submitAnswers}
            style={{
              background: 'rgba(76, 175, 80, 0.9)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            ✅ Submit
          </button>

          <button
            onClick={resetAnswers}
            style={{
              background: 'rgba(244, 67, 54, 0.9)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              padding: '8px 16px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        background: '#f8f9fa',
        padding: '10px 30px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#666' }}>
            Progress: {Object.keys(answers).length} / {visibleNodes.size} questions answered
          </span>
          <div style={{
            background: '#e0e0e0',
            borderRadius: '10px',
            height: '8px',
            width: '200px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
              height: '100%',
              width: `${(Object.keys(answers).length / visibleNodes.size) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      </div>

      {/* React Flow Canvas */}
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={customerNodes}
          edges={visibleEdges}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          style={{ background: '#fafafa' }}
        >
          <Background color="#e0e0e0" gap={20} size={1} style={{ opacity: 0.3 }} />
          <Controls showInteractive={false} />
          <MiniMap nodeColor="#2196f3" />
        </ReactFlow>
      </div>
    </div>
  );
};

export default CustomerFlow;

