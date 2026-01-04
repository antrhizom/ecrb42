import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { signOut } from 'firebase/auth'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { BookOpen, Trophy, LogOut, Award, ChevronRight, CheckCircle2, Users, FileCheck } from 'lucide-react'
import { learningAreas, getAreaProgress, moduleData } from '@/lib/moduleContent'

interface UserData {
  lernname: string
  code: string
  totalPoints: number
  overallProgress: number
  modules: {
    // Grundlagen
    modul1: { completed: boolean; score: number; progress: number }
    modul2: { completed: boolean; score: number; progress: number }
    modul3: { completed: boolean; score: number; progress: number }
    modul4: { completed: boolean; score: number; progress: number }
    // Schulumgebung
    schule1: { completed: boolean; score: number; progress: number }
    schule2: { completed: boolean; score: number; progress: number }
    schule3: { completed: boolean; score: number; progress: number }
    schule4: { completed: boolean; score: number; progress: number }
    schule5: { completed: boolean; score: number; progress: number }
  }
}

interface PlatformStats {
  totalUsers: number
  totalCertificates: number
}

interface AreaRating {
  averageRating: number
  totalRatings: number
}

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [platformStats, setPlatformStats] = useState<PlatformStats>({ totalUsers: 0, totalCertificates: 0 })
  const [grundlagenRating, setGrundlagenRating] = useState<AreaRating>({ averageRating: 0, totalRatings: 0 })
  const [schulumgebungRating, setSchulumgebungRating] = useState<AreaRating>({ averageRating: 0, totalRatings: 0 })

  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser
      if (!user) {
        router.push('/')
        return
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data() as UserData
        
        // Initialize modules if they don't exist
        if (!data.modules) {
          data.modules = {
            modul1: { completed: false, score: 0, progress: 0 },
            modul2: { completed: false, score: 0, progress: 0 },
            modul3: { completed: false, score: 0, progress: 0 },
            modul4: { completed: false, score: 0, progress: 0 },
            schule1: { completed: false, score: 0, progress: 0 },
            schule2: { completed: false, score: 0, progress: 0 },
            schule3: { completed: false, score: 0, progress: 0 },
            schule4: { completed: false, score: 0, progress: 0 },
            schule5: { completed: false, score: 0, progress: 0 }
          }
        }
        
        setUserData(data)
      }

      setLoading(false)
    }

    const loadPlatformStats = async () => {
      try {
        // Zähle alle registrierten User
        const usersSnapshot = await getDocs(collection(db, 'users'))
        const totalUsers = usersSnapshot.size
        
        // Zähle vergebene Zertifikate
        let totalCertificates = 0
        usersSnapshot.forEach((doc) => {
          const data = doc.data()
          if (data.modules) {
            // Prüfe Grundlagen (2 von 4 Module)
            const grundlagenModules = ['modul1', 'modul2', 'modul3', 'modul4']
            const grundlagenCompleted = grundlagenModules.filter(m => data.modules[m]?.completed).length
            if (grundlagenCompleted >= 2) totalCertificates++
            
            // Prüfe Schulumgebung (3 von 5 Module)
            const schulumgebungModules = ['schule1', 'schule2', 'schule3', 'schule4', 'schule5']
            const schulumgebungCompleted = schulumgebungModules.filter(m => data.modules[m]?.completed).length
            if (schulumgebungCompleted >= 3) totalCertificates++
          }
        })
        
        setPlatformStats({ totalUsers, totalCertificates })
      } catch (error) {
        console.error('Error loading platform stats:', error)
      }
    }

    const loadRatings = async () => {
      try {
        // Lade Grundlagen-Bewertungen
        const grundlagenDoc = await getDoc(doc(db, 'ratings', 'grundlagen'))
        if (grundlagenDoc.exists()) {
          const data = grundlagenDoc.data()
          setGrundlagenRating({
            averageRating: data.averageRating || 0,
            totalRatings: data.totalRatings || 0
          })
        }
        
        // Lade Schulumgebung-Bewertungen
        const schulumgebungDoc = await getDoc(doc(db, 'ratings', 'schulumgebung'))
        if (schulumgebungDoc.exists()) {
          const data = schulumgebungDoc.data()
          setSchulumgebungRating({
            averageRating: data.averageRating || 0,
            totalRatings: data.totalRatings || 0
          })
        }
      } catch (error) {
        console.error('Error loading ratings:', error)
      }
    }

    loadUserData()
    loadPlatformStats()
    loadRatings()
  }, [router])

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  // Berechne Fortschritt für beide Bereiche
  const grundlagenProgress = getAreaProgress('grundlagen', userData.modules)
  const schulumgebungProgress = getAreaProgress('schulumgebung', userData.modules)

  // Gesamtfortschritt über beide Bereiche
  const totalPoints = grundlagenProgress.points + schulumgebungProgress.points
  const totalMaxPoints = grundlagenProgress.maxPoints + schulumgebungProgress.maxPoints
  const totalProgress = Math.round((totalPoints / totalMaxPoints) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Willkommen, {userData.lernname}!</h1>
              <p className="text-blue-100 mt-1">Ihr Lerncode: {userData.code}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Abmelden</span>
            </button>
          </div>
        </div>
      </header>

      {/* Plattform-Statistiken */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <Users className="h-8 w-8" />
              </div>
              <div>
                <div className="text-3xl font-bold">{platformStats.totalUsers}</div>
                <div className="text-sm text-indigo-100">Registrierte Nutzer</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="bg-white/20 p-3 rounded-lg">
                <FileCheck className="h-8 w-8" />
              </div>
              <div>
                <div className="text-3xl font-bold">{platformStats.totalCertificates}</div>
                <div className="text-sm text-indigo-100">Vergebene Zertifikate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Gesamt-Fortschritt */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gesamtfortschritt</h2>
              <p className="text-gray-600 mt-1">Ihre Gesamtleistung über alle Lernbereiche</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600">{totalProgress}%</div>
              <div className="text-sm text-gray-600">{totalPoints} / {totalMaxPoints} Punkte</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-blue-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${totalProgress}%` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <Trophy className="h-8 w-8 text-blue-600 mb-3" />
              <div className="text-3xl font-bold text-gray-900">{totalPoints}</div>
              <div className="text-sm text-gray-600 mt-1">Gesammelte Punkte</div>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <CheckCircle2 className="h-8 w-8 text-green-600 mb-3" />
              <div className="text-3xl font-bold text-gray-900">
                {grundlagenProgress.completed + schulumgebungProgress.completed}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                von {grundlagenProgress.total + schulumgebungProgress.total} Themen abgeschlossen
              </div>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
              <Award className="h-8 w-8 text-purple-600 mb-3" />
              <div className="text-3xl font-bold text-gray-900">
                {
                  (grundlagenProgress.completed >= Math.ceil(grundlagenProgress.total / 2) ? 1 : 0) +
                  (schulumgebungProgress.completed >= Math.ceil(schulumgebungProgress.total / 2) ? 1 : 0)
                }
              </div>
              <div className="text-sm text-gray-600 mt-1">Zertifikate verfügbar</div>
            </div>
          </div>
        </div>

        {/* Lernbereiche */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bereich 1: Grundlagen */}
          <LearningAreaCard
            area={learningAreas.grundlagen}
            progress={grundlagenProgress}
            modules={userData.modules}
            onModuleClick={(moduleId) => router.push(`/modules/${moduleId}`)}
            onCertificateClick={() => router.push('/certificate/grundlagen')}
            router={router}
            rating={grundlagenRating}
          />

          {/* Bereich 2: Schulumgebung */}
          <LearningAreaCard
            area={learningAreas.schulumgebung}
            progress={schulumgebungProgress}
            modules={userData.modules}
            onModuleClick={(moduleId) => router.push(`/modules/${moduleId}`)}
            onCertificateClick={() => router.push('/certificate/schulumgebung')}
            router={router}
            rating={schulumgebungRating}
          />
        </div>
      </main>
    </div>
  )
}

// Komponente für Lernbereich-Karte
interface LearningAreaCardProps {
  area: typeof learningAreas.grundlagen
  progress: ReturnType<typeof getAreaProgress>
  modules: UserData['modules']
  onModuleClick: (moduleId: string) => void
  onCertificateClick: () => void
  router: ReturnType<typeof useRouter>
  rating: AreaRating
}

function LearningAreaCard({ area, progress, modules, onModuleClick, onCertificateClick, router, rating }: LearningAreaCardProps) {
  const modulesList = area.modules.map(moduleId => {
    const moduleData = modules[moduleId as keyof typeof modules]
    return {
      id: moduleId,
      completed: moduleData?.completed || false,
      score: moduleData?.score || 0,
      progress: moduleData?.progress || 0
    }
  })

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{area.title}</h2>
            <p className="text-blue-100 mt-2">{area.description}</p>
          </div>
          <BookOpen className="h-8 w-8 text-blue-200" />
        </div>
        
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-blue-100">Fortschritt</span>
            <span className="text-lg font-bold">{progress.progress}%</span>
          </div>
          <div className="w-full bg-blue-400 rounded-full h-3 overflow-hidden">
            <div
              className="bg-white h-full rounded-full transition-all duration-500"
              style={{ width: `${progress.progress}%` }}
            />
          </div>
          <div className="mt-2 text-sm text-blue-100">
            {progress.points} / {progress.maxPoints} Punkte
          </div>
        </div>
      </div>

      {/* Module Liste */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lernthemen</h3>
        <div className="space-y-3">
          {modulesList.map((module) => (
            <ModuleButton
              key={module.id}
              moduleId={module.id}
              moduleTitle={moduleData[module.id]?.title || 'Unbekanntes Thema'}
              completed={module.completed}
              score={module.score}
              progress={module.progress}
              onClick={() => onModuleClick(module.id)}
            />
          ))}
        </div>

        {/* Zertifikat */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onCertificateClick}
            disabled={progress.completed < Math.ceil(progress.total / 2)}
            className={`w-full flex items-center justify-between p-4 rounded-lg transition-all ${
              progress.completed >= Math.ceil(progress.total / 2)
                ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 hover:from-yellow-500 hover:to-yellow-600 shadow-lg'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <div className="flex items-center gap-3">
              <Award className="h-6 w-6" />
              <span className="font-semibold">
                {progress.completed >= Math.ceil(progress.total / 2) ? 'Zertifikat anzeigen' : 'Zertifikat (noch nicht freigeschaltet)'}
              </span>
            </div>
            {progress.completed >= Math.ceil(progress.total / 2) && <ChevronRight className="h-5 w-5" />}
          </button>
          
          {/* Bewertung Button - nur sichtbar wenn mindestens Hälfte der Module abgeschlossen */}
          {progress.completed >= Math.ceil(progress.total / 2) && (
            <button
              onClick={() => router.push(`/rating/${area.id}`)}
              className="w-full flex items-center justify-between p-4 rounded-lg transition-all mt-3 bg-gradient-to-r from-purple-400 to-purple-500 text-white hover:from-purple-500 hover:to-purple-600 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <span className="font-semibold">
                  Bewerten Sie diesen Lernbereich
                </span>
              </div>
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
          
          {/* Community-Bewertung */}
          {rating.totalRatings > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">
                      {rating.averageRating >= 4.5 ? '🌟' : 
                       rating.averageRating >= 3.5 ? '😃' :
                       rating.averageRating >= 2.5 ? '😊' :
                       rating.averageRating >= 1.5 ? '😐' : '😞'}
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {rating.averageRating.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-600">von 5.0</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">Community-Bewertung</div>
                    <div className="text-xs text-gray-600">
                      {rating.totalRatings} Bewertung{rating.totalRatings !== 1 ? 'en' : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Komponente für Modul-Button
interface ModuleButtonProps {
  moduleId: string
  moduleTitle: string
  completed: boolean
  score: number
  progress: number
  onClick: () => void
}

function ModuleButton({ moduleId, moduleTitle, completed, score, progress, onClick }: ModuleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
        completed
          ? 'border-green-500 bg-green-50 hover:bg-green-100'
          : progress > 0
          ? 'border-blue-500 bg-blue-50 hover:bg-blue-100'
          : 'border-gray-200 bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            completed
              ? 'bg-green-500 text-white'
              : progress > 0
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          {completed ? <CheckCircle2 className="h-6 w-6" /> : <BookOpen className="h-5 w-5" />}
        </div>
        <div className="text-left">
          <div className="font-semibold text-gray-900">{moduleTitle}</div>
          <div className="text-sm text-gray-600">
            {completed ? `Abgeschlossen - ${score} Punkte` : progress > 0 ? `In Bearbeitung - ${progress}%` : 'Noch nicht begonnen'}
          </div>
        </div>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </button>
  )
}
