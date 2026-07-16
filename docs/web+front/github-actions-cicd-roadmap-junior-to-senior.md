# GitHub Actions CI/CD — Junior to Senior Roadmap

A learning roadmap of **GitHub Actions** concepts, syntax, and pipeline patterns organized by seniority level. Use this as a checklist — tick off items as you can use them confidently without looking up the syntax.

---

## Table of Contents

- [How to use this roadmap](#how-to-use-this-roadmap)
- [Level 1 — Junior](#level-1--junior)
  - [Core concepts](#l1-core-concepts)
  - [Workflow file structure](#l1-workflow-file-structure)
  - [Triggers](#l1-triggers)
  - [Jobs and steps basics](#l1-jobs-and-steps-basics)
  - [Using pre-built actions](#l1-using-pre-built-actions)
  - [Environment variables and secrets basics](#l1-environment-variables-and-secrets-basics)
  - [Reading run results in the GitHub UI](#l1-reading-run-results-in-the-github-ui)
- [Level 2 — Mid-level](#level-2--mid-level)
  - [Contexts and expressions](#l2-contexts-and-expressions)
  - [Conditional execution](#l2-conditional-execution)
  - [Job dependencies and ordering](#l2-job-dependencies-and-ordering)
  - [Matrix builds](#l2-matrix-builds)
  - [Caching dependencies](#l2-caching-dependencies)
  - [Artifacts](#l2-artifacts)
  - [Environments and deployment protection rules](#l2-environments-and-deployment-protection-rules)
  - [Reusable workflows](#l2-reusable-workflows)
  - [Composite actions](#l2-composite-actions)
  - [Status checks and branch protection](#l2-status-checks-and-branch-protection)
  - [Concurrency control](#l2-concurrency-control)
- [Level 3 — Senior](#level-3--senior)
  - [OIDC and keyless cloud authentication](#l3-oidc-and-keyless-cloud-authentication)
  - [Self-hosted runners](#l3-self-hosted-runners)
  - [Custom JavaScript and Docker actions](#l3-custom-javascript-and-docker-actions)
  - [Security hardening](#l3-security-hardening)
  - [Advanced caching strategies](#l3-advanced-caching-strategies)
  - [Workflow performance optimization](#l3-workflow-performance-optimization)
  - [Job summaries and annotations](#l3-job-summaries-and-annotations)
  - [Calling reusable workflows across repositories](#l3-calling-reusable-workflows-across-repositories)
  - [Enterprise and org-level features](#l3-enterprise-and-org-level-features)
  - [Testing and linting workflows](#l3-testing-and-linting-workflows)
  - [Release automation](#l3-release-automation)
- [Quick reference table](#quick-reference-table)

---

## How to use this roadmap

- Work through **Level 1** completely before moving to Level 2.
- Each entry shows: **what it does**, a **minimal example**, and a **gotcha** where relevant.
- Items marked with `*` are the most commonly encountered in day-to-day work.
- GitHub-hosted runner internals, GitHub Apps development, and Kubernetes-based runners (ARC) are out of scope — see separate resources for those.

---

## Level 1 — Junior

### L1 Core concepts

Vocabulary you must know before writing your first workflow.

| Term | What it is |
|---|---|
| **CI (Continuous Integration)** | Automatically build and test code on every push or pull request so bugs are caught early. |
| **CD (Continuous Delivery/Deployment)** | Automatically deliver or deploy a tested build to an environment after CI passes. |
| **Workflow** | A YAML file in `.github/workflows/` that defines when and what to run. A repo can have many workflows. |
| **Trigger (event)** | The GitHub event that starts a workflow run (push, pull_request, schedule, etc.). |
| **Job** | A group of steps that runs on the same runner machine. Jobs run in parallel by default. |
| **Step** | A single task within a job — either a shell command or an action. Steps run sequentially. |
| **Action** | A reusable unit of code (JavaScript, composite, or Docker) referenced by a step. |
| **Runner** | The virtual machine that executes a job. GitHub provides hosted runners (ubuntu, windows, macos). |
| **GITHUB_TOKEN** | An automatically-generated token scoped to the repository, available to every workflow run. |
| **Secret** | An encrypted value stored in GitHub settings and injected into the workflow at runtime. |
| **Artifact** | Files uploaded from a job so they can be downloaded later or shared between jobs. |
| **Environment** | A named deployment target (e.g. `staging`, `production`) that can have protection rules and secrets. |

> **Gotcha:** A workflow file must be committed to the default branch (or the branch being triggered) before GitHub picks it up. New workflow files in a feature branch only run when that branch is the trigger target.

---

### L1 Workflow file structure

Every workflow lives in `.github/workflows/<name>.yml`.

```yaml
name: CI                          # shown in the GitHub Actions tab

on:                               # trigger(s)
  push:
    branches: [main]

jobs:
  build:                          # job id (arbitrary key)
    runs-on: ubuntu-latest        # runner image *
    steps:
      - uses: actions/checkout@v4 # check out repo code *
      - run: echo "Hello, world!" # shell command *
```

| Key | What it does |
|---|---|
| `name` | Display name for the workflow in the GitHub UI. |
| `on` | One or more trigger events (see next section). |
| `jobs` | Map of job IDs to job definitions. |
| `runs-on` | Which runner image to use. `ubuntu-latest` is the most common. * |
| `steps` | Ordered list of `uses` (action) or `run` (shell) steps. * |

> **Gotcha:** YAML is indentation-sensitive. Use 2-space indentation consistently. Tabs will cause a parse error.

---

### L1 Triggers

The `on:` key controls when a workflow runs.

| Trigger | When it fires |
|---|---|
| `push` | Any push to the repository (or specific branches/tags). * |
| `pull_request` | When a PR is opened, synchronized, or reopened. * |
| `workflow_dispatch` | Manual trigger from the GitHub UI or API. * |
| `schedule` | Cron-based schedule (e.g. nightly builds). |
| `release` | When a GitHub release is published/created. |
| `workflow_call` | When called by another workflow (makes this workflow reusable). |

```yaml
on:
  push:
    branches: [main, develop]    # only these branches *
    paths-ignore:                 # skip if only docs changed
      - 'docs/**'
  pull_request:
    branches: [main]
  workflow_dispatch:              # adds a "Run workflow" button in the UI *
  schedule:
    - cron: '0 2 * * 1'          # every Monday at 02:00 UTC
```

> **Gotcha:** `pull_request` from a fork runs with read-only `GITHUB_TOKEN` and no access to secrets. Use `pull_request_target` only when you fully understand the security implications — it runs in the context of the base branch and has secret access.

---

### L1 Jobs and steps basics

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install dependencies   # optional human-readable label *
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Multi-line shell script
        run: |
          echo "Step 1"
          echo "Step 2"
          ls -la
```

| Concept | Notes |
|---|---|
| `uses: owner/repo@ref` | Reference an action from GitHub Marketplace or any repo. Always pin to a version tag or SHA. * |
| `run: <command>` | Execute a shell command (bash on Linux/macOS, PowerShell on Windows). * |
| `name:` | Label shown in the run log. Not required but strongly recommended. |
| `with:` | Pass inputs to an action (key-value map). |
| `env:` | Set environment variables scoped to that step. |
| `id:` | Assign an ID to a step so later steps can reference its outputs. |

> **Gotcha:** Each `run:` step starts a new shell process. Variables set with `export` in one `run:` step are **not** available in the next. Use `$GITHUB_ENV` to persist values across steps (covered in Level 2).

---

### L1 Using pre-built actions

The most commonly used official actions.

| Action | What it does |
|---|---|
| `actions/checkout@v4` | Clone the repository into the runner workspace. Almost always the first step. * |
| `actions/setup-node@v4` | Install a specific Node.js version and configure npm cache. * |
| `actions/setup-python@v5` | Install a Python version. * |
| `actions/setup-java@v4` | Install a JDK version. |
| `actions/cache@v4` | Manually cache and restore arbitrary directories. * |
| `actions/upload-artifact@v4` | Upload files so they appear on the run summary page. * |
| `actions/download-artifact@v4` | Download files uploaded by another job or run. * |

```yaml
steps:
  - uses: actions/checkout@v4

  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'              # automatically caches node_modules

  - run: npm ci
  - run: npm test
```

> **Gotcha:** Always pin actions to a specific version tag (`@v4`) or a full commit SHA. Pinning to `@main` or a branch means the action author can silently change what code runs in your pipeline.

---

### L1 Environment variables and secrets basics

```yaml
env:
  NODE_ENV: production           # workflow-level env var (available to all jobs)

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      APP_NAME: my-app           # job-level env var
    steps:
      - name: Use a secret
        env:
          API_KEY: ${{ secrets.MY_API_KEY }}   # step-level, from repo secrets *
        run: curl -H "Authorization: $API_KEY" https://api.example.com
```

| Concept | Notes |
|---|---|
| `env:` at workflow level | Available to all jobs in the file. |
| `env:` at job level | Available to all steps in that job. |
| `env:` at step level | Available only within that step. |
| `secrets.<NAME>` | Encrypted value configured in repo / org / environment settings. Never printed in logs. * |
| `vars.<NAME>` | Unencrypted configuration variable (GitHub Actions variables, not secrets). |

> **Gotcha:** Secrets are masked in logs but only as exact string matches. If you base64-encode a secret and print it, it will appear unmasked. Never log secrets deliberately.

---

### L1 Reading run results in the GitHub UI

Know what each UI element tells you before debugging blindly.

| UI element | What to look for |
|---|---|
| **Actions tab** | List of all workflow runs. Green = pass, red = fail, yellow = in progress. |
| **Run summary** | Overview of all jobs, their statuses, and linked artifacts. |
| **Job log** | Per-step expandable output. Red step = the failure point. |
| **Annotations** | Inline error/warning markers on the Files Changed tab of a PR. |
| **Re-run** button | Re-run failed jobs without re-running passed ones (available since 2022). |

> **Tip:** Clicking a red step expands its log. The last few lines usually contain the actual error. Scroll up only if the error references a file or a previous command.

---

## Level 2 — Mid-level

### L2 Contexts and expressions

Contexts give you access to metadata about the run, the repo, the triggering event, and more.

| Context | Common properties |
|---|---|
| `github` | `.ref`, `.sha`, `.actor`, `.event_name`, `.repository`, `.run_id` |
| `env` | Any env var set at workflow/job/step level |
| `secrets` | Encrypted secrets by name |
| `vars` | Unencrypted configuration variables |
| `runner` | `.os`, `.arch`, `.temp`, `.tool_cache` |
| `job` | `.status` (inside `if:` conditions on steps) |
| `steps.<id>` | `.outputs.<key>`, `.conclusion`, `.outcome` |
| `matrix` | The current matrix combination values |

```yaml
steps:
  - name: Print branch name
    run: echo "Running on ${{ github.ref_name }}"

  - name: Set an output
    id: version
    run: echo "tag=1.2.3" >> $GITHUB_OUTPUT      # write to output file *

  - name: Use the output
    run: echo "Version is ${{ steps.version.outputs.tag }}"
```

> **Gotcha:** Before GitHub Actions added `$GITHUB_OUTPUT`, outputs were written with `::set-output name=...`. That syntax is deprecated — always use `>> $GITHUB_OUTPUT`.

---

### L2 Conditional execution

Use `if:` to skip steps or entire jobs based on runtime conditions.

```yaml
steps:
  - name: Only on main
    if: github.ref == 'refs/heads/main'
    run: ./deploy.sh

  - name: Only on failure
    if: failure()                              # status check function *
    run: ./notify-failure.sh

  - name: Only if previous step succeeded
    if: steps.build.outcome == 'success'
    run: ./run-smoke-tests.sh
```

| Status function | Meaning |
|---|---|
| `success()` | All previous steps passed (default when no `if:` is set). |
| `failure()` | At least one previous step failed. * |
| `cancelled()` | The workflow was cancelled. |
| `always()` | Run regardless of previous step status. * |

> **Gotcha:** `if: failure()` on a step only runs if a prior step in the **same job** failed. To react to a failure in a different job, use `needs.<job>.result == 'failure'` in the dependent job's `if:`.

---

### L2 Job dependencies and ordering

By default, jobs run in parallel. Use `needs:` to sequence them.

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: npm test

  build:
    runs-on: ubuntu-latest
    needs: test                      # waits for test to pass *
    steps:
      - run: npm run build

  deploy:
    runs-on: ubuntu-latest
    needs: [test, build]             # waits for both *
    if: github.ref == 'refs/heads/main'
    steps:
      - run: ./deploy.sh
```

Passing data between jobs via outputs:

```yaml
jobs:
  prepare:
    runs-on: ubuntu-latest
    outputs:
      version: ${{ steps.ver.outputs.tag }}
    steps:
      - id: ver
        run: echo "tag=$(git describe --tags)" >> $GITHUB_OUTPUT

  publish:
    needs: prepare
    runs-on: ubuntu-latest
    steps:
      - run: echo "Publishing ${{ needs.prepare.outputs.version }}"
```

> **Gotcha:** Job outputs only transfer string values. To pass structured data between jobs, upload an artifact and download it in the next job.

---

### L2 Matrix builds

Run the same job across multiple configurations (OS, language version, etc.).

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20, 22]
      fail-fast: false             # don't cancel others when one fails *
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
      - run: npm test
```

Excluding and including specific combinations:

```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest]
    node: [18, 20]
    exclude:
      - os: windows-latest
        node: 18
    include:
      - os: ubuntu-latest
        node: 20
        experimental: true
```

> **Gotcha:** Matrix jobs multiply quickly — 3 OS × 3 versions = 9 parallel jobs. GitHub-hosted runners have concurrency limits per plan. Use `max-parallel:` to throttle if needed.

---

### L2 Caching dependencies

Caching avoids re-downloading dependencies on every run.

```yaml
- uses: actions/cache@v4
  with:
    path: ~/.npm                          # directory to cache *
    key: ${{ runner.os }}-npm-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |                       # fallback keys if exact match misses *
      ${{ runner.os }}-npm-
```

| Field | Purpose |
|---|---|
| `path` | Directory (or list of directories) to save/restore. |
| `key` | Unique cache identifier. Cache is saved under this key when the job finishes. |
| `restore-keys` | Ordered list of prefix keys to fall back to on a cache miss. |

Many `setup-*` actions have a built-in `cache:` input that wraps `actions/cache` for you:

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'                  # or 'yarn', 'pnpm'
```

> **Gotcha:** Cache is keyed by branch by default. A cache saved on a feature branch is not reachable from `main` unless `restore-keys` includes a shared prefix. Always add a cross-branch fallback key.

---

### L2 Artifacts

Artifacts let you persist files from a job (build output, test reports, coverage, etc.).

```yaml
- name: Build
  run: npm run build

- uses: actions/upload-artifact@v4
  with:
    name: dist-files               # artifact display name *
    path: dist/                    # path to upload *
    retention-days: 7              # default is 90
```

Downloading in a later job:

```yaml
- uses: actions/download-artifact@v4
  with:
    name: dist-files
    path: dist/
```

> **Gotcha:** Artifacts are scoped to the **workflow run**. You cannot download an artifact from a different run with `actions/download-artifact` — use the REST API for cross-run access.

---

### L2 Environments and deployment protection rules

Environments let you require manual approval, limit which branches can deploy, and store secrets that are only accessible during a deployment to that environment.

```yaml
jobs:
  deploy-prod:
    runs-on: ubuntu-latest
    environment: production         # links this job to the "production" environment *
    steps:
      - run: ./deploy.sh
        env:
          PROD_TOKEN: ${{ secrets.PROD_TOKEN }}
```

Configure in **Settings → Environments**:

| Feature | What it does |
|---|---|
| **Required reviewers** | Pause the deployment job and wait for manual approval. * |
| **Wait timer** | Delay the job N minutes after the trigger. |
| **Deployment branches** | Restrict which branches/tags can deploy to this environment. * |
| **Environment secrets** | Secrets only available when the job targets this environment. |
| **Environment variables** | Unencrypted config values scoped to the environment. |

> **Gotcha:** Environment secrets override repository secrets with the same name. If a deploy is failing due to an unexpected value, check whether an environment secret is shadowing the repo-level one.

---

### L2 Reusable workflows

Extract a full workflow into a separate file and call it from other workflows.

**Called workflow** (`.github/workflows/deploy.yml`):

```yaml
on:
  workflow_call:                    # makes this workflow callable *
    inputs:
      environment:
        required: true
        type: string
    secrets:
      DEPLOY_TOKEN:
        required: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - run: ./deploy.sh ${{ inputs.environment }}
        env:
          TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

**Caller workflow**:

```yaml
jobs:
  call-deploy:
    uses: ./.github/workflows/deploy.yml    # local reusable workflow *
    with:
      environment: staging
    secrets:
      DEPLOY_TOKEN: ${{ secrets.STAGING_TOKEN }}
```

> **Gotcha:** A reusable workflow runs as its own job — it cannot share environment variables or artifacts with the calling job directly. Pass data through `inputs` and `outputs`.

---

### L2 Composite actions

Bundle multiple steps into a reusable action without writing JavaScript.

**`.github/actions/setup-app/action.yml`**:

```yaml
name: Setup App
description: Install dependencies and cache
inputs:
  node-version:
    description: Node.js version
    default: '20'
runs:
  using: composite
  steps:
    - uses: actions/setup-node@v4
      with:
        node-version: ${{ inputs.node-version }}
        cache: npm
    - run: npm ci
      shell: bash                   # required for composite actions *
```

**Usage**:

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: ./.github/actions/setup-app
    with:
      node-version: '20'
```

> **Gotcha:** Every `run:` step inside a composite action **must** declare `shell:`. The default shell is not inherited from the calling workflow.

---

### L2 Status checks and branch protection

Configure in **Settings → Branches → Branch protection rules**.

| Setting | Purpose |
|---|---|
| **Require status checks to pass** | Block merges until specific workflow jobs complete successfully. * |
| **Require branches to be up to date** | Force the PR branch to be rebased/merged with base before the check counts. |
| **Require pull request reviews** | Mandate approvals; separate from CI but commonly combined. |

Best practice: name your required status checks after the job ID, not the workflow name (e.g. `test` not `CI`). Job names are more stable when you rename the workflow.

> **Gotcha:** Adding a new required status check to branch protection blocks all open PRs that haven't run the new workflow yet. Merge a workflow-only PR to the base branch first so existing PRs can pick it up.

---

### L2 Concurrency control

Prevent multiple deployments from running at the same time.

```yaml
concurrency:
  group: deploy-${{ github.ref }}   # one active run per branch *
  cancel-in-progress: true          # cancel the older run *
```

Place `concurrency` at the workflow level or job level:

```yaml
jobs:
  deploy:
    concurrency:
      group: production-deploy
      cancel-in-progress: false     # queue instead of cancel for deployments
```

> **Gotcha:** `cancel-in-progress: true` is great for CI builds (cancel stale builds on a feature branch) but dangerous for deployments (partial deploys can leave the system in a broken state). Use `false` or omit for deployment jobs.

---

## Level 3 — Senior

### L3 OIDC and keyless cloud authentication

OpenID Connect (OIDC) lets GitHub Actions request short-lived credentials from cloud providers without storing long-lived secrets.

**How it works:** GitHub's OIDC provider issues a JWT to the running workflow. The cloud provider (AWS, GCP, Azure) exchanges it for short-lived credentials if the trust policy matches.

**AWS example:**

```yaml
permissions:
  id-token: write     # required for OIDC *
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/GitHubActionsRole
          aws-region: us-east-1

      - run: aws s3 sync dist/ s3://my-bucket
```

| Provider | Action |
|---|---|
| AWS | `aws-actions/configure-aws-credentials` |
| GCP | `google-github-actions/auth` |
| Azure | `azure/login` |
| Vault | `hashicorp/vault-action` |

> **Gotcha:** The `permissions: id-token: write` block must appear at the workflow or job level — not just as a step input. Forgetting it produces a 403 when requesting the OIDC token.

---

### L3 Self-hosted runners

Host your own machines to get faster builds, access to private networks, or custom hardware.

```yaml
jobs:
  build:
    runs-on: self-hosted             # basic label *
    # or use custom labels:
    runs-on: [self-hosted, linux, x64, gpu]
```

| Runner registration scope | Where configured |
|---|---|
| Repository | Settings → Actions → Runners |
| Organization | Org Settings → Actions → Runners |
| Enterprise | Enterprise Settings → Runners |

**Ephemeral runners** (recommended for security):

```yaml
# Register with --ephemeral flag — runner exits after one job
./config.sh --url https://github.com/org/repo --token TOKEN --ephemeral
```

| Concern | Recommendation |
|---|---|
| Isolation | Use ephemeral runners (one job per VM/container). Never share a runner across untrusted PRs. |
| Network | Place runners in a private subnet; open only outbound HTTPS to github.com. |
| Credentials | Grant only the permissions the runner needs; rotate regularly. |
| Updates | Enable auto-update or pin to a runner version and update on a schedule. |

> **Gotcha:** A persistent (non-ephemeral) self-hosted runner reuses its workspace between runs. Leftover files from a previous run can pollute the next build. Always add a `git clean -fdx` step or use ephemeral runners.

---

### L3 Custom JavaScript and Docker actions

Build your own actions when no existing action fits the need.

**JavaScript action structure:**

```
.github/actions/my-action/
  action.yml        # metadata
  index.js          # entry point
  node_modules/     # bundled or installed
```

`action.yml`:

```yaml
name: My Action
description: Does something custom
inputs:
  message:
    required: true
outputs:
  result:
    description: The computed result
runs:
  using: node20         # or node18
  main: index.js
```

`index.js`:

```javascript
const core = require('@actions/core');

const message = core.getInput('message');
core.info(`Processing: ${message}`);
core.setOutput('result', message.toUpperCase());
```

**Docker action** — useful when you need a specific runtime or binary:

```yaml
runs:
  using: docker
  image: Dockerfile    # or a public image: docker://alpine:3.19
  args:
    - ${{ inputs.message }}
```

> **Gotcha:** JavaScript actions require bundling dependencies (`@vercel/ncc` is the standard tool). Do not `.gitignore` the `node_modules/` or `dist/` folder inside the action directory — GitHub executes them directly without running `npm install`.

---

### L3 Security hardening

| Practice | How |
|---|---|
| **Pin actions to commit SHA** | `uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683` — immune to tag mutation. * |
| **Minimal GITHUB_TOKEN permissions** | Set `permissions:` at the top of every workflow and grant only what each job needs. * |
| **No `pull_request_target` with untrusted code** | Never check out PR code and run it in a `pull_request_target` workflow without sandboxing. |
| **Secret scanning** | Enable GitHub Secret Scanning and push protection in repo settings. |
| **Dependabot for actions** | Add `package-ecosystem: github-actions` to `.github/dependabot.yml` to auto-update action versions. * |
| **Restrict who can approve workflows** | In org settings, require approval before first-time contributors' workflows run. |
| **Audit log** | Review the org audit log for unexpected workflow runs or secret access. |

Minimal permissions example:

```yaml
permissions: {}          # deny all at workflow level

jobs:
  test:
    permissions:
      contents: read     # only grant what this job needs
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test
```

> **Gotcha:** The default `GITHUB_TOKEN` permissions differ between organizations. Some orgs default to `read-all`, others to `write-all`. Explicitly declaring `permissions:` makes the workflow portable and auditable regardless of org defaults.

---

### L3 Advanced caching strategies

Beyond basic dependency caching.

**Save cache only on the default branch** to avoid polluting the cache with branch-specific state:

```yaml
- uses: actions/cache@v4
  with:
    path: .cache
    key: ${{ runner.os }}-build-${{ hashFiles('src/**') }}
    restore-keys: ${{ runner.os }}-build-
  # restore from any branch, but only save from main
- name: Save cache (main only)
  if: github.ref == 'refs/heads/main'
  uses: actions/cache/save@v4
  with:
    path: .cache
    key: ${{ runner.os }}-build-${{ hashFiles('src/**') }}
```

Use `actions/cache/restore` and `actions/cache/save` (separate actions) for fine-grained control.

**Cache eviction:** Caches that haven't been accessed in 7 days are evicted. Total cache storage is capped per repo (10 GB by default). When the limit is hit, the oldest caches are pruned.

> **Gotcha:** Cache keys are immutable — once saved under a key, the cache cannot be updated. Change the key (e.g. by bumping a version suffix) to force a fresh cache on the next run.

---

### L3 Workflow performance optimization

| Technique | Impact |
|---|---|
| **Use `actions/cache`** | Avoid re-downloading dependencies on every run. High impact. * |
| **Skip unchanged paths** | Use `paths:` and `paths-ignore:` on triggers to avoid running on irrelevant changes. * |
| **`fail-fast: false` on matrix** | Prevent a single failing combination from cancelling all others (useful for flaky tests). |
| **Parallelise independent jobs** | Split lint, test, type-check into separate jobs so they run concurrently. |
| **Use smaller runner images** | `ubuntu-latest` is large; custom minimal images start faster. |
| **Shallow clone** | `actions/checkout@v4` with `fetch-depth: 1` (default) — only deepen when you need full history. |
| **Conditional job execution** | Use `if:` to skip deploy jobs on non-main branches instead of running and doing nothing. |
| **Reduce step count** | Consolidate small shell commands into one `run:` block to reduce step overhead. |

```yaml
- uses: actions/checkout@v4
  with:
    fetch-depth: 0           # full history — only needed for git log / versioning tools
```

---

### L3 Job summaries and annotations

**Job summaries** — write Markdown to the run summary page:

```bash
echo "## Test Results" >> $GITHUB_STEP_SUMMARY
echo "| Suite | Status |" >> $GITHUB_STEP_SUMMARY
echo "|---|---|" >> $GITHUB_STEP_SUMMARY
echo "| unit | ✅ passed |" >> $GITHUB_STEP_SUMMARY
```

**Annotations** — surface errors/warnings inline on the PR diff:

```bash
# syntax: ::notice|warning|error file=...,line=...,col=...::message
echo "::error file=src/index.ts,line=42::Null pointer dereference"
echo "::warning file=src/utils.ts,line=10::Deprecated API"
```

Annotations from test frameworks (Jest, ESLint, etc.) are automatically produced by many Marketplace actions (e.g., `dorny/test-reporter`).

**Masking values at runtime:**

```bash
echo "::add-mask::$MY_DYNAMIC_SECRET"
echo "$MY_DYNAMIC_SECRET"    # prints *** in the log
```

---

### L3 Calling reusable workflows across repositories

Reusable workflows can live in a central repository and be called by any repo in the org.

```yaml
jobs:
  deploy:
    uses: my-org/devops/.github/workflows/deploy.yml@main   # cross-repo call *
    with:
      environment: production
    secrets: inherit   # pass all secrets from the caller to the callee *
```

| Feature | Notes |
|---|---|
| `secrets: inherit` | Forwards all secrets from the caller to the callee. Simpler but less explicit than listing each secret. |
| Versioning | Pin to a tag or SHA (`@v2`) to avoid callers silently picking up breaking changes. |
| Outputs | Callee can declare `outputs` under `workflow_call`; caller references them via `needs.<job>.outputs`. |

> **Gotcha:** Cross-repo reusable workflows require that the called repository's visibility matches or that the org has allowed cross-repo workflow sharing. Check org settings under Actions → General → Access.

---

### L3 Enterprise and org-level features

| Feature | Purpose |
|---|---|
| **Required workflows** | Org admins can mandate specific workflows run on all repos in the org (cannot be bypassed). |
| **Org-level secrets** | Secrets available to all repos in the org without per-repo configuration. * |
| **Org-level variables** | Unencrypted config values shared across repos. |
| **Runner groups** | Control which repos can access which self-hosted runner pools. |
| **Audit log streaming** | Stream workflow run events and secret access to a SIEM. |
| **IP allowlists** | Restrict runner egress to approved IP ranges. |
| **Larger hosted runners** | GitHub-hosted runners with more CPU/RAM (paid feature). |

`.github/dependabot.yml` — keep actions up to date automatically:

```yaml
version: 2
updates:
  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
    groups:
      actions:
        patterns: ['*']
```

---

### L3 Testing and linting workflows

Treat workflow files as code — validate and test them.

| Tool | Purpose |
|---|---|
| **`actionlint`** | Static analysis for workflow YAML — catches type errors, undefined contexts, and bad syntax. * |
| **`zizmor`** | Security-focused linter for GitHub Actions workflows. |
| **`act`** | Run workflows locally using Docker to simulate the GitHub runner environment. |
| **`nektos/act`** | CLI tool wrapping `act` — useful for rapid local iteration. |

Add `actionlint` to CI:

```yaml
- name: Lint workflows
  uses: rhysd/actionlint@v1
```

Run `act` locally:

```bash
# run the push event
act push

# run a specific job
act -j test

# pass secrets from a local file
act --secret-file .env.secrets
```

> **Gotcha:** `act` simulates GitHub Actions but does not perfectly replicate the hosted runner environment. OIDC, environment protection rules, and some GitHub API interactions will not work locally.

---

### L3 Release automation

Automate versioning, changelogs, and publishing.

**Semantic versioning with `semantic-release`:**

```yaml
name: Release
on:
  push:
    branches: [main]
permissions:
  contents: write
  id-token: write
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
          persist-credentials: false
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npx semantic-release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**Release on tag push:**

```yaml
on:
  push:
    tags:
      - 'v[0-9]+.[0-9]+.[0-9]+'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v2
        with:
          generate_release_notes: true
```

> **Gotcha:** `semantic-release` needs full Git history (`fetch-depth: 0`) to determine the next version from conventional commit messages. A shallow clone will produce incorrect version bumps.

---

## Quick reference table

| Feature | Level | Key syntax / action |
|---|---|---|
| Basic workflow | Junior | `on:` / `jobs:` / `steps:` |
| Manual trigger | Junior | `on: workflow_dispatch` |
| Checkout code | Junior | `actions/checkout@v4` |
| Use a secret | Junior | `${{ secrets.NAME }}` |
| Conditional step | Mid | `if: github.ref == 'refs/heads/main'` |
| Job ordering | Mid | `needs: [job1, job2]` |
| Matrix builds | Mid | `strategy: matrix:` |
| Cache deps | Mid | `actions/cache@v4` |
| Upload artifact | Mid | `actions/upload-artifact@v4` |
| Reusable workflow | Mid | `on: workflow_call` / `uses: ./...` |
| Composite action | Mid | `runs: using: composite` |
| Concurrency | Mid | `concurrency: group: ... cancel-in-progress:` |
| OIDC auth | Senior | `permissions: id-token: write` |
| Self-hosted runner | Senior | `runs-on: self-hosted` |
| Pin to SHA | Senior | `uses: owner/action@<sha>` |
| Minimal permissions | Senior | `permissions: contents: read` |
| Job summary | Senior | `>> $GITHUB_STEP_SUMMARY` |
| Cross-repo workflow | Senior | `uses: org/repo/.github/workflows/x.yml@v1` |
| Lint workflows | Senior | `actionlint` / `zizmor` |
| Release automation | Senior | `semantic-release` / `softprops/action-gh-release` |
