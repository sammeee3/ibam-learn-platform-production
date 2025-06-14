'use client'

import CourseAssessment from '@/components/CourseAssessment'

export default function PostAssessmentPage() {
  // TODO: Load pre-assessment data for comparison
  const preAssessmentData = null

  const handleComplete = (data: any) => {
    // TODO: Save to database and show results
    console.log('Post-assessment completed:', data)
    // Redirect to completion page
    window.location.href = '/dashboard'
  }

  return (
    <CourseAssessment 
      type="post" 
      onComplete={handleComplete}
      existingData={preAssessmentData}
    />
  )
}