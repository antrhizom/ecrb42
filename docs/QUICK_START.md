# Quick Start Guide - Zwei-Bereich-Lernplattform

## 🎯 Was ist neu?

Die Lernplattform wurde erweitert von **1 Bereich** (400 Punkte) auf **2 Bereiche** (850 Punkte):

### 📚 Bereich 1: Grundlagen (400 Punkte)
Allgemeine urheberrechtliche Grundlagen:
- Prinzipien Urheberrecht
- Freie Werke
- Zitatrecht
- KI und Urheberrecht (allgemein)

### 🏫 Bereich 2: Schulumgebung (450 Punkte) - **NEU!**
Spezifisch für den Schulkontext:
- Art. 19 URG und GT7 Grundlagen
- Lehrmittel-Verwendung und Erstellung
- GT7 Praxisanwendung (digitale Medien)
- Dokumentationen und Schülerarbeiten
- KI in der Schule (schulspezifisch)

## ✨ Neue Features

### 1. 🎬 Einstiegsinfo-Sektion
Jedes Modul beginnt mit einer Multimedia-Einführung:
- Platzhalter für Videos, Audios oder Präsentationen
- Motivierender Einstieg ins Thema
- Übersicht über Lernziele

### 2. 👥 Rollenspezifische Inhalte
Schulumgebungs-Module sprechen verschiedene Zielgruppen an:
- **Lehrpersonen**: Unterrichtspraxis
- **Schulleitungen**: Organisation
- **Lernende**: Eigene Rechte
- **IT-Verantwortliche**: Technische Umsetzung
- **Verwaltung**: Administrative Aufgaben
- **Bibliothek/Mediothek**: Medienbereitstellung

### 3. 🔄 Reset-Funktion
- Fortschritt pro Modul zurücksetzen
- Modul erneut durchlaufen
- Neue Chance auf bessere Punktzahl

### 4. 🎲 Randomisierte Quiz-Fragen
- Antworten werden bei jedem Durchlauf neu gemischt
- Verhindert Auswendiglernen von Positionen
- Fördert echtes Verständnis

### 5. 🏆 Zwei Zertifikate
- Separates Zertifikat für jeden Bereich
- Druckbar als PDF
- Detaillierte Leistungsübersicht

## 🚀 Installation

### Variante A: Neue Installation

```bash
# Repository klonen oder Dateien herunterladen
cd urhg-lernplattform

# Dependencies installieren
npm install

# Firebase konfigurieren
# Erstellen Sie .env.local mit Ihren Firebase-Credentials:
cat > .env.local << EOF
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
EOF

# Development Server starten
npm run dev
```

### Variante B: Update bestehender Installation

```bash
# 1. Backup erstellen
firebase firestore:export gs://your-bucket/backups/$(date +%Y%m%d)

# 2. Neue Dateien kopieren
cp src/lib/moduleContentNew.ts src/lib/moduleContent.ts
cp src/pages/dashboardNew.tsx src/pages/dashboard.tsx
cp src/pages/modules/[id]New.tsx src/pages/modules/[id].tsx

# 3. Migrations-Script ausführen
node migrations/migrateTo2Areas.js

# 4. Testen
npm run dev

# 5. Deployment
npm run build
vercel --prod
```

## 📋 Struktur der neuen Dateien

```
src/
├── lib/
│   └── moduleContent.ts          # Erweiterte Content-Struktur (2 Bereiche)
├── pages/
│   ├── dashboard.tsx              # Zwei-Bereich-Dashboard
│   ├── certificate/
│   │   └── [area].tsx            # Dynamische Zertifikatsseite
│   └── modules/
│       └── [id].tsx              # Erweiterte Modul-Seite
```

## 💡 Verwendung

### Für Entwickler

#### 1. Content anpassen
Bearbeiten Sie `src/lib/moduleContent.ts`:

```typescript
// Neues Modul hinzufügen
schule6: {
  id: 'schule6',
  area: 'schulumgebung',
  title: 'Ihr neues Thema',
  description: 'Beschreibung...',
  // ... weitere Eigenschaften
}
```

#### 2. Module registrieren
```typescript
export const learningAreas: Record<string, LearningArea> = {
  schulumgebung: {
    id: 'schulumgebung',
    title: 'Schulumgebung',
    maxPoints: 530, // Anpassen bei neuem Modul
    modules: ['schule1', 'schule2', 'schule3', 'schule4', 'schule5', 'schule6']
  }
}
```

#### 3. Rollenspezifische Inhalte hinzufügen
```typescript
roleSpecificContent: [
  {
    role: 'Lehrpersonen',
    icon: '👩‍🏫',
    description: 'Fokus: ...',
    examples: [
      'Beispiel 1',
      'Beispiel 2'
    ]
  }
]
```

### Für Content-Creator

#### Quiz-Fragen erstellen
```typescript
quizQuestions: [
  {
    question: 'Ihre Frage hier?',
    options: [
      {
        text: 'Antwort A',
        correct: false,
        feedback: 'Begründung warum falsch'
      },
      {
        text: 'Antwort B',
        correct: true,
        feedback: 'Begründung warum richtig'
      }
    ]
  }
]
```

**Wichtig:** Die Optionen werden automatisch gemischt, Sie müssen sich keine Gedanken über die Reihenfolge machen!

#### Interaktive Elemente
```typescript
interactiveElements: [
  {
    title: 'Überschrift',
    content: {
      text: 'Haupttext...',
      list: ['Punkt 1', 'Punkt 2'],
      example: {
        type: 'info', // oder 'warning', 'success'
        text: 'Beispieltext'
      }
    }
  }
]
```

## 🎨 Anpassungen

### Farben ändern
Bearbeiten Sie `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        // ... weitere Farbtöne
        600: '#0050a0', // Hauptfarbe
      }
    }
  }
}
```

### Logo/Branding
Ersetzen Sie in den Header-Komponenten:
- Canton-Logo: `.canton-logo` CSS-Klasse
- Titel: `<h1>` Tags in Header
- Farben: Tailwind-Klassen (z.B. `bg-blue-600`)

## 🔍 Debugging

### Häufige Probleme

**Problem**: Module werden nicht angezeigt
```bash
# Lösung: Cache leeren
rm -rf .next
npm run dev
```

**Problem**: Fortschritt wird nicht gespeichert
```bash
# Lösung: Firebase Rules prüfen
firebase firestore:rules get

# Rules sollten schreiben erlauben:
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```

**Problem**: Zertifikat nicht verfügbar
```bash
# Lösung: Fortschritt prüfen in Firebase Console
# Oder im Code:
const progress = getAreaProgress('grundlagen', userData.modules)
console.log('Progress:', progress.progress) // Muss 100 sein
```

## 📊 Analytics

### User-Fortschritt überwachen

```javascript
// In Firebase Console → Firestore
// Aggregations-Query:
db.collection('users')
  .get()
  .then(snapshot => {
    let total = 0;
    let completed = 0;
    
    snapshot.forEach(doc => {
      total++;
      const data = doc.data();
      if (data.overallProgress === 100) completed++;
    });
    
    console.log(`Completion Rate: ${completed/total*100}%`);
  });
```

## 🎓 Best Practices

1. **Content-Qualität**
   - Klare, verständliche Sprache
   - Praxisnahe Beispiele
   - Verschiedene Schwierigkeitsgrade

2. **Quiz-Design**
   - Mindestens 4 Optionen pro Frage
   - Plausible Distraktoren (falsche Antworten)
   - Konstruktives Feedback

3. **Rollenspezifik**
   - Konkrete Beispiele für jede Rolle
   - Relevanz für Schulalltag
   - Unterschiedliche Perspektiven zeigen

4. **Performance**
   - Bilder optimieren (< 100 KB)
   - Lazy Loading für Inhalte
   - Effiziente Firebase-Queries

## 🆘 Support

### Ressourcen
- 📖 Vollständige Doku: `MIGRATION_GUIDE.md`
- 🐛 Issues: GitHub Issues
- 💬 Diskussionen: GitHub Discussions

### Logs prüfen
```bash
# Browser Console
F12 → Console Tab

# Firebase Logs
firebase functions:log

# Vercel Logs
vercel logs
```

## 🚦 Status-Check

Prüfen Sie, ob alles funktioniert:

```bash
# 1. Build erfolgreich
npm run build
# ✅ Should complete without errors

# 2. Types korrekt
npm run type-check
# ✅ Should show no type errors

# 3. Firebase verbunden
# In Browser Console:
firebase.auth().currentUser
# ✅ Should return user object when logged in
```

---

**Version:** 2.0  
**Letztes Update:** 26. Dezember 2024

Viel Erfolg mit der erweiterten Lernplattform! 🎉
