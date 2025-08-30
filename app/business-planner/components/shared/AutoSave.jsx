'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Save, Clock, CheckCircle, AlertCircle, Cloud, HardDrive } from 'lucide-react';

const AutoSave = ({ formData, onSave, membershipLevel = 'trial' }) => {
  const [saveState, setSaveState] = useState({
    status: 'idle', // idle | saving | saved | error
    lastSaved: null,
    lastSavedMethod: null, // 'local' | 'cloud'
    error: null
  });

  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
  const saveTimeoutRef = useRef(null);
  const previousDataRef = useRef(null);

  // Check if user can save to cloud
  const canSaveToCloud = ['entrepreneur', 'business', 'church_small', 'church_large', 'church_mega'].includes(membershipLevel);
  const canSaveLocally = ['ibam_member', 'entrepreneur', 'business', 'church_small', 'church_large', 'church_mega'].includes(membershipLevel);

  // Initialize user
  useEffect(() => {
    const getUser = async () => {
      // Use custom auth system
      const userEmail = typeof window !== 'undefined' ? localStorage.getItem('ibam-auth-email') : null;
      if (!userEmail) return;
      
      const profileResponse = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
      const profile = await profileResponse.json();
      if (!profile.auth_user_id) return;
      
      setUser({ id: profile.auth_user_id, email: userEmail });
    };
    getUser();
  }, []);

  // Save to localStorage
  const saveToLocal = useCallback((data) => {
    if (!canSaveLocally) return false;
    
    try {
      const saveData = {
        formData: data,
        timestamp: Date.now(),
        version: '1.0',
        userId: user?.id
      };
      localStorage.setItem('ibam-business-planner-data', JSON.stringify(saveData));
      console.log('💾 Business Planner saved to localStorage');
      return true;
    } catch (error) {
      console.error('❌ localStorage save failed:', error);
      return false;
    }
  }, [canSaveLocally, user?.id]);

  // Save to Supabase cloud
  const saveToCloud = useCallback(async (data) => {
    if (!canSaveToCloud || !user) return false;

    try {
      const { error } = await supabase
        .from('business_plans')
        .upsert({
          user_id: user.id,
          plan_data: data,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      console.log('☁️ Business Planner saved to cloud');
      return true;
    } catch (error) {
      console.error('❌ Cloud save failed:', error);
      return false;
    }
  }, [canSaveToCloud, user, supabase]);

  // Main auto-save function
  const performAutoSave = useCallback(async (data) => {
    setSaveState(prev => ({ ...prev, status: 'saving' }));

    // Try localStorage first (fast)
    const localSuccess = saveToLocal(data);
    
    // Try cloud save if allowed
    let cloudSuccess = false;
    if (canSaveToCloud) {
      cloudSuccess = await saveToCloud(data);
    }

    // Update save state
    const success = localSuccess || cloudSuccess;
    const method = cloudSuccess ? 'cloud' : localSuccess ? 'local' : null;

    setSaveState({
      status: success ? 'saved' : 'error',
      lastSaved: success ? new Date() : null,
      lastSavedMethod: method,
      error: success ? null : 'Save failed - please try again'
    });

    // Call parent onSave callback if provided
    if (onSave && success) {
      onSave({ success, method, timestamp: new Date() });
    }

    // Reset status after 3 seconds
    setTimeout(() => {
      setSaveState(prev => prev.status === 'saved' ? { ...prev, status: 'idle' } : prev);
    }, 3000);
  }, [saveToLocal, saveToCloud, canSaveToCloud, onSave]);

  // Debounced auto-save effect
  useEffect(() => {
    // Skip if no data or data hasn't changed
    if (!formData || JSON.stringify(formData) === JSON.stringify(previousDataRef.current)) {
      return;
    }

    // Skip if data is empty
    if (Object.keys(formData).length === 0) {
      return;
    }

    previousDataRef.current = formData;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Set new save timeout (3 seconds debounce)
    saveTimeoutRef.current = setTimeout(() => {
      performAutoSave(formData);
    }, 3000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, performAutoSave]);

  // Force save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (formData && Object.keys(formData).length > 0) {
        saveToLocal(formData);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [formData, saveToLocal]);

  // Don't render if user can't save anything
  if (!canSaveLocally && !canSaveToCloud) {
    return null;
  }

  // Format last saved time
  const formatLastSaved = (date) => {
    if (!date) return null;
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffSecs < 60) return `${diffSecs}s ago`;
    if (diffMins < 60) return `${diffMins}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center px-4 py-2 rounded-full shadow-lg transition-all duration-300 ${
        saveState.status === 'saving' ? 'bg-yellow-100 border-yellow-300' :
        saveState.status === 'saved' ? 'bg-green-100 border-green-300' :
        saveState.status === 'error' ? 'bg-red-100 border-red-300' :
        'bg-blue-100 border-blue-300'
      } border`}>
        
        {/* Status Icon */}
        <div className="mr-2">
          {saveState.status === 'saving' && <Clock className="w-4 h-4 text-yellow-600 animate-spin" />}
          {saveState.status === 'saved' && <CheckCircle className="w-4 h-4 text-green-600" />}
          {saveState.status === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
          {saveState.status === 'idle' && <Save className="w-4 h-4 text-blue-600" />}
        </div>

        {/* Status Text */}
        <div className="text-sm font-medium">
          {saveState.status === 'saving' && (
            <span className="text-yellow-700">Saving...</span>
          )}
          {saveState.status === 'saved' && (
            <div className="flex items-center text-green-700">
              <span>Saved</span>
              {saveState.lastSavedMethod === 'cloud' && <Cloud className="w-3 h-3 ml-1" />}
              {saveState.lastSavedMethod === 'local' && <HardDrive className="w-3 h-3 ml-1" />}
            </div>
          )}
          {saveState.status === 'error' && (
            <span className="text-red-700">Save failed</span>
          )}
          {saveState.status === 'idle' && saveState.lastSaved && (
            <span className="text-blue-700">
              Saved {formatLastSaved(saveState.lastSaved)}
            </span>
          )}
          {saveState.status === 'idle' && !saveState.lastSaved && (
            <span className="text-blue-700">Auto-save ready</span>
          )}
        </div>

        {/* Membership indicator for non-cloud users */}
        {canSaveLocally && !canSaveToCloud && (
          <div className="ml-2 text-xs text-gray-500">
            Local only
          </div>
        )}
      </div>

      {/* Error tooltip */}
      {saveState.status === 'error' && saveState.error && (
        <div className="absolute bottom-full right-0 mb-2 p-2 bg-red-600 text-white text-xs rounded whitespace-nowrap">
          {saveState.error}
        </div>
      )}
    </div>
  );
};

export default AutoSave;