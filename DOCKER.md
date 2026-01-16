# Shad Docker Setup Guide

This guide explains how to run Shad using Docker and Docker Compose, including the API backend, Redis cache, and web frontend.

## Quick Start

### Prerequisites

- Docker 20.10+
- Docker Compose 2.0+
- An Obsidian vault with content
- API keys for Claude (Anthropic) or OpenAI

### 1. Clone and Configure

```bash
# Clone the repository
git clone https://github.com/jonesj38/shad.git
cd shad

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### 2. Set Required Environment Variables

Edit `.env` and set at minimum:

```bash
# Your Obsidian vault path (absolute path on your host)
OBSIDIAN_VAULT_PATH=/Users/yourname/Documents/MyVault

# Your LLM API key (choose one)
ANTHROPIC_API_KEY=sk-ant-...
# OR
OPENAI_API_KEY=sk-...
```

### 3. Launch Services

```bash
# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Access the Application

- **Frontend UI**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/v1/health

## Architecture

```
┌─────────────────┐
│  Frontend       │  Port 3000
│  (Next.js)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Shad API       │  Port 8000
│  (FastAPI)      │
└────┬────────┬───┘
     │        │
     ▼        ▼
┌─────────┐ ┌──────────────┐
│  Redis  │ │ Obsidian     │
│  Cache  │ │ Vault        │
│         │ │ (read-only)  │
└─────────┘ └──────────────┘
```

## Services

### Redis

- **Image**: `redis:7-alpine`
- **Port**: 6379
- **Purpose**: Caching subtask results and budget tracking
- **Data**: Persisted in `redis-data` volume

### Shad API

- **Build**: `./services/shad-api/Dockerfile`
- **Port**: 8000
- **Purpose**: Core RLM engine, task execution, vault operations
- **Volumes**:
  - `./services/shad-api/History` - Run history and artifacts
  - Your vault (read-only) - Mounted at `/vault`

### Frontend

- **Build**: `./frontend/Dockerfile`
- **Port**: 3000
- **Purpose**: Web UI for managing runs and viewing results
- **Tech Stack**: Next.js, React, TypeScript, Tailwind CSS

## Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `OBSIDIAN_VAULT_PATH` | Path to your Obsidian vault | `/Users/me/MyVault` |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | `sk-ant-...` |
| `OPENAI_API_KEY` | OpenAI API key (alternative) | `sk-...` |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `REDIS_URL` | `redis://redis:6379/0` | Redis connection string |
| `OBSIDIAN_API_KEY` | - | Obsidian REST API key |
| `OBSIDIAN_BASE_URL` | - | Obsidian REST API URL |
| `DEFAULT_MAX_DEPTH` | `3` | Default max recursion depth |
| `DEFAULT_MAX_NODES` | `50` | Default max DAG nodes |
| `DEFAULT_MAX_WALL_TIME` | `300` | Default timeout (seconds) |
| `DEFAULT_MAX_TOKENS` | `100000` | Default token budget |
| `LOG_LEVEL` | `info` | Logging level |

## Usage Examples

### Using the Web UI

1. Open http://localhost:3000
2. Click "New Run"
3. Enter your goal/task
4. Configure strategy and budget settings
5. Click "Create Run"
6. Monitor progress in the dashboard

### Using the API Directly

Create a run:

```bash
curl -X POST http://localhost:8000/v1/run \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Summarize key concepts in my notes about authentication",
    "strategy": "research",
    "verify": "basic"
  }'
```

Check run status:

```bash
curl http://localhost:8000/v1/run/<run_id>
```

List recent runs:

```bash
curl http://localhost:8000/v1/runs
```

Search vault:

```bash
curl "http://localhost:8000/v1/vault/search?query=authentication&limit=10"
```

## Management Commands

### Start Services

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d api
```

### Stop Services

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes data)
docker-compose down -v
```

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f redis
```

### Rebuild After Code Changes

```bash
# Rebuild and restart services
docker-compose up -d --build

# Rebuild specific service
docker-compose up -d --build api
```

### Access Container Shell

```bash
# API container
docker-compose exec api /bin/sh

# Frontend container
docker-compose exec frontend /bin/sh
```

## Troubleshooting

### Service Won't Start

Check logs:
```bash
docker-compose logs api
```

Common issues:
- Missing API keys in `.env`
- Invalid vault path
- Port conflicts (8000 or 3000 already in use)

### Vault Not Connected

Verify:
1. `OBSIDIAN_VAULT_PATH` is set correctly in `.env`
2. Path exists and is accessible
3. Path is absolute, not relative
4. Check API logs: `docker-compose logs api`

### Frontend Can't Connect to API

1. Check API is running: `docker-compose ps`
2. Check API health: `curl http://localhost:8000/v1/health`
3. Verify network: `docker-compose exec frontend ping api`

### Redis Connection Failed

```bash
# Test Redis connection
docker-compose exec redis redis-cli ping

# Should return: PONG
```

### Out of Memory

Increase Docker memory limits in Docker Desktop settings:
- Recommended: 4GB minimum
- For large runs: 8GB+

## Data Persistence

### Run History

Run artifacts are stored in:
```
./services/shad-api/History/Runs/<run_id>/
```

This directory is mounted from your host, so data persists across container restarts.

### Redis Cache

Redis data is stored in a Docker volume `redis-data`. To clear cache:

```bash
docker-compose down
docker volume rm shad_redis-data
docker-compose up -d
```

## Development Mode

For development with hot reload:

### API

```bash
cd services/shad-api
docker-compose -f docker-compose.dev.yml up
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at http://localhost:3000 with hot reload.

## Production Deployment

For production:

1. Use reverse proxy (nginx/Traefik) for SSL
2. Set strong Redis password
3. Use Docker secrets for API keys
4. Enable authentication on API endpoints
5. Set `NODE_ENV=production`
6. Configure backup for History/ directory

Example nginx config:

```nginx
server {
    listen 443 ssl;
    server_name shad.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## Updating

Pull latest changes and rebuild:

```bash
git pull
docker-compose down
docker-compose up -d --build
```

## Uninstall

Remove all containers, volumes, and data:

```bash
docker-compose down -v
rm -rf services/shad-api/History/*
```

## Support

For issues:
- Check logs: `docker-compose logs`
- Review [README.md](README.md) for general Shad documentation
- Review [SPEC.md](SPEC.md) for technical details
- Open an issue on GitHub

## Next Steps

- Configure your vault with curated content (see README.md)
- Try example tasks from README.md
- Explore the API at http://localhost:8000/docs
- Read about strategies and verification in SPEC.md
