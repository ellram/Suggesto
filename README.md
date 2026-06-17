# Suggesto

En enkel fullstack-app med Django REST API (backend) og React (frontend). Denne veiledningen viser hvordan du kjører prosjektet lokalt på macOS og Windows – uten behov for Docker. En kort Docker-seksjon finnes nederst, men merk at Docker-oppsettet i repoet trenger noen justeringer for å fungere.

Innhold
- Forutsetninger
- Rask oppstart (anbefalt)
  - Backend (Django)
  - Frontend (React)
- API-endepunkter og testing
- Feilsøking
- Valgfritt: Docker (eksperimentelt)

## Forutsetninger

- macOS eller Windows
- Node.js LTS (18+ anbefales) og npm
  - Sjekk: `node -v` og `npm -v`
- Python 3.10–3.12 (anbefalt). Prosjektet bruker SQLite i utvikling, så du trenger ikke å installere databaser lokalt.
  - Sjekk: `python3 --version` (macOS) eller `py -3 --version` (Windows)

Merk om Pipfile: Repoet inneholder en Pipfile med `python_version = "3.14"`, som ikke er nødvendig for lokal kjøring og kan feile dersom du ikke har akkurat denne tolkeren. Følg stegene under med et vanlig virtuelt miljø i stedet.

## Rask oppstart (anbefalt)

Disse stegene starter backend (Django) på http://localhost:8000 og frontend (React) på http://localhost:3000. CORS er allerede konfigurert for localhost:3000.

### 1) Backend (Django)

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

### 2) Frontend (React)

Åpne en ny terminal-fane i prosjektroten.

- Felles for macOS og Windows:
  1. `cd frontend`
  2. `npm install`
  3. `npm start`

Frontend kjører på http://localhost:3000 og proxyer API-kall til http://localhost:8000 (konfigurert i `frontend/package.json`).

## API-endepunkter og testing

Tilgjengelige endepunkter (uten autentisering i utvikling):
- Liste/skap forslag: `GET/POST http://localhost:8000/api/suggestions/`
- Oppdatér/slett forslag: `PUT/DELETE http://localhost:8000/api/suggestions/{id}/`
- JWT (hvis du slår på autentisering senere):
  - Hent token: `POST http://localhost:8000/api/token/`
  - Oppfrisk token: `POST http://localhost:8000/api/token/refresh/`

Eksempel med curl (opprette forslag):
```
curl -X POST http://localhost:8000/api/suggestions/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Ny idé", "description": "Beskrivelse"}'
```

## Feilsøking

- Port i bruk
  - 8000 (backend) eller 3000 (frontend) kan være opptatt. Lukk prosessen eller endre port.
- CORS-feil i nettleser
  - Sørg for at frontend kjører på http://localhost:3000. `CORS_ORIGIN_WHITELIST` i Django settings tillater denne opprinnelsen.
- Node/React feiler ved oppstart
  - Slett `frontend/node_modules` og `frontend/package-lock.json`, kjør `npm install` igjen.
- Python-pakker
  - Sjekk at du har aktivert det virtuelle miljøet (`.venv`).
- Pipenv/Pipfile
  - Ignorer Pipfile for lokal utvikling (eller endre den til din Python-versjon dersom du vil bruke Pipenv).

## Valgfritt: Docker (eksperimentelt)

Repoet inneholder `docker-compose.yml` og en backend-Dockerfile, men konfigurasjonen er ikke helt i sync per nå:
- `docker-compose.yml` peker på `build: .` for backend, mens Dockerfile ligger i `backend/backend/Dockerfile`.
- Django-settings bruker SQLite som standard og leser ikke `DATABASE_URL` fra `.env`.

Dersom du ønsker Docker-støtte, foreslås følgende forbedringer før bruk:
1. Endre backend-build i `docker-compose.yml` slik at den peker til korrekt kontekst og Dockerfile, f.eks.:
   -
   ```yaml
   backend:
     build:
       context: ./backend
       dockerfile: backend/Dockerfile
   ```
2. Legg til en `requirements.txt` for backend og bruk den i Dockerfile (eller generer den fra miljøet ditt med `pip freeze > requirements.txt`).
3. Oppdater `backend/backend/settings.py` til å støtte `DATABASE_URL` (f.eks. ved å bruke `dj-database-url`) dersom du vil bruke Postgres-containere.

Til lokal utvikling anbefales det å bruke stegene i «Rask oppstart» over (SQLite + npm), da de fungerer på både macOS og Windows uten ekstra oppsett.

---

Lisens: MIT (eller oppdater etter behov)
