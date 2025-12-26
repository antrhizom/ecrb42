/**
 * Migrations-Script für die Zwei-Bereich-Struktur
 * 
 * Dieses Script migriert bestehende User-Daten von der Ein-Bereich-Struktur
 * (Grundlagen, 400 Punkte) zur Zwei-Bereich-Struktur
 * (Grundlagen + Schulumgebung, 850 Punkte)
 * 
 * WICHTIG: Erstellen Sie vor der Ausführung ein Backup!
 */

const admin = require('firebase-admin');

// Firebase Admin initialisieren
// OPTION 1: Mit Service Account
// const serviceAccount = require('./path/to/serviceAccountKey.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

// OPTION 2: Mit Application Default Credentials
admin.initializeApp();

const db = admin.firestore();

/**
 * Hauptfunktion für die Migration
 */
async function migrateUsers() {
  console.log('🚀 Starte Migration zur Zwei-Bereich-Struktur...');
  
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    if (snapshot.empty) {
      console.log('⚠️  Keine User gefunden');
      return;
    }
    
    console.log(`📊 Gefunden: ${snapshot.size} User`);
    
    const batch = db.batch();
    let migrated = 0;
    let alreadyMigrated = 0;
    let errors = 0;
    
    snapshot.forEach(doc => {
      try {
        const data = doc.data();
        const modules = data.modules || {};
        
        // Prüfe, ob bereits migriert
        if (modules.schule1 && modules.schule2 && modules.schule3 && modules.schule4 && modules.schule5) {
          alreadyMigrated++;
          return;
        }
        
        // Erstelle neue Module mit Defaults
        const newModules = {
          // Bereich Grundlagen (bleibt unverändert)
          modul1: modules.modul1 || { completed: false, score: 0, progress: 0 },
          modul2: modules.modul2 || { completed: false, score: 0, progress: 0 },
          modul3: modules.modul3 || { completed: false, score: 0, progress: 0 },
          modul4: modules.modul4 || { completed: false, score: 0, progress: 0 },
          
          // Bereich Schulumgebung (neu)
          schule1: modules.schule1 || { completed: false, score: 0, progress: 0 },
          schule2: modules.schule2 || { completed: false, score: 0, progress: 0 },
          schule3: modules.schule3 || { completed: false, score: 0, progress: 0 },
          schule4: modules.schule4 || { completed: false, score: 0, progress: 0 },
          schule5: modules.schule5 || { completed: false, score: 0, progress: 0 }
        };
        
        // Berechne Gesamtpunkte über alle Module
        let totalPoints = 0;
        Object.values(newModules).forEach(m => {
          totalPoints += m.score || 0;
        });
        
        // Berechne Gesamtfortschritt (850 = max Punkte für beide Bereiche)
        const newOverallProgress = Math.round((totalPoints / 850) * 100);
        
        // Update-Daten
        const updateData = {
          modules: newModules,
          totalPoints: totalPoints,
          overallProgress: newOverallProgress,
          // Füge Migrations-Timestamp hinzu
          migratedAt: admin.firestore.FieldValue.serverTimestamp(),
          migratedToVersion: '2.0'
        };
        
        batch.update(doc.ref, updateData);
        migrated++;
        
        // Log für jeden User
        console.log(`  ✓ ${data.lernname} (${data.code}): ${totalPoints}/850 Punkte (${newOverallProgress}%)`);
        
      } catch (error) {
        console.error(`  ✗ Fehler bei User ${doc.id}:`, error.message);
        errors++;
      }
    });
    
    // Batch ausführen
    if (migrated > 0) {
      console.log('\n💾 Speichere Änderungen...');
      await batch.commit();
      console.log('✅ Änderungen erfolgreich gespeichert!');
    }
    
    // Zusammenfassung
    console.log('\n📈 Migrations-Zusammenfassung:');
    console.log(`  ✓ Erfolgreich migriert: ${migrated}`);
    console.log(`  ⊘ Bereits migriert: ${alreadyMigrated}`);
    console.log(`  ✗ Fehler: ${errors}`);
    console.log(`  📊 Gesamt: ${snapshot.size}`);
    
    if (errors > 0) {
      console.log('\n⚠️  Es gab Fehler bei der Migration. Bitte prüfen Sie die Logs.');
    }
    
  } catch (error) {
    console.error('\n❌ Migration fehlgeschlagen:', error);
    throw error;
  }
}

/**
 * Rollback-Funktion (entfernt Schulumgebung-Module)
 */
async function rollback() {
  console.log('🔄 Starte Rollback...');
  
  try {
    const usersRef = db.collection('users');
    const snapshot = await usersRef.get();
    
    if (snapshot.empty) {
      console.log('⚠️  Keine User gefunden');
      return;
    }
    
    const batch = db.batch();
    let rolledBack = 0;
    
    snapshot.forEach(doc => {
      const data = doc.data();
      const modules = data.modules || {};
      
      // Entferne Schulumgebung-Module
      const newModules = {
        modul1: modules.modul1,
        modul2: modules.modul2,
        modul3: modules.modul3,
        modul4: modules.modul4
      };
      
      // Berechne Punkte nur für Grundlagen
      let totalPoints = 0;
      Object.values(newModules).forEach(m => {
        totalPoints += m?.score || 0;
      });
      
      const newOverallProgress = Math.round((totalPoints / 400) * 100);
      
      batch.update(doc.ref, {
        modules: newModules,
        totalPoints: totalPoints,
        overallProgress: newOverallProgress,
        rolledBackAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      rolledBack++;
    });
    
    await batch.commit();
    console.log(`✅ Rollback abgeschlossen: ${rolledBack} User`);
    
  } catch (error) {
    console.error('❌ Rollback fehlgeschlagen:', error);
    throw error;
  }
}

/**
 * Dry-Run (zeigt was passieren würde ohne zu speichern)
 */
async function dryRun() {
  console.log('🔍 Dry-Run: Zeige was passieren würde...\n');
  
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();
  
  if (snapshot.empty) {
    console.log('⚠️  Keine User gefunden');
    return;
  }
  
  let toMigrate = 0;
  let alreadyMigrated = 0;
  
  snapshot.forEach(doc => {
    const data = doc.data();
    const modules = data.modules || {};
    
    if (modules.schule1 && modules.schule2 && modules.schule3 && modules.schule4 && modules.schule5) {
      alreadyMigrated++;
      console.log(`  ⊘ ${data.lernname} (${data.code}) - Bereits migriert`);
    } else {
      toMigrate++;
      const currentPoints = Object.values(modules).reduce((sum, m) => sum + (m?.score || 0), 0);
      console.log(`  → ${data.lernname} (${data.code}) - Würde migriert (${currentPoints}/400 → ${currentPoints}/850 Punkte)`);
    }
  });
  
  console.log(`\n📊 Zusammenfassung:`);
  console.log(`  → Zu migrieren: ${toMigrate}`);
  console.log(`  ⊘ Bereits migriert: ${alreadyMigrated}`);
  console.log(`  📊 Gesamt: ${snapshot.size}`);
}

// Command-Line Interface
const command = process.argv[2];

switch (command) {
  case 'migrate':
    migrateUsers()
      .then(() => {
        console.log('\n✨ Migration erfolgreich abgeschlossen!');
        process.exit(0);
      })
      .catch(err => {
        console.error('\n❌ Migration fehlgeschlagen:', err);
        process.exit(1);
      });
    break;
    
  case 'rollback':
    rollback()
      .then(() => {
        console.log('\n✨ Rollback erfolgreich abgeschlossen!');
        process.exit(0);
      })
      .catch(err => {
        console.error('\n❌ Rollback fehlgeschlagen:', err);
        process.exit(1);
      });
    break;
    
  case 'dry-run':
    dryRun()
      .then(() => process.exit(0))
      .catch(err => {
        console.error('❌ Dry-Run fehlgeschlagen:', err);
        process.exit(1);
      });
    break;
    
  default:
    console.log(`
📋 Verwendung:
  node migrateTo2Areas.js [command]

Befehle:
  migrate   - Führt die Migration durch
  rollback  - Macht die Migration rückgängig
  dry-run   - Zeigt was passieren würde (ohne Änderungen)

Beispiel:
  node migrateTo2Areas.js dry-run    # Erst testen
  node migrateTo2Areas.js migrate    # Dann migrieren
  node migrateTo2Areas.js rollback   # Bei Bedarf zurückrollen
    `);
    process.exit(0);
}
