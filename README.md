# 🤖 MentorSpeak.ai

MentorSpeak.ai is a **SaaS platform** that lets users create their own **AI-powered agents**, host interactive **video meetings**, and access complete **summaries, transcripts, timestamps, recordings, and chat history**.

Built with **Next.js, tRPC, Stream.io, OpenAI, Inngest, BetterAuth, Polar, Drizzle ORM, Neon (Postgres), and Vercel**, MentorSpeak.ai provides a seamless way for individuals and teams to collaborate with AI in real-time.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Data Flow](#-data-flow)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)

---

## ✨ Features

### 🔹 AI Agent Creation
- Create custom AI agents tailored to your needs by providing instructions and personality settings.
- Manage multiple agents for different purposes (e.g., teaching, support, brainstorming).
- Each agent has unique instructions that define their behavior during meetings.

### 🔹 Interactive Meetings
- Schedule and join **video meetings** with your AI agents.
- Real-time **chat** powered by Stream.io.
- Automatic **transcription** with speaker identification.
- Live **closed captions** during meetings.
- **Auto-recording** in 1080p quality.

### 🔹 Post-Meeting Insights
- AI-powered **summaries** generated using OpenAI GPT-4o.
- Full **transcripts** with precise **timestamps**.
- Speaker identification for users and AI agents.
- Access **recorded videos** anytime.

### 🔹 SaaS Platform
- Role-based authentication and subscription management with **BetterAuth** and **Polar**.
- Free tier with usage limits, premium plans for unlimited access.
- Fully hosted and scalable with **Vercel**.

---

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | [Next.js 15](https://nextjs.org/) | React framework with App Router |
| **API Layer** | [tRPC](https://trpc.io/) | End-to-end typesafe APIs |
| **Database** | [Neon](https://neon.tech/) | Serverless Postgres |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) | Type-safe database queries |
| **Video & Chat** | [Stream.io](https://getstream.io/) | Real-time video calls and messaging |
| **AI** | [OpenAI API](https://openai.com/) + [Inngest Agent Kit](https://www.inngest.com/docs/agent-kit) | Meeting summaries and AI agents |
| **Background Jobs** | [Inngest](https://www.inngest.com/) | Async transcript processing |
| **Authentication** | [BetterAuth](https://betterauth.dev/) | User authentication with OAuth |
| **Payments** | [Polar](https://polar.sh/) | Subscription management |
| **Hosting** | [Vercel](https://vercel.com/) | Edge deployment |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + [Tailwind CSS](https://tailwindcss.com/) | Accessible component library |

---

## 🏗️ Architecture Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Next.js)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │   Dashboard  │  │  Call Page   │  │     Meeting Details      │  │
│  │              │  │              │  │                          │  │
│  │ - Agent List │  │ - Video UI   │  │ - Summary View           │  │
│  │ - Meetings   │  │ - Chat Panel │  │ - Transcript + Timestamps│  │
│  │ - Premium    │  │ - AI Realtime│  │ - Recording Playback     │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌────────────────────────────────────────────────────────────────────┐
│                        API LAYER (tRPC)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │
│  │ agentsRouter │  │meetingsRouter│  │     premiumRouter        │  │
│  │              │  │              │  │                          │  │
│  │ CRUD for AI  │  │ CRUD + Video │  │ Subscription Management  │  │
│  │ Agents       │  │ Integration  │  │ Usage Tracking           │  │
│  └──────────────┘  └──────────────┘  └──────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ▼               ▼               ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│     Neon DB      │ │    Stream.io     │ │      Polar       │
│    (Postgres)    │ │  Video & Chat    │ │   Subscriptions  │
│                  │ │                  │ │                  │
│ - users          │ │ - Video calls    │ │ - Products       │
│ - agents         │ │ - Transcription  │ │ - Customers      │
│ - meetings       │ │ - Recording      │ │ - Billing        │
│ - sessions       │ │ - Chat channels  │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
                                │
                                ▼
               ┌────────────────────────────────┐
               │      INNGEST (Background)      │
               │                                │
               │  - Fetch transcripts           │
               │  - Parse JSONL transcript      │
               │  - Identify speakers           │
               │  - Generate AI summary (GPT-4o)│
               │  - Update meeting record       │
               └────────────────────────────────┘
```

---

## 🔄 Data Flow

### 1. User Authentication Flow
```
User → Sign In Page → BetterAuth → OAuth Provider (Google/GitHub)
                           ↓
                    Create/Update User in Neon DB
                           ↓
                    Create Session → Return JWT Token
                           ↓
                    Store in HTTP-only Cookie
```

### 2. Agent Creation Flow
```
User → Agent Form → tRPC (agents.create) → Premium Check (Polar)
                           ↓
              [Free tier: max agents check]
                           ↓
              Insert into Neon DB (agents table)
                           ↓
              Return created agent with nanoid
```

### 3. Meeting Creation & Video Call Flow
```
User → Create Meeting → tRPC (meetings.create)
                           ↓
       Insert meeting record (status: "upcoming")
                           ↓
       Create Stream.io video call with settings:
         - Auto transcription (language: en)
         - Auto recording (quality: 1080p)
         - Closed captions enabled
                           ↓
       Upsert AI Agent as Stream.io user
                           ↓
       Return meeting ID → Redirect to /call/[meetingId]
```

### 4. Live Meeting Flow
```
User joins call → Stream.io SDK initializes
                           ↓
       Generate Stream token (tRPC: meetings.generateToken)
                           ↓
       Connect to video call → AI Agent joins via OpenAI Realtime API
                           ↓
       Stream.io auto-records + auto-transcribes
                           ↓
       User ends meeting → Status changes to "processing"
```

### 5. Post-Meeting Processing Flow (Inngest)
```
Meeting ends → Stream.io webhook triggers event
                           ↓
       Inngest function "meetings/processing" triggered
                           ↓
       Step 1: Fetch transcript JSONL from Stream CDN
                           ↓
       Step 2: Parse JSONL to get { speaker_id, text, timestamp }
                           ↓
       Step 3: Identify speakers (lookup users + agents in DB)
                           ↓
       Step 4: Send to OpenAI GPT-4o summarizer agent
                           ↓
       Step 5: Update meeting record in DB:
         - Set summary
         - Set status to "completed"
```

### 6. Subscription & Premium Flow
```
User → Upgrade Page → tRPC (premium.getProducts) → Polar API
                           ↓
       Display subscription plans (sorted by price)
                           ↓
       User selects plan → Polar Checkout
                           ↓
       Polar webhook → Update customer status
                           ↓
       Premium procedures unlocked (check via premiumProcedure)
```

---

## 🗄️ Database Schema

### Tables Overview

| Table | Description |
|-------|-------------|
| `user` | User accounts with email, name, and avatar |
| `session` | Active user sessions with tokens and expiry |
| `account` | OAuth provider connections (Google, GitHub, etc.) |
| `verification` | Email verification tokens |
| `agents` | AI agents with custom instructions |
| `meetings` | Meeting records with status, transcript, summary, and recording |

### Entity Relationship Diagram

```
┌───────────────────┐       ┌───────────────────┐
│       user        │       │      session      │
├───────────────────┤       ├───────────────────┤
│ id (PK)           │──┐    │ id (PK)           │
│ name              │  │    │ token             │
│ email (unique)    │  │    │ expiresAt         │
│ emailVerified     │  ├───→│ userId (FK)       │
│ image             │  │    │ ipAddress         │
│ createdAt         │  │    │ userAgent         │
│ updatedAt         │  │    └───────────────────┘
└───────────────────┘  │
         │             │    ┌───────────────────┐
         │             │    │      account      │
         │             │    ├───────────────────┤
         │             └───→│ id (PK)           │
         │                  │ accountId         │
         │                  │ providerId        │
         │                  │ userId (FK)       │
         │                  │ accessToken       │
         │                  │ refreshToken      │
         │                  └───────────────────┘
         │
         ▼
┌───────────────────┐       ┌───────────────────┐
│      agents       │       │     meetings      │
├───────────────────┤       ├───────────────────┤
│ id (PK, nanoid)   │◄──────│ id (PK, nanoid)   │
│ name              │       │ name              │
│ userId (FK)       │       │ userId (FK)       │
│ instructions      │       │ agentId (FK)      │
│ createdAt         │       │ status (enum)     │
│ updatedAt         │       │ startedAt         │
└───────────────────┘       │ endedAt           │
                            │ transcriptUrl     │
                            │ summary           │
                            │ recordingUrl      │
                            │ createdAt         │
                            │ updatedAt         │
                            └───────────────────┘
```

### Meeting Status Enum
| Status | Description |
|--------|-------------|
| `upcoming` | Meeting created but not started |
| `active` | Meeting currently in progress |
| `processing` | Meeting ended, generating summary |
| `completed` | Summary generated, fully processed |
| `cancelled` | Meeting was cancelled |

---

## 📡 API Reference

MentorSpeak.ai uses **tRPC** for type-safe API communication. All procedures require authentication unless specified.

### Agents Router (`/api/trpc/agents.*`)

| Procedure | Type | Input | Description |
|-----------|------|-------|-------------|
| `agents.create` | Mutation | `{ name: string, instructions: string }` | Create new AI agent (Premium check applied) |
| `agents.getMany` | Query | `{ page?, pageSize?, search? }` | List user's agents with pagination and search |
| `agents.getOne` | Query | `{ id: string }` | Get single agent with meeting count |
| `agents.update` | Mutation | `{ id: string, name?, instructions? }` | Update agent details |
| `agents.remove` | Mutation | `{ id: string }` | Delete an agent and all associated meetings |

### Meetings Router (`/api/trpc/meetings.*`)

| Procedure | Type | Input | Description |
|-----------|------|-------|-------------|
| `meetings.create` | Mutation | `{ name: string, agentId: string }` | Create meeting and Stream.io call |
| `meetings.getMany` | Query | `{ page?, pageSize?, search?, status?, agentId? }` | List meetings with filters |
| `meetings.getOne` | Query | `{ id: string }` | Get meeting with agent info and duration |
| `meetings.update` | Mutation | `{ id: string, name?, status? }` | Update meeting details |
| `meetings.remove` | Mutation | `{ id: string }` | Delete meeting |
| `meetings.generateToken` | Mutation | - | Get Stream.io video token for user |
| `meetings.generateChatToken` | Mutation | - | Get Stream.io chat token for user |
| `meetings.getTranscript` | Query | `{ id: string }` | Get parsed transcript with speaker info |

### Premium Router (`/api/trpc/premium.*`)

| Procedure | Type | Input | Description |
|-----------|------|-------|-------------|
| `premium.getProducts` | Query | - | List available subscription plans from Polar |
| `premium.getCurrentSubscription` | Query | - | Get user's active subscription details |
| `premium.getFreeUsage` | Query | - | Get current usage counts for free tier users |

### REST API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/*` | All | BetterAuth authentication routes |
| `/api/inngest` | POST | Inngest webhook handler for background jobs |
| `/api/webhook` | POST | Stream.io and Polar webhook receiver |

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/vivekpal2001/MentorSpeak.ai.git
cd MentorSpeak.ai
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
```bash
cp .env.example .env
```
See [Environment Variables](#-environment-variables) section for required values.

### 4️⃣ Set Up the Database
```bash
npm run db:push     # Push schema to Neon
npm run db:studio   # (Optional) Open Drizzle Studio
```

### 5️⃣ Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### 6️⃣ (Optional) Set Up Webhooks for Local Development
```bash
npm run dev:webhook  # Starts ngrok tunnel for Stream.io/Polar webhooks
```

---

## 🎣 Custom Hooks

MentorSpeak.ai provides several custom React hooks to manage state, filters, and UI behavior:

### Global Hooks

| Hook | Location | Purpose |
|------|----------|---------|
| `useConfirm(title, description)` | [src/hooks/use-confirm.tsx](src/hooks/use-confirm.tsx) | Displays a confirmation dialog and returns a promise that resolves to `true` or `false` based on user action |
| `useIsMobile()` | [src/hooks/use-mobile.ts](src/hooks/use-mobile.ts) | Detects if the viewport width is mobile (< 768px) and returns a boolean; adjusts on window resize |

### Feature Hooks

#### Agents Module
| Hook | Location | Purpose |
|------|----------|---------|
| `useAgentsFilters()` | [src/modules/agents/hooks/use-agents-filters.ts](src/modules/agents/hooks/use-agents-filters.ts) | Manages URL query state for agents list filtering with `search` and `page` parameters |

#### Meetings Module
| Hook | Location | Purpose |
|------|----------|---------|
| `useMeetingsFilters()` | [src/modules/meetings/hooks/use-meetings-filters.ts](src/modules/meetings/hooks/use-meetings-filters.ts) | Manages URL query state for meetings list filtering with `search`, `page`, `status`, and `agentId` parameters |

### Hook Details

#### `useConfirm(title, description)`
Returns a tuple of `[ConfirmationDialog, confirmFunction]`:
- **ConfirmationDialog** - A React component that renders the confirmation modal
- **confirmFunction** - An async function that shows the dialog and resolves to the user's choice

**Usage Example:**
```typescript
const [ConfirmDialog, confirm] = useConfirm("Delete Agent", "Are you sure?");

const handleDelete = async () => {
  const isConfirmed = await confirm();
  if (isConfirmed) {
    // Perform delete action
  }
};

return <>
  <button onClick={handleDelete}>Delete</button>
  <ConfirmDialog />
</>;
```

#### `useIsMobile()`
Returns a boolean indicating mobile viewport. Uses `window.matchMedia()` for responsive detection.

**Usage Example:**
```typescript
const isMobile = useIsMobile();

return isMobile ? <MobileLayout /> : <DesktopLayout />;
```

#### `useAgentsFilters()` & `useMeetingsFilters()`
Both hooks use the `nuqs` library for URL-based state management, providing type-safe query parameter parsing. The `useQueryStates` from `nuqs` keeps filter state in sync with the URL, enabling bookmarkable and shareable filtered views.

**Usage Example:**
```typescript
const [search, setSearch] = useAgentsFilters();

return <>
  <input 
    value={search} 
    onChange={(e) => setSearch(e.target.value)}
    placeholder="Search agents..."
  />
</>;
```

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon Postgres connection string | ✅ |
| `BETTER_AUTH_SECRET` | Secret for BetterAuth sessions | ✅ |
| `BETTER_AUTH_URL` | Base URL for auth (e.g., `http://localhost:3000`) | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | For Google login |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | For Google login |
| `STREAM_API_KEY` | Stream.io API key | ✅ |
| `STREAM_API_SECRET` | Stream.io API secret | ✅ |
| `OPENAI_API_KEY` | OpenAI API key for GPT-4o | ✅ |
| `POLAR_ACCESS_TOKEN` | Polar API access token | ✅ |
| `POLAR_ORGANIZATION_ID` | Polar organization ID | ✅ |
| `INNGEST_SIGNING_KEY` | Inngest webhook signing key | For production |
| `INNGEST_EVENT_KEY` | Inngest event key | For production |

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication pages (sign-in, sign-up)
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── agents/         # Agent management pages
│   │   ├── meetings/       # Meeting list and details
│   │   └── upgrade/        # Subscription upgrade page
│   ├── api/                # API routes
│   │   ├── auth/           # BetterAuth handler
│   │   ├── inngest/        # Inngest function handler
│   │   ├── trpc/           # tRPC API handler
│   │   └── webhook/        # External webhooks (Stream, Polar)
│   └── call/               # Video call page
│
├── components/             # Reusable UI components (Radix + custom)
│
├── db/                     # Database configuration
│   ├── index.ts            # Drizzle client initialization
│   └── schema.ts           # Database schema definitions
│
├── hooks/                  # Custom React hooks
│
├── inngest/                # Background job definitions
│   ├── client.ts           # Inngest client
│   └── functions.ts        # Meeting processing function
│
├── lib/                    # Shared utilities
│   ├── auth.ts             # BetterAuth server config
│   ├── auth-client.ts      # BetterAuth client config
│   ├── avatar.tsx          # DiceBear avatar generator
│   ├── polar.ts            # Polar client
│   ├── stream-chat.ts      # Stream Chat client
│   ├── stream-video.ts     # Stream Video client
│   └── utils.ts            # General utilities (cn, etc.)
│
├── modules/                # Feature modules
│   ├── agents/             # Agent feature
│   │   ├── hooks/          # React Query hooks
│   │   ├── server/         # tRPC procedures
│   │   ├── schemas.ts      # Zod validation schemas
│   │   └── ui/             # UI components
│   ├── meetings/           # Meetings feature
│   │   ├── hooks/
│   │   ├── server/
│   │   ├── types.ts        # TypeScript types
│   │   └── ui/
│   └── premium/            # Subscription feature
│       ├── server/
│       └── ui/
│
└── trpc/                   # tRPC configuration
    ├── client.tsx          # React Query + tRPC client
    ├── init.ts             # Procedure definitions (protected, premium)
    ├── query-client.ts     # TanStack Query client
    ├── routers/            # Combined app router
    └── server.tsx          # Server-side tRPC caller
```

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push schema changes to database |
| `npm run db:studio` | Open Drizzle Studio GUI |
| `npm run dev:webhook` | Start ngrok tunnel for webhooks |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/vivekpal2001">Vivek Pal</a>
</p>
