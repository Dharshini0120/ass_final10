import React from 'react';

interface StartDialogProps {
    onAddQuestion: () => void;
    onCancel: () => void;
}

const StartDialog: React.FC<StartDialogProps> = ({ onAddQuestion, onCancel }) => {
    const handleAddClick = () => {
        onAddQuestion();
    };

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
            zIndex: 999
        }}>
            <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '40px',
                textAlign: 'center',
                maxWidth: '400px',
                width: '90%'
            }}>
                <h2 style={{ margin: '0 0 20px 0', color: '#333' }}>
                    Create Assessment
                </h2>
                <p style={{ margin: '0 0 30px 0', color: '#666' }}>
                    Click "Add" to create your first Quetsion
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                    <button
                        onClick={onCancel}
                        style={{
                            background: '#fd5475',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '12px 40px', // Increased horizontal padding for wider button
                            fontSize: '14px',
                            cursor: 'pointer',
                            minWidth: '120px' // Ensures minimum width
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAddClick}
                        style={{
                            background: '#4baaf4',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '12px 40px', // Increased horizontal padding for wider button
                            fontSize: '14px',
                            cursor: 'pointer',
                            minWidth: '120px' // Ensures minimum width
                        }}
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StartDialog;