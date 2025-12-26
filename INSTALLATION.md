# Installation der Urheberrecht Lernplattform v2.0

Diese Anleitung führt Sie Schritt für Schritt durch die Installation und Konfiguration der erweiterten Lernplattform.

## 📋 Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass Sie Folgendes installiert haben:

- **Node.js** 18.x oder höher ([Download](https://nodejs.org/))
- **npm** oder **yarn** (wird mit Node.js installiert)
- **Git** ([Download](https://git-scm.com/))
- Ein **Firebase-Konto** ([Erstellen](https://firebase.google.com/))
- Optional: **Vercel-Konto** für Deployment ([Erstellen](https://vercel.com/))

## 🚀 Schritt 1: Projekt einrichten

### Variante A: Neue Installation

```bash
# Projekt-Verzeichnis erstellen und Dateien extrahieren
unzip urhg-lernplattform-v2-complete.zip
cd urhg-lernplattform-v2-complete

# Dependencies installieren
npm install

# ODER mit yarn
yarn install
```

### Variante B: In bestehendes Projekt integrieren

```bash
# Backup des bestehenden Projekts erstellen
cp -r src src.backup

# Neue Dateien kopieren (überschreibt alte Versionen)
cp urhg-lernplattform-v2-complete/src/lib/moduleContent.ts src/lib/
cp urhg-lernplattform-v2-complete/src/pages/dashboard.tsx src/pages/
cp urhg-lernplattform-v2-complete/src/pages/modules/[id].tsx src/pages/modules/
mkdir -p src/pages/certificate
cp urhg-lernplattform-v2-complete/src/pages/certificate/[area].tsx src/pages/certificate/

# Dependencies aktualisieren
npm install lucide-react@latest
```

## 🔥 Schritt 2: Firebase-Projekt einrichten

### 2.1 Firebase-Projekt erstellen

1. Gehen Sie zu [Firebase Console](https://console.firebase.google.com/)
2. Klicken Sie auf "Projekt hinzufügen"
3. Geben Sie einen Projektnamen ein (z.B. "urhg-lernplattform")
4. Optional: Google Analytics aktivieren
5. Klicken Sie auf "Projekt erstellen"

### 2.2 Web-App registrieren

1. In der Projektübersicht, klicken Sie auf das Web-Icon (`</>`)
2. Geben Sie einen App-Spitznamen ein (z.B. "Lernplattform Web")
3. Optional: Firebase Hosting einrichten (empfohlen für Vercel)
4. Klicken Sie auf "App registrieren"
5. **Kopieren Sie die Firebase-Konfiguration** - Sie benötigen diese gleich!

### 2.3 Firestore Database einrichten

1. In der Firebase Console, gehen Sie zu "Firestore Database"
2. Klicken Sie auf "Datenbank erstellen"
3. Wählen Sie **"Im Produktionsmodus starten"** (Sicherheitsregeln werden später konfiguriert)
4. Wählen Sie einen Standort (z.B. "europe-west3" für Frankfurt)
5. Klicken Sie auf "Aktivieren"

### 2.4 Authentication einrichten

1. Gehen Sie zu "Authentication" → "Sign-in method"
2. Aktivieren Sie "E-Mail/Passwort" als Anbieter
3. Optional: Aktivieren Sie "E-Mail-Link (passwortlose Anmeldung)"
4. Speichern Sie die Änderungen

### 2.5 Sicherheitsregeln konfigurieren

1. Gehen Sie zu "Firestore Database" → "Regeln"
2. Ersetzen Sie den Inhalt mit dem aus `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users können nur ihre eigenen Daten lesen und schreiben
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Globale Statistiken (optional)
    match /stats/{document=**} {
      allow read: if request.auth != null;
      allow write: if false; // Nur über Cloud Functions
    }
  }
}
```

3. Klicken Sie auf "Veröffentlichen"

## 🔧 Schritt 3: Umgebungsvariablen konfigurieren

### 3.1 .env.local erstellen

```bash
# Kopieren Sie die Beispieldatei
cp .env.example .env.local

# Öffnen Sie .env.local in Ihrem Editor
nano .env.local
# ODER
code .env.local
```

### 3.2 Firebase-Credentials eintragen

Ersetzen Sie die Platzhalter mit Ihren echten Firebase-Werten:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=ihr-projekt-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=ihr-projekt-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=ihr-projekt-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

**Wo finde ich diese Werte?**
1. Firebase Console → Projekteinstellungen (⚙️ oben links)
2. Scrollen Sie zu "Ihre Apps" → Ihre Web-App
3. Klicken Sie auf "SDK-Einrichtung und -Konfiguration"
4. Wählen Sie "Konfiguration"
5. Kopieren Sie die Werte in Ihre `.env.local`

## 🧪 Schritt 4: Entwicklungsserver starten

```bash
# Entwicklungsserver starten
npm run dev

# ODER mit yarn
yarn dev
```

Öffnen Sie [http://localhost:3000](http://localhost:3000) in Ihrem Browser.

### 4.1 Ersten Benutzer erstellen

1. Klicken Sie auf "Registrieren"
2. Geben Sie einen Lernnamen ein
3. Die App generiert automatisch einen 6-stelligen Code
4. **Wichtig**: Notieren Sie sich den Code - er wird für die Anmeldung benötigt!

### 4.2 Testen

- ✅ Registrierung funktioniert
- ✅ Login mit Code funktioniert
- ✅ Dashboard zeigt beide Bereiche (Grundlagen + Schulumgebung)
- ✅ Module können geöffnet werden
- ✅ Quiz funktioniert
- ✅ Fortschritt wird gespeichert

## 📦 Schritt 5: Build und Produktion

### 5.1 Production Build erstellen

```bash
# Build erstellen
npm run build

# Build testen
npm start
```

Prüfen Sie, dass alles funktioniert:
- Keine TypeScript-Fehler
- Keine Build-Fehler
- Alle Seiten laden korrekt

## 🚢 Schritt 6: Deployment auf Vercel

### 6.1 Vercel einrichten

```bash
# Vercel CLI installieren (falls noch nicht geschehen)
npm i -g vercel

# In Ihr Projekt-Verzeichnis wechseln
cd urhg-lernplattform-v2-complete

# Deployment starten
vercel
```

### 6.2 Deployment-Konfiguration

Folgen Sie den Prompts:

1. **Set up and deploy?** → Yes
2. **Which scope?** → Wählen Sie Ihren Account
3. **Link to existing project?** → No (bei Erstinstallation)
4. **Project name?** → urhg-lernplattform (oder Ihr gewünschter Name)
5. **Directory?** → ./ (Enter drücken)
6. **Override settings?** → No (Enter drücken)

### 6.3 Umgebungsvariablen in Vercel setzen

```bash
# Alle Umgebungsvariablen setzen
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID
```

Oder in der Vercel Dashboard:
1. Gehen Sie zu [vercel.com/dashboard](https://vercel.com/dashboard)
2. Wählen Sie Ihr Projekt
3. Gehen Sie zu "Settings" → "Environment Variables"
4. Fügen Sie jede Variable einzeln hinzu

### 6.4 Production Deployment

```bash
# Production Deployment
vercel --prod
```

Ihre App ist jetzt live unter: `https://ihr-projekt.vercel.app`

## 🔄 Schritt 7: Daten-Migration (für bestehende Installationen)

Wenn Sie von Version 1.0 auf 2.0 upgraden:

### 7.1 Backup erstellen

```bash
# Mit Firebase CLI
firebase firestore:export gs://ihr-bucket/backups/$(date +%Y%m%d)

# ODER manuell in Firebase Console:
# Firestore Database → Daten exportieren
```

### 7.2 Migrations-Script ausführen

```bash
# Erst Dry-Run (zeigt was passieren würde)
node migrations/migrateTo2Areas.js dry-run

# Wenn alles OK aussieht, echte Migration
node migrations/migrateTo2Areas.js migrate
```

### 7.3 Verifizierung

```bash
# Prüfen Sie einige User in der Firebase Console
# Firestore Database → users → [user-id]

# Sollte enthalten:
# - modules.modul1 bis modul4 (alte Daten)
# - modules.schule1 bis schule5 (neu initialisiert)
# - totalPoints (korrekt berechnet)
# - overallProgress (% von 850)
```

## 🔒 Schritt 8: Sicherheit (Wichtig für Produktion!)

### 8.1 Firebase Security

1. **Firestore Rules prüfen**:
   ```bash
   firebase firestore:rules get
   ```
   Sollte nur User-spezifischen Zugriff erlauben

2. **Authentication-Einstellungen**:
   - Beschränken Sie zugelassene Domains in Firebase Console
   - Aktivieren Sie E-Mail-Verifizierung (optional)

3. **API Keys schützen**:
   - Firebase API Keys sind öffentlich - das ist OK!
   - Sicherheit wird durch Firestore Rules gewährleistet
   - NIEMALS Service Account Keys committen!

### 8.2 Vercel Security

1. **Environment Variables**:
   - Nur NEXT_PUBLIC_* Variablen sind im Client sichtbar
   - Sensible Daten (z.B. Service Account) nur als Server-Only Variables

2. **Domain-Einstellungen**:
   - Fügen Sie Ihre eigene Domain hinzu
   - Aktivieren Sie automatisches HTTPS

## 📊 Schritt 9: Monitoring einrichten (Optional)

### 9.1 Firebase Analytics

```javascript
// Optional in firebase.ts hinzufügen:
import { getAnalytics } from 'firebase/analytics'

// Nach app-Initialisierung:
if (typeof window !== 'undefined') {
  const analytics = getAnalytics(app)
}
```

### 9.2 Vercel Analytics

```bash
npm install @vercel/analytics

# In _app.tsx hinzufügen:
import { Analytics } from '@vercel/analytics/react'

// In Component:
<Analytics />
```

## ✅ Installations-Checkliste

Prüfen Sie, ob alles funktioniert:

- [ ] Node.js und npm installiert
- [ ] Projekt-Dateien extrahiert
- [ ] Dependencies installiert (`npm install`)
- [ ] Firebase-Projekt erstellt
- [ ] Firestore Database aktiviert
- [ ] Authentication konfiguriert
- [ ] Sicherheitsregeln gesetzt
- [ ] `.env.local` mit korrekten Werten erstellt
- [ ] Development Server läuft (`npm run dev`)
- [ ] Erster Benutzer erfolgreich erstellt
- [ ] Beide Lernbereiche im Dashboard sichtbar
- [ ] Module funktionieren und speichern Fortschritt
- [ ] Quiz funktioniert mit randomisierten Antworten
- [ ] Build erfolgreich (`npm run build`)
- [ ] Auf Vercel deployed
- [ ] Umgebungsvariablen in Vercel gesetzt
- [ ] Production-URL funktioniert
- [ ] (Falls Upgrade) Daten migriert

## 🆘 Troubleshooting

### Problem: "Module not found" Fehler

```bash
# Lösung: Dependencies neu installieren
rm -rf node_modules package-lock.json
npm install
```

### Problem: Firebase Connection Error

```bash
# Prüfen Sie Ihre .env.local Datei
cat .env.local

# Stellen Sie sicher, dass alle Werte korrekt sind
# Keine Leerzeichen, keine Anführungszeichen
```

### Problem: "Permission denied" in Firestore

```bash
# Prüfen Sie die Firestore Rules
firebase firestore:rules get

# Sollte users/{userId} read/write mit auth.uid check erlauben
```

### Problem: Build schlägt fehl

```bash
# TypeScript Fehler prüfen
npm run type-check

# Cache leeren
rm -rf .next
npm run build
```

### Problem: Deployment schlägt fehl

```bash
# Logs prüfen
vercel logs

# Umgebungsvariablen prüfen
vercel env ls
```

## 📚 Weitere Ressourcen

- **Dokumentation**: Siehe `docs/` Ordner
  - `QUICK_START.md` - Schnelleinstieg
  - `MIGRATION_GUIDE.md` - Detaillierte Migration
- **Firebase Docs**: https://firebase.google.com/docs
- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs

## 🎓 Nächste Schritte

Nach erfolgreicher Installation:

1. **Content anpassen**: Bearbeiten Sie `src/lib/moduleContent.ts`
2. **Styling anpassen**: Bearbeiten Sie `tailwind.config.js` und `src/styles/globals.css`
3. **Multimedia hinzufügen**: Ersetzen Sie Platzhalter mit echten Videos/Audios
4. **Benutzer einladen**: Teilen Sie die URL und Registrierungsanleitung

---

**Version:** 2.0  
**Letztes Update:** 26. Dezember 2024

Bei Fragen oder Problemen, konsultieren Sie die Dokumentation oder prüfen Sie die Troubleshooting-Sektion.

Viel Erfolg! 🚀
