/**
 * Assessment-Integrated Coaching System
 * Personalizes coaching based on pre-assessment responses
 * Links to IBAM_COACHING_KNOWLEDGE for contextualized guidance
 */

import { createClient } from '@supabase/supabase-js';

// Assessment Question IDs and Analysis Framework
export const ASSESSMENT_ANALYSIS = {
  questions: {
    1: { 
      topic: 'faith_business_integration',
      levels: ['beginner', 'exploring', 'practical', 'experienced']
    },
    2: { 
      topic: 'business_experience',
      levels: ['planning', 'startup', 'established', 'experienced']
    },
    3: { 
      topic: 'discipleship_vehicle',
      levels: ['new_concept', 'aware', 'understanding', 'implementing']
    },
    4: { 
      topic: 'primary_motivation',
      focuses: ['start_business', 'integrate_faith', 'multiply_disciples', 'develop_strategies']
    },
    5: { 
      topic: 'business_planning_confidence',
      levels: ['needs_help', 'guidance_needed', 'fairly_confident', 'very_confident']
    },
    6: { 
      topic: 'biblical_financial_principles',
      levels: ['unfamiliar', 'struggles_application', 'some_application', 'strong_application']
    },
    7: { 
      topic: 'community_impact_importance',
      levels: ['not_considered', 'somewhat_important', 'very_important', 'central_mission']
    },
    8: { 
      topic: 'church_business_relationship',
      levels: ['separate_worlds', 'minimal_connection', 'some_integration', 'active_collaboration']
    },
    9: { 
      topic: 'business_challenge_preparedness',
      levels: ['unprepared', 'some_preparation', 'fairly_prepared', 'well_equipped']
    },
    10: { 
      topic: 'kingdom_impact_vision',
      levels: ['financial_success', 'community_service', 'ministry_integration', 'disciple_multiplication']
    }
  }
};

// Coaching Personalization Profiles Based on Assessment Data
export const COACHING_PROFILES = {
  // Faith-Business Integration Level (Question 1)
  faith_business_integration: {
    beginner: {
      approach: "patient_foundation_building",
      language: "gentle_introduction",
      examples: "simple_everyday_applications",
      encouragement: "This is a beautiful journey you're starting! God loves that you want to honor Him in business."
    },
    exploring: {
      approach: "guided_discovery",
      language: "curious_exploration", 
      examples: "relatable_business_scenarios",
      encouragement: "Your curiosity to learn more shows a heart that wants to please God."
    },
    practical: {
      approach: "application_focused",
      language: "strategic_implementation",
      examples: "specific_action_steps",
      encouragement: "You're ready to move from knowledge to action - that's where transformation happens!"
    },
    experienced: {
      approach: "deepening_refinement",
      language: "advanced_integration",
      examples: "complex_business_situations",
      encouragement: "Your experience is a gift! Let's explore how God might use you to mentor others."
    }
  },

  // Business Experience Level (Question 2)  
  business_experience: {
    planning: {
      protection: "extra_caution_against_rushing",
      guidance: "thorough_foundation_building",
      language: "It's wise to plan carefully. Jesus taught about counting the cost (Luke 14:28).",
      focus: "discovery_before_action"
    },
    startup: {
      protection: "avoid_early_stage_mistakes", 
      guidance: "sustainable_growth_focus",
      language: "The early days are crucial for building right. Let's make sure your foundation is solid.",
      focus: "systems_and_processes"
    },
    established: {
      protection: "scaling_challenges_awareness",
      guidance: "optimization_and_growth",
      language: "You've proven the concept. Now let's refine it to honor God more fully.",
      focus: "stewardship_and_impact"
    },
    experienced: {
      protection: "complacency_and_multiplication",
      guidance: "legacy_and_mentoring",
      language: "Your experience is valuable. How might God use you to multiply impact through others?",
      focus: "discipleship_through_business"
    }
  },

  // Primary Motivation (Question 4)
  primary_motivation: {
    start_business: {
      coaching_focus: "foundation_and_planning",
      biblical_emphasis: "stewardship_and_wisdom", 
      action_priority: "careful_preparation",
      language: "Starting a business is like building a house - foundation matters most."
    },
    integrate_faith: {
      coaching_focus: "practical_integration",
      biblical_emphasis: "whole_life_worship",
      action_priority: "daily_practices",
      language: "God wants all of your life, including your business, to bring Him glory."
    },
    multiply_disciples: {
      coaching_focus: "marketplace_ministry",
      biblical_emphasis: "great_commission",
      action_priority: "relationship_building",
      language: "Your business can be a powerful platform for making disciples!"
    },
    develop_strategies: {
      coaching_focus: "strategic_application",
      biblical_emphasis: "wisdom_and_excellence",
      action_priority: "systematic_implementation",
      language: "Combining biblical wisdom with business strategy creates powerful results."
    }
  }
};

// Personalized Coaching Questions Based on Assessment
export const generatePersonalizedQuestions = (assessmentData: any) => {
  const responses = assessmentData.responses || [];
  const personalizedQuestions: any = {};

  responses.forEach((response: any) => {
    const questionId = response.question_id;
    const answerIndex = response.answer_index;
    
    switch(questionId) {
      case 1: // Faith-business integration
        if (answerIndex === 0) { // Beginner
          personalizedQuestions.opening = [
            "What first sparked your interest in connecting your faith with business?",
            "What would it look like if God was honored in every aspect of your work?",
            "What questions do you have about how faith and business can work together?"
          ];
        } else if (answerIndex === 3) { // Experienced
          personalizedQuestions.opening = [
            "What have you learned about integrating faith and business that you'd like to go deeper on?",
            "How has your understanding evolved over time?",
            "What would you tell someone just starting this journey?"
          ];
        }
        break;

      case 2: // Business experience
        if (answerIndex === 0) { // Planning stage
          personalizedQuestions.planning = [
            "What type of business are you considering starting?",
            "What draws you to this particular business idea?",
            "What's your biggest concern about starting a business?",
            "How do you want this business to reflect your faith?"
          ];
        } else if (answerIndex >= 2) { // Established business
          personalizedQuestions.existing = [
            "What's working well in your current business?",
            "Where do you see opportunities to honor God more fully?",
            "What challenges are you facing that could benefit from biblical wisdom?",
            "How are you currently using your business influence?"
          ];
        }
        break;

      case 4: // Primary motivation
        if (answerIndex === 2) { // Multiply disciples
          personalizedQuestions.discipleship = [
            "What opportunities do you see in your business context for making disciples?",
            "How do you currently build relationships with customers, employees, or partners?",
            "What would it look like to intentionally serve others through your business?",
            "Who in your business network might be open to spiritual conversations?"
          ];
        }
        break;
    }
  });

  return personalizedQuestions;
};

// Assessment-Informed Protective Guidance
export const getAssessmentBasedProtection = (assessmentData: any) => {
  const responses = assessmentData.responses || [];
  const protections: string[] = [];

  responses.forEach((response: any) => {
    const questionId = response.question_id;
    const answerIndex = response.answer_index;

    // Business experience + confidence mismatch protection
    if (questionId === 2 && answerIndex === 0) { // Planning stage
      if (responses.find(r => r.question_id === 5 && r.answer_index >= 2)) { // High confidence
        protections.push("enthusiasm_vs_experience_caution");
      }
    }

    // Low biblical financial knowledge protection
    if (questionId === 6 && answerIndex <= 1) { // Unfamiliar or struggling
      protections.push("financial_stewardship_guidance");
    }

    // High community impact vision + low preparedness
    if (questionId === 7 && answerIndex >= 2 && 
        responses.find(r => r.question_id === 9 && r.answer_index <= 1)) {
      protections.push("vision_vs_preparation_balance");
    }
  });

  return protections;
};

// Generate Coaching Context from Assessment
export const getCoachingContextFromAssessment = async (userId: string) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Get pre-assessment data
  const { data: preAssessment } = await supabase
    .from('assessment_responses')
    .select('responses, total_score, completed_at')
    .eq('user_id', userId)
    .eq('assessment_id', 'b77f4b69-8ad4-41aa-8656-6fd1c9e809c7')
    .single();

  if (!preAssessment) {
    return {
      hasAssessment: false,
      coachingApproach: 'generic'
    };
  }

  const responses = preAssessment.responses as any[];
  
  // Analyze key responses for coaching personalization
  const analysisResults = {
    faithBusinessLevel: responses.find(r => r.question_id === 1)?.answer_index || 0,
    businessExperience: responses.find(r => r.question_id === 2)?.answer_index || 0,
    discipleshipFamiliarity: responses.find(r => r.question_id === 3)?.answer_index || 0,
    primaryMotivation: responses.find(r => r.question_id === 4)?.answer_index || 0,
    planningConfidence: responses.find(r => r.question_id === 5)?.answer_index || 0,
    biblicalFinancials: responses.find(r => r.question_id === 6)?.answer_index || 0,
    communityImpact: responses.find(r => r.question_id === 7)?.answer_index || 0,
    churchBusiness: responses.find(r => r.question_id === 8)?.answer_index || 0,
    preparedness: responses.find(r => r.question_id === 9)?.answer_index || 0,
    kingdomVision: responses.find(r => r.question_id === 10)?.answer_index || 0
  };

  return {
    hasAssessment: true,
    assessmentData: preAssessment,
    analysisResults,
    coachingProfile: buildCoachingProfile(analysisResults),
    personalizedQuestions: generatePersonalizedQuestions(preAssessment),
    protectiveGuidance: getAssessmentBasedProtection(preAssessment),
    totalScore: preAssessment.total_score,
    completedDate: preAssessment.completed_at
  };
};

// Build Comprehensive Coaching Profile
function buildCoachingProfile(analysis: any) {
  return {
    experienceLevel: getExperienceLevel(analysis.businessExperience),
    faithIntegrationStage: getFaithIntegrationStage(analysis.faithBusinessLevel),
    motivationalDriver: getMotivationalDriver(analysis.primaryMotivation),
    supportNeeds: getSupportNeeds(analysis),
    riskFactors: getRiskFactors(analysis),
    strengths: getStrengths(analysis),
    coachingApproach: determineCoachingApproach(analysis)
  };
}

function getExperienceLevel(index: number) {
  const levels = ['planning', 'startup', 'established', 'experienced'];
  return levels[index] || 'planning';
}

function getFaithIntegrationStage(index: number) {
  const stages = ['beginner', 'exploring', 'practical', 'experienced'];
  return stages[index] || 'beginner';
}

function getMotivationalDriver(index: number) {
  const drivers = ['start_business', 'integrate_faith', 'multiply_disciples', 'develop_strategies'];
  return drivers[index] || 'start_business';
}

function getSupportNeeds(analysis: any) {
  const needs: string[] = [];
  
  if (analysis.planningConfidence <= 1) needs.push('business_planning');
  if (analysis.biblicalFinancials <= 1) needs.push('financial_stewardship');
  if (analysis.discipleshipFamiliarity <= 1) needs.push('marketplace_ministry');
  if (analysis.preparedness <= 1) needs.push('challenge_preparation');
  
  return needs;
}

function getRiskFactors(analysis: any) {
  const risks: string[] = [];
  
  // High confidence + low experience = overconfidence risk
  if (analysis.planningConfidence >= 2 && analysis.businessExperience === 0) {
    risks.push('overconfidence');
  }
  
  // High vision + low preparation = unrealistic expectations
  if (analysis.communityImpact >= 2 && analysis.preparedness <= 1) {
    risks.push('vision_preparation_gap');
  }
  
  // Low biblical foundation + high business confidence = secular approach risk
  if (analysis.biblicalFinancials <= 1 && analysis.planningConfidence >= 2) {
    risks.push('secular_approach_tendency');
  }
  
  return risks;
}

function getStrengths(analysis: any) {
  const strengths: string[] = [];
  
  if (analysis.faithBusinessLevel >= 2) strengths.push('faith_integration_awareness');
  if (analysis.businessExperience >= 2) strengths.push('business_experience');
  if (analysis.discipleshipFamiliarity >= 2) strengths.push('ministry_mindedness');
  if (analysis.communityImpact >= 2) strengths.push('service_orientation');
  if (analysis.biblicalFinancials >= 2) strengths.push('biblical_financial_understanding');
  
  return strengths;
}

function determineCoachingApproach(analysis: any) {
  // Determine overall coaching approach based on assessment profile
  if (analysis.faithBusinessLevel <= 1 && analysis.businessExperience <= 1) {
    return 'foundational_patient_building';
  } else if (analysis.faithBusinessLevel >= 2 && analysis.businessExperience >= 2) {
    return 'advanced_integration_optimization';
  } else if (analysis.businessExperience >= 2 && analysis.faithBusinessLevel <= 1) {
    return 'faith_integration_for_experienced';
  } else {
    return 'balanced_discovery_guidance';
  }
}

// Export main assessment coaching integration
export const ASSESSMENT_COACHING_INTEGRATION = {
  getCoachingContext: getCoachingContextFromAssessment,
  generatePersonalizedQuestions,
  getProtectiveGuidance: getAssessmentBasedProtection,
  buildProfile: buildCoachingProfile,
  profiles: COACHING_PROFILES
};

export default ASSESSMENT_COACHING_INTEGRATION;