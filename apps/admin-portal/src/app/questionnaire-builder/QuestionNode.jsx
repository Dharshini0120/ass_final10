import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const QuestionNode = ({ data, id }) => {
  const { question, options, questionType, isRequired, onUpdate, onDelete } = data;
  const [isEditing, setIsEditing] = useState(!question);
  const [localQuestion, setLocalQuestion] = useState(question || '');
  const [localOptions, setLocalOptions] = useState(options || ['Option 1', 'Option 2']);
  const [localQuestionType, setLocalQuestionType] = useState(questionType || 'multiple-choice');

  // Update options when question type changes to yes-no
  React.useEffect(() => {
    if (localQuestionType === 'yes-no' && (localOptions[0] !== 'Yes' || localOptions[1] !== 'No')) {
      setLocalOptions(['Yes', 'No']);
    }
  }, [localQuestionType]);
  const [localIsRequired, setLocalIsRequired] = useState(isRequired || false);

  const handleSave = () => {
    if (!localQuestion.trim()) {
      alert('Please enter a question');
      return;
    }

    onUpdate(id, {
      question: localQuestion,
      options: localOptions,
      questionType: localQuestionType,
      isRequired: localIsRequired
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (!question) {
      onDelete(id);
    } else {
      setLocalQuestion(question);
      setLocalOptions(options);
      setLocalQuestionType(questionType);
      setLocalIsRequired(isRequired);
      setIsEditing(false);
    }
  };

  const addOption = () => {
    setLocalOptions([...localOptions, `Option ${localOptions.length + 1}`]);
  };

  const removeOption = (index) => {
    if (localOptions.length > 1) {
      setLocalOptions(localOptions.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...localOptions];
    newOptions[index] = value;
    setLocalOptions(newOptions);
  };

  const getNodeColor = () => {
    // All question types now use the same blue color scheme
    return { bg: '#e3f2fd', border: '#2196f3', text: '#1976d2' };
  };

  const colors = getNodeColor();

  // Add this helper function to check connections
  const getOptionConnections = () => {
    if (!onUpdate || !id) return {};

    // This would need to be passed from AdminFlow
    // For now, return empty object
    return {};
  };

  if (isEditing) {
    return (
      <div style={{
        background: 'white',
        border: `2px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '20px',
        minWidth: '320px',
        maxWidth: '400px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        position: 'relative'
      }}>
        <Handle type="target" position={Position.Top} style={{ background: colors.border }} />

        {/* Header */}
        <div style={{
          background: colors.bg,
          margin: '-20px -20px 15px -20px',
          padding: '15px 20px',
          borderRadius: '10px 10px 0 0',
          borderBottom: `2px solid ${colors.border}`
        }}>
          <h4 style={{
            margin: 0,
            color: colors.text,
            fontSize: '18px',
            fontWeight: '700'
          }}>
            ✏️ Edit Question
            {localIsRequired && <span style={{ color: '#e53e3e', marginLeft: '4px', fontWeight: 'bold' }}>*</span>}
          </h4>
        </div>

        {/* Question Type */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: '500',
            color: '#333',
            fontSize: '14px'
          }}>
            Question Type:
          </label>
          <select
            value={localQuestionType}
            onChange={(e) => setLocalQuestionType(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '2px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'white',
              cursor: 'pointer'
            }}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="text-input">Text Input</option>
            <option value="checkbox">Checkbox</option>
            <option value="yes-no">Yes/No</option>
            <option value="radio">Radio</option>
          </select>
        </div>

        {/* Question Text */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'block',
            marginBottom: '5px',
            fontWeight: '600',
            color: '#333',
            fontSize: '15px'
          }}>
            Question:
          </label>
          <textarea
            value={localQuestion}
            onChange={(e) => setLocalQuestion(e.target.value)}
            placeholder="Enter your question here..."
            style={{
              width: '100%',
              minHeight: '60px',
              padding: '10px',
              border: '2px solid #e0e0e0',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              resize: 'vertical',
              fontFamily: 'inherit'
            }}
          />
        </div>

        {/* Required Toggle */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            color: '#333'
          }}>
            <input
              type="checkbox"
              checked={localIsRequired}
              onChange={(e) => setLocalIsRequired(e.target.checked)}
              style={{ marginRight: '8px', transform: 'scale(1.2)' }}
            />
            Required Question
          </label>
        </div>

        {/* Options (for applicable question types) */}
        {['multiple-choice', 'checkbox', 'radio'].includes(localQuestionType) && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333',
              fontSize: '14px'
            }}>
              Options:
            </label>
            {localOptions.map((option, index) => (
              <div key={index} style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '8px',
                alignItems: 'center'
              }}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}
                />
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#e0e0e0', // Would be green if connected
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px'
                }}>
                  🔗
                </div>
                <button
                  onClick={() => removeOption(index)}
                  disabled={localOptions.length <= 1}
                  style={{
                    background: localOptions.length > 1 ? '#f44336' : '#e0e0e0',
                    color: localOptions.length > 1 ? 'white' : '#9e9e9e',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '6px 8px',
                    cursor: localOptions.length > 1 ? 'pointer' : 'not-allowed',
                    fontSize: '12px'
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
            <button
              onClick={addOption}
              style={{
                background: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 12px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500'
              }}
            >
              ➕ Add Option
            </button>
          </div>
        )}

        {['multiple-choice', 'checkbox', 'radio'].includes(localQuestionType) && (
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '500',
              color: '#333',
              fontSize: '14px'
            }}>
              Option Connections:
            </label>
            {localOptions.map((option, index) => (
              <div key={index} style={{
                background: '#f8f9fa',
                border: '1px solid #e9ecef',
                borderRadius: '6px',
                padding: '10px',
                marginBottom: '8px'
              }}>
                <div style={{
                  fontWeight: '500',
                  marginBottom: '5px',
                  color: '#495057'
                }}>
                  "{option}" connects to:
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6c757d',
                  fontStyle: 'italic'
                }}>
                  Drag from the handle on the right to connect this option to next questions
                </div>
              </div>
            ))}

            {/* Multi-select dependency options for checkbox */}
            {localQuestionType === 'checkbox' && localOptions.length >= 2 && (
              <div style={{
                background: '#e8f4fd',
                border: '1px solid #2196f3',
                borderRadius: '6px',
                padding: '10px',
                marginTop: '12px'
              }}>
                <div style={{
                  fontWeight: '500',
                  marginBottom: '8px',
                  color: '#1976d2',
                  fontSize: '13px'
                }}>
                  Multi-Select Dependencies:
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#1976d2',
                  marginBottom: '8px'
                }}>
                  • "Any 2+ Selected" - Navigate when 2 or more options are chosen
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#1976d2',
                  marginBottom: '8px'
                }}>
                  • "All Selected" - Navigate when all options are chosen
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#666',
                  fontStyle: 'italic'
                }}>
                  Use the additional handles on the right for these conditions
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              background: 'linear-gradient(135deg, #4CAF50, #45a049)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            ✅ Save
          </button>
          <button
            onClick={handleCancel}
            style={{
              flex: 1,
              background: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '10px',
              cursor: 'pointer',
              fontWeight: '500',
              fontSize: '14px'
            }}
          >
            ❌ Cancel
          </button>
        </div>



        {/* Output handles - one for each option */}
        {['multiple-choice', 'checkbox', 'radio'].includes(localQuestionType) &&
          localOptions.map((option, index) => (
            <Handle
              key={`${option}-${index}`}
              type="source"
              position={Position.Right}
              id={`option-${index}`}
              style={{
                background: '#1976d2',
                width: '14px',
                height: '14px',
                border: '2px solid white',
                borderRadius: '50%',
                top: `${100 + (index * 35)}px`,
                right: '-20px',
                zIndex: 1000,
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                position: 'absolute'
              }}
              data-option={option}
            />
          ))
        }

        {/* Additional handles for checkbox multi-select dependencies */}
        {localQuestionType === 'checkbox' && localOptions.length >= 2 && (
          <>
            {/* Handle for "Any 2+ Selected" */}
            <Handle
              type="source"
              position={Position.Right}
              id="multi-2plus"
              style={{
                background: '#ff9800',
                width: '16px',
                height: '16px',
                border: '2px solid white',
                borderRadius: '50%',
                right: '-22px',
                top: `${100 + localOptions.length * 35 + 15}px`,
                zIndex: 1000,
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                position: 'absolute'
              }}
              data-option="Any 2+ Selected"
            />

            {/* Handle for "All Selected" */}
            <Handle
              type="source"
              position={Position.Right}
              id="multi-all"
              style={{
                background: '#4caf50',
                width: '16px',
                height: '16px',
                border: '2px solid white',
                borderRadius: '50%',
                right: '-22px',
                top: `${100 + localOptions.length * 35 + 50}px`,
                zIndex: 1000,
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                position: 'absolute'
              }}
              data-option="All Selected"
            />
          </>
        )}

        {/* For yes-no questions, create two handles */}
        {localQuestionType === 'yes-no' && (
          <>
            <Handle
              type="source"
              position={Position.Right}
              id="option-0"
              style={{
                background: '#1976d2',
                width: '14px',
                height: '14px',
                border: '2px solid white',
                borderRadius: '50%',
                right: '-20px',
                top: 'calc(50% - 25px)',
                zIndex: 1000,
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
              data-option={localOptions[0] || 'Yes'}
            />
            <Handle
              type="source"
              position={Position.Right}
              id="option-1"
              style={{
                background: '#1976d2',
                width: '14px',
                height: '14px',
                border: '2px solid white',
                borderRadius: '50%',
                right: '-20px',
                top: 'calc(50% + 10px)',
                zIndex: 1000,
                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}
              data-option={localOptions[1] || 'No'}
            />
          </>
        )}

        {/* For text-input, keep single handle */}
        {localQuestionType === 'text-input' && (
          <Handle
            type="source"
            position={Position.Right}
            style={{
              background: '#1976d2',
              width: '12px',
              height: '12px',
              border: '2px solid white',
              borderRadius: '50%',
              right: '-18px',
              zIndex: 100,
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{
      background: colors.bg,
      border: `2px solid ${colors.border}`,
      borderRadius: '12px',
      padding: '0',
      minWidth: '280px',
      maxWidth: '350px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      overflow: 'visible',
      position: 'relative'
    }}>
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: '#1976d2',
          width: '12px',
          height: '12px',
          border: '2px solid white',
          borderRadius: '50%',
          top: '-18px',
          zIndex: 100,
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
        }}
      />

      {/* Header */}
      <div style={{
        background: colors.border,
        color: 'white',
        padding: '12px 15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '14px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {localQuestionType === 'multiple-choice' ? 'MULTIPLE CHOICE' :
            localQuestionType === 'text-input' ? 'TEXT INPUT' :
              localQuestionType === 'checkbox' ? 'CHECKBOX' :
                localQuestionType === 'yes-no' ? 'YES/NO' :
                  localQuestionType === 'radio' ? 'RADIO' : 'QUESTION'}
          {localIsRequired && <span style={{ color: '#e53e3e', marginLeft: '4px', fontWeight: 'bold' }}>*</span>}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setIsEditing(true)}
            style={{
              background: '#6366f1',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              padding: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            onClick={() => onDelete(id)}
            style={{
              background: '#ef4444',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              padding: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3,6 5,6 21,6"/>
              <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '15px' }}>
        <h4 style={{
          margin: '0 0 12px 0',
          color: colors.text,
          fontSize: '17px',
          fontWeight: '700',
          lineHeight: '1.3'
        }}>
          {localQuestion || 'Untitled Question'}
          {localIsRequired && <span style={{ color: '#e53e3e', marginLeft: '4px', fontWeight: 'bold' }}>*</span>}
        </h4>

        {['multiple-choice', 'checkbox', 'radio'].includes(localQuestionType) && (
          <div style={{ fontSize: '14px', color: '#666' }}>
            <strong style={{ fontWeight: '600' }}>Options:</strong>
            <ul style={{ margin: '5px 0 0 0', paddingLeft: '15px' }}>
              {localOptions.map((option, index) => (
                <li key={index} style={{ marginBottom: '3px', fontWeight: '500' }}>{option}</li>
              ))}
            </ul>
          </div>
        )}

        {localQuestionType === 'text-input' && (
          <div style={{
            fontSize: '14px',
            color: '#666',
            fontStyle: 'italic',
            fontWeight: '500'
          }}>
            Text input field
          </div>
        )}

        {localQuestionType === 'yes-no' && (
          <div style={{
            fontSize: '14px',
            color: '#666',
            fontStyle: 'italic',
            fontWeight: '500'
          }}>
            Yes / No options
          </div>
        )}
      </div>



      {/* Output handles - one for each option */}
      {['multiple-choice', 'checkbox', 'radio'].includes(localQuestionType) &&
        localOptions.map((option, index) => (
          <Handle
            key={`option-${index}`}
            type="source"
            position={Position.Right}
            id={`option-${index}`}
            style={{
              background: '#1976d2',
              width: '14px',
              height: '14px',
              border: '2px solid white',
              borderRadius: '50%',
              right: '-20px',
              top: `${100 + (index * 35)}px`,
              zIndex: 1000,
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              position: 'absolute'
            }}
            data-option={option}
          />
        ))
      }

      {/* Additional handles for checkbox multi-select dependencies */}
      {localQuestionType === 'checkbox' && localOptions.length >= 2 && (
        <>
          {/* Handle for "Any 2+ Selected" */}
          <Handle
            type="source"
            position={Position.Right}
            id="multi-2plus"
            style={{
              background: '#ff9800',
              width: '16px',
              height: '16px',
              border: '2px solid white',
              borderRadius: '50%',
              right: '-22px',
              top: `${100 + localOptions.length * 35 + 15}px`,
              zIndex: 1000,
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              position: 'absolute'
            }}
            data-option="Any 2+ Selected"
          />

          {/* Handle for "All Selected" */}
          <Handle
            type="source"
            position={Position.Right}
            id="multi-all"
            style={{
              background: '#4caf50',
              width: '16px',
              height: '16px',
              border: '2px solid white',
              borderRadius: '50%',
              right: '-22px',
              top: `${100 + localOptions.length * 35 + 50}px`,
              zIndex: 1000,
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              position: 'absolute'
            }}
            data-option="All Selected"
          />
        </>
      )}

      {/* For yes-no questions, create two handles */}
      {localQuestionType === 'yes-no' && (
        <>
          <Handle
            type="source"
            position={Position.Right}
            id="option-0"
            style={{
              background: '#1976d2',
              width: '14px',
              height: '14px',
              border: '2px solid white',
              borderRadius: '50%',
              right: '-20px',
              top: 'calc(50% - 25px)',
              zIndex: 1000,
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
            data-option={localOptions[0] || 'Yes'}
          />
          <Handle
            type="source"
            position={Position.Right}
            id="option-1"
            style={{
              background: '#1976d2',
              width: '14px',
              height: '14px',
              border: '2px solid white',
              borderRadius: '50%',
              right: '-20px',
              top: 'calc(50% + 10px)',
              zIndex: 1000,
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
            data-option={localOptions[1] || 'No'}
          />
        </>
      )}

      {/* For text-input, keep single handle */}
      {localQuestionType === 'text-input' && (
        <Handle
          type="source"
          position={Position.Right}
          style={{
            background: '#1976d2',
            width: '12px',
            height: '12px',
            border: '2px solid white',
            borderRadius: '50%',
            right: '-18px',
            zIndex: 100,
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}
        />
      )}
    </div>
  );
};

export default QuestionNode;







