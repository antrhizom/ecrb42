# Schnellreferenz - Urheberrecht Lernplattform v2.0

## 🚀 Quick Commands

```bash
# Installation
npm install

# Development
npm run dev              # Start dev server
npm run build           # Production build
npm start               # Start production server

# Firebase
node migrations/migrateTo2Areas.js dry-run    # Test migration
node migrations/migrateTo2Areas.js migrate    # Run migration
node migrations/migrateTo2Areas.js rollback   # Undo migration

# Deployment
vercel                  # Deploy to Vercel
vercel --prod          # Production deployment
```

## 📁 Wichtige Dateien

```
📦 urhg-lernplattform-v2-complete/
├── 📄 README.md                    # Hauptdokumentation
├── 📄 INSTALLATION.md              # Schritt-für-Schritt Installation
├── 📄 CHANGELOG.md                 # Versionshistorie
├── 📄 .env.example                 # Umgebungsvariablen Template
├── 📁 docs/
│   ├── MIGRATION_GUIDE.md          # Migrations-Anleitung
│   └── QUICK_START.md              # Schnelleinstieg
├── 📁 migrations/
│   └── migrateTo2Areas.js          # Datenbank-Migration
└── 📁 src/
    ├── 📁 lib/
    │   ├── firebase.ts             # Firebase Config
    │   └── moduleContent.ts        # Lerninhalte (HIER BEARBEITEN!)
    ├── 📁 pages/
    │   ├── index.tsx               # Login/Register
    │   ├── dashboard.tsx           # Hauptseite
    │   ├── 📁 modules/
    │   │   └── [id].tsx           # Modul-Seite
    │   └── 📁 certificate/
    │       └── [area].tsx         # Zertifikatsseite
    └── 📁 styles/
        └── globals.css            # Globale Styles
```

## 🎯 Lernbereiche & Module

### Bereich 1: Grundlagen (400 Punkte)
```
modul1  → Prinzipien Urheberrecht         (100 Punkte)
modul2  → Freie Werke                     (100 Punkte)
modul3  → Zitatrecht                      (100 Punkte)
modul4  → KI und Urheberrecht             (100 Punkte)
```

### Bereich 2: Schulumgebung (450 Punkte)
```
schule1 → Art. 19 URG und GT7             (100 Punkte)
schule2 → Lehrmittel                      ( 90 Punkte)
schule3 → GT7 Praxisanwendung             (100 Punkte)
schule4 → Dokumentationen                 ( 80 Punkte)
schule5 → KI in der Schule                ( 80 Punkte)
```

**Total: 850 Punkte**

## 🔧 Content bearbeiten

### Neues Modul hinzufügen

```typescript
// In src/lib/moduleContent.ts

// 1. Modul definieren
schule6: {
  id: 'schule6',
  area: 'schulumgebung',
  title: 'Ihr Titel',
  description: 'Ihre Beschreibung',
  duration: '~15 Min.',
  maxPoints: 80,
  videoTitle: '🎥 Video-Einführung',
  videoDescription: 'Zusammenfassung',
  videoPlaceholder: 'Video-Platzhalter-Text',
  interactiveTitle: '🎯 Hauptinhalt',
  interactiveElements: [...],
  roleSpecificContent: [...],  // Optional
  scenario: {...},
  quizQuestions: [...]
}

// 2. Modul registrieren
export const learningAreas = {
  schulumgebung: {
    modules: [..., 'schule6'],  // Hinzufügen
    maxPoints: 530              // Anpassen: 450 + 80
  }
}

// 3. Punktzahl anpassen
// In dashboard.tsx und [id].tsx:
const TOTAL_MAX_POINTS = 930  // 400 + 530
```

### Quiz-Frage hinzufügen

```typescript
quizQuestions: [
  {
    question: 'Ihre Frage?',
    options: [
      {
        text: 'Antwort A',
        correct: false,
        feedback: '❌ Warum falsch'
      },
      {
        text: 'Antwort B',
        correct: true,
        feedback: '✅ Warum richtig'
      }
    ]
  }
]
```

**Hinweis**: Optionen werden automatisch randomisiert (Fisher-Yates)!

### Rollenspezifischen Content hinzufügen

```typescript
roleSpecificContent: [
  {
    role: 'Lehrpersonen',
    icon: '👩‍🏫',
    description: 'Fokus: Unterricht',
    examples: [
      'Beispiel 1',
      'Beispiel 2'
    ]
  }
]
```

## 🎨 Styling anpassen

### Farben ändern

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'primary': '#0050a0',     // Hauptfarbe
      'secondary': '#00994d',   // Akzentfarbe
    }
  }
}
```

### Logo/Header anpassen

```typescript
// In allen Seiten-Headers:
<h1>Ihr Titel</h1>
<p>Ihr Untertitel</p>
```

## 🔥 Firebase

### Firestore-Struktur

```javascript
users/{userId}/
  ├── lernname: string
  ├── code: string (6-stellig)
  ├── totalPoints: number (0-850)
  ├── overallProgress: number (%)
  └── modules: {
      modul1: { completed, score, progress },
      modul2: { completed, score, progress },
      ...
      schule5: { completed, score, progress }
    }
```

### Security Rules

```javascript
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```

## 🐛 Debugging

### Browser Console

```javascript
// Firebase User prüfen
firebase.auth().currentUser

// Fortschritt prüfen
const progress = getAreaProgress('grundlagen', userData.modules)
console.log(progress)

// Lokalen Storage prüfen
localStorage.getItem('firebaseUser')
```

### Häufige Probleme

| Problem | Lösung |
|---------|--------|
| Module nicht sichtbar | Cache leeren: `rm -rf .next && npm run dev` |
| Fortschritt nicht gespeichert | Firebase Rules prüfen |
| Build schlägt fehl | TypeScript prüfen: `npm run type-check` |
| Deployment Fehler | Env vars in Vercel prüfen |

## 📊 Firebase Console URLs

```
Projekt: https://console.firebase.google.com/project/[PROJECT-ID]
Firestore: /firestore/data
Authentication: /authentication/users
Rules: /firestore/rules
```

## 🔐 Umgebungsvariablen

```env
# Erforderlich
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Optional
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

**Wo finde ich diese Werte?**
Firebase Console → Projekteinstellungen (⚙️) → Ihre Apps → Konfiguration

## 📱 URLs nach Deployment

```
Development:  http://localhost:3000
Staging:      https://[project]-[username].vercel.app
Production:   https://[your-domain].vercel.app
```

## 🆘 Support

```
📖 Vollständige Doku: README.md, INSTALLATION.md
🔧 Migration: docs/MIGRATION_GUIDE.md
⚡ Quick Start: docs/QUICK_START.md
🐛 Debugging: Browser Console (F12)
```

---

**Version**: 2.0 | **Datum**: 26.12.2024 | **Tech**: Next.js + Firebase + Vercel
