import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SecurityAlert {
  timestamp: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  totalExposures: number;
  threatsCount: number;
  threats: Array<{
    severity: string;
    type: string;
    file?: string;
    details?: string;
    action: string;
    count?: number;
  }>;
  scanMethod: string;
}

/**
 * Send security alert notifications to super admin
 */
export async function sendSecurityAlert(report: SecurityAlert): Promise<void> {
  console.log(`🚨 Sending ${report.riskLevel} security alert...`);

  try {
    // Send email alert for HIGH and CRITICAL issues
    if (report.riskLevel === 'CRITICAL' || report.riskLevel === 'HIGH') {
      await sendEmailAlert(report);
    }

    // Log to security event store
    await logSecurityEvent(report);

    console.log(`✅ Security alert notifications sent successfully`);
  } catch (error) {
    console.error('❌ Failed to send security alert:', error);
    // Don't throw - we don't want notification failures to break the scanner
  }
}

/**
 * Send email alert to super admin
 */
async function sendEmailAlert(report: SecurityAlert): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('⚠️ RESEND_API_KEY not configured - email alerts disabled');
    return;
  }

  const superAdminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@ibam.com';
  const platformUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'https://ibam-learn-platform-staging.vercel.app';

  const subject = `🚨 ${report.riskLevel} Security Alert - IBAM Platform`;
  
  const criticalThreats = report.threats.filter(t => t.severity === 'CRITICAL');
  const highThreats = report.threats.filter(t => t.severity === 'HIGH');

  const emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .alert-header { background: ${report.riskLevel === 'CRITICAL' ? '#dc2626' : '#ea580c'}; color: white; padding: 20px; text-align: center; }
        .threat-item { background: #f8f9fa; padding: 15px; margin: 10px 0; border-left: 4px solid #dc2626; }
        .action-btn { background: #1d4ed8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; }
        .stats { background: #fef2f2; padding: 15px; border: 1px solid #fecaca; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="alert-header">
        <h1>🚨 ${report.riskLevel} Security Alert</h1>
        <p>IBAM Learning Platform Security Scanner</p>
        <p>${new Date(report.timestamp).toLocaleString()}</p>
      </div>

      <div class="stats">
        <h3>Alert Summary:</h3>
        <ul>
          <li><strong>Risk Level:</strong> ${report.riskLevel}</li>
          <li><strong>Total Exposures:</strong> ${report.totalExposures}</li>
          <li><strong>Threats Identified:</strong> ${report.threatsCount}</li>
          <li><strong>Scan Method:</strong> ${report.scanMethod}</li>
        </ul>
      </div>

      ${criticalThreats.length > 0 ? `
        <h3>🔴 CRITICAL Threats (Immediate Action Required):</h3>
        ${criticalThreats.map(threat => `
          <div class="threat-item">
            <strong>${threat.type}</strong><br>
            ${threat.file ? `<em>File: ${threat.file}</em><br>` : ''}
            ${threat.details ? `<p>${threat.details}</p>` : ''}
            <strong>Action Required:</strong> ${threat.action}
          </div>
        `).join('')}
      ` : ''}

      ${highThreats.length > 0 ? `
        <h3>🟠 HIGH Priority Threats:</h3>
        ${highThreats.map(threat => `
          <div class="threat-item">
            <strong>${threat.type}</strong><br>
            ${threat.file ? `<em>File: ${threat.file}</em><br>` : ''}
            ${threat.details ? `<p>${threat.details}</p>` : ''}
            <strong>Action Required:</strong> ${threat.action}
          </div>
        `).join('')}
      ` : ''}

      <div style="text-align: center; margin: 30px 0;">
        <a href="${platformUrl}/admin/security" class="action-btn">
          🔒 View Security Dashboard
        </a>
      </div>

      <hr>
      <p><small>
        This is an automated security alert from the IBAM Learning Platform.<br>
        If you believe this alert was sent in error, please check your security dashboard.
      </small></p>
    </body>
    </html>
  `;

  await resend.emails.send({
    from: 'IBAM Security <security@ibam.com>',
    to: [superAdminEmail],
    subject: subject,
    html: emailContent,
  });

  console.log(`📧 Security alert email sent to ${superAdminEmail}`);
}

/**
 * Log security event for audit trail
 */
async function logSecurityEvent(report: SecurityAlert): Promise<void> {
  // In a real implementation, you might store this in a security audit log table
  // For now, we'll use detailed console logging
  
  console.log('🔒 SECURITY EVENT LOGGED:', {
    timestamp: report.timestamp,
    riskLevel: report.riskLevel,
    exposureCount: report.totalExposures,
    threatCount: report.threatsCount,
    scanMethod: report.scanMethod,
    criticalThreats: report.threats.filter(t => t.severity === 'CRITICAL').length,
    highThreats: report.threats.filter(t => t.severity === 'HIGH').length
  });
}

/**
 * Get security alert preferences for admin
 */
export function getAlertSettings() {
  return {
    emailEnabled: !!process.env.RESEND_API_KEY,
    superAdminEmail: process.env.SUPER_ADMIN_EMAIL || 'admin@ibam.com',
    alertThreshold: process.env.SECURITY_ALERT_THRESHOLD || 'HIGH', // CRITICAL, HIGH, MEDIUM, LOW
    immediateAlertLevel: 'CRITICAL',
    emailAlertLevel: 'HIGH'
  };
}