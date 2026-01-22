import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Award, Download, ArrowLeft, Calendar, CheckCircle } from 'lucide-react'
import { learningAreas, getAreaProgress, getModulesByArea } from '@/lib/moduleContent'

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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
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

      {/* Zertifikat - OPTIMIERT FÜR A4 PORTRAIT */}
      <div className="py-8 px-4 print:py-0 print:px-0">
        <div
          ref={certificateRef}
          className="max-w-[210mm] mx-auto bg-white rounded-xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none print:max-w-full"
        >
          {/* Zertifikat Header - KOMPAKT */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-6 text-white print:px-10 print:py-5">
            <div className="text-center">
              <Award className="h-16 w-16 mx-auto mb-3 print:h-14 print:w-14" />
              <h1 className="text-3xl font-bold mb-1 print:text-2xl">Zertifikat</h1>
              <p className="text-lg text-blue-100 print:text-base">Urheberrecht im Schulkontext</p>
            </div>
          </div>

          {/* Zertifikat Inhalt - KOMPAKT */}
          <div className="px-8 py-6 print:px-10 print:py-5">
            {/* Empfänger */}
            <div className="text-center mb-6 print:mb-4">
              <p className="text-gray-600 text-base mb-3 print:text-sm print:mb-2">
                Diese Bescheinigung wird verliehen an
              </p>
              <h2 className="text-3xl font-bold text-gray-900 mb-2 print:text-2xl print:mb-1">
                {userData.lernname}
              </h2>
              <p className="text-gray-500 text-sm">Lerncode: {userData.code}</p>
            </div>

            {/* Beschreibung - KOMPAKT */}
            <div className="border-t border-b border-gray-200 py-5 mb-5 print:py-3 print:mb-4">
              <p className="text-center text-gray-700 text-base leading-relaxed print:text-sm">
                für die erfolgreiche Teilnahme und das Abschliessen aller Lernthemen im Bereich<br />
                <span className="font-bold text-blue-600 text-xl print:text-lg">"{learningArea.title}"</span>
              </p>
            </div>

            {/* Leistungsübersicht - KOMPAKT */}
            <div className="bg-gray-50 rounded-lg p-5 mb-5 print:p-4 print:mb-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 print:text-sm print:mb-2">
                <CheckCircle className="h-5 w-5 text-green-600 print:h-4 print:w-4" />
                Leistungsübersicht
              </h3>
              
              {/* Stats Grid - 2 Spalten */}
              <div className="grid grid-cols-2 gap-4 mb-4 print:gap-3 print:mb-3">
                <div>
                  <p className="text-sm text-gray-600 print:text-xs">Erreichte Punkte</p>
                  <p className="text-2xl font-bold text-gray-900 print:text-xl">
                    {progress.points} / {progress.maxPoints}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 print:text-xs">Erfolgsquote</p>
                  <p className="text-2xl font-bold text-green-600 print:text-xl">
                    {progress.progress}%
                  </p>
                </div>
              </div>
              
              {/* Module Liste - KOMPAKTER */}
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700 mb-2 print:text-xs print:mb-1">
                  Abgeschlossene Themen:
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {areaModules.map((module, index) => {
                    const moduleProgress = userData.modules[module.id]
                    return (
                      <div key={module.id} className="flex items-center justify-between text-xs print:text-[10px]">
                        <span className="text-gray-700 truncate pr-2">
                          {index + 1}. {module.title}
                        </span>
                        <span className="font-semibold text-gray-900 whitespace-nowrap">
                          {moduleProgress?.score || 0} P.
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Datum und Unterschrift - KOMPAKT */}
            <div className="flex items-center justify-between pt-5 border-t border-gray-200 print:pt-3">
              <div className="text-center flex-1">
                <div className="flex items-center justify-center gap-2 text-gray-600 mb-1">
                  <Calendar className="h-4 w-4 print:h-3 print:w-3" />
                  <span className="text-xs print:text-[10px]">Ausstellungsdatum</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm print:text-xs">{currentDate}</p>
              </div>
              
              <div className="text-center flex-1">
                <div className="w-40 border-t-2 border-gray-300 pt-2 mx-auto print:w-32">
                  <p className="text-xs text-gray-600 print:text-[10px]">Lernplattform Urheberrecht</p>
                </div>
              </div>
              
              <div className="text-center flex-1">
                <div className="text-xs text-gray-600 mb-1 print:text-[10px]">Zertifikat-Code</div>
                <p className="font-semibold text-gray-900 text-sm print:text-xs">
                  CERT-{userData.code}
                </p>
              </div>
            </div>
          </div>

          {/* Footer - KOMPAKT */}
          <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200 print:px-10 print:py-3">
            <p className="text-xs text-gray-600 leading-relaxed print:text-[10px]">
              Dieses Zertifikat bestätigt die erfolgreiche Teilnahme an der interaktiven Lernplattform<br />
              zum Thema Urheberrecht im Schweizer Schulkontext gemäss URG und GT7.
            </p>
          </div>
        </div>
      </div>

      {/* OPTIMIERTE PRINT STYLES */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          
          /* Alle nicht-Zertifikat Elemente ausblenden */
          .print\\:hidden {
            display: none !important;
          }
          
          /* Zertifikat-Container anpassen */
          .print\\:shadow-none {
            box-shadow: none !important;
          }
          
          .print\\:rounded-none {
            border-radius: 0 !important;
          }
          
          /* A4 PORTRAIT - WICHTIG! */
          @page {
            size: A4 portrait;
            margin: 15mm;
          }
          
          /* Seitenumbruch verhindern */
          [ref="certificateRef"] {
            page-break-inside: avoid;
            page-break-after: avoid;
          }
          
          /* Alle Elemente des Zertifikats zusammenhalten */
          .bg-gradient-to-r,
          .border-t,
          .border-b,
          .bg-gray-50 {
            page-break-inside: avoid;
          }
          
          /* Schriftgrössen optimieren */
          h1 { font-size: 1.5rem !important; }
          h2 { font-size: 1.25rem !important; }
          h3 { font-size: 0.875rem !important; }
          p { font-size: 0.75rem !important; }
          
          /* Abstände kompakter */
          .py-8 { padding-top: 0 !important; padding-bottom: 0 !important; }
          .py-6 { padding-top: 1rem !important; padding-bottom: 1rem !important; }
          .py-5 { padding-top: 0.75rem !important; padding-bottom: 0.75rem !important; }
          .mb-8 { margin-bottom: 1rem !important; }
          .mb-6 { margin-bottom: 0.75rem !important; }
          .mb-5 { margin-bottom: 0.5rem !important; }
          
          /* Farben für Druck optimieren */
          .bg-gradient-to-r {
            background: #2563eb !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          
          .text-blue-600 {
            color: #2563eb !important;
          }
          
          .text-green-600 {
            color: #16a34a !important;
          }
        }
      `}</style>
    </div>
  )
}
