import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { 
  ArrowLeft, 
  CheckCircle, 
  X, 
  Trophy, 
  Play, 
  Users,
  RefreshCw,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { moduleData, ModuleContent, RoleSpecificContent, QuizQuestion, AccordionItem } from '@/lib/moduleContent'

// Fisher-Yates Shuffle Algorithm
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

export default function ModulePage() {
  const router = useRouter()
  const { id } = router.query
  const [module, setModule] = useState<ModuleContent | null>(null)
  const [currentStep, setCurrentStep] = useState<'intro' | 'interactive' | 'roles' | 'quiz'>('intro')
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number[] | number | null }>({}) // Jetzt auch Array für Multi-Select
  const [showQuizResults, setShowQuizResults] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>([])
  const [openAccordions, setOpenAccordions] = useState<string[]>([]) // Für Accordion-State

  useEffect(() => {
    if (router.isReady && id) {
      const moduleId = id as string
      const moduleContent = moduleData[moduleId]
      
      if (!moduleContent) {
        router.push('/dashboard')
        return
      }
      
      setModule(moduleContent)
      
      // Shuffle quiz questions and their options
      const shuffled = moduleContent.quizQuestions.map(q => ({
        ...q,
        options: shuffleArray(q.options)
      }))
      setShuffledQuestions(shuffleArray(shuffled))
      
      setLoading(false)
    }
  }, [router, id])

  const handleQuizAnswer = (questionIndex: number, optionIndex: number) => {
    if (showQuizResults) return
    
    const question = shuffledQuestions[questionIndex]
    
    // Multi-Select: Toggle selection
    if (question.multipleCorrect) {
      setQuizAnswers(prev => {
        const current = prev[questionIndex]
        const currentArray = Array.isArray(current) ? current : []
        
        if (currentArray.includes(optionIndex)) {
          // Deselect
          return {
            ...prev,
            [questionIndex]: currentArray.filter(i => i !== optionIndex)
          }
        } else {
          // Select
          return {
            ...prev,
            [questionIndex]: [...currentArray, optionIndex]
          }
        }
      })
    } else {
      // Single Select: Replace selection
      setQuizAnswers(prev => ({
        ...prev,
        [questionIndex]: optionIndex
      }))
    }
  }

  const handleSubmitQuiz = async () => {
    if (!module || showQuizResults) return
    
    // Calculate score
    let correctAnswers = 0
    shuffledQuestions.forEach((question, qIndex) => {
      const selectedAnswer = quizAnswers[qIndex]
      
      if (question.multipleCorrect) {
        // Multi-Select: Check if all correct options are selected and no incorrect ones
        const selectedIndices = Array.isArray(selectedAnswer) ? selectedAnswer : []
        const correctIndices = question.options
          .map((opt, idx) => opt.correct ? idx : -1)
          .filter(idx => idx !== -1)
        
        // Check if arrays match (all correct selected, no incorrect selected)
        const allCorrectSelected = correctIndices.every(idx => selectedIndices.includes(idx))
        const noIncorrectSelected = selectedIndices.every(idx => question.options[idx].correct)
        
        if (allCorrectSelected && noIncorrectSelected) {
          correctAnswers++
        }
      } else {
        // Single Select: Check if the selected option is correct
        if (selectedAnswer !== null && selectedAnswer !== undefined && typeof selectedAnswer === 'number') {
          if (question.options[selectedAnswer].correct) {
            correctAnswers++
          }
        }
      }
    })
    
    const totalQuestions = shuffledQuestions.length
    const totalScore = Math.round((correctAnswers / totalQuestions) * module.maxPoints)
    
    setScore(totalScore)
    setShowQuizResults(true)
    
    // Save to Firebase
    const user = auth.currentUser
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const modules = userData.modules || {}
          
          // Update module progress
          modules[module.id] = {
            completed: true,
            score: totalScore,
            progress: 100
          }
          
          // Calculate total points
          let totalPoints = 0
          Object.values(modules).forEach((m: any) => {
            totalPoints += m.score || 0
          })
          
          await updateDoc(userRef, {
            modules,
            totalPoints,
            overallProgress: Math.round((totalPoints / 850) * 100) // 850 = total max points
          })
        }
      } catch (error) {
        console.error('Error saving progress:', error)
      }
    }
  }

  const handleReset = async () => {
    if (!module) return
    
    const user = auth.currentUser
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          const modules = userData.modules || {}
          
          // Reset this module
          modules[module.id] = {
            completed: false,
            score: 0,
            progress: 0
          }
          
          // Recalculate total points
          let totalPoints = 0
          Object.values(modules).forEach((m: any) => {
            totalPoints += m.score || 0
          })
          
          await updateDoc(userRef, {
            modules,
            totalPoints,
            overallProgress: Math.round((totalPoints / 850) * 100)
          })
        }
        
        // Reset local state and reshuffle
        setCurrentStep('intro')
        setQuizAnswers({})
        setShowQuizResults(false)
        setScore(0)
        setShowResetConfirm(false)
        setOpenAccordions([]) // Reset Accordion state
        
        // Reshuffle questions
        const shuffled = module.quizQuestions.map(q => ({
          ...q,
          options: shuffleArray(q.options)
        }))
        setShuffledQuestions(shuffleArray(shuffled))
        
      } catch (error) {
        console.error('Error resetting module:', error)
      }
    }
  }

  const toggleAccordion = (id: string) => {
    setOpenAccordions(prev => 
      prev.includes(id) 
        ? prev.filter(accId => accId !== id)
        : [...prev, id]
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!module) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 hover:text-blue-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Zurück</span>
            </button>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              <span className="font-semibold">{module.maxPoints} Punkte möglich</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold mt-4">{module.title}</h1>
          <p className="text-blue-100 mt-2">{module.description}</p>
          <div className="flex items-center gap-4 mt-4 text-sm text-blue-100">
            <span>⏱ {module.duration}</span>
            <span className="px-2 py-1 bg-blue-700 rounded">
              {module.area === 'grundlagen' ? 'Grundlagen' : 'Schulumgebung'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro Section - Video Placeholder */}
        {currentStep === 'intro' && (
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <div className="flex items-start gap-4 mb-6">
              <Play className="h-8 w-8 text-blue-600 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{module.videoTitle}</h2>
                <p className="text-gray-600">{module.videoDescription}</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-12 mb-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-10 w-10 text-white" />
                </div>
                <p className="text-gray-700 text-lg mb-2">Platzhalter für Multimedia-Inhalte</p>
                <p className="text-gray-600 text-sm">{module.videoPlaceholder}</p>
              </div>
            </div>
            
            <button
              onClick={() => setCurrentStep('interactive')}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Weiter zu den Lerninhalten →
            </button>
          </div>
        )}

        {/* Interactive Elements */}
        {currentStep === 'interactive' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{module.interactiveTitle}</h2>
              
              {module.interactiveElements.map((element, index) => (
                <div key={index} className="mb-8 last:mb-0">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{element.title}</h3>
                  <p className="text-gray-700 mb-4">{element.content.text}</p>
                  
                  <ul className="space-y-2 mb-4">
                    {element.content.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  {element.content.example && (
                    <div className={`p-4 rounded-lg border-l-4 ${
                      element.content.example.type === 'info' 
                        ? 'bg-blue-50 border-blue-500' 
                        : element.content.example.type === 'warning'
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-green-50 border-green-500'
                    }`}>
                      <p className="text-gray-700">{element.content.example.text}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Accordion Items - Aufklappbare Wissensinhalte */}
            {module.accordionItems && module.accordionItems.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">📚 Wichtige Wissensinhalte</h2>
                <p className="text-gray-600 mb-6">
                  Klicken Sie auf die einzelnen Themen, um mehr zu erfahren:
                </p>
                
                <div className="space-y-4">
                  {module.accordionItems.map((item) => {
                    const isOpen = openAccordions.includes(item.id)
                    
                    return (
                      <div 
                        key={item.id} 
                        className="border-2 border-gray-200 rounded-lg overflow-hidden transition-all hover:border-blue-300"
                      >
                        {/* Accordion Header */}
                        <button
                          onClick={() => toggleAccordion(item.id)}
                          className="w-full flex items-center justify-between p-5 text-left bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-blue-50 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            {item.icon && <span className="text-3xl">{item.icon}</span>}
                            <div>
                              <h3 className="text-lg font-bold text-gray-900 mb-1">{item.title}</h3>
                              {!isOpen && (
                                <p className="text-sm text-gray-600">{item.preview}</p>
                              )}
                            </div>
                          </div>
                          {isOpen ? (
                            <ChevronUp className="h-6 w-6 text-blue-600 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-6 w-6 text-gray-400 flex-shrink-0" />
                          )}
                        </button>
                        
                        {/* Accordion Content */}
                        {isOpen && (
                          <div className="p-6 border-t-2 border-gray-100 bg-white">
                            {/* Paragraphs */}
                            {item.content.paragraphs && item.content.paragraphs.map((para, idx) => (
                              <p key={idx} className="text-gray-700 mb-4 leading-relaxed">
                                {para}
                              </p>
                            ))}
                            
                            {/* Key Points */}
                            {item.content.keyPoints && item.content.keyPoints.length > 0 && (
                              <div className="mb-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Kernpunkte:</h4>
                                <ul className="space-y-2">
                                  {item.content.keyPoints.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                                      <span className="text-gray-700">{point}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {/* Examples */}
                            {item.content.examples && item.content.examples.map((example, idx) => (
                              <div 
                                key={idx} 
                                className={`p-4 rounded-lg mb-4 border-l-4 ${
                                  example.type === 'success' 
                                    ? 'bg-green-50 border-green-500' 
                                    : example.type === 'warning'
                                    ? 'bg-yellow-50 border-yellow-500'
                                    : 'bg-blue-50 border-blue-500'
                                }`}
                              >
                                <h5 className="font-semibold text-gray-900 mb-2">{example.title}</h5>
                                <p className="text-gray-700">{example.description}</p>
                              </div>
                            ))}
                            
                            {/* Callout */}
                            {item.content.callout && (
                              <div className={`p-4 rounded-lg border-2 ${
                                item.content.callout.type === 'tip'
                                  ? 'bg-purple-50 border-purple-300'
                                  : item.content.callout.type === 'warning'
                                  ? 'bg-yellow-50 border-yellow-300'
                                  : item.content.callout.type === 'success'
                                  ? 'bg-green-50 border-green-300'
                                  : 'bg-blue-50 border-blue-300'
                              }`}>
                                <p className="text-gray-700 font-medium">{item.content.callout.text}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            
            <button
              onClick={() => setCurrentStep(module.roleSpecificContent ? 'roles' : 'quiz')}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Weiter →
            </button>
          </div>
        )}

        {/* Role-Specific Content (nur für Schulumgebung) */}
        {currentStep === 'roles' && module.roleSpecificContent && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-8">
              <div className="flex items-center gap-3 mb-6">
                <Users className="h-8 w-8 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Perspektiven aus der Schulpraxis</h2>
              </div>
              <p className="text-gray-600 mb-8">
                Dieses Thema betrifft verschiedene Akteure im Schulumfeld unterschiedlich. 
                Hier sind spezifische Aspekte für die einzelnen Rollen:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {module.roleSpecificContent.map((role, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-3xl">{role.icon}</span>
                      <h3 className="text-lg font-bold text-gray-900">{role.role}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                    <ul className="space-y-2">
                      {role.examples.map((example, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span>{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            
            <button
              onClick={() => setCurrentStep('quiz')}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Weiter zum Wissenstest →
            </button>
          </div>
        )}

        {/* Quiz */}
        {currentStep === 'quiz' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">📝 Wissenstest</h2>
              
              {shuffledQuestions.map((question, qIndex) => {
                const currentAnswer = quizAnswers[qIndex]
                const isMultiSelect = question.multipleCorrect === true
                
                return (
                  <div key={qIndex} className="mb-8 last:mb-0">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 flex-1">{question.question}</h3>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isMultiSelect 
                          ? 'bg-purple-100 text-purple-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {isMultiSelect ? 'Mehrfachauswahl' : 'Einzelauswahl'}
                      </div>
                    </div>
                    
                    {isMultiSelect && !showQuizResults && (
                      <p className="text-sm text-gray-600 mb-3 italic">
                        💡 Mehrere Antworten können korrekt sein. Wählen Sie alle zutreffenden aus.
                      </p>
                    )}
                    
                    <div className="space-y-3">
                      {question.options.map((option, oIndex) => {
                        // Multi-Select Logic
                        const isSelected = isMultiSelect
                          ? Array.isArray(currentAnswer) && currentAnswer.includes(oIndex)
                          : currentAnswer === oIndex
                        
                        const showCorrect = showQuizResults && option.correct
                        const showIncorrect = showQuizResults && isSelected && !option.correct
                        
                        return (
                          <button
                            key={oIndex}
                            onClick={() => handleQuizAnswer(qIndex, oIndex)}
                            disabled={showQuizResults}
                            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                              showQuizResults
                                ? showCorrect
                                  ? 'border-green-500 bg-green-50'
                                  : showIncorrect
                                  ? 'border-red-500 bg-red-50'
                                  : 'border-gray-200 bg-gray-50'
                                : isSelected
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3 flex-1">
                                {/* Checkbox/Radio Indicator */}
                                {!showQuizResults && (
                                  <div className={`w-5 h-5 border-2 flex items-center justify-center ${
                                    isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                                  } ${isMultiSelect ? 'rounded' : 'rounded-full'}`}>
                                    {isSelected && (
                                      <CheckCircle className="h-4 w-4 text-white" />
                                    )}
                                  </div>
                                )}
                                <span className="text-gray-900">{option.text}</span>
                              </div>
                              {showQuizResults && (
                                showCorrect ? (
                                  <CheckCircle className="h-6 w-6 text-green-600" />
                                ) : showIncorrect ? (
                                  <X className="h-6 w-6 text-red-600" />
                                ) : null
                              )}
                            </div>
                            
                            {showQuizResults && (isSelected || option.correct) && (
                              <p className="text-sm text-gray-600 mt-2 ml-8">{option.feedback}</p>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
            
            {!showQuizResults && (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(quizAnswers).length < shuffledQuestions.length}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Test abschließen
              </button>
            )}
            
            {showQuizResults && (
              <div className="bg-white rounded-xl shadow-md p-8">
                <div className="text-center">
                  <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Glückwunsch!</h3>
                  <p className="text-3xl font-bold text-blue-600 mb-2">{score} / {module.maxPoints} Punkte</p>
                  <p className="text-gray-600 mb-6">
                    Sie haben dieses Modul erfolgreich abgeschlossen!
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Zurück zum Dashboard
                    </button>
                    
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw className="h-5 w-5" />
                      Fortschritt zurücksetzen
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-4 mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-600 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Fortschritt zurücksetzen?</h3>
                <p className="text-gray-600">
                  Möchten Sie Ihren Fortschritt in diesem Modul wirklich zurücksetzen? 
                  Alle erreichten Punkte gehen verloren und Sie können das Modul erneut durchlaufen.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Zurücksetzen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
