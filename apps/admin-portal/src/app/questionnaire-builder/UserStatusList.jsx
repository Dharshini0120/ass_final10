import React, { useState, useEffect } from 'react';

const UserStatusList = ({ questionnaire, onClose }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchParticipants();
  }, [questionnaire]);

  const fetchParticipants = async () => {
    try {
      setLoading(true);
      const questionnaireId = questionnaire.id || questionnaire._id;
      
      // Fetch both completed submissions and drafts
      const [submissionsResponse, draftsResponse] = await Promise.all([
        fetch(`http://localhost:5000/api/submissions/${questionnaireId}`),
        fetch(`http://localhost:5000/api/drafts/${questionnaireId}`)
      ]);

      const submissions = submissionsResponse.ok ? await submissionsResponse.json() : [];
      const drafts = draftsResponse.ok ? await draftsResponse.json() : [];

      // Combine and deduplicate participants
      const allParticipants = [];
      const userMap = new Map();

      // Add completed submissions
      submissions.forEach(submission => {
        userMap.set(submission.userName.toLowerCase(), {
          userName: submission.userName,
          userEmail: submission.userEmail || '',
          status: 'completed',
          lastActivity: submission.submittedAt,
          questionsAnswered: submission.totalQuestionsAnswered || Object.keys(submission.answers || {}).length,
          submissionData: submission
        });
      });

      // Add drafts (only if user hasn't completed)
      drafts.forEach(draft => {
        const userKey = draft.userName.toLowerCase();
        if (!userMap.has(userKey)) {
          userMap.set(userKey, {
            userName: draft.userName,
            userEmail: draft.userEmail || '',
            status: 'draft',
            lastActivity: draft.savedAt,
            questionsAnswered: Object.keys(draft.answers || {}).length,
            draftData: draft
          });
        }
      });

      setParticipants(Array.from(userMap.values()).sort((a, b) => 
        new Date(b.lastActivity) - new Date(a.lastActivity)
      ));
    } catch (err) {
      console.error('❌ Error fetching participants:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: { background: '#4CAF50', color: 'white', icon: '✅' },
      draft: { background: '#FF9800', color: 'white', icon: '📝' }
    };
    
    const style = styles[status] || styles.draft;
    
    return (
      <span style={{
        background: style.background,
        color: style.color,
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {style.icon} {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '10px' }}>🔄</div>
          <div>Loading participants...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '12px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '80vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '20px 30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: '0 0 5px 0', fontSize: '20px' }}>
              👥 Participants Status
            </h2>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>
              {questionnaire.name}
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '6px',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>

        {/* Stats */}
        <div style={{
          padding: '20px 30px',
          background: '#f8f9fa',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          gap: '30px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>
              {participants.length}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Total Participants</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#4CAF50' }}>
              {participants.filter(p => p.status === 'completed').length}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>Completed</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>
              {participants.filter(p => p.status === 'draft').length}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>In Progress</div>
          </div>
        </div>

        {/* Participants List */}
        <div style={{ flex: 1, overflow: 'auto', padding: '20px 30px' }}>
          {error ? (
            <div style={{
              textAlign: 'center',
              color: '#d32f2f',
              padding: '40px'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>❌</div>
              <div>Error loading participants: {error}</div>
              <button
                onClick={fetchParticipants}
                style={{
                  background: '#2196f3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  marginTop: '15px'
                }}
              >
                🔄 Retry
              </button>
            </div>
          ) : participants.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#666',
              padding: '40px'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>👥</div>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>No participants yet</div>
              <div>Share this questionnaire to start collecting responses!</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {participants.map((participant, index) => (
                <div
                  key={index}
                  style={{
                    background: 'white',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px'
                    }}>
                      <div style={{
                        background: participant.status === 'completed' ? '#4CAF50' : '#FF9800',
                        color: 'white',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}>
                        {participant.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', color: '#333' }}>
                          {participant.userName}
                        </div>
                        {participant.userEmail && (
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {participant.userEmail}
                          </div>
                        )}
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      gap: '20px',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      <span>📊 {participant.questionsAnswered} questions answered</span>
                      <span>🕒 {formatDate(participant.lastActivity)}</span>
                    </div>
                  </div>
                  <div>
                    {getStatusBadge(participant.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserStatusList;