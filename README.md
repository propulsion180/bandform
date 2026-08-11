# bandform
A  place for musicians looking to create, join, or fill a band

## Components

The repo holds three components. The **server-side deployment is just the backend + web** (Postgres
← backend on `:8080` ← reverse proxy, same origin → static web); the Android app and the web app are
both clients of the backend's GraphQL API. Production specifics (Docker Postgres, reverse-proxy
config, full env table) are in [`DEPLOYMENT.md`](DEPLOYMENT.md).

### `bandform-backend` — API server (`:8080`)
Spring Boot 4.0.3, Java 21, GraphQL over HTTP + WebSocket.

- **Dependencies:** JDK 21; Maven via the bundled `./mvnw`; **PostgreSQL** in production (dev uses an
  embedded H2 database, no external service).
- **Environment:** `SERVER_JWT_SECRET` (≥ 32 bytes) always; production also needs
  `SPRING_PROFILES_ACTIVE=prod`, `DB_HOST` / `DB_PORT` / `DB_NAME` / `DB_USER` / `DB_PASSWORD`, and
  `FRONTEND_ORIGIN`.
- **Run (dev — H2, seeds demo accounts):**
  ```bash
  cd bandform-backend
  SERVER_JWT_SECRET='<32+ byte secret>' JAVA_HOME=/path/to/jdk-21 ./mvnw spring-boot:run
  ```
- **Build & run (prod — Postgres):**
  ```bash
  JAVA_HOME=/path/to/jdk-21 ./mvnw clean package        # -> target/*.jar
  SPRING_PROFILES_ACTIVE=prod SERVER_JWT_SECRET='<32+ bytes>' \
  DB_HOST=localhost DB_PORT=5432 DB_NAME=bandform DB_USER=bandform DB_PASSWORD=<pw> \
  FRONTEND_ORIGIN=https://bandform.example java -jar target/*.jar
  ```


### `bandform-web` — web frontend (`:3000` in dev, static in prod)
React 19 + TypeScript, bundled by esbuild, GraphQL types generated with graphql-codegen.

- **Dependencies:** Node (20+ recommended) and pnpm 10.9.0 (`corepack enable`). At **build time**
  graphql-codegen reads the backend schema at
  `../bandform-backend/src/main/resources/graphql/schema.graphqls`, so the backend source must be
  present when building the web app. At runtime it calls the backend's `/graphql` and `/graphql-ws`.
- **Run (dev — talks to the backend on `localhost:8080`):**
  ```bash
  cd bandform-web
  pnpm install
  pnpm dev
  ```
- **Build (prod — same-origin reverse proxy):**
  ```bash
  BF_API_ORIGIN= pnpm build     # empty -> relative API URLs; static output under dist/
  ```
  Serve the built assets and `index.html` behind the reverse proxy (SPA fallback + `/graphql*`
  proxied to `:8080`). To host the backend on a different domain instead, build with
  `BF_API_ORIGIN=https://api.example.com`.

### `bandform-android` — mobile client (not deployed to the server)
An Android GraphQL client of the backend, built to an APK and installed on a device.

- **Dependencies:** JDK + Android SDK.
- **Build:** `cd bandform-android && ./gradlew assembleDebug` (→ APK). Not required for the web
  deployment.
