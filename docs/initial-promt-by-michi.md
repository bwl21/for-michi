Perfekt! Ich habe alle Informationen. Hier kommt der umfassende Prompt für dein ChurchTools-Formular-Plugin:



**Comprehensive Prompt für ChurchTools Conditional Group Registration Form Plugin**





text

# ChurchTools Conditional Group Registration Form Plugin – Development Prompt



## Project Overview

Entwickle ein ChurchTools-Plugin, das ein fortgeschrittenes, verzweigtes Gruppenanmeldeformular mit Microsoft-Forms-ähnlicher UX ermöglicht. Das Plugin erlaubt die Erstellung von komplexen Anmeldeformularen mit bedingter Logik, Multi-Abschnitte-Struktur, Drag-and-Drop-Interface und direktem Datenspeichern in Gruppenfeldern.



## Technical Requirements



### 1. Technology Stack

- **Language**: TypeScript

- **Frontend Framework**: Vue.js (folge ChurchTools Pattern)

- **API Integration**: ChurchTools REST API v2 ONLY

- **Styling**: CSS/SCSS (folge ChurchTools Design System)

- **Build Tool**: Use boilerplate structure from GitHub

- **Database**: Utilize ChurchTools API endpoints for group fields, person fields, group members



### 2. Plugin Architecture

- Basiert auf dem offiziellen ChurchTools-Plugin-Boilerplate

- Separate Admin-Benutzer-Rollen für Formularverwaltung (nicht Standard-Admin)

- Modular aufgebaut: Builder-Modul, Display-Modul, Admin-Panel

- Eigenständiges Modul im ChurchTools UI (nicht Teil von bestehenden Modulen)



### 3. API Endpoints to Use

- `/groups` – Gruppen abrufen und verwalten

- `/groupmembers` – Gruppenmitglieder erstellen/aktualisieren

- `/groups/{id}/fields` – Gruppenfelder abrufen

- `/persons/{id}` – Personendaten aktualisieren

- `/customfields?type=groups` – Benutzerdefinierte Gruppenfelder

- `/customfields?type=persons` – Benutzerdefinierte Personenfelder



**Important**: Nutze NUR Felder, die als Gruppenfelder oder Personenfelder definiert wurden. Andere Feldtypen sind nicht erlaubt.



***



## Functional Requirements



### A. Formular-Builder (Admin-Interface)



#### 1. Drag-and-Drop Interface

- Visueller Builder mit Drag-and-Drop zur Frage-Anordnung

- Fragen können zwischen Abschnitten verschoben werden

- Live-Vorschau beim Bearbeiten

- Undo/Redo-Funktionalität



#### 2. Formular-Grundeinstellungen

- **Formulartitel**: Erforderlich

- **Formularbeschreibung**: Optional

- **Zielgruppe(n)**: Mehrere Gruppen selektierbar

- **Sichtbarkeit**: Public, Internal, Restricted (folgt ChurchTools Gruppen-Berechtigungen)

- **Deadline/Zeitfenster**: Optional (Start- und Enddatum mit Uhrzeit)

- **Teilnehmer-Limit**: Optional (Maximale Anmeldungen pro Gruppe/Gesamtformular)

- **Warteliste**: Aktivierbar wenn Limit erreicht

- **DSGVO-Checkbox**: Optional (Custom-Text konfigurierbar)



#### 3. Abschnitte (Sections)

- Formulare bestehen aus mehreren Abschnitten

- Jeder Abschnitt kann einen Titel und optionale Beschreibung haben

- Abschnitte sind in Reihenfolge navigierbar (Button "Weiter")

- **Bedingte Abschnitte**: Bei verzweigter Logik springt User zu definierten nächsten Abschnitt



#### 4. Fragetypen (Field Types)

Unterstütze ALLE Feldtypen, die ChurchTools nativ unterstützt:

- Text (Textfeld)

- Textarea (Langtextfeld)

- Email

- Number

- Checkbox (Ja/Nein)

- Single Choice / Dropdown (Radio-Button / Select)

- Multiple Choice (Checkboxes)

- Date (Datumsfeld)

- DateTime (Datum + Uhrzeit)

- Tel (Telefonnummer)

- Color (Farbwähler)

- File Upload (optional – nur wenn ChurchTools unterstützt)



#### 5. Frage-Konfiguration

Jede Frage hat folgende Eigenschaften:

- **Feldtitel**: Erforderlich

- **Feldbeschreibung**: Optional (unter der Frage angezeigt)

- **Feldtyp**: Wähle aus unterstützten Typen

- **Erforderlich**: Toggle (kann auch bedingt erforderlich sein)

- **Standard-Wert**: Optional

- **Platzhalter-Text**: Optional

- **Linked Group Field**: Wähle das Ziel-Gruppenfeld (Dropdown laden via API)

- **Save to Form Only**: Toggle – Wenn aktiviert, wird diese Frage NUR für Verzweigung genutzt, nicht in Gruppen gespeichert

- **Validierung**:

- Email-Format

- Mindestlänge/Maximallänge

- Zahlenbereich (min/max)

- Custom Regex Pattern (optional)

- **Conditional Logic**:

- "Show/Hide this field if [Field X] = [Value Y]"

- Oder: "Make this field required if [Field X] = [Value Y]"



#### 6. Verzweigungslogik (Branching)

- **V1 Scope**: Single-level branching (für zukünftige Multi-Level zu erweitern)

- **Logic Builder**: Visual Editor mit:

- Bedingung: "If [Question X] = [Answer Y]"

- Aktion: "Then go to [Section Z]"

- Support für Single-Answer-Bedingung (z.B. nur Single Choice / Radio Button)

- **Branch Handling bei Zielgruppen**:

- Ein User kann zu verschiedenen Gruppen navigieren je nach Branch

- Verschiedene Gruppen-Ziele können UNTERSCHIEDLICHE Gruppenfelder haben

- **Lösung**: Jede Antwort wird NUR in die entsprechenden Gruppenfelder gespeichert, die in DIESER Gruppe existieren. Nicht existierende Felder werden ignoriert (kein Fehler).

- Markiere am Ende klar, in welche Gruppe(n) der User landen wird



#### 7. Formular-Verwaltung

- **Liste aller Formulare**: Übersichtstabelle mit:

- Formulartitel

- Zielgruppen

- Status (Aktiv/Inaktiv/Entwurf)

- Bearbeitungsdatum

- Erstellungsdatum

- Anmeldezahlen (wenn aktiv)

- Aktionen: Bearbeiten, Duplifizieren, Vorschau, Statistiken, Löschen

- **Duplikation**: Formulare können als Vorlage gespeichert werden

- **Versionierung**: Änderungshistorie mit Rollback-Funktion

- **Rollen-Berechtigungen**:

- Wer darf Formulare erstellen/bearbeiten

- Wer darf Antworten sehen

- Separate Berechtigung von Standard-Admin



***



### B. Formular-Frontend (Benutzersicht)



#### 1. Formular-Display

- **Responsive Design**: Mobile-First, optimiert für alle Geräte

- **Design**: Folge ChurchTools aktuellen Style (inkl. Dark Mode Support)

- **Formular-Header**:

- Titel

- Beschreibung

- ggf. Abschnitt-Fortschritt ("Schritt 2 von 5")

- **One-Question-per-Screen**: Jede Frage auf eigener "Seite" (optional Toggle)

- oder

- **Multi-Question Layout**: Mehrere Fragen pro Abschnitt



#### 2. Sichtbarkeit & Berechtigungen

- Public Groups: Öffentliches Formular ohne Login

- Internal Groups: Login erforderlich, nur interne Nutzer

- Restricted Groups: Nach ChurchTools Berechtigungen

- Berechtigungs-Check VOR Formular-Rendering



#### 3. Bedingtes Rendering

- Fragen erscheinen/verschwinden basierend auf bisherigen Antworten

- Smooth Transition/Animation beim Anzeigen

- Validierung berücksichtigt bedingte Erforderlichkeit



#### 4. Formular-Eingabe & Validierung

- **Real-time Validation**: Beim Blur oder nach Eingabe

- **Fehleranzeige**:

- Rote Fehlermeldung UNTER dem Feld

- Zusätzlich: ChurchTools Error-Toast oben rechts

- Klare, benutzerfreundliche Fehlertexte auf Deutsch

- **Erforderliche Felder**: Markierung mit *

- **Eingabe-Feedback**: Visual Indication bei Success/Error



#### 5. Abschnitts-Navigation

- **Buttons**:

- "Zurück" – Zurück zu vorherigem Abschnitt

- "Weiter" – Nächsten Abschnitt laden

- Validiert aktuelle Abschnitt VOR dem Weiterleiten

- Bei Verzweigung: Springt zu bedingtem nächstem Abschnitt

- **Fortschrittsanzeige**:

- Progress Bar

- "Schritt X von Y"

- Oder: Abschnitt-Punkte/Breadcrumb



#### 6. Formular-Ende & Absendung

- **Zusammenfassung**: Optional – Zeige alle Antworten zur Bestätigung

- **Submit-Button**: "Anmelden" / "Absenden"

- **Double-Opt-In**: KEIN Double-Opt-In (direktes Speichern, keine E-Mail-Bestätigung nötig)

- **Submit-Logik**:

1. Validiere alle Antworten
2. Erstelle/Aktualisiere Person in ChurchTools (wenn nötig)
3. Speichere Antworten in entsprechenden Gruppenfeldern
4. Füge Person zur Zielgruppe hinzu
5. Zeige Success-Meldung



#### 7. Mehrfach-Anmeldung (Update-Verhalten)

- **Einstellung im Formular konfigurierbar**:

- **Option A**: "Keine Duplikate" – Wenn Person bereits in Gruppe:

- Zeige Warnung: "Sie sind bereits angemeldet. Erneute Anmeldung nicht möglich."

- Sende optionale E-Mail: "Anmeldung wurde nicht aktualisiert, da Sie bereits Mitglied sind."

- **Option B**: "Antworten aktualisieren" – Wenn Person bereits in Gruppe:

- Überschreibe existierende Antworten mit neuen Werten

- Bestätigungsmeldung: "Ihre Anmeldedaten wurden aktualisiert."



#### 8. Success-Screen

- Bestätigungsmeldung: "Vielen Dank für Ihre Anmeldung!"

- Optionale Custom-Nachricht (vom Admin konfigurierbar)

- Button: "Formulare erneut laden" oder "Zur Gruppe"



#### 9. Speicherung der Antworten

- **Direktes Mapping**: Jede Antwort wird in das konfigurierte Gruppenfeld gespeichert

- **Field Type Mapping**: TypeScript-Map zwischen Frage-Feldtyp und Gruppenfeld-Typ

- **Validation vor Speicherung**: Stelle sicher, dass Datentypen kompatibel sind

- **Error Handling**: Bei API-Fehler zeige ChurchTools Error-Toast

- **Person Creation**: Wenn Person nicht existiert und Formular öffentlich, erstelle neue Person mit verfügbaren Daten (Vorname, Nachname, E-Mail)



#### 10. Datenschutz

- **DSGVO-Checkbox**: Optional am Formulare-Ende

- Checkbox-Text: Konfigurierbar durch Admin

- Speichere Zustimmung (optional in separatem Feld oder Datensatz)



***



### C. Admin-Dashboard & Statistiken



#### 1. Antwort-Übersicht

- Tabelle aller Anmeldungen für Formular

- Spalten: Vorname, Nachname, E-Mail, Anmeldedatum, Status, Aktionen

- **Filter & Suche**:

- Nach Person suchen

- Nach Anmeldedatum filtern

- Nach Zielgruppe filtern

- **Sortierung**: Nach Datum, Name, etc.



#### 2. Statistiken

- Gesamt-Anmeldezahl

- Anmeldungen pro Gruppe/Branch

- Beliebteste Antwort-Optionen (für Single/Multiple Choice)

- Grafische Darstellung: Charts für Visualisierung

- Export-Möglichkeit



#### 3. Export

- **Format**: CSV/Excel

- **Inhalt**: Alle Antworten mit Person-Infos

- **Filter**: Exportiere nur ausgewählte Anmeldungen



#### 4. Bulk-Aktionen

- Mehrere Anmeldungen auswählen

- Bearbeiten/Löschen in Batch

- E-Mail an ausgewählte Personen senden (optional)



#### 5. Formular-Management

- Aktiv/Inaktiv Toggle

- Status: Entwurf, Aktiv, Beendet

- Bearbeiten, Duplifizieren, Löschen, Archivieren



***



### D. User Roles & Permissions



#### 1. Rollen

- **Form Builder Role**: Kann Formulare erstellen/bearbeiten/löschen (separiert von Admin)

- **Form Viewer Role**: Kann Antworten ansehen/exportieren

- **Form Manager Role**: Volle Kontrolle über Formulare + Antworten

- **Admin Role**: Hat automatisch alle Rechte



#### 2. Permission Check

- Vor Formular-Rendering: Prüfe Gruppen-Sichtbarkeit (Public/Internal/Restricted)

- Vor Admin-Zugriff: Prüfe User-Rolle und Gruppen-Zugehörigkeit



***



## UI/UX Requirements



### 1. Design

- **Style**: Folge aktuelles ChurchTools Design System (v3.119+)

- **Farben**: Nutze CSS-Variablen aus ChurchTools

- **Responsive**: Mobile, Tablet, Desktop

- **Dark Mode**: Unterstütze Dark-Mode Toggle (ChurchTools Theme)

- **Barrierefreiheit**: WCAG 2.1 Level AA

- Keyboard Navigation vollständig

- Screen Reader kompatibel

- Sufficient Color Contrast (4.5:1)

- Aria-Labels für alle Inputs

- Semantisches HTML



### 2. UX Pattern (orientiert an MS Forms)

- Clean, minimalistisches Interface

- Große Click Targets

- Clear Visual Hierarchy

- Progress Indication

- Error States klar erkennbar

- Success State mit Bestätigung



### 3. Interaktionen

- Smooth Transitions zwischen Abschnitten

- Loading State beim API-Call

- Disabled Submit Button während Speicherung

- Toast Notifications für Erfolg/Fehler

- Confirmation Dialog vor Löschen



***



## Technical Implementation Details



### 1. State Management

- Nutze Vue.js Reactive State

- Formular-Data Structure:



**Development Roadmap (Phase 1)**

**MVP Phase 1 (Current Development)**:

•  ✅ Basic Form Builder mit Drag-and-Drop

•  ✅ Single-level Branching Support

•  ✅ Form Display mit bedingtem Rendering

•  ✅ Data Saving zu Gruppenfeldern

•  ✅ Duplicate Handling (Update vs. No-Duplicate)

•  ✅ Admin Dashboard mit Responses

•  ✅ Berechtigungssystem

**Future Phases** (offen für Erweiterung):

•  Multi-level Branching

•  Multi-Condition Logic (AND/OR)

•  Save & Resume Later

•  Enhanced Reporting/Exports

•  SMS Integration

•  Event Calendar Integration



**Key Notes for AI Assistants (Claude Code / ChatGPT)**

1  **Boilerplate Structure**: Nutze die offizielle ChurchTools-Plugin-Boilerplate als Basis. Alle Files sollten den Standard-Struktur folgen.

2  **ChurchTools API v2**: IMMER die neueste REST API v2 nutzen. Kein Fallback auf AJAX.

3  **Vue.js Pattern**: Folge Vue.js 3 Composition API wo möglich. Reactive State Management.

4  **Error Handling**: Immer aussagekräftige, benutzerfreundliche Fehlermeldungen.

5  **Typsicherheit**: TypeScript strict mode. Keine any Types.

6  **Responsive & Accessible**: Keine Ausnahmen bei WCAG 2.1 AA Compliance.

7  **Testing**: Unit Tests für Validierung, Integration Tests für API-Calls.

8  **Dokumentation**: Ausführliche Inline-Kommentare, besonders bei komplexer Logik.

9  **Performance**: Caching wo sinnvoll, Lazy Loading, Code Splitting.

10      **Extensibility**: Code so schreiben, dass zukünftige Features (Multi-Level Branching) leicht hinzufügbar sind.



**How to Use This Prompt**

**Für ChatGPT**:

1  Kopiere den GESAMTEN Prompt

2  Starte ein neues Projekt

3  Berichte vom Boilerplate-Repo

4  Frage nach Struktur-Aufbau, dann schrittweise implementieren

**Für Claude Code / Cursor**:

1  Kopiere den Prompt in ein neues Chat

2  Lade die Boilerplate-Repo (falls lokal)

3  Claude wird direkt Code generieren und Dateien erstellen

4  Iteriere in kleineren Chunks (Builder -> Display -> Admin)



Diese Prompt ist auf Deutsch geschrieben, da dies deine bevorzugte Arbeitssprache ist.





text

---



## Zusätzliche Hinweise zum Prompt



**Schreibe ChatGPT / Claude in Chunks an**, nicht den ganzen Prompt auf einmal:



1. **Chunk 1**: "Architektur & Plugin-Struktur" – Boilerplate Setup, Basis-Dateien
2. **Chunk 2**: "Form Builder Module" – Drag-and-Drop, Editor-Komponenten
3. **Chunk 3**: "Form Display & Frontend" – User-seitige Formular-Anzeige
4. **Chunk 4**: "API-Integration & Datenspeicherung" – ChurchTools API-Calls
5. **Chunk 5**: "Branching & Conditional Logic" – Verzweigungslogik
6. **Chunk 6**: "Admin-Dashboard & Statistiken"
7. **Chunk 7**: "Validierung, Error Handling, Security"
8. **Chunk 8**: "Testing & Dokumentation"



**Best Practice für AI-Coding**:

- Nach jedem Chunk: Teste local, gebe Feedback

- Screenshot Fehler → paste in nächste Konversation

- Frage um Erklärung bei komplexem Code

- Nutze "Sie verstehen?" als Checkpoint



Brauchst du noch Adjustments am Prompt oder willst du direkt mit Chunk 1 beginnen?

1  https://churchtools.academy/de/help/churchtools-module/personen/0-personen-und-gruppen/

2  [https://api.church.tools](https://api.church.tools/)

3  https://leimer.name/churchtools/ChurchTools_XSS_Vulnerability_2019-06.pdf

4  https://forum.church.tools/topic/2521/churchdb-drop-down-auswahlfelder-in-der-personenliste-und-beim-erstellen-von-gruppen

5  https://churchtools.academy/de/help/changelog/web-app-und-website/changelog-web/

6  https://blog.church.tools/blog/v3-94-personen-dubletten-umsaetze-und-storno/

7  [https://blog.church.tools/blog/v3-119-das-gruppenmodul-ist-da-%F0%9F%8E%89/](https://blog.church.tools/blog/v3-119-das-gruppenmodul-ist-da-🎉/)

8  [https://forum.church.tools/topic/9859/api-endpoint-f%C3%BCr-verkn%C3%BCpfung-zwischen-calendar-appointment-und-event](https://forum.church.tools/topic/9859/api-endpoint-für-verknüpfung-zwischen-calendar-appointment-und-event)

9  https://blog.church.tools/blog/v3-117-vorlagen-editor-personalisierte-bescheinigungen-kalender-updates/

10      https://www.youtube.com/watch?v=Y-RFE1hsJaU