'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SecurityAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

interface SecurityStatus {
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  alerts: SecurityAlert[];
  lastScan: string | null;
  monitoring: boolean;
  repositoryStatus: string;
}

// SUPER ADMIN EMAILS - Must match other admin pages
const SUPER_ADMIN_EMAILS = [
  'sammeee@yahoo.com', // Jeffrey Samuelson
  'jeff@ibamonline.org', // Alternative admin email
];

export default function SecurityDashboard() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    riskLevel: 'LOW',
    alerts: [],
    lastScan: null,
    monitoring: false,
    repositoryStatus: 'Unknown'
  });
  const [scanLoading, setScanLoading] = useState(false);
  const [scanResults, setScanResults] = useState<any>(null);

  useEffect(() => {
    checkAuthorization();
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      loadSecurityStatus();
      // Refresh security status every 30 seconds
      const interval = setInterval(loadSecurityStatus, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthorized]);

  const checkAuthorization = async () => {
    try {
      // For now, assume authorized if accessing admin area
      // In production, implement proper auth check
      const userEmail = 'sammeee@yahoo.com'; // TODO: Get from auth
      
      if (!SUPER_ADMIN_EMAILS.includes(userEmail)) {
        alert('⛔ Security dashboard access restricted. This incident has been logged.');
        router.push('/dashboard');
        return;
      }

      setIsAuthorized(true);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/auth/login?redirect=/admin/security');
    }
  };

  const loadSecurityStatus = async () => {
    setLoading(true);
    console.log('🔄 Refreshing security status...');
    
    try {
      const response = await fetch('/api/security/dashboard');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Dashboard API success:', data);
        
        // Update security status with dashboard data
        setSecurityStatus({
          riskLevel: data.riskLevel || 'LOW',
          alerts: data.alerts || [],
          lastScan: data.lastScan || data.timestamp,
          monitoring: data.monitoring !== false,
          repositoryStatus: data.repositoryStatus || 'Clean'
        });
        
        // Update scan results if available
        if (data.scanResults) {
          console.log('📊 Scan results from dashboard:', data.scanResults);
          setScanResults({
            success: true,
            filesScanned: data.scanResults.filesScanned,
            totalExposures: data.scanResults.totalExposures,
            riskLevel: data.riskLevel || 'LOW',
            repositoryStatus: data.scanResults.status === 'VULNERABLE' ? 
              `${data.scanResults.totalExposures} exposures found` : 'Clean',
            lastScan: data.timestamp,
            threats: data.scanResults.threatsCount || 0
          });
        }
      } else {
        console.warn('❌ Security dashboard API returned:', response.status);
        // Still try to load repository status separately
        await loadRepositoryStatus();
      }
    } catch (error) {
      console.error('❌ Error fetching security status:', error);
      await loadRepositoryStatus();
    } finally {
      setLoading(false);
      console.log('🔄 Security status refresh complete');
    }
  };

  const loadRepositoryStatus = async () => {
    try {
      const response = await fetch('/api/security/scan-repository');
      if (response.ok) {
        const data = await response.json();
        setSecurityStatus(prev => ({
          ...prev,
          riskLevel: data.riskLevel || 'LOW',
          repositoryStatus: data.status === 'VULNERABLE' ? 
            `${data.totalExposures} exposures found` : 'Clean',
          lastScan: data.timestamp,
          monitoring: true
        }));
      }
    } catch (error) {
      console.error('Repository status unavailable:', error);
      setSecurityStatus(prev => ({
        ...prev,
        repositoryStatus: 'Scan Available',
        monitoring: false
      }));
    }
  };

  const runSecurityScan = async () => {
    setScanLoading(true);
    setScanResults(null);
    
    try {
      const response = await fetch('/api/security/scan-repository', {
        method: 'POST'
      });
      
      if (response.ok) {
        const results = await response.json();
        setScanResults({
          success: true,
          status: results.status,
          riskLevel: results.riskLevel,
          totalExposures: results.totalExposures,
          threats: results.threats || [],
          recommendations: results.recommendations || [],
          filesScanned: results.filesScanned
        });
        
        // Update the dashboard status immediately
        setSecurityStatus(prev => ({
          ...prev,
          riskLevel: results.riskLevel || 'LOW',
          repositoryStatus: results.status === 'VULNERABLE' ? 
            `${results.totalExposures} exposures found` : 'Clean',
          lastScan: results.timestamp
        }));
      } else {
        const errorText = await response.text();
        setScanResults({ 
          error: `Scan failed (${response.status}): ${errorText}`,
          success: false 
        });
      }
    } catch (error) {
      setScanResults({ 
        error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        success: false 
      });
    } finally {
      setScanLoading(false);
    }
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-500 text-white animate-pulse';
      case 'HIGH': return 'bg-red-400 text-white';
      case 'MEDIUM': return 'bg-yellow-400 text-black';
      case 'LOW': return 'bg-green-500 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getAlertTypeColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <div className="text-2xl text-gray-800 mb-2">Security Access Required</div>
          <div className="text-gray-600">Verifying authorization...</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <div className="text-xl text-red-600 mt-4">Loading Security Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <Link href="/admin" className="text-blue-600 hover:text-blue-800 text-sm mb-2 inline-block">
                ← Back to Admin Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                🛡️ Security Monitoring Dashboard
              </h1>
              <p className="text-gray-600 mt-1">Real-time security alerts and repository monitoring</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={runSecurityScan}
                disabled={scanLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {scanLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Scanning...
                  </>
                ) : (
                  <>🔍 Run Security Scan</>
                )}
              </button>
              <button
                onClick={loadSecurityStatus}
                disabled={loading}
                className={`px-4 py-2 text-white rounded-lg transition-all ${
                  loading 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <>
                    <span className="animate-spin inline-block mr-2">⟳</span>
                    Refreshing...
                  </>
                ) : (
                  <>🔄 Refresh Status</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Security Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Security Risk Level</p>
                <div className={`inline-block px-4 py-2 rounded-lg font-bold text-lg mt-2 ${getRiskLevelColor(securityStatus.riskLevel)}`}>
                  {securityStatus.riskLevel}
                </div>
              </div>
              <span className={`text-3xl ${securityStatus.riskLevel === 'CRITICAL' ? 'animate-pulse' : ''}`}>
                {securityStatus.riskLevel === 'CRITICAL' ? '🚨' : 
                 securityStatus.riskLevel === 'HIGH' ? '⚠️' : 
                 securityStatus.riskLevel === 'MEDIUM' ? '🟡' : '🟢'}
              </span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Active Alerts</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{securityStatus.alerts.length}</p>
                <p className="text-sm text-orange-600 mt-1">
                  {securityStatus.alerts.filter(a => !a.resolved).length} unresolved
                </p>
              </div>
              <span className="text-3xl">🚨</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Monitoring Status</p>
                <p className={`text-2xl font-bold mt-1 ${securityStatus.monitoring ? 'text-green-600' : 'text-red-600'}`}>
                  {securityStatus.monitoring ? 'ACTIVE' : 'INACTIVE'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {securityStatus.monitoring ? 'Real-time monitoring' : 'Monitoring disabled'}
                </p>
              </div>
              <span className="text-3xl">{securityStatus.monitoring ? '👁️' : '👁️‍🗨️'}</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-600 text-sm">Repository Status</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{securityStatus.repositoryStatus}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {securityStatus.lastScan ? `Last scan: ${new Date(securityStatus.lastScan).toLocaleDateString()}` : 'Never scanned'}
                </p>
              </div>
              <span className="text-3xl">📁</span>
            </div>
          </div>
        </div>

        {/* Scan Results */}
        {scanResults && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🔍 Latest Scan Results</h2>
            {scanResults.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">❌</span>
                  <span className="font-bold text-red-800">Scan Failed</span>
                </div>
                <p className="text-red-800">{scanResults.error}</p>
              </div>
            ) : (
              <div className={`border rounded-lg p-4 ${
                scanResults.riskLevel === 'CRITICAL' ? 'bg-red-50 border-red-200' :
                scanResults.riskLevel === 'HIGH' ? 'bg-orange-50 border-orange-200' :
                scanResults.riskLevel === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200' :
                'bg-green-50 border-green-200'
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">
                    {scanResults.riskLevel === 'CRITICAL' ? '🚨' :
                     scanResults.riskLevel === 'HIGH' ? '⚠️' :
                     scanResults.riskLevel === 'MEDIUM' ? '🟡' : '✅'}
                  </span>
                  <span className={`font-bold ${
                    scanResults.riskLevel === 'CRITICAL' ? 'text-red-800' :
                    scanResults.riskLevel === 'HIGH' ? 'text-orange-800' :
                    scanResults.riskLevel === 'MEDIUM' ? 'text-yellow-800' :
                    'text-green-800'
                  }`}>
                    {scanResults.status === 'VULNERABLE' ? 'Vulnerabilities Found' : 'Repository Secure'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="font-bold text-2xl">{scanResults.filesScanned || 0}</div>
                    <div className="text-sm text-gray-600">Files Scanned</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-2xl">{scanResults.totalExposures || 0}</div>
                    <div className="text-sm text-gray-600">Exposures Found</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-2xl">{scanResults.threats?.length || 0}</div>
                    <div className="text-sm text-gray-600">Threats Identified</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-bold text-2xl px-3 py-1 rounded ${getRiskLevelColor(scanResults.riskLevel || 'LOW')}`}>
                      {scanResults.riskLevel || 'LOW'}
                    </div>
                    <div className="text-sm text-gray-600">Risk Level</div>
                  </div>
                </div>

                {scanResults.threats && scanResults.threats.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-bold mb-2">🚨 Top Security Threats:</h3>
                    <div className="space-y-2">
                      {scanResults.threats.slice(0, 5).map((threat: any, index: number) => (
                        <div key={index} className="bg-white border rounded p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className={`px-2 py-1 rounded text-xs font-bold ${
                                threat.severity === 'CRITICAL' ? 'bg-red-100 text-red-800' :
                                threat.severity === 'HIGH' ? 'bg-orange-100 text-orange-800' :
                                'bg-yellow-100 text-yellow-800'
                              }`}>
                                {threat.severity}
                              </span>
                              <div className="font-medium mt-1">{threat.type}</div>
                              <div className="text-sm text-gray-600">{threat.file}</div>
                            </div>
                            <div className="text-xs text-gray-500">
                              {threat.count > 1 ? `${threat.count} instances` : '1 instance'}
                            </div>
                          </div>
                        </div>
                      ))}
                      {scanResults.threats.length > 5 && (
                        <div className="text-center text-gray-600 text-sm">
                          ... and {scanResults.threats.length - 5} more threats
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {scanResults.recommendations && scanResults.recommendations.length > 0 && (
                  <div className="mt-4">
                    <h3 className="font-bold mb-2">💡 Recommendations:</h3>
                    <div className="space-y-2">
                      {scanResults.recommendations.slice(0, 3).map((rec: any, index: number) => (
                        <div key={index} className="bg-blue-50 border border-blue-200 rounded p-3">
                          <div className="font-medium">{rec.action}</div>
                          <div className="text-sm text-blue-700 mt-1">Priority: {rec.priority}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Security Alerts */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">🚨 Security Alerts</h2>
          {securityStatus.alerts.length === 0 ? (
            <div className="text-center py-12 bg-green-50 rounded-lg">
              <span className="text-6xl">✅</span>
              <h3 className="text-lg font-medium text-green-900 mt-4">No Active Security Alerts</h3>
              <p className="text-green-700">Your system is currently secure with no detected threats.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {securityStatus.alerts.map((alert) => (
                <div key={alert.id} className={`border rounded-lg p-4 ${getAlertTypeColor(alert.type)}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-sm uppercase">{alert.type}</span>
                        {alert.resolved && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">RESOLVED</span>
                        )}
                      </div>
                      <h4 className="font-semibold text-lg mb-2">{alert.title}</h4>
                      <p className="text-sm mb-2">{alert.description}</p>
                      <p className="text-xs opacity-75">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="ml-4">
                      {!alert.resolved && (
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">⚡ Security Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={runSecurityScan}
              disabled={scanLoading}
              className="p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 text-center"
            >
              <div className="text-2xl mb-2">🔍</div>
              <div className="font-medium">Full Repository Scan</div>
              <div className="text-sm opacity-90">Scan for vulnerabilities</div>
            </button>
            
            <button
              onClick={() => {
                setSecurityStatus(prev => ({
                  ...prev,
                  monitoring: !prev.monitoring
                }));
                alert(`Security monitoring ${securityStatus.monitoring ? 'disabled' : 'enabled'}`);
              }}
              className={`p-4 text-white rounded-lg text-center ${
                securityStatus.monitoring ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              <div className="text-2xl mb-2">{securityStatus.monitoring ? '👁️' : '👁️‍🗨️'}</div>
              <div className="font-medium">
                {securityStatus.monitoring ? 'Disable' : 'Enable'} Monitoring
              </div>
              <div className="text-sm opacity-90">
                {securityStatus.monitoring ? 'Stop real-time alerts' : 'Start real-time alerts'}
              </div>
            </button>
            
            <Link
              href="/admin"
              className="p-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-center block"
            >
              <div className="text-2xl mb-2">📋</div>
              <div className="font-medium">View All Logs</div>
              <div className="text-sm opacity-90">Security and activity logs</div>
            </Link>
          </div>
        </div>

        {/* Security Best Practices */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-3">🛡️ Security Best Practices</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-semibold mb-2">✅ Implemented</h4>
              <ul className="space-y-1">
                <li>• HMAC webhook signature validation</li>
                <li>• Rate limiting on API endpoints</li>
                <li>• Security headers implementation</li>
                <li>• Environment variable protection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📋 Recommendations</h4>
              <ul className="space-y-1">
                <li>• Regular security scans (weekly)</li>
                <li>• Monitor failed authentication attempts</li>
                <li>• Keep dependencies updated</li>
                <li>• Review admin access logs regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}