# Deploying BandForm

Production runs the two web components **same-origin behind a reverse proxy** (nginx/Caddy):
the proxy serves the built frontend as static files and forwards `/graphql` and `/graphql-ws`
to the backend. Because everything is one origin, the session cookie stays first-party
(`SameSite=Strict; Secure`) and no CORS is needed in normal use.

```
                 ┌───────────────────────────────┐
  https://bandform.example  →  reverse proxy
                 │   /            → static frontend (bandform-web build)
                 │   /graphql     → backend :8080
                 │   /graphql-ws  → backend :8080 (WebSocket upgrade)
                 └───────────────────────────────┘
```

## 1. Backend

### Required environment
| Variable | Purpose |
| --- | --- |
| `SPRING_PROFILES_ACTIVE` | must be `prod` |
| `SERVER_JWT_SECRET` | JWT signing secret — **at least 32 bytes** (HS256); startup fails otherwise |
| `DB_HOST` | Postgres host |
| `DB_PORT` | Postgres port (defaults to `5432`) |
| `DB_NAME` | Postgres database name |
| `DB_USER` | Postgres user |
| `DB_PASSWORD` | Postgres password |
| `FRONTEND_ORIGIN` | the site origin, e.g. `https://bandform.example` |

The `prod` profile (`application-prod.properties`) sets `auth.cookie.secure=true`, disables the
seeder and the H2 console, and points JPA at Postgres with `ddl-auto=update` (Hibernate manages
the schema for now).

### Postgres (self-hosted / Docker)
```bash
docker run -d --name bandform-db \
  -e POSTGRES_DB=bandform \
  -e POSTGRES_USER=bandform \
  -e POSTGRES_PASSWORD=<strong-password> \
  -p 5432:5432 \
  -v bandform-pgdata:/var/lib/postgresql/data \
  postgres:16
```

### Build & run
```bash
cd bandform-backend
JAVA_HOME=/path/to/jdk-21 ./mvnw clean package        # produces target/*.jar

SPRING_PROFILES_ACTIVE=prod \
SERVER_JWT_SECRET='<>=32-byte secret>' \
DB_HOST=localhost DB_NAME=bandform DB_USER=bandform DB_PASSWORD=<strong-password> \
FRONTEND_ORIGIN=https://bandform.example \
java -jar target/*.jar
```
The backend listens on `:8080`; the reverse proxy is what exposes it publicly.

## 2. Frontend

Build with `BF_API_ORIGIN` **empty** so the client uses relative URLs (same origin as the proxy);
the WebSocket scheme follows the page protocol (`wss://` under HTTPS).

```bash
cd bandform-web
pnpm install
BF_API_ORIGIN= pnpm build          # output in dist/
```
Serve the built files as the site root. (If you ever host the backend on a *different* domain,
build with `BF_API_ORIGIN=https://api.example.com` instead and switch the backend to a
`SameSite=None; Secure` cookie + CORS for that origin.)

## 3. Reverse proxy (example: Caddy)
```
bandform.example {
    root * /srv/bandform-web
    @api path /graphql /graphql-ws
    handle @api {
        reverse_proxy localhost:8080
    }
    handle {
        try_files {path} /index.html
        file_server
    }
}
```
The `try_files {path} /index.html` line is the **SPA fallback**: any route that isn't a real file
(e.g. a refresh on `/login`) serves `index.html` so the client-side router renders it instead of
404ing. The nginx equivalent:
```nginx
location / {
    try_files $uri /index.html;
}
location ~ ^/graphql(-ws)?$ {
    proxy_pass http://localhost:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;      # WebSocket upgrade for /graphql-ws
    proxy_set_header Connection "upgrade";
}
```
Caddy terminates TLS automatically; nginx needs the `Upgrade`/`Connection` headers shown above for
the `/graphql-ws` WebSocket.

## Pre-flight checklist
- [ ] `SERVER_JWT_SECRET` is ≥ 32 bytes and not the dev value.
- [ ] Postgres reachable; `SPRING_PROFILES_ACTIVE=prod`.
- [ ] Site is HTTPS end-to-end (so `Secure` cookies are sent).
- [ ] Verify after boot: no "Seeded dev accounts" log line, `/h2-console` returns 404, and the
      `session` cookie shows `Secure`.
