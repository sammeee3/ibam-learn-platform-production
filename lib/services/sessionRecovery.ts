/**
 * SESSION RECOVERY & NETWORK RESILIENCE SERVICE
 * Handles network interruptions, auto-save, offline capabilities
 * Enterprise-grade user experience protection
 */

interface SessionState {
  userId: string;
  moduleId: number;
  sessionId: number;
  currentSection: string;
  sectionProgress: Record<string, any>;
  formData: Record<string, any>;
  lastSaved: string;
  isOnline: boolean;
  pendingChanges: boolean;
}

interface QueuedOperation {
  id: string;
  type: 'progress_update' | 'form_save' | 'section_complete';
  data: any;
  timestamp: string;
  retryCount: number;
  maxRetries: number;
}

class SessionRecoveryService {
  private sessionState: SessionState | null = null;
  private operationQueue: QueuedOperation[] = [];
  private autoSaveInterval: NodeJS.Timeout | null = null;
  private onlineStatusInterval: NodeJS.Timeout | null = null;
  private networkRetryTimeout: NodeJS.Timeout | null = null;
  
  private readonly AUTO_SAVE_INTERVAL = 30000; // 30 seconds
  private readonly NETWORK_CHECK_INTERVAL = 5000; // 5 seconds
  private readonly MAX_RETRY_ATTEMPTS = 5;
  private readonly STORAGE_KEY = 'ibam_session_recovery';
  private readonly QUEUE_KEY = 'ibam_operation_queue';

  private eventListeners: Record<string, ((data: any) => void)[]> = {};

  constructor() {
    this.initializeService();
  }

  /**
   * Initialize the session recovery service
   */
  private initializeService(): void {
    // Load previous session state on startup
    this.loadSessionState();
    this.loadOperationQueue();

    // Set up network monitoring
    this.setupNetworkMonitoring();

    // Set up auto-save
    this.startAutoSave();

    // Set up beforeunload handler for graceful shutdown
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
      
      // Handle page visibility changes (tab switching)
      document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    }
  }

  /**
   * Start a new session with recovery capabilities
   */
  startSession(userId: string, moduleId: number, sessionId: number): void {
    this.sessionState = {
      userId,
      moduleId,
      sessionId,
      currentSection: 'intro',
      sectionProgress: {},
      formData: {},
      lastSaved: new Date().toISOString(),
      isOnline: navigator.onLine,
      pendingChanges: false
    };

    this.saveSessionState();
    this.emit('session_started', this.sessionState);

    // Process any queued operations from previous sessions
    this.processOperationQueue();
  }

  /**
   * Update session progress with auto-recovery
   */
  updateProgress(section: string, data: any): void {
    if (!this.sessionState) return;

    this.sessionState.currentSection = section;
    this.sessionState.sectionProgress[section] = {
      ...this.sessionState.sectionProgress[section],
      ...data,
      lastUpdated: new Date().toISOString()
    };
    this.sessionState.pendingChanges = true;

    this.saveSessionState();

    // Queue the operation
    this.queueOperation({
      id: `progress_${Date.now()}`,
      type: 'progress_update',
      data: {
        userId: this.sessionState.userId,
        moduleId: this.sessionState.moduleId,
        sessionId: this.sessionState.sessionId,
        section,
        progress: data
      },
      timestamp: new Date().toISOString(),
      retryCount: 0,
      maxRetries: this.MAX_RETRY_ATTEMPTS
    });

    this.emit('progress_updated', { section, data });
  }

  /**
   * Save form data with recovery support
   */
  saveFormData(formId: string, data: any): void {
    if (!this.sessionState) return;

    this.sessionState.formData[formId] = {
      ...data,
      lastSaved: new Date().toISOString()
    };
    this.sessionState.pendingChanges = true;

    this.saveSessionState();

    // Queue the operation
    this.queueOperation({
      id: `form_${formId}_${Date.now()}`,
      type: 'form_save',
      data: {
        formId,
        formData: data,
        userId: this.sessionState.userId
      },
      timestamp: new Date().toISOString(),
      retryCount: 0,
      maxRetries: this.MAX_RETRY_ATTEMPTS
    });

    this.emit('form_saved', { formId, data });
  }

  /**
   * Mark section as completed with recovery
   */
  completeSection(section: string): void {
    if (!this.sessionState) return;

    this.sessionState.sectionProgress[section] = {
      ...this.sessionState.sectionProgress[section],
      completed: true,
      completedAt: new Date().toISOString()
    };
    this.sessionState.pendingChanges = true;

    this.saveSessionState();

    // Queue the operation
    this.queueOperation({
      id: `complete_${section}_${Date.now()}`,
      type: 'section_complete',
      data: {
        userId: this.sessionState.userId,
        moduleId: this.sessionState.moduleId,
        sessionId: this.sessionState.sessionId,
        section,
        completedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString(),
      retryCount: 0,
      maxRetries: this.MAX_RETRY_ATTEMPTS
    });

    this.emit('section_completed', { section });
  }

  /**
   * Get current session state for recovery
   */
  getSessionState(): SessionState | null {
    return this.sessionState;
  }

  /**
   * Recover from previous session
   */
  recoverSession(): SessionState | null {
    const recovered = this.loadSessionState();
    if (recovered) {
      this.emit('session_recovered', recovered);
      // Show recovery notification to user
      this.showRecoveryNotification(recovered);
    }
    return recovered;
  }

  /**
   * Check if there are pending changes that need saving
   */
  hasPendingChanges(): boolean {
    return this.sessionState?.pendingChanges || false;
  }

  /**
   * Force save all pending changes
   */
  async forceSave(): Promise<boolean> {
    if (!this.sessionState?.pendingChanges) return true;

    try {
      await this.processOperationQueue();
      this.sessionState.pendingChanges = false;
      this.sessionState.lastSaved = new Date().toISOString();
      this.saveSessionState();
      
      this.emit('force_save_complete', { success: true });
      return true;
    } catch (error) {
      console.error('Force save failed:', error);
      this.emit('force_save_complete', { success: false, error });
      return false;
    }
  }

  /**
   * Clear session data (on successful completion)
   */
  clearSession(): void {
    this.sessionState = null;
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.QUEUE_KEY);
    
    this.emit('session_cleared', {});
  }

  /**
   * Set up network monitoring
   */
  private setupNetworkMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Online/offline event listeners
    window.addEventListener('online', () => {
      console.log('🌐 Network connection restored');
      this.handleNetworkRestore();
    });

    window.addEventListener('offline', () => {
      console.log('📡 Network connection lost');
      this.handleNetworkLoss();
    });

    // Periodic connectivity check
    this.onlineStatusInterval = setInterval(() => {
      this.checkNetworkStatus();
    }, this.NETWORK_CHECK_INTERVAL);
  }

  /**
   * Handle network restoration
   */
  private async handleNetworkRestore(): Promise<void> {
    if (this.sessionState) {
      this.sessionState.isOnline = true;
      this.saveSessionState();
    }

    this.emit('network_restored', {});

    // Process queued operations
    await this.processOperationQueue();

    // Show success notification
    this.showNetworkNotification('Connection restored. Syncing your progress...', 'success');
  }

  /**
   * Handle network loss
   */
  private handleNetworkLoss(): void {
    if (this.sessionState) {
      this.sessionState.isOnline = false;
      this.saveSessionState();
    }

    this.emit('network_lost', {});
    this.showNetworkNotification('Connection lost. Your progress will be saved automatically when connection is restored.', 'warning');
  }

  /**
   * Check network status with API ping
   */
  private async checkNetworkStatus(): Promise<void> {
    try {
      const response = await fetch('/api/health', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      const isOnline = response.ok;
      const wasOnline = this.sessionState?.isOnline;

      if (this.sessionState) {
        this.sessionState.isOnline = isOnline;
      }

      // Trigger events on status change
      if (wasOnline === false && isOnline) {
        this.handleNetworkRestore();
      } else if (wasOnline === true && !isOnline) {
        this.handleNetworkLoss();
      }

    } catch (error) {
      // Network is likely down
      if (this.sessionState?.isOnline) {
        this.handleNetworkLoss();
      }
    }
  }

  /**
   * Start auto-save functionality
   */
  private startAutoSave(): void {
    this.autoSaveInterval = setInterval(() => {
      if (this.sessionState?.pendingChanges && this.sessionState.isOnline) {
        this.processOperationQueue();
      }
    }, this.AUTO_SAVE_INTERVAL);
  }

  /**
   * Queue an operation for processing
   */
  private queueOperation(operation: QueuedOperation): void {
    this.operationQueue.push(operation);
    this.saveOperationQueue();

    // Try to process immediately if online
    if (this.sessionState?.isOnline) {
      this.processOperationQueue();
    }
  }

  /**
   * Process all queued operations
   */
  private async processOperationQueue(): Promise<void> {
    if (this.operationQueue.length === 0) return;
    if (!this.sessionState?.isOnline) return;

    const operations = [...this.operationQueue];
    const processed: string[] = [];
    const failed: QueuedOperation[] = [];

    for (const operation of operations) {
      try {
        await this.executeOperation(operation);
        processed.push(operation.id);
        console.log(`✅ Operation processed: ${operation.type} - ${operation.id}`);
        
      } catch (error) {
        console.error(`❌ Operation failed: ${operation.type} - ${operation.id}`, error);
        
        operation.retryCount++;
        if (operation.retryCount < operation.maxRetries) {
          failed.push(operation);
        } else {
          console.warn(`🚫 Operation abandoned after ${operation.maxRetries} retries: ${operation.id}`);
        }
      }
    }

    // Remove processed operations
    this.operationQueue = this.operationQueue.filter(op => !processed.includes(op.id));
    
    // Re-add failed operations that haven't exceeded retry limit
    this.operationQueue.push(...failed);
    
    this.saveOperationQueue();

    if (processed.length > 0) {
      this.emit('operations_processed', { processed: processed.length, failed: failed.length });
    }
  }

  /**
   * Execute a single operation
   */
  private async executeOperation(operation: QueuedOperation): Promise<void> {
    const { type, data } = operation;

    switch (type) {
      case 'progress_update':
        await fetch('/api/progress/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        break;

      case 'form_save':
        await fetch('/api/forms/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        break;

      case 'section_complete':
        await fetch('/api/progress/complete-section', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        break;

      default:
        throw new Error(`Unknown operation type: ${type}`);
    }
  }

  /**
   * Save session state to localStorage
   */
  private saveSessionState(): void {
    if (!this.sessionState) return;
    
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.sessionState));
    } catch (error) {
      console.error('Failed to save session state:', error);
    }
  }

  /**
   * Load session state from localStorage
   */
  private loadSessionState(): SessionState | null {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.sessionState = JSON.parse(saved);
        return this.sessionState;
      }
    } catch (error) {
      console.error('Failed to load session state:', error);
    }
    return null;
  }

  /**
   * Save operation queue to localStorage
   */
  private saveOperationQueue(): void {
    try {
      localStorage.setItem(this.QUEUE_KEY, JSON.stringify(this.operationQueue));
    } catch (error) {
      console.error('Failed to save operation queue:', error);
    }
  }

  /**
   * Load operation queue from localStorage
   */
  private loadOperationQueue(): void {
    try {
      const saved = localStorage.getItem(this.QUEUE_KEY);
      if (saved) {
        this.operationQueue = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Failed to load operation queue:', error);
      this.operationQueue = [];
    }
  }

  /**
   * Handle page unload gracefully
   */
  private handleBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.sessionState?.pendingChanges) {
      const message = 'You have unsaved changes. Are you sure you want to leave?';
      event.returnValue = message;
      // Note: return statement not needed for void function
    }
  }

  /**
   * Handle page visibility changes
   */
  private handleVisibilityChange(): void {
    if (document.hidden) {
      // Page is hidden - save current state
      if (this.sessionState?.pendingChanges) {
        this.forceSave();
      }
    } else {
      // Page is visible - check for updates
      this.checkNetworkStatus();
    }
  }

  /**
   * Show recovery notification to user
   */
  private showRecoveryNotification(sessionState: SessionState): void {
    const message = `Session recovered! Your progress from ${new Date(sessionState.lastSaved).toLocaleString()} has been restored.`;
    this.showNotification(message, 'success');
  }

  /**
   * Show network status notification
   */
  private showNetworkNotification(message: string, type: 'success' | 'warning' | 'error'): void {
    this.showNotification(message, type);
  }

  /**
   * Generic notification display
   */
  private showNotification(message: string, type: 'success' | 'warning' | 'error'): void {
    // This would integrate with your notification system
    this.emit('notification', { message, type });
  }

  /**
   * Event system for component integration
   */
  on(event: string, callback: (data: any) => void): void {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  /**
   * Remove event listener
   */
  off(event: string, callback: (data: any) => void): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    }
  }

  /**
   * Emit event to listeners
   */
  private emit(event: string, data: any): void {
    if (this.eventListeners[event]) {
      this.eventListeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.autoSaveInterval) clearInterval(this.autoSaveInterval);
    if (this.onlineStatusInterval) clearInterval(this.onlineStatusInterval);
    if (this.networkRetryTimeout) clearTimeout(this.networkRetryTimeout);
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
      window.removeEventListener('online', this.handleNetworkRestore);
      window.removeEventListener('offline', this.handleNetworkLoss);
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }

    this.eventListeners = {};
  }
}

// Export singleton instance
export const sessionRecovery = new SessionRecoveryService();

// Export types for component use
export type { SessionState, QueuedOperation };