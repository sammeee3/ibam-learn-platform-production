export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_prompt_usage: {
        Row: {
          created_at: string | null
          id: string
          last_used: string | null
          prompt_id: string | null
          updated_at: string | null
          usage_count: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_used?: string | null
          prompt_id?: string | null
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_used?: string | null
          prompt_id?: string | null
          updated_at?: string | null
          usage_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_prompts: {
        Row: {
          category: string | null
          content: string | null
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      analytics_events: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string | null
          id: string
          ip_address: unknown | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string | null
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string | null
          id?: string
          ip_address?: unknown | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          api_key: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          key_name: string | null
          last_used: string | null
          permissions: Json | null
          user_id: string | null
        }
        Insert: {
          api_key?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name?: string | null
          last_used?: string | null
          permissions?: Json | null
          user_id?: string | null
        }
        Update: {
          api_key?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          key_name?: string | null
          last_used?: string | null
          permissions?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      assessment_comparisons: {
        Row: {
          assessment_id: string | null
          comparison_data: Json | null
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assessment_id?: string | null
          comparison_data?: Json | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assessment_id?: string | null
          comparison_data?: Json | null
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      assessment_responses: {
        Row: {
          assessment_id: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          max_score: number | null
          percentage_score: number | null
          responses: Json | null
          score: number | null
          started_at: string | null
          submission_data: Json | null
          total_score: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assessment_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          max_score?: number | null
          percentage_score?: number | null
          responses?: Json | null
          score?: number | null
          started_at?: string | null
          submission_data?: Json | null
          total_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assessment_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          max_score?: number | null
          percentage_score?: number | null
          responses?: Json | null
          score?: number | null
          started_at?: string | null
          submission_data?: Json | null
          total_score?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      assessments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          questions: Json | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          questions?: Json | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          questions?: Json | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      assessments_backup_july12_2025: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          questions: Json | null
          title: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          questions?: Json | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          questions?: Json | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      assessments_backup_july21_2025: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          questions: Json | null
          title: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          questions?: Json | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          questions?: Json | null
          title?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string | null
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      backup_metadata: {
        Row: {
          backup_date: string | null
          created_at: string | null
          id: string
          record_count: number | null
          table_name: string | null
        }
        Insert: {
          backup_date?: string | null
          created_at?: string | null
          id?: string
          record_count?: number | null
          table_name?: string | null
        }
        Update: {
          backup_date?: string | null
          created_at?: string | null
          id?: string
          record_count?: number | null
          table_name?: string | null
        }
        Relationships: []
      }
      beta_feedback: {
        Row: {
          created_at: string | null
          feedback_text: string | null
          id: string
          rating: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          rating?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      business_plan_sections: {
        Row: {
          business_plan_id: string | null
          content: Json | null
          created_at: string | null
          id: string
          order_index: number | null
          section_name: string | null
          updated_at: string | null
        }
        Insert: {
          business_plan_id?: string | null
          content?: Json | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          section_name?: string | null
          updated_at?: string | null
        }
        Update: {
          business_plan_id?: string | null
          content?: Json | null
          created_at?: string | null
          id?: string
          order_index?: number | null
          section_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      business_plan_sections_backup_july12_2025: {
        Row: {
          business_plan_id: string | null
          content: Json | null
          created_at: string | null
          id: string
          section_name: string | null
        }
        Insert: {
          business_plan_id?: string | null
          content?: Json | null
          created_at?: string | null
          id?: string
          section_name?: string | null
        }
        Update: {
          business_plan_id?: string | null
          content?: Json | null
          created_at?: string | null
          id?: string
          section_name?: string | null
        }
        Relationships: []
      }
      business_plan_sections_backup_july21_2025: {
        Row: {
          business_plan_id: string | null
          content: Json | null
          created_at: string | null
          id: string
          section_name: string | null
        }
        Insert: {
          business_plan_id?: string | null
          content?: Json | null
          created_at?: string | null
          id?: string
          section_name?: string | null
        }
        Update: {
          business_plan_id?: string | null
          content?: Json | null
          created_at?: string | null
          id?: string
          section_name?: string | null
        }
        Relationships: []
      }
      business_plans: {
        Row: {
          created_at: string | null
          id: string
          plan_data: Json | null
          plan_name: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          plan_data?: Json | null
          plan_name?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          plan_data?: Json | null
          plan_name?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      business_plans_backup_july12_2025: {
        Row: {
          created_at: string | null
          id: string
          plan_data: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          plan_data?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          plan_data?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      business_plans_backup_july21_2025: {
        Row: {
          created_at: string | null
          id: string
          plan_data: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          plan_data?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          plan_data?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_type: string | null
          certificate_url: string | null
          course_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          issued_at: string | null
          user_id: string | null
          verification_code: string | null
        }
        Insert: {
          certificate_type?: string | null
          certificate_url?: string | null
          course_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          user_id?: string | null
          verification_code?: string | null
        }
        Update: {
          certificate_type?: string | null
          certificate_url?: string | null
          course_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          user_id?: string | null
          verification_code?: string | null
        }
        Relationships: []
      }
      church_members: {
        Row: {
          church_name: string | null
          created_at: string | null
          id: string
          joined_date: string | null
          role: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          church_name?: string | null
          created_at?: string | null
          id?: string
          joined_date?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          church_name?: string | null
          created_at?: string | null
          id?: string
          joined_date?: string | null
          role?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      churches: {
        Row: {
          address: string | null
          created_at: string | null
          denomination: string | null
          id: string
          name: string | null
          pastor_name: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          denomination?: string | null
          id?: string
          name?: string | null
          pastor_name?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          denomination?: string | null
          id?: string
          name?: string | null
          pastor_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      churches_backup_july12_2025: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          name: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      coaches: {
        Row: {
          availability: Json | null
          bio: string | null
          created_at: string | null
          id: string
          specialization: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          availability?: Json | null
          bio?: string | null
          created_at?: string | null
          id?: string
          specialization?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          availability?: Json | null
          bio?: string | null
          created_at?: string | null
          id?: string
          specialization?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      coaching_sessions: {
        Row: {
          coach_id: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          notes: string | null
          session_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          coach_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          session_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          coach_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          session_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      community_events: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string | null
          event_type: string | null
          id: string
          location: string | null
          max_attendees: number | null
          organizer_id: string | null
          start_time: string | null
          status: string | null
          title: string
          virtual_link: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          location?: string | null
          max_attendees?: number | null
          organizer_id?: string | null
          start_time?: string | null
          status?: string | null
          title: string
          virtual_link?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          location?: string | null
          max_attendees?: number | null
          organizer_id?: string | null
          start_time?: string | null
          status?: string | null
          title?: string
          virtual_link?: string | null
        }
        Relationships: []
      }
      content_bookmarks: {
        Row: {
          content_id: string | null
          content_type: string | null
          created_at: string | null
          id: string
          notes: string | null
          user_id: string | null
        }
        Insert: {
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Update: {
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      content_ratings: {
        Row: {
          content_id: string | null
          content_type: string | null
          created_at: string | null
          helpful_votes: number | null
          id: string
          is_featured: boolean | null
          rating: number | null
          review_text: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          is_featured?: boolean | null
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          is_featured?: boolean | null
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      content_reviews: {
        Row: {
          content_id: string | null
          content_type: string | null
          created_at: string | null
          id: string
          is_approved: boolean | null
          rating: number | null
          review_text: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      content_tag_assignments: {
        Row: {
          content_id: string | null
          content_type: string | null
          created_at: string | null
          id: string
          tag_id: string | null
        }
        Insert: {
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          tag_id?: string | null
        }
        Update: {
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          tag_id?: string | null
        }
        Relationships: []
      }
      content_tags: {
        Row: {
          color_code: string | null
          created_at: string | null
          description: string | null
          id: string
          tag_name: string
          usage_count: number | null
        }
        Insert: {
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          tag_name: string
          usage_count?: number | null
        }
        Update: {
          color_code?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          tag_name?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      course_completion_certificates: {
        Row: {
          certificate_url: string | null
          course_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          issued_at: string | null
          user_id: string | null
          verification_code: string | null
        }
        Insert: {
          certificate_url?: string | null
          course_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          user_id?: string | null
          verification_code?: string | null
        }
        Update: {
          certificate_url?: string | null
          course_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          issued_at?: string | null
          user_id?: string | null
          verification_code?: string | null
        }
        Relationships: []
      }
      course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string | null
          created_at: string | null
          enrolled_at: string | null
          id: string
          progress_percentage: number | null
          started_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          enrolled_at?: string | null
          id?: string
          progress_percentage?: number | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          enrolled_at?: string | null
          id?: string
          progress_percentage?: number | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      course_lessons: {
        Row: {
          content: Json | null
          course_id: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          order_index: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          order_index?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          course_id?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          order_index?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      course_lessons_backup_july12_2025: {
        Row: {
          content: Json | null
          course_id: string | null
          created_at: string | null
          id: string
          title: string | null
        }
        Insert: {
          content?: Json | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
        }
        Update: {
          content?: Json | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
        }
        Relationships: []
      }
      course_lessons_backup_july21_2025: {
        Row: {
          content: Json | null
          course_id: string | null
          created_at: string | null
          id: string
          title: string | null
        }
        Insert: {
          content?: Json | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
        }
        Update: {
          content?: Json | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
        }
        Relationships: []
      }
      course_modules: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          order_index: number | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      course_modules_backup_july12_2025: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          title: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string | null
        }
        Relationships: []
      }
      course_modules_backup_july21_2025: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          id: string
          title: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          title?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          estimated_duration_hours: number | null
          id: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_duration_hours?: number | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_duration_hours?: number | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      discussion_forums: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      discussion_threads: {
        Row: {
          content: string | null
          created_at: string | null
          forum_id: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          last_reply_at: string | null
          last_reply_user_id: string | null
          reply_count: number | null
          title: string
          updated_at: string | null
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          forum_id?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_reply_at?: string | null
          last_reply_user_id?: string | null
          reply_count?: number | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          forum_id?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_reply_at?: string | null
          last_reply_user_id?: string | null
          reply_count?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          clicked_at: string | null
          created_at: string | null
          id: string
          opened_at: string | null
          recipient_email: string | null
          sent_at: string | null
          status: string | null
          subject: string | null
          template_id: string | null
          user_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          created_at?: string | null
          id?: string
          opened_at?: string | null
          recipient_email?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
          user_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          created_at?: string | null
          id?: string
          opened_at?: string | null
          recipient_email?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string | null
          template_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          created_at: string | null
          html_content: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string | null
          template_variables: Json | null
          text_content: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          html_content?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject?: string | null
          template_variables?: Json | null
          text_content?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          html_content?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string | null
          template_variables?: Json | null
          text_content?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      event_attendees: {
        Row: {
          attendance_status: string | null
          checked_in_at: string | null
          event_id: string | null
          id: string
          registration_date: string | null
          user_id: string | null
        }
        Insert: {
          attendance_status?: string | null
          checked_in_at?: string | null
          event_id?: string | null
          id?: string
          registration_date?: string | null
          user_id?: string | null
        }
        Update: {
          attendance_status?: string | null
          checked_in_at?: string | null
          event_id?: string | null
          id?: string
          registration_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      feature_flags: {
        Row: {
          created_at: string | null
          description: string | null
          flag_name: string
          id: string
          is_enabled: boolean | null
          rollout_percentage: number | null
          target_users: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          flag_name: string
          id?: string
          is_enabled?: boolean | null
          rollout_percentage?: number | null
          target_users?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          flag_name?: string
          id?: string
          is_enabled?: boolean | null
          rollout_percentage?: number | null
          target_users?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      feedback_forms: {
        Row: {
          created_at: string | null
          description: string | null
          form_fields: Json | null
          id: string
          is_active: boolean | null
          target_audience: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          form_fields?: Json | null
          id?: string
          is_active?: boolean | null
          target_audience?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          form_fields?: Json | null
          id?: string
          is_active?: boolean | null
          target_audience?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      feedback_responses: {
        Row: {
          form_id: string | null
          id: string
          ip_address: unknown | null
          responses: Json | null
          submitted_at: string | null
          user_id: string | null
        }
        Insert: {
          form_id?: string | null
          id?: string
          ip_address?: unknown | null
          responses?: Json | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Update: {
          form_id?: string | null
          id?: string
          ip_address?: unknown | null
          responses?: Json | null
          submitted_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          content: string | null
          created_at: string | null
          forum_id: string | null
          id: string
          is_pinned: boolean | null
          last_reply_at: string | null
          reply_count: number | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          forum_id?: string | null
          id?: string
          is_pinned?: boolean | null
          last_reply_at?: string | null
          reply_count?: number | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          forum_id?: string | null
          id?: string
          is_pinned?: boolean | null
          last_reply_at?: string | null
          reply_count?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      forum_replies: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_reply_id: string | null
          post_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_reply_id?: string | null
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_reply_id?: string | null
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      integration_settings: {
        Row: {
          api_key: string | null
          api_secret: string | null
          created_at: string | null
          id: string
          integration_name: string
          is_active: boolean | null
          settings: Json | null
          updated_at: string | null
          webhook_url: string | null
        }
        Insert: {
          api_key?: string | null
          api_secret?: string | null
          created_at?: string | null
          id?: string
          integration_name: string
          is_active?: boolean | null
          settings?: Json | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Update: {
          api_key?: string | null
          api_secret?: string | null
          created_at?: string | null
          id?: string
          integration_name?: string
          is_active?: boolean | null
          settings?: Json | null
          updated_at?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      learning_paths: {
        Row: {
          course_sequence: Json | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          estimated_duration_hours: number | null
          id: string
          is_active: boolean | null
          name: string
          prerequisites: Json | null
          updated_at: string | null
        }
        Insert: {
          course_sequence?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_duration_hours?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          prerequisites?: Json | null
          updated_at?: string | null
        }
        Update: {
          course_sequence?: Json | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string | null
          estimated_duration_hours?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          prerequisites?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      learning_progress: {
        Row: {
          completed_at: string | null
          course_id: string | null
          created_at: string | null
          id: string
          module_id: string | null
          notes: string | null
          progress_percentage: number | null
          session_id: string | null
          time_spent_minutes: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          notes?: string | null
          progress_percentage?: number | null
          session_id?: string | null
          time_spent_minutes?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          notes?: string | null
          progress_percentage?: number | null
          session_id?: string | null
          time_spent_minutes?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      magic_tokens: {
        Row: {
          course_id: string | null
          course_name: string | null
          created_at: string | null
          email: string
          expires_at: string
          id: number
          is_active: boolean | null
          token: string
          used_at: string | null
          user_profile_id: number | null
        }
        Insert: {
          course_id?: string | null
          course_name?: string | null
          created_at?: string | null
          email: string
          expires_at: string
          id?: number
          is_active?: boolean | null
          token: string
          used_at?: string | null
          user_profile_id?: number | null
        }
        Update: {
          course_id?: string | null
          course_name?: string | null
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: number
          is_active?: boolean | null
          token?: string
          used_at?: string | null
          user_profile_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "magic_tokens_user_profile_id_fkey"
            columns: ["user_profile_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_requests: {
        Row: {
          created_at: string | null
          id: string
          mentee_id: string | null
          mentor_id: string | null
          message: string | null
          responded_at: string | null
          response_message: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          message?: string | null
          responded_at?: string | null
          response_message?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          message?: string | null
          responded_at?: string | null
          response_message?: string | null
          status?: string | null
        }
        Relationships: []
      }
      mentorship_sessions: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          feedback_mentee: string | null
          feedback_mentor: string | null
          id: string
          mentee_id: string | null
          mentor_id: string | null
          notes: string | null
          session_date: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          feedback_mentee?: string | null
          feedback_mentor?: string | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          notes?: string | null
          session_date?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          feedback_mentee?: string | null
          feedback_mentor?: string | null
          id?: string
          mentee_id?: string | null
          mentor_id?: string | null
          notes?: string | null
          session_date?: string | null
          status?: string | null
        }
        Relationships: []
      }
      module_completions: {
        Row: {
          average_score: number | null
          completed_at: string | null
          created_at: string | null
          id: string
          module_id: string | null
          total_time_spent_minutes: number | null
          user_id: string | null
        }
        Insert: {
          average_score?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          total_time_spent_minutes?: number | null
          user_id?: string | null
        }
        Update: {
          average_score?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          total_time_spent_minutes?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      modules: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          estimated_duration_minutes: number | null
          id: number
          module_number: number | null
          order_index: number | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: number
          module_number?: number | null
          order_index?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: number
          module_number?: number | null
          order_index?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      modules_backup: {
        Row: {
          content: Json | null
          course_id: string | null
          created_at: string | null
          description: string | null
          estimated_duration_minutes: number | null
          id: string | null
          module_number: number | null
          order_index: number | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          content?: Json | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: string | null
          module_number?: number | null
          order_index?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: Json | null
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          estimated_duration_minutes?: number | null
          id?: string | null
          module_number?: number | null
          order_index?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          read_at: string | null
          title: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          title: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          read_at?: string | null
          title?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      payment_history: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          payment_date: string | null
          payment_method: string | null
          payment_status: string | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: string | null
          payment_status?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      prayer_requests: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_anonymous: boolean | null
          is_answered: boolean | null
          prayer_count: number | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_answered?: boolean | null
          prayer_count?: number | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_answered?: boolean | null
          prayer_count?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      prayer_responses: {
        Row: {
          created_at: string | null
          id: string
          is_prayer: boolean | null
          prayer_request_id: string | null
          response_text: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_prayer?: boolean | null
          prayer_request_id?: string | null
          response_text?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_prayer?: boolean | null
          prayer_request_id?: string | null
          response_text?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_answer: string | null
          created_at: string | null
          explanation: string | null
          id: string
          options: Json | null
          order_index: number | null
          points: number | null
          question_text: string
          question_type: string | null
          session_id: string | null
        }
        Insert: {
          correct_answer?: string | null
          created_at?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
          order_index?: number | null
          points?: number | null
          question_text: string
          question_type?: string | null
          session_id?: string | null
        }
        Update: {
          correct_answer?: string | null
          created_at?: string | null
          explanation?: string | null
          id?: string
          options?: Json | null
          order_index?: number | null
          points?: number | null
          question_text?: string
          question_type?: string | null
          session_id?: string | null
        }
        Relationships: []
      }
      quiz_responses: {
        Row: {
          created_at: string | null
          id: string
          is_correct: boolean | null
          question_id: string | null
          selected_answer: string | null
          time_spent_seconds: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          question_id?: string | null
          selected_answer?: string | null
          time_spent_seconds?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          question_id?: string | null
          selected_answer?: string | null
          time_spent_seconds?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      referral_codes: {
        Row: {
          code: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          reward_amount: number | null
          user_id: string | null
          uses_count: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          reward_amount?: number | null
          user_id?: string | null
          uses_count?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          reward_amount?: number | null
          user_id?: string | null
          uses_count?: number | null
        }
        Relationships: []
      }
      referral_transactions: {
        Row: {
          created_at: string | null
          id: string
          processed_at: string | null
          referral_code_id: string | null
          referred_user_id: string | null
          referrer_id: string | null
          reward_amount: number | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          processed_at?: string | null
          referral_code_id?: string | null
          referred_user_id?: string | null
          referrer_id?: string | null
          reward_amount?: number | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          processed_at?: string | null
          referral_code_id?: string | null
          referred_user_id?: string | null
          referrer_id?: string | null
          reward_amount?: number | null
          status?: string | null
        }
        Relationships: []
      }
      resource_library: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          download_count: number | null
          file_url: string | null
          id: string
          is_premium: boolean | null
          resource_type: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          download_count?: number | null
          file_url?: string | null
          id?: string
          is_premium?: boolean | null
          resource_type?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          download_count?: number | null
          file_url?: string | null
          id?: string
          is_premium?: boolean | null
          resource_type?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      session_completions: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          created_at: string | null
          id: string
          notes: string | null
          session_id: string | null
          time_spent_minutes: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          session_id?: string | null
          time_spent_minutes?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          notes?: string | null
          session_id?: string | null
          time_spent_minutes?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      sessions: {
        Row: {
          content: Json | null
          created_at: string | null
          duration_minutes: number | null
          id: number
          is_published: boolean | null
          learning_objectives: string[] | null
          module_id: number | null
          order_index: number | null
          resources: Json | null
          session_number: number | null
          status: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: number
          is_published?: boolean | null
          learning_objectives?: string[] | null
          module_id?: number | null
          order_index?: number | null
          resources?: Json | null
          session_number?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: number
          is_published?: boolean | null
          learning_objectives?: string[] | null
          module_id?: number | null
          order_index?: number | null
          resources?: Json | null
          session_number?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions_backup: {
        Row: {
          content: Json | null
          created_at: string | null
          duration_minutes: number | null
          id: string | null
          is_published: boolean | null
          learning_objectives: string[] | null
          module_id: string | null
          module_number: number | null
          order_index: number | null
          resources: Json | null
          session_number: number | null
          status: string | null
          title: string | null
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string | null
          is_published?: boolean | null
          learning_objectives?: string[] | null
          module_id?: string | null
          module_number?: number | null
          order_index?: number | null
          resources?: Json | null
          session_number?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string | null
          is_published?: boolean | null
          learning_objectives?: string[] | null
          module_id?: string | null
          module_number?: number | null
          order_index?: number | null
          resources?: Json | null
          session_number?: number | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      social_connections: {
        Row: {
          connected_user_id: string | null
          connection_type: string | null
          created_at: string | null
          id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          connected_user_id?: string | null
          connection_type?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          connected_user_id?: string | null
          connection_type?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      study_group_members: {
        Row: {
          id: string
          joined_at: string | null
          role: string | null
          status: string | null
          study_group_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          joined_at?: string | null
          role?: string | null
          status?: string | null
          study_group_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          joined_at?: string | null
          role?: string | null
          status?: string | null
          study_group_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      study_groups: {
        Row: {
          course_id: string | null
          created_at: string | null
          current_members: number | null
          description: string | null
          id: string
          is_public: boolean | null
          leader_id: string | null
          max_members: number | null
          meeting_schedule: string | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          current_members?: number | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          leader_id?: string | null
          max_members?: number | null
          meeting_schedule?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          current_members?: number | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          leader_id?: string | null
          max_members?: number | null
          meeting_schedule?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          description: string | null
          features: Json | null
          id: string
          is_active: boolean | null
          name: string
          price_monthly: number | null
          price_yearly: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          price_monthly?: number | null
          price_yearly?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          features?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_monthly?: number | null
          price_yearly?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          setting_key: string
          setting_type: string | null
          setting_value: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          setting_key?: string
          setting_type?: string | null
          setting_value?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      thread_replies: {
        Row: {
          content: string
          created_at: string | null
          downvotes: number | null
          id: string
          is_solution: boolean | null
          parent_reply_id: string | null
          thread_id: string | null
          updated_at: string | null
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          downvotes?: number | null
          id?: string
          is_solution?: boolean | null
          parent_reply_id?: string | null
          thread_id?: string | null
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          downvotes?: number | null
          id?: string
          is_solution?: boolean | null
          parent_reply_id?: string | null
          thread_id?: string | null
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_name: string | null
          achievement_type: string | null
          badge_url: string | null
          created_at: string | null
          description: string | null
          earned_at: string | null
          id: string
          points_earned: number | null
          user_id: string | null
        }
        Insert: {
          achievement_name?: string | null
          achievement_type?: string | null
          badge_url?: string | null
          created_at?: string | null
          description?: string | null
          earned_at?: string | null
          id?: string
          points_earned?: number | null
          user_id?: string | null
        }
        Update: {
          achievement_name?: string | null
          achievement_type?: string | null
          badge_url?: string | null
          created_at?: string | null
          description?: string | null
          earned_at?: string | null
          id?: string
          points_earned?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_action_steps_backup_july21_2025: {
        Row: {
          action_type: string | null
          created_at: string | null
          id: string
          module_id: number | null
          session_id: number | null
          specific_action: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          action_type?: string | null
          created_at?: string | null
          id?: string
          module_id?: number | null
          session_id?: number | null
          specific_action?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string | null
          created_at?: string | null
          id?: string
          module_id?: number | null
          session_id?: number | null
          specific_action?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_downloads: {
        Row: {
          download_ip: unknown | null
          downloaded_at: string | null
          id: string
          resource_id: string | null
          user_id: string | null
        }
        Insert: {
          download_ip?: unknown | null
          downloaded_at?: string | null
          id?: string
          resource_id?: string | null
          user_id?: string | null
        }
        Update: {
          download_ip?: unknown | null
          downloaded_at?: string | null
          id?: string
          resource_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_learning_paths: {
        Row: {
          completed_at: string | null
          created_at: string | null
          current_course_id: string | null
          id: string
          learning_path_id: string | null
          progress_percentage: number | null
          started_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          current_course_id?: string | null
          id?: string
          learning_path_id?: string | null
          progress_percentage?: number | null
          started_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          current_course_id?: string | null
          id?: string
          learning_path_id?: string | null
          progress_percentage?: number | null
          started_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_notes: {
        Row: {
          content_id: string | null
          content_type: string | null
          created_at: string | null
          id: string
          is_private: boolean | null
          note_text: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          note_text?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content_id?: string | null
          content_type?: string | null
          created_at?: string | null
          id?: string
          is_private?: boolean | null
          note_text?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          email_notifications: boolean | null
          id: string
          language_preference: string | null
          privacy_settings: Json | null
          push_notifications: boolean | null
          theme_preference: string | null
          timezone: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language_preference?: string | null
          privacy_settings?: Json | null
          push_notifications?: boolean | null
          theme_preference?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_notifications?: boolean | null
          id?: string
          language_preference?: string | null
          privacy_settings?: Json | null
          push_notifications?: boolean | null
          theme_preference?: string | null
          timezone?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          address: string | null
          auth_user_id: string | null
          business_name: string | null
          business_stage: string | null
          created_at: string | null
          created_via_webhook: boolean | null
          email: string
          first_name: string | null
          goals: string | null
          has_platform_access: boolean | null
          id: number
          industry: string | null
          is_active: boolean | null
          last_login: string | null
          last_name: string | null
          login_source: string | null
          magic_token: string | null
          magic_token_expires_at: string | null
          onboarding_completed: boolean | null
          phone: string | null
          profile_picture_url: string | null
          subscription_tier: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          auth_user_id?: string | null
          business_name?: string | null
          business_stage?: string | null
          created_at?: string | null
          created_via_webhook?: boolean | null
          email: string
          first_name?: string | null
          goals?: string | null
          has_platform_access?: boolean | null
          id?: number
          industry?: string | null
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          login_source?: string | null
          magic_token?: string | null
          magic_token_expires_at?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          profile_picture_url?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          auth_user_id?: string | null
          business_name?: string | null
          business_stage?: string | null
          created_at?: string | null
          created_via_webhook?: boolean | null
          email?: string
          first_name?: string | null
          goals?: string | null
          has_platform_access?: boolean | null
          id?: number
          industry?: string | null
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          login_source?: string | null
          magic_token?: string | null
          magic_token_expires_at?: string | null
          onboarding_completed?: boolean | null
          phone?: string | null
          profile_picture_url?: string | null
          subscription_tier?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          completion_percentage: number | null
          created_at: string | null
          id: string
          module_id: string | null
          session_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completion_percentage?: number | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          session_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          expires_at: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          session_token: string | null
          started_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token?: string | null
          started_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          expires_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token?: string | null
          started_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string | null
          expires_at: string | null
          id: string
          plan_id: string | null
          started_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          plan_id?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          plan_id?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      webinar_attendees: {
        Row: {
          attended: boolean | null
          created_at: string | null
          id: string
          join_time: string | null
          leave_time: string | null
          registered_at: string | null
          user_id: string | null
          webinar_id: string | null
        }
        Insert: {
          attended?: boolean | null
          created_at?: string | null
          id?: string
          join_time?: string | null
          leave_time?: string | null
          registered_at?: string | null
          user_id?: string | null
          webinar_id?: string | null
        }
        Update: {
          attended?: boolean | null
          created_at?: string | null
          id?: string
          join_time?: string | null
          leave_time?: string | null
          registered_at?: string | null
          user_id?: string | null
          webinar_id?: string | null
        }
        Relationships: []
      }
      webinar_sessions: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          max_attendees: number | null
          meeting_url: string | null
          presenter_id: string | null
          recording_url: string | null
          scheduled_at: string | null
          status: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          max_attendees?: number | null
          meeting_url?: string | null
          presenter_id?: string | null
          recording_url?: string | null
          scheduled_at?: string | null
          status?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          max_attendees?: number | null
          meeting_url?: string | null
          presenter_id?: string | null
          recording_url?: string | null
          scheduled_at?: string | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_session_by_numbers: {
        Args: { mod_num: number; sess_num: number }
        Returns: {
          content: Json
          duration_minutes: number
          id: string
          learning_objectives: string[]
          title: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
