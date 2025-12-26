# 🎓 URHG-CH - Urheberrecht Lern-App

Next.js App für interaktives Lernen zum Schweizerischen Urheberrecht.

## ✨ Features

- 🔐 **Code-basierte Authentifizierung** (wie ECRC42)
- 📚 **4 interaktive Module** zum Urheberrecht
- 🎯 **Punktesystem** mit bis zu 400 Punkten
- 📊 **Fortschrittsverfolgung** automatisch gespeichert
- 🎨 **Modernes Design** mit Tailwind CSS
- 🔥 **Firebase Backend** (Auth + Firestore)

## 🚀 Quick Start

### 1. Installation

```bash
npm install
```

### 2. Firebase Setup

1. Erstelle ein Firebase-Projekt: https://console.firebase.google.com
2. Aktiviere **Email/Password Authentication**
3. Erstelle eine **Firestore Database**
4. Kopiere deine Firebase Config

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Fülle `.env.local` mit deinen Firebase Credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Firestore Rules setzen

Kopiere den Inhalt von `firestore.rules` in Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /access_codes/{code} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Veröffentlichen nicht vergessen!**

### 5. App starten

```bash
npm run dev
```

App läuft auf: http://localhost:3000

## 📦 Deployment

### Vercel (Empfohlen)

```bash
npm install -g vercel
vercel
```

### Andere Plattformen

```bash
npm run build
npm run start
```

## 🗂️ Projekt-Struktur

```
urhg-app/
├── src/
│   ├── pages/
│   │   ├── _app.tsx          # App Wrapper mit Auth
│   │   ├── _document.tsx     # HTML Document
│   │   ├── index.tsx          # Login/Register
│   │   └── dashboard.tsx      # Hauptseite mit Modulen
│   ├── lib/
│   │   └── firebase.ts        # Firebase Config
│   └── styles/
│       └── globals.css        # Tailwind + Custom Styles
├── public/                    # Statische Dateien
├── firestore.rules           # Firestore Security Rules
├── tailwind.config.js        # Tailwind Konfiguration
├── tsconfig.json             # TypeScript Config
└── package.json              # Dependencies
```

## 🔥 Firestore Collections

### `users/{userId}`

```javascript
{
  lernname: "Anna Müller",
  code: "ABCD-1234-EFGH",
  createdAt: "2024-12-23T...",
  modules: {
    modul1: { completed: false, score: 0, progress: 0 },
    modul2: { completed: false, score: 0, progress: 0 },
    modul3: { completed: false, score: 0, progress: 0 },
    modul4: { completed: false, score: 0, progress: 0 }
  },
  totalPoints: 0,
  overallProgress: 0
}
```

### `access_codes/{code}`

```javascript
{
  code: "ABCD-1234-EFGH",
  userId: "ABC123...",
  lernname: "Anna Müller",
  createdAt: "2024-12-23T..."
}
```

## 🎯 Wie es funktioniert

### Registrierung:

1. User gibt Namen ein
2. System generiert Code: `ABCD-1234-EFGH`
3. Code wird zu Email konvertiert: `ABCD-1234-EFGH@urhg.internal`
4. Firebase Auth User erstellt mit Email/Passwort
5. User-Dokument in Firestore angelegt
6. Code in `access_codes` Collection gespeichert
7. Code wird User angezeigt

### Login:

1. User gibt Code ein
2. System sucht Code in `access_codes` Collection
3. Code wird zu Email konvertiert
4. Firebase Auth Login mit Email/Passwort
5. Redirect zum Dashboard

### Vorteile:

- ✅ User sieht nur einfachen Code
- ✅ Intern: Sichere Email/Password Auth
- ✅ Feste User-IDs (konsistent)
- ✅ Keine Anonymous Auth Probleme

## 🎨 Customization

### Farben ändern:

In `tailwind.config.js`:

```javascript
colors: {
  'urhg-blue': '#3b82f6',    // Primärfarbe
  'urhg-green': '#10b981',   // Erfolg
  'urhg-purple': '#8b5cf6',  // Akzent
}
```

### Module hinzufügen:

In `src/pages/dashboard.tsx` neue Module-Cards erstellen.

## 🐛 Troubleshooting

### "Permission denied" beim Login:

→ Firestore Rules nicht gesetzt oder nicht veröffentlicht

### Code nicht gefunden:

→ Prüfe ob `access_codes` Collection existiert  
→ Prüfe Firestore Rules für `access_codes`

### App lädt nicht:

→ `.env.local` korrekt ausgefüllt?  
→ Firebase Config korrekt?  
→ `npm install` ausgeführt?

## 📝 To-Do / Erweiterungen

- [ ] Module-Seiten implementieren (modul1-4)
- [ ] Quiz-Funktionalität
- [ ] Zertifikat-Generierung
- [ ] Passwort-Reset Funktion
- [ ] Admin-Panel
- [ ] Analytics

## 📄 Lizenz

MIT

## 🤝 Support

Bei Fragen oder Problemen:
- Firebase Console prüfen
- Browser Console (F12) öffnen für Logs
- Firestore Rules verifizieren

---

**Viel Erfolg mit der Lern-App! 🎓**
