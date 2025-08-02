import React, { useState, useEffect } from 'react';

const LinearCustomerFlow = ({ questionnaire, onBackToHome }) => {
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL RETURNS
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isUserSet, setIsUserSet] = useState(false);
  const [isDraftMode, setIsDraftMode] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [visibleQuestions, setVisibleQuestions] = useState([]);
  const [showUserSelection, setShowUserSelection] = useState(true);
  const [userMode, setUserMode] = useState(''); // 'new', 'existing'
  const [existingUsers, setExistingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userAssessmentStatus, setUserAssessmentStatus] = useState(null);
  const [showDraftChoice, setShowDraftChoice] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [attemptNumber, setAttemptNumber] = useState(1);

  // ALL useEffect HOOKS MUST BE HERE - NOT CONDITIONAL
  // Fetch existing users on component mount
  useEffect(() => {
    fetchExistingUsers();
  }, []);

  // Fetch user's assessment status when user is selected
  useEffect(() => {
    if (selectedUser && questionnaire.id) {
      console.log('🔍 Checking assessment status for user:', selectedUser.userName);
      fetchUserAssessmentStatus(selectedUser.id, questionnaire.id);
    }
  }, [selectedUser, questionnaire.id]);

  // Calculate visible questions based on answers and flow logic
  useEffect(() => {
    if (!questionnaire?.nodes || !questionnaire?.edges || showUserSelection || !isUserSet) return;

    const calculateVisibleQuestions = () => {
      const questions = [];
      const processedNodes = new Set();

      const processNode = (nodeId) => {
        if (processedNodes.has(nodeId)) return;
        processedNodes.add(nodeId);

        const node = questionnaire.nodes.find(n => n.id === nodeId);
        if (!node || node.type !== 'questionNode') return;

        questions.push(node);
        const answer = answers[nodeId];
        const outgoingEdges = questionnaire.edges.filter(e => e.source === nodeId);

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
            processNode(edge.target);
          }
        });
      };

      // Start from the first node
      const firstNode = questionnaire.nodes.find(n => n.id === '1');
      if (firstNode) {
        processNode('1');
      }

      return questions;
    };

    const newVisibleQuestions = calculateVisibleQuestions();
    setVisibleQuestions(newVisibleQuestions);
    console.log('👁️ Visible questions updated:', newVisibleQuestions.length);
  }, [questionnaire, answers, showUserSelection, isUserSet]);

  // Auto-save functionality
  useEffect(() => {
    if (!userName.trim() || showUserSelection || !isUserSet) return;

    const autoSaveTimer = setTimeout(() => {
      saveDraft();
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [answers, currentQuestionIndex, userName, userEmail, showUserSelection, isUserSet]);

  // ALL FUNCTIONS AFTER HOOKS
  const fetchExistingUsers = async () => {
    try {
      setLoading(true);
      console.log('👥 Fetching existing users from database...');
      const response = await fetch('http://localhost:5000/api/users');
      if (response.ok) {
        const users = await response.json();
        setExistingUsers(users);
        console.log('✅ Existing users loaded:', users.length, users);
      } else {
        console.error('❌ Failed to fetch users:', response.status);
      }
    } catch (error) {
      console.error('❌ Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAssessmentStatus = async (userId, questionnaireId) => {
    try {
      setLoading(true);
      console.log('📊 Fetching assessment status for user ID:', userId, 'questionnaire:', questionnaireId);

      const response = await fetch(`http://localhost:5000/api/users/${userId}/assessments/${questionnaireId}`);
      if (response.ok) {
        const status = await response.json();
        setUserAssessmentStatus(status);
        console.log('✅ User assessment status:', status);

        // If user has a draft and hasn't completed, show choice
        if (status.hasDraft && !status.hasCompleted) {
          console.log('📄 Draft found, showing choice screen');
          setShowDraftChoice(true);
        } else if (status.hasCompleted) {
          console.log('✅ User has already completed this assessment');
          alert('You have already completed this assessment!');
          setShowUserSelection(true);
          setSelectedUser(null);
        } else {
          console.log('🆕 No draft found, starting new assessment');
          setIsUserSet(true);
          setShowDraftChoice(false);
        }
      } else {
        console.error('❌ Failed to fetch assessment status:', response.status);
        // If user not found or error, proceed with new assessment
        setIsUserSet(true);
        setShowDraftChoice(false);
      }
    } catch (error) {
      console.error('❌ Error fetching assessment status:', error);
      // On error, proceed with new assessment
      setIsUserSet(true);
      setShowDraftChoice(false);
    } finally {
      setLoading(false);
    }
  };

  const handleNewUser = () => {
    console.log('🆕 New user selected');
    setUserMode('new');
    setShowUserSelection(false);
    setSelectedUser(null);
    setUserAssessmentStatus(null);
  };

  const handleExistingUser = () => {
    setUserMode('existing');
    setShowUserSelection(false);
  };

  const handleUserRegistration = async () => {
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }

    try {
      setLoading(true);
      console.log('📝 Registering new user:', userName);

      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: userName.trim(),
          userEmail: userEmail.trim()
        })
      });

      if (response.ok) {
        const result = await response.json();
        setCurrentUser(result.user);
        setIsUserSet(true);
        console.log('✅ User registered successfully:', result.user);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to register user');
      }
    } catch (error) {
      console.error('❌ Error registering user:', error);
      alert('Failed to register user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelection = (user) => {
    console.log('👤 User selected:', user);
    setSelectedUser(user);
    setCurrentUser(user);
    setUserName(user.userName);
    setUserEmail(user.userEmail);

    // Check assessment status - this will trigger the useEffect
    fetchUserAssessmentStatus(user.id, questionnaire.id);
  };

  const handleStartNewAssessment = () => {
    console.log('🆕 Starting new assessment');

    // Calculate attempt number
    const attemptNumber = (userAssessmentStatus?.completionCount || 0) + 1;

    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsDraftMode(false);
    setIsUserSet(true);
    setShowDraftChoice(false);
    setAttemptNumber(attemptNumber);
    setUserAssessmentStatus(null);
  };

  const handleContinueFromDraft = () => {
    console.log('📄 Continuing from draft');
    if (userAssessmentStatus?.draft) {
      const draft = userAssessmentStatus.draft;
      console.log('📄 Loading draft data:', draft);

      setAnswers(draft.answers || {});
      setCurrentQuestionIndex(draft.currentQuestionIndex || 0);
      setIsDraftMode(true);
      setLastSavedAt(new Date(draft.savedAt));
      setAttemptNumber(draft.attemptNumber || 1);
    }
    setIsUserSet(true);
    setShowDraftChoice(false);
  };

  const saveDraft = async () => {
    if (!userName.trim()) return;

    const attemptNumber = userAssessmentStatus?.completionCount
      ? (userAssessmentStatus.completionCount + 1)
      : 1;

    const draft = {
      questionnaireId: questionnaire.id || questionnaire._id,
      questionnaireName: questionnaire.name,
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      userId: currentUser?.id,
      answers,
      currentQuestionIndex,
      attemptNumber,
      savedAt: new Date().toISOString(),
      status: 'draft',
      isComplete: false
    };

    // Save locally
    localStorage.setItem(`draft_${questionnaire.id || questionnaire._id}`, JSON.stringify(draft));
    setLastSavedAt(new Date());
    console.log('💾 Draft saved locally:', draft);

    // Save to backend database
    try {
      const response = await fetch('http://localhost:5000/api/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(draft)
      });

      if (response.ok) {
        console.log('✅ Draft saved to database successfully');
      } else {
        console.error('❌ Failed to save draft to database');
      }
    } catch (error) {
      console.error('❌ Error saving draft to database:', error);
    }
  };

  const handleAnswer = (questionId, answer) => {
    console.log('📝 Answer received:', { questionId, answer });
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // Auto-save after answer
    setTimeout(() => saveDraft(), 1000);
  };

  const handleNext = () => {
    if (currentQuestionIndex < visibleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const submitAnswers = async () => {
    // Validate required questions first
    const requiredQuestions = visibleQuestions.filter(q => q.data.isRequired);
    const unansweredRequired = requiredQuestions.filter(q => {
      const answer = answers[q.id];
      if (q.data.questionType === 'text-input') {
        return !answer || answer.trim() === '';
      }
      if (q.data.questionType === 'checkbox') {
        return !Array.isArray(answer) || answer.length === 0;
      }
      return !answer;
    });

    if (unansweredRequired.length > 0) {
      alert(`Please answer all required questions. ${unansweredRequired.length} required questions remaining.`);
      return;
    }

    const submission = {
      questionnaireId: questionnaire.id || questionnaire._id,
      questionnaireName: questionnaire.name,
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      userId: currentUser?.id,
      answers,
      totalQuestionsAnswered: Object.keys(answers).length,
      submittedAt: new Date().toISOString(),
      status: 'completed',
      isComplete: true,
      flowPath: visibleQuestions.map(q => ({
        questionId: q.id,
        question: q.data.question,
        questionType: q.data.questionType,
        answer: answers[q.id] || null
      }))
    };

    console.log('🚀 Submitting answers:', submission);

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submission)
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('❌ Server response:', errorData);
        throw new Error(`Server error: ${response.status} - ${errorData}`);
      }

      const result = await response.json();
      console.log('✅ Submission successful:', result);

      // Clear draft after successful submission
      localStorage.removeItem(`draft_${questionnaire.id || questionnaire._id}`);
      setIsSubmitted(true);

    } catch (error) {
      console.error('❌ Error submitting answers:', error);
      const errorMessage = error.message.includes('fetch')
        ? 'Unable to connect to server. Please check your internet connection.'
        : `Submission failed: ${error.message}`;

      alert(`${errorMessage}\n\nYour progress has been saved as a draft.`);
      saveDraft();
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionInput = (question) => {
    const questionId = question.id;
    const questionData = question.data;
    const currentAnswer = answers[questionId];

    switch (questionData.questionType) {
      case 'text-input':
        return (
          <div style={{ marginTop: '20px' }}>
            <input
              type="text"
              value={currentAnswer || ''}
              onChange={(e) => handleAnswer(questionId, e.target.value)}
              placeholder="Type your answer here..."
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '16px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#2196f3'}
              onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
            />
          </div>
        );

      case 'multiple-choice':
      case 'radio':
        return (
          <div style={{ marginTop: '20px' }}>
            {questionData.options?.map((option, index) => (
              <label key={index} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                margin: '8px 0',
                background: currentAnswer === option ? '#e3f2fd' : '#f8f9fa',
                border: `2px solid ${currentAnswer === option ? '#2196f3' : '#e0e0e0'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="radio"
                  name={`question_${questionId}`}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => handleAnswer(questionId, e.target.value)}
                  style={{ marginRight: '12px', transform: 'scale(1.2)' }}
                />
                <span style={{ fontSize: '16px', color: '#333' }}>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'yes-no':
        return (
          <div style={{ marginTop: '20px', display: 'flex', gap: '15px' }}>
            {['Yes', 'No'].map((option) => (
              <label key={option} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                background: currentAnswer === option ? '#e3f2fd' : '#f8f9fa',
                border: `2px solid ${currentAnswer === option ? '#2196f3' : '#e0e0e0'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '100px',
                justifyContent: 'center'
              }}>
                <input
                  type="radio"
                  name={`question_${questionId}`}
                  value={option}
                  checked={currentAnswer === option}
                  onChange={(e) => handleAnswer(questionId, e.target.value)}
                  style={{ marginRight: '8px', transform: 'scale(1.2)' }}
                />
                <span style={{ fontSize: '16px', fontWeight: '500', color: '#333' }}>{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div style={{ marginTop: '20px' }}>
            {questionData.options?.map((option, index) => (
              <label key={index} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                margin: '8px 0',
                background: (currentAnswer || []).includes(option) ? '#e3f2fd' : '#f8f9fa',
                border: `2px solid ${(currentAnswer || []).includes(option) ? '#2196f3' : '#e0e0e0'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                <input
                  type="checkbox"
                  checked={(currentAnswer || []).includes(option)}
                  onChange={(e) => {
                    const currentAnswers = currentAnswer || [];
                    if (e.target.checked) {
                      handleAnswer(questionId, [...currentAnswers, option]);
                    } else {
                      handleAnswer(questionId, currentAnswers.filter(a => a !== option));
                    }
                  }}
                  style={{ marginRight: '12px', transform: 'scale(1.2)' }}
                />
                <span style={{ fontSize: '16px', color: '#333' }}>{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return <div>Unsupported question type: {questionData.questionType}</div>;
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div style={{
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '15px' }}>⏳</div>
          <h3 style={{ margin: 0, color: '#333' }}>Loading...</h3>
        </div>
      </div>
    );
  }

  // CONDITIONAL RENDERING AT THE END

  // User Selection Screen - Only New User and Existing User
  if (showUserSelection) {
    return (
      <div style={{
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          width: '100%'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '28px' }}>
              🎯 {questionnaire.name}
            </h2>
            <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
              {questionnaire.description || 'Welcome to this questionnaire'}
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <button
              onClick={handleNewUser}
              style={{
                background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '20px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
              }}
            >
              🆕 New User
            </button>

            <button
              onClick={handleExistingUser}
              style={{
                background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '20px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)'
              }}
            >
              👤 Existing User
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              onClick={onBackToHome}
              style={{
                background: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // New User Registration Screen
  if (userMode === 'new' && !isUserSet) {
    return (
      <div style={{
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>
              🆕 New User Registration
            </h2>
            <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
              Please enter your details to get started
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Name *
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
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>
              Email (Optional)
            </label>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter your email address"
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

          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={() => setShowUserSelection(true)}
              style={{
                flex: 1,
                background: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '15px',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
            <button
              onClick={handleUserRegistration}
              disabled={!userName.trim()}
              style={{
                flex: 2,
                background: userName.trim() ? 'linear-gradient(135deg, #4CAF50, #45a049)' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '15px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: userName.trim() ? 'pointer' : 'not-allowed'
              }}
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Existing User Selection Screen
  if (userMode === 'existing' && !selectedUser) {
    return (
      <div style={{
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          width: '100%'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>
              👤 Select Your Account
            </h2>
            <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
              Choose your account from the list below ({existingUsers.length} users found)
            </p>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ color: '#666' }}>Loading users...</div>
            </div>
          ) : (
            <div style={{
              maxHeight: '400px',
              overflowY: 'auto',
              marginBottom: '20px'
            }}>
              {existingUsers.map((user) => (
                <div
                  key={user.id || user._id}
                  onClick={() => handleUserSelection(user)}
                  style={{
                    background: '#f8f9fa',
                    border: '2px solid #e9ecef',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '15px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    ':hover': {
                      background: '#e3f2fd',
                      borderColor: '#2196F3'
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#e3f2fd';
                    e.target.style.borderColor = '#2196F3';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#f8f9fa';
                    e.target.style.borderColor = '#e9ecef';
                  }}
                >
                  <div style={{ fontWeight: '600', fontSize: '16px', color: '#333', marginBottom: '5px' }}>
                    {user.userName}
                  </div>
                  <div style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                    {user.userEmail}
                  </div>
                  <div style={{ color: '#999', fontSize: '12px' }}>
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => {
                setUserMode('');
                setShowUserSelection(true);
              }}
              style={{
                background: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Draft Choice Screen
  if (showDraftChoice && userAssessmentStatus) {
    return (
      <div style={{
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          maxWidth: '600px',
          width: '100%'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>
              👋 Welcome back, {selectedUser?.userName}!
            </h2>
            <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>
              {userAssessmentStatus.completionCount > 0
                ? `You have completed this assessment ${userAssessmentStatus.completionCount} time(s)`
                : 'We found an existing assessment in progress'
              }
            </p>
          </div>

          {userAssessmentStatus.hasDraft && (
            <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>📄 Draft saved:</strong> {new Date(userAssessmentStatus.draft?.savedAt).toLocaleString()}
              </div>
              <div style={{ marginBottom: '10px' }}>
                <strong>📊 Progress:</strong> Question {(userAssessmentStatus.draft?.currentQuestionIndex || 0) + 1}
              </div>
              <div>
                <strong>📝 Answers:</strong> {Object.keys(userAssessmentStatus.draft?.answers || {}).length} questions answered
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {userAssessmentStatus.hasDraft && (
              <button
                onClick={handleContinueFromDraft}
                style={{
                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '20px',
                  fontSize: '18px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                }}
              >
                📄 Continue from Draft
              </button>
            )}

            <button
              onClick={handleStartNewAssessment}
              style={{
                background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '20px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)'
              }}
            >
              🆕 Start New Assessment (Attempt #{(userAssessmentStatus.completionCount || 0) + 1})
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              onClick={() => {
                setShowDraftChoice(false);
                setUserMode('existing');
                setSelectedUser(null);
                setUserAssessmentStatus(null);
              }}
              style={{
                background: '#666',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              ← Back to User Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Submission Success Screen
  if (isSubmitted) {
    return (
      <div style={{
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
          <h2 style={{ margin: '0 0 15px 0', color: '#333' }}>
            Thank You, {userName}!
          </h2>
          <p style={{ color: '#666', fontSize: '16px', marginBottom: '30px' }}>
            Your answers have been submitted successfully to the database.
          </p>
          <button
            onClick={onBackToHome}
            style={{
              background: 'linear-gradient(135deg, #2196F3, #1976D2)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '15px 30px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // Main questionnaire interface
  const currentQuestion = visibleQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === visibleQuestions.length - 1;
  const isFirstQuestion = currentQuestionIndex === 0;

  if (!currentQuestion) {
    return (
      <div style={{
        height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '40px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#333' }}>Loading questions...</h3>
          <p style={{ color: '#666', marginTop: '10px' }}>
            Please wait while we prepare your questionnaire.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        width: '100%'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2 style={{ margin: 0, color: '#333' }}>
              {questionnaire.name}
            </h2>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Question {currentQuestionIndex + 1} of {visibleQuestions.length}
            </div>
          </div>

          <div style={{
            background: '#f0f0f0',
            borderRadius: '10px',
            height: '8px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #2196F3, #1976D2)',
              height: '100%',
              width: `${((currentQuestionIndex + 1) / visibleQuestions.length) * 100}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>

          {/* User info */}
          <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
            👤 {userName} {userEmail && `(${userEmail})`}
            {isDraftMode && lastSavedAt && (
              <span style={{ marginLeft: '15px' }}>
                💾 Last saved: {lastSavedAt.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Question */}
        <div style={{ marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '20px' }}>
            {currentQuestionIndex + 1}. {currentQuestion.data?.question || 'Question text not available'}
            {currentQuestion.data?.isRequired && (
              <span style={{ color: '#f44336', marginLeft: '5px' }}>*</span>
            )}
          </h3>

          {renderQuestionInput(currentQuestion)}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handlePrevious}
            disabled={isFirstQuestion}
            style={{
              background: isFirstQuestion ? '#ccc' : '#666',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: isFirstQuestion ? 'not-allowed' : 'pointer'
            }}
          >
            ← Previous
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {isLastQuestion ? (
              <button
                onClick={submitAnswers}
                style={{
                  background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)'
                }}
              >
                Submit Answers
              </button>
            ) : (
              <button
                onClick={handleNext}
                style={{
                  background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinearCustomerFlow;






