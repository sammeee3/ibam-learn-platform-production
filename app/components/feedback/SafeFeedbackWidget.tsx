'use client';

import React, { useState } from 'react';

export default function SafeFeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!feedbackType || !description) {
      alert('Please select bug/feature and add description');
      return;
    }
    
    alert(`Feedback submitted: ${feedbackType} - ${description}`);
    setIsOpen(false);
    setFeedbackType('');
    setDescription('');
  };

  return (
    <>
      {/* Purple Button */}
      <div 
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          background: 'purple', 
          color: 'white', 
          padding: '15px', 
          borderRadius: '50px', 
          cursor: 'pointer', 
          zIndex: 9999
        }}
      >
        💬 BETA
      </div>

      {/* Form Modal */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'rgba(0,0,0,0.5)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            zIndex: 10000
          }}
          onClick={() => setIsOpen(false)}
        >
          <div 
            style={{
              background: 'white', 
              borderRadius: '12px', 
              padding: '24px', 
              maxWidth: '400px', 
              width: '90%'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{margin: '0 0 16px 0', color: '#333'}}>Beta Feedback</h3>
            
            {/* Bug/Feature Buttons */}
            <div style={{marginBottom: '16px'}}>
              <button 
                onClick={() => setFeedbackType('bug')}
                style={{
                  padding: '8px 16px', 
                  marginRight: '8px', 
                  border: `2px solid ${feedbackType === 'bug' ? 'red' : '#ddd'}`, 
                  borderRadius: '6px', 
                  background: feedbackType === 'bug' ? '#fee' : 'white', 
                  cursor: 'pointer'
                }}
              >
                🐛 Bug Report
              </button>
              <button 
                onClick={() => setFeedbackType('feature')}
                style={{
                  padding: '8px 16px', 
                  border: `2px solid ${feedbackType === 'feature' ? 'blue' : '#ddd'}`, 
                  borderRadius: '6px', 
                  background: feedbackType === 'feature' ? '#eef' : 'white', 
                  cursor: 'pointer'
                }}
              >
                💡 Feature Request
              </button>
            </div>
            
            {/* Text Area */}
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what happened or what you'd like to see..."
              style={{
                width: '100%', 
                height: '100px', 
                padding: '12px', 
                border: '2px solid #ddd', 
                borderRadius: '6px', 
                fontFamily: 'inherit', 
                fontSize: '14px', 
                boxSizing: 'border-box'
              }}
            />
            
            {/* Buttons */}
            <div style={{marginTop: '16px', textAlign: 'right'}}>
              <button 
                onClick={() => setIsOpen(false)}
                style={{
                  padding: '10px 20px', 
                  marginRight: '12px', 
                  border: '2px solid #ddd', 
                  borderRadius: '6px', 
                  background: 'white', 
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                style={{
                  padding: '10px 20px', 
                  border: 'none', 
                  borderRadius: '6px', 
                  background: 'purple', 
                  color: 'white', 
                  cursor: 'pointer'
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}