import React, { useState, useEffect } from 'react';
import UserStatusList from './UserStatusList';

const QuestionnaireManager = ({ onSelectQuestionnaire, onCreateNew }) => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showParticipants, setShowParticipants] = useState(null);

  useEffect(() => {
    fetchQuestionnaires();
  }, []);

  const fetchQuestionnaires = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/questionnaires');

      if (!response.ok) {
        throw new Error('Failed to fetch questionnaires');
      }

      const data = await response.json();
      console.log('🔍 Debug - Fetched questionnaires:', data);
      data.forEach((q, index) => {
        console.log(`🔍 Debug - Questionnaire ${index}:`, {
          id: q.id || q._id,
          name: q.name,
          hasNodes: !!q.nodes,
          nodeCount: q.nodes?.length || 0
        });
      });

      setQuestionnaires(data);
    } catch (err) {
      console.error('❌ Error fetching questionnaires:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/questionnaires/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete questionnaire');
      }

      alert('Questionnaire deleted successfully!');
      fetchQuestionnaires(); // Refresh the list
    } catch (err) {
      console.error('❌ Error deleting questionnaire:', err);
      alert('Failed to delete questionnaire: ' + err.message);
    }
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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        fontSize: '18px',
        color: '#666'
      }}>
        🔄 Loading questionnaires...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#d32f2f',
        background: '#ffebee',
        borderRadius: '8px',
        margin: '20px'
      }}>
        <h3>❌ Error Loading Questionnaires</h3>
        <p>{error}</p>
        <button
          onClick={fetchQuestionnaires}
          style={{
            background: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 20px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h2 style={{ margin: 0, color: '#333' }}>📋 Questionnaire Manager</h2>
        <button
          onClick={onCreateNew}
          style={{
            background: 'linear-gradient(135deg, #4CAF50, #45a049)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)'
          }}
        >
          ➕ Create New Questionnaire
        </button>
      </div>

      {questionnaires.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#f5f5f5',
          borderRadius: '12px',
          color: '#666'
        }}>
          <h3>📝 No Questionnaires Found</h3>
          <p>Create your first questionnaire to get started!</p>
          <button
            onClick={onCreateNew}
            style={{
              background: 'linear-gradient(135deg, #2196F3, #1976D2)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            ➕ Create First Questionnaire
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {questionnaires.map((questionnaire) => (
            <div
              key={questionnaire._id}
              style={{
                background: 'white',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease'
              }}
            >
              <h3 style={{
                margin: '0 0 10px 0',
                color: '#333',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                📋 {questionnaire.name}
              </h3>

              {questionnaire.description && (
                <p style={{
                  margin: '0 0 15px 0',
                  color: '#666',
                  fontSize: '14px',
                  lineHeight: '1.4'
                }}>
                  {questionnaire.description}
                </p>
              )}

              <div style={{
                fontSize: '12px',
                color: '#999',
                marginBottom: '20px'
              }}>
                <div>📅 Created: {formatDate(questionnaire.createdAt)}</div>
                <div>✏️ Updated: {formatDate(questionnaire.updatedAt)}</div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginBottom: '10px'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectQuestionnaire(questionnaire._id, 'edit');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #2196F3, #1976D2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectQuestionnaire(questionnaire._id, 'view');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #FF9800, #F57C00)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  👁️ Take Survey
                </button>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowParticipants(questionnaire);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #9C27B0, #7B1FA2)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  👥 Participants
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(questionnaire._id, questionnaire.name);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #f44336, #d32f2f)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '10px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Participants Modal */}
      {showParticipants && (
        <UserStatusList
          questionnaire={showParticipants}
          onClose={() => setShowParticipants(null)}
        />
      )}
    </div>
  );
};

export default QuestionnaireManager;



