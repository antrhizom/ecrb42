import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Award, Download, ArrowLeft, Calendar, CheckCircle } from 'lucide-react'
import { learningAreas, getAreaProgress, getModulesByArea, moduleData } from '@/lib/moduleContent'

interface UserData {
  lernname: string
  code: string
  modules: any
}

export default function Certificate() {
  const router = useRouter()
  const { area } = router.query
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const certificateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser
      if (!user) {
        router.push('/')
        return
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData)
      }

      setLoading(false)
    }

    if (router.isReady) {
      loadUserData()
    }
  }, [router])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!userData || !area || (area !== 'grundlagen' && area !== 'schulumgebung')) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Zertifikat nicht gefunden</h2>
          <button
            onClick={() => router.push('/dashboard')}
            className="text-blue-600 hover:underline"
          >
            Zurück zum Dashboard
          </button>
        </div>
      </div>
    )
  }

  const areaId = area as 'grundlagen' | 'schulumgebung'
  const learningArea = learningAreas[areaId]
  const progress = getAreaProgress(areaId, userData.modules)
  const areaModules = getModulesByArea(areaId)

  // Prüfe ob mindestens 60% der Punkte erreicht wurden
  const hasEnoughPoints = progress.progress >= 60
  
  if (!hasEnoughPoints) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Zertifikat noch nicht freigeschaltet</h2>
          <p className="text-gray-600 mb-6">
            Sie müssen mindestens 60% der Punkte im Bereich "{learningArea.title}" erreichen, um das Zertifikat zu erhalten.
          </p>
          <p className="text-lg font-semibold text-blue-600 mb-6">
            Aktueller Fortschritt: {progress.progress}%
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 mx-auto bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Zurück zum Dashboard
          </button>
        </div>
      </div>
    )
  }

  const currentDate = new Date().toLocaleDateString('de-CH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation - wird beim Drucken ausgeblendet */}
      <div className="print:hidden bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Zurück zum Dashboard
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="h-5 w-5" />
            Als PDF drucken
          </button>
        </div>
      </div>

      {/* Zertifikat */}
      <div className="py-12 px-4 sm:px-6 lg:px-8">
        <div
          ref={certificateRef}
          className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none"
        >
          {/* Zertifikat Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-12 py-8 text-white print:bg-gradient-to-r print:from-blue-600 print:to-blue-500">
            <div className="text-center">
              <Award className="h-20 w-20 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2">Zertifikat</h1>
              <p className="text-xl text-blue-100">Urheberrecht im Schulkontext</p>
            </div>
          </div>

          {/* Zertifikat Inhalt */}
          <div className="px-12 py-10">
            <div className="text-center mb-8">
              <p className="text-gray-600 text-lg mb-4">Diese Bescheinigung wird verliehen an</p>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">{userData.lernname}</h2>
              <p className="text-gray-500">Lerncode: {userData.code}</p>
            </div>

            <div className="border-t border-b border-gray-200 py-8 mb-8">
              <p className="text-center text-gray-700 text-lg leading-relaxed">
                für die erfolgreiche Teilnahme und das Abschließen aller Lernthemen im Bereich<br />
                <span className="font-bold text-blue-600 text-2xl">"{learningArea.title}"</span>
              </p>
            </div>

            {/* Leistungsübersicht */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Leistungsübersicht
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Erreichte Punkte</p>
                  <p className="text-2xl font-bold text-gray-900">{progress.points} / {progress.maxPoints}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Erfolgsquote</p>
                  <p className="text-2xl font-bold text-green-600">{progress.progress}%</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700 mb-2">Abgeschlossene Themen:</p>
                {areaModules.map((module, index) => {
                  const moduleProgress = userData.modules[module.id]
                  return (
                    <div key={module.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                      <span className="text-gray-700">
                        {index + 1}. {module.title}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {moduleProgress?.score || 0} Punkte
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Datum und Unterschrift */}
            <div className="flex items-center justify-between pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Calendar className="h-5 w-5" />
                  <span className="text-sm">Ausstellungsdatum</span>
                </div>
                <p className="font-semibold text-gray-900">{currentDate}</p>
              </div>
              <div className="text-center">
                <div className="w-48 border-t-2 border-gray-300 pt-2">
                  <p className="text-sm text-gray-600">Lernplattform Urheberrecht</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-12 py-6 text-center border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Dieses Zertifikat bestätigt die erfolgreiche Teilnahme an der interaktiven Lernplattform<br />
              zum Thema Urheberrecht im Schweizer Schulkontext gemäß URG und GT7.
            </p>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          
          .print\\:hidden {
            display: none !important;
          }
          
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          
          @page {
            size: A4 landscape;
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  )
}
