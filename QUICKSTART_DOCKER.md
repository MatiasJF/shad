# Shad Docker Quick Start

Get Shad running with Docker in 5 minutes.

## Prerequisites

- Docker and Docker Compose installed
- An Obsidian vault with content
- API key for Claude (Anthropic) or OpenAI

## Steps

### 1. Clone Repository

```bash
git clone https://github.com/jonesj38/shad.git
cd shad
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

**Minimum required configuration in `.env`:**

```bash
# Your vault path (absolute path on your machine)
OBSIDIAN_VAULT_PATH=/Users/yourname/Documents/MyVault

# Your LLM API key (choose one)
ANTHROPIC_API_KEY=sk-ant-api03-xxx...
# OR
OPENAI_API_KEY=sk-xxx...

# Redis (already configured for Docker)
REDIS_URL=redis://redis:6379/0
```

### 3. Start Services

```bash
docker-compose up -d
```

This will:
- Pull/build Docker images
- Start Redis, Shad API, and Frontend
- Mount your vault as read-only

### 4. Verify Services

```bash
# Check all services are running
docker-compose ps

# Should show:
# shad-redis     running
# shad-api       running
# shad-frontend  running

# Check API health
curl http://localhost:8000/v1/health

# Should return: {"status":"healthy","version":"0.1.0","service":"shad-api"}
```

### 5. Access the Application

Open your browser to:

**Web UI**: http://localhost:3000

You should see the Shad Dashboard with:
- Vault status indicator (should show "Connected")
- Stats cards showing runs
- "New Run" button

### 6. Create Your First Run

**Via Web UI:**

1. Click "New Run" button
2. Enter a goal, for example:
   ```
   Summarize the key concepts in my notes about authentication
   ```
3. Select strategy (or leave as "Auto-detect")
4. Click "Create Run"
5. Watch progress in the dashboard

**Via API:**

```bash
curl -X POST http://localhost:8000/v1/run \
  -H "Content-Type: application/json" \
  -d '{
    "goal": "Summarize key authentication concepts in my vault",
    "strategy": "research"
  }'
```

Response:
```json
{
  "run_id": "abc123...",
  "status": "RUNNING",
  "goal": "Summarize key authentication concepts...",
  ...
}
```

### 7. View Results

**In Web UI:**
- Results appear automatically in the dashboard
- Click on a run card to expand details
- View result text, token usage, and node execution

**Via API:**
```bash
curl http://localhost:8000/v1/run/<run_id>
```

## Verify Everything Works

### Check Vault Connection

**Web UI**: Look for green dot next to "Vault Status: Connected"

**API**:
```bash
curl http://localhost:8000/v1/vault/status
```

Should return:
```json
{
  "connected": true,
  "vault_path": "/vault"
}
```

### Search Your Vault

```bash
curl "http://localhost:8000/v1/vault/search?query=authentication&limit=5"
```

Should return matching notes from your vault.

### Check Logs

If something isn't working:

```bash
# All services
docker-compose logs

# Just API
docker-compose logs api

# Follow logs in real-time
docker-compose logs -f api
```

## Common Issues

### "Vault not connected"

**Solution**:
1. Check `OBSIDIAN_VAULT_PATH` in `.env` is correct
2. Ensure path is absolute (not relative)
3. Restart services: `docker-compose restart api`

### "Service not initialized"

**Solution**:
1. Check API key is set in `.env`
2. Check logs: `docker-compose logs api`
3. Restart API: `docker-compose restart api`

### Port already in use

If ports 3000 or 8000 are already in use, edit `docker-compose.yml`:

```yaml
services:
  api:
    ports:
      - "8080:8000"  # Use 8080 instead of 8000

  frontend:
    ports:
      - "3001:3000"  # Use 3001 instead of 3000
```

Then update frontend environment:
```yaml
  frontend:
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8080
```

## Next Steps

- **Explore the API**: http://localhost:8000/docs
- **Try different strategies**: software, research, analysis
- **Customize budgets**: max_depth, max_tokens, etc.
- **Read full documentation**: [DOCKER.md](DOCKER.md)

## Useful Commands

```bash
# Stop services
docker-compose down

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose up -d --build

# Clear cache
docker-compose down
docker volume rm shad_redis-data
docker-compose up -d
```

## Support

For detailed documentation, see:
- [DOCKER.md](DOCKER.md) - Complete Docker guide
- [README.md](README.md) - Shad overview and features
- [SPEC.md](SPEC.md) - Technical specification

For issues, check logs first:
```bash
docker-compose logs api
```

## Success Checklist

- [ ] Services running (`docker-compose ps` shows all as "running")
- [ ] API health check passes
- [ ] Vault status shows "Connected"
- [ ] Can search vault successfully
- [ ] Created first run successfully
- [ ] Web UI accessible at http://localhost:3000

If all checked, you're ready to use Shad!
