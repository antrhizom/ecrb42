import { useState } from 'react'
import { useRouter } from 'next/router'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { CheckCircle2, UserPlus, LogIn, Copy, Check } from 'lucide-react'

// Code-Generator Funktion
function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += '-'
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export default function Home() {
  const router = useRouter()
  const [mode, setMode] = useState<'select' | 'register' | 'login'>('select')
  const [code, setCode] = useState('')
  const [generatedCode, setGeneratedCode] = useState('')
  const [lernname, setLernname] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    console.log('🚀 Registrierung gestartet...')

    try {
      // Generiere einen neuen Code
      const newCode = generateCode()
      console.log('✅ Code generiert:', newCode)

      // Konvertiere Code zu E-Mail und Passwort
      const email = `${newCode}@urhg.internal`
      const password = newCode

      // E-Mail/Passwort Authentifizierung
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const userId = userCredential.user.uid
      console.log('✅ User erstellt mit UID:', userId)

      // Erstelle Benutzerprofil
      await setDoc(doc(db, 'users', userId), {
        lernname,
        code: newCode,
        createdAt: new Date().toISOString(),
        modules: {
          modul1: { completed: false, score: 0, progress: 0 },
          modul2: { completed: false, score: 0, progress: 0 },
          modul3: { completed: false, score: 0, progress: 0 },
          modul4: { completed: false, score: 0, progress: 0 },
          modul5: { completed: false, score: 0, progress: 0 }
        },
        totalPoints: 0,
        overallProgress: 0
      })
      console.log('✅ Benutzerprofil erstellt')

      // Speichere Code in access_codes Collection
      await setDoc(doc(db, 'access_codes', newCode), {
        code: newCode,
        userId,
        lernname,
        createdAt: new Date().toISOString()
      })
      console.log('✅ Code in access_codes gespeichert')

      // Code anzeigen
      setGeneratedCode(newCode)
      setLoading(false)
      console.log('✅ Registrierung erfolgreich!')
    } catch (err: any) {
      console.error('❌ Registrierungsfehler:', err)
      setError('Fehler bei der Registrierung: ' + err.message)
      setGeneratedCode('')
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Prüfe ob Code existiert in Firestore
      const codeRef = doc(db, 'access_codes', code)
      const codeDoc = await getDoc(codeRef)

      if (!codeDoc.exists()) {
        setError('Ungültiger Zugangscode')
        setLoading(false)
        return
      }

      const codeData = codeDoc.data()

      // Konvertiere Code zu E-Mail und Passwort
      const email = `${code}@urhg.internal`
      const password = code

      // E-Mail/Passwort Login
      await signInWithEmailAndPassword(auth, email, password)
      console.log('✅ Login erfolgreich!')

      router.push('/dashboard')
    } catch (err: any) {
      console.error('Login Error:', err)
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        setError('Ungültiger Zugangscode')
      } else {
        setError('Fehler beim Anmelden: ' + err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode)
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  const proceedToDashboard = () => {
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-urhg-blue to-urhg-purple flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-urhg-blue" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">URHG-CH</h1>
          <p className="text-xl text-blue-100">Urheberrecht Lern-App</p>
        </div>

        <div className="card">
          {/* Mode Selection */}
          {mode === 'select' && (
            <>
              <h2 className="text-2xl font-bold mb-6 text-center">Willkommen</h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => setMode('register')}
                  className="w-full p-6 border-2 border-urhg-blue rounded-xl hover:bg-blue-50 transition-colors text-left group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-urhg-blue rounded-xl flex items-center justify-center flex-shrink-0">
                      <UserPlus className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Neu registrieren</h3>
                      <p className="text-sm text-gray-600">Erstelle einen neuen Account mit automatischem Code</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setMode('login')}
                  className="w-full p-6 border-2 border-urhg-green rounded-xl hover:bg-green-50 transition-colors text-left group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-urhg-green rounded-xl flex items-center justify-center flex-shrink-0">
                      <LogIn className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Mit Code anmelden</h3>
                      <p className="text-sm text-gray-600">Ich habe bereits einen Zugangscode</p>
                    </div>
                  </div>
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  🎓 Schweizerisches Urheberrecht<br/>
                  4 Module • Punktesystem • Zertifikat
                </p>
              </div>
            </>
          )}

          {/* Registration Form */}
          {mode === 'register' && !generatedCode && (
            <>
              <button
                onClick={() => setMode('select')}
                className="text-gray-600 hover:text-gray-900 mb-4 flex items-center"
              >
                ← Zurück
              </button>
              
              <h2 className="text-2xl font-bold mb-6">Neu registrieren</h2>
              
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Lernname
                  </label>
                  <input
                    type="text"
                    value={lernname}
                    onChange={(e) => setLernname(e.target.value)}
                    className="input-field"
                    placeholder="Dein Lernname"
                    required
                    maxLength={30}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Dieser Name erscheint auf deinem Zertifikat
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? 'Erstellt...' : 'Account erstellen'}
                </button>
              </form>
            </>
          )}

          {/* Show Generated Code */}
          {mode === 'register' && generatedCode && (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Account erstellt! 🎉</h2>
                <p className="text-gray-600">Speichere deinen Zugangscode</p>
              </div>

              <div className="bg-gradient-to-br from-urhg-blue to-urhg-purple p-6 rounded-xl mb-6">
                <p className="text-white text-sm mb-2 font-medium">Dein persönlicher Code:</p>
                <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                  <code className="text-2xl font-bold text-gray-900 tracking-wider">
                    {generatedCode}
                  </code>
                  <button
                    onClick={copyCode}
                    className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Code kopieren"
                  >
                    {codeCopied ? (
                      <Check className="w-6 h-6 text-green-600" />
                    ) : (
                      <Copy className="w-6 h-6 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-amber-800 font-medium mb-2">⚠️ Wichtig!</p>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Speichere diesen Code sicher</li>
                  <li>• Du brauchst ihn beim nächsten Mal zur Anmeldung</li>
                  <li>• Mache einen Screenshot oder notiere ihn</li>
                </ul>
              </div>

              <button
                onClick={proceedToDashboard}
                className="w-full btn-primary"
              >
                Weiter zum Dashboard →
              </button>
            </>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <>
              <button
                onClick={() => setMode('select')}
                className="text-gray-600 hover:text-gray-900 mb-4 flex items-center"
              >
                ← Zurück
              </button>
              
              <h2 className="text-2xl font-bold mb-6">Mit Code anmelden</h2>
              
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Zugangscode
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    className="input-field text-center text-lg tracking-wider font-mono"
                    placeholder="XXXX-XXXX-XXXX"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Gib deinen gespeicherten Code ein
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50"
                >
                  {loading ? 'Lädt...' : 'Anmelden'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
