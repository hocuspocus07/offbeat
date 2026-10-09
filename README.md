# Offbeat

**Your music. Your library. Your rhythm.**

Offbeat is a music streaming platform being built with a focus on clean user experience, reliable playback, efficient media delivery, and offline listening.

The project is designed as a serious software engineering and system design project, with development progressing in defined phases rather than adding features before the foundations are ready.

## Project Status

**Status:** In development  
**Current phase:** Application foundation and authentication

### Planned features

- User registration, login, and account management
- Artist, album, and track catalog
- Personal music library and playlists
- Persistent audio player and playback controls
- Audio streaming through object storage and CDN delivery
- Track downloads and offline playback
- Responsive, installable Progressive Web App (PWA)

Music will be sourced from authorized uploads and appropriately licensed catalogs.

## Technology Stack

| Area | Technology |
|---|---|
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI components | shadcn/ui |
| Typography | Space Grotesk, Inter, JetBrains Mono |
| Authentication | Supabase Auth |
| Application database | Supabase PostgreSQL |
| Planned media storage | Cloudflare R2 |
| Planned media delivery | Cloudflare CDN |
| Planned offline storage | IndexedDB |
| Planned offline support | Service Worker / PWA |
| Planned testing | Vitest and Playwright |

## Architecture

Offbeat separates application data, media storage, and media delivery.

```text
                    ┌──────────────────┐
                    │   Web Browser    │
                    │  Next.js / React │
                    └────────┬─────────┘
                             │
                   ┌─────────┴─────────┐
                   │                   │
                   ▼                   ▼
           ┌──────────────┐    ┌────────────────┐
           │ Next.js App  │    │ Audio Delivery │
           │ Server / API │    │ CDN / R2       │
           └──────┬───────┘    └────────────────┘
                  │
           ┌──────┴───────┐
           │              │
           ▼              ▼
     ┌───────────┐  ┌─────────────┐
     │ Supabase  │  │ Supabase    │
     │ Auth      │  │ PostgreSQL  │
     └───────────┘  └─────────────┘
```

The media-delivery components shown above are part of the planned architecture and may not yet be implemented.

### Architecture principles

- **PostgreSQL:** stores catalog metadata and user-generated application data.
- **Supabase Auth:** manages identity and authentication sessions.
- **Object storage:** holds canonical audio and artwork files.
- **CDN:** delivers media without routing every audio byte through the application server.
- **IndexedDB:** will store selected tracks for offline playback.
- **Security:** authorization and database access policies will be enforced as the relevant features are implemented.

## Getting Started

### Prerequisites

Install the following:

- Node.js compatible with the installed Next.js version
- npm
- Git
- A Supabase project

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd offbeat
```

Replace the repository URL with your actual Git remote.

### 2. Install dependencies

```bash
npm install
```

If you're setting up the project from scratch, ensure the required packages are installed and the shadcn/ui configuration is initialized.

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace the placeholder values with credentials from your Supabase project.

**Security notes:**

- Never commit `.env.local`.
- Never expose Supabase secret or service-role keys through `NEXT_PUBLIC_*` variables.
- Keep production credentials separate from development credentials.

### 4. Configure Supabase Auth

In your Supabase dashboard:

1. Open Authentication and configure the email authentication provider.
2. Set the local site URL to `http://localhost:3000`.
3. Add `http://localhost:3000/auth/callback` to the allowed redirect URLs.
4. Configure email delivery if you need reliable signup confirmation emails.

The built-in email provider has sending limits. Use a custom SMTP provider when your development or production needs exceed those limits.

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Endpoints

### `GET /api/health`

Checks whether the application server responds.

**Successful response:**

```json
{
  "status": "ok",
  "service": "offbeat",
  "timestamp": "2026-10-10T00:00:00.000Z"
}
```

The timestamp is generated when the endpoint is requested.

This is a liveness endpoint. It does not verify Supabase connectivity, database readiness, or media-storage availability.

## Development Commands

```bash
# Start the development server
npm run dev

# Create a production build
npm run build

# Run the production server after building
npm run start

# Run lint checks, if configured in package.json
npm run lint
```

Run these commands from the project root. Available scripts depend on the current `package.json`.

## Project Roadmap

### Phase 0: Product and architecture

- Define MVP scope
- Select the technology stack
- Establish media licensing and sourcing rules
- Define storage and delivery architecture

### Phase 1: Application foundation

- Configure Next.js and TypeScript
- Establish global styling and typography
- Integrate Supabase Auth
- Implement signup, login, logout, and protected routes
- Add a health endpoint
- Document environment setup
- Validate the production build

### Phase 2: Database and catalog

- Design PostgreSQL schema
- Model profiles, artists, albums, and tracks
- Implement playlists and track ordering
- Add likes and listening history
- Define constraints, indexes, and Row Level Security policies

### Phase 3: Media ingestion

- Establish an authorized media ingestion workflow
- Upload audio and artwork to object storage
- Validate file types and metadata
- Store media references in PostgreSQL
- Implement content deduplication

### Phase 4: Music interface

- Build the application layout and navigation
- Implement search and catalog browsing
- Add album, artist, and playlist pages
- Integrate the persistent player layout

### Phase 5: Playback engine

- Implement play, pause, seek, and volume controls
- Handle track changes and playback errors
- Integrate Media Session API support
- Manage player state across navigation

### Phase 6: Streaming and delivery

- Integrate object storage and CDN delivery
- Implement appropriate access controls
- Support efficient media requests and caching
- Measure startup latency and playback reliability

### Phase 7: Downloads

- Build a download manager
- Track download progress and failures
- Handle storage limits and duplicate files

### Phase 8: Offline PWA

- Add the installable application shell
- Store eligible audio in IndexedDB
- Implement offline playback
- Handle synchronization when connectivity returns

### Phase 9: Performance and cost

- Measure bandwidth and storage usage
- Optimize media formats and delivery
- Improve caching and database query performance
- Establish operational cost estimates

Recommendations and advanced personalization are deferred until the core listening experience is reliable.

## Engineering Principles

- Build and validate one phase before expanding scope.
- Keep audio delivery separate from application-server request handling.
- Use authorization checks and least-privilege database policies.
- Avoid storing audio binaries directly in PostgreSQL.
- Test failure paths, not just successful requests.
- Measure performance before introducing architectural complexity.
- Use only media the platform is authorized to distribute.

## License

The project's software license has not yet been specified. Add a `LICENSE` file before publishing the repository for public reuse. Music and artwork may have separate licensing terms from the application code.

---

**Offbeat is a work in progress.** The goal is to build a reliable music product while demonstrating practical software engineering, database design, media delivery, and offline application architecture.
