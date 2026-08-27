# Payload CMS on EC2 with Docker + remote MongoDB — 0 → 1

**Target setup**

| Instance | Role | Docker services |
|---|---|---|
| EC2-APP (t3.small) | Payload CMS | `payload` (Next.js app), `caddy` (HTTPS reverse proxy) |
| EC2-DB (t3.micro) | Database | `mongo` |
| EC2-SPARE (t3.small) | Optional | Staging, or use it as a build box |

All three should be in the **same VPC** so the app can reach Mongo over the **private IP**.

---

## Phase 1 — Create your project (on your laptop)

### 1.1 Prerequisites
- Node.js 20+ and `pnpm` (`npm i -g pnpm`)
- Docker Desktop
- A GitHub account and a Docker Hub account (free)

### 1.2 Scaffold with create-payload-app (not `git clone`)

```bash
npx create-payload-app@latest
```

Wizard answers:
- Project name: `my-cms` (whatever you like)
- Template: **blank** (or `website` if you want a demo site)
- Database: **MongoDB**
- Connection string: `mongodb://127.0.0.1:27017/my-cms` (local dev only — you'll change it for prod)
- Package manager: pnpm

This generates a full Next.js + Payload project including a `Dockerfile` and `docker-compose.yml`.

### 1.3 Make it your own repo

```bash
cd my-cms
git init
git add .
git commit -m "Initial Payload project"
```

On GitHub, create an **empty** repo (no README), then:

```bash
git remote add origin git@github.com:YOUR_USER/my-cms.git
git branch -M main
git push -u origin main
```

### 1.4 Enable Next.js standalone output

Open `next.config.mjs` (or `.js`/`.ts`) and add `output: 'standalone'`:

```js
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig = {
  output: 'standalone',
}

export default withPayload(nextConfig)
```

### 1.5 Replace the Dockerfile

Overwrite the generated `Dockerfile` with this one (pinned pnpm, standalone build, non-root user, media dir permissions):

```dockerfile
# ---------- deps ----------
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable pnpm && corepack prepare pnpm@9 --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- builder ----------
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable pnpm && corepack prepare pnpm@9 --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Build needs a dummy DB URI/secret to compile; real values injected at runtime
ENV PAYLOAD_SECRET=build-placeholder
ENV DATABASE_URI=mongodb://127.0.0.1:27017/placeholder
RUN pnpm build

# ---------- runner ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs
RUN mkdir -p /app/media && chown nextjs:nodejs /app/media
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
```

> If you chose **npm** instead of pnpm, swap the `corepack`/`pnpm` lines for `COPY package*.json ./` + `RUN npm ci` and `RUN npm run build`.

Add a `.dockerignore`:

```
node_modules
.next
.git
.env
.env.*
media
```

### 1.6 Test the build locally

```bash
docker build -t YOUR_DOCKERHUB_USER/my-cms:latest .
```

If it builds, commit and push:

```bash
git add .
git commit -m "Docker: standalone build"
git push
```

---

## Phase 2 — AWS networking (Console)

### 2.1 Security group for EC2-DB (`sg-mongo`)

| Type | Port | Source |
|---|---|---|
| SSH | 22 | **Your IP only** |
| Custom TCP | 27017 | **`sg-app` (the app instance's security group ID)** |

Do **not** put `0.0.0.0/0` on 27017.

### 2.2 Security group for EC2-APP (`sg-app`)

| Type | Port | Source |
|---|---|---|
| SSH | 22 | Your IP only |
| HTTP | 80 | 0.0.0.0/0 |
| HTTPS | 443 | 0.0.0.0/0 |

### 2.3 Note the private IP of EC2-DB
EC2 console → EC2-DB → **Private IPv4 address**, e.g. `172.31.20.15`. You'll use this in `DATABASE_URI`.

### 2.4 (Recommended) Elastic IP for EC2-APP
Allocate an Elastic IP and associate it with EC2-APP so its public IP doesn't change on reboot. Point your domain's A record at it if you have one.

---

## Phase 3 — Base setup on BOTH instances

SSH in (Amazon Linux 2023 shown; Ubuntu commands in comments):

```bash
ssh -i your-key.pem ec2-user@PUBLIC_IP     # ubuntu@... on Ubuntu
```

### 3.1 Add swap (critical on 1–2 GB instances)

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
free -h   # confirm Swap: 2.0G
```

### 3.2 Install Docker + Compose plugin

**Amazon Linux 2023:**
```bash
sudo dnf update -y
sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user

# Compose plugin
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
```

**Ubuntu 22.04/24.04:**
```bash
sudo apt update && sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt update && sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker ubuntu
```

Log out and back in, then verify:
```bash
docker --version && docker compose version
```

---

## Phase 4 — EC2-DB: MongoDB in Docker

```bash
mkdir -p ~/mongo && cd ~/mongo
```

Create `.env`:
```bash
cat > .env <<'EOF'
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=CHANGE_ME_long_random_password
EOF
chmod 600 .env
```

Create `docker-compose.yml`:
```yaml
services:
  mongo:
    image: mongo:7
    container_name: mongo
    restart: unless-stopped
    ports:
      - "27017:27017"        # SG restricts this to sg-app only
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    volumes:
      - mongo_data:/data/db
    command: ["--wiredTigerCacheSizeGB", "0.25", "--bind_ip_all"]
    healthcheck:
      test: ["CMD", "mongosh", "--quiet", "--eval", "db.adminCommand('ping').ok"]
      interval: 30s
      timeout: 10s
      retries: 5

volumes:
  mongo_data:
```

> `--wiredTigerCacheSizeGB 0.25` keeps Mongo from eating the t3.micro's 1 GB.

Start it:
```bash
docker compose up -d
docker compose logs -f mongo    # Ctrl+C once you see "Waiting for connections"
```

Sanity check locally on EC2-DB:
```bash
docker exec -it mongo mongosh -u admin -p 'CHANGE_ME_long_random_password' --authenticationDatabase admin --eval "db.adminCommand('ping')"
```

---

## Phase 5 — EC2-APP: Payload in Docker

### 5.1 Verify EC2-APP can reach Mongo (private IP)

```bash
nc -zv 172.31.20.15 27017    # sudo dnf install -y nmap-ncat  (if nc missing)
```
Expect `Connection ... succeeded`. If it hangs, fix the security group (Phase 2.1).

### 5.2 Get the image onto EC2-APP

**Option A (recommended): build on laptop, push to Docker Hub**

On your laptop:
```bash
docker login
docker build -t YOUR_DOCKERHUB_USER/my-cms:latest .
docker push YOUR_DOCKERHUB_USER/my-cms:latest
```
(Mac M-series: add `--platform linux/amd64` to the build command.)

**Option B: build on EC2-APP** (slower, needs the swap from 3.1)

```bash
sudo dnf install -y git        # apt install -y git on Ubuntu
git clone https://github.com/YOUR_USER/my-cms.git ~/my-cms
```

### 5.3 App directory and env

```bash
mkdir -p ~/payload && cd ~/payload
```

`.env`:
```bash
cat > .env <<'EOF'
DATABASE_URI=mongodb://admin:CHANGE_ME_long_random_password@172.31.20.15:27017/my-cms?authSource=admin
PAYLOAD_SECRET=REPLACE_WITH_openssl_rand_hex_32
NEXT_PUBLIC_SERVER_URL=https://cms.yourdomain.com
DOMAIN=cms.yourdomain.com
EOF
chmod 600 .env
```

Generate a real secret:
```bash
openssl rand -hex 32
```

If you have **no domain yet**, use `http://YOUR_ELASTIC_IP` for `NEXT_PUBLIC_SERVER_URL` and set `DOMAIN=:80` (Caddy will serve plain HTTP).

> Special characters in the Mongo password (`@`, `:`, `/`, `?`, `#`) must be URL-encoded in `DATABASE_URI`. Easiest: use only letters/numbers in the password.

### 5.4 docker-compose.yml

```yaml
services:
  payload:
    image: YOUR_DOCKERHUB_USER/my-cms:latest   # Option A
    # build: /home/ec2-user/my-cms              # Option B (comment out `image:`)
    container_name: payload
    restart: unless-stopped
    env_file: .env
    volumes:
      - payload_media:/app/media
    expose:
      - "3000"
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 5
      start_period: 40s

  caddy:
    image: caddy:2
    container_name: caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    environment:
      DOMAIN: ${DOMAIN}
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - payload

volumes:
  payload_media:
  caddy_data:
  caddy_config:
```

`Caddyfile`:
```
{$DOMAIN} {
    reverse_proxy payload:3000
    encode gzip
}
```

Caddy auto-provisions Let's Encrypt certs when `DOMAIN` is a real hostname pointing at this IP.

### 5.5 Launch

```bash
docker compose pull          # Option A
# docker compose build       # Option B
docker compose up -d
docker compose logs -f payload
```

Open `https://cms.yourdomain.com/admin` (or `http://ELASTIC_IP/admin`) → create your first admin user.

---

## Phase 6 — Day-2 operations

### Deploy an update
```bash
# laptop
docker build -t YOUR_DOCKERHUB_USER/my-cms:latest . && docker push YOUR_DOCKERHUB_USER/my-cms:latest
# EC2-APP
cd ~/payload && docker compose pull && docker compose up -d
```

### Back up Mongo (run on EC2-DB)
```bash
docker exec mongo mongodump --archive --gzip -u admin -p 'PASSWORD' --authenticationDatabase admin > ~/backup-$(date +%F).gz
```
Consider a cron job that pushes these to S3 (`aws s3 cp`).

### Logs
```bash
docker compose logs -f payload
docker compose logs -f caddy
```

### Secure cookies
Once HTTPS works, in your auth-enabled collection (e.g. `Users`) set:
```ts
auth: { cookies: { secure: true, sameSite: 'Lax' } }
```

---

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| Build killed / `JavaScript heap out of memory` | No swap, or building on t3.micro. Add swap (3.1) or build on laptop (Option A). |
| `MongoServerSelectionError` / connect timeout | Security group on EC2-DB doesn't allow 27017 from `sg-app`, or you used the public IP instead of private. Test with `nc -zv`. |
| `Authentication failed` | Wrong user/pass, missing `?authSource=admin`, or special chars not URL-encoded. |
| Admin loads at `/admin` but assets 404 | `output: 'standalone'` missing, or `.next/static`/`public` not copied in Dockerfile. |
| Uploads disappear after redeploy | Media not on a volume. Confirm `payload_media:/app/media`. For real production, use the S3 storage plugin (`@payloadcms/storage-s3`). |
| `EACCES` writing to `/app/media` | Directory not owned by `nextjs` user. Check the `mkdir`/`chown` line in the runner stage. |
| Caddy can't get a cert | DNS A record not pointing at EC2-APP, or port 80/443 blocked in `sg-app`. |
| Mongo container restarts on t3.micro | Out of memory. Ensure swap + `--wiredTigerCacheSizeGB 0.25`. |

---

## Optional upgrades when you outgrow this
- **GitHub Actions** → build image on push, push to Docker Hub/ECR, SSH deploy to EC2-APP.
- **S3 for media** via `@payloadcms/storage-s3` (frees the app from disk state).
- **MongoDB Atlas free tier** instead of self-hosting on a t3.micro (managed backups, replica set).
- Use **EC2-SPARE** as a staging environment with the same compose files and a `staging.` subdomain.
