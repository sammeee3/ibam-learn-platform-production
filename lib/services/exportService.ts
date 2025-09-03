import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';

/**
 * ENTERPRISE-GRADE EXPORT SERVICE
 * Handles PDF certificates, progress reports, business plan exports
 * Security-first implementation with user data protection
 */

export interface UserProgress {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  modules: ModuleProgress[];
  overallCompletion: number;
  totalTimeSpent: number;
  completedAt?: string;
}

export interface ModuleProgress {
  moduleId: number;
  moduleName: string;
  completion: number;
  sessionsCompleted: number;
  totalSessions: number;
  timeSpent: number;
  completedAt?: string;
  sessions: SessionProgress[];
}

export interface SessionProgress {
  sessionId: number;
  sessionName: string;
  completion: number;
  sections: {
    lookback: boolean;
    lookup: boolean;
    lookforward: boolean;
    assessment: boolean;
  };
  timeSpent: number;
  quizScore?: number;
}

export interface BusinessPlanData {
  userId: string;
  email: string;
  planName: string;
  sections: {
    businessBasics: any;
    faithDriven: any;
    marketAnalysis: any;
    financialPlanning: any;
    operations: any;
    legal: any;
    riskManagement: any;
    implementation: any;
  };
  createdAt: string;
  lastModified: string;
}

class ExportService {
  private readonly COMPANY_LOGO = '/images/branding/ibam-logo.png';
  private readonly BRAND_COLOR = '#2563eb';
  private readonly SECONDARY_COLOR = '#64748b';

  /**
   * Generate PDF Certificate for Module Completion
   */
  async generateCertificate(userProgress: UserProgress, moduleId: number): Promise<Blob> {
    const module = userProgress.modules.find(m => m.moduleId === moduleId);
    
    if (!module || module.completion < 100) {
      throw new Error('Module not completed - certificate cannot be generated');
    }

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Certificate background and styling
    pdf.setFillColor(248, 250, 252); // Light blue background
    pdf.rect(0, 0, 297, 210, 'F');

    // Add decorative border
    pdf.setDrawColor(37, 99, 235);
    pdf.setLineWidth(2);
    pdf.rect(15, 15, 267, 180);
    
    // Inner border
    pdf.setLineWidth(0.5);
    pdf.rect(20, 20, 257, 170);

    // IBAM Logo (placeholder - would load actual logo)
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(37, 99, 235);
    pdf.text('IBAM', 40, 45);

    // Certificate title
    pdf.setFontSize(36);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    pdf.text('CERTIFICATE OF COMPLETION', 148.5, 70, { align: 'center' });

    // Subtitle
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    pdf.text('International Business As Mission', 148.5, 85, { align: 'center' });

    // Recipient name
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(0, 0, 0);
    const fullName = `${userProgress.firstName} ${userProgress.lastName}`.trim();
    pdf.text(fullName, 148.5, 110, { align: 'center' });

    // Certificate text
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text('has successfully completed', 148.5, 125, { align: 'center' });

    // Module name
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(37, 99, 235);
    pdf.text(module.moduleName, 148.5, 140, { align: 'center' });

    // Completion details
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 116, 139);
    const completionDate = module.completedAt ? new Date(module.completedAt).toLocaleDateString() : new Date().toLocaleDateString();
    pdf.text(`Completed on ${completionDate}`, 148.5, 155, { align: 'center' });
    pdf.text(`Total Study Time: ${Math.round(module.timeSpent / 3600)} hours`, 148.5, 165, { align: 'center' });

    // Signature section
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.5);
    pdf.line(200, 185, 270, 185); // Signature line
    
    pdf.setFontSize(10);
    pdf.text('Jeff Samuelson, Executive Director', 235, 195, { align: 'center' });
    pdf.text('International Business As Mission', 235, 200, { align: 'center' });

    // Certificate ID for verification
    const certificateId = `IBAM-${moduleId}-${userProgress.userId.slice(-6).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Certificate ID: ${certificateId}`, 25, 200);

    return pdf.output('blob');
  }

  /**
   * Generate Comprehensive Progress Report
   */
  async generateProgressReport(userProgress: UserProgress): Promise<Blob> {
    const pdf = new jsPDF();
    let currentY = 20;

    // Header
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(37, 99, 235);
    pdf.text('IBAM Learning Progress Report', 20, currentY);
    
    currentY += 15;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, currentY);
    
    currentY += 20;

    // User Information
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Student Information', 20, currentY);
    currentY += 10;

    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Name: ${userProgress.firstName} ${userProgress.lastName}`, 25, currentY);
    currentY += 6;
    pdf.text(`Email: ${userProgress.email}`, 25, currentY);
    currentY += 6;
    pdf.text(`Overall Completion: ${userProgress.overallCompletion}%`, 25, currentY);
    currentY += 6;
    pdf.text(`Total Study Time: ${Math.round(userProgress.totalTimeSpent / 3600)} hours`, 25, currentY);
    
    currentY += 20;

    // Module Progress
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Module Progress', 20, currentY);
    currentY += 10;

    userProgress.modules.forEach((module, index) => {
      if (currentY > 250) {
        pdf.addPage();
        currentY = 20;
      }

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Module ${module.moduleId}: ${module.moduleName}`, 25, currentY);
      currentY += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Completion: ${module.completion}%`, 30, currentY);
      pdf.text(`Sessions: ${module.sessionsCompleted}/${module.totalSessions}`, 100, currentY);
      pdf.text(`Time: ${Math.round(module.timeSpent / 3600)}h`, 160, currentY);
      
      if (module.completedAt) {
        currentY += 5;
        pdf.text(`Completed: ${new Date(module.completedAt).toLocaleDateString()}`, 30, currentY);
      }
      
      currentY += 15;

      // Session details
      module.sessions.forEach(session => {
        if (currentY > 270) {
          pdf.addPage();
          currentY = 20;
        }

        pdf.setFontSize(9);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`  Session ${session.sessionId}: ${session.sessionName}`, 35, currentY);
        
        const sectionsCompleted = Object.values(session.sections).filter(Boolean).length;
        pdf.text(`${sectionsCompleted}/4 sections`, 140, currentY);
        
        if (session.quizScore !== undefined) {
          pdf.text(`Quiz: ${session.quizScore}%`, 170, currentY);
        }
        
        currentY += 5;
      });

      pdf.setTextColor(0, 0, 0);
      currentY += 10;
    });

    // Footer with generation info
    const pageCount = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`Page ${i} of ${pageCount}`, 20, 290);
      pdf.text('International Business As Mission - Confidential', 105, 290, { align: 'center' });
    }

    return pdf.output('blob');
  }

  /**
   * Generate Business Plan Export (DOCX format)
   */
  async generateBusinessPlan(planData: BusinessPlanData): Promise<Blob> {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Title Page
          new Paragraph({
            children: [
              new TextRun({
                text: planData.planName || "Business Plan",
                bold: true,
                size: 32,
                color: "2563eb"
              }),
            ],
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "Prepared through IBAM Learning Platform",
                size: 24
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 }
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: `Generated: ${new Date().toLocaleDateString()}`,
                size: 20
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 }
          }),

          // Business Basics Section
          new Paragraph({
            children: [
              new TextRun({
                text: "1. Business Basics",
                bold: true,
                size: 28
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          ...this.generateBusinessSectionContent(planData.sections.businessBasics),

          // Faith-Driven Purpose Section
          new Paragraph({
            children: [
              new TextRun({
                text: "2. Faith-Driven Purpose",
                bold: true,
                size: 28
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          ...this.generateBusinessSectionContent(planData.sections.faithDriven),

          // Market Analysis Section
          new Paragraph({
            children: [
              new TextRun({
                text: "3. Market Analysis",
                bold: true,
                size: 28
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          }),

          ...this.generateBusinessSectionContent(planData.sections.marketAnalysis),

          // Continue with other sections...
        ]
      }]
    });

    return await Packer.toBlob(doc);
  }

  /**
   * Helper method to convert business plan data to DOCX paragraphs
   */
  private generateBusinessSectionContent(sectionData: any): Paragraph[] {
    const paragraphs: Paragraph[] = [];

    if (!sectionData) {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: "This section has not been completed yet.", italics: true })],
        spacing: { after: 200 }
      }));
      return paragraphs;
    }

    Object.entries(sectionData).forEach(([key, value]) => {
      if (value && typeof value === 'string' && value.trim()) {
        // Convert camelCase to readable text
        const readableKey = key.replace(/([A-Z])/g, ' $1').toLowerCase();
        const capitalizedKey = readableKey.charAt(0).toUpperCase() + readableKey.slice(1);

        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `${capitalizedKey}:`,
                bold: true,
                size: 24
              }),
            ],
            spacing: { before: 200, after: 100 }
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: value,
                size: 22
              }),
            ],
            spacing: { after: 200 }
          })
        );
      }
    });

    return paragraphs;
  }

  /**
   * Download file with proper security headers
   */
  downloadFile(blob: Blob, filename: string, mimeType: string): void {
    // Security: Validate filename to prevent directory traversal
    const sanitizedFilename = filename.replace(/[^a-z0-9.-]/gi, '_');
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = sanitizedFilename;
    link.style.display = 'none';
    
    // Security: Add CSP-compliant event handling
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
  }

  /**
   * Validate user permissions before export
   */
  async validateExportPermissions(userId: string, dataType: 'progress' | 'certificate' | 'business_plan'): Promise<boolean> {
    // Security check: User can only export their own data
    try {
      const response = await fetch('/api/user/validate-export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, dataType })
      });
      
      return response.ok;
    } catch (error) {
      console.error('Export validation failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const exportService = new ExportService();

// Export types for use in components
export type { UserProgress, ModuleProgress, SessionProgress, BusinessPlanData };