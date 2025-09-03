'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  UserCircleIcon, 
  CameraIcon, 
  EyeIcon, 
  EyeSlashIcon,
  BellIcon,
  ShieldCheckIcon,
  DocumentArrowDownIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { exportService, type UserProgress } from '@/lib/services/exportService';

/**
 * ENTERPRISE-GRADE USER PROFILE MANAGEMENT
 * Complete GDPR-compliant profile system with data portability
 * Security-first implementation with comprehensive UX
 */

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  learningPath: 'self_paced' | 'structured' | 'intensive';
  learningMode: 'casual' | 'focused' | 'immersive';
  notifications: {
    email: boolean;
    progress: boolean;
    reminders: boolean;
    marketing: boolean;
  };
  privacy: {
    showProgress: boolean;
    allowAnalytics: boolean;
    shareAchievements: boolean;
  };
  createdAt: string;
  lastActive: string;
}

interface NotificationSettings {
  email: boolean;
  progress: boolean;
  reminders: boolean;
  marketing: boolean;
}

interface PrivacySettings {
  showProgress: boolean;
  allowAnalytics: boolean;
  shareAchievements: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State Management
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'notifications' | 'privacy' | 'data'>('profile');
  
  // Form States
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    learningPath: 'self_paced' as 'self_paced' | 'structured' | 'intensive',
    learningMode: 'casual' as 'casual' | 'focused' | 'immersive'
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false
  });
  
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    progress: true,
    reminders: false,
    marketing: false
  });
  
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    showProgress: true,
    allowAnalytics: true,
    shareAchievements: false
  });

  // UI States
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);
  const [showErrorMessage, setShowErrorMessage] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [exportingData, setExportingData] = useState(false);

  // Load user profile
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        throw new Error('Failed to load profile');
      }
      
      const userData = await response.json();
      setUser(userData);
      
      // Populate forms with current data
      setProfileForm({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        learningPath: userData.learningPath || 'self_paced',
        learningMode: userData.learningMode || 'casual'
      });
      
      setNotifications(userData.notifications || {
        email: true,
        progress: true,
        reminders: false,
        marketing: false
      });
      
      setPrivacy(userData.privacy || {
        showProgress: true,
        allowAnalytics: true,
        shareAchievements: false
      });
      
    } catch (error) {
      console.error('Error loading profile:', error);
      setShowErrorMessage('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      setSaving(true);
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      await loadUserProfile();
      showSuccess('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setShowErrorMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setShowErrorMessage('New passwords do not match');
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      setShowErrorMessage('Password must be at least 8 characters long');
      return;
    }
    
    try {
      setSaving(true);
      
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
      }
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false
      });
      
      showSuccess('Password changed successfully!');
      
    } catch (error: any) {
      console.error('Error changing password:', error);
      setShowErrorMessage(error.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const updateNotifications = async () => {
    try {
      setSaving(true);
      
      const response = await fetch('/api/user/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifications)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update notifications');
      }
      
      showSuccess('Notification preferences updated!');
      
    } catch (error) {
      console.error('Error updating notifications:', error);
      setShowErrorMessage('Failed to update notification settings');
    } finally {
      setSaving(false);
    }
  };

  const updatePrivacy = async () => {
    try {
      setSaving(true);
      
      const response = await fetch('/api/user/privacy', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(privacy)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update privacy settings');
      }
      
      showSuccess('Privacy settings updated!');
      
    } catch (error) {
      console.error('Error updating privacy:', error);
      setShowErrorMessage('Failed to update privacy settings');
    } finally {
      setSaving(false);
    }
  };

  const uploadProfilePicture = async (file: File) => {
    try {
      setSaving(true);
      
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await fetch('/api/user/profile-picture', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload profile picture');
      }
      
      await loadUserProfile();
      showSuccess('Profile picture updated successfully!');
      
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      setShowErrorMessage('Failed to update profile picture');
    } finally {
      setSaving(false);
    }
  };

  const exportUserData = async () => {
    if (!user) return;
    
    try {
      setExportingData(true);
      
      // Validate export permissions
      const isValid = await exportService.validateExportPermissions(user.id, 'progress');
      if (!isValid) {
        throw new Error('Export permission denied');
      }
      
      // Get user progress data
      const response = await fetch('/api/user/export-progress');
      if (!response.ok) {
        throw new Error('Failed to fetch progress data');
      }
      
      const progressData: UserProgress = await response.json();
      
      // Generate comprehensive progress report
      const reportBlob = await exportService.generateProgressReport(progressData);
      
      // Download the report
      const timestamp = new Date().toISOString().split('T')[0];
      exportService.downloadFile(
        reportBlob, 
        `IBAM_Progress_Report_${timestamp}.pdf`, 
        'application/pdf'
      );
      
      showSuccess('Your progress report has been downloaded!');
      
    } catch (error) {
      console.error('Error exporting data:', error);
      setShowErrorMessage('Failed to export your data');
    } finally {
      setExportingData(false);
    }
  };

  const deleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      setShowErrorMessage('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }
    
    try {
      setSaving(true);
      
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmation: deleteConfirmText })
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete account');
      }
      
      // Clear local storage and redirect
      localStorage.clear();
      sessionStorage.clear();
      router.push('/auth/login?message=account_deleted');
      
    } catch (error) {
      console.error('Error deleting account:', error);
      setShowErrorMessage('Failed to delete account');
      setSaving(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setShowErrorMessage('Profile picture must be smaller than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setShowErrorMessage('Please select a valid image file');
        return;
      }
      
      uploadProfilePicture(file);
    }
  };

  const showSuccess = (message: string) => {
    setShowSuccessMessage(message);
    setShowErrorMessage(null);
    setTimeout(() => setShowSuccessMessage(null), 5000);
  };

  const showError = (message: string) => {
    setShowErrorMessage(message);
    setShowSuccessMessage(null);
    setTimeout(() => setShowErrorMessage(null), 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-gray-600 mb-4">Unable to load your profile information.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  ← Back to Dashboard
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
                  <p className="text-gray-600">Manage your account and preferences</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {user.profilePicture ? (
                  <Image
                    src={user.profilePicture}
                    alt="Profile"
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                )}
                <div className="text-right">
                  <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {showSuccessMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <CheckIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800">{showSuccessMessage}</p>
            <button
              onClick={() => setShowSuccessMessage(null)}
              className="ml-auto text-green-600 hover:text-green-800"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {showErrorMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800">{showErrorMessage}</p>
            <button
              onClick={() => setShowErrorMessage(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3">
            <nav className="space-y-2">
              {[
                { id: 'profile', label: 'Profile Information', icon: UserCircleIcon },
                { id: 'security', label: 'Security', icon: ShieldCheckIcon },
                { id: 'notifications', label: 'Notifications', icon: BellIcon },
                { id: 'privacy', label: 'Privacy', icon: EyeIcon },
                { id: 'data', label: 'Your Data', icon: DocumentArrowDownIcon }
              ].map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium">{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="mt-8 lg:mt-0 lg:col-span-9">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              
              {/* Profile Information Section */}
              {activeSection === 'profile' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  </div>

                  {/* Profile Picture */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-4">Profile Picture</label>
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        {user.profilePicture ? (
                          <Image
                            src={user.profilePicture}
                            alt="Profile"
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <UserCircleIcon className="h-20 w-20 text-gray-400" />
                        )}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 text-white hover:bg-blue-700 transition-colors"
                          disabled={saving}
                        >
                          <CameraIcon className="h-4 w-4" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Upload a new profile picture</p>
                        <p className="text-xs text-gray-500">Max file size: 5MB</p>
                      </div>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your first name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  {/* Email (Read-only) */}
                  <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Contact support to change your email address</p>
                  </div>

                  {/* Learning Preferences */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Learning Path
                      </label>
                      <select
                        value={profileForm.learningPath}
                        onChange={(e) => setProfileForm({ 
                          ...profileForm, 
                          learningPath: e.target.value as 'self_paced' | 'structured' | 'intensive' 
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="self_paced">Self-Paced</option>
                        <option value="structured">Structured</option>
                        <option value="intensive">Intensive</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Learning Mode
                      </label>
                      <select
                        value={profileForm.learningMode}
                        onChange={(e) => setProfileForm({ 
                          ...profileForm, 
                          learningMode: e.target.value as 'casual' | 'focused' | 'immersive' 
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="casual">Casual</option>
                        <option value="focused">Focused</option>
                        <option value="immersive">Immersive</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={updateProfile}
                      disabled={saving}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? 'Saving...' : 'Update Profile'}
                    </button>
                  </div>
                </div>
              )}

              {/* Security Section */}
              {activeSection === 'security' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={passwordForm.showCurrentPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordForm({ 
                            ...passwordForm, 
                            showCurrentPassword: !passwordForm.showCurrentPassword 
                          })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {passwordForm.showCurrentPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={passwordForm.showNewPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordForm({ 
                            ...passwordForm, 
                            showNewPassword: !passwordForm.showNewPassword 
                          })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {passwordForm.showNewPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={passwordForm.showConfirmPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordForm({ 
                            ...passwordForm, 
                            showConfirmPassword: !passwordForm.showConfirmPassword 
                          })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {passwordForm.showConfirmPassword ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={changePassword}
                      disabled={saving || !passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Section */}
              {activeSection === 'notifications' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Notification Preferences</h2>
                  </div>

                  <div className="space-y-6">
                    {[
                      { key: 'email', label: 'Email Notifications', description: 'Receive important updates via email' },
                      { key: 'progress', label: 'Progress Updates', description: 'Notifications about your learning progress' },
                      { key: 'reminders', label: 'Learning Reminders', description: 'Reminders to continue your learning journey' },
                      { key: 'marketing', label: 'Marketing Communications', description: 'Updates about new courses and features' }
                    ].map((notification) => (
                      <div key={notification.key} className="flex items-center justify-between py-4">
                        <div>
                          <h3 className="font-medium text-gray-900">{notification.label}</h3>
                          <p className="text-sm text-gray-500">{notification.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[notification.key as keyof NotificationSettings]}
                            onChange={(e) => setNotifications({
                              ...notifications,
                              [notification.key]: e.target.checked
                            })}
                            className="sr-only"
                          />
                          <div className={`w-11 h-6 rounded-full transition-colors ${
                            notifications[notification.key as keyof NotificationSettings] 
                              ? 'bg-blue-600' 
                              : 'bg-gray-200'
                          }`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                              notifications[notification.key as keyof NotificationSettings] 
                                ? 'translate-x-5' 
                                : 'translate-x-0'
                            } mt-0.5 ml-0.5`}></div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={updateNotifications}
                      disabled={saving}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? 'Saving...' : 'Save Preferences'}
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Section */}
              {activeSection === 'privacy' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Privacy Settings</h2>
                  </div>

                  <div className="space-y-6">
                    {[
                      { key: 'showProgress', label: 'Show Progress to Others', description: 'Allow other learners to see your progress' },
                      { key: 'allowAnalytics', label: 'Usage Analytics', description: 'Help us improve by sharing anonymous usage data' },
                      { key: 'shareAchievements', label: 'Share Achievements', description: 'Allow achievements to be shared publicly' }
                    ].map((setting) => (
                      <div key={setting.key} className="flex items-center justify-between py-4">
                        <div>
                          <h3 className="font-medium text-gray-900">{setting.label}</h3>
                          <p className="text-sm text-gray-500">{setting.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={privacy[setting.key as keyof PrivacySettings]}
                            onChange={(e) => setPrivacy({
                              ...privacy,
                              [setting.key]: e.target.checked
                            })}
                            className="sr-only"
                          />
                          <div className={`w-11 h-6 rounded-full transition-colors ${
                            privacy[setting.key as keyof PrivacySettings] 
                              ? 'bg-blue-600' 
                              : 'bg-gray-200'
                          }`}>
                            <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                              privacy[setting.key as keyof PrivacySettings] 
                                ? 'translate-x-5' 
                                : 'translate-x-0'
                            } mt-0.5 ml-0.5`}></div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex justify-end">
                    <button
                      onClick={updatePrivacy}
                      disabled={saving}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                  </div>
                </div>
              )}

              {/* Data Management Section */}
              {activeSection === 'data' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Your Data</h2>
                  </div>

                  <div className="space-y-8">
                    {/* Export Data */}
                    <div className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <DocumentArrowDownIcon className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Export Your Data</h3>
                          <p className="text-gray-600 mb-4">
                            Download a comprehensive report of all your learning progress, achievements, and account information.
                          </p>
                          <ul className="text-sm text-gray-500 mb-4 space-y-1">
                            <li>• Learning progress and module completions</li>
                            <li>• Quiz scores and assessment results</li>
                            <li>• Time spent on each session</li>
                            <li>• Account information and preferences</li>
                          </ul>
                          <button
                            onClick={exportUserData}
                            disabled={exportingData}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                          >
                            {exportingData ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>Preparing Export...</span>
                              </>
                            ) : (
                              <>
                                <DocumentArrowDownIcon className="h-4 w-4" />
                                <span>Export My Data</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Account Deletion */}
                    <div className="border border-red-200 rounded-lg p-6 bg-red-50">
                      <div className="flex items-start space-x-4">
                        <TrashIcon className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-red-900 mb-2">Delete Account</h3>
                          <p className="text-red-700 mb-4">
                            Permanently delete your account and all associated data. This action cannot be undone.
                          </p>
                          
                          {!showDeleteConfirmation ? (
                            <button
                              onClick={() => setShowDeleteConfirmation(true)}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                            >
                              Delete My Account
                            </button>
                          ) : (
                            <div className="space-y-4">
                              <div className="bg-white rounded-lg p-4 border border-red-200">
                                <p className="text-red-800 font-medium mb-3">
                                  Are you absolutely sure? This will permanently delete your account and all your learning progress.
                                </p>
                                <p className="text-red-700 text-sm mb-3">
                                  Type <strong>DELETE MY ACCOUNT</strong> below to confirm:
                                </p>
                                <input
                                  type="text"
                                  value={deleteConfirmText}
                                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                                  className="w-full px-4 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                  placeholder="DELETE MY ACCOUNT"
                                />
                              </div>
                              <div className="flex space-x-3">
                                <button
                                  onClick={deleteAccount}
                                  disabled={saving || deleteConfirmText !== 'DELETE MY ACCOUNT'}
                                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  {saving ? 'Deleting...' : 'Confirm Deletion'}
                                </button>
                                <button
                                  onClick={() => {
                                    setShowDeleteConfirmation(false);
                                    setDeleteConfirmText('');
                                  }}
                                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}