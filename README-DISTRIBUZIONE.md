# SustAId - Gestione e Analisi Materiali Sostenibili

**Versione 0.1.0** - Beta Test Release

## Cos'è SustAId?

SustAId è un'applicazione desktop che aiuta a gestire, analizzare e visualizzare dati sui materiali sostenibili. Permette di:

- 📊 **Importare ed esplorare** database di materiali con parametri di sostenibilità
- 📈 **Visualizzare dati** attraverso grafici interattivi (barre, scatter, radar, torta)
- 🤖 **Interrogare i dati** usando un assistente AI intelligente
- 💾 **Esportare grafici** come immagini PNG o documenti PDF
- 🔍 **Validare la qualità** dei dati importati
- 📁 **Gestire file CSV** per import/export dei materiali

## Requisiti di Sistema

### Windows
- Windows 10 o superiore (64-bit)
- 4 GB RAM minimo (8 GB consigliato)
- 100 MB spazio su disco

### macOS
- macOS 10.15 (Catalina) o superiore
- 4 GB RAM minimo (8 GB consigliato)
- 100 MB spazio su disco

## Installazione

### Windows

1. Scarica il file `sustAId.exe`
2. Salva il file in una cartella a tua scelta (es. `C:\Programmi\sustAId\` o sul Desktop)
3. Fai doppio clic su `sustAId.exe` per avviare l'applicazione

**Versione portatile:** Non richiede installazione. Puoi eseguire l'app direttamente o creare un collegamento sul
  Desktop.
  
**⚠️ Avviso di Sicurezza Windows:**
La prima volta che avvii l'app, Windows Defender mostrerà un avviso perché l'app non ha una firma digitale (normale per le versioni beta).

Per procedere:
1. Clicca su **"Maggiori informazioni"**
2. Clicca su **"Esegui comunque"**

### macOS

1. Scarica il file `sustAId.app.zip` (o `sustAId.app.tar.gz`)
2. Estrai il file compresso
3. Trascina `sustAId.app` nella cartella Applicazioni (opzionale - puoi metterlo ovunque)
4. Fai doppio clic su `sustAId.app` per avviare l'applicazione

**⚠️ Avviso di Sicurezza macOS:**
La prima volta potresti vedere un avviso di sicurezza. Per risolvere:
1. Vai in **Preferenze di Sistema → Sicurezza e Privacy**
2. Clicca su **"Apri comunque"**

Oppure:
1. **Tasto destro** sull'icona dell'app
2. Seleziona **"Apri"**
3. Conferma nell'avviso che appare

## Come Usare l'App

### 1. Primo Avvio
All'apertura, l'app carica **automaticamente** un database completo e dettagliato di materiali sostenibili da Supabase. Potrai iniziare immediatamente ad esplorare molti materiali con tutti i loro parametri di sostenibilità, senza bisogno di importare nulla.

### 2. Importare Materiali Personalizzati (Opzionale)
Se vuoi aggiungere o sostituire i materiali con i tuoi dati:
1. Clicca sul pulsante **"Upload CSV/SQL"** 
2. Seleziona un file CSV/SQL contenente i dati dei materiali
3. L'app mostrerà un'anteprima e validare i dati
4. Clicca **"Import"** per confermare

**Formato CSV richiesto:**
Il file deve contenere colonne come:
- Material Name o Material ID (obbligatorio)
- Category (obbligatorio)
- Altri parametri: Carbon Footprint, Water Usage, Recyclability, ecc.

### 3. Esplorare i Dati
Dopo l'import, puoi:
- **Visualizzare statistiche** generali (numero materiali, colonne, qualità dati)
- **Navigare la tabella** dei materiali
- **Filtrare** per categoria o altri parametri
- **Cercare** materiali specifici

### 4. Creare Grafici
1. Seleziona il tipo di grafico desiderato (Bar, Scatter, Radar, Pie)
2. Scegli le metriche da visualizzare
3. Il grafico si aggiorna automaticamente
4. Usa i pulsanti **PNG** o **PDF** per esportare il grafico

### 5. Chat AI Assistant
1. Clicca sull'icona **"AI Chat"**
2. Fai domande sui tuoi materiali, ad esempio:
   - "Quali materiali hanno il minor impatto ambientale?"
   - "Mostrami i materiali della categoria X"
   - "Qual è il carbon footprint medio?"
3. L'AI analizzerà i tuoi dati e fornirà risposte contestuali

## Funzionalità Principali

### Dashboard Statistiche
- Numero totale materiali
- Colonne rilevate
- Indicatori qualità dati
- Avvisi per dati mancanti

### Grafici Interattivi
- **Bar Chart**: confronto parametri tra materiali
- **Scatter Plot**: correlazioni tra due variabili
- **Radar Chart**: profilo multi-dimensionale
- **Pie Chart**: distribuzione per categorie

### Export & Condivisione
- Esporta grafici come immagini PNG (alta qualità)
- Salva grafici come PDF per report
- Esporta dati modificati in CSV

### Validazione Dati
- Controllo automatico campi obbligatori
- Segnalazione materiali con dati incompleti
- Suggerimenti per migliorare la qualità

## Problemi Comuni

### L'app non si avvia
- Verifica i requisiti di sistema
- Controlla di aver estratto tutti i file dallo zip (Windows)
- Prova a riavviare il computer

### Errore durante l'import CSV
- Verifica che il file contenga le colonne obbligatorie
- Assicurati che il file sia in formato UTF-8
- Controlla che non ci siano caratteri speciali nei nomi delle colonne

### I grafici non si esportano
- Verifica di avere permessi di scrittura nella cartella
- Controlla lo spazio disponibile su disco
- Prova a esportare in un formato diverso (PNG vs PDF)

### Chat AI non risponde
- Assicurati di aver importato dei materiali
- Verifica la connessione internet (se usa API esterna)
- Prova a riformulare la domanda in modo più semplice

## Privacy e Dati

- Tutti i dati rimangono sul tuo computer
- Nessuna informazione viene inviata a server esterni (eccetto le richieste AI se abilitate)
- I file CSV importati non vengono condivisi
- Puoi eliminare tutti i dati chiudendo l'app

## Prossimi Aggiornamenti

Funzionalità in sviluppo:
- [ ] Supporto per più formati file (Excel, JSON)
- [ ] Grafici personalizzabili avanzati
- [ ] Confronto tra dataset diversi
- [ ] Template report automatici
- [ ] Analisi predittive con AI
- [ ] Supporto multilingua

## Informazioni Tecniche

- **Framework**: React 19 + Tauri 2
- **Database**: Supabase (cloud)
- **Grafici**: Recharts
- **AI**: Simulazione intelligente / Anthropic Claude
- **Export**: jsPDF, html2canvas

## Supporto

Per domande o problemi contatta: [inserisci contatto]

---

**Grazie per aver testato SustAId!**

_Questa è una versione beta non firmata digitalmente. Usa in ambienti di test._
