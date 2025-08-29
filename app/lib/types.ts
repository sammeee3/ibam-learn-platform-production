// ========================================
// EXTRACTED TYPES FROM SESSION PAGE
// ========================================
// This file contains all TypeScript interfaces and types
// previously defined in the massive session page component

// Database Types - Enhanced with new fields
export interface SessionData {
  id: string;
  module_id: number;
  session_number: number;
  title: string;
  subtitle?: string;
  becoming_gods_entrepreneur?: { video_url?: string | null; };
  content?: {
    written_curriculum?: {
      main_content?: string;
      quick_version?: {
        chunks?: ReadingChunk[];
      };
    };
    look_back?: {
      vision_statement?: string;
      reflection_questions?: string[];
      is_first_session?: boolean;
      previous_actions?: PreviousAction[];
      previous_sharing_commitment?: string;
    };
    look_forward?: {
      commitment_prompt?: string;
      application_questions?: string[];
      multiplication_challenges?: string[];
    };
    case_study?: {
      title: string;
      challenge: string;
      strategy: string;
      results: string;
    };
    growing_wealth?: {
      main_content?: string;
      video_url?: string | null;
    };
    growing_people?: {
      main_content?: string;
      video_url?: string | null;
    };
    quiz_questions?: any[];
    faq_questions?: any[];
    coaching_questions?: any[];
  };
  scripture_reference?: string;
  video_url?: string | null;
  case_study?: {
    title: string;
    challenge: string;
    strategy: string;
    results: string;
  };
  business_plan_questions?: string[];
  faq_questions?: string[];
  transformation_promise?: string;
  resources?: {
    books?: { title: string; author: string; url: string; description?: string; }[];
    websites?: { title: string; url: string; description?: string; }[];
    articles?: { title: string; url: string; description?: string; }[];
    videos?: { title: string; url: string; description?: string; }[];
    downloads?: { title: string; url: string; description?: string; }[];
  };
  created_at: string;
  updated_at: string;
}

export interface SessionPageProps {
  params: {
    moduleId: string;
    sessionId: string;
  };
}

// Reading Chunk Interface
export interface ReadingChunk {
  id: string;
  title: string;
  content: string;
  key_thought: string;
  summary: string;
  task_questions: string[];
  time: string;
  order: number;
}

// Enhanced Action Commitment Interface
export interface ActionCommitment {
  id: string;
  type: 'business' | 'discipleship';
  smartData: {
    specific: string;
    measurable?: string;
    ministryMinded?: string;
    achievable: string;
    relevant?: string;
    relational?: string;
    timed: string;
  };
  generatedStatement: string;
  completed: boolean;
  completionNotes?: string;
  learningReflection?: string;
  impactAssessment?: string;
  obstacleIdentification?: string;
}

// Previous Action Interface
export interface PreviousAction {
  id: string;
  type: 'business' | 'discipleship';
  statement: string;
  completion_percentage: number;
  completed_status: null | number;
  failure_reason: string;
  lesson_learned: string;
}

// AI Message Interface
export interface AIMessage {
  type: 'user' | 'ai';
  content: string;
  followUp?: string;
}

// Action Step Interface (Database format)
export interface ActionStep {
  id: string;
  user_id?: string;
  session_id: string;
  module_id: number;
  session_number: number;
  type: 'business' | 'discipleship';
  specific: string;
  measurable?: string;
  ministryMinded?: string;
  achievable: string;
  relevant?: string;
  relational?: string;
  timed: string;
  generated_statement: string;
  person_to_tell: string;
  completed: boolean;
  completion_notes?: string;
  learning_reflection?: string;
  created_at: string;
  // New SMART Action Coaching fields
  quality_score?: number;
  coaching_level?: 'foundation' | 'refinement' | 'integration' | 'mastery';
  sharing_commitment?: string;
  completed_at?: string;
}

// Pathway Mode Type
export type PathwayMode = 'individual' | 'small_group';

// Section Completion State
export interface SectionCompletionState {
  lookback: boolean;
  lookup: boolean;
  lookforward: boolean;
}

// Looking Up Progress State  
export interface LookingUpProgressState {
  wealth: boolean;
  people: boolean;
  reading: boolean;
  case: boolean;
  integrate: boolean;
  coaching: boolean;
  practice: boolean;
  resources: boolean;
}

// Auto-save Hook Return Type
export interface AutoSaveHookReturn {
  saveStatus: 'idle' | 'saving' | 'saved' | 'error';
  lastSaved: Date | null;
  saveNow: () => Promise<void>;
}