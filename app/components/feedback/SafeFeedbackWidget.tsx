'use client';

import React, { useState } from 'react';

export default function SafeFeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<string | null>(null);

  const handleScreenshot = () => {
    // For now, prompt user to take screenshot manually
    // In the future, we could implement automatic screenshot capture
    alert('📸 Please take a screenshot and paste it below, or describe the issue in detail including which page/section you were on.');
  };

  const handleSubmit = async () => {
    if (!feedbackType || !description) {
      alert('Please select bug/feature and add description');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const feedbackData = {
        type: feedbackType,
        description,
        userAgent: navigator.userAgent,
        url: window.location.href,
        userEmail: localStorage.getItem('user_email') || null,
        screenshot: screenshot,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        alert('✅ Feedback submitted! We\'ll review this and add it to our task list. Thank you!');
      } else {
        alert('❌ Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      alert('❌ Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
      setFeedbackType('');
      setDescription('');
      setScreenshot(null);
    }
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
            
            {/* Screenshot Button */}
            <div style={{marginBottom: '12px'}}>
              <button 
                onClick={handleScreenshot}
                style={{
                  padding: '8px 16px', 
                  border: '2px solid #888', 
                  borderRadius: '6px', 
                  background: '#f9f9f9', 
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                📸 Screenshot Help
              </button>
            </div>

            {/* Text Area */}
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us what happened or what you'd like to see... Include which page/section you were on if relevant."
              style={{
                width: '100%', 
                height: '120px', 
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
                disabled={isSubmitting}
                style={{
                  padding: '10px 20px', 
                  border: 'none', 
                  borderRadius: '6px', 
                  background: isSubmitting ? '#ccc' : 'purple', 
                  color: 'white', 
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}