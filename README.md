# Suggesto

Problemer med å gjennomføre oppsettet? 
- Har du mattermost kan du sende melding til @ellecr
- Eller send meg en mail på ellecr@uio.no

For å se designmalen jeg har lagd tilhørende prosjektet, se følgende figma lenke. Ta kontakt dersom lenken ikke fungerer: 
- [https://www.figma.com/design/l0K6bl2QZhhpKFjX630qXl/Suggesto?m=auto&t=8xpUcdMdRKSADB3p-6](https://www.figma.com/design/l0K6bl2QZhhpKFjX630qXl/Suggesto?m=auto&t=8xpUcdMdRKSADB3p-1)

Skjermbilde av start siden til web-appen:
![Startskjerm](frontend/src/images/hovedskjerm)

En enkel fullstack-app med Django REST API (backend) og React (frontend). Dette er hvordan du kjører prosjektet lokalt på macOS og Windows. Denne beskrivelsen viser hvordan å sette det opp uten docker på sin egen maskin, men jeg har begynt et docker oppsett for videre CD/CI. En kort Docker-seksjon finnes nederst, men merk at Docker-oppsettet i repoet trenger noen justeringer for å fungere.

NB: merk at dette er en MVP for å vise en forslagstavle. Det er laget design modeller til videre utvikling dersom jeg har mer tid. Det er som er funksjonelt er
- forslagstavlen
- API-et
- Funksjonalitet for å kunne endre status på kortene

## Innhold
- Forutsetninger og moduler du må ha på maskinen
- Start av web-appen
  - Backend (Django)
  - Frontend (React)
- API-endepunkter og Arkiteturskisser
- Litt om Docker her for videre oppsett mot andre tjenester
- Refleksjon om prosjektet (relevant for IT-Hjelp evalueringen)

## 1) Forutsetninger:

- macOS eller Windows
- Node.js LTS og npm
  - Sjekk: `node -v` og `npm -v`
- Python 3.10–3.12. Prosjektet bruker SQLite, så du trenger ikke å installere databaser lokalt.
  - Sjekk: `python3 --version` (macOS) eller `py -3 --version` (Windows)

Merk om Pipfile og virtuelt miljø: Repoet inneholder en Pipfile med `python_version = "3.14"`, som ikke er nødvendig for lokal kjøring og kan feile dersom du ikke har akkurat denne tolkeren. Følg stegene under med et vanlig virtuelt miljø i stedet.

## 2) Oppstart:

Disse stegene starter backend (Django) på http://localhost:8000 og frontend (React) på http://localhost:3000.

### a) Backend (Django)

Kjør kommandoene fra repo-roten (mappen som inneholder `backend/` og `frontend/`).

- macOS / Linux (bash/zsh):
  1. Opprett og aktiver virtuelt miljø
     - `python3 -m venv .venv`
     - `source .venv/bin/activate`
  2. Installer avhengigheter
     - `pip install django djangorestframework django-cors-headers djangorestframework-simplejwt`
  3. Kjør migrasjoner (SQLite brukes som standard)
     - `python backend/manage.py migrate`
  4. Start utviklingsserver
     - `python backend/manage.py runserver 0.0.0.0:8000`

- Windows (PowerShell):
  1. Opprett og aktiver virtuelt miljø
     - `py -3 -m venv .venv`
     - `.\.venv\Scripts\Activate.ps1`
  2. Installer avhengigheter
     - `pip install django djangorestframework django-cors-headers djangorestframework-simplejwt`
  3. Kjør migrasjoner
     - `py -3 backend/manage.py migrate`
  4. Start utviklingsserver
     - `py -3 backend/manage.py runserver 0.0.0.0:8000`

Backend er nå tilgjengelig på http://localhost:8000

### b) Frontend (React)

Åpne en ny terminal-fane i prosjektroten.

- Felles for macOS og Windows:
  1. `cd frontend`
  2. `npm install`
  3. `npm start`

Frontend kjører på http://localhost:3000 og proxyer API-kall til http://localhost:8000 (konfigurert i `frontend/package.json`).

## 3) API-endepunkter 

Tilgjengelige endepunkter (uten autentisering i utvikling):
- List/Create forslag: `GET/POST http://localhost:8000/api/suggestions/`
- Update/Delete forslag: `PUT/DELETE http://localhost:8000/api/suggestions/{id}/`
- JWT (hvis du slår på autentisering senere): (Joason Web tokens)
  - Hent token: `POST http://localhost:8000/api/token/`
  - Oppfrisk token: `POST http://localhost:8000/api/token/refresh/`
  NB om JWT: jeg måtte slå av autentisering i denne versjonen for å kunne la alle kjøre appen, i et prod miljø ville det vært satt opp atuentisering mot andre kildesystemer. 

Eksempel med curl (opprette forslag):
```
curl -X POST http://localhost:8000/api/suggestions/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Ny idé", "description": "Beskrivelse"}'
```

## 4) Litt om Docker:

Repoet inneholder `docker-compose.yml` og en backend-Dockerfile, men konfigurasjonen er ikke helt i sync per nå:
- `docker-compose.yml` peker på `build: .` for backend, mens Dockerfile ligger i `backend/backend/Dockerfile`.
- Django-settings bruker SQLite som standard og leser ikke `DATABASE_URL` fra `.env`.

Dersom du ønsker Docker-støtte, foreslås følgende forbedringer før bruk:
1. Endre backend-build i `docker-compose.yml` slik at den peker til korrekt kontekst og Dockerfile, f.eks.:
   
   ```yaml
   backend:
     build:
       context: ./backend
       dockerfile: backend/Dockerfile
   ```
2. Legg til en `requirements.txt` for backend og bruk den i Dockerfile (eller generer den fra miljøet ditt med `pip freeze > requirements.txt`).
3. Oppdater `backend/backend/settings.py` til å støtte `DATABASE_URL` (f.eks. ved å bruke `dj-database-url`) dersom du vil bruke Postgres-containere.

## 5) Refleksjon til oppgaven (til reviewers ved IT-Hjelp): 
I denne "oppgaven" er det mange valg som er tatt med tanke på hvor mye tid vi har hatt til disposisjon. Det er tatt valg som har vært "enklere" å implementere og designvalg som er valgt fordi det sparte tid. De valgene jeg vil trekke frem som jeg har gjort i denne prosessen er:
- Jeg har valgt å implementere en ganske enkel modell i bunn som er da hvordan dataene lagres i SQLlite DB-en. Dette er for å enkelt kunne legge på funksjonallitet så jeg bruker mer tid på å få API-et responsivt mot frontenden enn å ha for kompleks backend med for tunge modeller.
- Jeg har brukt Django sitt REST framework fordi det er den mest effektive modellen basert på oppdateringer som er kommet og det er mye god dokumentasjon ute om det. I dette prosjektet har det vært et fokus på læring, og derfor har jeg forsøkt å bruke lite KI/ KI-agenter for å løse problemet og heller brukt tid på å lese dokumentasjon (KI har blitt brukt men i andre deler av appen, mer om dette senere).
- Som min HTTP-klient har jeg brukt js biblioteket "axios" for å gjøre kallene.
- Jeg har valgt å ikke sette opp denne MVP-en med innlogging eller bruker autentisering. Dette har gjort at jeg kranglet mye med å få lov til å redigere på kortene siden Django-API-et egentlig krever at man sender en ID bakover i URL-en. Dette løste jeg ved å tillate alle innlogginger, noe som ikke er helt trygt eller robust, men grunnet dårlig tid var dette løsningen  jeg endte med.
- Jeg har valgt å bruke Django i bunn med SQLlite siden dette er standard pakken som Django tilbyr når man skal sette opp en minimal applikkasjon. SQLlite er også mer hensiktsmessig å bruke siden du kan lage lokale modeller der man kan teste modell oppsett og regler, uten å måtte sette opp store tabeller i feks postgreSQL.
- En siste ting jeg ønsker å trekke frem er at jeg har valgt å lage kort på et slagt kan-ban-board istede for postitlapper. Dersom jeg hadde inplementert flyttbare kort, ville dette vært en kul funksjon, men jeg tror at forvirringen rundt bruken kunne vært større. Her gikk jeg for en enkel og intuitiv design versjon. 

# Videre utvikling og "hvis jeg hadde mer tid"... 
Dette prosjektet kunne man jobbet med å utvikle et fullstendig integrasjon som hadde vært koblet mot cerebrum, feide og andre systemer som IT-Hjelp benytter seg av. Det er flere desing messige ting jeg skulle ønske jeg hadde mer tid til å se på, men som har blitt valgt bort fordi det ikke ble nokk tid. 

Her er noen av tingene jeg hadde gjort først for videre utvikling:
- Lagt til mulighet for sletting av kort - dette falt bort fordi jeg ikke fikk tid
- Sette opp JWT med innlogging mot Feide eller liknende for å kunne gjøre slik at bare admin kan endre status på kortene, mens alle andre "ordniære" brukere kanlegge til kort og forslag.
- Jeg hadde brukt litt tid på å rydde opp i URL-ene her, og satt opp ryddigere id håndteringer mot API-et.
- Desing jobben hadde jeg gjort i større grad med fokus på iterasjon, brukertesting og analyse av hva IT-hjelpen faktisk ønsker/trenger. Nå ble det litt "fort gjort", og det ser man ift. layout, farger og visuelle tilgjengelighetsprinsipper. Jeg har forsøkt å lage appen så intuitiv som mulig for å gjøre den enkel å bruke for en førstegangsbruker.
- Jeg hadde også brukt mer tid på å sette dette opp mot doscker, så man kan integrere dette videre mot andre tjenester og kjøre det på distrubuerte servere rundt på UiO.

I presentasjonen av MVP-en vil jeg fokusere mer på API-designet, interaksjon med appen, figam-designet og generelt om flyten mellom backend og frontent. 

Gi beskjed om noe er uklart med veiledningen for å sette opp web-appen eller om det er noen brutte lenker som ikke funker.

:)
