#!/usr/bin/env python3
import re

# Read the current file
with open('app/modules/[moduleId]/sessions/[sessionId]/page.tsx', 'r') as f:
    content = f.read()

# 1. Add state variables after existing useState declarations
state_pattern = r'(const \[.*?, set.*?\] = useState\(.*?\);)'
state_addition = '''const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);'''

if 'quizAnswers' not in content:
    content = re.sub(state_pattern, r'\1\n  ' + state_addition, content, count=1)

# 2. Add quiz section after written curriculum
quiz_section = '''
                {/* Interactive Quiz Section */}
                {sessionData?.content?.quiz_questions && (
                  <div className="mb-8">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      🧠 Knowledge Check Quiz
                    </h4>
                    <div className="bg-white p-6 rounded-lg border-l-4 border-green-400 shadow-sm">
                      <p className="text-gray-700 mb-4">Test your understanding of today's key concepts:</p>
                      
                      {sessionData.content.quiz_questions.map((question, qIndex) => (
                        <div key={qIndex} className="mb-6 p-4 bg-blue-50 rounded-lg">
                          <h5 className="font-semibold text-gray-800 mb-3">
                            {qIndex + 1}. {question.question}
                          </h5>
                          
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <label key={oIndex} className="flex items-center p-2 hover:bg-blue-100 rounded cursor-pointer">
                                <input
                                  type="radio"
                                  name={`question-${qIndex}`}
                                  value={String.fromCharCode(97 + oIndex)}
                                  onChange={(e) => setQuizAnswers(prev => ({
                                    ...prev,
                                    [qIndex]: e.target.value
                                  }))}
                                  className="mr-3"
                                  disabled={quizSubmitted}
                                />
                                <span className="text-gray-700">
                                  {String.fromCharCode(97 + oIndex)}) {option}
                                </span>
                                {quizSubmitted && question.correct === String.fromCharCode(97 + oIndex) && (
                                  <span className="ml-2 text-green-600 font-bold">✓ Correct</span>
                                )}
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                      
                      {!quizSubmitted ? (
                        <button
                          onClick={() => {
                            const score = sessionData.content.quiz_questions.reduce((acc, question, index) => {
                              return acc + (quizAnswers[index] === question.correct ? 1 : 0);
                            }, 0);
                            setQuizScore(score);
                            setQuizSubmitted(true);
                          }}
                          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
                        >
                          Submit Quiz
                        </button>
                      ) : (
                        <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-lg">
                          <h6 className="font-bold text-lg">Quiz Complete! 🎉</h6>
                          <p>You scored {quizScore} out of {sessionData.content.quiz_questions.length}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}'''

# Find where to insert quiz (after written curriculum section)
if 'Knowledge Check Quiz' not in content:
    curriculum_end = r'(</div>\s*</div>\s*</div>\s*(?=\s*{/\* Case Study|{/\* Look Forward))'
    content = re.sub(curriculum_end, r'\1' + quiz_section, content)

# Write the updated file
with open('app/modules/[moduleId]/sessions/[sessionId]/page.tsx', 'w') as f:
    f.write(content)

print("✅ Template enhanced successfully!")
print("🚀 Test with: npm run dev")
