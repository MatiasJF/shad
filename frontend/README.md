# Shad Frontend

Modern web interface for Shannon's Daemon built with Next.js, React, and TypeScript.

## Features

- **Dashboard**: View all runs, create new tasks, monitor progress
- **Vault Search**: Search your Obsidian vault directly from the UI
- **Run Management**: View detailed run information, resume failed runs
- **Admin Tools**: Monitor cache statistics and HITL queue
- **Real-time Updates**: Live status updates for running tasks
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Running Shad API (see parent directory)

### Setup

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Update .env.local with your API URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Start development server
npm run dev
```

Open http://localhost:3000

### Build for Production

```bash
npm run build
npm start
```

## Docker

The frontend is included in the main docker-compose setup. See [../DOCKER.md](../DOCKER.md) for details.

### Build Docker Image

```bash
docker build -t shad-frontend .
```

### Run Container

```bash
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  shad-frontend
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Layout.tsx
│   │   ├── RunCard.tsx
│   │   └── NewRunForm.tsx
│   ├── lib/             # Utilities and API client
│   │   └── api.ts
│   ├── pages/           # Next.js pages
│   │   ├── _app.tsx
│   │   ├── _document.tsx
│   │   ├── index.tsx    # Dashboard
│   │   ├── vault.tsx    # Vault search
│   │   └── admin.tsx    # Admin tools
│   └── styles/
│       └── globals.css  # Global styles
├── public/              # Static assets
├── Dockerfile
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Shad API base URL | `http://localhost:8000` |
| `NODE_ENV` | Node environment | `development` |

## API Integration

The frontend communicates with the Shad API via the client in `src/lib/api.ts`.

### Available Endpoints

- `POST /v1/run` - Create new run
- `GET /v1/run/:id` - Get run status
- `POST /v1/run/:id/resume` - Resume run
- `GET /v1/runs` - List runs
- `GET /v1/vault/status` - Vault connection status
- `GET /v1/vault/search` - Search vault
- `GET /v1/admin/cache/stats` - Cache statistics
- `GET /v1/admin/hitl/queue` - HITL queue

## Pages

### Dashboard (`/`)

Main page showing:
- Run creation form
- Recent runs with status
- Vault connection indicator
- Statistics (total, running, completed, failed)

### Vault Search (`/vault`)

Search interface for exploring your Obsidian vault:
- Full-text search
- Result previews
- Relevance scoring

### Admin (`/admin`)

Administrative dashboard:
- Redis cache statistics
- HITL review queue
- System health metrics

## Components

### Layout

Persistent layout with navigation and footer.

### RunCard

Displays run information:
- Status badge
- Token usage
- Node progress
- Expandable details
- Resume functionality

### NewRunForm

Modal form for creating runs:
- Goal/task input
- Strategy selection
- Budget configuration
- Verification level
- Output options

## Styling

Uses Tailwind CSS with custom theme:

- Primary color: Blue (#0ea5e9)
- Dark mode support
- Responsive breakpoints
- Custom components via @layer

## Contributing

1. Follow TypeScript best practices
2. Use Tailwind for styling (no custom CSS unless necessary)
3. Keep components small and focused
4. Add prop types for all components
5. Test in both light and dark mode

## License

MIT
