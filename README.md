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
Kort forklaring av valg du har tatt 
Hva du eventuelt ville gjort videre med mer tid 
