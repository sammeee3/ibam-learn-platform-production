'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ChangeItem {
  title: string
  description: string
  impact?: string
  severity?: string
  commit_hash?: string
}

export default function CreateDeploymentLogPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    version_number: '',
    environment: 'staging' as 'staging' | 'production',
    git_commit_hash: '',
    git_commit_count: 0,
    user_impact_level: 'low' as 'low' | 'medium' | 'high' | 'critical',
    rollback_available: true,
    rollback_commit_hash: '',
    notes: '',
    deployment_duration_seconds: 0
  })

  const [features, setFeatures] = useState<ChangeItem[]>([])
  const [bugs, setBugs] = useState<ChangeItem[]>([])
  const [improvements, setImprovements] = useState<ChangeItem[]>([])
  const [databaseChanges, setDatabaseChanges] = useState({
    tables_modified: [] as string[],
    columns_added: [] as string[],
    migration_required: false,
    migration_sql: ''
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addChangeItem = (type: 'features' | 'bugs' | 'improvements') => {
    const newItem: ChangeItem = {
      title: '',
      description: '',
      impact: type === 'bugs' ? undefined : 'low',
      severity: type === 'bugs' ? 'low' : undefined,
      commit_hash: ''
    }

    switch (type) {
      case 'features':
        setFeatures(prev => [...prev, newItem])
        break
      case 'bugs':
        setBugs(prev => [...prev, newItem])
        break
      case 'improvements':
        setImprovements(prev => [...prev, newItem])
        break
    }
  }

  const updateChangeItem = (type: 'features' | 'bugs' | 'improvements', index: number, field: string, value: string) => {
    const setter = type === 'features' ? setFeatures : type === 'bugs' ? setBugs : setImprovements
    
    setter(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ))
  }

  const removeChangeItem = (type: 'features' | 'bugs' | 'improvements', index: number) => {
    const setter = type === 'features' ? setFeatures : type === 'bugs' ? setBugs : setImprovements
    
    setter(prev => prev.filter((_, i) => i !== index))
  }

  const addDatabaseField = (type: 'tables_modified' | 'columns_added', value: string) => {
    if (!value.trim()) return
    
    setDatabaseChanges(prev => ({
      ...prev,
      [type]: [...prev[type], value.trim()]
    }))
  }

  const removeDatabaseField = (type: 'tables_modified' | 'columns_added', index: number) => {
    setDatabaseChanges(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const deploymentData = {
        ...formData,
        features_added: features.filter(f => f.title.trim()),
        bugs_fixed: bugs.filter(b => b.title.trim()),
        improvements: improvements.filter(i => i.title.trim()),
        database_changes: {
          ...databaseChanges,
          tables_modified: databaseChanges.tables_modified.length > 0 ? databaseChanges.tables_modified : undefined,
          columns_added: databaseChanges.columns_added.length > 0 ? databaseChanges.columns_added : undefined
        }
      }

      const response = await fetch('/api/admin/deployment-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(deploymentData)
      })

      const result = await response.json()

      if (result.success) {
        router.push('/admin/deployment-history?created=true')
      } else {
        alert(`Error: ${result.error}`)
      }

    } catch (error) {
      console.error('Error creating deployment log:', error)
      alert('Failed to create deployment log. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin/deployment-history" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-4"
          >
            ← Back to Deployment History
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">📝 Create Deployment Log</h1>
          <p className="text-gray-600 mt-2">Manually add a deployment log entry</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Version Number *
                </label>
                <input
                  type="text"
                  value={formData.version_number}
                  onChange={(e) => handleInputChange('version_number', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., v2.3.0, v2.3.1-hotfix"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Environment *
                </label>
                <select
                  value={formData.environment}
                  onChange={(e) => handleInputChange('environment', e.target.value as 'staging' | 'production')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Git Commit Hash
                </label>
                <input
                  type="text"
                  value={formData.git_commit_hash}
                  onChange={(e) => handleInputChange('git_commit_hash', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., 69a74491573300cd"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commit Count
                </label>
                <input
                  type="number"
                  value={formData.git_commit_count}
                  onChange={(e) => handleInputChange('git_commit_count', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Impact Level
                </label>
                <select
                  value={formData.user_impact_level}
                  onChange={(e) => handleInputChange('user_impact_level', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deployment Duration (seconds)
                </label>
                <input
                  type="number"
                  value={formData.deployment_duration_seconds}
                  onChange={(e) => handleInputChange('deployment_duration_seconds', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  min="0"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Additional notes about this deployment..."
              />
            </div>
          </div>

          {/* Features Added */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">🎯 Features Added</h2>
              <button
                type="button"
                onClick={() => addChangeItem('features')}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                + Add Feature
              </button>
            </div>

            {features.map((feature, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={feature.title}
                      onChange={(e) => updateChangeItem('features', index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Feature title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Impact</label>
                    <select
                      value={feature.impact || 'low'}
                      onChange={(e) => updateChangeItem('features', index, 'impact', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={feature.description}
                    onChange={(e) => updateChangeItem('features', index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="Feature description"
                  />
                </div>

                <div className="flex justify-between items-center mt-4">
                  <input
                    type="text"
                    value={feature.commit_hash || ''}
                    onChange={(e) => updateChangeItem('features', index, 'commit_hash', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="Commit hash (optional)"
                  />
                  <button
                    type="button"
                    onClick={() => removeChangeItem('features', index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bugs Fixed */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">🔧 Bugs Fixed</h2>
              <button
                type="button"
                onClick={() => addChangeItem('bugs')}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                + Add Bug Fix
              </button>
            </div>

            {bugs.map((bug, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={bug.title}
                      onChange={(e) => updateChangeItem('bugs', index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="Bug fix title"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                    <select
                      value={bug.severity || 'low'}
                      onChange={(e) => updateChangeItem('bugs', index, 'severity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={bug.description}
                    onChange={(e) => updateChangeItem('bugs', index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="Bug fix description"
                  />
                </div>

                <div className="flex justify-between items-center mt-4">
                  <input
                    type="text"
                    value={bug.commit_hash || ''}
                    onChange={(e) => updateChangeItem('bugs', index, 'commit_hash', e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="Commit hash (optional)"
                  />
                  <button
                    type="button"
                    onClick={() => removeChangeItem('bugs', index)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/admin/deployment-history"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !formData.version_number}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Deployment Log'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}