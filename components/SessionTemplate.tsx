'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Check, Play, BookOpen, Target, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface SessionData {
  moduleId: number
  sessionNumber: number
  title: string
  moduleTitle: string
  learningObjective: string
  scriptureReference?: string
  scriptureText?: string
  videoUrl?: string
  content?: string
}

interface SessionTemplateProps {
  sessionData: SessionData
}

export default function SessionTemplate({ sessionData }: SessionTemplateProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [sectionProgress, setSectionProgress] = useState({
    lookBack: false,
    lookUp: false,
    lookForward: false
  })

  const sections = [
    { id: 'lookBack', title: 'Look Back', icon: ChevronLeft, description: 'Accountability & Vision' },
    { id: 'lookUp', title: 'Look Up', icon: BookOpen, description: 'Learning & Scripture' },
    { id: 'lookForward', title: 'Look Forward', icon: Target, description: 'Commitment & Action' }
  ]

  const handleSectionComplete = (sectionId: keyof typeof sectionProgress) => {
    setSectionProgress(prev => ({
      ...prev,
      [sectionId]: true
    }))
  }

  const canProceed = () => {
    return sectionProgress[sections[currentSection].id as keyof typeof sectionProgress]
  }

  const nextSection = () => {
    if (currentSection < sections.length - 1 && canProceed()) {
      setCurrentSection(currentSection + 1)
    }
  }

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const allSectionsComplete = Object.values(sectionProgress).every(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm p-4">
        <div className="max-w-7xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Module {sessionData.moduleId}: {sessionData.moduleTitle}
              </h1>
              <h2 className="text-xl text-blue-600">
                Session {sessionData.moduleId}.{sessionData.sessionNumber}: {sessionData.title}
              </h2>
            </div>
            <div className="text-sm text-gray-600">
              {sessionData.scriptureReference}
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">{sessionData.learningObjective}</p>
          
          {/* Progress Bar */}
          <div className="flex space-x-4">
            {sections.map((section, index) => {
              const Icon = section.icon
              const isActive = index === currentSection
              const isCompleted = sectionProgress[section.id as keyof typeof sectionProgress]
              
              return (
                <div key={section.id} className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg transition-all cursor-pointer
                  ${isActive ? 'bg-blue-600 text-white' : 
                    isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}
                `} onClick={() => setCurrentSection(index)}>
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                  <span className="font-medium">{section.title}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-8">
              {currentSection === 0 && (
                <LookBackSection 
                  sessionData={sessionData}
                  onComplete={() => handleSectionComplete('lookBack')}
                />
              )}
              
              {currentSection === 1 && (
                <LookUpSection 
                  sessionData={sessionData}
                  onComplete={() => handleSectionComplete('lookUp')}
                />
              )}
              
              {currentSection === 2 && (
                <LookForwardSection 
                  sessionData={sessionData}
                  onComplete={() => handleSectionComplete('lookForward')}
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="font-semibold text-gray-800 mb-4">Progress</h3>
              <div className="space-y-3">
                {sections.map((section, index) => (
                  <div key={section.id} className="flex items-center justify-between">
                    <span className="text-sm">{section.title}</span>
                    {sectionProgress[section.id as keyof typeof sectionProgress] ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-3">
                <button
                  onClick={prevSection}
                  disabled={currentSection === 0}
                  className="w-full bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 py-2 px-4 rounded-lg transition-colors"
                >
                  Previous
                </button>
                
                {currentSection === sections.length - 1 ? (
                  <button
                    disabled={!allSectionsComplete}
                    className={`w-full py-2 px-4 rounded-lg transition-colors ${
                      allSectionsComplete 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {allSectionsComplete ? '🎉 Session Complete!' : 'Complete All Sections'}
                  </button>
                ) : (
                  <button
                    onClick={nextSection}
                    disabled={!canProceed()}
                    className={`w-full py-2 px-4 rounded-lg transition-colors ${
                      canProceed() 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Continue
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Look Back Section Component
interface LookBackSectionProps {
  sessionData: SessionData
  onComplete: () => void
}

function LookBackSection({ sessionData, onComplete }: LookBackSectionProps) {
  const [responses, setResponses] = useState({
    prayer: false,
    lastWeekReview: '',
    visionReminder: false
  })

  const handleComplete = () => {
    if (responses.prayer && responses.lastWeekReview.trim() && responses.visionReminder) {
      onComplete()
    }
  }

  useEffect(() => {
    handleComplete()
  }, [responses])

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-blue-600 pl-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">👈 Look Back</h2>
        <p className="text-gray-600 mb-6">Accountability & Vision</p>
        
        <div className="space-y-6">
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={responses.prayer}
                onChange={(e) => setResponses(prev => ({...prev, prayer: e.target.checked}))}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-lg">Opening Prayer - Invite God into your learning</span>
            </label>
          </div>
          
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3">
              Last Week's Commitment Review
            </label>
            <textarea
              value={responses.lastWeekReview}
              onChange={(e) => setResponses(prev => ({...prev, lastWeekReview: e.target.value}))}
              placeholder="How did you follow through on last week's commitments? What worked? What challenges did you face?"
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>
          
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={responses.visionReminder}
                onChange={(e) => setResponses(prev => ({...prev, visionReminder: e.target.checked}))}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-lg">I remember my vision: Bless, Develop, Multiply</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

// Look Up Section Component  
interface LookUpSectionProps {
  sessionData: SessionData
  onComplete: () => void
}

function LookUpSection({ sessionData, onComplete }: LookUpSectionProps) {
  const [progress, setProgress] = useState({
    videoWatched: false,
    scriptureRead: false,
    readingCompleted: false,
    reflectionAnswered: false,
    caseStudyCompleted: false
  })

  const [reflectionResponse, setReflectionResponse] = useState('')

  const handleComplete = () => {
    const allCompleted = Object.values(progress).every(Boolean) && reflectionResponse.trim()
    if (allCompleted) {
      onComplete()
    }
  }

  useEffect(() => {
    handleComplete()
  }, [progress, reflectionResponse])

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-blue-600 pl-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">☝️ Look Up</h2>
        <p className="text-gray-600 mb-6">Learning & Scripture</p>
        
        {/* Video Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Teaching Video</h3>
          {sessionData.videoUrl ? (
            <div className="relative">
              <iframe
                src={sessionData.videoUrl}
                width="100%"
                height="400"
                frameBorder="0"
                allowFullScreen
                className="rounded-lg"
              />
              <div className="mt-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={progress.videoWatched}
                    onChange={(e) => setProgress(prev => ({...prev, videoWatched: e.target.checked}))}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>I've watched the teaching video</span>
                </label>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Video content will be available soon</p>
              <div className="mt-4">
                <label className="flex items-center space-x-3 justify-center">
                  <input
                    type="checkbox"
                    checked={progress.videoWatched}
                    onChange={(e) => setProgress(prev => ({...prev, videoWatched: e.target.checked}))}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>I acknowledge the video content</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Scripture Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Scripture Foundation</h3>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <p className="font-semibold text-blue-800 mb-2">{sessionData.scriptureReference}</p>
            <p className="text-blue-700 italic">{sessionData.scriptureText || "Scripture text will be loaded from database..."}</p>
          </div>
          <label className="flex items-center space-x-3 mt-4">
            <input
              type="checkbox"
              checked={progress.scriptureRead}
              onChange={(e) => setProgress(prev => ({...prev, scriptureRead: e.target.checked}))}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span>I've read and reflected on the scripture</span>
          </label>
        </div>

        {/* Reading Content */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Deep-Dive Content</h3>
          <div className="prose max-w-none bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              {sessionData.content || `Welcome to ${sessionData.title}! This session will provide biblical principles and practical business insights that transform how you approach marketplace ministry. You'll discover proven strategies that have been tested by Faith Driven entrepreneurs across 9+ nations.`}
            </p>
          </div>
          <label className="flex items-center space-x-3 mt-4">
            <input
              type="checkbox"
              checked={progress.readingCompleted}
              onChange={(e) => setProgress(prev => ({...prev, readingCompleted: e.target.checked}))}
              className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span>I've completed the reading</span>
          </label>
        </div>

        {/* Personal Reflection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Reflection</h3>
          <p className="text-gray-600 mb-4">
            How does this teaching apply to your current business situation? What is God calling you to do?
          </p>
          <textarea
            value={reflectionResponse}
            onChange={(e) => {
              setReflectionResponse(e.target.value)
              setProgress(prev => ({...prev, reflectionAnswered: e.target.value.trim().length > 0}))
            }}
            placeholder="Share your thoughts and insights..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
        </div>

        {/* Case Study */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Case Study Application</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="text-gray-700 mb-4">
              Consider how this principle has been applied by other Faith Driven entrepreneurs across our global network. Real businesses have implemented these strategies with measurable results in local church impact and gospel advancement.
            </p>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={progress.caseStudyCompleted}
                onChange={(e) => setProgress(prev => ({...prev, caseStudyCompleted: e.target.checked}))}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span>I've considered the case study applications</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

// Look Forward Section Component
interface LookForwardSectionProps {
  sessionData: SessionData
  onComplete: () => void
}

function LookForwardSection({ sessionData, onComplete }: LookForwardSectionProps) {
  const [commitments, setCommitments] = useState({
    action1: '',
    action2: '',
    action3: '',
    accountability: '',
    sharing: '',
    celebration: false
  })

  const handleComplete = () => {
    const allFilled = commitments.action1.trim() && 
                     commitments.action2.trim() && 
                     commitments.action3.trim() && 
                     commitments.accountability.trim() && 
                     commitments.sharing.trim() &&
                     commitments.celebration
    
    if (allFilled) {
      onComplete()
    }
  }

  useEffect(() => {
    handleComplete()
  }, [commitments])

  const updateCommitment = (field: keyof typeof commitments, value: string | boolean) => {
    setCommitments(prev => ({...prev, [field]: value}))
  }

  return (
    <div className="space-y-8">
      <div className="border-l-4 border-blue-600 pl-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">👉 Look Forward</h2>
        <p className="text-gray-600 mb-6">Commitment & Action</p>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">3 Specific Action Steps</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Step 1 (This Week):
                </label>
                <input
                  type="text"
                  value={commitments.action1}
                  onChange={(e) => updateCommitment('action1', e.target.value)}
                  placeholder="What specific action will you take this week?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Step 2 (Next Two Weeks):
                </label>
                <input
                  type="text"
                  value={commitments.action2}
                  onChange={(e) => updateCommitment('action2', e.target.value)}
                  placeholder="What will you accomplish in the next two weeks?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action Step 3 (This Month):
                </label>
                <input
                  type="text"
                  value={commitments.action3}
                  onChange={(e) => updateCommitment('action3', e.target.value)}
                  placeholder="What longer-term commitment will you make this month?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Accountability Partner:
            </label>
            <input
              type="text"
              value={commitments.accountability}
              onChange={(e) => updateCommitment('accountability', e.target.value)}
              placeholder="Who will you ask to hold you accountable for these commitments?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Multiplication Commitment:
            </label>
            <input
              type="text"
              value={commitments.sharing}
              onChange={(e) => updateCommitment('sharing', e.target.value)}
              placeholder="Name 2 people you will share this lesson with this week"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={commitments.celebration}
                onChange={(e) => updateCommitment('celebration', e.target.checked)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-lg">🎉 I celebrate completing this session and growing as a Faith Driven entrepreneur!</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}