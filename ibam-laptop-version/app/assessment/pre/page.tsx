'use client'

import CourseAssessment from '@/components/CourseAssessment'

export default function PreAssessmentPage() {
  const handleComplete = (data: any) => {
    // TODO: Save to database
    console.log('Pre-assessment completed:', data)
    // Redirect to dashboard
    window.location.href = '/dashboard'
  }

  return (
    <CourseAssessment 
      type="pre" 
      onComplete={handleComplete}
    />
  )
}