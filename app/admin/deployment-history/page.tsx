'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface DeploymentLog {
  id: number
  version_number: string
  environment: 'staging' | 'production'
  deployment_date: string
  deployed_by?: string
  git_commit_hash?: string
  git_commit_count?: number
  features_added: Array<{
    title: string
    description: string
    impact: string
    commit_hash?: string
  }>
  bugs_fixed: Array<{
    title: string
    description: string
    severity: string
    commit_hash?: string
  }>
  improvements: Array<{
    title: string
    description: string
    impact: string
    commit_hash?: string
  }>
  breaking_changes: Array<{
    title: string
    description: string
    migration_required: boolean
  }>
  database_changes: {
    tables_modified?: string[]
    columns_added?: string[]
    migration_required?: boolean
    migration_sql?: string
  }
  status: 'planned' | 'in_progress' | 'completed' | 'failed' | 'rolled_back'
  rollback_available: boolean
  user_impact_level: 'low' | 'medium' | 'high' | 'critical'
  notes?: string
  deployment_duration_seconds?: number
}

export default function DeploymentHistoryPage() {
  const [deployments, setDeployments] = useState<DeploymentLog[]>([])
  const [loading, setLoading] = useState(true)
  const [environmentFilter, setEnvironmentFilter] = useState<'all' | 'staging' | 'production'>('all')
  const [expandedDeployment, setExpandedDeployment] = useState<number | null>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    fetchDeploymentLogs()
  }, [environmentFilter])

  const fetchDeploymentLogs = async () => {
    try {
      const queryParams = environmentFilter !== 'all' ? `?environment=${environmentFilter}` : ''
      const response = await fetch(`/api/admin/deployment-logs${queryParams}`)
      if (response.ok) {
        const data = await response.json()
        setDeployments(data.deployments || [])
      }
    } catch (error) {
      console.error('Error fetching deployment logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'rolled_back': return 'bg-yellow-100 text-yellow-800'
      case 'planned': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getImpactColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading deployment history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/admin" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-4"
          >
            ← Back to Admin Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">📋 Deployment History</h1>
              <p className="text-gray-600 mt-2">Version tracking and change log management</p>
            </div>
            <Link
              href="/admin/deployment-history/create"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 inline-flex items-center"
            >
              + Add Deployment Log
            </Link>
          </div>
        </div>

        {/* Environment Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Filter by Environment</h2>
            <div className="flex space-x-2">
              {(['all', 'staging', 'production'] as const).map((env) => (
                <button
                  key={env}
                  onClick={() => setEnvironmentFilter(env)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    environmentFilter === env
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {env === 'all' ? 'All Environments' : env.charAt(0).toUpperCase() + env.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Deployment Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Deployments</p>
                <p className="text-2xl font-bold text-gray-900">{deployments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🚀</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Production Version</p>
                <p className="text-2xl font-bold text-gray-900">
                  {deployments.find(d => d.environment === 'production')?.version_number || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">🧪</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Staging Version</p>
                <p className="text-2xl font-bold text-gray-900">
                  {deployments.find(d => d.environment === 'staging')?.version_number || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">⚠️</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Failed Deployments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {deployments.filter(d => d.status === 'failed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deployments List */}
        <div className="space-y-6">
          {deployments.map((deployment) => (
            <div key={deployment.id} className="bg-white rounded-lg shadow">
              {/* Deployment Header */}
              <div 
                className="p-6 border-b cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedDeployment(
                  expandedDeployment === deployment.id ? null : deployment.id
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(deployment.status)}`}>
                        {deployment.status}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {deployment.version_number}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {deployment.environment} • {new Date(deployment.deployment_date).toLocaleDateString()} • 
                        {deployment.deployed_by || 'System'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getImpactColor(deployment.user_impact_level)}`}>
                      {deployment.user_impact_level} impact
                    </span>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>🎯 {deployment.features_added?.length || 0} features</span>
                      <span>🔧 {deployment.bugs_fixed?.length || 0} fixes</span>
                    </div>
                    <span className="text-gray-400">
                      {expandedDeployment === deployment.id ? '▼' : '▶'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Deployment Details */}
              {expandedDeployment === deployment.id && (
                <div className="p-6 bg-gray-50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Features Added */}
                    {deployment.features_added?.length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">🎯 Features Added</h4>
                        <div className="space-y-3">
                          {deployment.features_added.map((feature, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border">
                              <h5 className="font-medium text-gray-900">{feature.title}</h5>
                              <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                              <div className="flex items-center mt-2 space-x-2">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getImpactColor(feature.impact)}`}>
                                  {feature.impact}
                                </span>
                                {feature.commit_hash && (
                                  <span className="text-xs text-gray-500 font-mono">
                                    {feature.commit_hash.substring(0, 8)}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bugs Fixed */}
                    {deployment.bugs_fixed?.length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">🔧 Bugs Fixed</h4>
                        <div className="space-y-3">
                          {deployment.bugs_fixed.map((bug, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border">
                              <h5 className="font-medium text-gray-900">{bug.title}</h5>
                              <p className="text-sm text-gray-600 mt-1">{bug.description}</p>
                              <div className="flex items-center mt-2 space-x-2">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  bug.severity === 'critical' ? 'bg-red-100 text-red-800' :
                                  bug.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                                  bug.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {bug.severity}
                                </span>
                                {bug.commit_hash && (
                                  <span className="text-xs text-gray-500 font-mono">
                                    {bug.commit_hash.substring(0, 8)}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Improvements */}
                    {deployment.improvements?.length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">✨ Improvements</h4>
                        <div className="space-y-3">
                          {deployment.improvements.map((improvement, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg border">
                              <h5 className="font-medium text-gray-900">{improvement.title}</h5>
                              <p className="text-sm text-gray-600 mt-1">{improvement.description}</p>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-2 ${getImpactColor(improvement.impact)}`}>
                                {improvement.impact}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Database Changes */}
                    {deployment.database_changes && Object.keys(deployment.database_changes).length > 0 && (
                      <div>
                        <h4 className="text-md font-semibold text-gray-900 mb-3">🗄️ Database Changes</h4>
                        <div className="bg-white p-4 rounded-lg border">
                          {deployment.database_changes.tables_modified && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-gray-700">Tables Modified:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {deployment.database_changes.tables_modified.map((table, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    {table}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {deployment.database_changes.columns_added && (
                            <div className="mb-2">
                              <span className="text-sm font-medium text-gray-700">Columns Added:</span>
                              <div className="flex flex-wrap gap-2 mt-1">
                                {deployment.database_changes.columns_added.map((column, index) => (
                                  <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    {column}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          {deployment.database_changes.migration_required && (
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                ⚠️ Migration Required
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Additional Info */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Duration:</span>
                        <p className="font-medium">{formatDuration(deployment.deployment_duration_seconds)}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Commits:</span>
                        <p className="font-medium">{deployment.git_commit_count || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Rollback:</span>
                        <p className="font-medium">
                          {deployment.rollback_available ? '✅ Available' : '❌ Not Available'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Git Hash:</span>
                        <p className="font-medium font-mono">
                          {deployment.git_commit_hash ? deployment.git_commit_hash.substring(0, 8) : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    {deployment.notes && (
                      <div className="mt-4">
                        <span className="text-gray-600 text-sm">Notes:</span>
                        <p className="mt-1 text-sm text-gray-700 bg-white p-3 rounded border">
                          {deployment.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {deployments.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deployments found</h3>
            <p className="text-gray-600">Start by adding your first deployment log.</p>
          </div>
        )}
      </div>
    </div>
  )
}