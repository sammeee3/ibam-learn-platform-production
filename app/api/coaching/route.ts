/**
 * COACHING API ENDPOINT
 * Handles AI coaching requests with real LLM integration
 * Uses actual IBAM session content from database
 */

import { NextRequest, NextResponse } from 'next/server';
import { simpleAICoaching } from '../../lib/simple-ai-coaching';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { SessionData } from '../../lib/types';

interface CoachingRequest {
  question: string;
  sessionId?: string;
  moduleId?: string;
  userId?: string;
  previousMessages?: Array<{role: string, content: string}>;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Parse request body
    const body: CoachingRequest = await request.json();
    const { question, sessionId, moduleId, userId, previousMessages } = body;

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    // Get user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.log('User not authenticated, proceeding without session context');
    }

    let sessionData: SessionData | undefined = undefined;
    
    // Fetch session data if provided
    if (sessionId && moduleId) {
      try {
        const { data, error } = await supabase
          .from('sessions')
          .select('*')
          .eq('id', sessionId)
          .eq('module_id', moduleId)
          .single();

        if (error) {
          console.error('Error fetching session data:', error);
        } else {
          sessionData = data || undefined;
          console.log('Fetched session data:', {
            title: data?.title || 'Unknown',
            hasContent: !!data?.content,
            contentKeys: data?.content ? Object.keys(data.content) : []
          });
        }
      } catch (error) {
        console.error('Exception fetching session data:', error);
      }
    }

    // Get coaching response from AI service
    const coachingResponse = await simpleAICoaching.getResponse({
      question,
      sessionData
    });

    // Log for debugging
    console.log('Coaching request processed:', {
      question: question.substring(0, 50) + '...',
      hasSessionData: !!sessionData,
      source: coachingResponse.source,
      responseLength: coachingResponse.answer.length
    });

    return NextResponse.json({
      success: true,
      response: coachingResponse.answer,
      source: coachingResponse.source,
      scriptureReferences: coachingResponse.scriptureReferences,
      followUpQuestions: coachingResponse.followUpQuestions,
      metadata: {
        hasSessionContent: !!sessionData?.content,
        sessionTitle: sessionData?.title,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Coaching API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to process coaching request',
      fallbackResponse: `I apologize, but I encountered an error processing your question. However, I'm still here to help!

Your question: "${request.body ? JSON.parse(await request.text()).question : 'Unknown question'}"

As an IBAM coach, I can help you with:
- Biblical business principles and their practical application
- Course content questions and clarification
- Business planning and development guidance
- Ethical business decision-making

Please try rephrasing your question, and I'll do my best to provide helpful guidance based on IBAM's biblical business approach.`
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'IBAM AI Coaching Service',
    version: '2.0',
    features: [
      'Real LLM integration with OpenAI/Anthropic',
      'Actual IBAM session content integration',
      'Theological boundaries and evangelical framework',
      'Biblical business ethics guidance',
      'Fallback knowledge base for reliability'
    ],
    endpoints: {
      POST: 'Submit coaching questions with optional session context'
    }
  });
}