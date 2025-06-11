// lib/supabase.ts - NUCLEAR HARDCODED VERSION
// Bypasses ALL Vercel environment variable issues
import { createClient } from '@supabase/supabase-js'

// HARDCODED - Most reliable database connection possible
const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODk0MTksImV4cCI6MjA2NDU2NTQxOX0.-TI2kjnGM27QYM0BfBSogGf8A17VRxNlydoRYmnGmn8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Rock-solid database helpers for your existing schema
export const dbHelpers = {
    // User Profile Operations (using your 'profiles' table)
    async createUserProfile(email: string, fullName: string, subscriptionTier: string = 'Individual Business Member') {
        const { data, error } = await supabase
            .from('profiles')
            .insert([{
                email,
                full_name: fullName,
                subscription_tier: subscriptionTier,
                subscription_status: 'active',
                onboarding_completed: false,
                assessment_completed: false,
                current_course_module: 1
            }])
            .select()
            .single()

        if (error) throw error
        return data
    },

    async getUserProfile(email: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', email)
            .single()

        if (error && error.code !== 'PGRST116') throw error
        return data
    },

    async updateUserProfile(email: string, updates: any) {
        const { data, error } = await supabase
            .from('profiles')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('email', email)
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Session Progress Operations (using your 'user_lesson_progress' table)
    async getSessionProgress(profileId: string, lessonId: string) {
        const { data, error } = await supabase
            .from('user_lesson_progress')
            .select('*')
            .eq('profile_id', profileId)
            .eq('lesson_id', lessonId)
            .single()

        if (error && error.code !== 'PGRST116') throw error
        return data
    },

    async updateSessionProgress(profileId: string, lessonId: string, progressData: any) {
        const { data, error } = await supabase
            .from('user_lesson_progress')
            .upsert({
                profile_id: profileId,
                lesson_id: lessonId,
                ...progressData
            })
            .select()
            .single()

        if (error) throw error
        return data
    },

    async getAllUserProgress(profileId: string) {
        const { data, error } = await supabase
            .from('user_lesson_progress')
            .select('*')
            .eq('profile_id', profileId)

        if (error) throw error
        return data || []
    },

    // Business Plan Operations (using your existing 'business_plans' table)
    async createBusinessPlan(profileId: string, businessName: string, businessType: string = 'Service') {
        const { data, error } = await supabase
            .from('business_plans')
            .insert([{
                profile_id: profileId,
                business_name: businessName,
                business_type: businessType,
                status: 'draft',
                completion_percentage: 0
            }])
            .select()
            .single()

        if (error) throw error
        return data
    },

    async updateBusinessPlan(planId: string, updates: any) {
        const { data, error } = await supabase
            .from('business_plans')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', planId)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async getUserBusinessPlans(profileId: string) {
        const { data, error } = await supabase
            .from('business_plans')
            .select('*')
            .eq('profile_id', profileId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
    },

    // Update business plan with ministry/kingdom focus
    async updateBusinessPlanMinistry(planId: string, ministryData: any) {
        const { data, error } = await supabase
            .from('business_plans')
            .update({
                kingdom_vision: ministryData.kingdomVision,
                spiritual_calling: ministryData.spiritualCalling,
                stewardship_approach: ministryData.stewardshipApproach,
                updated_at: new Date().toISOString()
            })
            .eq('id', planId)
            .select()
            .single()

        if (error) throw error
        return data
    },

    // Test database connection
    async testConnection() {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('count')
                .limit(1)

            if (error) throw error
            return { success: true, message: 'Database connection successful!' }
        } catch (error) {
            return { success: false, message: `Database error: ${error.message}` }
        }
    }
}

// Real-time subscriptions helper
export const subscriptions = {
    subscribeToUserProgress(profileId: string, callback: any) {
        return supabase
            .channel('user-progress')
            .on('postgres_changes', {
                event: '*',
                schema: 'public', 
                table: 'user_lesson_progress',
                filter: `profile_id=eq.${profileId}`
            }, callback)
            .subscribe()
    },

    subscribeToBusinessPlan(planId: string, callback: any) {
        return supabase
            .channel('business-plan')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'business_plans',
                filter: `id=eq.${planId}`
            }, callback)
            .subscribe()
    }
}