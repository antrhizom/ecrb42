// Module Content Data - Erweiterte Version mit zwei Lernbereichen
// Bereich 1: Grundlagen (400 Punkte) - Allgemeines Urheberrecht
// Bereich 2: Schulumgebung (450 Punkte) - Spezifisch für Schulen

export interface QuizQuestion {
  question: string
  multipleCorrect?: boolean // true wenn mehrere Antworten korrekt sein können
  options: {
    text: string
    correct: boolean
    feedback: string
  }[]
}

export interface AccordionItem {
  id: string
  title: string
  icon?: string
  preview: string // Kurze Vorschau (1-2 Sätze)
  content: {
    paragraphs?: string[]
    keyPoints?: string[]
    examples?: {
      title: string
      description: string
      type?: 'success' | 'info' | 'warning'
    }[]
    callout?: {
      type: 'info' | 'warning' | 'success' | 'tip'
      text: string
    }
  }
}

export interface InteractiveElement {
  title: string
  content: {
    text: string
    list: string[]
    example?: {
      type: 'info' | 'warning' | 'success'
      text: string
    }
  }
}

export interface RoleSpecificContent {
  role: string
  icon: string
  description: string
  examples: string[]
}

export interface ModuleContent {
  id: string
  area: 'grundlagen' | 'schulumgebung'
  title: string
  description: string
  duration: string
  videoUrl?: string;  // <--- PASTE THIS NEW LINE HERE
  videoTitle: string
  videoDescription: string
  videoPlaceholder: string // Platzhalter für Video/Film/Ton/Slides
  interactiveTitle: string
  interactiveElements: InteractiveElement[] // Legacy Format
  accordionItems?: AccordionItem[] // Neue aufklappbare Wissenselemente
  roleSpecificContent?: RoleSpecificContent[] // Für Schulumgebung
  quizQuestions: QuizQuestion[]
}

// Typ für Lernbereiche
export interface LearningArea {
  id: 'grundlagen' | 'schulumgebung'
  title: string
  description: string
  maxPoints: number
  modules: string[] // Array von Modul-IDs
}

export const learningAreas: Record<string, LearningArea> = {
  grundlagen: {
    id: 'grundlagen',
    title: 'Grundlagen',
    description: 'Verstehen Sie die Grundprinzipien des Urheberrechts: Von der Entstehung des Schutzes über freie Werke bis zur Nutzung von KI.',
    maxPoints: 400,
    modules: ['modul1', 'modul2', 'modul3', 'modul4']
  },
  schulumgebung: {
    id: 'schulumgebung',
    title: 'Schulumgebung',
    description: 'Lernen Sie die spezifischen Regelungen für Schulen kennen: Art. 19 URG, GT7-Tarife und praktische Anwendung im Schulalltag.',
    maxPoints: 450,
    modules: ['schule1', 'schule2', 'schule3', 'schule4', 'schule5']
  }
}

export const moduleData: Record<string, ModuleContent> = {
  // ========================================
  // BEREICH 1: GRUNDLAGEN (400 Punkte)
  // ========================================
  
  modul1: {
    id: 'modul1',
    area: 'grundlagen',
    title: 'Prinzipien Urheberrecht',
    description: 'Verstehen Sie die Grundlagen: Was ist eine geistige Schöpfung? Wann entsteht Urheberrechtsschutz?',
    duration: '~15 Min.',
    maxPoints: 100,
    videoUrl: 'https://aburossi.github.io/slider/?Id=m1_slides', // <--- This is your new link
    videoTitle: 'Einführung',
    videoDescription: 'Lernen Sie die Grundprinzipien kennen.',
    videoPlaceholder: 'Video wird geladen...',
    interactiveTitle: '🎯 Die zwei Voraussetzungen des Urheberrechtsschutzes',
    interactiveElements: [
      {
        title: '1️⃣ Geistige Schöpfung',
        content: {
          text: 'Das Werk muss Ausdruck menschlicher Kreativität sein.',
          list: [
            'KI-generierte Inhalte ohne menschliche Schöpfung = KEIN Schutz',
            'Rein technische oder wissenschaftliche Inhalte = KEIN Schutz',
            'Menschliche kreative Leistung erforderlich'
          ],
          example: {
            type: 'info',
            text: '💡 Beispiel: Ein Computerprogramm ist geschützt, aber nur wenn ein Mensch es geschrieben hat - nicht wenn es von KI automatisch generiert wurde.'
          }
        }
      },
      {
        title: '2️⃣ Individueller Charakter',
        content: {
          text: 'Das Werk muss eine gewisse Originalität aufweisen.',
          list: [
            'Persönliche Prägung des Urhebers erkennbar',
            'Nicht rein handwerklich oder schematisch',
            'Schöpfungshöhe muss erreicht sein'
          ],
          example: {
            type: 'warning',
            text: '⚠️ Grenzfälle: Kurze Slogans, einfache Logos oder Standard-Formulierungen erreichen oft NICHT die Schöpfungshöhe!'
          }
        }
      },
      {
        title: '📸 Sonderfall: Fotografien (Art. 2 Abs. 3bis URG)',
        content: {
          text: 'ALLE Fotografien sind geschützt - auch ohne individuellen Charakter!',
          list: [
            'Einfache Schnappschüsse: 50 Jahre Schutz (ab Herstellung)',
            'Kunstfotografien mit individuellem Charakter: 70 Jahre (nach Tod)',
            'Gilt auch für technische Produktfotos'
          ],
          example: {
            type: 'success',
            text: '✓ Praxis-Tipp: Behandeln Sie JEDES Foto als geschützt, selbst wenn es "nur" ein Handy-Schnappschuss ist!'
          }
        }
      }
    ],
    accordionItems: [
      {
        id: 'grundlagen-schutz',
        title: 'Wann entsteht Urheberrechtsschutz?',
        icon: '⚡',
        preview: 'Der Schutz entsteht automatisch ohne Registrierung oder Anmeldung.',
        content: {
          paragraphs: [
            'In der Schweiz entsteht Urheberrechtsschutz automatisch im Moment der Schöpfung. Es ist keine Registrierung, Anmeldung oder Kennzeichnung erforderlich.',
            'Sobald Sie ein Werk erschaffen haben, sind Sie automatisch dessen Urheber und genießen rechtlichen Schutz - ohne irgendetwas tun zu müssen.'
          ],
          keyPoints: [
            'Keine Registrierung beim Amt nötig',
            'Keine Gebühren zu zahlen',
            'Keine Copyright-Kennzeichnung erforderlich (© ist optional)',
            'Schutz gilt auch für unveröffentlichte Werke'
          ],
          callout: {
            type: 'tip',
            text: 'Tipp: Trotzdem ist es sinnvoll, Ihre Werke mit © Ihrem Namen und Jahr zu kennzeichnen - das erleichtert die Durchsetzung Ihrer Rechte!'
          }
        }
      },
      {
        id: 'schutzfrist',
        title: 'Wie lange gilt der Urheberrechtsschutz?',
        icon: '⏰',
        preview: 'Der Schutz dauert 70 Jahre nach dem Tod des Urhebers.',
        content: {
          paragraphs: [
            'Die Schutzfrist beträgt in der Schweiz grundsätzlich 70 Jahre nach dem Tod des Urhebers (Art. 29 URG).',
            'Nach Ablauf dieser Frist wird das Werk gemeinfrei ("Public Domain") und kann von jedem frei genutzt werden.'
          ],
          keyPoints: [
            'Literarische, künstlerische und musikalische Werke: 70 Jahre nach Tod',
            'Computerprogramme: 70 Jahre nach Tod des Programmierers',
            'Fotografien mit individuellem Charakter: 70 Jahre nach Tod',
            'Einfache Fotografien (Schnappschüsse): 50 Jahre ab Herstellung'
          ],
          examples: [
            {
              title: 'Beispiel: Gemeinfreie Werke',
              description: 'Die Werke von Albert Einstein (†1955) sind seit 2026 gemeinfrei. Die Werke von Max Frisch (†1991) werden 2062 gemeinfrei.',
              type: 'info'
            }
          ]
        }
      },
      {
        id: 'schoepfungshoehe',
        title: 'Was bedeutet "Schöpfungshöhe"?',
        icon: '📏',
        preview: 'Nicht jede kreative Leistung erreicht die nötige Schöpfungshöhe für Urheberrechtsschutz.',
        content: {
          paragraphs: [
            'Schöpfungshöhe bedeutet, dass ein Werk einen gewissen Grad an Originalität und individuellem Charakter aufweisen muss, um urheberrechtlich geschützt zu sein.',
            'Rein handwerkliche oder schematische Arbeiten ohne persönliche Prägung sind nicht geschützt.'
          ],
          keyPoints: [
            'Muss erkennbar vom Urheber geprägt sein',
            'Nicht austauschbar oder rein technisch',
            'Gewisse Originalität erforderlich',
            'Keine mathematische Formel oder klare Grenze'
          ],
          examples: [
            {
              title: '✅ Hat Schöpfungshöhe',
              description: 'Romane, Gemälde, Musikstücke, individuelle Fotografien, kreative Webdesigns, originelle Texte',
              type: 'success'
            },
            {
              title: '❌ Keine Schöpfungshöhe',
              description: 'Kurze Werbeslogans, einfache Listen, Standard-Formulare, reine Datensammlungen, Gebrauchsanleitungen',
              type: 'warning'
            }
          ],
          callout: {
            type: 'info',
            text: 'Im Zweifelsfall: Gerichte entscheiden im Einzelfall. Die Grenze ist oft fließend.'
          }
        }
      },
      {
        id: 'foto-sonderfall',
        title: 'Sonderfall: Fotografien',
        icon: '📸',
        preview: 'ALLE Fotografien sind geschützt - auch einfache Schnappschüsse!',
        content: {
          paragraphs: [
            'Art. 2 Abs. 3bis URG gewährt allen Fotografien Schutz - unabhängig davon, ob sie individuellen Charakter haben oder nicht.',
            'Dies ist eine Besonderheit des schweizerischen Urheberrechts.'
          ],
          keyPoints: [
            'Einfache Fotos (z.B. Handyfotos): 50 Jahre ab Herstellung',
            'Künstlerische Fotos: 70 Jahre nach Tod des Fotografen',
            'Gilt auch für Produktfotos, Dokumentationen, Screenshots'
          ],
          examples: [
            {
              title: 'Praxisrelevant',
              description: 'Selbst ein schnell gemachtes Handyfoto einer Schulveranstaltung ist urheberrechtlich geschützt. Wollen Sie es verwenden, benötigen Sie die Erlaubnis des Fotografen.',
              type: 'warning'
            }
          ],
          callout: {
            type: 'tip',
            text: 'Merksatz: Behandeln Sie JEDES Foto als geschützt!'
          }
        }
      }
    ],
    quizQuestions: [
      {
        question: '1. Wann entsteht Urheberrechtsschutz in der Schweiz?',
        options: [
          {
            text: 'A) Nur nach Registrierung beim Amt',
            correct: false,
            feedback: '❌ Falsch. Urheberrechtsschutz entsteht automatisch mit der Schöpfung - keine Registrierung nötig!'
          },
          {
            text: 'B) Automatisch im Moment der Schöpfung',
            correct: true,
            feedback: '✅ Richtig! Der Schutz entsteht automatisch im Moment der Schöpfung.'
          },
          {
            text: 'C) Erst nach Veröffentlichung',
            correct: false,
            feedback: '❌ Falsch. Eine Veröffentlichung ist nicht erforderlich. Auch unveröffentlichte Werke sind geschützt!'
          }
        ]
      },
      {
        question: '2. Wie lange dauert der Urheberrechtsschutz für literarische Werke?',
        options: [
          {
            text: 'A) 50 Jahre nach Tod des Urhebers',
            correct: false,
            feedback: '❌ Falsch. Das wäre zu kurz. Die Schutzfrist ist länger.'
          },
          {
            text: 'B) 70 Jahre nach Tod des Urhebers',
            correct: true,
            feedback: '✅ Genau! 70 Jahre nach dem Tod des Urhebers (Art. 29 URG).'
          },
          {
            text: 'C) Unbegrenzt / Ewig',
            correct: false,
            feedback: '❌ Falsch. Der Schutz erlischt irgendwann - er ist nicht ewig.'
          }
        ]
      },
      {
        question: '3. Welches Element erreicht typischerweise KEINE Schöpfungshöhe?',
        options: [
          {
            text: 'A) Ein Roman mit eigenem Schreibstil',
            correct: false,
            feedback: '❌ Nicht ganz. Ein Roman mit eigenem Stil hat definitiv individuellen Charakter.'
          },
          {
            text: 'B) Ein kurzer Werbe-Slogan wie "Just Do It"',
            correct: true,
            feedback: '✅ Richtig! Kurze Slogans wie "Just Do It" sind meist zu kurz für Urheberrechtsschutz (aber evtl. markenrechtlich geschützt).'
          },
          {
            text: 'C) Eine Original-Musikkomposition',
            correct: false,
            feedback: '❌ Falsch. Original-Kompositionen sind klar geschützte Werke mit individuellem Charakter.'
          }
        ]
      },
      {
        question: '4. Ein einfaches Handy-Foto von Ihrem Mittagessen - ist es geschützt?',
        options: [
          {
            text: 'A) Nein, weil es zu banal ist',
            correct: false,
            feedback: '❌ Falsch! Die Sonderregel für Fotos gilt für ALLE Fotos.'
          },
          {
            text: 'B) Ja, für 50 Jahre ab Herstellung',
            correct: true,
            feedback: '✅ Genau! Art. 2 Abs. 3bis URG schützt ALLE Fotografien für 50 Jahre, auch einfache Schnappschüsse.'
          },
          {
            text: 'C) Ja, für 70 Jahre nach Ihrem Tod',
            correct: false,
            feedback: '❌ Falsch. Es gibt Schutz, aber nicht so lange. Nur Kunstfotografien mit individuellem Charakter haben 70 Jahre Schutz.'
          }
        ]
      },
      {
        question: '5. Welche Aussagen über Fotografien treffen zu? (Mehrere Antworten möglich!)',
        multipleCorrect: true,
        options: [
          {
            text: 'A) Alle Fotografien sind geschützt - auch einfache Schnappschüsse',
            correct: true,
            feedback: '✅ Richtig! Art. 2 Abs. 3bis URG schützt alle Fotografien.'
          },
          {
            text: 'B) Einfache Fotos haben 50 Jahre Schutz ab Herstellung',
            correct: true,
            feedback: '✅ Korrekt! Nicht-künstlerische Fotos sind 50 Jahre geschützt.'
          },
          {
            text: 'C) Fotos von öffentlichen Gebäuden dürfen immer frei verwendet werden',
            correct: false,
            feedback: '❌ Falsch. Auch Fotos von öffentlichen Gebäuden sind geschützt. Es gibt keine automatische Erlaubnis.'
          },
          {
            text: 'D) Künstlerische Fotografien sind 70 Jahre nach Tod des Fotografen geschützt',
            correct: true,
            feedback: '✅ Richtig! Fotos mit individuellem Charakter haben die volle Schutzfrist von 70 Jahren.'
          }
        ]
      }
    ]
  },

  modul2: {
    id: 'modul2',
    area: 'grundlagen',
    title: 'Freie Werke',
    description: 'Welche Werke können Sie ohne Einschränkung nutzen? Lernen Sie die Regeln für gemeinfreie Inhalte.',
    duration: '~12 Min.',
    maxPoints: 100,
    videoTitle: '🎥 Video-Einführung',
    videoDescription: 'Was bedeutet "gemeinfrei"? (4 Min.)',
    videoPlaceholder: 'Hier könnte ein Video, eine Audioaufnahme oder eine Präsentation eingefügt werden.',
    interactiveTitle: '🎯 Wann Werke gemeinfrei werden',
    interactiveElements: [
      {
        title: '⏰ Zeitablauf (Art. 29-31 URG)',
        content: {
          text: 'Nach Ablauf der Schutzfrist werden Werke gemeinfrei.',
          list: [
            'Literatur, Musik, Kunst: 70 Jahre nach Tod des Urhebers',
            'Einfache Fotografien: 50 Jahre ab Herstellung',
            'Audiovisuelle Werke: 70 Jahre nach Tod des letzten Mitwirkenden'
          ],
          example: {
            type: 'success',
            text: '✓ Beispiel: Werke von Mozart sind gemeinfrei (gestorben 1791), aber nicht die Aufnahmen moderner Orchester!'
          }
        }
      },
      {
        title: '📜 Amtliche Texte (Art. 5 URG)',
        content: {
          text: 'Bestimmte amtliche Werke sind von vornherein nicht geschützt.',
          list: [
            'Gesetze, Verordnungen, Verfügungen',
            'Gerichtsentscheide',
            'Amtliche Bekanntmachungen'
          ],
          example: {
            type: 'info',
            text: '💡 Aber Achtung: Nur der reine Gesetzestext ist frei - nicht Kommentare oder Lehrbücher darüber!'
          }
        }
      },
      {
        title: '🌐 Creative Commons Lizenzen',
        content: {
          text: 'Urheber können ihre Werke mit CC-Lizenzen freigeben.',
          list: [
            'CC0: Vollständige Rechte-Freigabe',
            'CC BY: Nutzung mit Namensnennung',
            'CC BY-SA: Nutzung mit Namensnennung, gleiche Lizenz'
          ],
          example: {
            type: 'warning',
            text: '⚠️ Wichtig: Lizenz-Bedingungen IMMER genau beachten (z.B. "NC" = nicht-kommerziell)!'
          }
        }
      }
    ],
    quizQuestions: [
      {
        question: '1. Wann ist ein literarisches Werk gemeinfrei?',
        options: [
          {
            text: 'A) Sofort nach Veröffentlichung',
            correct: false,
            feedback: '❌ Falsch. Veröffentlichte Werke sind geschützt!'
          },
          {
            text: 'B) 70 Jahre nach dem Tod des Urhebers',
            correct: true,
            feedback: '✅ Richtig! Nach 70 Jahren wird das Werk gemeinfrei.'
          },
          {
            text: 'C) Nie - Schutz ist ewig',
            correct: false,
            feedback: '❌ Falsch. Der Schutz ist zeitlich begrenzt.'
          }
        ]
      },
      {
        question: '2. Was bedeutet eine CC BY-Lizenz?',
        options: [
          {
            text: 'A) Das Werk ist vollständig gemeinfrei',
            correct: false,
            feedback: '❌ Nein. CC BY ist nicht gemeinfrei, sondern eine Lizenz mit Bedingungen.'
          },
          {
            text: 'B) Ich darf das Werk nutzen, muss aber den Urheber nennen',
            correct: true,
            feedback: '✅ Genau! "BY" steht für "Attribution" = Namensnennung.'
          },
          {
            text: 'C) Nur private Nutzung erlaubt',
            correct: false,
            feedback: '❌ Falsch. CC BY erlaubt auch kommerzielle Nutzung - solange man den Urheber nennt.'
          }
        ]
      },
      {
        question: '3. Welches dieser Werke ist NICHT automatisch gemeinfrei?',
        options: [
          {
            text: 'A) Schweizer Bundesgesetz (aktueller Gesetzestext)',
            correct: false,
            feedback: '❌ Falsch. Gesetzestexte sind gemeinfrei (Art. 5 URG)!'
          },
          {
            text: 'B) Bundesgerichts-Urteil',
            correct: false,
            feedback: '❌ Falsch. Gerichtsentscheide sind gemeinfrei (Art. 5 URG)!'
          },
          {
            text: 'C) Kommentar zum Gesetz aus einem Rechtsbuch',
            correct: true,
            feedback: '✅ Richtig! Nur der reine Gesetzestext ist frei, nicht Kommentare oder Analysen.'
          }
        ]
      },
      {
        question: '4. Eine Mozart-Symphonie ist gemeinfrei. Gilt das auch für die Spotify-Aufnahme?',
        options: [
          {
            text: 'A) Ja, wenn die Komposition gemeinfrei ist, ist auch die Aufnahme frei',
            correct: false,
            feedback: '❌ Falsch! Aufnahmen haben eigene Rechte.'
          },
          {
            text: 'B) Nein, die Aufnahme hat eigene Rechte (Leistungsschutzrechte)',
            correct: true,
            feedback: '✅ Richtig! Die Komposition mag frei sein, aber Orchesteraufnahmen haben eigene Rechte (Leistungsschutzrechte).'
          },
          {
            text: 'C) Nur mit Spotify Premium erlaubt',
            correct: false,
            feedback: '❌ Falsch. Das hat nichts mit Streaming-Abos zu tun.'
          }
        ]
      }
    ]
  },

  modul3: {
    id: 'modul3',
    area: 'grundlagen',
    title: 'Zitatrecht',
    description: 'Lernen Sie, wie Sie fremde Werke korrekt zitieren können - im rechtlichen Rahmen.',
    duration: '~18 Min.',
    maxPoints: 100,
    videoTitle: '🎥 Video-Einführung',
    videoDescription: 'Die drei Voraussetzungen des Zitatrechts (6 Min.)',
    videoPlaceholder: 'Hier könnte ein Video, eine Audioaufnahme oder eine Präsentation eingefügt werden.',
    interactiveTitle: '🎯 Die drei Voraussetzungen des Zitatrechts (Art. 25 URG)',
    interactiveElements: [
      {
        title: '1️⃣ Eigenes Werk als Basis',
        content: {
          text: 'Sie müssen selbst ein eigenständiges Werk schaffen.',
          list: [
            'Ihr Werk muss eigenständigen Charakter haben',
            'Das Zitat muss in Ihr Werk eingebettet sein',
            'Das Zitat darf nicht der Hauptinhalt sein'
          ],
          example: {
            type: 'warning',
            text: '⚠️ NICHT erlaubt: Eine Präsentation, die nur aus Zitaten besteht - ohne eigene Analyse.'
          }
        }
      },
      {
        title: '2️⃣ Zitatzweck',
        content: {
          text: 'Das Zitat muss einem legitimen Zweck dienen.',
          list: [
            'Erläuterung oder Veranschaulichung',
            'Auseinandersetzung oder Kritik',
            'Verweis auf Quellen in wissenschaftlicher Arbeit'
          ],
          example: {
            type: 'info',
            text: '💡 Erlaubt: Zitat aus einem Roman, um Ihren literaturwissenschaftlichen Punkt zu belegen.'
          }
        }
      },
      {
        title: '3️⃣ Quellenangabe (Art. 25 Abs. 2 URG)',
        content: {
          text: 'Sie müssen die Quelle klar angeben.',
          list: [
            'Name des Urhebers nennen',
            'Werktitel angeben',
            'Bei Online-Quellen: URL und Abrufdatum'
          ],
          example: {
            type: 'success',
            text: '✓ Beispiel: "Wie Einstein sagte: \'...\' (Einstein, A., 1905, Zur Elektrodynamik bewegter Körper)"'
          }
        }
      }
    ],
    quizQuestions: [
      {
        question: '1. Was ist KEINE Voraussetzung für ein zulässiges Zitat?',
        options: [
          {
            text: 'A) Eigenes Werk als Basis',
            correct: false,
            feedback: '❌ Falsch. Das ist eine Voraussetzung!'
          },
          {
            text: 'B) Quellenangabe',
            correct: false,
            feedback: '❌ Falsch. Quellenangabe ist Pflicht!'
          },
          {
            text: 'C) Schriftliche Erlaubnis des Urhebers',
            correct: true,
            feedback: '✅ Richtig! Für ein Zitat brauchen Sie KEINE Erlaubnis - nur die drei gesetzlichen Voraussetzungen.'
          }
        ]
      },
      {
        question: '2. Dürfen Sie ein ganzes Gedicht als "Zitat" in Ihre Präsentation aufnehmen?',
        options: [
          {
            text: 'A) Ja, mit Quellenangabe immer erlaubt',
            correct: false,
            feedback: '❌ Falsch. Ganze Werke sind problematisch.'
          },
          {
            text: 'B) Nur wenn es absolut notwendig ist (z.B. für Gedichtanalyse)',
            correct: true,
            feedback: '✅ Richtig! Ein ganzes Gedicht darf nur zitiert werden, wenn es für den Zweck notwendig ist (z.B. Gedichtinterpretation).'
          },
          {
            text: 'C) Nein, nie erlaubt',
            correct: false,
            feedback: '❌ Nicht ganz. In bestimmten Fällen (z.B. Gedichtanalyse) kann es notwendig sein.'
          }
        ]
      },
      {
        question: '3. Was bedeutet "eigenes Werk als Basis"?',
        options: [
          {
            text: 'A) Das Zitat muss in einen eigenen Text eingebettet sein, nicht allein stehen',
            correct: true,
            feedback: '✅ Genau! Sie müssen selbst etwas Eigenständiges schaffen - das Zitat ist nur Beiwerk.'
          },
          {
            text: 'B) Sie müssen mindestens 1000 Wörter eigenen Text schreiben',
            correct: false,
            feedback: '❌ Falsch. Es gibt keine feste Wortanzahl.'
          },
          {
            text: 'C) Das Zitat darf die Hauptsache sein',
            correct: false,
            feedback: '❌ Falsch. Das Zitat darf gerade NICHT die Hauptsache sein.'
          }
        ]
      },
      {
        question: '4. Müssen Sie auch bei gemeinfreien Werken die Quelle angeben?',
        options: [
          {
            text: 'A) Nein, nur bei geschützten Werken',
            correct: false,
            feedback: '❌ Falsch. Quellenangabe ist unabhängig vom Schutzstatus.'
          },
          {
            text: 'B) Ja, die Quellenangabe ist immer erforderlich (Art. 25 Abs. 2 URG)',
            correct: true,
            feedback: '✅ Richtig! Die Quellenangabe ist IMMER Pflicht - auch bei gemeinfreien Werken.'
          },
          {
            text: 'C) Nur in wissenschaftlichen Arbeiten',
            correct: false,
            feedback: '❌ Falsch. Die Pflicht gilt überall.'
          }
        ]
      }
    ]
  },

  modul4: {
    id: 'modul4',
    area: 'grundlagen',
    title: 'KI und Urheberrecht',
    description: 'Allgemeine Grundlagen: Wie funktioniert KI? Welche urheberrechtlichen Fragen entstehen?',
    duration: '~20 Min.',
    maxPoints: 100,
    videoTitle: '🎥 Video-Einführung',
    videoDescription: 'KI und Urheberrecht - Grundlagen (7 Min.)',
    videoPlaceholder: 'Hier könnte ein Video, eine Audioaufnahme oder eine Präsentation eingefügt werden.',
    interactiveTitle: '🎯 KI und Urheberrecht - Die wichtigsten Konzepte',
    interactiveElements: [
      {
        title: '🤖 Wie KI funktioniert',
        content: {
          text: 'KI-Modelle werden mit großen Datenmengen trainiert.',
          list: [
            'Training mit Millionen von Texten, Bildern, Codes',
            'Modell lernt Muster und Zusammenhänge',
            'Output basiert auf statistischen Wahrscheinlichkeiten'
          ],
          example: {
            type: 'info',
            text: '💡 Wichtig: KI "versteht" nicht wirklich - sie erkennt nur Muster in den Trainingsdaten.'
          }
        }
      },
      {
        title: '⚖️ Urheberrechtliche Fragen',
        content: {
          text: 'KI wirft neue rechtliche Fragen auf.',
          list: [
            'Ist KI-Output urheberrechtlich geschützt?',
            'Darf man geschützte Werke zum Training nutzen?',
            'Wer ist verantwortlich für Rechtsverletzungen?'
          ],
          example: {
            type: 'warning',
            text: '⚠️ Diese Fragen sind teilweise noch nicht abschließend geklärt - das Recht entwickelt sich.'
          }
        }
      },
      {
        title: '🛡️ Schutz von KI-Output',
        content: {
          text: 'Für Urheberrechtsschutz braucht es "geistige Schöpfung".',
          list: [
            'Reine KI-Outputs OHNE menschliche Schöpfung = kein Schutz',
            'Wenn Sie KI-Output wesentlich überarbeiten = möglicherweise geschützt',
            'Entscheidend: Ihr kreativer Beitrag'
          ],
          example: {
            type: 'success',
            text: '✓ Tipp: Dokumentieren Sie Ihren kreativen Prozess, um Schutz zu begründen.'
          }
        }
      }
    ],
    quizQuestions: [
      {
        question: '1. Ist reiner KI-Output automatisch urheberrechtlich geschützt?',
        options: [
          {
            text: 'A) Ja, immer',
            correct: false,
            feedback: '❌ Falsch. Für Schutz braucht es "geistige Schöpfung".'
          },
          {
            text: 'B) Nein, ohne wesentlichen menschlichen Beitrag kein Schutz',
            correct: true,
            feedback: '✅ Richtig! KI-Output ohne wesentliche menschliche Schöpfung ist nicht geschützt.'
          },
          {
            text: 'C) Nur in der Schweiz geschützt',
            correct: false,
            feedback: '❌ Falsch. Das Prinzip gilt international ähnlich.'
          }
        ]
      },
      {
        question: '2. Darf man urheberrechtlich geschützte Werke zum Training von KI nutzen?',
        options: [
          {
            text: 'A) Ja, für KI-Training ist alles erlaubt',
            correct: false,
            feedback: '❌ Nicht ganz. Diese Frage ist rechtlich noch nicht abschließend geklärt.'
          },
          {
            text: 'B) Nein, niemals ohne Erlaubnis',
            correct: false,
            feedback: '❌ Zu absolut. Es gibt verschiedene Rechtsansichten.'
          },
          {
            text: 'C) Rechtlich umstritten - noch nicht abschließend geklärt',
            correct: true,
            feedback: '✅ Richtig! Diese Frage wird gerade rechtlich diskutiert und ist nicht abschließend geklärt.'
          }
        ]
      },
      {
        question: '3. Sie geben ChatGPT einen detaillierten Prompt und überarbeiten den Output intensiv. Ist das Ergebnis geschützt?',
        options: [
          {
            text: 'A) Nein, nie geschützt',
            correct: false,
            feedback: '❌ Zu absolut. Es kommt auf Ihren Beitrag an.'
          },
          {
            text: 'B) Möglicherweise, wenn Ihre Überarbeitung ausreichend kreativ ist',
            correct: true,
            feedback: '✅ Richtig! Wenn Sie wesentlich kreativ beitragen, kann Schutz entstehen.'
          },
          {
            text: 'C) Ja, automatisch durch den Prompt',
            correct: false,
            feedback: '❌ Falsch. Ein Prompt allein reicht meist nicht aus.'
          }
        ]
      },
      {
        question: '4. Was bedeutet "Text und Data Mining" (TDM)?',
        options: [
          {
            text: 'A) Automatische Analyse großer Datenmengen',
            correct: true,
            feedback: '✅ Richtig! TDM ist die automatisierte Analyse von Daten - relevant für KI-Training.'
          },
          {
            text: 'B) Manuelles Lesen von Texten',
            correct: false,
            feedback: '❌ Falsch. "Mining" bedeutet automatisierte Verarbeitung.'
          },
          {
            text: 'C) Nur für wissenschaftliche Forschung erlaubt',
            correct: false,
            feedback: '❌ Nicht ganz. TDM hat breitere Anwendungen.'
          }
        ]
      }
    ]
  },

  // ========================================
  // BEREICH 2: SCHULUMGEBUNG (450 Punkte)
  // ========================================

  schule1: {
    id: 'schule1',
    area: 'schulumgebung',
    title: 'Art. 19 URG und GT7 - Grundlagen',
    description: 'Verstehen Sie die gesetzlichen Grundlagen für Schulen: Was erlaubt Art. 19 URG? Wie funktioniert der GT7-Tarif?',
    duration: '~20 Min.',
    maxPoints: 100,
    videoTitle: '🎥 Video-Einführung',
    videoDescription: 'Urheberrecht in Schulen - Die rechtlichen Grundlagen (7 Min.)',
    videoPlaceholder: 'Hier könnte ein Video, eine Audioaufnahme oder eine Präsentation eingefügt werden.',
    interactiveTitle: '🎯 Art. 19 URG und der GT7',
    roleSpecificContent: [
      {
        role: 'Lehrpersonen',
        icon: '👩‍🏫',
        description: 'Fokus: Nutzung im Unterricht',
        examples: [
          'Sie dürfen Ausschnitte aus Büchern für Ihre Klasse kopieren',
          'TV-Sendungen aufnehmen und im Unterricht zeigen',
          'Materialien auf schulinterner Lernplattform hochladen'
        ]
      },
      {
        role: 'Schulleitungen & Sekretariate',
        icon: '🏢',
        description: 'Fokus: Organisation und Verwaltung',
        examples: [
          'Verantwortung für GT7-Abrechnung verstehen',
          'Schulinterne vs. öffentliche Nutzung unterscheiden',
          'Dokumentation für Elternabende (mit Quellenangaben)'
        ]
      },
      {
        role: 'Lernende',
        icon: '🎓',
        description: 'Fokus: Eigene Arbeiten',
        examples: [
          'Materialien für Referate korrekt verwenden',
          'Quellenangaben in Arbeiten korrekt machen',
          'Unterschied zwischen Unterricht und Veröffentlichung verstehen'
        ]
      },
      {
        role: 'Bibliothek & Mediothek',
        icon: '📚',
        description: 'Fokus: Medienbereitstellung',
        examples: [
          'Welche Kopien dürfen bereitgestellt werden?',
          'Digitale Ausleihe und Streaming-Dienste',
          'Reservekopien von Büchern'
        ]
      }
    ],
    interactiveElements: [
      {
        title: '⚖️ Art. 19 URG - Eigengebrauch',
        content: {
          text: 'Dieser Artikel erlaubt die Nutzung von Werken für den Unterricht.',
          list: [
            'Veröffentlichte Werke dürfen für Unterricht in der Klasse genutzt werden',
            'Lehrpersonen dürfen Material vervielfältigen',
            'Gilt für schulinterne Nutzung, nicht öffentliche Verbreitung'
          ],
          example: {
            type: 'success',
            text: '✓ Erlaubt: Kapitel aus Lehrbuch kopieren und an Klasse verteilen'
          }
        }
      },
      {
        title: '💰 Der GT7 - Gemeinsamer Tarif',
        content: {
          text: 'Der GT7 regelt die Vergütung für Nutzungen in Schulen.',
          list: [
            'Pauschale Vergütung pro Schüler/in',
            'Abrechnung über EDK (öffentliche Schulen)',
            '35% Rabatt für Bildungseinrichtungen (Art. 60 Abs. 3 URG)'
          ],
          example: {
            type: 'info',
            text: '💡 Die Schule zahlt pauschal - Lehrpersonen müssen nicht einzeln abrechnen'
          }
        }
      },
      {
        title: '📋 Was ist erlaubt?',
        content: {
          text: 'Der GT7 deckt verschiedene Nutzungen ab.',
          list: [
            'Kopien von Ausschnitten aus Büchern und Zeitschriften',
            'Digitalisieren und Verteilen auf schulinternen Plattformen',
            'Radio/TV-Sendungen aufnehmen und im Unterricht zeigen',
            'Musikaufführungen bei Schulanlässen (in bestimmtem Rahmen)'
          ],
          example: {
            type: 'warning',
            text: '⚠️ NICHT erlaubt: Ganze Bücher kopieren, Material auf öffentlichen Websites veröffentlichen'
          }
        }
      }
    ],
    quizQuestions: [
      {
        question: '1. Was erlaubt Art. 19 URG?',
        options: [
          {
            text: 'A) Jede Nutzung für Bildungszwecke',
            correct: false,
            feedback: '❌ Zu weit gefasst. Es gibt klare Grenzen.'
          },
          {
            text: 'B) Nutzung veröffentlichter Werke für Unterricht in der Klasse',
            correct: true,
            feedback: '✅ Richtig! Art. 19 URG erlaubt die Nutzung für Unterricht - aber mit Einschränkungen.'
          },
          {
            text: 'C) Nur private Nutzung zu Hause',
            correct: false,
            feedback: '❌ Falsch. Art. 19 betrifft auch Unterricht.'
          }
        ]
      },
      {
        question: '2. Wer rechnet den GT7 für öffentliche Schulen ab?',
        options: [
          {
            text: 'A) Jede Schule direkt an ProLitteris',
            correct: false,
            feedback: '❌ Falsch. Es gibt eine zentrale Stelle.'
          },
          {
            text: 'B) Die EDK (Schweizerische Konferenz der kantonalen Erziehungsdirektoren)',
            correct: true,
            feedback: '✅ Richtig! Die EDK zieht die Vergütungen für öffentliche Schulen ein.'
          },
          {
            text: 'C) Die einzelnen Lehrpersonen',
            correct: false,
            feedback: '❌ Falsch. Lehrpersonen müssen nicht einzeln abrechnen.'
          }
        ]
      },
      {
        question: '3. Dürfen Sie als Lehrperson ein ganzes Lehrbuch kopieren?',
        options: [
          {
            text: 'A) Ja, für Unterricht ist alles erlaubt',
            correct: false,
            feedback: '❌ Falsch. Es gibt klare Grenzen.'
          },
          {
            text: 'B) Nein, nur Ausschnitte sind erlaubt',
            correct: true,
            feedback: '✅ Richtig! Ganze Bücher kopieren ist NICHT durch GT7 gedeckt.'
          },
          {
            text: 'C) Ja, wenn es vergriffen ist',
            correct: false,
            feedback: '❌ Falsch. Auch dann nicht ohne Weiteres.'
          }
        ]
      },
      {
        question: '4. Was bedeutet "schulinterne Nutzung"?',
        options: [
          {
            text: 'A) Material nur in der Schule, nicht öffentlich im Internet',
            correct: true,
            feedback: '✅ Richtig! Schulintern = auf schulinternen Plattformen, nicht öffentlich zugänglich.'
          },
          {
            text: 'B) Material darf überall veröffentlicht werden',
            correct: false,
            feedback: '❌ Falsch. Öffentliche Veröffentlichung ist nicht gedeckt.'
          },
          {
            text: 'C) Nur auf Papier, nicht digital',
            correct: false,
            feedback: '❌ Falsch. Digital ist auch OK, solange schulintern.'
          }
        ]
      }
    ]
  },

  schule2: {
    id: 'schule2',
    area: 'schulumgebung',
    title: 'Lehrmittel - Verwendung und Erstellung',
    description: 'Was gilt als Lehrmittel? Wann dürfen Sie Materialien erstellen und verbreiten?',
    duration: '~18 Min.',
    maxPoints: 90,
    videoTitle: '🎥 Video-Einführung',
    videoDescription: 'Lehrmittel und Urheberrecht (6 Min.)',
    videoPlaceholder: 'Hier könnte ein Video, eine Audioaufnahme oder eine Präsentation eingefügt werden.',
    interactiveTitle: '🎯 Lehrmittel verstehen',
    roleSpecificContent: [
      {
        role: 'Lehrpersonen',
        icon: '👩‍🏫',
        description: 'Fokus: Materialerstellung',
        examples: [
          'Eigene Arbeitsblätter für die Klasse erstellen',
          'Fremde Materialien als Inspiration nutzen (aber nicht kopieren)',
          'Unterschied: Einmaliges Arbeitsblatt vs. systematisches Lehrmittel'
        ]
      },
      {
        role: 'Schulleitungen',
        icon: '🏢',
        description: 'Fokus: Schulinterne Richtlinien',
        examples: [
          'Richtlinien für Material-Erstellung kommunizieren',
          'Unterschied zwischen internem und externem Austausch',
          'Haftungsfragen bei Rechtsverletzungen'
        ]
      },
      {
        role: 'Lernende',
        icon: '🎓',
        description: 'Fokus: Eigene Unterlagen',
        examples: [
          'Zusammenfassungen für sich selbst erstellen',
          'Keine Weitergabe von Lernmaterialien an andere Klassen',
          'Eigene Notizen vs. Kopieren von Lehrmitteln'
        ]
      }
    ],
    interactiveElements: [
      {
        title: '📚 Was ist ein "Lehrmittel"?',
        content: {
          text: 'Ein Lehrmittel entsteht durch systematische Zusammenstellung und Verbreitung.',
          list: [
            'Systematisch aufgebaut (nicht nur einzelne Übung)',
            'Zum Verkauf oder breiter Verbreitung bestimmt',
            'Nicht nur für eigene Klasse, sondern für Dritte'
          ],
          example: {
            type: 'warning',
            text: '⚠️ Grauzone: Wenn Sie Arbeitsblätter regelmäßig mit anderen Lehrpersonen tauschen, kann das zum "Lehrmittel" werden!'
          }
        }
      },
      {
        title: '🚫 Art. 19 Abs. 3 URG - Das Verbot',
        content: {
          text: 'Handelsübliche Werke dürfen NICHT zur Herstellung von Unterrichtsmaterial verwendet werden.',
          list: [
            'Verlagsarbeitsblätter dürfen nicht als Vorlage dienen',
            'Auch nicht mit KI umarbeiten!',
            'Gilt auch für Teile von Lehrmitteln'
          ],
          example: {
            type: 'success',
            text: '✓ Erlaubt: Eigenes Material von Grund auf erstellen mit KI-Unterstützung'
          }
        }
      },
      {
        title: '✅ Sichere Wege',
        content: {
          text: 'So bleiben Sie rechtlich sicher.',
          list: [
            'Eigenes Material von Grund auf erstellen',
            'KI mit allgemeinen Prompts nutzen (nicht spezifische Lehrmittel hochladen)',
            'Freie Ressourcen (CC-lizenziert, gemeinfrei) nutzen',
            'Material nur in eigener Klasse nutzen (nicht verbreiten)'
          ],
          example: {
            type: 'info',
            text: '💡 Besser: "Erstelle mir ein Arbeitsblatt zu Photosynthese" als "Nutze dieses Lehrbuch-PDF"'
          }
        }
      }
    ],
    quizQuestions: [
      {
        question: '1. Was verbietet Art. 19 Abs. 3 URG?',
        options: [
          {
            text: 'A) Jede Nutzung von Lehrmitteln im Unterricht',
            correct: false,
            feedback: '❌ Falsch. Nutzung ist OK, aber nicht zur Herstellung neuer Materialien.'
          },
          {
            text: 'B) Verwendung handelsüblicher Werke zur Herstellung von Unterrichtsmaterial',
            correct: true,
            feedback: '✅ Richtig! Sie dürfen Lehrmittel NICHT als Vorlage für eigene Materialien verwenden.'
          },
          {
            text: 'C) Digitalisierung von Lehrmitteln',
            correct: false,
            feedback: '❌ Falsch. Das ist ein anderes Thema.'
          }
        ]
      },
      {
        question: '2. Dürfen Sie ein Arbeitsblatt mit Ihren Kolleg/innen teilen?',
        options: [
          {
            text: 'A) Ja, unbegrenzt mit allen',
            correct: false,
            feedback: '❌ Vorsicht! Bei systematischer Verbreitung kann es zum "Lehrmittel" werden.'
          },
          {
            text: 'B) Ja, im kleinen Rahmen OK - aber nicht systematisch verbreiten',
            correct: true,
            feedback: '✅ Richtig! Informeller Austausch ist OK, aber nicht systematische Verbreitung.'
          },
          {
            text: 'C) Nein, nie erlaubt',
            correct: false,
            feedback: '❌ Zu streng. Informeller Austausch ist grundsätzlich OK.'
          }
        ]
      },
      {
        question: '3. Sie laden ein Verlagsarbeitsblatt in ChatGPT hoch, um eine "ähnliche Version" zu erstellen. Ist das erlaubt?',
        options: [
          {
            text: 'A) Ja, wenn die KI stark verändert',
            correct: false,
            feedback: '❌ Falsch. Art. 19 Abs. 3 URG verbietet diese Verwendung.'
          },
          {
            text: 'B) Nein, das verstößt gegen Art. 19 Abs. 3 URG',
            correct: true,
            feedback: '✅ Richtig! Handelsübliche Lehrmittel dürfen NICHT als Vorlage dienen - auch nicht mit KI.'
          },
          {
            text: 'C) Ja, für Bildung ist alles erlaubt',
            correct: false,
            feedback: '❌ Falsch. Es gibt klare Verbote.'
          }
        ]
      },
      {
        question: '4. Was ist der sicherste Weg, KI für Unterrichtsmaterial zu nutzen?',
        options: [
          {
            text: 'A) Geschützte Materialien hochladen und umarbeiten lassen',
            correct: false,
            feedback: '❌ Falsch. Das ist problematisch.'
          },
          {
            text: 'B) Eigene Notizen in eigenen Worten hochladen oder KI eigenständig recherchieren lassen',
            correct: true,
            feedback: '✅ Richtig! Ihre eigenen Notizen sind IHRE Werke - kein Problem mit fremden Rechten.'
          },
          {
            text: 'C) Links zu Artikeln geben, die KI dann kopiert',
            correct: false,
            feedback: '❌ Grauzone. Sie beauftragen die Vervielfältigung.'
          }
        ]
      }
    ]
  },

  schule3: {
    id: 'schule3',
    area: 'schulumgebung',
    title: 'GT7 Praxisanwendung',
    description: 'Vertiefen Sie Ihr Wissen: Digitale Medien, Plattformen und der GT7 im Schulalltag.',
    duration: '~22 Min.',
    maxPoints: 100,
    videoTitle: '🎥 Video-Einführung',
    videoDescription: 'GT7 in der Praxis - Digitale Medien und Plattformen (8 Min.)',
    videoPlaceholder: 'Hier könnte ein Video, eine Audioaufnahme oder eine Präsentation eingefügt werden.',
    interactiveTitle: '🎯 GT7 im digitalen Zeitalter',
    roleSpecificContent: [
      {
        role: 'Lehrpersonen',
        icon: '👩‍🏫',
        description: 'Fokus: Digitale Nutzung',
        examples: [
          'Material auf Moodle/Teams hochladen',
          'Unterschied zwischen schulinterner und öffentlicher Plattform',
          'Streaming-Dienste im Unterricht nutzen'
        ]
      },
      {
        role: 'IT-Verantwortliche',
        icon: '💻',
        description: 'Fokus: Technische Umsetzung',
        examples: [
          'Zugriffskontrollen für schulinterne Plattformen',
          'Was gilt als "schulintern"?',
          'Cloud-Speicher und Urheberrecht'
        ]
      },
      {
        role: 'Schulleitungen',
        icon: '🏢',
        description: 'Fokus: Strategie',
        examples: [
          'Welche digitalen Tools sind rechtlich sicher?',
          'Umgang mit Social Media',
          'Eltern-Newsletter und Urheberrecht'
        ]
      }
    ],
    interactiveElements: [
      {
        title: '💻 Digitale Medien und Plattformen',
        content: {
          text: 'GT7 gilt auch für digitale Nutzungen - aber mit Grenzen.',
          list: [
            'Schulinterne Lernplattformen (Moodle, Teams): ✅ OK',
            'Öffentliche Websites: ❌ NICHT gedeckt',
            'Social Media (Instagram, Facebook): ❌ NICHT gedeckt',
            'Cloud-Speicher nur für schulinterne Nutzung'
          ],
          example: {
            type: 'warning',
            text: '⚠️ Kritisch: Öffentlich zugängliche Plattformen sind NICHT durch GT7 gedeckt!'
          }
        }
      },
      {
        title: '📺 Streaming und Online-Medien',
        content: {
          text: 'Wie Sie Online-Medien im Unterricht nutzen dürfen.',
          list: [
            'TV-Sendungen aufnehmen: ✅ OK (GT7)',
            'Streaming-Dienste (Netflix, YouTube): Lizenzabhängig',
            'Links teilen statt kopieren oft sicherer',
            'Beachten Sie die AGB der Plattformen'
          ],
          example: {
            type: 'info',
            text: '💡 Tipp: Bei Streaming-Diensten gibt es oft Bildungslizenzen - prüfen Sie die AGB!'
          }
        }
      },
      {
        title: '🤖 KI-Tools in Schulen',
        content: {
          text: 'Besondere Vorsicht bei KI-generierten Lehrmaterialien.',
          list: [
            'Upload von Lehrmitteln in KI = Vervielfältigung (problematisch)',
            'KI selbstständig recherchieren lassen = sicher',
            'Beachten Sie Art. 19 Abs. 3 URG (Lehrmittel-Verbot)',
            'Verantwortung liegt bei Ihnen, nicht bei der KI'
          ],
          example: {
            type: 'success',
            text: '✓ Sicher: "Erstelle ein Arbeitsblatt zu Klimawandel" (allgemeiner Prompt)'
          }
        }
      }
    ],
    quizQuestions: [
      {
        question: '1. Welche Plattform ist durch GT7 für Material-Verteilung gedeckt?',
        options: [
          {
            text: 'A) Öffentliche Schulwebsite',
            correct: false,
            feedback: '❌ Falsch. Öffentlich ist NICHT gedeckt.'
          },
          {
            text: 'B) Schulinternes Moodle (passwortgeschützt)',
            correct: true,
            feedback: '✅ Richtig! Schulinterne Plattformen mit Zugriffsbeschränkung sind OK.'
          },
          {
            text: 'C) Instagram oder Facebook',
            correct: false,
            feedback: '❌ Falsch. Social Media ist öffentlich und nicht gedeckt.'
          }
        ]
      },
      {
        question: '2. Dürfen Sie eine Netflix-Dokumentation im Unterricht zeigen?',
        options: [
          {
            text: 'A) Ja, GT7 deckt alle Streaming-Dienste',
            correct: false,
            feedback: '❌ Falsch. Streaming-Dienste haben eigene Lizenzen.'
          },
          {
            text: 'B) Lizenzabhängig - prüfen Sie die AGB von Netflix',
            correct: true,
            feedback: '✅ Richtig! Streaming-Dienste haben eigene Nutzungsbedingungen - GT7 gilt hier nicht automatisch.'
          },
          {
            text: 'C) Nein, nie erlaubt',
            correct: false,
            feedback: '❌ Zu absolut. Es kommt auf die Lizenz an.'
          }
        ]
      },
      {
        question: '3. Was bedeutet "schulintern"?',
        options: [
          {
            text: 'A) Nur in der Schweiz',
            correct: false,
            feedback: '❌ Falsch. Das meint etwas anderes.'
          },
          {
            text: 'B) Zugriffsbeschränkt auf Schulmitglieder, nicht öffentlich',
            correct: true,
            feedback: '✅ Richtig! Schulintern = passwortgeschützt, nur für Schulmitglieder zugänglich.'
          },
          {
            text: 'C) Nur auf Papier, nicht digital',
            correct: false,
            feedback: '❌ Falsch. Digital ist OK, wenn zugriffsbeschränkt.'
          }
        ]
      },
      {
        question: '4. Sie laden ein Verlagsarbeitsblatt in ChatGPT hoch, um ein Quiz zu erstellen. Ist das OK?',
        options: [
          {
            text: 'A) Ja, für Bildung erlaubt',
            correct: false,
            feedback: '❌ Falsch. Art. 19 Abs. 3 URG verbietet dies.'
          },
          {
            text: 'B) Nein, das verstößt gegen Art. 19 Abs. 3 URG',
            correct: true,
            feedback: '✅ Richtig! Upload von Lehrmitteln zur Materialerstellung ist verboten.'
          },
          {
            text: 'C) Ja, wenn die KI stark verändert',
            correct: false,
            feedback: '❌ Falsch. Das Verbot gilt unabhängig vom Grad der Veränderung.'
          }
        ]
      },
      {
        question: '5. Was ist der Unterschied zwischen "KI recherchiert" und "Link hochladen"?',
        options: [
          {
            text: 'A) Kein Unterschied',
            correct: false,
            feedback: '❌ Falsch. Es gibt einen wichtigen rechtlichen Unterschied.'
          },
          {
            text: 'B) Bei "KI recherchiert" wählt KI selbst Quellen (sicher). Bei "Link" beauftragen Sie Vervielfältigung',
            correct: true,
            feedback: '✅ Richtig! "Recherchiere zu X" = sicher. "Nutze diesen Artikel" = problematisch.'
          },
          {
            text: 'C) Link ist sicherer',
            correct: false,
            feedback: '❌ Falsch. Genau umgekehrt!'
          }
        ]
      }
    ]
  },

  schule4: {
    id: 'schule4',
    area: 'schulumgebung',
    title: 'Dokumentationen und Schülerarbeiten',
    description: 'Lerndossiers, Portfolios, Referate: Wer hat welche Rechte? Wie zitieren Lernende korrekt?',
    duration: '~20 Min.',
    maxPoints: 80,
    videoTitle: '🎥 Video-Einführung',
    videoDescription: 'Schülerarbeiten und Urheberrecht (7 Min.)',
    videoPlaceholder: 'Hier könnte ein Video, eine Audioaufnahme oder eine Präsentation eingefügt werden.',
    interactiveTitle: '🎯 Schülerarbeiten und Dokumentationen',
    roleSpecificContent: [
      {
        role: 'Lehrpersonen',
        icon: '👩‍🏫',
        description: 'Fokus: Bewertung und Archivierung',
        examples: [
          'Dürfen Sie Schülerarbeiten öffentlich zeigen?',
          'Wie lange dürfen Sie Arbeiten aufbewahren?',
          'Veröffentlichung auf Schulwebsite (nur mit Einwilligung)'
        ]
      },
      {
        role: 'Lernende',
        icon: '🎓',
        description: 'Fokus: Eigene Rechte',
        examples: [
          'Sie besitzen die Rechte an Ihren eigenen Arbeiten',
          'Wie Sie korrekt zitieren',
          'Bilder und Musik in Präsentationen'
        ]
      },
      {
        role: 'Schulleitungen',
        icon: '🏢',
        description: 'Fokus: Schulische Praxis',
        examples: [
          'Einwilligungen für Veröffentlichungen einholen',
          'Dokumentation für Schulbroschüren',
          'Umgang mit Bildrechten bei Schul-Events'
        ]
      }
    ],
    interactiveElements: [
      {
        title: '👤 Urheberrecht an Schülerarbeiten',
        content: {
          text: 'Lernende besitzen die Urheberrechte an ihren eigenen Werken.',
          list: [
            'Referate, Aufsätze, Kunstwerke gehören den Schüler/innen',
            'Schule darf sie bewerten und archivieren (Bildungsauftrag)',
            'Veröffentlichung (Website, Ausstellung) nur mit Einwilligung',
            'Bei Minderjährigen: Einwilligung der Erziehungsberechtigten'
          ],
          example: {
            type: 'warning',
            text: '⚠️ Wichtig: Auch Schülerarbeiten sind geschützt! Fragen Sie vor Veröffentlichung.'
          }
        }
      },
      {
        title: '📝 Zitatrecht in Schülerarbeiten',
        content: {
          text: 'Lernende müssen das Zitatrecht beachten.',
          list: [
            'Quellenangaben sind Pflicht (Art. 25 URG)',
            'Eigener Text muss Hauptsache sein',
            'Bilder/Musik: Nur mit Erlaubnis oder freie Lizenzen',
            'KI-Nutzung transparent machen'
          ],
          example: {
            type: 'info',
            text: '💡 Lehrauftrag: Korrektes Zitieren ist Teil der Bildung!'
          }
        }
      },
      {
        title: '📚 Lerndossiers und Portfolios',
        content: {
          text: 'Sammlungen von Arbeiten über längere Zeit.',
          list: [
            'Eigene Reflexionen: Unproblematisch',
            'Fremde Materialien: Nur Ausschnitte mit Quellenangabe',
            'Veröffentlichung (z.B. Blog): Nur eigene oder freie Werke',
            'Schulinterne Nutzung meist OK'
          ],
          example: {
            type: 'success',
            text: '✓ Tipp: E-Portfolios mit CC-lizenzierten Bildern sind rechtlich sicher.'
          }
        }
      }
    ],
    quizQuestions: [
      {
        question: '1. Wem gehören die Urheberrechte an einer Schülerarbeit?',
        options: [
          {
            text: 'A) Der Schule',
            correct: false,
            feedback: '❌ Falsch. Die Schule darf sie nutzen, aber besitzt nicht die Rechte.'
          },
          {
            text: 'B) Dem/der Schüler/in',
            correct: true,
            feedback: '✅ Richtig! Schüler/innen besitzen die Urheberrechte an ihren eigenen Werken.'
          },
          {
            text: 'C) Der Lehrperson',
            correct: false,
            feedback: '❌ Falsch. Lehrpersonen sind nicht Urheber.'
          }
        ]
      },
      {
        question: '2. Darf die Schule Schülerarbeiten auf der Website veröffentlichen?',
        options: [
          {
            text: 'A) Ja, automatisch erlaubt',
            correct: false,
            feedback: '❌ Falsch. Es braucht Einwilligung.'
          },
          {
            text: 'B) Nur mit Einwilligung (bei Minderjährigen: Erziehungsberechtigte)',
            correct: true,
            feedback: '✅ Richtig! Veröffentlichung erfordert Einwilligung der Schüler/innen bzw. Erziehungsberechtigten.'
          },
          {
            text: 'C) Nein, nie erlaubt',
            correct: false,
            feedback: '❌ Falsch. Mit Einwilligung ist es möglich.'
          }
        ]
      },
      {
        question: '3. Ein/e Schüler/in nutzt Bilder aus Google für eine Präsentation. Ist das OK?',
        options: [
          {
            text: 'A) Ja, für Schule ist alles erlaubt',
            correct: false,
            feedback: '❌ Falsch. Auch Schüler/innen müssen Urheberrecht beachten.'
          },
          {
            text: 'B) Nur mit freien Lizenzen (CC, gemeinfrei) oder Erlaubnis',
            correct: true,
            feedback: '✅ Richtig! Auch für Schularbeiten gilt das Urheberrecht - nutzen Sie freie Bilder!'
          },
          {
            text: 'C) Nur mit Wasserzeichen',
            correct: false,
            feedback: '❌ Falsch. Wasserzeichen ändern nichts an fehlender Erlaubnis.'
          }
        ]
      },
      {
        question: '4. Wie lange darf die Schule Schülerarbeiten archivieren?',
        options: [
          {
            text: 'A) Gar nicht',
            correct: false,
            feedback: '❌ Falsch. Archivierung für Bildungszwecke ist OK.'
          },
          {
            text: 'B) Angemessene Zeit für Bildungszwecke (Bewertung, Dokumentation)',
            correct: true,
            feedback: '✅ Richtig! Schulen dürfen Arbeiten für Bildungszwecke archivieren - aber nicht ewig.'
          },
          {
            text: 'C) Unbegrenzt',
            correct: false,
            feedback: '❌ Falsch. Nur für angemessene Dauer.'
          }
        ]
      }
    ]
  },

  schule5: {
    id: 'schule5',
    area: 'schulumgebung',
    title: 'KI in der Schule',
    description: 'KI-Nutzung spezifisch für den Schulkontext: Was müssen Lehrpersonen, Lernende und Verwaltung beachten?',
    duration: '~25 Min.',
    maxPoints: 80,
    videoTitle: '🎥 Video-Einführung',
    videoDescription: 'KI in Schulen - Rechtliche Grundlagen und Praxis (9 Min.)',
    videoPlaceholder: 'Hier könnte ein Video, eine Audioaufnahme oder eine Präsentation eingefügt werden.',
    interactiveTitle: '🎯 KI im Schulalltag',
    roleSpecificContent: [
      {
        role: 'Lehrpersonen',
        icon: '👩‍🏫',
        description: 'Fokus: KI für Unterrichtsvorbereitung',
        examples: [
          'Arbeitsblätter mit KI erstellen (rechtlich sicher)',
          'Upload von Lehrmitteln vermeiden',
          'KI-Nutzung der Schüler/innen begleiten'
        ]
      },
      {
        role: 'Lernende',
        icon: '🎓',
        description: 'Fokus: KI als Lernwerkzeug',
        examples: [
          'ChatGPT für Hausaufgaben nutzen (Transparenz)',
          'Urheberrecht beim Upload von Materialien',
          'KI-Output kritisch prüfen'
        ]
      },
      {
        role: 'Schulleitungen & IT',
        icon: '🏢',
        description: 'Fokus: Schulpolitik',
        examples: [
          'Richtlinien für KI-Nutzung erstellen',
          'Datenschutz und Urheberrecht',
          'Schulungen für Lehrpersonen'
        ]
      },
      {
        role: 'Verwaltung',
        icon: '📋',
        description: 'Fokus: Administrative Nutzung',
        examples: [
          'Briefe und Mitteilungen mit KI erstellen',
          'Urheberrecht bei Elternbriefen',
          'Vorlagen und Dokumente'
        ]
      }
    ],
    interactiveElements: [
      {
        title: '🤖 KI und Art. 19 Abs. 3 URG',
        content: {
          text: 'Das zentrale Verbot für Schulen.',
          list: [
            'Handelsübliche Lehrmittel dürfen NICHT in KI hochgeladen werden',
            'Gilt auch für einzelne Seiten oder Ausschnitte',
            'Auch "nur zur Inspiration" ist problematisch',
            'Alternative: KI selbstständig recherchieren lassen'
          ],
          example: {
            type: 'warning',
            text: '⚠️ NICHT OK: "Hier ist ein Lehrbuch-PDF, erstelle mir ein ähnliches Arbeitsblatt"'
          }
        }
      },
      {
        title: '✅ Sichere KI-Nutzung',
        content: {
          text: 'So nutzen Sie KI rechtlich sicher.',
          list: [
            'Allgemeine Prompts: "Erstelle ein Arbeitsblatt zu Photosynthese" ✅',
            'Eigene Notizen hochladen (in eigenen Worten) ✅',
            'Freie Ressourcen (CC, gemeinfrei) hochladen ✅',
            'KEINE geschützten Lehrmittel hochladen ❌'
          ],
          example: {
            type: 'success',
            text: '✓ Perfekt: KI selbst recherchieren lassen = "freie Benutzung", kein Werk zweiter Hand'
          }
        }
      },
      {
        title: '📝 KI für Schülerarbeiten',
        content: {
          text: 'Umgang mit KI-Nutzung durch Lernende.',
          list: [
            'Transparenz: Schüler/innen sollen KI-Nutzung offenlegen',
            'Upload fremder Werke: Auch für Schüler/innen problematisch',
            'Quellenangabe: "Generiert mit ChatGPT (OpenAI, 2024)"',
            'KI-Output ist meist nicht urheberrechtlich geschützt'
          ],
          example: {
            type: 'info',
            text: '💡 Pädagogischer Ansatz: KI als Werkzeug, nicht als Ersatz für Lernen'
          }
        }
      },
      {
        title: '🏢 KI in der Verwaltung',
        content: {
          text: 'Auch administrative Nutzung hat rechtliche Aspekte.',
          list: [
            'Elternbriefe mit KI erstellen: Unproblematisch',
            'Fremde Vorlagen nicht hochladen',
            'Datenschutz beachten (keine persönlichen Daten)',
            'Schulinterne Dokumente nur schulintern teilen'
          ],
          example: {
            type: 'success',
            text: '✓ OK: "Schreibe einen Brief für einen Elternabend zum Thema Digitalisierung"'
          }
        }
      }
    ],
    quizQuestions: [
      {
        question: '1. Dürfen Sie ein Verlagsarbeitsblatt in ChatGPT hochladen, um eine ähnliche Version zu erstellen?',
        options: [
          {
            text: 'A) Ja, für Bildung erlaubt',
            correct: false,
            feedback: '❌ Falsch. Art. 19 Abs. 3 URG verbietet dies explizit.'
          },
          {
            text: 'B) Nein, das verstößt gegen Art. 19 Abs. 3 URG',
            correct: true,
            feedback: '✅ Richtig! Handelsübliche Lehrmittel dürfen NICHT zur Herstellung von Unterrichtsmaterial verwendet werden.'
          },
          {
            text: 'C) Ja, wenn die KI stark verändert',
            correct: false,
            feedback: '❌ Falsch. Das Verbot gilt unabhängig vom Grad der Veränderung.'
          }
        ]
      },
      {
        question: '2. Was ist der rechtlich sicherste Weg, KI für Unterrichtsmaterial zu nutzen?',
        options: [
          {
            text: 'A) Geschützte Materialien hochladen',
            correct: false,
            feedback: '❌ Falsch. Das ist problematisch.'
          },
          {
            text: 'B) Eigene Notizen hochladen oder KI eigenständig recherchieren lassen',
            correct: true,
            feedback: '✅ Richtig! Ihre Notizen sind IHRE Werke - kein Problem mit fremden Rechten.'
          },
          {
            text: 'C) Links zu Artikeln geben',
            correct: false,
            feedback: '❌ Grauzone. Sie beauftragen die Vervielfältigung.'
          }
        ]
      },
      {
        question: '3. Ein/e Schüler/in nutzt ChatGPT für einen Aufsatz. Was ist wichtig?',
        options: [
          {
            text: 'A) Absolut verboten',
            correct: false,
            feedback: '❌ Zu streng. Es kommt auf Transparenz an.'
          },
          {
            text: 'B) Erlaubt, aber Nutzung sollte transparent gemacht werden',
            correct: true,
            feedback: '✅ Richtig! Transparenz ist wichtig - Schüler/innen sollen KI-Nutzung offenlegen.'
          },
          {
            text: 'C) Erlaubt und muss nicht erwähnt werden',
            correct: false,
            feedback: '❌ Falsch. Transparenz ist Teil der akademischen Integrität.'
          }
        ]
      },
      {
        question: '4. Ist KI-generierter Output urheberrechtlich geschützt?',
        options: [
          {
            text: 'A) Ja, immer',
            correct: false,
            feedback: '❌ Falsch. Es braucht "geistige Schöpfung".'
          },
          {
            text: 'B) Nein, ohne wesentlichen menschlichen Beitrag kein Schutz',
            correct: true,
            feedback: '✅ Richtig! Reiner KI-Output ist meist nicht geschützt.'
          },
          {
            text: 'C) Nur in Schulen geschützt',
            correct: false,
            feedback: '❌ Falsch. Das hat nichts mit dem Kontext zu tun.'
          }
        ]
      },
      {
        question: '5. Sie sind in der Schulverwaltung und erstellen mit KI einen Elternbrief. Ist das OK?',
        options: [
          {
            text: 'A) Nein, KI darf in Schulen nicht genutzt werden',
            correct: false,
            feedback: '❌ Falsch. KI darf grundsätzlich genutzt werden.'
          },
          {
            text: 'B) Ja, für eigene Texte ist KI unproblematisch',
            correct: true,
            feedback: '✅ Richtig! Für eigene Texte (ohne Upload fremder Vorlagen) ist KI OK.'
          },
          {
            text: 'C) Nur mit Genehmigung der Schulleitung',
            correct: false,
            feedback: '❌ Nicht zwingend. Das ist eine organisatorische Frage, keine rechtliche.'
          }
        ]
      }
    ]
  }
}

// Helper Funktionen

export function getModulesByArea(areaId: 'grundlagen' | 'schulumgebung'): ModuleContent[] {
  return Object.values(moduleData).filter(module => module.area === areaId)
}

export function getTotalPointsByArea(areaId: 'grundlagen' | 'schulumgebung'): number {
  return getModulesByArea(areaId).reduce((sum, module) => sum + module.maxPoints, 0)
}

export function getAreaProgress(areaId: 'grundlagen' | 'schulumgebung', userModules: any): {
  completed: number
  total: number
  points: number
  maxPoints: number
  progress: number
} {
  const areaModules = getModulesByArea(areaId)
  const total = areaModules.length
  const completed = areaModules.filter(m => userModules[m.id]?.completed).length
  const points = areaModules.reduce((sum, m) => sum + (userModules[m.id]?.score || 0), 0)
  const maxPoints = getTotalPointsByArea(areaId)
  const progress = Math.round((points / maxPoints) * 100)
  
  return { completed, total, points, maxPoints, progress }
}
