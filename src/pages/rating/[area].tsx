import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { doc, getDoc, updateDoc, setDoc, collection, getDocs } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { ArrowLeft, Star, TrendingUp } from 'lucide-react'
import { learningAreas } from '@/lib/moduleContent'

const RATINGS = [
  { value: 1, emoji: '😞', label: 'Schlecht', color: 'text-red-500' },
  { value: 2, emoji: '😐', label: 'Mäßig', color: 'text-orange-500' },
  { value: 3, emoji: '😊', label: 'Gut', color: 'text-yellow-500' },
  { value: 4, emoji: '😃', label: 'Sehr gut', color: 'text-green-500' },
  { value: 5, emoji: '🌟', label: 'Hervorragend', color: 'text-purple-500' }
]

interface AreaStats {
  totalRatings: number
  averageRating: number
  distribution: { [key: number]: number }
}

export default function RatingPage() {
  const router = useRouter()
  const { area } = router.query
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [hasRated, setHasRated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [stats, setStats] = useState<AreaStats | null>(null)
  const [userRating, setUserRating] = useState<number | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const user = auth.currentUser
      if (!user || !area) {
        router.push('/dashboard')
        return
      }

      const areaId = area as string
      
      // Prüfe ob User diesen Bereich bereits bewertet hat
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const data = userDoc.data()
        if (data.ratings && data.ratings[areaId]) {
          setUserRating(data.ratings[areaId])
          setHasRated(true)
        }
      }

      // Lade Statistiken
      await loadStats(areaId)
      setLoading(false)
    }

    if (router.isReady) {
      loadData()
    }
  }, [router, area])

  const loadStats = async (areaId: string) => {
    try {
      const statsDoc = await getDoc(doc(db, 'ratings', areaId))
      if (statsDoc.exists()) {
        setStats(statsDoc.data() as AreaStats)
      } else {
        setStats({
          totalRatings: 0,
          averageRating: 0,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        })
      }
    } catch (error) {
      console.error('Error loading stats:', error)
    }
  }

  const handleSubmit = async () => {
    if (!selectedRating || !area) return

    setSubmitting(true)
    const user = auth.currentUser
    if (!user) return

    const areaId = area as string

    try {
      // Speichere User-Bewertung
      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      
      if (userDoc.exists()) {
        const data = userDoc.data()
        const ratings = data.ratings || {}
        ratings[areaId] = selectedRating
        
        await updateDoc(userRef, { ratings })
      }

      // Update globale Statistiken
      const statsRef = doc(db, 'ratings', areaId)
      const statsDoc = await getDoc(statsRef)

      let newStats: AreaStats
      
      if (statsDoc.exists()) {
        const currentStats = statsDoc.data() as AreaStats
        const distribution = { ...currentStats.distribution }
        distribution[selectedRating] = (distribution[selectedRating] || 0) + 1
        
        const totalRatings = currentStats.totalRatings + 1
        const totalScore = (currentStats.averageRating * currentStats.totalRatings) + selectedRating
        const averageRating = totalScore / totalRatings

        newStats = {
          totalRatings,
          averageRating,
          distribution
        }
      } else {
        newStats = {
          totalRatings: 1,
          averageRating: selectedRating,
          distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, [selectedRating]: 1 }
        }
      }

      await setDoc(statsRef, newStats)
      
      setStats(newStats)
      setUserRating(selectedRating)
      setHasRated(true)
    } catch (error) {
      console.error('Error submitting rating:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!area || (area !== 'grundlagen' && area !== 'schulumgebung')) {
    return null
  }

  const areaInfo = learningAreas[area as 'grundlagen' | 'schulumgebung']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 hover:text-purple-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Zurück zum Dashboard</span>
            </button>
          </div>
          <h1 className="text-3xl font-bold mt-4">Bewertung: {areaInfo.title}</h1>
          <p className="text-purple-100 mt-2">
            Ihre Meinung ist uns wichtig! Helfen Sie uns, die Lernplattform zu verbessern.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!hasRated ? (
          /* Bewertungs-Formular */
          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <div className="text-center mb-8">
              <Star className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Wie hat Ihnen dieser Lernbereich gefallen?
              </h2>
              <p className="text-gray-600">
                Wählen Sie eine Bewertung aus:
              </p>
            </div>

            {/* Rating Buttons */}
            <div className="flex justify-center gap-4 mb-8">
              {RATINGS.map((rating) => (
                <button
                  key={rating.value}
                  onClick={() => setSelectedRating(rating.value)}
                  className={`flex flex-col items-center gap-2 p-6 rounded-xl border-2 transition-all ${
                    selectedRating === rating.value
                      ? 'border-purple-500 bg-purple-50 scale-110 shadow-lg'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-5xl">{rating.emoji}</span>
                  <span className={`text-sm font-semibold ${rating.color}`}>
                    {rating.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!selectedRating || submitting}
              className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? 'Wird gespeichert...' : 'Bewertung abgeben'}
            </button>
          </div>
        ) : (
          /* Danke-Nachricht */
          <div className="bg-white rounded-xl shadow-md p-8 mb-8 text-center">
            <div className="text-6xl mb-4">
              {RATINGS.find(r => r.value === userRating)?.emoji}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Vielen Dank für Ihre Bewertung!
            </h2>
            <p className="text-gray-600">
              Sie haben diesen Lernbereich mit{' '}
              <span className="font-bold">
                {RATINGS.find(r => r.value === userRating)?.label}
              </span>{' '}
              bewertet.
            </p>
          </div>
        )}

        {/* Statistiken */}
        {stats && stats.totalRatings > 0 && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Bewertungen aller Nutzer
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Durchschnitt */}
              <div className="text-center">
                <div className="text-6xl font-bold text-purple-600 mb-2">
                  {stats.averageRating.toFixed(1)}
                </div>
                <div className="text-gray-600 mb-2">von 5.0</div>
                <div className="text-sm text-gray-500">
                  Basierend auf {stats.totalRatings} Bewertung{stats.totalRatings !== 1 ? 'en' : ''}
                </div>
              </div>

              {/* Verteilung */}
              <div className="space-y-3">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.distribution[rating] || 0
                  const percentage = stats.totalRatings > 0 
                    ? (count / stats.totalRatings) * 100 
                    : 0

                  return (
                    <div key={rating} className="flex items-center gap-3">
                      <span className="text-2xl w-8">
                        {RATINGS.find(r => r.value === rating)?.emoji}
                      </span>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                          <div
                            className="bg-purple-600 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {count}×
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
