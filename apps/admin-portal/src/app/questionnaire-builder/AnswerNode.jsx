import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';

const AnswerNode = ({ data, id }) => {
  const { question, options, questionType, isAnswered, selectedAnswer, onAnswer, isVisible, isRequired } = data;
  const [textInput, setTextInput] = useState('');
  const [checkboxAnswers, setCheckboxAnswers] = useState([]);

  useEffect(() => {
    if (questionType === 'text-input') {
      setTextInput(selectedAnswer || '');
    } else if (questionType === 'checkbox') {
      setCheckboxAnswers(Array.isArray(selectedAnswer) ? selectedAnswer : []);
    }
  }, [selectedAnswer, questionType]);

  const handleAnswerSelect = (answer) => {
    console.log('🎯 Answer selected:', { nodeId: id, answer, questionType });
    console.log('🔧 onAnswer function:', typeof onAnswer);
    if (onAnswer && typeof onAnswer === 'function') {
      onAnswer(id, answer);
    } else {
      console.error('❌ onAnswer is not a function:', onAnswer);
    }
  };

  const handleMouseDown = (e) => {
    e.stopPropagation();
  };

  const handleClick = (e) => {
    e.stopPropagation();
    console.log('🖱️ Node clicked:', id);
  };

  const handleKeyDown = (e) => {
    e.stopPropagation();
  };

  const handleTextSubmit = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const trimmedInput = textInput.trim();
    console.log('📝 Text submit:', { trimmedInput, isRequired });
    if (trimmedInput === '' && isRequired) {
      alert('This question is required');
      return;
    }
    handleAnswerSelect(trimmedInput);
  };

  const handleTextKeyPress = (e) => {
    e.stopPropagation();
    if (e.key === 'Enter' && e.ctrlKey) {
      handleTextSubmit(e);
    }
  };

  const handleCheckboxChange = (option, checked) => {
    console.log('☑️ Checkbox change:', { option, checked, currentAnswers: checkboxAnswers });
    let newAnswers;
    if (checked) {
      newAnswers = [...checkboxAnswers, option];
    } else {
      newAnswers = checkboxAnswers.filter(ans => ans !== option);
    }
    setCheckboxAnswers(newAnswers);
    handleAnswerSelect(newAnswers);
  };

  const getNodeColor = () => {
    // All question types now use the same blue color scheme
    return { bg: '#e3f2fd', border: '#2196f3', text: '#1976d2' };
  };

  const colors = getNodeColor();

  const renderQuestionInput = () => {
    switch (questionType) {
      case 'text-input':
        return (
          <div style={{ marginTop: '15px' }}>
            <textarea
              value={textInput}
              onChange={(e) => {
                e.stopPropagation();
                setTextInput(e.target.value);
                console.log('📝 Text input changed:', e.target.value);
              }}
              onKeyDown={handleKeyDown}
              onFocus={(e) => e.stopPropagation()}
              onBlur={(e) => e.stopPropagation()}
              placeholder="Enter your answer here..."
              disabled={isAnswered}
              autoFocus={!isAnswered}
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                border: `2px solid ${isAnswered ? colors.border : '#e0e0e0'}`,
                borderRadius: '8px',
                resize: 'vertical',
                fontSize: '14px',
                backgroundColor: isAnswered ? colors.bg : 'white',
                fontFamily: 'inherit',
                outline: 'none',
                boxSizing: 'border-box',
                pointerEvents: 'auto'
              }}
            />
            {!isAnswered && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleTextSubmit(e);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                style={{
                  marginTop: '10px',
                  background: 'linear-gradient(135deg, #2196f3, #1976d2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(33, 150, 243, 0.3)',
                  pointerEvents: 'auto'
                }}
              >
                ✅ Submit Answer
              </button>
            )}
            <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
              Press Ctrl+Enter to submit quickly
            </div>
          </div>
        );

      case 'checkbox':
        return (
          <div style={{ marginTop: '15px' }}>
            {options.map((option, index) => (
              <div key={index} style={{ marginBottom: '12px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: isAnswered ? 'default' : 'pointer',
                  padding: '12px',
                  borderRadius: '8px',
                  background: checkboxAnswers.includes(option) ? colors.bg : 'white',
                  border: `2px solid ${checkboxAnswers.includes(option) ? colors.border : '#e0e0e0'}`,
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  <input
                    type="checkbox"
                    checked={checkboxAnswers.includes(option)}
                    onChange={(e) => {
                      e.stopPropagation();
                      !isAnswered && handleCheckboxChange(option, e.target.checked);
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={isAnswered}
                    style={{
                      marginRight: '12px',
                      transform: 'scale(1.2)',
                      accentColor: colors.border
                    }}
                  />
                  <span>{option}</span>
                </label>
              </div>
            ))}
          </div>
        );

      case 'yes-no':
        return (
          <div style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
            {['Yes', 'No'].map((option) => (
              <button
                key={option}
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('🔘 Yes/No clicked:', option);
                  !isAnswered && handleAnswerSelect(option);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                disabled={isAnswered}
                style={{
                  flex: 1,
                  padding: '15px',
                  border: `2px solid ${selectedAnswer === option ? colors.border : '#e0e0e0'}`,
                  borderRadius: '8px',
                  background: selectedAnswer === option ? colors.bg : (isAnswered ? '#f5f5f5' : 'white'),
                  color: selectedAnswer === option ? colors.text : '#333',
                  cursor: isAnswered ? 'default' : 'pointer',
                  fontSize: '16px',
                  fontWeight: selectedAnswer === option ? '600' : '500',
                  transition: 'all 0.2s ease',
                  boxShadow: selectedAnswer === option ? `0 2px 4px ${colors.border}40` : 'none',
                  pointerEvents: 'auto'
                }}
              >
                {option === 'Yes' ? '✅' : '❌'} {option}
              </button>
            ))}
          </div>
        );

      case 'radio':
      case 'multiple-choice':
      default:
        return (
          <div style={{ marginTop: '15px' }}>
            {options && options.length > 0 ? options.map((option, index) => (
              <div key={index} style={{ marginBottom: '12px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: isAnswered ? 'default' : 'pointer',
                  padding: '12px',
                  borderRadius: '8px',
                  background: selectedAnswer === option ? colors.bg : 'white',
                  border: `2px solid ${selectedAnswer === option ? colors.border : '#e0e0e0'}`,
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  <input
                    type="radio"
                    name={`question-${id}`}
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={(e) => {
                      e.stopPropagation();
                      console.log('🔘 Radio option selected:', option);
                      !isAnswered && handleAnswerSelect(option);
                    }}
                    onKeyDown={handleKeyDown}
                    disabled={isAnswered}
                    style={{
                      marginRight: '12px',
                      transform: 'scale(1.2)',
                      accentColor: colors.border
                    }}
                  />
                  <span>{option}</span>
                </label>
              </div>
            )) : (
              <div style={{
                padding: '12px',
                background: '#fff3cd',
                border: '1px solid #ffeaa7',
                borderRadius: '6px',
                color: '#856404',
                fontSize: '14px'
              }}>
                ⚠️ No options available for this question
              </div>
            )}
          </div>
        );
    }
  };

  const getAnswerDisplay = () => {
    if (questionType === 'checkbox' && Array.isArray(selectedAnswer)) {
      return selectedAnswer.length > 0 ? selectedAnswer.join(', ') : 'None selected';
    }
    return selectedAnswer || 'No answer';
  };

  return (
    <div
      style={{
        background: 'white',
        border: `2px solid ${isAnswered ? colors.border : '#e0e0e0'}`,
        borderRadius: '12px',
        padding: '0',
        minWidth: '350px',
        maxWidth: '450px',
        boxShadow: isAnswered ? `0 4px 12px ${colors.border}30` : '0 4px 12px rgba(0,0,0,0.1)',
        opacity: isVisible !== false ? 1 : 0.5,
        overflow: 'hidden',
        position: 'relative',
        pointerEvents: 'auto',
        margin: '10px'
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
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
        background: isAnswered ? colors.border : '#f5f5f5',
        color: isAnswered ? 'white' : '#666',
        padding: '12px 15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          fontSize: '12px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {questionType === 'multiple-choice' ? '📋 Multiple Choice' :
            questionType === 'text-input' ? '📝 Text Input' :
              questionType === 'checkbox' ? '☑️ Checkbox' :
                questionType === 'yes-no' ? '❓ Yes/No' :
                  questionType === 'radio' ? '🔘 Radio' : 'Question'}
          {isRequired && ' (Required)'}
        </div>
        {isAnswered && (
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '600'
          }}>
            ✅ ANSWERED
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '20px' }}>
        <h4 style={{
          margin: '0 0 15px 0',
          color: '#333',
          fontSize: '16px',
          fontWeight: '600',
          lineHeight: '1.4'
        }}>
          {question}
        </h4>

        {renderQuestionInput()}

        {isAnswered && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: colors.bg,
            borderRadius: '8px',
            border: `1px solid ${colors.border}`,
            color: colors.text,
            fontWeight: '600',
            fontSize: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>✅</span>
              <span>Your Answer: {getAnswerDisplay()}</span>
            </div>
          </div>
        )}
      </div>

      {questionType === 'yes-no' ? (
        <>
          <Handle
            type="source"
            position={Position.Bottom}
            id="yes"
            style={{
              left: '35%',
              background: '#43a047',
              width: '12px',
              height: '12px',
              border: '2px solid white',
              borderRadius: '50%',
              bottom: '-18px',
              zIndex: 100,
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            id="no"
            style={{
              left: '65%',
              background: '#e53935',
              width: '12px',
              height: '12px',
              border: '2px solid white',
              borderRadius: '50%',
              bottom: '-18px',
              zIndex: 100,
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
            }}
          />
        </>
      ) : (
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            background: '#1976d2',
            width: '12px',
            height: '12px',
            border: '2px solid white',
            borderRadius: '50%',
            bottom: '-18px',
            zIndex: 100,
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}
        />
      )}
    </div>
  );
};

export default AnswerNode;














