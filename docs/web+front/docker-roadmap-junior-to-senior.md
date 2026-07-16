# Docker — Junior to Senior Roadmap

A learning roadmap of **Docker** concepts, commands, and features organized by seniority level. Use this as a checklist — tick off items as you can use them confidently without looking up the syntax.

Related guides: [Docker Junior Guide](comprehensive-docker-guide-junior-developers.md)

---

## Table of Contents

- [How to use this roadmap](#how-to-use-this-roadmap)
- [Level 1 — Junior](#level-1--junior)
  - [Core concepts](#l1-core-concepts)
  - [Container lifecycle commands](#l1-container-lifecycle-commands)
  - [Image commands](#l1-image-commands)
  - [Dockerfile — basic instructions](#l1-dockerfile--basic-instructions)
  - [Port and volume basics](#l1-port-and-volume-basics)
  - [Inspecting containers](#l1-inspecting-containers)
  - [Docker Hub and registries](#l1-docker-hub-and-registries)
- [Level 2 — Mid-level](#level-2--mid-level)
  - [Dockerfile — intermediate instructions](#l2-dockerfile--intermediate-instructions)
  - [Multi-stage builds](#l2-multi-stage-builds)
  - [.dockerignore](#l2-dockerignore)
  - [Layer caching and build optimization](#l2-layer-caching-and-build-optimization)
  - [Named volumes and bind mounts](#l2-named-volumes-and-bind-mounts)
  - [Docker networks](#l2-docker-networks)
  - [Docker Compose — fundamentals](#l2-docker-compose--fundamentals)
  - [Docker Compose — service configuration](#l2-docker-compose--service-configuration)
  - [Resource limits](#l2-resource-limits)
  - [Environment and secrets basics](#l2-environment-and-secrets-basics)
  - [Image tagging strategies](#l2-image-tagging-strategies)
- [Level 3 — Senior](#level-3--senior)
  - [BuildKit and advanced build features](#l3-buildkit-and-advanced-build-features)
  - [Multi-platform builds](#l3-multi-platform-builds)
  - [Security hardening](#l3-security-hardening)
  - [Container scanning and image analysis](#l3-container-scanning-and-image-analysis)
  - [Docker Compose — advanced](#l3-docker-compose--advanced)
  - [Docker Swarm](#l3-docker-swarm)
  - [Overlay networks and service discovery](#l3-overlay-networks-and-service-discovery)
  - [Swarm secrets and configs](#l3-swarm-secrets-and-configs)
  - [Private registry management](#l3-private-registry-management)
  - [CI/CD integration patterns](#l3-cicd-integration-patterns)
  - [Performance tuning and production practices](#l3-performance-tuning-and-production-practices)
  - [Rootless Docker and OCI runtime](#l3-rootless-docker-and-oci-runtime)
- [Quick reference table](#quick-reference-table)

---

## How to use this roadmap

- Work through **Level 1** completely before moving to Level 2.
- Each entry shows: **what it does**, a **minimal example**, and a **gotcha** where relevant.
- Flags and options marked with `*` are the most commonly used in day-to-day work.
- Vendor-specific orchestration tooling (Kubernetes, ECS, Nomad) is explicitly excluded — see a separate roadmap for those.

---

## Level 1 — Junior

### L1 Core concepts

Vocabulary you must know before running a single command.

| Term | What it is |
|---|---|
| **Image** | Read-only template built from a Dockerfile. The blueprint for a container. |
| **Container** | A running (or stopped) instance of an image. An isolated process with its own filesystem, network, and PID space. |
| **Dockerfile** | A plain-text build recipe; Docker reads it top-to-bottom to create an image. |
| **Layer** | Each Dockerfile instruction that modifies the filesystem adds a new layer. Layers are cached and shared. |
| **Registry** | A server that stores and distributes images (e.g., Docker Hub, GHCR, ECR). |
| **Tag** | A human-readable label for a specific image version: `nginx:1.27`, `app:latest`. |
| **Docker daemon** | The background service (`dockerd`) that manages images, containers, volumes, and networks. |
| **Docker CLI** | The `docker` command you type — it talks to the daemon over a socket. |
| **Volume** | A storage area managed by Docker, survives container restarts and removal. |
| **Bind mount** | A host directory or file mounted directly into the container path. |

> **Gotcha:** An image and a container are not the same thing. You can run many containers from a single image, just like you can open many browser windows from one browser installation.

---

### L1 Container lifecycle commands

| Command | What it does |
|---|---|
| `docker run <image>` | Pull (if needed) + create + start a container. * |
| `docker run -d <image>` | Run in detached (background) mode. * |
| `docker run -it <image> bash` | Run interactively with a pseudo-TTY. * |
| `docker start <container>` | Start a stopped container. |
| `docker stop <container>` | Send SIGTERM (then SIGKILL after 10 s) to the main process. * |
| `docker kill <container>` | Send SIGKILL immediately. |
| `docker restart <container>` | Stop then start. |
| `docker rm <container>` | Remove a stopped container. * |
| `docker rm -f <container>` | Force-remove a running container. |
| `docker run --rm <image>` | Auto-remove the container when it exits. * |
| `docker ps` | List running containers. * |
| `docker ps -a` | List all containers (including stopped). * |

```bash
# run nginx in background, expose port 80
docker run -d --name web -p 8080:80 nginx

# stop and clean up
docker stop web && docker rm web
```

> **Gotcha:** `docker stop` gives the process 10 seconds to shut down gracefully. If your app ignores SIGTERM, it will be killed hard. Always handle SIGTERM in your code.

---

### L1 Image commands

| Command | What it does |
|---|---|
| `docker pull <image>` | Download an image from the registry. * |
| `docker push <image>` | Upload a tagged image to the registry. * |
| `docker images` | List locally available images. * |
| `docker rmi <image>` | Remove a local image. |
| `docker build -t <name>:<tag> .` | Build an image from the current directory's Dockerfile. * |
| `docker tag <src> <target>` | Create an alias tag pointing to the same image ID. |

```bash
docker build -t myapp:1.0 .
docker tag myapp:1.0 myrepo/myapp:1.0
docker push myrepo/myapp:1.0
```

---

### L1 Dockerfile — basic instructions

| Instruction | What it does |
|---|---|
| `FROM <image>` | Set the base image. Must be the first instruction. * |
| `RUN <command>` | Execute a shell command at build time and commit the result as a new layer. * |
| `COPY <src> <dest>` | Copy files from the build context into the image. * |
| `ADD <src> <dest>` | Like `COPY` but also unpacks local `.tar` archives and fetches remote URLs. |
| `WORKDIR <path>` | Set the working directory for subsequent instructions. * |
| `ENV <key>=<value>` | Set an environment variable available at build time and runtime. * |
| `EXPOSE <port>` | Document which port the container listens on (informational only). * |
| `CMD ["exec", "arg"]` | Default command to run when no command is specified at `docker run`. * |
| `ENTRYPOINT ["exec"]` | Executable that always runs; `CMD` provides default arguments to it. * |
| `USER <name>` | Switch to a non-root user for subsequent instructions and at runtime. |

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

> **Gotcha:** `CMD` is overridden completely if you pass a command to `docker run`. `ENTRYPOINT` is not — the passed command becomes its arguments. Use `ENTRYPOINT` for the executable, `CMD` for default flags.

> **Gotcha:** Prefer `COPY` over `ADD` unless you specifically need tar extraction or URL fetching. `ADD` has implicit behavior that surprises people.

---

### L1 Port and volume basics

| Flag | What it does |
|---|---|
| `-p <host>:<container>` | Map a host port to a container port. * |
| `-p 127.0.0.1:8080:80` | Bind only on localhost (safer for local dev). |
| `-v <host-path>:<container-path>` | Bind mount a host directory into the container. * |
| `-v <volume-name>:<container-path>` | Mount a named Docker volume. * |

```bash
# bind mount current directory for live-reload dev
docker run -v $(pwd):/app -p 3000:3000 myapp:dev

# named volume for database data
docker run -v pgdata:/var/lib/postgresql/data postgres:16
```

> **Gotcha:** Bind mounts reflect live changes from the host — great for development. Named volumes are managed by Docker and survive `docker rm` — use them for persistent data in production.

---

### L1 Inspecting containers

| Command | What it does |
|---|---|
| `docker logs <container>` | Print stdout/stderr of the container. * |
| `docker logs -f <container>` | Follow (tail) live output. * |
| `docker exec -it <container> bash` | Open an interactive shell inside a running container. * |
| `docker exec <container> <cmd>` | Run a one-off command inside a running container. |
| `docker inspect <container>` | Output full JSON metadata about a container. |

```bash
docker logs -f web
docker exec -it web sh    # use sh if bash is not installed
```

---

### L1 Docker Hub and registries

- **Docker Hub** — default public registry at `hub.docker.com`. Images are pulled from here unless you specify another registry host.
- **Official images** — curated by Docker: `nginx`, `postgres`, `node`, `python`. Prefer them as base images.
- **Versioned tags** — always pin a version: `node:20-alpine`, never `node:latest` in production.
- **Login** — `docker login` stores credentials in your OS keychain; `docker logout` removes them.

```bash
docker login
docker pull postgres:16-alpine
```

> **Gotcha:** `latest` is just a convention — it does not automatically track the newest version after you pull. Always use explicit version tags in production images.

---

## Level 2 — Mid-level

### L2 Dockerfile — intermediate instructions

| Instruction | What it does |
|---|---|
| `ARG <name>[=<default>]` | Build-time variable passed via `--build-arg`. Not available at runtime. |
| `HEALTHCHECK` | Define a command Docker runs to determine if the container is healthy. |
| `LABEL <key>=<value>` | Attach metadata (author, version, description) to an image. |
| `SHELL ["exec", "flag"]` | Override the default shell used by `RUN`. Useful on Windows images. |
| `STOPSIGNAL <signal>` | Override the signal sent by `docker stop` (default: SIGTERM). |
| `ONBUILD <instruction>` | Defer an instruction to run when this image is used as a base. |

```dockerfile
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

LABEL org.opencontainers.image.version="1.2.0"
```

> **Gotcha:** `ARG` values are visible in `docker history`. Never pass secrets as build args — they end up in the image metadata.

---

### L2 Multi-stage builds

Use multiple `FROM` statements to separate build-time tools from the final runtime image. The result is a smaller, cleaner production image.

```dockerfile
# Stage 1 — build
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 — runtime (only artifacts copied over)
FROM node:20-alpine AS runtime
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

```bash
# build only up to a specific stage (useful for CI caching)
docker build --target builder -t myapp:builder .
```

> **Gotcha:** Only files explicitly `COPY --from=<stage>` end up in the final image. Build tools, test dependencies, and source maps stay in the builder stage.

---

### L2 .dockerignore

A `.dockerignore` file excludes paths from the build context sent to the daemon. Keeps builds fast and avoids leaking local secrets.

```
node_modules
.git
.env
*.log
dist
coverage
```

> **Gotcha:** The entire build context directory is sent to the daemon before building. Without `.dockerignore`, a `node_modules` folder with 200 MB will be uploaded on every build.

---

### L2 Layer caching and build optimization

- **Order matters** — put instructions that change rarely (dependency install) before instructions that change often (source copy).
- **Combine `RUN` commands** with `&&` and `\` to reduce layer count.
- **Clean up in the same `RUN`** — a file deleted in a later layer is not actually removed from earlier layers.

```dockerfile
# Good: apt cache is cleaned in the same layer it was created
RUN apt-get update && apt-get install -y curl \
    && rm -rf /var/lib/apt/lists/*

# Bad: cache files are committed to a layer before deletion
RUN apt-get update && apt-get install -y curl
RUN rm -rf /var/lib/apt/lists/*
```

```bash
# rebuild without using any cached layers
docker build --no-cache -t myapp .
```

---

### L2 Named volumes and bind mounts

| Type | Created by | Managed by | Use case |
|---|---|---|---|
| **Named volume** | `docker volume create` or Compose | Docker | Persistent data (databases, uploads) |
| **Bind mount** | Host filesystem path | Host OS | Local dev, config files |
| **tmpfs mount** | In-memory | Kernel | Sensitive temp data that must not touch disk |

```bash
docker volume create pgdata
docker run -v pgdata:/var/lib/postgresql/data postgres:16

# tmpfs — data lost on container stop
docker run --tmpfs /tmp:rw,size=64m myapp
```

```bash
# inspect where a volume lives on the host
docker volume inspect pgdata
```

---

### L2 Docker networks

By default Docker creates three networks: `bridge`, `host`, and `none`.

| Network mode | What it does |
|---|---|
| `bridge` (default) | Containers on the same bridge can reach each other by IP; isolated from host network. |
| `host` | Container shares the host's network stack. No isolation. Linux only. |
| `none` | Container has no network interface at all. |
| **User-defined bridge** | Like `bridge` but containers can reach each other by **name** (built-in DNS). * |

```bash
# create a custom bridge
docker network create mynet

# attach containers to it
docker run -d --name api --network mynet myapp
docker run -d --name db  --network mynet postgres:16

# api can now connect to db using hostname "db"
```

> **Gotcha:** On the default `bridge` network, containers cannot resolve each other by name. Always create a user-defined bridge network for any multi-container setup.

---

### L2 Docker Compose — fundamentals

`docker compose` manages multi-container applications from a single `compose.yml` file.

| Command | What it does |
|---|---|
| `docker compose up` | Create and start all services. * |
| `docker compose up -d` | Start in detached mode. * |
| `docker compose down` | Stop and remove containers and networks. * |
| `docker compose down -v` | Also remove named volumes. |
| `docker compose logs -f` | Follow logs from all services. * |
| `docker compose ps` | List service containers and their status. * |
| `docker compose exec <svc> bash` | Shell into a running service container. * |
| `docker compose build` | Build (or rebuild) service images. |
| `docker compose pull` | Pull the latest images for all services. |
| `docker compose restart <svc>` | Restart a single service. |

---

### L2 Docker Compose — service configuration

```yaml
# compose.yml
services:
  api:
    build: .                        # build from local Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env                        # load variables from a file
    depends_on:
      db:
        condition: service_healthy  # wait until db passes its healthcheck
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: secret
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pgdata:
```

Key fields to know:

| Field | What it does |
|---|---|
| `build` | Path to build context or object with `context` / `dockerfile` keys. |
| `image` | Image to use instead of building. |
| `ports` | Host-to-container port mappings. |
| `volumes` | Volume or bind mount definitions. |
| `environment` / `env_file` | Inject environment variables. |
| `depends_on` | Declare service startup dependencies (with optional `condition`). |
| `restart` | Restart policy: `no`, `always`, `unless-stopped`, `on-failure`. |
| `networks` | Attach to specific named networks. |
| `healthcheck` | Override or define a container health check. |

---

### L2 Resource limits

| Flag | What it does |
|---|---|
| `--memory 512m` | Hard memory limit. Container is OOM-killed if exceeded. |
| `--memory-swap 1g` | Total memory + swap limit. |
| `--cpus 1.5` | Fractional CPU quota (1.5 = 150% of one core). |
| `--cpu-shares 512` | Relative CPU weight (default 1024) — only relevant under contention. |

```bash
docker run --memory 256m --cpus 0.5 myapp
```

In Compose:
```yaml
services:
  api:
    deploy:
      resources:
        limits:
          memory: 256m
          cpus: "0.5"
```

> **Gotcha:** Resource limits under `deploy` are only honoured when using `docker compose up` with the Compose v2 engine or Docker Swarm. In older tooling they were silently ignored.

---

### L2 Environment and secrets basics

| Method | Visible in `docker inspect`? | Visible in image? | Use case |
|---|---|---|---|
| `ENV` in Dockerfile | Yes | Yes | Non-sensitive defaults |
| `-e KEY=val` at run time | Yes | No | Dev overrides |
| `env_file` in Compose | Yes | No | Local dev config |
| `.env` file (Compose variable substitution) | No | No | Compose-level defaults |

> **Gotcha:** None of the methods above are truly secret — all are readable by anyone with `docker inspect` access or `exec` access. Use proper secret management (Docker Secrets, Vault, AWS Secrets Manager) for production credentials.

---

### L2 Image tagging strategies

| Strategy | Example | When to use |
|---|---|---|
| Semantic version | `myapp:1.4.2` | Libraries, stable releases |
| Branch + commit SHA | `myapp:main-a3f9c12` | CI/CD pipelines |
| Environment | `myapp:staging` | Environment promotion |
| `latest` | `myapp:latest` | Local dev only |

```bash
# tag with both version and latest, push both
docker build -t myapp:1.4.2 -t myapp:latest .
docker push myapp:1.4.2
docker push myapp:latest
```

---

## Level 3 — Senior

### L3 BuildKit and advanced build features

BuildKit is the modern Docker build backend (default since Docker 23). It enables parallel stage builds, better caching, and secret mounts.

```bash
# enable explicitly on older Docker
DOCKER_BUILDKIT=1 docker build .
```

| Feature | How to use it |
|---|---|
| **Cache mounts** | `RUN --mount=type=cache,target=/root/.npm npm ci` — cache package manager dirs across builds |
| **Secret mounts** | `RUN --mount=type=secret,id=npmrc cat /run/secrets/npmrc` — inject secrets at build time without committing them |
| **SSH agent forwarding** | `RUN --mount=type=ssh git clone git@github.com:org/private-repo.git` |
| **Inline cache** | `--cache-from` / `--cache-to` — push/pull layer cache from a registry for CI |
| **Build output** | `--output type=local,dest=./out` — export build artifacts to the host |

```dockerfile
# syntax=docker/dockerfile:1
FROM node:20-alpine
RUN --mount=type=cache,target=/root/.npm \
    npm ci --prefer-offline
```

```bash
docker build \
  --cache-from type=registry,ref=myrepo/myapp:buildcache \
  --cache-to   type=registry,ref=myrepo/myapp:buildcache,mode=max \
  -t myrepo/myapp:latest .
```

---

### L3 Multi-platform builds

`docker buildx` builds images for multiple CPU architectures from a single machine.

```bash
# create a builder that supports cross-compilation
docker buildx create --name multiarch --use
docker buildx inspect --bootstrap

# build and push for amd64 + arm64 simultaneously
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  --push \
  -t myrepo/myapp:latest .
```

> **Gotcha:** Multi-platform builds use QEMU emulation for foreign architectures. Native builds are always faster — use `--platform` in CI only, not on every local build.

---

### L3 Security hardening

| Practice | How |
|---|---|
| **Run as non-root** | Add `USER 1001` in Dockerfile; never run as `root` in production. |
| **Read-only filesystem** | `docker run --read-only` + explicit writable tmpfs for `/tmp`. |
| **Drop Linux capabilities** | `docker run --cap-drop ALL --cap-add NET_BIND_SERVICE` |
| **No new privileges** | `docker run --security-opt no-new-privileges` |
| **Minimal base images** | Prefer `alpine`, `distroless`, or `scratch` over `ubuntu`/`debian`. |
| **Pin digest, not tag** | `FROM node:20-alpine@sha256:abc123…` — immune to tag mutation. |
| **Seccomp profiles** | `--security-opt seccomp=profile.json` — whitelist allowed syscalls. |
| **AppArmor / SELinux** | Platform-level MAC enforcement on top of container isolation. |

```dockerfile
FROM node:20-alpine
# create a system user with no home directory and no shell
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser
```

```bash
docker run \
  --read-only \
  --tmpfs /tmp:rw,size=32m \
  --cap-drop ALL \
  --security-opt no-new-privileges \
  myapp
```

---

### L3 Container scanning and image analysis

| Tool | What it does |
|---|---|
| `docker scout cves <image>` | Show CVEs found in an image's packages (built into Docker Desktop). |
| `docker scout recommendations` | Suggest a safer/updated base image. |
| `docker history <image>` | Show all layers and the commands that created them. |
| `trivy image <image>` | Third-party vulnerability scanner (widely used in CI). |
| `dive <image>` | Interactive TUI to explore layers and wasted space. |

```bash
docker scout cves myapp:latest
docker history --no-trunc myapp:latest
```

> **Gotcha:** Vulnerability scanners report issues in OS packages and language libraries. An image with zero CVEs today may have CVEs tomorrow. Rebuild and rescan regularly — automate this in CI.

---

### L3 Docker Compose — advanced

| Feature | How |
|---|---|
| **Profiles** | Tag services with `profiles: [dev]` and activate with `--profile dev`. Keeps dev-only tools out of production. |
| **Extends** | Inherit config from another service or file: `extends: { file: base.yml, service: api }`. |
| **Multiple compose files** | `docker compose -f compose.yml -f compose.prod.yml up` — later file overrides earlier. |
| **Healthcheck-aware depends_on** | `condition: service_healthy` waits for the healthcheck to pass, not just container start. |
| **Scale** | `docker compose up --scale worker=4` runs four replicas of a service. |
| **Watch (live sync)** | `docker compose watch` syncs file changes into containers without a full rebuild. |

```yaml
services:
  mailhog:
    image: mailhog/mailhog
    profiles: [dev]       # only started with --profile dev

  api:
    extends:
      file: compose.base.yml
      service: api
    environment:
      - NODE_ENV=production
```

---

### L3 Docker Swarm

Docker Swarm turns a cluster of Docker hosts into a single virtual host. Less complex than Kubernetes; good for moderate-scale deployments.

| Concept | Description |
|---|---|
| **Manager node** | Schedules tasks, maintains cluster state, stores Raft log. |
| **Worker node** | Runs containers (tasks) assigned by managers. |
| **Service** | Desired state declaration: image, replicas, ports, update policy. |
| **Task** | A single container instance of a service. |
| **Stack** | Group of related services deployed together from a Compose file. |

```bash
# bootstrap a swarm on the first machine
docker swarm init --advertise-addr <manager-ip>

# join workers (use the token printed above)
docker swarm join --token <token> <manager-ip>:2377

# deploy a stack
docker stack deploy -c compose.yml myapp

# scale a service
docker service scale myapp_api=5

# rolling update with rollback on failure
docker service update \
  --image myapp:2.0 \
  --update-parallelism 2 \
  --update-delay 10s \
  --rollback-monitor 60s \
  myapp_api
```

---

### L3 Overlay networks and service discovery

Overlay networks span multiple Swarm nodes and enable containers on different hosts to communicate securely.

```bash
# create an overlay network accessible to all services
docker network create --driver overlay --attachable mynet

# services on the same overlay resolve each other by service name
# myapp_api can reach myapp_db at hostname "myapp_db"
```

| Feature | Details |
|---|---|
| **Built-in DNS** | Every service name resolves to a virtual IP (VIP) that load-balances across all tasks. |
| **Ingress network** | Special overlay that handles published ports across all nodes — any node forwards to the correct task. |
| **Encrypted overlay** | `--opt encrypted` enables IPSec encryption between nodes on the overlay. |

---

### L3 Swarm secrets and configs

Secrets and configs are stored encrypted in the Raft log and mounted as in-memory files inside containers — never as environment variables.

```bash
# create a secret from a file
echo "supersecretpassword" | docker secret create db_password -

# create a config from a file
docker config create nginx_conf ./nginx.conf

# reference in a service
docker service create \
  --secret db_password \
  --config source=nginx_conf,target=/etc/nginx/nginx.conf \
  myapp
```

Inside the container secrets are at `/run/secrets/<name>` (mode 0400, root-owned by default).

> **Gotcha:** Secrets are Swarm-only. If you are using plain `docker run` or `docker compose` without Swarm, use environment variables or external vaults instead.

---

### L3 Private registry management

| Task | How |
|---|---|
| **Run a local registry** | `docker run -d -p 5000:5000 registry:2` — push/pull `localhost:5000/myapp` |
| **Self-signed TLS** | Configure `insecure-registries` in `/etc/docker/daemon.json` for testing only. |
| **Auth to GHCR** | `docker login ghcr.io -u <github-user> -p <PAT>` |
| **AWS ECR** | `aws ecr get-login-password | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com` |
| **Registry mirrors** | Configure in `daemon.json` to cache Docker Hub pulls and avoid rate limits. |
| **Image promotion** | Pull from staging registry, retag, push to production registry — no rebuild. |

```json
// /etc/docker/daemon.json
{
  "registry-mirrors": ["https://my-mirror.example.com"],
  "insecure-registries": ["localhost:5000"]
}
```

---

### L3 CI/CD integration patterns

| Pattern | Description |
|---|---|
| **Build → scan → push** | Build image, run `trivy` or `docker scout`, push only if no critical CVEs. |
| **Registry cache** | Use `--cache-from` / `--cache-to` with a registry to speed up CI builds. |
| **Immutable tags** | Push `:main-<sha>` in CI; never push `:latest` from CI without also tagging a version. |
| **Matrix builds** | Build for multiple platforms or Node/Python versions in parallel CI jobs. |
| **Compose in CI** | `docker compose -f compose.yml -f compose.test.yml up --exit-code-from tests` — run integration tests against real services. |
| **SBOM generation** | `docker sbom myapp:latest` (or `syft`) — generate a software bill of materials for compliance. |

```yaml
# GitHub Actions example (simplified)
- name: Build and push
  uses: docker/build-push-action@v5
  with:
    platforms: linux/amd64,linux/arm64
    push: true
    tags: myrepo/myapp:${{ github.sha }}
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

---

### L3 Performance tuning and production practices

| Topic | Key points |
|---|---|
| **Image size** | Smaller images = faster pulls, smaller attack surface. Measure with `docker images`. Target < 200 MB for most apps. |
| **Startup time** | Use `ENTRYPOINT` + `exec` form so signals reach the process directly. Avoid shell wrappers. |
| **Log drivers** | Configure `--log-driver` (e.g., `json-file`, `awslogs`, `fluentd`) to avoid unbounded log growth on disk. |
| **Health checks** | Always define one in production — orchestrators use it to restart unhealthy tasks. |
| **Graceful shutdown** | Handle SIGTERM in app code; set `stop_grace_period` in Compose if your app needs more than 10 s. |
| **ulimits** | Set `--ulimit nofile=65536:65536` for apps that open many file descriptors (e.g., databases). |
| **Cleanup** | Run `docker system prune -f` in CI after builds; use `--volumes` flag to also remove dangling volumes. |

```bash
# show disk usage by Docker objects
docker system df

# prune everything not in use
docker system prune -a --volumes
```

---

### L3 Rootless Docker and OCI runtime

| Topic | What to know |
|---|---|
| **Rootless mode** | Run the Docker daemon as a non-root user. Eliminates privilege escalation via daemon compromise. `dockerd-rootless-setuptool.sh install` |
| **OCI spec** | Open Container Initiative defines the image format and runtime spec. Docker images are OCI-compliant. |
| **containerd** | The container runtime Docker delegates to under the hood. Can be used directly (e.g., by Kubernetes). |
| **runc** | Low-level OCI runtime that actually creates and runs containers (calls Linux kernel namespaces/cgroups). |
| **Alternative runtimes** | `gVisor` (user-space kernel, stronger isolation), `Kata Containers` (lightweight VMs). |

```bash
# check which runtime is in use
docker info | grep -i runtime

# run a container with gVisor (if installed)
docker run --runtime=runsc myapp
```

---

## Quick reference table

| Topic | Junior | Mid-level | Senior |
|---|---|---|---|
| Core concepts | Image, container, layer, volume | Named vs bind mounts, tmpfs | OCI spec, containerd, runc |
| CLI commands | run, stop, rm, ps, logs, exec | inspect, stats, system prune | buildx, scout, sbom |
| Dockerfile | FROM, RUN, COPY, CMD, ENTRYPOINT, EXPOSE, ENV, WORKDIR | ARG, HEALTHCHECK, multi-stage, .dockerignore | BuildKit cache/secret mounts, digest pinning |
| Networking | Port mapping (-p) | User-defined bridge, network create | Overlay, ingress, encrypted overlay |
| Volumes | -v flag | Named volumes, docker volume inspect | tmpfs, ulimits, volume drivers |
| Compose | up, down, logs | depends_on (healthy), env_file, restart | profiles, extends, watch, stack deploy |
| Security | Non-root user | --read-only, --cap-drop, no-new-privileges | Seccomp, AppArmor, rootless daemon, secret mounts |
| Registries | docker pull/push, Docker Hub | Tagging strategies, private registry login | ECR/GHCR auth, mirrors, image promotion |
| CI/CD | docker build in a pipeline | Layer caching via registry, scan before push | BuildKit GHA cache, matrix builds, SBOM |
| Orchestration | — | Resource limits, scaling with Compose | Docker Swarm, services, stacks, rolling updates |
| Observability | docker logs, docker ps | docker stats, health checks | Log drivers, system df/prune, image analysis |
