'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UserCircleIcon, 
  DocumentArrowDownIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
  KeyIcon,
  LinkIcon,
  PencilIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { exportService, type ExportUserProgress } from '@/lib/services/exportService';

/**
 * SIMPLIFIED USER PROFILE - ALIGNED WITH DASHBOARD
 * Focus on core student needs: view profile, download work
 */

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  loginSource: string; // 'systemio' or 'direct' - Critical for password management
  membershipLevel: string;
  completedModules: number;
  totalModules: number;
  overallProgress: number;
  joinedDate: string;
  lastActive: string;
}

interface BusinessPlan {
  id: string;
  name: string;
  completionPercentage: number;
  lastModified: string;
}

export default function ProfilePage() {
  const router = useRouter();

  // State Management
  const [user, setUser] = useState<UserProfile | null>(null);
  const [businessPlans, setBusinessPlans] = useState<BusinessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);
  
  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    phone: ''
  });
  const [saving, setSaving] = useState(false);

  // Load user data
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get user email from localStorage
      const userEmail = typeof window !== 'undefined' ? localStorage.getItem('ibam-auth-email') : null;
      if (!userEmail) {
        console.error('No user email found in localStorage');
        setLoading(false);
        return;
      }
      
      // Load user profile with email parameter
      const profileResponse = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUser({
          id: profileData.id || 'unknown',
          email: profileData.email || '',
          firstName: profileData.firstName || 'Student',
          lastName: profileData.lastName || '',
          loginSource: profileData.loginSource || 'direct', // Critical for password management
          membershipLevel: profileData.membershipLevel || 'Basic Member',
          completedModules: profileData.completedModules || 0,
          totalModules: profileData.totalModules || 5,
          overallProgress: profileData.overallProgress || 0,
          joinedDate: profileData.createdAt || new Date().toISOString(),
          lastActive: profileData.lastActive || new Date().toISOString()
        });
      }

      // Load business plans
      const plansResponse = await fetch('/api/user/business-plans');
      if (plansResponse.ok) {
        const plansData = await plansResponse.json();
        setBusinessPlans(plansData || []);
      }
      
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCourseProgress = async () => {
    if (!user) return;
    
    try {
      setDownloading('progress');
      
      // Get user progress data
      const response = await fetch('/api/user/export-progress');
      if (!response.ok) {
        throw new Error('Failed to fetch progress data');
      }
      
      const progressData: ExportUserProgress = await response.json();
      
      // Generate progress report
      const reportBlob = await exportService.generateProgressReport(progressData);
      
      // Download the report
      const timestamp = new Date().toISOString().split('T')[0];
      exportService.downloadFile(
        reportBlob, 
        `${user.firstName}_${user.lastName}_Course_Progress_${timestamp}.pdf`, 
        'application/pdf'
      );
      
    } catch (error) {
      console.error('Error downloading progress:', error);
      alert('Failed to download progress report. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const downloadBusinessPlan = async (planId: string, planName: string) => {
    if (!user) return;
    
    try {
      setDownloading(planId);
      
      // Get business plan data
      const response = await fetch(`/api/user/business-plan/${planId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch business plan data');
      }
      
      const planData = await response.json();
      
      // Generate business plan document
      const planBlob = await exportService.generateBusinessPlan(planData);
      
      // Download the document
      const timestamp = new Date().toISOString().split('T')[0];
      const sanitizedName = planName.replace(/[^a-zA-Z0-9]/g, '_');
      exportService.downloadFile(
        planBlob, 
        `${user.firstName}_${user.lastName}_${sanitizedName}_${timestamp}.docx`, 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      );
      
    } catch (error) {
      console.error('Error downloading business plan:', error);
      alert('Failed to download business plan. Please try again.');
    } finally {
      setDownloading(null);
    }
  };

  const downloadCertificate = async (moduleId: number) => {
    if (!user) return;
    
    try {
      setDownloading(`cert-${moduleId}`);
      
      // Get certificate data
      const response = await fetch('/api/user/export-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleId })
      });
      
      if (!response.ok) {
        throw new Error('Module not completed or certificate not available');
      }
      
      const certificateData = await response.json();
      
      // Generate certificate
      const certBlob = await exportService.generateCertificate(certificateData, moduleId);
      
      // Download certificate
      const timestamp = new Date().toISOString().split('T')[0];
      exportService.downloadFile(
        certBlob, 
        `${user.firstName}_${user.lastName}_Module_${moduleId}_Certificate_${timestamp}.pdf`, 
        'application/pdf'
      );
      
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Certificate not available. Complete the module first.');
    } finally {
      setDownloading(null);
    }
  };

  // Profile editing functions
  const startEditing = () => {
    if (!user) return;
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      bio: '', // TODO: Get from user profile when bio field is added
      phone: '' // TODO: Get from user profile when phone field is added
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditForm({ firstName: '', lastName: '', email: '', bio: '', phone: '' });
  };

  const saveProfile = async () => {
    if (!user) return;
    
    try {
      setSaving(true);
      
      // TODO: Create API endpoint to update profile
      const response = await fetch(`/api/user/profile/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email, // For identification
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          bio: editForm.bio,
          phone: editForm.phone,
          // Note: Email changes need special handling for System.io users
          newEmail: editForm.email !== user.email ? editForm.email : null
        })
      });

      if (response.ok) {
        // Update local user state
        setUser({
          ...user,
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          email: editForm.email
        });
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile. Please try again.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
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
          <UserCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-2"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  <span>Back to Dashboard</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="bg-blue-100 rounded-full p-4">
              <UserCircleIcon className="h-16 w-16 text-blue-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {user.membershipLevel}
                </span>
                <span className="text-sm text-gray-500">
                  Member since {new Date(user.joinedDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{user.overallProgress}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
        </div>

        {/* Account Security - Differentiated for System.io vs Direct Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <KeyIcon className="h-6 w-6 text-blue-600" />
              <span>Account Security</span>
            </h2>
            {user.loginSource === 'systemio' && (
              <div className="flex items-center space-x-2 text-sm text-blue-600">
                <LinkIcon className="h-4 w-4" />
                <span>System.io Account</span>
              </div>
            )}
          </div>

          {user.loginSource === 'systemio' ? (
            // System.io User - External Password Management
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-2">Password Management via System.io</h3>
              <p className="text-sm text-blue-700 mb-4">
                Your account was created through System.io. To change your password or update account security settings, 
                please use your System.io account dashboard.
              </p>
              <div className="flex items-center space-x-3">
                <a
                  href="https://www.ibam.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Manage in System.io
                </a>
                <div className="text-xs text-blue-600">
                  ✅ Password changes won't affect your IBAM platform access
                </div>
              </div>
            </div>
          ) : (
            // Direct User - IBAM Password Management
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-medium text-green-900 mb-2">IBAM Account Security</h3>
              <p className="text-sm text-green-700 mb-4">
                Your account was created directly on the IBAM platform. You can change your password and manage 
                security settings here.
              </p>
              <div className="space-y-3">
                <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors">
                  <KeyIcon className="h-4 w-4 mr-2" />
                  Change Password
                </button>
                <div className="text-xs text-green-600">
                  ⚡ Full password management available
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Information - Editable */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <UserCircleIcon className="h-6 w-6 text-green-600" />
              <span>Profile Information</span>
            </h2>
            {!isEditing ? (
              <button
                onClick={startEditing}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                <PencilIcon className="h-4 w-4 mr-1" />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={cancelEditing}
                  disabled={saving}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 transition-colors"
                >
                  <XMarkIcon className="h-4 w-4 mr-1" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {!isEditing ? (
            // View Mode
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <div className="mt-1 text-gray-900">{user.firstName}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <div className="mt-1 text-gray-900">{user.lastName}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="mt-1 text-gray-900">{user.email}</div>
                {user.loginSource === 'systemio' && (
                  <div className="text-xs text-amber-600 mt-1">
                    ⚠️ Email managed by System.io - changes may affect access
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Account Type</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    user.loginSource === 'systemio' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {user.loginSource === 'systemio' ? 'System.io Account' : 'Direct IBAM Account'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {user.loginSource === 'systemio' && (
                  <div className="text-xs text-amber-600 mt-1">
                    ⚠️ Changing email may affect System.io integration
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Bio (Optional)</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Tell us a bit about yourself..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Learning Progress */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
              <AcademicCapIcon className="h-6 w-6 text-blue-600" />
              <span>Your Learning Journey</span>
            </h2>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">
                {user.completedModules} of {user.totalModules} modules completed
              </span>
            </div>
          </div>

          <div className="bg-gray-200 rounded-full h-3 mb-6">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${user.overallProgress}%` }}
            ></div>
          </div>

          <button
            onClick={downloadCourseProgress}
            disabled={downloading === 'progress'}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {downloading === 'progress' ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating Report...</span>
              </>
            ) : (
              <>
                <DocumentArrowDownIcon className="h-5 w-5" />
                <span>Download Complete Course Progress Report</span>
              </>
            )}
          </button>

          {/* Module Certificates */}
          {user.completedModules > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Available Certificates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: user.completedModules }, (_, i) => i + 1).map((moduleId) => (
                  <button
                    key={moduleId}
                    onClick={() => downloadCertificate(moduleId)}
                    disabled={downloading === `cert-${moduleId}`}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <AcademicCapIcon className="h-8 w-8 text-blue-600" />
                      <div>
                        <div className="font-medium text-gray-900">Module {moduleId} Certificate</div>
                        <div className="text-sm text-gray-500">
                          {downloading === `cert-${moduleId}` ? 'Generating...' : 'Ready to download'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Business Plans */}
        {businessPlans.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
                <BuildingOfficeIcon className="h-6 w-6 text-green-600" />
                <span>Your Business Plans</span>
              </h2>
            </div>

            <div className="space-y-4">
              {businessPlans.map((plan) => (
                <div key={plan.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{plan.name}</h3>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-2">
                          <div className="bg-gray-200 rounded-full h-2 w-20">
                            <div 
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${plan.completionPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{plan.completionPercentage}% complete</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <ClockIcon className="h-4 w-4" />
                          <span>Modified {new Date(plan.lastModified).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadBusinessPlan(plan.id, plan.name)}
                      disabled={downloading === plan.id || plan.completionPercentage < 80}
                      className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                    >
                      {downloading === plan.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Generating...</span>
                        </>
                      ) : (
                        <>
                          <DocumentArrowDownIcon className="h-4 w-4" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                  {plan.completionPercentage < 80 && (
                    <p className="text-xs text-amber-600 mt-2">
                      Complete at least 80% of your business plan to download
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}