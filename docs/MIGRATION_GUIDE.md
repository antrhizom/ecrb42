# Migration zur Zwei-Bereich-Struktur (Grundlagen + Schulumgebung)

## Überblick

Diese Version erweitert die Lernplattform von einem einzelnen Bereich (Grundlagen mit 4 Modulen, 400 Punkte) auf **zwei Lernbereiche** mit insgesamt **850 Punkten**:

### Bereich 1: Grundlagen (400 Punkte)
- **Modul 1**: Prinzipien Urheberrecht (100 Punkte)
- **Modul 2**: Freie Werke (100 Punkte)
- **Modul 3**: Zitatrecht (100 Punkte)
- **Modul 4**: KI und Urheberrecht - Allgemein (100 Punkte)

### Bereich 2: Schulumgebung (450 Punkte)
- **Thema 1**: Art. 19 URG und GT7 - Grundlagen (100 Punkte)
- **Thema 2**: Lehrmittel - Verwendung und Erstellung (90 Punkte)
- **Thema 3**: GT7 Praxisanwendung (100 Punkte)
- **Thema 4**: Dokumentationen und Schülerarbeiten (80 Punkte)
- **Thema 5**: KI in der Schule (80 Punkte)

## Neue Features

### 1. Zwei-Bereich-Dashboard
- Separate Fortschrittsanzeige für beide Bereiche
- Gesamtfortschritt über alle Bereiche
- Direkter Zugriff auf Zertifikate pro Bereich

### 2. Rollenspezifische Inhalte (Schulumgebung)
Jedes Schulumgebungs-Modul spricht verschiedene Akteure an:
- 👩‍🏫 **Lehrpersonen**: Fokus auf Unterrichtspraxis
- 🏢 **Schulleitungen & Sekretariate**: Organisation und Verwaltung
- 🎓 **Lernende**: Eigene Arbeiten und Rechte
- 📚 **Bibliothek & Mediothek**: Medienbereitstellung
- 💻 **IT-Verantwortliche**: Technische Umsetzung
- 📋 **Verwaltung**: Administrative Nutzung

### 3. Einstiegsinfo-Sektion
Jedes Modul beginnt mit einer Multimedia-Sektion (Video/Audio/Slides):
- Platzhalter für zukünftige Video-Integration
- Einführung in das Thema
- Motivierender Einstieg

### 4. Reset-Funktionalität
- Nutzer können ihren Fortschritt pro Modul zurücksetzen
- Punkte werden neu berechnet
- Quiz-Fragen werden neu gemischt
- Bestätigungsdialog verhindert versehentliches Zurücksetzen

### 5. Fisher-Yates Shuffle für Quiz
- Quiz-Optionen werden bei jedem Durchlauf zufällig gemischt
- Verhindert Lernmuster durch feste Antwortpositionen
- Fördert echtes Verständnis statt Auswendiglernen

### 6. Zwei Zertifikate
- Pro Bereich ein eigenes Zertifikat
- Druckfunktion (A4 Landscape)
- Detaillierte Leistungsübersicht
- Nur bei 100% Abschluss des Bereichs verfügbar

## Datei-Struktur

```
src/
├── lib/
│   ├── firebase.ts (unverändert)
│   ├── moduleContent.ts (alte Version)
│   └── moduleContentNew.ts (NEU: erweiterte Content-Struktur)
├── pages/
│   ├── index.tsx (unverändert)
│   ├── dashboard.tsx (alte Version)
│   ├── dashboardNew.tsx (NEU: Zwei-Bereich-Dashboard)
│   ├── certificate/
│   │   └── [area].tsx (NEU: dynamische Zertifikatsseite)
│   └── modules/
│       ├── [id].tsx (alte Version)
│       └── [id]New.tsx (NEU: erweiterte Modul-Seite)
```

## Migration bestehender Daten

### Firebase Datenstruktur

**ALT:**
```javascript
{
  lernname: "Max Muster",
  code: "ABC123",
  totalPoints: 350,
  overallProgress: 87,
  modules: {
    modul1: { completed: true, score: 95, progress: 100 },
    modul2: { completed: true, score: 88, progress: 100 },
    modul3: { completed: true, score: 92, progress: 100 },
    modul4: { completed: true, score: 75, progress: 100 },
    modul5: { completed: false, score: 0, progress: 0 }
  }
}
```

**NEU:**
```javascript
{
  lernname: "Max Muster",
  code: "ABC123",
  totalPoints: 350, // Bleibt gleich, alte Module zählen weiter
  overallProgress: 41, // Neu berechnet: 350 / 850 * 100
  modules: {
    // Bereich Grundlagen (bleibt gleich)
    modul1: { completed: true, score: 95, progress: 100 },
    modul2: { completed: true, score: 88, progress: 100 },
    modul3: { completed: true, score: 92, progress: 100 },
    modul4: { completed: true, score: 75, progress: 100 },
    
    // Bereich Schulumgebung (neu initialisiert)
    schule1: { completed: false, score: 0, progress: 0 },
    schule2: { completed: false, score: 0, progress: 0 },
    schule3: { completed: false, score: 0, progress: 0 },
    schule4: { completed: false, score: 0, progress: 0 },
    schule5: { completed: false, score: 0, progress: 0 }
  }
}
```

### Migrations-Script

Führen Sie folgendes Script aus, um bestehende User-Daten zu migrieren:

```javascript
// migrations/migrateTo2Areas.js
const admin = require('firebase-admin');

async function migrateUsers() {
  const db = admin.firestore();
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();
  
  const batch = db.batch();
  let count = 0;
  
  snapshot.forEach(doc => {
    const data = doc.data();
    const modules = data.modules || {};
    
    // Füge neue Module hinzu, wenn sie nicht existieren
    const newModules = {
      ...modules,
      schule1: modules.schule1 || { completed: false, score: 0, progress: 0 },
      schule2: modules.schule2 || { completed: false, score: 0, progress: 0 },
      schule3: modules.schule3 || { completed: false, score: 0, progress: 0 },
      schule4: modules.schule4 || { completed: false, score: 0, progress: 0 },
      schule5: modules.schule5 || { completed: false, score: 0, progress: 0 }
    };
    
    // Berechne neue Gesamtpunkte und Fortschritt
    let totalPoints = 0;
    Object.values(newModules).forEach(m => {
      totalPoints += m.score || 0;
    });
    
    const newOverallProgress = Math.round((totalPoints / 850) * 100);
    
    batch.update(doc.ref, {
      modules: newModules,
      totalPoints: totalPoints,
      overallProgress: newOverallProgress
    });
    
    count++;
  });
  
  await batch.commit();
  console.log(`Successfully migrated ${count} users`);
}

// Ausführen
migrateUsers()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Migration error:', err);
    process.exit(1);
  });
```

## Deployment-Schritte

### 1. Code-Update
```bash
# Ersetzen Sie die alten Dateien durch die neuen:
cp src/lib/moduleContentNew.ts src/lib/moduleContent.ts
cp src/pages/dashboardNew.tsx src/pages/dashboard.tsx
cp src/pages/modules/[id]New.tsx src/pages/modules/[id].tsx

# Oder benennen Sie die neuen Dateien um:
mv src/lib/moduleContentNew.ts src/lib/moduleContent.ts
mv src/pages/dashboardNew.tsx src/pages/dashboard.tsx
mv src/pages/modules/[id]New.tsx src/pages/modules/[id].tsx
```

### 2. Daten-Migration
```bash
# Führen Sie das Migrations-Script aus:
node migrations/migrateTo2Areas.js
```

### 3. Test
- Testen Sie mit einem Test-User
- Prüfen Sie beide Lernbereiche
- Testen Sie Reset-Funktionalität
- Testen Sie Zertifikats-Generierung

### 4. Deployment
```bash
# Build und Deploy
npm run build
vercel --prod
```

## Rollback-Plan

Falls Probleme auftreten:

1. **Code zurücksetzen:**
   ```bash
   git revert HEAD
   git push
   ```

2. **Daten zurücksetzen:**
   - Nutzen Sie Firebase-Backups
   - Oder entfernen Sie die neuen Module manuell:
   ```javascript
   const batch = db.batch();
   snapshot.forEach(doc => {
     const modules = doc.data().modules;
     delete modules.schule1;
     delete modules.schule2;
     delete modules.schule3;
     delete modules.schule4;
     delete modules.schule5;
     
     batch.update(doc.ref, { modules });
   });
   await batch.commit();
   ```

## Wichtige Hinweise

1. **Firestore Rules**: Prüfen Sie, ob Ihre Firestore-Rules aktualisiert werden müssen
2. **Backups**: Erstellen Sie vor der Migration ein vollständiges Backup
3. **Testing**: Testen Sie ausführlich in einer Staging-Umgebung
4. **Kommunikation**: Informieren Sie aktive Nutzer über die Erweiterung

## Content-Update

Die neuen Schulumgebungs-Module basieren auf den hochgeladenen HTML-Dateien:
- **grundlagen.html** → schule1 (Art. 19 URG und GT7)
- **lehrmittel.html** → schule2 (Lehrmittel)
- **gt7.html** → schule3 (GT7 Praxisanwendung)
- **dokumentation.html** → schule4 (Dokumentationen)
- KI-Content wurde neu erstellt für schulspezifischen Kontext → schule5

## Support

Bei Fragen oder Problemen:
1. Prüfen Sie die Browser-Console auf Fehler
2. Prüfen Sie Firebase-Logs
3. Kontaktieren Sie den Support

---

**Version:** 2.0 - Zwei-Bereich-Struktur  
**Datum:** 26. Dezember 2024  
**Kompatibilität:** Firebase, Next.js, Vercel
