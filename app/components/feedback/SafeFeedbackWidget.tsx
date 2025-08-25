'use client';

import React, { useState, useRef, useEffect } from 'react';
import { progressTracker } from '../../../lib/services/progressTracking';

export default function SafeFeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackType, setFeedbackType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showMicroSurvey, setShowMicroSurvey] = useState(false);
  const [sessionRating, setSessionRating] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pageContext, setPageContext] = useState<any>({});
  const [timeOnPage, setTimeOnPage] = useState(0);
  const pageLoadTime = useRef(Date.now());

  useEffect(() => {
    // Track page context
    const extractPageContext = () => {
      const path = window.location.pathname;
      const params = new URLSearchParams(window.location.search);
      
      // Extract module and session from URL
      const moduleMatch = path.match(/modules\/(\d+)/);
      const sessionMatch = path.match(/sessions\/(\d+)/);
      
      setPageContext({
        url: window.location.href,
        path: path,
        moduleId: moduleMatch ? parseInt(moduleMatch[1]) : null,
        sessionId: sessionMatch ? parseInt(sessionMatch[1]) : null,
        pageName: document.title,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      });
    };

    extractPageContext();
    
    // Track time on page
    const timer = setInterval(() => {
      setTimeOnPage(Math.floor((Date.now() - pageLoadTime.current) / 1000));
    }, 1000);

    // Check if we should show micro survey (after session completion)
    const checkForMicroSurvey = () => {
      const shouldShow = sessionStorage.getItem('show_micro_survey');
      if (shouldShow === 'true') {
        setTimeout(() => setShowMicroSurvey(true), 2000);
        sessionStorage.removeItem('show_micro_survey');
      }
    };
    
    checkForMicroSurvey();

    return () => clearInterval(timer);
  }, []);

  const handleScreenshotInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload PNG, JPG, or PDF files only.');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB. Please compress your screenshot and try again.');
      return;
    }

    setScreenshot(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshotPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setScreenshotPreview(null); // PDF preview not needed
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!feedbackType || !description) {
      alert('Please select bug/feature and add description');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert screenshot to base64 if provided
      let screenshotData: string | null = null;
      if (screenshot) {
        const reader = new FileReader();
        screenshotData = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(screenshot);
        });
      }

      // Enhanced feedback data with context
      const feedbackData = {
        type: feedbackType,
        description,
        userAgent: navigator.userAgent,
        url: window.location.href,
        userEmail: localStorage.getItem('user_email') || null,
        screenshot: screenshotData,
        screenshotName: screenshot?.name || null,
        screenshotSize: screenshot?.size || null,
        timestamp: new Date().toISOString(),
        // New context fields
        context: {
          ...pageContext,
          timeOnPageSeconds: timeOnPage,
          scrollDepth: Math.round((window.scrollY / document.body.scrollHeight) * 100),
          sessionRating: sessionRating || null
        }
      };

      // Log the feedback activity
      const userId = localStorage.getItem('user_id');
      if (userId) {
        await progressTracker.logActivity({
          userId,
          activityType: 'feedback_submitted',
          activityData: {
            type: feedbackType,
            hasScreenshot: !!screenshot,
            rating: sessionRating
          },
          moduleId: pageContext.moduleId,
          sessionId: pageContext.sessionId,
          pageUrl: window.location.href,
          timeOnPageSeconds: timeOnPage
        });
      }

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
      setScreenshotPreview(null);
      setShowInstructions(false);
    }
  };

  const handleMicroSurveySubmit = async (rating: number) => {
    setSessionRating(rating);
    
    // Log the rating
    const userId = localStorage.getItem('user_id');
    if (userId) {
      await progressTracker.logActivity({
        userId,
        activityType: 'session_rated',
        activityData: { rating },
        moduleId: pageContext.moduleId,
        sessionId: pageContext.sessionId,
        pageUrl: window.location.href
      });
    }

    // Save rating to feedback API
    await fetch('/api/feedback/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'rating',
        description: `Session rated ${rating}/5 stars`,
        userEmail: localStorage.getItem('user_email') || null,
        url: window.location.href,
        timestamp: new Date().toISOString(),
        context: {
          ...pageContext,
          rating,
          timeOnPageSeconds: timeOnPage
        }
      })
    });

    setShowMicroSurvey(false);
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
      
      {/* Micro Survey Popup */}
      {showMicroSurvey && (
        <div 
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            zIndex: 9998,
            maxWidth: '300px',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          <button
            onClick={() => setShowMicroSurvey(false)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              color: '#999'
            }}
          >
            ×
          </button>
          
          <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#333' }}>
            How valuable was this session?
          </h4>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleMicroSurveySubmit(star)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: sessionRating >= star ? '#FFD700' : '#DDD',
                  transition: 'color 0.2s',
                  transform: 'scale(1)',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                ⭐
              </button>
            ))}
          </div>
          
          <p style={{ fontSize: '12px', color: '#666', marginTop: '12px', textAlign: 'center' }}>
            Your feedback helps us improve!
          </p>
        </div>
      )}

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
            
            {/* Screenshot Instructions */}
            <div style={{marginBottom: '16px'}}>
              <button 
                onClick={handleScreenshotInstructions}
                style={{
                  padding: '8px 16px', 
                  border: '2px solid #888', 
                  borderRadius: '6px', 
                  background: '#f9f9f9', 
                  cursor: 'pointer',
                  fontSize: '12px',
                  marginBottom: '8px'
                }}
              >
                📸 How to take a screenshot
              </button>
              
              {showInstructions && (
                <div style={{
                  padding: '12px',
                  background: '#f0f8ff',
                  border: '1px solid #ddd',
                  borderRadius: '6px',
                  fontSize: '12px',
                  marginBottom: '12px'
                }}>
                  <strong>📱 Taking Screenshots:</strong><br/>
                  <strong>Mac:</strong> Press Cmd + Shift + 4, then drag to select area<br/>
                  <strong>Windows:</strong> Press Win + Shift + S, then drag to select area<br/>
                  <strong>Full Screen:</strong> Mac (Cmd + Shift + 3) or Windows (Print Screen)<br/><br/>
                  <em>💡 Tip: Screenshots help us understand and fix issues faster!</em>
                </div>
              )}
              
              {/* File Upload Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '20px',
                  border: `2px dashed ${dragOver ? '#4CAF50' : '#ddd'}`,
                  borderRadius: '8px',
                  background: dragOver ? '#f0fff0' : '#fafafa',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {screenshot ? (
                  <div>
                    <div style={{color: '#4CAF50', marginBottom: '8px'}}>
                      ✅ {screenshot.name} ({Math.round(screenshot.size / 1024)}KB)
                    </div>
                    {screenshotPreview && (
                      <img 
                        src={screenshotPreview} 
                        alt="Screenshot preview" 
                        style={{maxWidth: '200px', maxHeight: '100px', borderRadius: '4px', marginBottom: '8px'}}
                      />
                    )}
                    <div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeScreenshot(); }}
                        style={{
                          padding: '4px 8px',
                          background: '#ff4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '11px',
                          cursor: 'pointer'
                        }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{fontSize: '24px', marginBottom: '8px'}}>📎</div>
                    <div style={{fontWeight: 'bold', marginBottom: '4px'}}>
                      Drag screenshot here or click to upload
                    </div>
                    <div style={{fontSize: '11px', color: '#666'}}>
                      PNG, JPG, PDF • Max 10MB • Optional
                    </div>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept=".png,.jpg,.jpeg,.pdf"
                onChange={handleFileUpload}
                style={{display: 'none'}}
              />
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
                onClick={() => {
                  setIsOpen(false);
                  setFeedbackType('');
                  setDescription('');
                  setScreenshot(null);
                  setScreenshotPreview(null);
                  setShowInstructions(false);
                }}
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