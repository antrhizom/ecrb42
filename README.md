# Urheberrecht Lernplattform v2.0 - Zwei-Bereich-Struktur

## 🎓 Übersicht

Erweiterte Version der interaktiven E-Learning-Plattform für Schweizer Urheberrecht im Schulkontext. Die Plattform wurde von **1 Bereich** (400 Punkte) auf **2 Bereiche** (850 Punkte) erweitert.

### 📚 Lernbereiche

#### Bereich 1: Grundlagen (400 Punkte)
Allgemeine urheberrechtliche Grundlagen für alle Nutzer:
- ⚖️ Prinzipien Urheberrecht (100 Punkte)
- 🆓 Freie Werke (100 Punkte)
- 📖 Zitatrecht (100 Punkte)
- 🤖 KI und Urheberrecht - Allgemein (100 Punkte)

#### Bereich 2: Schulumgebung (450 Punkte) - **NEU!**
Spezifische Regelungen für den Schweizer Schulkontext:
- 🏫 Art. 19 URG und GT7 - Grundlagen (100 Punkte)
- 📚 Lehrmittel - Verwendung und Erstellung (90 Punkte)
- 💻 GT7 Praxisanwendung (100 Punkte)
- 📝 Dokumentationen und Schülerarbeiten (80 Punkte)
- 🎓 KI in der Schule (80 Punkte)

## ✨ Neue Features v2.0

### 1. 🎬 Einstiegsinfo-Sektion
- Multimedia-Einführung zu jedem Thema
- Platzhalter für Videos, Audios oder Präsentationen
- Motivierender Einstieg mit Lernzielen

### 2. 👥 Rollenspezifische Inhalte
Schulumgebungs-Module sprechen gezielt verschiedene Akteure an:
- **👩‍🏫 Lehrpersonen**: Unterrichtsvorbereitung und -durchführung
- **🏢 Schulleitungen**: Organisation und strategische Planung
- **🎓 Lernende**: Eigene Rechte und Pflichten
- **💻 IT-Verantwortliche**: Technische Umsetzung und Plattformen
- **📋 Verwaltung**: Administrative Aufgaben und Dokumentation
- **📚 Bibliothek/Mediothek**: Medienbereitstellung und -verwaltung

### 3. 🔄 Reset-Funktionalität
- Fortschritt pro Modul einzeln zurücksetzen
- Module erneut durchlaufen für bessere Punktzahl
- Bestätigungsdialog verhindert versehentliches Zurücksetzen

### 4. 🎲 Fisher-Yates Shuffle
- Quiz-Optionen werden bei jedem Durchlauf randomisiert
- Verhindert Auswendiglernen fester Antwortmuster
- Fördert echtes Verständnis statt Muster-Erkennung

### 5. 🏆 Zwei separate Zertifikate
- Eigenes Zertifikat pro abgeschlossenem Bereich
- Druckfunktion als PDF (A4 Landscape)
- Detaillierte Leistungsübersicht mit allen Punkten

### 6. 📊 Erweitertes Dashboard
- Übersichtliche Darstellung beider Bereiche
- Separate Fortschrittsanzeige pro Bereich
- Gesamtfortschritt über alle 850 Punkte

## 📦 Paket-Inhalt

```
urhg-lernplattform-v2/
├── docs/
│   ├── MIGRATION_GUIDE.md      # Ausführliche Migrations-Anleitung
│   └── QUICK_START.md          # Schnelleinstieg und Verwendung
├── migrations/
│   └── migrateTo2Areas.js      # Migrations-Script für Firebase
└── src/
    ├── lib/
    │   └── moduleContent.ts    # Erweiterte Content-Struktur
    └── pages/
        ├── dashboard.tsx       # Zwei-Bereich-Dashboard
        ├── certificate/
        │   └── [area].tsx      # Dynamische Zertifikatsseite
        └── modules/
            └── [id].tsx        # Erweiterte Modul-Seite
```

## 🚀 Installation

### Voraussetzungen
- Node.js 18+
- npm oder yarn
- Firebase-Projekt
- Vercel-Account (für Deployment)

### Schnellstart

1. **Dateien in bestehendes Projekt kopieren:**
   ```bash
   # Backup erstellen
   cp -r src src.backup
   
   # Neue Dateien kopieren
   cp urhg-lernplattform-v2/src/lib/moduleContent.ts src/lib/
   cp urhg-lernplattform-v2/src/pages/dashboard.tsx src/pages/
   cp urhg-lernplattform-v2/src/pages/modules/[id].tsx src/pages/modules/
   mkdir -p src/pages/certificate
   cp urhg-lernplattform-v2/src/pages/certificate/[area].tsx src/pages/certificate/
   ```

2. **Dependencies installieren (falls nötig):**
   ```bash
   npm install lucide-react
   ```

3. **Firebase-Daten migrieren:**
   ```bash
   # Erst Dry-Run (zeigt was passiert)
   node migrations/migrateTo2Areas.js dry-run
   
   # Dann echte Migration
   node migrations/migrateTo2Areas.js migrate
   ```

4. **Testen:**
   ```bash
   npm run dev
   # Öffne http://localhost:3000
   ```

5. **Deployment:**
   ```bash
   npm run build
   vercel --prod
   ```

## 📚 Dokumentation

### Ausführliche Anleitungen
- **[MIGRATION_GUIDE.md](docs/MIGRATION_GUIDE.md)**: Detaillierte Migrations-Anleitung mit Rollback-Optionen
- **[QUICK_START.md](docs/QUICK_START.md)**: Schnelleinstieg, Verwendung und Best Practices

### Wichtige Konzepte

#### Content-Struktur
```typescript
// Lernbereiche definieren
export const learningAreas = {
  grundlagen: {
    id: 'grundlagen',
    title: 'Grundlagen',
    maxPoints: 400,
    modules: ['modul1', 'modul2', 'modul3', 'modul4']
  },
  schulumgebung: {
    id: 'schulumgebung',
    title: 'Schulumgebung',
    maxPoints: 450,
    modules: ['schule1', 'schule2', 'schule3', 'schule4', 'schule5']
  }
}
```

#### Firebase-Datenstruktur
```javascript
{
  lernname: "Max Muster",
  code: "ABC123",
  totalPoints: 850,          // Summe aller Punkte
  overallProgress: 100,      // Gesamtfortschritt in %
  modules: {
    // Bereich Grundlagen
    modul1: { completed: true, score: 95, progress: 100 },
    modul2: { completed: true, score: 88, progress: 100 },
    modul3: { completed: true, score: 92, progress: 100 },
    modul4: { completed: true, score: 85, progress: 100 },
    
    // Bereich Schulumgebung
    schule1: { completed: true, score: 100, progress: 100 },
    schule2: { completed: true, score: 85, progress: 100 },
    schule3: { completed: true, score: 95, progress: 100 },
    schule4: { completed: true, score: 75, progress: 100 },
    schule5: { completed: true, score: 80, progress: 100 }
  }
}
```

## 🔧 Anpassungen

### Eigene Inhalte hinzufügen

**1. Neues Modul erstellen:**
```typescript
// In src/lib/moduleContent.ts
schule6: {
  id: 'schule6',
  area: 'schulumgebung',
  title: 'Ihr Thema',
  description: 'Ihre Beschreibung',
  duration: '~15 Min.',
  maxPoints: 80,
  // ... weitere Eigenschaften
}
```

**2. Modul registrieren:**
```typescript
export const learningAreas = {
  schulumgebung: {
    modules: [..., 'schule6'], // Hinzufügen
    maxPoints: 530 // Anpassen: 450 + 80
  }
}
```

**3. Punktzahl anpassen:**
```typescript
// In Dashboard und Modul-Seiten:
const TOTAL_MAX_POINTS = 930 // 400 + 530
```

### Styling anpassen

**Farben:**
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#0050a0', // Hauptfarbe anpassen
    }
  }
}
```

**Logo/Branding:**
```typescript
// In Header-Komponenten
<h1>Ihr Titel</h1>
<p>Ihr Untertitel</p>
```

## 🎯 Roadmap

Mögliche zukünftige Erweiterungen:

- [ ] Video-Integration (YouTube, Vimeo)
- [ ] Audio-Aufnahmen für Intro-Sektionen
- [ ] Interaktive Diagramme und Visualisierungen
- [ ] Gamification: Badges und Achievements
- [ ] Leaderboard (optional, datenschutzkonform)
- [ ] Export-Funktion für Lernfortschritt
- [ ] Mehrsprachigkeit (Französisch, Italienisch)
- [ ] Mobile App (React Native)
- [ ] Offline-Modus

## 🐛 Troubleshooting

### Häufige Probleme

**Q: Module werden nicht angezeigt**
```bash
# Lösung: Cache leeren
rm -rf .next
npm run dev
```

**Q: Fortschritt wird nicht gespeichert**
```bash
# Lösung: Firebase Rules prüfen
firebase firestore:rules get

# Sollte sein:
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}
```

**Q: Zertifikat nicht verfügbar trotz Abschluss**
```javascript
// Debug: Fortschritt prüfen
const progress = getAreaProgress('grundlagen', userData.modules)
console.log(progress) // progress.progress muss 100 sein
```

**Q: Migration schlägt fehl**
```bash
# Lösung: Dry-Run durchführen
node migrations/migrateTo2Areas.js dry-run

# Logs prüfen und spezifische Fehler beheben
```

## 📊 Analytics & Monitoring

### User-Fortschritt überwachen

```javascript
// Firebase Console Query
const stats = await db.collection('users')
  .get()
  .then(snapshot => {
    let completed = 0
    snapshot.forEach(doc => {
      if (doc.data().overallProgress === 100) completed++
    })
    return {
      total: snapshot.size,
      completed,
      rate: (completed / snapshot.size * 100).toFixed(1) + '%'
    }
  })
```

### Performance-Metriken

- Durchschnittliche Punktzahl pro Modul
- Completion-Rate pro Bereich
- Durchschnittliche Zeit pro Modul
- Drop-off Points identifizieren

## 🤝 Unterstützung

### Ressourcen
- 📖 Ausführliche Doku: `docs/MIGRATION_GUIDE.md`
- ⚡ Quick Start: `docs/QUICK_START.md`
- 🔧 Migrations-Script: `migrations/migrateTo2Areas.js`

### Bei Problemen
1. Prüfen Sie die Browser-Console (F12)
2. Prüfen Sie Firebase-Logs
3. Prüfen Sie Vercel-Deployment-Logs
4. Kontaktieren Sie Support

## 📝 Changelog

### Version 2.0 (26. Dezember 2024)
- ✨ **NEU**: Zweiter Lernbereich "Schulumgebung" (450 Punkte)
- ✨ **NEU**: Rollenspezifische Inhalte für verschiedene Schulakteure
- ✨ **NEU**: Einstiegsinfo-Sektion mit Multimedia-Platzhaltern
- ✨ **NEU**: Reset-Funktionalität pro Modul
- ✨ **NEU**: Fisher-Yates Shuffle für Quiz-Optionen
- ✨ **NEU**: Zwei separate Zertifikate (pro Bereich)
- 🔧 **VERBESSERT**: Dashboard mit Zwei-Bereich-Ansicht
- 🔧 **VERBESSERT**: Erweiterte Modul-Seite mit mehr Interaktivität
- 📚 **DOKU**: Ausführliche Migrations- und Quick-Start-Guides

### Version 1.0 (ursprünglich)
- 📚 Ein Lernbereich "Grundlagen" (400 Punkte)
- 🎯 4 Module: Prinzipien, Freie Werke, Zitatrecht, KI
- 🏆 Ein Zertifikat bei Abschluss
- 🔐 Firebase-Authentifizierung
- 📊 Dashboard mit Fortschrittsanzeige

## 📄 Lizenz

[Ihre Lizenz hier einfügen]

## 👏 Credits

Entwickelt für Schweizer Schulen zur Vermittlung von Urheberrechtswissen gemäß:
- **URG**: Schweizer Urheberrechtsgesetz
- **GT7**: Gemeinsamer Tarif 7 für Bildungseinrichtungen

---

**Version:** 2.0  
**Letzte Aktualisierung:** 26. Dezember 2024  
**Kompatibilität:** Next.js, Firebase, Vercel

🎓 Viel Erfolg beim Lehren und Lernen! 🎉
